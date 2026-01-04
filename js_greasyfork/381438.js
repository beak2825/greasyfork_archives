// ==UserScript==
// @name         MouseHunt - Location Catch Stats
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.5
// @description  Shows caught and uncaught mouse breeds for every location
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/381438/MouseHunt%20-%20Location%20Catch%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/381438/MouseHunt%20-%20Location%20Catch%20Stats.meta.js
// ==/UserScript==

(function () {
  // Inject link into UI
  const target = document.querySelector(".mousehuntHud-gameInfo");
  if (target) {
    const link = document.createElement("a");
    link.innerText = "[Location Info]";
    link.addEventListener("click", function () {
      const existing = document.querySelector("#tsitu-location-stats");
      if (existing) existing.remove();
      else render();
      return false; // Prevent default link clicked behavior
    });
    target.prepend(link);
  }

  /**
   * Logic to generate the popup
   */
  function render() {
    const existing = document.querySelector("#tsitu-location-stats");
    if (existing) existing.remove();

    let selfTotal = 0;
    let sumTotal = 0;
    const detailDiv = document.createElement("div");
    detailDiv.style.textAlign = "left";

    // Get cached overall data
    const overallRaw = localStorage.getItem("tsitu-location-overall-stats");
    if (overallRaw) {
      const overall = JSON.parse(overallRaw);

      // Cached detailed stats
      const statsObj =
        JSON.parse(localStorage.getItem("tsitu-location-detailed-stats")) || {};

      // Previously opened details
      const prevOpen =
        JSON.parse(localStorage.getItem("tsitu-location-opened"))["open"] || {};

      const completeArr = [];
      const incompleteArr = [];
      for (let loc of Object.keys(overall)) {
        const data = overall[loc];
        if (data.caught === data.total) {
          completeArr.push(loc);
        } else {
          incompleteArr.push(loc);
        }
      }

      // Create 'Incomplete' <details> element
      const incompleteDetail = document.createElement("details");
      incompleteDetail.style.fontSize = "16px";
      incompleteDetail.open = prevOpen.indexOf("Incomplete") >= 0;

      const incompleteSummary = document.createElement("summary");
      incompleteSummary.innerText = "Incomplete";
      incompleteDetail.appendChild(incompleteSummary);

      // Create 'Expand/Collapse All' checkbox for 'Incomplete'
      const incompleteLabel = document.createElement("label");
      incompleteLabel.className = "tsitu-incomplete-box-label";
      incompleteLabel.htmlFor = "tsitu-incomplete-box";
      incompleteLabel.innerText = "Expand/Collapse All";
      incompleteLabel.style.fontSize = "12px";

      const incompleteBox = document.createElement("input");
      incompleteBox.id = "tsitu-incomplete-box";
      incompleteBox.name = "tsitu-incomplete-box";
      incompleteBox.type = "checkbox";
      incompleteBox.checked =
        localStorage.getItem("tsitu-location-expand-incomplete") == "1";

      incompleteBox.addEventListener("click", function () {
        if (document.querySelector("#tsitu-incomplete-box").checked) {
          document.querySelectorAll(".tsitu-incomplete-detail").forEach(el => {
            el.open = true;
          });
          localStorage.setItem("tsitu-location-expand-incomplete", 1);
        } else {
          document.querySelectorAll(".tsitu-incomplete-detail").forEach(el => {
            el.open = false;
          });
          localStorage.setItem("tsitu-location-expand-incomplete", 0);
        }
        cacheOpenedDetails();
      });

      // Insert 'Incomplete' checkbox
      incompleteSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );
      incompleteSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );
      incompleteSummary.insertAdjacentElement("afterend", incompleteLabel);
      incompleteSummary.insertAdjacentElement("afterend", incompleteBox);
      incompleteSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );

      // Generate incomplete location details
      for (let loc of incompleteArr.sort()) {
        generateDetail(loc, "incomplete");
      }

      // Create 'Complete' <details> element
      const completeDetail = document.createElement("details");
      completeDetail.style.fontSize = "16px";
      completeDetail.open = prevOpen.indexOf("Complete") >= 0;

      const completeSummary = document.createElement("summary");
      completeSummary.innerText = "Complete";
      completeDetail.appendChild(completeSummary);

      // Create 'Expand/Collapse All' checkbox for 'Complete'
      const completeLabel = document.createElement("label");
      completeLabel.className = "tsitu-complete-box-label";
      completeLabel.htmlFor = "tsitu-complete-box";
      completeLabel.innerText = "Expand/Collapse All";
      completeLabel.style.fontSize = "12px";

      const completeBox = document.createElement("input");
      completeBox.id = "tsitu-complete-box";
      completeBox.type = "checkbox";
      completeBox.checked =
        localStorage.getItem("tsitu-location-expand-complete") == "1";

      completeBox.addEventListener("click", function () {
        if (document.querySelector("#tsitu-complete-box").checked) {
          document.querySelectorAll(".tsitu-complete-detail").forEach(el => {
            el.open = true;
          });
          localStorage.setItem("tsitu-location-expand-complete", 1);
        } else {
          document.querySelectorAll(".tsitu-complete-detail").forEach(el => {
            el.open = false;
          });
          localStorage.setItem("tsitu-location-expand-complete", 0);
        }
        cacheOpenedDetails();
      });

      // Insert 'Complete' checkbox
      completeSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );
      completeSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );
      completeSummary.insertAdjacentElement("afterend", completeLabel);
      completeSummary.insertAdjacentElement("afterend", completeBox);
      completeSummary.insertAdjacentElement(
        "afterend",
        document.createElement("br")
      );

      // Generate completed location details
      for (let loc of completeArr.sort()) {
        generateDetail(loc, "complete");
      }

      /**
       * Generate inner <details> elements for main "Incomplete" and "Complete"
       * @param {string} loc Location name
       * @param {string} type "incomplete" or "complete"
       */
      function generateDetail(loc, type) {
        const data = overall[loc];
        selfTotal += data.caught;
        sumTotal += data.total;

        const detail = document.createElement("details");
        detail.className =
          type === "complete"
            ? "tsitu-complete-detail"
            : "tsitu-incomplete-detail";
        detail.style.fontSize = "14px";
        detail.style.marginBottom = "5px";

        // Check if previously opened
        if (prevOpen.indexOf(loc) >= 0) {
          detail.open = true;
        }

        const summary = document.createElement("summary");
        summary.innerText = `${loc} (${data.caught} of ${data.total})`;

        const refreshButton = document.createElement("button");
        refreshButton.innerText = "Update";
        refreshButton.addEventListener("click", function () {
          requestLocation(data.type, loc);
        });

        const updateSpan = document.createElement("span");
        updateSpan.style.fontStyle = "italic";
        updateSpan.style.fontSize = "12px";
        updateSpan.innerText = `Updated: ${
          statsObj[loc]
            ? new Date(parseInt(statsObj[loc]["date"])).toLocaleString()
            : "N/A"
        }`;

        // Build body text
        const innerSpan = document.createElement("span");
        let statsText = "\n\n";
        if (statsObj[loc]) {
          let missText = "Not yet caught here: \n";
          const missArr = statsObj[loc]["missing"];

          if (missArr.length === 0) {
            missText =
              "All breeds available in this location\nhave been caught here.\n";
          } else {
            missArr.forEach(el => {
              missText += `- ${el}\n`;
            });
          }

          let caughtText = "";
          const hideCaught =
            localStorage.getItem("tsitu-location-hideCaught") == "1";

          if (!hideCaught) {
            const caughtArr = statsObj[loc]["caught"];
            if (caughtArr.length > 0) {
              caughtText = "Breeds caught here: \n";
              caughtArr.forEach(el => {
                caughtText += `- ${el[0]} (${el[1]})\n`;
              });
              caughtText += "\n";
            }
          }

          statsText += `${missText}\n${caughtText}`;
        }

        innerSpan.innerText += statsText;
        innerSpan.appendChild(refreshButton);
        innerSpan.appendChild(document.createElement("br"));
        innerSpan.appendChild(document.createElement("br"));

        detail.appendChild(summary);
        detail.appendChild(document.createElement("br"));
        detail.appendChild(updateSpan);
        detail.appendChild(innerSpan);

        // Append to the appropriate main <details>
        type === "complete"
          ? completeDetail.appendChild(detail)
          : incompleteDetail.appendChild(detail);
      }

      // Append elements to detailDiv
      detailDiv.appendChild(incompleteDetail);
      detailDiv.appendChild(document.createElement("br"));
      detailDiv.appendChild(completeDetail);
      detailDiv.appendChild(document.createElement("br"));
    }

    // Create and style the main <div>
    const mainDiv = document.createElement("div");
    mainDiv.id = "tsitu-location-stats";
    mainDiv.style.backgroundColor = "#F5F5F5";
    mainDiv.style.position = "absolute";
    mainDiv.style.zIndex = "9999";
    mainDiv.style.left = "35%";
    mainDiv.style.top = "25px";
    mainDiv.style.border = "solid 3px #696969";
    mainDiv.style.borderRadius = "20px";
    mainDiv.style.padding = "10px";
    mainDiv.style.textAlign = "center";

    // Top div styling (close button, title, drag instructions)
    const topDiv = document.createElement("div");

    const titleSpan = document.createElement("span");
    titleSpan.style.fontWeight = "bold";
    titleSpan.style.fontSize = "18px";
    titleSpan.style.textDecoration = "underline";
    titleSpan.style.paddingLeft = "20px";
    titleSpan.innerText = "Location Catch Stats";
    const dragSpan = document.createElement("span");
    dragSpan.innerText = "(Drag title to reposition this popup)";

    const closeButton = document.createElement("button");
    closeButton.style.float = "right";
    closeButton.style.fontSize = "8px";
    closeButton.innerText = "x";
    closeButton.addEventListener("click", function () {
      document.body.removeChild(mainDiv);
    });

    topDiv.appendChild(closeButton);
    topDiv.appendChild(titleSpan);
    topDiv.appendChild(document.createElement("br"));
    topDiv.appendChild(dragSpan);

    const overallUpdateSpan = document.createElement("span");
    const cachedDate = localStorage.getItem("tsitu-location-overall-updated");
    overallUpdateSpan.innerText = `Last updated (overall data): ${
      cachedDate ? new Date(parseInt(cachedDate)).toLocaleString() : "N/A"
    }`;

    const updateOverallButton = document.createElement("button");
    updateOverallButton.innerText = "Update overall completion data";
    updateOverallButton.addEventListener("click", function () {
      cacheOpenedDetails();
      updateOverallData();
    });

    // Checkbox to hide text for caught mice
    const hideCaughtLabel = document.createElement("label");
    hideCaughtLabel.className = "tsitu-hideCaught-box-label";
    hideCaughtLabel.htmlFor = "tsitu-hideCaught-box";
    hideCaughtLabel.innerText = "Hide caught mice";
    hideCaughtLabel.style.fontSize = "12px";

    const hideCaughtBox = document.createElement("input");
    hideCaughtBox.id = "tsitu-hideCaught-box";
    hideCaughtBox.name = "tsitu-hideCaught-box";
    hideCaughtBox.type = "checkbox";
    hideCaughtBox.checked =
      localStorage.getItem("tsitu-location-hideCaught") == "1";

    hideCaughtBox.addEventListener("click", function () {
      if (document.querySelector("#tsitu-hideCaught-box").checked) {
        localStorage.setItem("tsitu-location-hideCaught", 1);
      } else {
        localStorage.setItem("tsitu-location-hideCaught", 0);
      }
      cacheOpenedDetails();
      render();
    });

    // TODO: sumTotal only includes unlocked locations for each user
    const totalSpan = document.createElement("span");
    totalSpan.style.fontSize = "16px";
    totalSpan.innerText = `Total: ${selfTotal} / ${sumTotal}`;

    // Append everything to mainDiv and document
    mainDiv.appendChild(topDiv);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(overallUpdateSpan);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(updateOverallButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    if (sumTotal > 0) {
      mainDiv.appendChild(totalSpan);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
    }
    mainDiv.appendChild(hideCaughtBox);
    mainDiv.appendChild(hideCaughtLabel);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(detailDiv);
    document.body.appendChild(mainDiv);
    dragElement(mainDiv, titleSpan);

    // Reposition popup based on previous dragged location
    const posTop = localStorage.getItem("location-stat-pos-top");
    const posLeft = localStorage.getItem("location-stat-pos-left");
    if (posTop && posLeft) {
      const intTop = parseInt(posTop);
      if (intTop > 0 && intTop < window.innerHeight - 150) {
        mainDiv.style.top = posTop;
      }
      const intLeft = parseInt(posLeft);
      if (intLeft > 0 && intLeft < window.innerWidth - 150) {
        mainDiv.style.left = posLeft;
      }
    }

    // Reposition current location <details> to the top
    let currentDetail;
    let currentLoc = user.environment_name || "N/A";
    if (currentLoc === "Twisted Garden") {
      currentLoc = "Living Garden";
    } else if (currentLoc === "Cursed City") {
      currentLoc = "Lost City";
    } else if (currentLoc === "Sand Crypts") {
      currentLoc = "Sand Dunes";
    }

    document.querySelectorAll("#tsitu-location-stats summary").forEach(el => {
      if (el.textContent.indexOf(currentLoc) >= 0) {
        currentDetail = el.parentElement;
        el.parentElement.remove();
      }
    });

    if (currentDetail) {
      currentDetail.className = "tsitu-current-detail";
      currentDetail.style.textAlign = "left";
      currentDetail.open = true;
      detailDiv.insertAdjacentElement("beforebegin", currentDetail);
      detailDiv.insertAdjacentElement(
        "beforebegin",
        document.createElement("br")
      );
    }
  }

  /**
   * Cache location names for <details> with open = true
   */
  function cacheOpenedDetails() {
    const obj = {};
    const arr = [];

    document
      .querySelectorAll(
        "#tsitu-location-stats details:not(.tsitu-current-detail)"
      )
      .forEach(el => {
        if (el.open) {
          const summary = el.querySelector("summary").textContent;
          if (summary !== "Complete" && summary !== "Incomplete") {
            const loc = summary.split(" (")[0];
            arr.push(loc);
          } else {
            arr.push(summary);
          }
        }
      });

    obj["open"] = arr;
    localStorage.setItem("tsitu-location-opened", JSON.stringify(obj));
  }

  /**
   * Fetch overall/total completion data from getstat.php
   */
  function updateOverallData() {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://www.mousehuntgame.com/managers/ajax/pages/page.php?page_class=HunterProfile&page_arguments%5Btab%5D=mice&page_arguments%5Bsub_tab%5D=location&uh=${user.unique_hash}`
    );

    xhr.onload = function () {
      const response = JSON.parse(xhr.responseText);
      const locations =
        response.page.tabs.mice.subtabs[1].mouse_list.categories;
      if (locations) {
        const masterObj = {};

        locations.forEach(el => {
          const obj = {};
          obj["caught"] = el.caught;
          obj["total"] = el.total;
          obj["type"] = el.type;
          masterObj[el.name] = obj;
        });

        localStorage.setItem(
          "tsitu-location-overall-stats",
          JSON.stringify(masterObj)
        );
        localStorage.setItem("tsitu-location-overall-updated", Date.now());
        render();
      }
    };

    xhr.onerror = function () {
      console.error(xhr.statusText);
    };

    xhr.send();
  }

  /**
   * Fetch individual location data from getstat.php
   * @param {number} category Location category string
   * @param {string} locationName
   */
  function requestLocation(category, locationName) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://www.mousehuntgame.com/managers/ajax/mice/mouse_list.php?action=get_environment&category=${category}&user_id=${user.user_id}&display_mode=stats&view=ViewMouseListEnvironments&uh=${user.unique_hash}`,
      true
    );

    xhr.onload = function () {
      const response = JSON.parse(xhr.responseText);
      const stats = response.mouse_list_category.subgroups[0].mice;
      if (stats) {
        const missedArr = [];
        const caughtArr = [];

        stats.forEach(el => {
          const caught =
            typeof el.num_catches === "string"
              ? parseInt(el.num_catches.replace(/,/g, ""))
              : el.num_catches;
          if (caught === 0) {
            missedArr.push(el.name);
          } else if (caught > 0) {
            caughtArr.push([el.name, caught]);
          }
        });

        const obj = {};
        obj["missing"] = missedArr;
        obj["caught"] = caughtArr;
        obj["date"] = Date.now();

        const cacheRaw = localStorage.getItem("tsitu-location-detailed-stats");
        if (cacheRaw) {
          const cache = JSON.parse(cacheRaw);
          cache[locationName] = obj;
          localStorage.setItem(
            "tsitu-location-detailed-stats",
            JSON.stringify(cache)
          );
        } else {
          const cache = {};
          cache[locationName] = obj;
          localStorage.setItem(
            "tsitu-location-detailed-stats",
            JSON.stringify(cache)
          );
        }

        cacheOpenedDetails();
        render();
      }
    };

    xhr.onerror = function () {
      console.error(xhr.statusText);
    };

    xhr.send();
  }

  /**
   * Element dragging functionality
   * @param {HTMLElement} el Element that actually moves
   * @param {HTMLElement} target Element to drag in order to move 'el'
   */
  function dragElement(el, target) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (document.getElementById(target.id + "header")) {
      document.getElementById(target.id + "header").onmousedown = dragMouseDown;
    } else {
      target.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      localStorage.setItem("location-stat-pos-top", el.style.top);
      localStorage.setItem("location-stat-pos-left", el.style.left);
    }
  }
})();
