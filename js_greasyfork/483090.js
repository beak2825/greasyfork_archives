// ==UserScript==
// @name PopCat Auto Clicker + Menu (Improved)
// @namespace https://popcat.click
// @version 4.5
// @description Automatically clicks the cat on the PopCat website at a faster rate and provides additional features when the Z key is pressed.
// @author HiraganaDev
// @match https://popcat.click/*
// @grant none
// @icon https://popcat.click/icons/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/483090/PopCat%20Auto%20Clicker%20%2B%20Menu%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483090/PopCat%20Auto%20Clicker%20%2B%20Menu%20%28Improved%29.meta.js
// ==/UserScript==


(function () {
    var autoClickInterval = null;
    var autoClickTimer = null;
    var autoClickEnabled = false;
    var isActiveMenu = false;
    var menuElement = null;
    var clickCount = 0;


    document.addEventListener("keydown", function (event) {
      if (event.key === "z") {
        toggleMenu();
      }
    });


    document.addEventListener("click", function (event) {
      var target = event.target;

      if (isActiveMenu && target !== menuElement && !menuElement.contains(target)) {
        closeMenu();
      }
    });

    function toggleMenu() {
      if (!isActiveMenu) {
        showMenu();
      } else {
        closeMenu();
      }
    }

    function startAutoClick() {
      autoClickEnabled = true;
      autoClickInterval = setInterval(function () {
        clickCat();
      }, 1);

      autoClickTimer = setTimeout(function () {
        clearInterval(autoClickInterval);
        autoClickEnabled = false;
        showAutoClickStats();
        resetClickStats();
      }, 60000);
    }

    function stopAutoClick() {
      autoClickEnabled = false;
      clearInterval(autoClickInterval);
      clearTimeout(autoClickTimer);
    }

    function clickCat() {
      document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true
      }));
      document.dispatchEvent(new KeyboardEvent("keyup", {
        key: "a"
      }));
      clickCount++;
    }

    function showMenu() {
      isActiveMenu = true;

      menuElement = document.createElement("div");
      menuElement.style.position = "fixed";
      menuElement.style.top = "50%";
      menuElement.style.left = "50%";
      menuElement.style.transform = "translate(-50%, -50%)";
      menuElement.style.width = "400px";
      menuElement.style.background = "#ffffff";
      menuElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      menuElement.style.borderRadius = "20px";
      menuElement.style.textAlign = "center";
      menuElement.style.padding = "20px";
      menuElement.style.color = "#333333";
      menuElement.style.fontFamily = "Arial, sans-serif";

      var title = document.createElement("h1");
      title.innerText = "⭐ POPCAT AUTO-CLICKER MENU ⭐";
      title.style.marginTop = "0";
      title.style.marginBottom = "20px";
      title.style.color = "#ff0000";
      title.style.fontSize = "28px";

      var autoClickToggle = document.createElement("div");
      autoClickToggle.innerText = "AutoClicker: " + (autoClickEnabled ? "ON (" + clickCount + " clicks)" : "OFF");
      autoClickToggle.style.cursor = "pointer";
      autoClickToggle.style.marginBottom = "20px";
      autoClickToggle.style.fontSize = "24px";
      autoClickToggle.style.color = autoClickEnabled ? "#00ff00" : "#ff0000";

      autoClickToggle.addEventListener("click", function () {
        if (autoClickEnabled) {
          stopAutoClick();
          autoClickToggle.innerText = "AutoClicker: OFF";
          autoClickToggle.style.color = "#ff0000";
        } else {
          startAutoClick();
          autoClickToggle.innerText = "AutoClicker: ON (" + clickCount + " clicks)";
          autoClickToggle.style.color = "#00ff00";
        }
      });

      var resetStatsButton = document.createElement("button");
      resetStatsButton.innerText = "Reset Clicks";
      resetStatsButton.style.backgroundColor = "#ff0000";
      resetStatsButton.style.color = "#ffffff";
      resetStatsButton.style.border = "none";
      resetStatsButton.style.cursor = "pointer";
      resetStatsButton.style.fontSize = "18px";
      resetStatsButton.style.padding = "10px 20px";
      resetStatsButton.style.borderRadius = "10px";
      resetStatsButton.style.marginTop = "20px";

      resetStatsButton.addEventListener("click", function () {
        resetClickStats();
      });

      var newFeature = document.createElement("p");
      newFeature.innerText = "💥 NEW FEATURE: The style of the menu has been improved 💥";
      newFeature.style.marginTop = "40px";
      newFeature.style.fontSize = "20px";
      newFeature.style.fontWeight = "bold";

      var credits = document.createElement("p");
      credits.innerText = "Developed by HiraganaDev";
      credits.style.fontSize = "16px";
      credits.style.marginTop = "20px";

      menuElement.appendChild(title);
      menuElement.appendChild(autoClickToggle);
      menuElement.appendChild(resetStatsButton);
      menuElement.appendChild(newFeature);
      menuElement.appendChild(credits);

      document.body.appendChild(menuElement);
    }

    function showAutoClickStats() {
      var popupElement = document.createElement("div");
      popupElement.style.position = "fixed";
      popupElement.style.top = "50%";
      popupElement.style.left = "50%";
      popupElement.style.transform = "translate(-50%, -50%)";
      popupElement.style.width = "240px";
      popupElement.style.height = "120px";
      popupElement.style.background = "#ffffff";
      popupElement.style.border = "1px solid #cccccc";
      popupElement.style.borderRadius = "8px";
      popupElement.style.padding = "20px";
      popupElement.style.textAlign = "center";
      popupElement.style.fontFamily = "Arial, sans-serif";
      popupElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";

      var clicksInfo = document.createElement("div");
      clicksInfo.style.fontSize = "16px";
      clicksInfo.style.marginBottom = "10px";
      clicksInfo.innerText = "Total Clicks: " + clickCount;

      popupElement.appendChild(clicksInfo);

      document.body.appendChild(popupElement);

      setTimeout(function () {
        document.body.removeChild(popupElement);
      }, 3000);
    }

    function resetClickStats() {
      clickCount = 0;
    }

    function closeMenu() {
      isActiveMenu = false;

      if (menuElement) {
        document.body.removeChild(menuElement);
      }

      stopAutoClick();
    }
})();