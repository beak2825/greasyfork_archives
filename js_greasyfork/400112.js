// ==UserScript==
// @name         MouseHunt - Favorite Setups (fix)
// @author       Tran Situ (tsitu), Re
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      0.3.2.1 (beta)
// @description  Unlimited custom favorite trap setups!
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/400112/MouseHunt%20-%20Favorite%20Setups%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400112/MouseHunt%20-%20Favorite%20Setups%20%28fix%29.meta.js
// ==/UserScript==

(function() {
  const originalOpen = XMLHttpRequest.prototype.open;
  const ownedItems = {
    bait: {},
    base: {},
    skin: {},
    trinket: {},
    weapon: {}
  };
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener("load", function() {
      if (
        this.responseURL ===
        "https://www.mousehuntgame.com/managers/ajax/users/gettrapcomponents.php"
      ) {
        let data;
        try {
          data = JSON.parse(this.responseText).components;
          if (data && data.length > 0) {
              data.forEach(el => {
                  ownedItems[el.classification][el.name] =
                      el.classification === "skin"
                      ? [el.item_id, el.thumbnail, el.component_name]
                  : [el.item_id, el.thumbnail];
              });
              localStorage.setItem(
                  "tsitu-owned-components",
                  JSON.stringify(ownedItems)
              );
              localStorage.setItem("favorite-setup-timestamp", Date.now());
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

      function batchLoad(
        baitName,
        baseName,
        skinName,
        trinketName,
        weaponName
      ) {
            console.log(data.bait[baitName][0])
        const payload = {
          sn: "Hitgrab",
          hg_is_ajax: 1,
          uh: user.unique_hash
        };

        // Diff current setup with proposed batch to minimize server load
        if (baitName !== "N/A" && user.bait_name !== baitName) {
          payload.bait = data.bait[baitName][0];
        }
        if (baseName !== "N/A" && user.base_name !== baseName) {
          payload.base = data.base[baseName][0];
        }
        if (trinketName !== "N/A" && user.trinket_name !== trinketName) {
          payload.trinket = data.trinket[trinketName][0];
        }
        if (weaponName !== "N/A" && user.weapon_name !== weaponName) {
          payload.weapon = data.weapon[weaponName][0];
        }

        if (baitName === "N/A") payload.bait = "disarm";
        if (trinketName === "N/A") payload.trinket = "disarm";
        // Disarm skin too?

        // Cancel if setup isn't changing
        if (Object.keys(payload).length === 3) return;

        // const skinData = data.skin[skinName];
        // if (skinData && skinData[1] === weaponName) {
        //   payload.skin = skinData[0];
        // }

        $.post(
          "https://www.mousehuntgame.com/managers/ajax/users/changetrap.php",
          payload,
          null,
          "json"
        ).done(function(res) {
          const activeTab = document.querySelector(
            ".mousehuntHud-menu > ul > li.active"
          );
          if (activeTab && activeTab.className.indexOf("camp") >= 0) {
            // Refresh page if on Camp tab to update selector images
            // Likely unable to prevent userinventory.php calls from syncArmedItems (mobile desync causes same thing)
            hg.utils.PageUtil.refresh();
          }
        });
      }

      const mainDiv = document.createElement("div");
      mainDiv.id = "tsitu-fave-setups";
      mainDiv.style.backgroundColor = "#F5F5F5";
      mainDiv.style.position = "absolute";
      mainDiv.style.zIndex = "42";
      mainDiv.style.left = "5px";
      mainDiv.style.top = "5px";
      mainDiv.style.border = "solid 3px #696969";
      mainDiv.style.borderRadius = "20px";
      mainDiv.style.padding = "10px";
      mainDiv.style.textAlign = "center";

      const mainSpan = document.createElement("span");
      mainSpan.innerText = "Favorite Setups";
      mainSpan.style = "font-weight: bold; font-size: 24px;";

      const closeButton = document.createElement("button", {
        id: "close-button"
      });
      closeButton.textContent = "x";
      closeButton.onclick = function() {
        document.body.removeChild(mainDiv);
      };

      // Build <datalist> dropdowns
      const dataListTable = document.createElement("table");
      for (let rawCategory in data) {
        let category = rawCategory;
        if (rawCategory === "skin") continue;
        if (rawCategory === "trinket") category = "charm";

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
        labelCol.style.paddingRight = "10px";
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

      const saveButton = document.createElement("button");
      saveButton.style.fontSize = "16px";
      saveButton.textContent = "Save this setup";
      saveButton.onclick = function() {
        const bait = document.querySelector("#favorite-setup-input-bait").value;
        const base = document.querySelector("#favorite-setup-input-base").value;
        // const skin = document.querySelector("#favorite-setup-input-skin").value;
        const charm = document.querySelector("#favorite-setup-input-charm")
          .value;
        const weapon = document.querySelector("#favorite-setup-input-weapon")
          .value;
        const name = document.querySelector("#favorite-setup-name").value;

        if (name.length >= 1 && name.length <= 20) {
          const obj = {};
          obj[name] = {
            bait: "N/A",
            base: "N/A",
            skin: "N/A",
            trinket: "N/A",
            weapon: "N/A"
          };

          if (data.bait[bait] !== undefined) obj[name].bait = bait;
          if (data.base[base] !== undefined) obj[name].base = base;
          // if (data.skin[skin] !== undefined) obj[name].skin = skin;
          if (data.trinket[charm] !== undefined) obj[name].trinket = charm;
          if (data.weapon[weapon] !== undefined) obj[name].weapon = weapon;

          const storedRaw = localStorage.getItem("favorite-setups-saved");
          if (storedRaw) {
            const storedData = JSON.parse(storedRaw);
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
      loadButton.style.fontSize = "12px";
      loadButton.textContent = "Load current setup";
      loadButton.onclick = function() {
        document.querySelector("#favorite-setup-input-bait").value =
          user.bait_name || "";
        document.querySelector("#favorite-setup-input-base").value =
          user.base_name || "";
        // if (user.skin_name) {
        //   document.querySelector("#favorite-setup-input-skin").value =
        //     user.skin_name; // not really a thing, gotta use a qS probably
        // }
        document.querySelector("#favorite-setup-input-charm").value =
          user.trinket_name || "";
        document.querySelector("#favorite-setup-input-weapon").value =
          user.weapon_name || "";
      };

      const resetButton = document.createElement("button");
      resetButton.style.fontSize = "12px";
      resetButton.textContent = "Reset inputs";
      resetButton.onclick = function() {
        document.querySelector("#favorite-setup-input-bait").value = "";
        document.querySelector("#favorite-setup-input-base").value = "";
        // document.querySelector("#favorite-setup-input-skin").value = "";
        document.querySelector("#favorite-setup-input-charm").value = "";
        document.querySelector("#favorite-setup-input-weapon").value = "";
      };

      const buttonSpan = document.createElement("span");
      buttonSpan.style.paddingTop = "8px";
      buttonSpan.style.textAlign = "center";
      buttonSpan.appendChild(saveButton);
      buttonSpan.appendChild(document.createElement("br"));
      buttonSpan.appendChild(document.createElement("br"));
      buttonSpan.appendChild(loadButton);
      buttonSpan.appendChild(document.createTextNode("\u00A0\u00A0"));
      buttonSpan.appendChild(resetButton);

      dataListTable.appendChild(nameRow);
      const dataListDiv = document.createElement("div");
      dataListDiv.appendChild(dataListTable);

      const timeUpdated = document.createElement("span");
      let tsLatestStr = "N/A";
      const tsLatestRaw = localStorage.getItem("favorite-setup-timestamp");
      if (tsLatestRaw) {
        tsLatestStr = new Date(parseInt(tsLatestRaw)).toLocaleString();
      }
      timeUpdated.textContent = `Items last updated: ${tsLatestStr}`;

      const setupTable = document.createElement("table");
      const tableCaption = document.createElement("caption");
      tableCaption.style.textAlign = "center";
      tableCaption.style.fontSize = "15px";
      tableCaption.style.textDecoration = "underline";
      tableCaption.textContent = "Saved Setups";

      const savedRaw = localStorage.getItem("favorite-setups-saved");
      const savedSetups = JSON.parse(savedRaw) || {};
      if (Object.keys(savedSetups).length > 0) {
        setupTable.appendChild(tableCaption);
      }

      Object.keys(savedSetups).forEach(name => {
        const el = savedSetups[name];
        const imgSpan = document.createElement("span");
        imgSpan.style.paddingRight = "10px";
        for (let type in el) {
          if (type === "skin") continue;

          const img = document.createElement("img");
          img.style.height = "40px";
          img.style.width = "40px";
          img.title = el[type];
          if (el[type] === "N/A") {
            if (type === "bait") img.title = "Disarm Bait";
            if (type === "trinket") img.title = "Disarm Charm";
          }
          img.onclick = function() {
            // TODO: Fix this mobile tooltip behavior (hmm low prio because FF works on long press)
            // const appendTitle = img.querySelector(".append-title");
            // if (!appendTitle) {
            //   const appendSpan = document.createElement("span");
            //   appendSpan.className = "append-title";
            //   appendSpan.style.position = "absolute";
            //   appendSpan.style.padding = "4px";
            //   // appendSpan.textContent = el[type];
            //   appendSpan.textContent = img.title;
            //   img.append(appendSpan);
            // } else {
            //   appendTitle.remove();
            // }
          };
          img.src =
            "https://www.mousehuntgame.com/images/items/stats/ee8f12ab8e042415063ef4140cefab7b.gif?cv=243";
          if (data[type][el[type]]) img.src = data[type][el[type]][1];
          imgSpan.appendChild(img);
        }

        const nameSpan = document.createElement("span");
        nameSpan.style.fontSize = "14px";
        nameSpan.textContent = name;

        const nameImgCol = document.createElement("td");
        nameImgCol.style.paddingBottom = "10px";
        nameImgCol.appendChild(nameSpan);
        nameImgCol.appendChild(document.createElement("br"));
        nameImgCol.appendChild(imgSpan);

        const armButton = document.createElement("button");
        armButton.style.fontSize = "14px";
        armButton.style.fontWeight = "bold";
        armButton.textContent = "Arm!";
        armButton.onclick = function() {
          batchLoad(el.bait, el.base, el.skin, el.trinket, el.weapon);
        };

        const deleteButton = document.createElement("button");
        deleteButton.style.fontSize = "14px";
        deleteButton.textContent = "x";
        deleteButton.onclick = function() {
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
        buttonCol.appendChild(armButton);
        buttonCol.appendChild(document.createTextNode("\u00A0\u00A0"));
        buttonCol.appendChild(deleteButton);

        const setupRow = document.createElement("tr");
        setupRow.appendChild(nameImgCol);
        setupRow.appendChild(buttonCol);
        setupTable.appendChild(setupRow);

        // TODO: little (+) button left of setup name that expands img boxes
        //  Option to collapse all by default to provide more visual space
        // TODO: Option to import/export stored list of setups (overwrite?)
        // TODO: Edge cases like Golem Guardian
        // TODO: Skin implementation/checks
      });

      mainDiv.appendChild(closeButton);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(mainSpan);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(timeUpdated);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(dataListDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(buttonSpan);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(setupTable);
      document.body.appendChild(mainDiv);
    } else {
      alert(
        "No owned item data available. Please refresh, click any of the 5 setup-changing boxes, and try again"
      );
    }
  }

  // Inject initial link into UI
  const target = document.querySelector(".mousehuntHud-gameInfo");
  if (target) {
    const link = document.createElement("a");
    link.innerText = "[Favorite Setups]";
    link.addEventListener("click", function() {
      const existing = document.querySelector("#tsitu-fave-setups");
      if (existing) existing.remove();
      else render();
      return false; // Prevent default link clicked behavior
    });
    target.prepend(link);
  }
})();
