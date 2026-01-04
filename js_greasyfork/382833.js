// ==UserScript==
// @name         Wikipedia Dark Theme
// @description  Script gives Wikipedia pages a dark color theme
// @author       Shangru Li
// @version      1.63
// @match        *://*.wikipedia.org/*
// @match        *://*.mediawiki.org/*
// @match        *://*.wikimedia.org/*
// @match        *://*.wikibooks.org/*
// @match        *://*.wikidata.org/*
// @match        *://*.wikinews.org/*
// @match        *://*.wikiquote.org/*
// @match        *://*.wikisource.org/*
// @match        *://*.wikiversity.org/*
// @match        *://*.wikivoyage.org/*
// @match        *://*.wiktionary.org/*
// @namespace    https://github.com/li-shangru/WikipediaDarkTheme
// @icon         https://en.wikipedia.org/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// ######################___Localizations___#####################################
// @name:ja             Wikipediaダークテーマ
// @description:ja      Wikipediaのサイトのバックグラウンドを黒に変更するスクリプトです
// @name:zh-CN          维基百科黑色主题
// @description:zh-CN   给予维基百科网页一个黑色主题
// @name:zh-TW          维基百科黑色主题
// @description:zh-TW   給予維基百科網頁壹個黑色主題
// @downloadURL https://update.greasyfork.org/scripts/382833/Wikipedia%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/382833/Wikipedia%20Dark%20Theme.meta.js
// ==/UserScript==

'use strict';

//############################################___Default_Values___######################################################
const DEFAULT_RELATIVE_LUMINANCE = 0.8;
const DEFAULT_FOREGROUND_COLOR = "rgb(238, 255, 255)";
const DEFAULT_BACKGROUND_COLOR = "rgb(30, 30, 30)";
const DEFAULT_LINK_COLOR = "rgb(249, 186, 82)";
//############################################___One_Could_Alter_If_Desired___##########################################

//############################################___Global_Variables___####################################################

const LOCALE = window.location.href.substring(0, window.location.href.indexOf(".wiki")).slice(-2);

// list of tags of the wikipedia logos and symbols to be excluded from setting backgroundColor to white
const EXCLUDE_SRC_TAG = [
  "protection-shackle", "green_check", "symbol_support_vote",
  "edit-clear", "information_icon", "increase2", "decrease_positive",
  "steady2", "decrease2", "increase_negative", "red_question_mark",
  "blue_check", "x_mark", "yes_check", "twemoji", "walnut", "cscr-featured",
  "sound-openclipart", "folder_hexagonal_icon", "symbol_book_class2",
  "question_book-new", "wiktionary-logo", "commons-logo", "wikinews-logo",
  "wikiquote-logo", "wikivoyage-logo", "sound-icon", "wikibooks-logo",
  "wikiversity-logo", "ambox", "system-search", "split-arrows", "wikiversity_logo",
  "wikisource-logo", "wikimedia_community_logo", "wikidata-logo", "mediawiki-logo",
  "wikispecies-logo", "nuvola_apps", "white_flag_icon",
  "wiki_letter_w_cropped", "edit-copy_purple-wikiq", "acap", "portal-puzzle",
  "star_of_life", "disambig-dark", "gnome", "office-book", "audio-input-microphone",
  "hsutvald2", "hspolitic", "hsdagensdatum", "hsvissteduatt", "pl_wiki_aktualnosci_ikona",
  "hsbild", "wiki_aktualnosci_ikona", "hs_vdq", "hssamarbete", "hswpedia", "w-circle",
  "red_pencil_icon", "merge-arrow", "generic_with_pencil", "hsaktuell", "hsearth",
  "wikimedia-logo-circle", "wiktionary_ko_without_text", "mediawiki-notext",
  "wiktprintable_without_text", "dialog-information", "applications-office",
  "celestia", "antistub", "wiki_letter", "kit_body", "ui_icon_edit-ltr-progressive",
  "merge-split-transwiki", "mergefrom", "px-steady", "px-decrease", "px-increase",
  "question_book", "padlock-silver", "incubator-logo", "px-chinese_conversion",
  "px-applications-graphics", "px-pody_candidate", "px-potd-logo", "px-pd-icon",
  "px-dialog-warning", "px-checked_copyright_icon", "px-valued_image_seal",
  "px-cscr-former", "px-red_x", "px-crystal_clear_app_kedit", "px-people_icon",
  "kit_shorts", "kit_socks", "wikipedia-logo-v2", "phacility_phabricator_logo",
  "wikimedia_cloud_services_logo", "lingualibre-logo", "le_dico_des_ados_small_logo",
  "vikidia_v_vectorised", "sciences_humaines", "science-symbol", "history2",
  "vote3_final", "p_religion_world", "tecno-rueda", "notification-icon",
  "countries-vector", "p_history", "social_sciences", "p_culture", "p_religion_world",
  "p_sport", "p_train", "p_parthenon", "wiktionary_small", "wikimedia-logo",
  "crystal_clear_app_xmag", "1rightarrow", "emblem-qual", "hswikimedia", "hsutvald",
  "hstools", "hscontribs", "pl_wiki_czywiesz_ikona", "hs_geo", "p_wwii", "p_literature",
  "p_science", "p_globe", "p_vip", "p_mathematics", "p_chemistry", "p_medicine3",
  "p_technology", "datum17", "hs_liste", "hs_rtl_exclamation", "hsbook", "hshome",
  "hs_korganizer", "hseditor", "84_tematyczny_logo_propozycja", "hsbra",
  "pl_wiki_kalendarium_ikona", "pl_wiki_inm_ikona", "wiktionarypl_nodesc",
  "wikimedia_polska_logo", "icon_of_three_people_in_different_shades_of_grey",
  "wikimania", "hs_skand", "emblem-star-gray", "help-browser-red", "globe-with-clock",
  "records", "office-calendar", "preferences-desktop-locale", "system-users",
  "applications-system", "emblem-earth", "mail-closed", "tango-nosources",
  "emblem-scales", "mediawiki-2020"
];

// list of tags of images to have color inverted, both lists are subjected to amend
const INVERT_SRC_TAG = [
  "loudspeaker", "signature", "signatur", "chinese_characters", "/media/math/render/",
  "translation_to_english_arrow", "disambig_gray", "wikimedia-logo_black", "blue_pencil",
  "latin_alphabet_", "_cursiva", "unbalanced_scales", "question%2c_web_fundamentals",
  "wikipedia-tagline", "wikipedia-wordmark", "copyright/wikipedia", "ui_icon_ellipsis",
  "bluebg_rounded_croped", "blue-bg_rounded_cropped_right", "icon_facebook",
  "youtube_social_dark_circle", "instagram_circle", "icon_twitter",
  "%d8%a8%d8%a7%d9%84%d8%ad%d9%84%d9%8a%d8%a9", "font_awesome_5_solid_feather-alt",
  "font_awesome_5_solid_tree", "font_awesome_5_solid_globe", "font_awesome_5_solid_futbol",
  "font_awesome_5_solid_hourglass", "font_awesome_5_solid_users", "font_awesome_5_solid_palette",
  "font_awesome_5_solid_rocket", "font_awesome_5_solid_bong", "vlad1Trezub", "font_awesome_5_solid_flag",
  "font_awesome_5_solid_university", "wikipedia_wordmark", "wikipedia-logo-textonly", "mediawiki-wordmark-en.svg"
];

//############################################___Controller___##########################################################

// The main control function is called at every `onreadystatechange`
// Document state will go from `loading` --> `interactive` --> `complete`
// Metadata Block `@run-at document-start` will ensure this script start executing when `loading`
(document.onreadystatechange = function () {
  try {
    if (GM_getValue("scriptEnabled")) {
      if ('loading' === document.readyState) {
        setPageVisibility("hidden");
      } else if ('interactive' === document.readyState) {
        applyDarkTheme();
      } else if ('complete' === document.readyState) {
        setPageVisibility("visible");
        setupThemeByHost();
      }
    } else if ('complete' === document.readyState) {
      setupThemeByHost();
    }
  } catch (error) {
    console.error(error);
  }
})();

//############################################___Functions___###########################################################

function setPageVisibility(visibility) {
  const entirePage = document.documentElement;
  entirePage.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  entirePage.style.visibility = visibility;
}

function applyDarkTheme() {
  // General idea is to put all elements on a wikipedia page to an array `allElements`
  // traverse through this array and reverse the color of each element accordingly
  // running time o(n), where n is the number of elements on a page
  document.querySelectorAll('*').forEach(function (element) {
    try {
      if (!isSpecialElement(element)) {
        changeForegroundColor(element);
        changeBackgroundColor(element);
      }
    } catch (e) {
      console.log(e);
    }
  });
}

function isSpecialElement(e) {
  if (elementIsWikiLogo(e)) {
    invertImage(e, 90);
    return true;
  } else if (elementIsImage(e)) {
    changeImageIfOnLists(e);
    return true;
  } else if (elementIsHyperlink(e)) {
    if (e.className.toLowerCase().includes("new")) {
      changeForegroundColor(e);
    } else {
      e.style.color = GM_getValue("linkColor");
    }
    changeBackgroundColor(e);
    return true;
  } else if (elementIsKeyboardKey(e)) {
    e.style.foregroundColor = DEFAULT_BACKGROUND_COLOR;
    return true;
  } else if (elementIsFamilyTree(e)) {
    if (e.style.borderTop) {
      e.style.borderTopColor = "white";
    }
    if (e.style.borderBottom) {
      e.style.borderBottomColor = "white";
    }
    if (e.style.borderLeft) {
      e.style.borderLeftColor = "white";
    }
    if (e.style.borderRight) {
      e.style.borderRightColor = "white";
    }
    if (e.style.border) {
      e.style.borderColor = "white";
    }
    return true;
  } else return (elementIsLegendOrPieChart(e) || elementIsIndicationArrow(e));
}

function elementIsImage(e) {
  return e.nodeName.toLowerCase() === 'img';
}

function changeImageIfOnLists(img) {
  if (!imageInExcludeList(img)) {
    img.style.backgroundColor = "rgb(255, 255, 255)";
  }
  if (imageInInvertList(img)) {
    invertImage(img, 87);
  }
}

function imageInExcludeList(img) {
  for (let i = 0; i < EXCLUDE_SRC_TAG.length; i++) {
    if (img.src.toLowerCase().includes(EXCLUDE_SRC_TAG[i])) {
      return true;
    }
  }
  return false;
}

function imageInInvertList(img) {
  for (let i = 0; i < INVERT_SRC_TAG.length; i++) {
    if (img.src.toLowerCase().includes(INVERT_SRC_TAG[i])) {
      return true;
    }
  }
  return false;
}

function invertImage(img, percent) {
  img.style.filter = "invert(" + percent + "%)";
}

function elementIsHyperlink(e) {
  return e.tagName.toLowerCase() === 'a' ||
    e.className.toLowerCase().includes("toctext") ||
    e.className.toLowerCase().includes("autonym");
}

function elementIsWikiLogo(e) {
  return e.className.toLowerCase().includes("mw-wiki-logo") ||
    e.parentElement.className.toLowerCase().includes("mw-wiki-logo");
}

function elementIsKeyboardKey(e) {
  return e.className.toLowerCase().includes('keyboard-key');
}

function elementIsLegendOrPieChart(e) {
  return e.className.toLowerCase().includes('legend') ||
    e.style.borderColor.toLowerCase().includes('transparent') ||
    (
      // Pie chart template
      (
        e.style.border.toLowerCase().includes("1px solid rgb(0, 0, 0)") ||
        e.style.border.toLowerCase().includes("1px solid black")
      ) &&
      e.style.height === "200px" &&
      e.style.height === "200px" &&
      e.style.borderRadius === "100px"
    ) ||
    (
      e.nodeName === "SPAN" && e.textContent.replace(/\s/g, '').length === 0
    ) || e.innerHTML === "&nbsp;" || e.innerHTML === "​" || e.innerHTML === "■";
}

function elementIsFamilyTree(e) {
  return e.style.borderTop.toLowerCase().includes("1px solid black") ||
    e.style.borderTop.toLowerCase().includes("1px dashed black") ||
    e.style.borderTop.toLowerCase().includes("1px dotted black") ||
    e.style.borderBottom.toLowerCase().includes("1px solid black") ||
    e.style.borderBottom.toLowerCase().includes("1px dashed black") ||
    e.style.borderBottom.toLowerCase().includes("1px dotted black") ||
    e.style.borderLeft.toLowerCase().includes("1px solid black") ||
    e.style.borderLeft.toLowerCase().includes("1px dashed black") ||
    e.style.borderLeft.toLowerCase().includes("1px dotted black") ||
    e.style.borderRight.toLowerCase().includes("1px solid black") ||
    e.style.borderRight.toLowerCase().includes("1px dashed black") ||
    e.style.borderRight.toLowerCase().includes("1px dotted black") ||
    e.style.border.toLowerCase().includes("2px solid black");
}

function elementIsIndicationArrow(e) {
  return e.innerHTML === "▼" || e.innerHTML === "▲";
}

function changeForegroundColor(e) {
  let foregroundColor = window.getComputedStyle(e, null).getPropertyValue("color");
  if (colorIsRGB(foregroundColor)) {
    const foregroundColorSplit = splitToRGB(foregroundColor);
    const foregroundColorInverse = inverseRBGColor(foregroundColorSplit);
    const foregroundColorInverseHSV = RGBtoHSL(foregroundColorInverse[0], foregroundColorInverse[1], foregroundColorInverse[2]);
    const defaultForegroundColorSplit = splitToRGB(DEFAULT_FOREGROUND_COLOR);
    const defaultForegroundColorHSL = RGBtoHSL(defaultForegroundColorSplit[0], defaultForegroundColorSplit[1], defaultForegroundColorSplit[2]);
    const foregroundColorHSL = increaseLuminance(foregroundColorInverseHSV, defaultForegroundColorHSL, DEFAULT_RELATIVE_LUMINANCE, 1);
    const foregroundColorRGB = HSLtoRGB(foregroundColorHSL[0], foregroundColorHSL[1], foregroundColorHSL[2]);
    e.style.color = RGBArrayToString(foregroundColorRGB);
  } else {
    e.style.color = DEFAULT_FOREGROUND_COLOR;
  }
}

function changeBackgroundColor(e) {
  const elementComputedStyle = window.getComputedStyle(e, null);
  let backgroundColor = elementComputedStyle.getPropertyValue("background-color");
  if (elementToChangeBackground(e)) {
    e.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  } else if (colorIsRGB(backgroundColor)) {
    const backgroundColorSplit = splitToRGB(backgroundColor);
    const backgroundColorInverse = inverseRBGColor(backgroundColorSplit);
    const backgroundColorInverseHSV = RGBtoHSL(backgroundColorInverse[0], backgroundColorInverse[1], backgroundColorInverse[2]);
    if (backgroundColorInverseHSV[2] < 20) {
      backgroundColorInverseHSV[2] += 10;
    } else if (backgroundColorInverseHSV[2] > 80) {
      backgroundColorInverseHSV[2] -= 10;
    }
    const defaultBackgroundColorSplit = splitToRGB(DEFAULT_BACKGROUND_COLOR);
    const defaultBackgroundColorHSL = RGBtoHSL(defaultBackgroundColorSplit[0], defaultBackgroundColorSplit[1], defaultBackgroundColorSplit[2]);
    const backgroundColorHSL = decreaseLuminance(backgroundColorInverseHSV, defaultBackgroundColorHSL, DEFAULT_RELATIVE_LUMINANCE, 1);
    const backgroundColorRGB = HSLtoRGB(backgroundColorHSL[0], backgroundColorHSL[1], backgroundColorHSL[2]);
    e.style.backgroundColor = RGBArrayToString(backgroundColorRGB);
  } else if (backgroundColor !== "rgba(0, 0, 0, 0)") {
    e.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  }
  const backgroundImage = elementComputedStyle.getPropertyValue("background-image");
  if (backgroundImageToRemove(backgroundImage)) {
    e.style.background = DEFAULT_BACKGROUND_COLOR;
  }
}

function backgroundImageToRemove(backgroundImage) {
  // This will remove the white banner on Chinese Wikipedia main page
  return backgroundImage && backgroundImage.includes("Zhwp_blue_banner.png");
}

function elementToChangeBackground(e) {
  return e.id.toLowerCase().includes("mw-head") || e.id === "content" ||
    e.id === "mw-panel" || e.parentElement.id.includes("ca-");
}

//############################################___Color_Utility___#######################################################

function colorIsRGB(c) {
  return c.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);
}

function splitToRGB(c) {
  const rgb = colorIsRGB(c);
  return [rgb[1], rgb[2], rgb[3]];
}

function inverseRBGColor(c) {
  let r, g, b;
  r = 255 - Number(c[0]);
  g = 255 - Number(c[1]);
  b = 255 - Number(c[2]);
  return [r, g, b];
}

function increaseLuminance(colorToChange, colorToMatch, relativeLuminance, changePerLoop) {
  let result = colorToChange;
  while ((result[2] / colorToMatch[2]) < relativeLuminance) {
    result[2] += changePerLoop;
  }
  return result;
}

function decreaseLuminance(colorToChange, colorToMatch, relativeLuminance, changePerLoop) {
  let result = colorToChange;
  while ((result[2] / colorToMatch[2]) > relativeLuminance) {
    result[2] -= changePerLoop;
  }
  return result;
}

function RGBArrayToString(rgb) {
  return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
}

function RGBToHex(r, g, b) {
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

function RGBtoHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function HSLtoRGB(h, s, l) {
  let r, g, b;
  h = h / 360;
  s = s / 100;
  l = l / 100;
  if (s === 0) {
    r = g = b = l;
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

//############################################___Host_Specific___#######################################################

function setupThemeByHost() {
  const hostname = window.location.hostname;
  let settingsButtonParentList;
  if (hostname === "etherpad.wikimedia.org") {
    // Etherpad
    settingsButtonParentList = document.querySelector("[data-key='showusers']").parentElement;
    if (GM_getValue("scriptEnabled")) {
      overrideSpecialElementStylesForEtherpad();
    }
  } else {
    // Default to Wikipedia pages
    settingsButtonParentList = getWikiPagesSettingsButtonParentList();
    if (GM_getValue("scriptEnabled")) {
      overrideSpecialElementStylesForWikiPages();
    }
  }
  initSettingElements(settingsButtonParentList);
}

function getWikiPagesSettingsButtonParentList() {
  let settingsButtonParentList;
  if (document.getElementById("pt-login")) {
    settingsButtonParentList = document.getElementById("pt-login").parentElement;
  } else if (document.getElementById("pt-logout")) {
    settingsButtonParentList = document.getElementById("pt-logout").parentElement;
  } else if (document.getElementById("p-personal")) {
    settingsButtonParentList = document.getElementById("p-personal").parentElement ? document.getElementById("p-personal").parentElement : document.getElementById("p-personal");
  }
  // TODO: fall back place
  return settingsButtonParentList;
}

//############################################___Special_Styles_for_Wikipedia_Pages___##################################

function overrideSpecialElementStylesForWikiPages() {
  document.head.appendChild(getVisitedLinkStyle());
  document.head.appendChild(getTableStyle());
  document.head.appendChild(getAncestriesStyle());
  document.head.appendChild(getListStyle());
  document.head.appendChild(getLanguageSpecificStyle());
  document.head.appendChild(getThemeSpecificStyle());
}

function getVisitedLinkStyle() {
  const visitedLinkStyle = document.createElement('style');
  visitedLinkStyle.innerHTML = `
        a:not(.mwe-popups-extract):visited, a:not(.mwe-popups-extract).external:visited {
            color: ` + GM_getValue("visitedLinkColor") + ` !important;
        }
    `
  return visitedLinkStyle;
}

function getTableStyle() {
  const tableStyle = document.createElement('style');
  tableStyle.innerHTML = `
        tr::before {
            background-color: ` + DEFAULT_BACKGROUND_COLOR + ` !important;
        }
    `
  return tableStyle;
}

function getAncestriesStyle() {
  const ancestriesStyle = document.createElement('style');
  ancestriesStyle.innerHTML = `
        .ahnentafel-t {
            border-top: white solid 1px !important;
            border-left: white solid 1px !important;
        }
        .ahnentafel-b {
            border-bottom: white solid 1px !important;
            border-left: white solid 1px !important;
        }
    `
  return ancestriesStyle;
}

function getListStyle() {
  const listStyle = document.createElement('style');
  listStyle.innerHTML = `
        ul {
            list-style-image: none;
        }
  `
  return listStyle;
}

function getThemeSpecificStyle() {
  const themeStyle = document.createElement('style');
  if (document.body.className.includes('skin-minerva')) {
    // Skin `MinervaNeue` badges
    themeStyle.innerHTML = `
      .mw-echo-notifications-badge { filter: invert(100%); }
    `
  } else if (document.body.className.includes('skin-monobook')) {
    // Skin `MonoBook` top white bar
    themeStyle.innerHTML = `
      body { background: none; }
      .mw-echo-notifications-badge { filter: invert(100%); }
    `
  } else if (document.body.className.includes('skin-timeless')) {
    // Skin `Timeless` side bar small screen
    themeStyle.innerHTML = `
      #searchButton { filter: invert(100%); }
      .mw-echo-notifications-badge { filter: invert(100%); }
    `
  } else if (document.body.className.includes('skin-vector-2022')) {
    // Skin `Vector 2022` side bar small screen
    themeStyle.innerHTML = `
      #mw-panel { background-image: none !important; background-color: transparent !important;}
      .mw-echo-notifications-badge { filter: invert(100%); }
      .mw-ui-icon { filter: invert(100%); }
      #mw-head { background-color: transparent !important; }
      .mw-logo-icon { background-color: transparent !important; }
      #content { background-color: transparent !important; }
    `
  } else if (document.body.className.includes('skin-vector')) {
    // Skin `Vector` badges
    themeStyle.innerHTML = `
      .mw-echo-notifications-badge { filter: invert(100%); }
    `
  }
  return themeStyle;
}

function getLanguageSpecificStyle() {
  const langStyle = document.createElement('style');
  if (LOCALE === "zh") {
    // Chinese conversion box & main page
    langStyle.innerHTML = `
            .vectorTabs li { background-image: none; }
            .vectorTabs li a span { background: ` + DEFAULT_BACKGROUND_COLOR + ` !important; }
            .vectorTabs li a span { color: ` + DEFAULT_FOREGROUND_COLOR + ` !important; }
            @media (min-width: 720px) { .mw-parser-output #mp-2012-column-right-block-b { background: ` + DEFAULT_BACKGROUND_COLOR + ` !important; } }
        `
  } else if (LOCALE === "fr") {
    // French Main page and side bar
    langStyle.innerHTML = `
            #accueil_2017_en-tete { background: ` + DEFAULT_BACKGROUND_COLOR + ` !important; }
            '#mw-panel { background: ` + DEFAULT_BACKGROUND_COLOR + ` !important; }
        `
  } else if (LOCALE === "ja") {
    // Japanese main page headings
    langStyle.innerHTML = `
            .mw-parser-output .mainpage-heading-title { background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }
        `
  } else if (LOCALE === "es") {
    // Spanish main page headings
    langStyle.innerHTML = `
            @media (min-width: 1000px) { .mw-parser-output .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; } }
        `
  } else if (LOCALE === "pl") {
    // Polish main page headings
    langStyle.innerHTML = `
            h2 { background-image: none !important; background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }
        `
  } else if (LOCALE === "ru") {
    // Russian main page
    langStyle.innerHTML = `
            @media (min-width: 1000px) { .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; } }
        `
  } else if (LOCALE === "sv") {
    // Swedish main page headings
    langStyle.innerHTML = `
            .mw-parser-output .frontPageBlock { background: none !important; }
            .frontPageBlockTitle { background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }
        `
  } else if (LOCALE === "uk") {
    // Ukrainian main page
    langStyle.innerHTML = `
            .mw-parser-output #main-head { background: linear-gradient(rgb(30,30,30), ` + DEFAULT_BACKGROUND_COLOR + ` ) !important; }
            .mw-parser-output #main-bottom { background: linear-gradient(` + DEFAULT_BACKGROUND_COLOR + `, rgb(30,30,30)) !important; }
        `
  } else if (LOCALE === "ko") {
    // Korean main page
    langStyle.innerHTML = `
            .mw-parser-output .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; }
        `
  }
  return langStyle;
}

//############################################___Special_Styles_for_Etherpad___#########################################

function overrideSpecialElementStylesForEtherpad() {
  isEtherpadLoaded().then(() => {
    setEtherpadTheme('#272822', '#FFF', '#FFF', '#FFF', '#FFF', '#272822', '#272822');
  });
}

async function isEtherpadLoaded() {
  while (document.querySelector("iframe[name='ace_outer']") === null || document.querySelector("iframe[name='ace_outer']").contentDocument.querySelector("iframe[name='ace_inner']") === null) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }
}

function setEtherpadTheme(light, superDark, dark, primary, middle, text, superLight) {
  document.body.style.setProperty('--light-color', light);
  document.body.style.setProperty('--super-dark-color', superDark);
  document.body.style.setProperty('--dark-color', dark);
  document.body.style.setProperty('--primary-color', primary);
  document.body.style.setProperty('--middle-color', middle);
  document.body.style.setProperty('--text-color', text);
  document.body.style.setProperty('--super-light-color', superLight);

  const outerStyle = document.querySelector("iframe[name='ace_outer']").contentDocument.body.style;

  outerStyle.setProperty('--primary-color', primary);
  outerStyle.setProperty('--super-light-color', superLight);
  outerStyle.setProperty('--super-dark-color', superDark);
  outerStyle.setProperty('--light-color', light);
  outerStyle.setProperty('--dark-color', dark);

  const innerStyle = document.querySelector("iframe[name='ace_outer']").contentDocument.querySelector("iframe[name='ace_inner']").contentDocument.body.style;
  innerStyle.setProperty('--super-dark-color', superDark);
  innerStyle.setProperty('--primary-color', primary);
}

//############################################___Init_Elements___#######################################################

function initSettingElements(settingsButtonParentList) {
  initGMStorage();
  insertSettingsModalStyle();
  createSettingsModal();
  addButtonListeners();
  addSettingsButton(settingsButtonParentList);
  updateSettingsModal();
}

function initGMStorage(reset = false) {
  if (!GM_getValue("linkColor") || reset) {
    const split = splitToRGB(DEFAULT_LINK_COLOR);
    GM_setValue("linkColor", RGBToHex(split[0], split[1], split[2]));
  }
  if (!GM_getValue("visitedLinkColor") || reset) {
    const linkColorSplit = splitToRGB(DEFAULT_LINK_COLOR);
    let visitedLinkColorHSL = RGBtoHSL(linkColorSplit[0], linkColorSplit[1], linkColorSplit[2]);
    visitedLinkColorHSL[2] -= 35;
    const visitedLinkColorRGB = HSLtoRGB(visitedLinkColorHSL[0], visitedLinkColorHSL[1], visitedLinkColorHSL[2]);
    GM_setValue("visitedLinkColor", RGBToHex(visitedLinkColorRGB[0], visitedLinkColorRGB[1], visitedLinkColorRGB[2]));
  }
}

//############################################___Settings_Button___#####################################################

function addSettingsButton(parentList) {
  // Create a list that contains settings button
  let settingsButtonList = document.createElement("li");
  settingsButtonList.innerHTML += `
    <a
      id="settingsButton"
      title="Change settings for Wikipedia Dark Theme."
      style="font-weight: bold; color: white;"
      onclick="document.getElementById('settingsModal').style.display = 'block'; return false;"
    >
      Settings
    </a>
  `;
  // Adding toggle script button to after the login/logout button
  parentList.appendChild(settingsButtonList);
  setSettingsButton();
}

function setSettingsButton() {
  let settingsButton = document.getElementById("settingsButton");
  let text, title;
  switch (LOCALE) {
    case "zh":
      text = "设置";
      title = "设置维基百科黑色主题。";
      break;
    case "ja":
      text = "設定";
      title = "ウィキペディアダークテーマを設定します。";
      break;
    case "fr":
      text = "Les paramètres";
      title = "Modifiez les paramètres de Wikipédia Dark Theme.";
      break;
    default:
      text = "Settings";
      title = "Change settings for Wikipedia Dark Theme.";
  }
  settingsButton.text = text;
  settingsButton.title = title;
  settingsButton.style.color = GM_getValue("scriptEnabled") ? "white" : "black";
}

//############################################___Settings_Modal___######################################################

function createSettingsModal() {
  let settingsModal = `
        <div id="settingsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                  <h5>Wikipedia Dark Theme Settings</h5>
                  <span id="close" class="close">&times;</span>
                </div>
                <div class="modal-body">
                     <h6>Theme preferences</h6>
                     <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="darkTheme" value="dark">
                      <label class="form-check-label" for="darkTheme">Dark</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="lightTheme" value="light">
                      <label class="form-check-label" for="lightTheme">Light</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="syncTheme" value="sync">
                      <label class="form-check-label" for="syncTheme">Sync with system</label>
                    </div>
                    <h6>Color preferences (in dark theme)</h6>
                    <div class="form-check-inline">
                        <label for="linkColor" class="label">Link color: </label>
                        <input type="color" id="linkColor" title="Choose your link color">
                    </div>
                    <div class="form-check-inline">
                        <label for="visitedLinkColor" class="label">Link color (visited): </label>
                        <input type="color" id="visitedLinkColor" title="Choose your visited link color">
                    </div>
                    <br>
                </div>
                <div class="modal-footer">
                   <button class="btn btn-outline-secondary" id="restoreButton">Restore defaults</button>
                   <button class="btn btn-outline-secondary close">Cancel</button>
                   <button class="btn btn-outline-primary" id="saveButton">Save changes</button>
                </div>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML('afterend', settingsModal)
}

function setSettings() {
  if (document.getElementById("syncTheme").checked) {
    GM_setValue("syncTheme", true);
  } else {
    GM_setValue("syncTheme", false);
  }
  if (document.getElementById("darkTheme").checked) {
    GM_setValue("scriptEnabled", true);
  } else {
    GM_setValue("scriptEnabled", false);
  }
  GM_setValue("linkColor", document.getElementById("linkColor").value);
  GM_setValue("visitedLinkColor", document.getElementById("visitedLinkColor").value);
}

function updateSettingsModal() {
  updateThemePreferences();
  updateColorPreferences();
}

function updateThemePreferences() {
  if (GM_getValue("syncTheme")) {
    const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (userPrefersDark) {
      GM_setValue("scriptEnabled", true);
    } else {
      GM_setValue("scriptEnabled", false);
    }
    document.getElementById("syncTheme").checked = "checked";
  } else {
    if (GM_getValue("scriptEnabled")) {
      document.getElementById("darkTheme").checked = "checked";
    } else {
      document.getElementById("lightTheme").checked = "checked";
    }
  }
}

function updateColorPreferences() {
  document.getElementById("linkColor").value = GM_getValue("linkColor");
  document.getElementById("visitedLinkColor").value = GM_getValue("visitedLinkColor");
}

function dismissSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  settingsModal.style.display = "none";
  updateSettingsModal();
}

function addButtonListeners() {
  const closeButtons = document.getElementsByClassName("close");
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function () {
      dismissSettingsModal();
    }
  }
  window.onclick = function (event) {
    if (event.target === document.getElementById("settingsModal")) {
      dismissSettingsModal();
    }
  }
  const saveButton = document.getElementById("saveButton");
  saveButton.onclick = function () {
    setSettings();
    dismissSettingsModal();
    location.reload();
  }
  const restoreButton = document.getElementById("restoreButton");
  restoreButton.onclick = function () {
    initGMStorage(true);
    dismissSettingsModal();
    location.reload();
  }
}

function insertSettingsModalStyle() {
  const settingsModalStyle = document.createElement('style');
  settingsModalStyle.innerHTML = `
         .modal {
            font-family: var(--bs-font-sans-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            -webkit-text-size-adjust: 100%;
            display: none;
            position: fixed;
            z-index: 1060;
            padding-top: 100px;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            outline: 0;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 450px;
            pointer-events: auto;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.2);
            border-radius: .3rem;
            outline: 0;
            margin: auto;
            -webkit-animation-name: animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: animatetop;
            animation-duration: 0.4s
        }
        .modal-header {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1rem;
            border-bottom: 1px solid #dee2e6;
            border-top-left-radius: calc(.3rem - 1px);
            border-top-right-radius: calc(.3rem - 1px);
        }
        .modal-body {
            position: relative;
            flex: 1 1 auto;
            padding: 1rem;
        }
        .modal-footer {
            display: flex;
            flex-wrap: wrap;
            flex-shrink: 0;
            align-items: center;
            justify-content: flex-end;
            padding: .75rem;
            border-top: 1px solid #dee2e6;
            border-bottom-right-radius: calc(.3rem - 1px);
            border-bottom-left-radius: calc(.3rem - 1px);
        }
        .modal-footer > * {
            margin: .25rem;
        }
        @-webkit-keyframes animatetop {
          from {top:-300px; opacity:0} 
          to {top:0; opacity:1}
        }
        @keyframes animatetop {
          from {top:-300px; opacity:0}
          to {top:0; opacity:1}
        }
        #close {
          color: grey;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        #close:hover,
        #close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
        #restoreButton {
            margin-right: auto;
        }
        .label {
            margin: .4rem;
            display: inline-block;
        }
        .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            margin-bottom: .5rem;
            font-weight: 500;
            line-height: 1.2;
        }
        .h5, h5 {
            font-size: 1.25rem;
        }
        .h6, h6 {
            font-size: 1rem;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            text-align: center;
            text-decoration: none;
            vertical-align: middle;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .btn-outline-primary {
            color: #007bff;
            background-color: transparent;
            background-image: none;
            border-color: #007bff;
        }
        .btn-outline-primary:hover {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-outline-secondary {
            color: #6c757d;
            background-color: transparent;
            background-image: none;
            border-color: #6c757d;
        }
        .btn-outline-secondary:hover {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
        .form-check-input:checked[type="radio"] {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e");
        }
        .form-check {
            display: block;
            min-height: 1.5rem;
            padding-left: 1.5em;
            margin-bottom: .125rem;
        }
        .form-check-inline {
            display: inline-block;
            margin-right: 1rem;
        }
        .form-check-input:checked {
            background-color: #0d6efd;
            border-color: #0d6efd;
        }
        .form-check-input[type="radio"] {
            border-radius: 50%;
        }
        .form-check .form-check-input {
            float: left;
            margin-left: -1.5em;
        }
        .form-check-input {
            width: 1em;
            height: 1em;
            margin-top: .25em;
            vertical-align: top;
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            border: 1px solid rgba(0,0,0,.25);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
        }
    `
  document.head.appendChild(settingsModalStyle);
}
