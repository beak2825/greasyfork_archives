// ==UserScript==
// @name         我家在... 改
// @namespace    https://114514.plus/
// @version      0.2.1
// @description  自动修改淘宝/天猫/京东等购物页面的"配送至"地址，在你分享商品截图的时候保护隐私。
// @author       jkfujr
// @match        https://www.jd.com/*
// @match        https://item.jd.com/*.html*
// @match        https://cart.jd.com/cart_index*
// @match        https://npcitem.jd.hk/*.html*
// @match        https://*.detail.tmall.com/item.htm*
// @match        https://*.detail.tmall.hk/hk/item.htm*
// @match        https://item.taobao.com/item.htm*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485998/%E6%88%91%E5%AE%B6%E5%9C%A8%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/485998/%E6%88%91%E5%AE%B6%E5%9C%A8%20%E6%94%B9.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 初始化
  if (GM_getValue("addressSpoofingEnabled") === undefined) {
    GM_setValue("addressSpoofingEnabled", true);
  }
  if (GM_getValue("fakeAddress1") === undefined) {
    GM_setValue("fakeAddress1", "日本");
  }
  if (GM_getValue("fakeAddress2") === undefined) {
    GM_setValue("fakeAddress2", "下北沢");
  }
  if (GM_getValue("addressSpoofingDelay") === undefined) {
    GM_setValue("addressSpoofingDelay", 2500);
  }

  // 获取设置
  var addressSpoofingEnabled = GM_getValue("addressSpoofingEnabled");
  var fakeAddress1 = GM_getValue("fakeAddress1");
  var fakeAddress2 = GM_getValue("fakeAddress2");
  var addressSpoofingDelay = GM_getValue("addressSpoofingDelay");

  // 菜单
  function registerMenu() {
    if (window.toggleMenuCommand)
      GM_unregisterMenuCommand(window.toggleMenuCommand);
    if (window.addressEditCommand)
      GM_unregisterMenuCommand(window.addressEditCommand);
    if (window.delayCommand) GM_unregisterMenuCommand(window.delayCommand);
    var menuText = (addressSpoofingEnabled ? "✅ " : "❌ ") + "地址伪装";
    window.toggleMenuCommand = GM_registerMenuCommand(menuText, function () {
      addressSpoofingEnabled = !addressSpoofingEnabled;
      GM_setValue("addressSpoofingEnabled", addressSpoofingEnabled);
      registerMenu();
      location.reload();
    });

    window.addressEditCommand = GM_registerMenuCommand(
      "✏️ 地址修改",
      function () {
        var address1 = prompt("请输入主要地址 (如省份/国家):", fakeAddress1);
        if (address1 !== null) {
          fakeAddress1 = address1 || "日本";
          GM_setValue("fakeAddress1", fakeAddress1);

          var address2 = prompt("请输入次要地址 (如城市/地区):", fakeAddress2);
          if (address2 !== null) {
            fakeAddress2 = address2 || "下北沢";
            GM_setValue("fakeAddress2", fakeAddress2);
            registerMenu();
            location.reload();
          }
        }
      }
    );

    window.delayCommand = GM_registerMenuCommand(`⏱️ 伪装延迟`, function () {
      var delay = prompt("请输入伪装延迟时间 (毫秒):", addressSpoofingDelay);
      if (delay !== null) {
        addressSpoofingDelay = parseInt(delay) || 2500;
        GM_setValue("addressSpoofingDelay", addressSpoofingDelay);
        registerMenu();
      }
    });
  }

  registerMenu();

  function replaceAddresses() {
    switch (window.location.host) {
      case "item.jd.com":
      case "npcitem.jd.hk":
      case "www.jd.com": {
        // 商品页
        var jdAddressElement = document.querySelector(".ui-area-text");
        if (jdAddressElement) {
          var replacementText = fakeAddress1 + " " + fakeAddress2;
          if (jdAddressElement.innerText !== replacementText) {
            jdAddressElement.innerText = replacementText;
            if (jdAddressElement.hasAttribute("title")) {
              jdAddressElement.title = replacementText;
            }
          }
        }

        // 导航栏地址（商品页和首页）
        var navSelectors = [".ui-areamini-text", ".ui-areamini-text-wrap .ui-areamini-text"];
        navSelectors.forEach(function(selector) {
          var navElement = document.querySelector(selector);
          if (navElement) {
            var navReplacementText = "京东全球版 - " + fakeAddress1;
            if (navElement.innerText !== navReplacementText) {
              navElement.innerText = navReplacementText;
              if (navElement.hasAttribute("title")) {
                navElement.title = navReplacementText;
              }
            }
          }
        });
        break;
      }
      case "cart.jd.com": {
        if (window.location.pathname === "/cart_index") {
          var jdCartAddressElement = document.querySelector(".ui-area-text");
          if (jdCartAddressElement) {
            var replacementText = fakeAddress1 + " " + fakeAddress2;
            if (jdCartAddressElement.innerText !== replacementText) {
              jdCartAddressElement.innerText = replacementText;
              if (jdCartAddressElement.hasAttribute("title")) {
                jdCartAddressElement.title = replacementText;
              }
            }
          }
        }
        break;
      }
      case "detail.tmall.com":
      case "detail.tmall.hk":
      case "chaoshi.detail.tmall.com":
      case "item.taobao.com": {
        var taobaoAddressElement = null;
        var addrWrap = document.querySelector("[class*='deliveryAddrWrap']");
        if (addrWrap) {
          var spanElement = addrWrap.querySelector("span");
          if (spanElement && spanElement.textContent.includes("至")) {
            taobaoAddressElement = spanElement;
          }
        }
        if (!taobaoAddressElement) {
          var allSpans = document.querySelectorAll("span");
          for (var i = 0; i < allSpans.length; i++) {
            var span = allSpans[i];
            var text = span.textContent.trim();
            if (text.includes("至") && text.length < 50) {
              taobaoAddressElement = span;
              break;
            }
          }
        }

        // 旧版本
        if (!taobaoAddressElement) {
          taobaoAddressElement = document.querySelector(
            "[class*='--select-trigger--']"
          );
        }

        if (taobaoAddressElement) {
          var originalText = taobaoAddressElement.textContent.trim();
          var replacementText;

          if (originalText.includes("至")) {
            var parts = originalText.split("至");
            if (parts.length > 1) {
              var targetAddr = parts[1].trim();
              if (targetAddr.includes(" ")) {
                replacementText =
                  parts[0].trim() + " 至 " + fakeAddress1 + " " + fakeAddress2;
              } else {
                replacementText = parts[0].trim() + " 至 " + fakeAddress1;
              }
            } else {
              replacementText = fakeAddress1;
            }
          } else {
            // 兼容
            if (originalText.includes(" ") || originalText.length > 3) {
              replacementText = fakeAddress1 + " " + fakeAddress2;
            } else {
              replacementText = fakeAddress1;
            }
          }

          if (taobaoAddressElement.textContent.trim() !== replacementText) {
            taobaoAddressElement.textContent = replacementText;
            if (taobaoAddressElement.hasAttribute("title")) {
              taobaoAddressElement.title = replacementText;
            }
          }
        }
        break;
      }
    }
  }

  if (addressSpoofingEnabled) {
    setTimeout(replaceAddresses, addressSpoofingDelay);

    // 监听DOM变化，处理地址
    var observer = new MutationObserver(function (mutations) {
      var shouldReplace = false;
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          var target = mutation.target;
          if (
            target.classList &&
            (target.classList.contains("ui-area-text") ||
              target.classList.contains("ui-areamini-text") ||
              target.className.includes("deliveryAddrWrap") ||
              target.className.includes("select-trigger"))
          ) {
            shouldReplace = true;
          }
          var parent = target.parentElement;
          if (
            parent &&
            parent.classList &&
            (parent.classList.contains("ui-area-text") ||
              parent.classList.contains("ui-areamini-text") ||
              parent.className.includes("deliveryAddrWrap"))
          ) {
            shouldReplace = true;
          }
        }
      });

      if (shouldReplace) {
        setTimeout(replaceAddresses, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
})();
