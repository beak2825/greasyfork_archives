// ==UserScript==
// @name         MouseHunt - Favorite Setups
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.5.3
// @description  Unlimited custom favorite trap setups!
// @grant        GM_addStyle
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/388403/MouseHunt%20-%20Favorite%20Setups.user.js
// @updateURL https://update.greasyfork.org/scripts/388403/MouseHunt%20-%20Favorite%20Setups.meta.js
// ==/UserScript==

(function () {
  // Observe Camp page for mutations (to re-inject button)
  const observerTarget = document.querySelector(".mousehuntPage-content");
  if (observerTarget) {
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    const observer = new MutationObserver(function () {
      const campExists = document.querySelector(
        ".mousehuntPage-content.PageCamp"
      );
      if (campExists) {
        // Disconnect and reconnect later to prevent infinite mutation loop
        observer.disconnect();

        // Re-render buttons (mainly for alternate TEM area placement)
        injectUI();

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

  // Sorted from low to high (matches top HUD except weapon/base swapped for clarity)
  const displayOrder = {
    weapon: 1,
    base: 2,
    bait: 3,
    cheese: 3,
    trinket: 4,
    charm: 4,
    skin: 5
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      if (
        this.responseURL ===
        "https://www.mousehuntgame.com/managers/ajax/users/gettrapcomponents.php"
      ) {
        let data;
        try {
          data = JSON.parse(this.responseText).components;
          if (data && data.length > 0) {
            const ownedItems = JSON.parse(
              localStorage.getItem("tsitu-owned-components")
            ) || {
              bait: {},
              base: {},
              weapon: {},
              trinket: {},
              skin: {}
            };

            data.forEach(el => {
              let key = el.name;
              const arr = [el.item_id, el.thumbnail];
              if (el.classification === "skin") {
                arr.push(el.component_name);
              }

              if (el.classification === "weapon") {
                if (el.name.indexOf("Golem Guardian") >= 0) {
                  // Golem Guardian edge case
                  arr[0] = 2732;
                  key = "Golem Guardian Trap";
                } else if (el.name.indexOf("Isle Idol") >= 0) {
                  // Isle Idol edge case
                  arr[0] = 1127;
                  key = "Isle Idol Trap";
                }
                // else if (el.name.indexOf("School of Sharks") >= 0) {
                // key = "School of Sharks";
                // }
              }

              ownedItems[el.classification][key] = arr;

              // switch statement for all 5 classifications
              // ^ custom array, last element = image_trap hash if available
              // ^ ideally thumbnail is also just the hash portion, img src can be trivially built dynamically
              // ^ i believe this is for synergy with equipment-preview, so it's not necessary for now
            });

            // Edge case cleanup
            Object.keys(ownedItems.weapon).forEach(el => {
              if (
                (el.indexOf("Golem Guardian") >= 0 &&
                  el !== "Golem Guardian Trap") ||
                (el.indexOf("Isle Idol") >= 0 && el !== "Isle Idol Trap")
              ) {
                delete ownedItems.weapon[el];
              }
            });

            localStorage.setItem(
              "tsitu-owned-components",
              JSON.stringify(ownedItems)
            );
            localStorage.setItem("favorite-setup-timestamp", Date.now());
            const existing = document.querySelector("#tsitu-fave-setups");
            if (existing) render();
          } else {
            console.log(
              "Invalid components array data from gettrapcomponents.php"
            );
          }
        } catch (error) {
          console.log(
            "Failed to process server response for gettrapcomponents.php"
          );
          console.error(error.stack);
        }
      }
    });
    originalOpen.apply(this, arguments);
  };

  function render() {
    const existing = document.querySelector("#tsitu-fave-setups");
    if (existing) existing.remove();

    const rawData = localStorage.getItem("tsitu-owned-components");
    if (rawData) {
      const data = JSON.parse(rawData);
      const dataKeys = Object.keys(data).sort((a, b) => {
        return displayOrder[a] - displayOrder[b];
      });

      async function batchLoad(
        baitName,
        baseName,
        weaponName,
        trinketName,
        skinName
      ) {
        if (weaponName.indexOf("Golem Guardian") >= 0) {
          weaponName = "Golem Guardian Trap";
        }
        if (weaponName.indexOf("Isle Idol") >= 0) {
          weaponName = "Isle Idol Trap";
        }

        // Edge case `user` checks
        let userWeapon = user.weapon_name;
        // if (userWeapon === "School of Sharks Trap") {
        // userWeapon = "School of Sharks";
        // }

        // Diff current setup with proposed batch to minimize server load
        const diff = {};
        if (data.bait[baitName] && user.bait_name !== baitName) {
          diff.bait = data.bait[baitName][0];
        }
        if (data.base[baseName] && user.base_name !== baseName) {
          diff.base = data.base[baseName][0];
        }
        if (data.weapon[weaponName] && userWeapon !== weaponName) {
          diff.weapon = data.weapon[weaponName][0];
        }
        if (data.trinket[trinketName] && user.trinket_name !== trinketName) {
          diff.trinket = data.trinket[trinketName][0];
        }
        // if (
        //   data.skin[skinName] &&
        //   data.skin[skinName][2] === weaponName &&
        //   user.skin_item_id !== data.skin[skinName][0]
        //   // note: this will probably proc every single time... diff AFTER weapon swap?
        // ) {
        //   diff.skin = data.skin[skinName][0];
        // }

        if (baitName === "N/A") diff.bait = "disarm";
        if (trinketName === "N/A") diff.trinket = "disarm";
        // if (skinName === "N/A") diff.skin = "disarm";

        const diffKeys = Object.keys(diff).sort((a, b) => {
          return displayOrder[a] - displayOrder[b];
        });

        if (diffKeys.length === 0) {
          return; // Cancel if setup isn't changing
        } else if (diffKeys.length >= 2) {
          localStorage.setItem("tsitu-batch-loading", true); // Minimize Mapping Helper TEM requests by setting an in-progress bool
        }

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        let counter = 0;
        for (let classification of diffKeys) {
          /**
           * TODO: Investigate bug that de-skins a weapon if you've used mobile app FS to arm a skinless weapon setup
           * Attempted to emulate browser item selector click by calling `app.pages.CampPage.armItem(element)`
           * Passed in a "fake" element with data-item-id so that `tmpItem` is derived
           * Inside `armItem`: 'syncInventory' and/or 'loadItems' fills in 'trapItems' so that 'getItemById' works
           * Final TrapControl requests seem to be identical with script... so the stuff before might be relevant
           */
          counter += 1;
          if (counter === diffKeys.length) {
            localStorage.setItem("tsitu-batch-loading", false); // Reset bool in time for last request
          }

          const id = diff[classification];
          if (id === "disarm") {
            await hg.utils.TrapControl.disarmItem(classification).go();
          } else {
            await hg.utils.TrapControl.armItem(id, classification).go();
            // const testEl = document.createElement("a");
            // testEl.setAttribute("data-item-id", id);
            // console.log(testEl);
            // await app.pages.CampPage.armItem(testEl);
          }
          await sleep(420);
        }

        // Another reset just in case something goes wrong inside the for...of
        localStorage.setItem("tsitu-batch-loading", false);

        // Deprecated the old method because unable to prevent userinventory.php calls from syncArmedItems (caused by mobile/regular desync)
        // Witnessed up to an 18 request simul-slam (at least +1 increments starting from 3 / n-1 duplicates with 1 response's items[] different)
        // If switching back to a previous setup then things do seem to be cached
        // CBS may investigate at some point, but going to use the new method above for v1.0 and beyond
      }

      // Main popup styling
      const mainDiv = document.createElement("div");
      mainDiv.id = "tsitu-fave-setups";
      mainDiv.style.backgroundColor = "#F5F5F5";
      mainDiv.style.position = "fixed";
      mainDiv.style.zIndex = "42";
      mainDiv.style.left = "5px";
      mainDiv.style.top = "5px";
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
      titleSpan.innerText = "Favorite Setups";
      const dragSpan = document.createElement("span");
      dragSpan.innerText = "(Drag title to reposition this popup)";

      const closeButton = document.createElement("button");
      closeButton.style.float = "right";
      closeButton.style.fontSize = "8px";
      closeButton.textContent = "x";
      closeButton.onclick = function () {
        document.body.removeChild(mainDiv);
      };

      topDiv.appendChild(closeButton);
      topDiv.appendChild(titleSpan);
      topDiv.appendChild(document.createElement("br"));
      topDiv.appendChild(dragSpan);

      // Build <datalist> dropdowns
      const dataListTable = document.createElement("table");
      dataListTable.style.margin = "0 auto";
      for (let rawCategory of dataKeys) {
        let category = rawCategory;
        if (category === "sort") continue;
        if (category === "skin") continue; // note: only show appropriate skins if implementing
        if (category === "bait") category = "cheese";
        if (category === "trinket") category = "charm";

        const dataList = document.createElement("datalist");
        dataList.id = `favorite-setup-datalist-${category}`;
        for (let item of Object.keys(data[rawCategory]).sort()) {
          const option = document.createElement("option");
          option.value = item;
          dataList.appendChild(option);
        }

        const dataListLabel = document.createElement("label");
        dataListLabel.htmlFor = `favorite-setup-input-${category}`;
        dataListLabel.textContent = `Select ${category}: `;

        const dataListInput = document.createElement("input");
        dataListInput.id = `favorite-setup-input-${category}`;
        dataListInput.setAttribute(
          "list",
          `favorite-setup-datalist-${category}`
        );

        const dataListRow = document.createElement("tr");
        const labelCol = document.createElement("td");
        labelCol.style.paddingRight = "8px";
        const inputCol = document.createElement("td");
        labelCol.appendChild(dataList);
        labelCol.appendChild(dataListLabel);
        inputCol.appendChild(dataListInput);
        dataListRow.appendChild(labelCol);
        dataListRow.appendChild(inputCol);
        dataListTable.appendChild(dataListRow);
      }

      const nameSpan = document.createElement("span");
      nameSpan.textContent = "Setup name: ";
      const nameSpanCol = document.createElement("td");
      nameSpanCol.appendChild(nameSpan);

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.id = "favorite-setup-name";
      nameInput.required = true;
      nameInput.minLength = 1;
      nameInput.maxLength = 20;
      const nameInputCol = document.createElement("td");
      nameInputCol.appendChild(nameInput);

      const nameRow = document.createElement("tr");
      nameRow.appendChild(nameSpanCol);
      nameRow.appendChild(nameInputCol);
      dataListTable.appendChild(nameRow);
      const dataListDiv = document.createElement("div");
      dataListDiv.appendChild(dataListTable);

      // Import setup / Save setup / Reset input buttons
      const saveButton = document.createElement("button");
      saveButton.style.fontSize = "15px";
      saveButton.style.fontWeight = "bold";
      saveButton.textContent = "Save Setup";
      saveButton.onclick = function () {
        const bait = document.querySelector(
          "#favorite-setup-input-cheese"
        ).value;
        const base = document.querySelector("#favorite-setup-input-base").value;
        const weapon = document.querySelector(
          "#favorite-setup-input-weapon"
        ).value;
        const charm = document.querySelector(
          "#favorite-setup-input-charm"
        ).value;
        // const skin = document.querySelector("#favorite-setup-input-skin").value;
        const name = document.querySelector("#favorite-setup-name").value;

        if (name.length >= 1 && name.length <= 20) {
          const obj = {};
          obj[name] = {
            bait: "N/A",
            base: "N/A",
            weapon: "N/A",
            trinket: "N/A",
            skin: "N/A"
          };

          if (data.bait[bait] !== undefined) obj[name].bait = bait;
          if (data.base[base] !== undefined) obj[name].base = base;
          if (data.weapon[weapon] !== undefined) obj[name].weapon = weapon;
          if (data.trinket[charm] !== undefined) obj[name].trinket = charm;
          // if (data.skin[skin] !== undefined) obj[name].skin = skin;
          obj[name].sort = -1;

          const storedRaw = localStorage.getItem("favorite-setups-saved");
          if (storedRaw) {
            const storedData = JSON.parse(storedRaw);
            if (storedData[name] !== undefined) {
              if (confirm(`Do you want to overwrite saved setup '${name}'?`)) {
                obj[name].sort = storedData[name].sort;
              } else {
                return;
              }
            }
            storedData[name] = obj[name];
            localStorage.setItem(
              "favorite-setups-saved",
              JSON.stringify(storedData)
            );
          } else {
            localStorage.setItem("favorite-setups-saved", JSON.stringify(obj));
          }
          render();
        } else {
          alert(
            "Please enter a name for your setup that is between 1-20 characters"
          );
        }
      };

      const loadButton = document.createElement("button");
      loadButton.style.fontSize = "11px";
      loadButton.textContent = "Import setup";
      loadButton.onclick = function () {
        // Edge case `user` checks
        let userWeapon = user.weapon_name;
        // if (userWeapon === "School of Sharks Trap") {
        // userWeapon = "School of Sharks";
        // }

        document.querySelector("#favorite-setup-input-cheese").value =
          user.bait_name || "";
        document.querySelector("#favorite-setup-input-base").value =
          user.base_name || "";
        document.querySelector("#favorite-setup-input-weapon").value =
          userWeapon || "";
        document.querySelector("#favorite-setup-input-charm").value =
          user.trinket_name || "";
        // if (user.skin_name) {
        //   document.querySelector("#favorite-setup-input-skin").value =
        //     user.skin_name; // not really a thing, gotta use a qS probably or parse from LS ID-name map
        // }
      };

      const resetButton = document.createElement("button");
      resetButton.style.fontSize = "11px";
      resetButton.textContent = "Reset inputs";
      resetButton.onclick = function () {
        document.querySelector("#favorite-setup-input-cheese").value = "";
        document.querySelector("#favorite-setup-input-base").value = "";
        document.querySelector("#favorite-setup-input-weapon").value = "";
        document.querySelector("#favorite-setup-input-charm").value = "";
        // document.querySelector("#favorite-setup-input-skin").value = "";
        document.querySelector("#favorite-setup-name").value = "";
      };

      const buttonSpan = document.createElement("span");
      buttonSpan.style.paddingTop = "8px";
      buttonSpan.style.textAlign = "center";
      buttonSpan.appendChild(loadButton);
      buttonSpan.appendChild(document.createTextNode("\u00A0\u00A0"));
      buttonSpan.appendChild(saveButton);
      buttonSpan.appendChild(document.createTextNode("\u00A0\u00A0"));
      buttonSpan.appendChild(resetButton);

      // Items last updated span
      const timeUpdated = document.createElement("span");
      let tsLatestStr = "N/A";
      const tsLatestRaw = localStorage.getItem("favorite-setup-timestamp");
      if (tsLatestRaw) {
        tsLatestStr = new Date(parseInt(tsLatestRaw)).toLocaleString();
      }
      timeUpdated.textContent = `[Owned items last updated: ${tsLatestStr}]`;

      // Setup table styling
      const setupTableDiv = document.createElement("div");
      setupTableDiv.style.overflowY = "scroll";
      setupTableDiv.style.height = "50vh";
      const setupTable = document.createElement("table");
      const setupTbody = document.createElement("tbody");

      // Sort existing saved setups
      const savedRaw = localStorage.getItem("favorite-setups-saved");
      const savedSetups = JSON.parse(savedRaw) || {};
      const savedSetupSortKeys = Object.keys(savedSetups).sort((a, b) => {
        return savedSetups[a].sort - savedSetups[b].sort;
      });

      // Create setup dropdown selector
      const setupSelector = document.createElement("datalist");
      setupSelector.id = "favorite-setup-selector";
      for (let item of savedSetupSortKeys) {
        const option = document.createElement("option");
        option.value = item;
        setupSelector.appendChild(option);
      }

      const setupSelectorLabel = document.createElement("label");
      setupSelectorLabel.htmlFor = "favorite-setup-selector-input";
      setupSelectorLabel.textContent = `Jump to setup: `;

      const setupSelectorInput = document.createElement("input");
      setupSelectorInput.id = "favorite-setup-selector-input";
      setupSelectorInput.setAttribute("list", "favorite-setup-selector");
      setupSelectorInput.oninput = function () {
        const name = setupSelectorInput.value;
        if (savedSetups[name] !== undefined) {
          const rows = document.querySelectorAll("tr.tsitu-fave-setup-row");
          rows.forEach(el => {
            el.style.backgroundColor = "";
          });

          /**
           * Return row element that matches dropdown setup name
           * @param {string} name Dropdown setup name
           * @return {HTMLElement|false} <tr> that should be highlighted and scrolled to
           */
          function findElement(name) {
            for (let el of rows) {
              const spans = el.querySelectorAll("span");
              if (spans.length === 2) {
                if (name === spans[0].textContent) {
                  return el;
                }
              }
            }

            return false;
          }

          // Calculate index for nth-child
          const targetEl = findElement(name);
          let nthChildValue = 0;
          for (let i = 0; i < rows.length; i++) {
            const el = rows[i];
            if (el === targetEl) {
              nthChildValue = i + 1;
              break;
            }
          }

          // tr:nth-child value (min = 1)
          const scrollRow = document.querySelector(
            `tr.tsitu-fave-setup-row:nth-child(${nthChildValue})`
          );
          if (scrollRow) {
            scrollRow.style.backgroundColor = "#D6EBA1";
            scrollRow.scrollIntoView({
              behavior: "auto",
              block: "nearest",
              inline: "nearest"
            });
          }

          setupSelectorInput.value = "";
        }
      };

      const setupSelectorDiv = document.createElement("div");
      setupSelectorDiv.appendChild(setupSelector);
      setupSelectorDiv.appendChild(setupSelectorLabel);
      setupSelectorDiv.appendChild(setupSelectorInput);

      // TODO: Improve async logic, probably await completion of a component switch otherwise might overlap and/or silently fail
      // TODO: [high] Location tags on setup creation (checkboxes a la best setups)
      // TODO: [med]  Import/export setup "profiles" (separate dropdown of profiles) (export specific profile obj to dropbox/pastebin?)
      // ^ Profile management could be an elegant bulk grouping solution if done properly
      // TODO: [med]  Mobile UX for drag & drop as well as scrollable div (jquery-ui-touch-punch did not work for simulating touch events)
      // TODO: [low]  Skin implementation/checks (in-progress, but either save for later or scrap entirely since use case is minimal)

      // Generate and append each saved setup as a new <tr>
      savedSetupSortKeys.forEach(name => {
        generateRow(name);
      });

      function generateRow(name) {
        const el = savedSetups[name];
        const elKeys = Object.keys(savedSetups[name]).sort((a, b) => {
          return displayOrder[a] - displayOrder[b];
        });

        const imgSpan = document.createElement("span");
        imgSpan.style.paddingRight = "10px";
        for (let type of elKeys) {
          if (type === "sort") continue;
          if (type === "skin") continue;

          const img = document.createElement("img");
          img.style.height = "40px";
          img.style.width = "40px";
          let item = el[type];
          if (data.weapon["Golem Guardian Trap"] !== undefined) {
            if (type === "weapon") {
              if (item.indexOf("Golem Guardian") >= 0) {
                item = "Golem Guardian Trap";
              } else if (item.indexOf("Isle Idol") >= 0) {
                item = "Isle Idol Trap";
              }
            }
          }
          img.title = item;
          if (item === "N/A") {
            if (type === "bait") img.title = "Disarm Bait";
            if (type === "trinket") img.title = "Disarm Charm";
            // if (type === "skin") img.title = "Disarm Skin";
          }
          img.onclick = function () {
            // Mobile tooltip behavior = LOW priority because long pressing works on FF
            // const appendTitle = img.querySelector(".append-title");
            // if (!appendTitle) {
            //   const appendSpan = document.createElement("span");
            //   appendSpan.className = "append-title";
            //   appendSpan.style.position = "absolute";
            //   appendSpan.style.padding = "4px";
            //   // appendSpan.textContent = item;
            //   appendSpan.textContent = img.title;
            //   img.append(appendSpan);
            // } else {
            //   appendTitle.remove();
            // }
          };
          img.src =
            "https://www.mousehuntgame.com/images/items/stats/ee8f12ab8e042415063ef4140cefab7b.gif?cv=243";
          if (data[type][item]) img.src = data[type][item][1];
          imgSpan.appendChild(img);
        }

        const nameSpan = document.createElement("span");
        nameSpan.className = "tsitu-fave-setup-namespan";
        nameSpan.style.fontSize = "14px";
        nameSpan.textContent = name;

        const nameImgCol = document.createElement("td");
        nameImgCol.style.padding = "5px 0px 5px 8px";
        nameImgCol.appendChild(nameSpan);
        nameImgCol.appendChild(document.createElement("br"));
        nameImgCol.appendChild(imgSpan);

        const armButton = document.createElement("button");
        armButton.style.fontSize = "16px";
        armButton.style.fontWeight = "bold";
        armButton.textContent = "Arm!";
        armButton.onclick = function () {
          batchLoad(el.bait, el.base, el.weapon, el.trinket, el.skin);
        };

        const editButton = document.createElement("button");
        editButton.style.fontSize = "10px";
        editButton.textContent = "✏️";
        editButton.onclick = function () {
          document.querySelector("#favorite-setup-input-cheese").value =
            el.bait === "N/A" ? "" : el.bait;
          document.querySelector("#favorite-setup-input-base").value =
            el.base === "N/A" ? "" : el.base;
          document.querySelector("#favorite-setup-input-weapon").value =
            el.weapon === "N/A" ? "" : el.weapon;
          document.querySelector("#favorite-setup-input-charm").value =
            el.trinket === "N/A" ? "" : el.trinket;
          // document.querySelector("#favorite-setup-input-skin").value =
          // el.skin === "N/A" ? "" : el.skin;
          document.querySelector("#favorite-setup-name").value = name || "";
        };

        const deleteButton = document.createElement("button");
        deleteButton.style.fontSize = "12px";
        deleteButton.textContent = "x";
        deleteButton.onclick = function () {
          if (confirm(`Delete setup '${name}'?`)) {
            const storedRaw = localStorage.getItem("favorite-setups-saved");
            if (storedRaw) {
              const storedData = JSON.parse(storedRaw);
              if (storedData[name]) delete storedData[name];
              localStorage.setItem(
                "favorite-setups-saved",
                JSON.stringify(storedData)
              );
              render();
            }
          }
        };

        const buttonCol = document.createElement("td");
        buttonCol.style.textAlign = "center";
        buttonCol.style.verticalAlign = "middle";
        buttonCol.style.paddingRight = "10px";
        buttonCol.appendChild(editButton);
        buttonCol.appendChild(document.createTextNode("\u00A0"));
        buttonCol.appendChild(deleteButton);
        buttonCol.appendChild(document.createElement("br"));
        buttonCol.appendChild(armButton);

        const setupRow = document.createElement("tr");
        setupRow.className = "tsitu-fave-setup-row";
        setupRow.appendChild(nameImgCol);
        setupRow.appendChild(buttonCol);
        setupTbody.appendChild(setupRow);
      }

      // Save and reset sort buttons
      const saveSort = document.createElement("button");
      saveSort.innerText = "Save Sort Order";
      saveSort.onclick = function () {
        if (confirm("Are you sure you'd like to save this sort order?")) {
          const storedRaw = localStorage.getItem("favorite-setups-saved");
          if (storedRaw) {
            const storedData = JSON.parse(storedRaw);
            const nameSpans = document.querySelectorAll(
              ".tsitu-fave-setup-namespan"
            );
            if (nameSpans.length === Object.keys(storedData).length) {
              for (let i = 0; i < nameSpans.length; i++) {
                const name = nameSpans[i].textContent;
                if (storedData[name] !== undefined) {
                  storedData[name].sort = i;
                }
              }
              localStorage.setItem(
                "favorite-setups-saved",
                JSON.stringify(storedData)
              );
              render();
            }
          }
        }
      };

      const resetSort = document.createElement("button");
      resetSort.innerText = "Reset Sort Order";
      resetSort.onclick = function () {
        if (
          confirm("Are you sure you'd like to reset to last saved sort order?")
        ) {
          render();
        }
      };
      const sortSpan = document.createElement("span");
      sortSpan.innerText = "Drag & drop to rearrange setup rows (PC only)";

      // Make the table drag & drop-able via jQuery sortable()
      GM_addStyle(
        ".ui-state-highlight-tsitu { height: 68px; background-color: #FAFFAF; }"
      );
      $(setupTbody).sortable({
        placeholder: "ui-state-highlight-tsitu",
        scroll: true,
        scrollSensitivity: 20,
        scrollSpeed: 20
      });
      setupTable.appendChild(setupTbody);
      setupTableDiv.appendChild(setupTable);

      // Append everything to main popup UI
      mainDiv.appendChild(topDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(dataListDiv);
      mainDiv.appendChild(timeUpdated);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(buttonSpan);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(setupSelectorDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(setupTableDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(saveSort);
      mainDiv.appendChild(document.createTextNode("\u00A0\u00A0"));
      mainDiv.appendChild(resetSort);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(sortSpan);
      document.body.appendChild(mainDiv);
      dragElement(mainDiv, titleSpan);

      // Reposition popup based on previous dragged location
      const posTop = localStorage.getItem("favorite-setup-pos-top");
      const posLeft = localStorage.getItem("favorite-setup-pos-left");
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
    } else {
      alert(
        "No owned item data available. Please refresh, click any of the 5 setup-changing boxes, and try again"
      );
    }
  }

  // Inject initial button/link into UI
  function injectUI() {
    document.querySelectorAll("#fave-setup-button").forEach(el => el.remove());

    const lsPlacement = localStorage.getItem("favorite-setup-placement");
    if (lsPlacement === "tem") {
      const target = document.querySelector(
        ".campPage-trap-armedItemContainer"
      );
      if (target) {
        const div = document.createElement("div");
        div.id = "fave-setup-button";
        const button = document.createElement("button");
        button.innerText = "Favorite Setups";
        button.addEventListener("click", function () {
          const existing = document.querySelector("#tsitu-fave-setups");
          if (existing) existing.remove();
          else render();
        });
        button.addEventListener("contextmenu", function () {
          if (confirm("Toggle 'Favorite Setups' placement?")) {
            localStorage.setItem("favorite-setup-placement", "top");
            injectUI();
          } else {
            localStorage.setItem("favorite-setup-placement", "tem");
          }
        });
        div.appendChild(document.createElement("br"));
        div.appendChild(button);
        target.appendChild(div);
      }
    } else {
      const target = document.querySelector(".mousehuntHud-gameInfo");
      if (target) {
        const link = document.createElement("a");
        link.id = "fave-setup-button";
        link.innerText = "[Favorite Setups]";
        link.addEventListener("click", function () {
          const existing = document.querySelector("#tsitu-fave-setups");
          if (existing) existing.remove();
          else render();
          return false; // Prevent default link clicked behavior
        });
        link.addEventListener("contextmenu", function () {
          if (confirm("Toggle '[Favorite Setups]' placement?")) {
            localStorage.setItem("favorite-setup-placement", "tem");
            injectUI();
          } else {
            localStorage.setItem("favorite-setup-placement", "top");
          }
        });
        target.prepend(link);
      }
    }
  }
  injectUI();

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
      localStorage.setItem("favorite-setup-pos-top", el.style.top);
      localStorage.setItem("favorite-setup-pos-left", el.style.left);
    }
  }
})();
