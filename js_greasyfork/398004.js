// ==UserScript==
// @name               GitHub菜单
// @name:zh-CN         GitHub菜单
// @name:en            GitHub Menu
// @description        为GitHub头添加更多的菜单项，让你能够快速抵达你想要的页面。
// @description:zh-CN  为GitHub头添加更多的菜单项，让你能够快速抵达你想要的页面。
// @description:en     Add more menu items on the header of GitHub to quickly reach the page you want.
// @namespace          https://github.com/HaleShaw
// @version            1.2.1
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-GitHubMenu
// @supportURL         https://github.com/HaleShaw/TM-GitHubMenu/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://github.githubassets.com/favicon.ico
// @match              *://github.com/*
// @match              *://github.wdf.sap.corp/*
// @match              *://github.tools.sap/*
// @compatible	       Chrome
// @run-at             document-idle
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/398004/GitHub%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/398004/GitHub%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  // 如果你想在Github企业版上使用它，你需要将你的Github企业版域名添加到脚本上方的match列表中。
  // If you want to use it at GitHub Enterprise, you should add the domain of GitHub Enterprise in the match list.

  const urlSeparator = "/";
  const defaultAccountName = "HaleShaw";
  const defaultAClassName = "HeaderMenu-link no-underline py-3 d-block d-lg-inline-block";
  const defaultLiClassName = "border-bottom border-lg-bottom-0 mr-0 mr-lg-3";
  const menuArr = ["Stars", "Profile", "Repositories", "Watching", "Settings"];
  let hasLogin = false;

  main();

  function main() {
    logInfo(GM_info.script.name, GM_info.script.version);
    let accountName = getAccountName();
    if (accountName == undefined) {
      console.warn("Failed to get account name, default account name [" + defaultAccountName + "] will be used");
      accountName = defaultAccountName;
    } else {
      hasLogin = true;
    }
    const menu = getMenu(hasLogin);
    if (menu != undefined) {
      addMenuItem(menu, accountName, hasLogin);
    }
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    const titleStyle = "color:white;background-color:#606060";
    const versionStyle = "color:white;background-color:#1475b2";
    const logTitle = " " + title + " ";
    const logVersion = " " + version + " ";
    console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
  }

  /**
   * Add menu item.
   */
  function addMenuItem(menu, accountName, hasLogin) {
    const aClassName = getAClassName(menu, hasLogin);
    if (hasLogin) {
      for (let i = 0; i < menuArr.length; i++) {
        let menuItem = createMenuA(menuArr[i], aClassName, accountName);
        menu.appendChild(menuItem);
      }
    } else if ("github.com" == document.domain) {
      // If it is not logged in, and only the domain is 'github.com', then add the menu.
      const liClassName = getLiClassName(menu);
      for (let i = 0; i < menuArr.length - 2; i++) {
        let menuItem = createMenuLi(menuArr[i], liClassName, aClassName, accountName);
        menu.appendChild(menuItem);
      }
    }
  }

  /**
   * Create the menu item A.
   * @param {String} buttonName button name.
   * @param {String} aClassname className of A.
   * @param {String} accountName account name.
   */
  function createMenuA(buttonName, aClassname, accountName) {
    const menuItem = document.createElement("a");
    menuItem.text = buttonName;
    menuItem.className = aClassname;
    menuItem.href = getURL(buttonName, accountName);
    menuItem.target = "_blank";
    return menuItem;
  }

  /**
   * Create the menu item LI.
   * @param {String} buttonName button name.
   * @param {String} liClassName className of LI.
   * @param {String} aClassName className of A.
   * @param {String} accountName account name.
   */
  function createMenuLi(buttonName, liClassName, aClassName, accountName) {
    const menuItem = document.createElement("li");
    menuItem.className = liClassName;
    const menuA = createMenuA(buttonName, aClassName, accountName);
    menuItem.appendChild(menuA);
    return menuItem;
  }

  /**
   * Get the URL of the button by the button name and account name.
   * @param {String} buttonName button name.
   * @param {String} accountName account name.
   */
  function getURL(buttonName, accountName) {
    let url;
    switch (buttonName) {
      case "Watching":
        url = location.origin + urlSeparator + "watching";
        break;
      case "Settings":
        url = location.origin + urlSeparator + "settings/profile";
        break;
      case "Stars":
        url = location.origin + urlSeparator + accountName + "?tab=stars";
        break;
      case "Profile":
        url = location.origin + urlSeparator + accountName;
        break;
      case "Repositories":
        url = location.origin + urlSeparator + accountName + "?tab=repositories";
        break;
      default:
        break;
    }
    return url;
  }

  /**
   * Get account name.
   */
  function getAccountName() {
    let accountName = getAccountNameWay1();
    if (accountName == undefined) {
      accountName = getAccountNameWay2();
    }
    return accountName;
  }

  /**
   * The first way to get account name.
   */
  function getAccountNameWay1() {
    let accountName;
    const detailsEle = document.getElementsByClassName("details-overlay details-reset js-feature-preview-indicator-container");
    if (detailsEle && detailsEle != undefined && detailsEle[0] != undefined) {
      const data = detailsEle[0].getAttribute("data-feature-preview-indicator-src");
      if (data != undefined) {
        const dataArr = data.split("/");
        accountName = dataArr[2];
      }
    }
    return accountName;
  }

  /**
   * The second way to get account name.
   */
  function getAccountNameWay2() {
    let accountName;
    const dropdownItems = document.querySelectorAll("a[class=dropdown-item]");
    const itemLength = dropdownItems.length;
    if (itemLength != 0) {
      let accountHref;
      for (let i = 0; i < itemLength; i++) {
        const profileAttrValue = "Header, go to profile, text:your profile";

        const attrValue = dropdownItems[i].getAttribute("data-ga-click");
        if (profileAttrValue == attrValue) {
          accountHref = dropdownItems[i].href;
          break;
        }
      }
      if (accountHref != undefined) {
        const splitArr = accountHref.split("/");
        accountName = splitArr[splitArr.length - 1];
      }
    }
    return accountName;
  }

  /**
   * Get the menu object.
   * @param {Boolean} hasLogin Whether it is logged in.
   */
  function getMenu(hasLogin) {
    const navs = document.getElementsByTagName("nav");
    if (navs && navs != undefined && navs[0] != undefined && "Global" == navs[0].getAttribute("aria-label")) {
      return hasLogin ? navs[0] : navs[0].children[0];
    }
  }

  /**
   * Get the className of menu item A.
   * @param {Object} menu menu.
   * @param {Boolean} hasLogin hasLogin.
   */
  function getAClassName(menu, hasLogin) {
    let className;
    const items = menu.children;
    if (hasLogin) {
      for (let i = 0; i < items.length; i++) {
        if ("A" == items[i].tagName && "Explore" == items[i].innerText) {
          className = items[i].className;
          break;
        }
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        if ("LI" == items[i].tagName && "A" == items[i].children[0].tagName) {
          className = items[i].children[0].className;
          break;
        }
      }
    }
    return className ? className : defaultAClassName;
  }

  /**
   * Get the className of the menu item LI.
   * @param {Object} menu menu.
   */
  function getLiClassName(menu) {
    let className;
    const items = menu.children;
    for (let i = 0; i < items.length; i++) {
      if ("LI" == items[i].tagName && "A" == items[i].children[0].tagName) {
        className = items[i].className;
        break;
      }
    }
    return className ? className : defaultLiClassName;
  }
})();
