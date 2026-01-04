// ==UserScript==
// @name         MouseHunt - Favorite Setups
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.0.7 (MOBILE TESTING)
// @description  Unlimited custom favorite trap setups!
// @grant        GM_addStyle
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/403844/MouseHunt%20-%20Favorite%20Setups.user.js
// @updateURL https://update.greasyfork.org/scripts/403844/MouseHunt%20-%20Favorite%20Setups.meta.js
// ==/UserScript==

(function () {
  // Code for "furf/jquery-ui-touch-punch"
  // !function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

  /*!
   * jQuery UI Touch Punch 0.2.3
   *
   * Copyright 2011–2014, Dave Furfero
   * Dual licensed under the MIT or GPL Version 2 licenses.
   *
   * Depends:
   *  jquery.ui.widget.js
   *  jquery.ui.mouse.js
   */
  (function ($) {
    // Detect touch support
    $.support.touch = "ontouchend" in document;

    // Ignore browsers without touch support
    if (!$.support.touch) {
      return;
    }

    var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled;

    /**
     * Simulate a mouse event based on a corresponding touch event
     * @param {Object} event A touch event
     * @param {String} simulatedType The corresponding mouse event
     */
    function simulateMouseEvent(event, simulatedType) {
      // Ignore multi-touch events
      if (event.originalEvent.touches.length > 1) {
        return;
      }

      event.preventDefault();

      var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent("MouseEvents");

      // Initialize the simulated mouse event using the touch event's coordinates
      simulatedEvent.initMouseEvent(
        simulatedType, // type
        true, // bubbles
        true, // cancelable
        window, // view
        1, // detail
        touch.screenX, // screenX
        touch.screenY, // screenY
        touch.clientX, // clientX
        touch.clientY, // clientY
        false, // ctrlKey
        false, // altKey
        false, // shiftKey
        false, // metaKey
        0, // button
        null // relatedTarget
      );

      // Dispatch the simulated event to the target element
      event.target.dispatchEvent(simulatedEvent);
    }

    /**
     * Handle the jQuery UI widget's touchstart events
     * @param {Object} event The widget element's touchstart event
     */
    mouseProto._touchStart = function (event) {
      var self = this;

      // Ignore the event if another widget is already being handled
      if (
        touchHandled ||
        !self._mouseCapture(event.originalEvent.changedTouches[0])
      ) {
        return;
      }

      // Set the flag to prevent other widgets from inheriting the touch event
      touchHandled = true;

      // Track movement to determine if interaction was a click
      self._touchMoved = false;

      // Simulate the mouseover event
      simulateMouseEvent(event, "mouseover");

      // Simulate the mousemove event
      simulateMouseEvent(event, "mousemove");

      // Simulate the mousedown event
      simulateMouseEvent(event, "mousedown");
    };

    /**
     * Handle the jQuery UI widget's touchmove events
     * @param {Object} event The document's touchmove event
     */
    mouseProto._touchMove = function (event) {
      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }

      // Interaction was not a click
      this._touchMoved = true;

      // Simulate the mousemove event
      simulateMouseEvent(event, "mousemove");
    };

    /**
     * Handle the jQuery UI widget's touchend events
     * @param {Object} event The document's touchend event
     */
    mouseProto._touchEnd = function (event) {
      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }

      // Simulate the mouseup event
      simulateMouseEvent(event, "mouseup");

      // Simulate the mouseout event
      simulateMouseEvent(event, "mouseout");

      // If the touch interaction did not move, it should trigger a click
      if (!this._touchMoved) {
        // Simulate the click event
        simulateMouseEvent(event, "click");
      }

      // Unset the flag to allow other widgets to inherit the touch event
      touchHandled = false;
    };

    /**
     * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
     * This method extends the widget with bound touch event handlers that
     * translate touch events to mouse events and pass them to the widget's
     * original mouse event handling methods.
     */
    mouseProto._mouseInit = function () {
      var self = this;

      // Delegate the touch handlers to the widget's element
      // self.element.bind({
      //   touchstart: $.proxy(self, "_touchStart"),
      //   touchmove: $.proxy(self, "_touchMove"),
      //   touchend: $.proxy(self, "_touchEnd")
      // });
      self.element
        .bind("taphold", $.proxy(self, "_touchStart")) // IMPORTANT!MOD FOR TAPHOLD TO START SORTABLE
        .bind("touchmove", $.proxy(self, "_touchMove"))
        .bind("touchend", $.proxy(self, "_touchEnd"));

      // Call the original $.ui.mouse init method
      _mouseInit.call(self);
    };

    /**
     * Remove the touch event handlers
     */
    mouseProto._mouseDestroy = function () {
      var self = this;

      // Delegate the touch handlers to the widget's element
      self.element.unbind({
        touchstart: $.proxy(self, "_touchStart"),
        touchmove: $.proxy(self, "_touchMove"),
        touchend: $.proxy(self, "_touchEnd")
      });

      // Call the original $.ui.mouse destroy method
      _mouseDestroy.call(self);
    };
  })(jQuery);

  // Sorted from low to high (currently matches top HUD)
  const displayOrder = {
    base: 1,
    weapon: 2,
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
              ownedItems[el.classification][el.name] =
                el.classification === "skin"
                  ? [el.item_id, el.thumbnail, el.component_name]
                  : [el.item_id, el.thumbnail];

              // switch statement for all 5 classifications
              // ^ custom array, last element = image_trap hash if available
              // ^ ideally thumbnail is also just the hash portion, img src can be trivially built dynamically
              // ^ i believe this is for synergy with equipment-preview, so it's not necessary for now
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
        const diff = {};

        // Diff current setup with proposed batch to minimize server load
        if (data.bait[baitName] && user.bait_name !== baitName) {
          diff.bait = data.bait[baitName][0];
        }
        if (data.base[baseName] && user.base_name !== baseName) {
          diff.base = data.base[baseName][0];
        }
        if (data.weapon[weaponName] && user.weapon_name !== weaponName) {
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

        // Cancel if setup isn't changing
        if (Object.keys(diff).length === 0) return;

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        const diffKeys = Object.keys(diff).sort((a, b) => {
          return displayOrder[a] - displayOrder[b];
        });

        for (let classification of diffKeys) {
          const id = diff[classification];
          if (id === "disarm") {
            await hg.utils.TrapControl.disarmItem(classification).go();
          } else {
            await hg.utils.TrapControl.armItem(id, classification).go();
          }
          await sleep(420);
        }

        // Deprecated the old method because unable to prevent userinventory.php calls from syncArmedItems (caused by mobile/regular desync)
        // Witnessed up to an 18 request simul-slam (at least +1 increments starting from 3 / n-1 duplicates with 1 response's items[] different)
        // If switching back to a previous setup then things do seem to be cached
        // CBS may investigate at some point, but going to use the new method above for v1.0 and beyond
      }

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

      const mainSpan = document.createElement("span");
      mainSpan.innerText = "Favorite Setups";
      mainSpan.style = "font-weight: bold; font-size: 24px;";

      const closeButton = document.createElement("button", {
        id: "close-button"
      });
      closeButton.textContent = "x";
      closeButton.onclick = function () {
        document.body.removeChild(mainDiv);
      };

      // Build <datalist> dropdowns
      const dataListTable = document.createElement("table");
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

      const saveButton = document.createElement("button");
      saveButton.style.fontSize = "16px";
      saveButton.textContent = "Save this setup";
      saveButton.onclick = function () {
        const bait = document.querySelector("#favorite-setup-input-cheese")
          .value;
        const base = document.querySelector("#favorite-setup-input-base").value;
        const weapon = document.querySelector("#favorite-setup-input-weapon")
          .value;
        const charm = document.querySelector("#favorite-setup-input-charm")
          .value;
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
      loadButton.style.fontSize = "12px";
      loadButton.textContent = "Import current setup";
      loadButton.onclick = function () {
        document.querySelector("#favorite-setup-input-cheese").value =
          user.bait_name || "";
        document.querySelector("#favorite-setup-input-base").value =
          user.base_name || "";
        document.querySelector("#favorite-setup-input-weapon").value =
          user.weapon_name || "";
        document.querySelector("#favorite-setup-input-charm").value =
          user.trinket_name || "";
        // if (user.skin_name) {
        //   document.querySelector("#favorite-setup-input-skin").value =
        //     user.skin_name; // not really a thing, gotta use a qS probably or parse from LS ID-name map
        // }
      };

      const resetButton = document.createElement("button");
      resetButton.style.fontSize = "12px";
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

      const setupTableDiv = document.createElement("div");
      setupTableDiv.style.overflowY = "scroll";
      setupTableDiv.style.height = "38vh";
      const setupTable = document.createElement("table");
      const setupTbody = document.createElement("tbody");
      const tableCaption = document.createElement("caption");
      tableCaption.id = "tsitu-fave-setup-table-caption";
      tableCaption.style.paddingBottom = "5px";
      tableCaption.style.textAlign = "center";
      tableCaption.style.fontSize = "15px";
      tableCaption.style.textDecoration = "underline";
      tableCaption.textContent = "Saved Setups";

      const savedRaw = localStorage.getItem("favorite-setups-saved");
      const savedSetups = JSON.parse(savedRaw) || {};
      const savedSetupSortKeys = Object.keys(savedSetups).sort((a, b) => {
        return savedSetups[a].sort - savedSetups[b].sort;
      });

      if (savedSetupSortKeys.length > 0) {
        setupTable.appendChild(tableCaption);
      }

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

      // TODO: [high] Location tags on setup creation (checkboxes a la best setups?)
      // TODO: [med]  Import/export setups (overwrite existing or a "profile" dropdown?) (dropbox or pastebin?)
      // TODO: [low]  Edge cases like Golem Guardian (basically skin handling except picking 1 is mandatory)
      // TODO: [low]  Skin implementation/checks (in-progress, but either save for later or scrap entirely since use case is minimal)

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
          img.title = el[type];
          if (el[type] === "N/A") {
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
        nameSpan.className = "tsitu-fave-setup-namespan";
        nameSpan.style.fontSize = "14px";
        nameSpan.textContent = name;

        const nameImgCol = document.createElement("td");
        nameImgCol.style.padding = "5px 0px 5px 8px";
        nameImgCol.appendChild(nameSpan);
        nameImgCol.appendChild(document.createElement("br"));
        nameImgCol.appendChild(imgSpan);

        const armButton = document.createElement("button");
        armButton.style.fontSize = "14px";
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
        buttonCol.appendChild(armButton);
        buttonCol.appendChild(document.createTextNode("\u00A0\u00A0"));
        buttonCol.appendChild(editButton);
        buttonCol.appendChild(document.createTextNode("\u00A0\u00A0"));
        buttonCol.appendChild(deleteButton);

        const setupRow = document.createElement("tr");
        setupRow.className = "tsitu-fave-setup-row";
        setupRow.appendChild(nameImgCol);
        setupRow.appendChild(buttonCol);
        setupTbody.appendChild(setupRow);
      }

      const saveSort = document.createElement("button");
      saveSort.innerText = "Save Sort Order";
      saveSort.onclick = function () {
        // TODO: Investigate mobile UX for drag & drop + scrolling the div
        // MOBILE datalist not popping open dropdown (typing exact string works) + drag & drop not working (touch punch no go so far)
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
      sortSpan.innerText = "Drag & drop to rearrange setup rows";

      GM_addStyle(
        ".ui-state-highlight-tsitu { height: 68px; background-color: #FAFFAF; }"
      );
      $(setupTbody).sortable({
        placeholder: "ui-state-highlight-tsitu",
        scroll: true,
        scrollSensitivity: 20,
        scrollSpeed: 10
      });
      // $(setupTbody).disableSelection();
      // $(setupTbody).draggable();
      setupTable.appendChild(setupTbody);
      setupTableDiv.appendChild(setupTable);
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
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(setupSelectorDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(setupTableDiv);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(saveSort);
      mainDiv.appendChild(resetSort);
      mainDiv.appendChild(document.createElement("br"));
      mainDiv.appendChild(sortSpan);
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
    link.addEventListener("click", function () {
      const existing = document.querySelector("#tsitu-fave-setups");
      if (existing) existing.remove();
      else render();
      return false; // Prevent default link clicked behavior
    });
    target.prepend(link);
  }
})();
