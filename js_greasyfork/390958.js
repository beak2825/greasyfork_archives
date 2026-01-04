// ==UserScript==
// @name    		Google Image Search - Advanced Size Filters
// @description	    Adds additional image size filtering options to the default Google image search tools, which are by default hidden in advanced image search or don't exist in the UI at all
// @namespace		seisenhut
// @version			1.0.1
// @include			/(http|https):\/\/www\.google\.(ca|co\.in|co\.uk|com|com\.br|de|es|fr|it|pl|ru)\/search\?.*&tbm=isch/
// @author			Steffen Eisenhut
// @license         MIT
// @copyright       2019, Steffen Eisenhut
// @run-at			document-start
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/390958/Google%20Image%20Search%20-%20Advanced%20Size%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/390958/Google%20Image%20Search%20-%20Advanced%20Size%20Filters.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
'use strict';

//All the additional quality options we want to add
const resOptions = new Map([
  ["qsvga", 	"400x300 (QSVGA)"],
  ["vga", 		"640x480 (VGA)"],
  ["svga", 		"800x600 (SVGA)"],
  ["xga", 		"1024x768 (XGA)"],
  ["2mp", 		"2 MP (~Full HD)"],
  ["4mp", 		"4 MP"],
  ["6mp", 		"6 MP"],
  ["8mp", 		"8 MP (~4K)"],
  ["10mp", 		"10 MP"],
  ["12mp", 		"12 MP"],
  ["15mp", 		"15 MP"],
  ["20mp", 		"20 MP"],
  ["40mp", 		"40 MP"],
  ["70mp", 		"70 MP"]
]);

let tbsMatchString = null;
let tbsSettings = new Map();
let injected = false;
let iszReady = false;

const iszObserver = new MutationObserver(onMenuMutation);

document.addEventListener ("DOMContentLoaded", onDomReady);
initTbsSettings();

//always inject iar to make aspect dropdown appear, any value will do
if (!isAspectDefined()) {
  setTbsAndRefresh("iar", "a");
}

function onDomReady() {
  //The menu items probably aren't ready yet, these are added somewhere from Google's scripts
  if (isIszLoaded()) {
    iszReady = true;
    injectOtherQualities();
  }
  else {
    iszObserver.observe(document.getElementById("hdtbMenus"), {childList: true, subtree: true});
  }
}

function isIszLoaded() {
  //This is the "any size" element inside size selection, parents don't have any ids
  return document.getElementById("isz_") !== null;
}

function onMenuMutation(mutations, observer) {
  //Could be another menu item, or we're in a race condition
  if (!iszReady && isIszLoaded()){
    iszReady = true;
    observer.disconnect();
    injectOtherQualities();
  }
}

function injectOtherQualities() {
  //Minimize race conditions from mutation callbacks
  if (injected) {
    return;
  }
  injected = true;

  addSelectedHeaderStyle();

  const sizeAny = document.getElementById("isz_");
  const sizeList = sizeAny.parentNode;
  const curIsz = getTbs("isz");
  const curIslt = getTbs("islt");

  resOptions.forEach((value,key) => {
    let resOption = document.createElement("li");
    resOption.classList.add("hdtbItm");
    if (curIsz === "lt" && curIslt === key) {
      fixSizeSelection(sizeAny, value);

      resOption.classList.add("hdtbSel");
      resOption.innerText = value;
    }
    else {
      let optionLink = getLocationForSettingChanges([["isz", "lt"],["islt", key]]);
      resOption.innerHTML = `<a class="q qs" href="${optionLink}">${value}</a>`;
    }

    sizeList.appendChild(resOption);
  });
}

function fixSizeSelection(anySizeElement, selectedSize) {
  //Any size needs a clean link back and selection removed
  anySizeElement.classList.remove("hdtbSel");
  const noSizeLink = getLocationForSettingChanges([["isz", null],["islt", null]]);
  anySizeElement.innerHTML = `<a class="q qs" href="${noSizeLink}">Any size</a>`;

  //Header needs adjustment for displaying correct selection; it is in an id-less div, so we need to search
  const headers = document.getElementById("hdtbMenus").getElementsByClassName("hdtb-mn-hd");
  for (let header of headers) {
    let headerText = header.getElementsByClassName("mn-hd-txt")[0];
    if (headerText.innerText === "Size")
    {
      headerText.innerText = selectedSize;
      header.classList.add("hdtb-tsel");

      break;
    }
  }
}

function addSelectedHeaderStyle() {
  //If no header has a selection, that css rule will not be defined from Google's side, so we force it in
  const headerStyle = document.getElementById("rshdr").getElementsByTagName("style")[0];

  for (let rule of headerStyle.sheet.cssRules) {
    if (rule.selectorText === ".hdtb-tsel") {
      //Rule is already included, bail
      return;
    }
  }

  addCssRule(headerStyle.sheet, ".hdtb-tsel", "font-weight: bold; color: #4285f4;", headerStyle.sheet.cssRules.length);
  addCssRule(headerStyle.sheet, ".hdtb-tsel:hover", "color: #4285f4;", headerStyle.sheet.cssRules.length);
}

function addCssRule(sheet, selector, rules, index) {
  if("insertRule" in sheet) {
    sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if("addRule" in sheet) {
    sheet.addRule(selector, rules, index);
  }
}

function isAspectDefined() {
  return tbsSettings.has("iar");
}

function initTbsSettings() {
  let tbsMatch = getDecodedSearchString().match(/tbs=(.*?:[^&\s]*)/);

  if (tbsMatch)
  {
    tbsMatchString = tbsMatch[0];
    //avoiding matchAll due to compatibility...
    const kvpRegexp = /([^,]*?):([^,]*)/g;
    let setting;
    while ( (setting = kvpRegexp.exec(tbsMatch[1])) !== null && setting.length > 2) {
      setTbs(setting[1], setting[2]);
    }
  }
}

function setTbsAndRefresh(setting, value){
  setTbs(setting, value);
  refreshWithCurrentSettings();
}

function getTbs(setting) {
  return tbsSettings.get(setting);
}

function setTbs(setting, value) {
  setTbsFor(tbsSettings, setting, value);
}

function setTbsFor(settingMap, setting, value) {
  if (value === null) {
    settingMap.delete(setting);
  }
  else {
    settingMap.set(setting, value);
  }
}

function getDecodedSearchString() {
  return decodeURIComponent(location.search.replace(/\+/g,' '));
}

function getLocationForSettingChanges(settings) {
  let tempSettings = new Map(tbsSettings);
  settings.forEach(setting => setTbsFor(tempSettings, setting[0], setting[1]));

  return getLocationWithSettings(tempSettings);
}

function getLocationForSettingChange(setting, value) {
  getLocationForSettingChanges([[setting, value]]);
}

function getLocationWithSettings(settings) {
  let newTbsString = "tbs=" + Array.from(settings).map(setting => `${setting[0]}:${setting[1]}`).toString();
  let newSettings = tbsMatchString !== null ? getDecodedSearchString().replace(tbsMatchString, newTbsString) : `${getDecodedSearchString()}&${newTbsString}`;

  return window.location.protocol + "//" + window.location.host + window.location.pathname + newSettings;
}

function refreshWithCurrentSettings() {
  window.location.replace(getLocationWithSettings(tbsSettings));
}
