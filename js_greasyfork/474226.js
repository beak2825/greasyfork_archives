// ==UserScript==
// @name          护眼脚本
// @author         猫雷NyaRu_Official
// @description   修改网页背景色，让网页原本的白色背景色变成乡土黄、豆沙绿、浅色灰、淡橄榄一干颜色，更加护眼。默认背景色是豆沙绿。自用脚本，不伺候，有删历史版本的习惯。
// @version        3.0
// @license        Apache-2.0
// @match         *://*/*
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @namespace  https://greasyfork.org/zh-CN/users/719628
// @downloadURL https://update.greasyfork.org/scripts/474226/%E6%8A%A4%E7%9C%BC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474226/%E6%8A%A4%E7%9C%BC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(() => {
  const colors = {
    yellow: "#F6F4EC",
    green: "#CCE8CF",
    grey: "#F2F2F2",
    olive: "#E1E6D7"
  };

  const changeColor = (colorMap, colorValue) => {
    const color = colorMap[colorValue] || colorMap.green;
    document.body.style.backgroundColor = color;
    changeAllElementsColor(color);
    GM_setValue("colorValue", colorValue);
  };

  const changeAllElementsColor = color => {
    const elements = Array.from(document.querySelectorAll("*"));
    elements.forEach(element => {
      const { backgroundColor } = getComputedStyle(element);
      const rgbValues = extractRGBValues(backgroundColor);
      if (rgbValues && rgbValues.length === 3) {
        const [r, g, b] = rgbValues.map(Number);
        if (r > 242 && g > 242 && b > 242) {
          element.style.backgroundColor = color;
        }
      }
    });
  };

  const extractRGBValues = color => {
    const matches = color.match(/\d+/g);
    return matches ? matches.map(Number) : null;
  };

  const changeColorHandler = colorValue => () => {
    changeColor(colors, colorValue);
  };

  GM_registerMenuCommand("乡土黄", changeColorHandler("yellow"), "y");
  GM_registerMenuCommand("豆沙绿", changeColorHandler("green"), "g");
  GM_registerMenuCommand("浅色灰", changeColorHandler("grey"), "r");
  GM_registerMenuCommand("淡橄榄", changeColorHandler("olive"), "o");

  const toggleScript = () => {
    const currentSite = window.location.hostname;
    const disabledSites = GM_getValue("disabledSites", []);

    if (disabledSites.includes(currentSite)) {
      disabledSites.splice(disabledSites.indexOf(currentSite), 1);
    } else {
      disabledSites.push(currentSite);
    }

    GM_setValue("disabledSites", disabledSites);
    updateMenu();

    if (disabledSites.includes(currentSite)) {
      document.body.style.backgroundColor = '';
      resetAllElementsColor();
    } else {
      changeColor(colors, GM_getValue("colorValue", "green"));
    }
  };

  const resetAllElementsColor = () => {
    const elements = Array.from(document.querySelectorAll("*"));
    elements.forEach(element => {
      element.style.backgroundColor = '';
    });
  };

  const updateMenu = () => {
    const currentSite = window.location.hostname;
    const disabledSites = GM_getValue("disabledSites", []);
    const enableMenuText = disabledSites.includes(currentSite) ? '✅ 点击启用' : '❌ 点击禁用';
    const disableMenuText = disabledSites.includes(currentSite) ? '❌ 点击禁用' : '✅ 点击启用';

    GM_registerMenuCommand(enableMenuText, toggleScript);
    GM_registerMenuCommand(disableMenuText, toggleScript);
  };

  updateMenu();

  const currentSite = window.location.hostname;
  const disabledSites = GM_getValue("disabledSites", []);

  if (!disabledSites.includes(currentSite)) {
    const colorValue = GM_getValue("colorValue", "none");
    if (colorValue === "none") {
      GM_setValue("colorValue", "green");
    }

    changeColor(colors, colorValue);
  }

})();