// ==UserScript==
// @name         MouseHunt - Send Supplies Search Bar
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.0
// @description  Adds a search bar to make sending supplies easier
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/396714/MouseHunt%20-%20Send%20Supplies%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/396714/MouseHunt%20-%20Send%20Supplies%20Search%20Bar.meta.js
// ==/UserScript==

(function() {
  // Observers are attached to a *specific* element (will DC if removed from DOM)
  const observerTarget = document.getElementById("supplytransfer");
  if (observerTarget) {
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    const observer = new MutationObserver(function() {
      // Callback - render if categoryMenu is in DOM
      if (document.querySelector(".categoryMenu")) {
        // Disconnect and reconnect later to prevent infinite mutation loop
        observer.disconnect();

        const existing = document.querySelector("#tsitu-supply-search");
        if (existing) existing.remove();

        render();

        observer.observe(observerTarget, {
          childList: true,
          subtree: true
        });
      }
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true
    });
  }

  function render() {
    if (window.location.href.indexOf("supplytransfer.php?fid=") >= 0) {
      if (document.querySelector(".categoryMenu .selected")) {
        const elementMapping = {};
        document
          .querySelectorAll(".categoryContent .element.item")
          .forEach(el => {
            const abbrevName = el.querySelector(".details").textContent;
            if (elementMapping[abbrevName] !== undefined) {
              elementMapping[abbrevName].push(el);
            } else {
              elementMapping[abbrevName] = [el];
            }
          });

        // Sort item names
        const sortedObj = {};
        Object.keys(elementMapping)
          .sort()
          .forEach(el => {
            sortedObj[el] = elementMapping[el];
          });

        // Generate UI elements
        const mainDiv = document.createElement("div");
        mainDiv.id = "tsitu-supply-search";
        mainDiv.style.border = "solid 1px #696969";
        mainDiv.style.textAlign = "center";

        // Build <datalist> dropdowns
        const dataList = document.createElement("datalist");
        dataList.id = `supply-search-datalist`;
        Object.keys(sortedObj).forEach(item => {
          if (sortedObj[item].length === 1) {
            const option = document.createElement("option");
            option.value = item;
            dataList.appendChild(option);
          } else {
            for (let i = 0; i < sortedObj[item].length; i++) {
              const option = document.createElement("option");
              option.value = `${item} | ${i}`;
              dataList.appendChild(option);
            }
          }
        });

        const dataListLabel = document.createElement("label");
        dataListLabel.htmlFor = `supply-search-datalist`;
        dataListLabel.textContent = `Search for item:`;

        const dataListInput = document.createElement("input");
        dataListInput.id = `supply-search-input`;
        dataListInput.style.fontSize = "10px";
        dataListInput.setAttribute("list", `supply-search-datalist`);
        dataListInput.addEventListener("keyup", function(e) {
          if (e.keyCode === 13) {
            goButton.click(); // 'Enter' pressed
          }
        });

        const goButton = document.createElement("button");
        goButton.innerText = "Go";
        goButton.onclick = function() {
          let text = document.querySelector("#supply-search-input").value;
          if (text.length > 0) {
            let index = 0;
            if (text.indexOf(" | ") >= 0) {
              const split = text.split(" | ");
              text = split[0];
              index = parseInt(split[1]);
            }
            sortedObj[text][index].click();
          }
        };

        mainDiv.appendChild(dataList);
        mainDiv.appendChild(dataListLabel);
        mainDiv.appendChild(dataListInput);
        mainDiv.appendChild(goButton);
        document
          .querySelector(".categoryMenu")
          .insertAdjacentElement("beforeend", mainDiv);
      }
    }
  }

  render();
})();
