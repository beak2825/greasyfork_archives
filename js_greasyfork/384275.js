// ==UserScript==
// @name         MouseHunt - Mapping Helper
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      2.7.0
// @description  Map interface improvements (invite via Hunter ID, direct send SB+, TEM-based available uncaught map mice)
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/384275/MouseHunt%20-%20Mapping%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/384275/MouseHunt%20-%20Mapping%20Helper.meta.js
// ==/UserScript==

(function () {
  // Endpoint listener - caches maps (which come in one at a time)
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      const url = this.responseURL;
      let data = this.responseText;
      try {
          data = JSON.parse(data);
      } catch (error) {
        // Ignore non-JSON responses
        return;
      }

      treasureMapListener(url, data);
      temListener(url, data);

      // Check whether remaining map mice has updated for the map/TEM feature
      const rhMap = user.quests.QuestRelicHunter;
      if (rhMap && rhMap.maps.length > 0) {
        let currentMap;
        rhMap.maps.forEach(el => {
          if (el.map_id === rhMap.default_map_id) {
            currentMap = el; // Set "Active" map
          }
        });

        if (currentMap.name.indexOf("Scavenger") < 0) {
          const remainStr = currentMap.remaining
            ? `${currentMap.map_id}~${currentMap.remaining}`
            : `${currentMap.map_id}~${currentMap.num_found}`;
          const cacheRemain = localStorage.getItem("tsitu-maptem-remain");
          if (cacheRemain) {
            if (remainStr !== cacheRemain) {
              // Map state has changed - fetch latest data
              localStorage.setItem("tsitu-maptem-remain", remainStr);
              updateMapData(currentMap.map_id);
            } else {
              // Map state unchanged - default render
              mapTEMRender();
            }
          } else {
            // Initial cache write
            localStorage.setItem("tsitu-maptem-remain", remainStr);
            updateMapData(currentMap.map_id);
          }
        } else {
          // Scavenger map detected - reset map data
          localStorage.removeItem("tsitu-maptem-remain");
          localStorage.removeItem("tsitu-maptem-mapmice");
          localStorage.removeItem("tsitu-maptem-cache-color");
          localStorage.removeItem("tsitu-maptem-cache-data");
          mapTEMRender();
        }
      } else {
        // No active maps - reset map data
        localStorage.removeItem("tsitu-maptem-remain");
        localStorage.removeItem("tsitu-maptem-mapmice");
        localStorage.removeItem("tsitu-maptem-cache-color");
        localStorage.removeItem("tsitu-maptem-cache-data");
        mapTEMRender();
      }

      // Check whether environment/setup has updated for the map/TEM feature
      const baitID = user.bait_item_id || 0;
      const charmID = user.trinket_item_id || 0;
      const envString = `${user.environment_id}~${baitID}~${user.base_item_id}~${user.weapon_item_id}~${charmID}`;
      const cacheEnv = localStorage.getItem("tsitu-maptem-env");
      const isBatch = localStorage.getItem("tsitu-batch-loading");
      if (cacheEnv) {
        if (envString !== cacheEnv) {
          // Environment/setup has changed - fetch latest data
          localStorage.setItem("tsitu-maptem-env", envString);
          if (isBatch === "true") {
            // Do nothing - Favorite Setups script is in the middle of multiple item armings
          } else {
            requestTEMData();
          }
        } else {
          // Environment/setup state unchanged - default render
          mapTEMRender();
        }
      } else {
        // Initial cache write
        localStorage.setItem("tsitu-maptem-env", envString);
        requestTEMData();
      }
    });
    originalOpen.apply(this, arguments);
  };

  function treasureMapListener(url, data) {
    if (url !== "https://www.mousehuntgame.com/managers/ajax/users/treasuremap_v2.php") {
      return;
    }

    try {
      const map = data.treasure_map;
      if (map) {
        const obj = {};
        const condensed = {};
        condensed.hunters = map.hunters;
        condensed.is_complete = map.is_complete;
        condensed.is_owner = map.is_owner;
        condensed.is_scavenger_hunt = map.is_scavenger_hunt;
        condensed.is_wanted_poster = map.is_wanted_poster;
        condensed.map_class = map.map_class;
        condensed.map_id = map.map_id;
        condensed.timestamp = Date.now();
        obj[map.name] = condensed;

        const mapCacheRaw = localStorage.getItem("tsitu-mapping-cache");
        if (mapCacheRaw) {
          const mapCache = JSON.parse(mapCacheRaw);
          mapCache[map.name] = condensed;
          localStorage.setItem(
            "tsitu-mapping-cache",
            JSON.stringify(mapCache)
          );
        } else {
          localStorage.setItem("tsitu-mapping-cache", JSON.stringify(obj));
        }

        const mapEl = document.querySelector(".treasureMapView-mapMenu");
        if (mapEl) {
          render();
        }
      }
    } catch (error) {
      console.log("Server response doesn't contain a valid treasure map");
      console.error(error.stack);
    }
  }

  function temListener(url, data) {
    if (url !== "https://www.mousehuntgame.com/managers/ajax/users/getmiceeffectiveness.php") {
      return;
    }

    updateTEMData(data);
  }

  // Queries and caches uncaught mice on an active treasure map
  function updateMapData(mapId) {
    hg.utils.TreasureMapUtil.getMapInfo(mapId, function (response) {
      const missingMice = [];
      const mapData = response.treasure_map;
      if (mapData.goals.mouse.length > 0 && mapData.hunters.length > 0) {
        const completedIDs = [];
        mapData.hunters.forEach(el => {
          const caughtMice = el.completed_goal_ids.mouse;
          if (caughtMice.length > 0) {
            caughtMice.forEach(id => completedIDs.push(id));
          }
        });
        mapData.goals.mouse.forEach(el => {
          if (completedIDs.indexOf(el.unique_id) < 0) {
            missingMice.push(el.name);
          }
        });
        localStorage.setItem(
          "tsitu-maptem-mapmice",
          JSON.stringify(missingMice)
        );
        mapTEMCompare();
      }
    }, function (errorResponse) {
      console.log("Error while requesting treasure map details");
      console.error(error.stack);
    });
  }

  // Requests current mice list from TEM
  function requestTEMData() {
    postReq(
      "https://www.mousehuntgame.com/managers/ajax/users/getmiceeffectiveness.php",
      `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}`
    ).then(res => {
      try {
        const response = JSON.parse(res.responseText);
        if (response) updateTEMData(response);
      } catch (error) {
        console.log("Error while requesting TEM details");
        console.error(error.stack);
      }
    });
  }

  // Parses and caches mice from TEM response
  function updateTEMData(response) {
    const locationMice = [];
    for (let el in response.effectiveness) {
      const effMice = response.effectiveness[el].mice;
      effMice.forEach(el => {
        locationMice.push(el.name);
      });
    }
    localStorage.setItem("tsitu-maptem-temmice", JSON.stringify(locationMice));
    mapTEMCompare();
  }

  // Compares cached TEM mice with uncaught map mice
  function mapTEMCompare() {
    const mapMiceRaw = localStorage.getItem("tsitu-maptem-mapmice");
    const temMiceRaw = localStorage.getItem("tsitu-maptem-temmice");

    if (mapMiceRaw && temMiceRaw) {
      const mapMice = JSON.parse(mapMiceRaw);
      const temMice = JSON.parse(temMiceRaw);

      const availableMice = [];
      if (mapMice.length === 0) {
        // Don't render in this state - remove data reset feature
        mapTEMRender("grey", []); // Completed or empty map
      } else {
        // Derive list of available mice
        mapMice.forEach(el => {
          if (temMice.indexOf(el) >= 0) availableMice.push(el);
        });

        if (availableMice.length === 0) {
          mapTEMRender("red", []); // Map mice remaining but none available with setup
        } else {
          mapTEMRender("green", availableMice); // Map mice remaining and available with setup
        }
      }
    }
  }

  /**
   * Renders icons for the map/TEM feature
   * @param {string} color Color of rendered notification icon
   * @param {array} data Array of available uncaught mice
   */
  function mapTEMRender(bgColor, data) {
    document.querySelectorAll(".tsitu-maptem").forEach(el => el.remove());

    if (bgColor) {
      localStorage.setItem("tsitu-maptem-cache-color", bgColor);
      localStorage.setItem("tsitu-maptem-cache-data", JSON.stringify(data));
    }

    const backgroundColor =
      localStorage.getItem("tsitu-maptem-cache-color") || "grey";
    const mouseList =
      JSON.parse(localStorage.getItem("tsitu-maptem-cache-data")) || [];

    // Generate notification icon with numeric count, background color, title, and click handler
    const userStatWrapper = document.createElement("div");
    userStatWrapper.className = "mousehuntHud-userStat tsitu-maptem";

    const notifDiv = document.createElement("div");
    notifDiv.className = "notification active";
    notifDiv.style.left = "315px";
    notifDiv.style.top = "-30px";
    notifDiv.style.background = backgroundColor;
    notifDiv.innerText = mouseList.length || 0;

    if (backgroundColor === "grey") {
      return;
      // notifDiv.title =
      // "You are likely seeing this because:\n\n- Map is complete\n- No active maps\n- Scavenger map (not supported)\n- Initial data has not been fetched\n\nClick OK and then OK again if you'd like to RESET all saved data";
    } else if (backgroundColor === "red") {
      notifDiv.title =
        "No uncaught map mice with this setup (according to TEM)";
    } else if (backgroundColor === "green") {
      let titleText =
        "Uncaught map mice with this setup (according to TEM):\n\n";
      mouseList.forEach(el => {
        titleText += `- ${el}\n`;
      });
      notifDiv.title = titleText;
    }

    if (backgroundColor !== "grey") {
      notifDiv.onclick = function (event) {
        event.stopPropagation(); // Prevent bubbling up
        if (
          confirm(
            `${notifDiv.title}\nClick 'OK' if the icon seems inaccurate and you'd like to force fetch current TEM mice. Otherwise, click 'Cancel'.`
          )
        ) {
          requestTEMData();
        }
        return false;
      };
      notifDiv.oncontextmenu = function () {
        if (confirm("Toggle map/TEM icon placement?")) {
          const placement = localStorage.getItem("tsitu-maptem-placement");
          if (!placement) {
            localStorage.setItem("tsitu-maptem-placement", "map");
          } else if (placement === "map") {
            localStorage.setItem("tsitu-maptem-placement", "default");
          } else if (placement === "default") {
            localStorage.setItem("tsitu-maptem-placement", "map");
          }
          mapTEMRender(); // Re-render
        }
        return false;
      };
    }

    userStatWrapper.appendChild(notifDiv);
    const iconPlacement = localStorage.getItem("tsitu-maptem-placement");
    if (iconPlacement === "map") {
      target = document.querySelector(
        ".mousehuntHud-userStat.treasureMap .icon"
      );
      notifDiv.style.left = "14px";
      notifDiv.style.top = "14px";
      if (target) target.appendChild(userStatWrapper);
    } else {
      const target = document.querySelector(".campPage-trap-baitDetails");
      if (target) target.insertAdjacentElement("afterend", userStatWrapper);
    }
  }
  mapTEMRender(); // Initial default render on page load

  // Renders custom UI elements onto the DOM
  function render() {
    // Clear out existing custom elements
    // Uses static collection instead of live one from getElementsByClassName
    document.querySelectorAll(".tsitu-mapping").forEach(el => el.remove());
    // document.querySelectorAll(".tsitu-queso-mapper").forEach(el => el.remove());

    // Parent element that gets inserted at the end
    const masterEl = document.createElement("fieldset");
    masterEl.className = "tsitu-mapping";
    masterEl.style.width = "50%";
    masterEl.style.marginLeft = "15px";
    masterEl.style.padding = "5px";
    masterEl.style.border = "1px";
    masterEl.style.borderStyle = "dotted";
    const masterElLegend = document.createElement("legend");
    masterElLegend.innerText = `Mapping Helper v${GM_info.script.version} by tsitu`;
    masterEl.appendChild(masterElLegend);

    /**
     * Refresh button
     * Iterate thru QRH.maps array for element matching current map and set its hash to empty string
     * This forces a hard refresh via hasCachedMap, which is called in show/showMap
     */
    const refreshSpan = document.createElement("span");
    refreshSpan.className = "tsitu-mapping tsitu-refresh-span";
    const refreshTextSpan = document.createElement("span");
    refreshTextSpan.innerText = "Refresh";

    const refreshButton = document.createElement("button");
    refreshButton.className = "mousehuntActionButton tiny tsitu-mapping";
    refreshButton.style.cursor = "pointer";
    refreshButton.style.fontSize = "9px";
    refreshButton.style.padding = "2px";
    refreshButton.style.margin = "0px 5px 5px 10px";
    refreshButton.style.textShadow = "none";
    refreshButton.style.display = "inline-block";
    refreshButton.appendChild(refreshTextSpan);

    refreshButton.addEventListener("click", function () {
      // Clear cache (is it possible to only do so for just a single map?)
      hg.controllers.TreasureMapController.clearMapCache();

      // Parse map ID
      // Note: Unable to get ID for map currently in preview mode
      let mapId = -1;
      const activeTab = document.querySelector(
        ".treasureMapRootView-tab.active"
      );
      if (activeTab) {
        mapId = activeTab.getAttribute("data-type");
      }

      // Close dialog and re-open with either current map or overview
      document.getElementById("jsDialogClose").click();
      mapId === -1
        ? hg.controllers.TreasureMapController.show()
        : hg.controllers.TreasureMapController.show(mapId);
    });

    refreshSpan.appendChild(refreshButton);
    masterEl.appendChild(refreshSpan);

    // Utility function that opens supply transfer page and auto-selects SB+
    function transferSB(snuid) {
      const newWindow = window.open(
        `https://www.mousehuntgame.com/supplytransfer.php?fid=${snuid}`
      );
      newWindow.addEventListener("load", function () {
        if (newWindow.supplyTransfer1) {
          newWindow.supplyTransfer1.setSelectedItemType("super_brie_cheese");
          newWindow.supplyTransfer1.renderTabMenu();
          newWindow.supplyTransfer1.render();
        }
      });
      return false;
    }

    // Features that require cache checking
    const cacheRaw = localStorage.getItem("tsitu-mapping-cache");
    if (cacheRaw) {
      const cache = JSON.parse(cacheRaw);
      let mapName;

      const tabHeader = document.querySelector(
        ".treasureMapRootView-tab.active"
      );
      if (tabHeader) {
        mapName = tabHeader.querySelector(
          ".treasureMapRootView-tab-name"
        ).textContent;
      } else {
        // Tab header disappears when only 1 map is open, so fall back to HUD label
        const hudLabel = document.querySelector(
          ".mousehuntHud-userStat.treasureMap .label"
        );
        if (hudLabel) {
          mapName = hudLabel.textContent;
        }
      }

      const checkPreview = document.querySelector(
        ".treasureMapView-previewBar-content"
      );
      if (checkPreview) {
        mapName = checkPreview.textContent
          .split("'s ")[1]
          .split(".Back to Community")[0];
      }

      if (cache[mapName] !== undefined) {
        // Abstract equality comparison because map ID can be number or string
        const mapId = tabHeader
          ? tabHeader.getAttribute("data-type")
          : user.quests.QuestRelicHunter.default_map_id;
        if (mapId == cache[mapName].map_id) {
          // "Last refreshed" timestamp
          if (cache[mapName].timestamp) {
            const timeSpan = document.createElement("span");
            timeSpan.innerText = `(This map was last refreshed on: ${new Date(
              parseInt(cache[mapName].timestamp)
            ).toLocaleString()})`;
            refreshSpan.appendChild(timeSpan);
          }

          // Invite via Hunter ID (only for map captains)
          if (cache[mapName].is_owner) {
            const inputLabel = document.createElement("label");
            inputLabel.innerText = "Hunter ID: ";
            inputLabel.htmlFor = "tsitu-mapping-id-input";

            const inputField = document.createElement("input");
            inputField.setAttribute("name", "tsitu-mapping-id-input");
            inputField.setAttribute("data-lpignore", "true"); // Nuke LastPass Autofill
            inputField.setAttribute("placeholder", "e.g. 1234567");
            inputField.setAttribute("required", true);
            inputField.addEventListener("keyup", function (e) {
              if (e.keyCode === 13) {
                inviteButton.click(); // 'Enter' pressed
              }
            });

            const overrideStyle =
              "input[name='tsitu-mapping-id-input'] { -webkit-appearance:textfield; -moz-appearance:textfield; appearance:textfield; } input[name='tsitu-mapping-id-input']::-webkit-outer-spin-button, input[name='tsitu-mapping-id-input']::-webkit-inner-spin-button { display:none; -webkit-appearance:none; margin:0; }";
            let stylePresent = false;
            document.querySelectorAll("style").forEach(style => {
              if (style.textContent === overrideStyle) {
                stylePresent = true;
              }
            });
            if (!stylePresent) {
              const spinOverride = document.createElement("style");
              spinOverride.innerHTML = overrideStyle;
              document.body.appendChild(spinOverride);
            }

            const inviteButton = document.createElement("button");
            inviteButton.style.marginLeft = "5px";
            inviteButton.innerText = "Invite";
            inviteButton.addEventListener("click", function () {
              const rawText = inputField.value.replace(/\D/g, "");
              if (rawText.length > 0) {
                const hunterId = parseInt(rawText);
                if (typeof hunterId === "number" && !isNaN(hunterId)) {
                  if (hunterId > 0 && hunterId < 99999999) {
                    postReq(
                      "https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
                      `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${hunterId}&uh=${user.unique_hash}`
                    ).then(res => {
                      let response = null;
                      try {
                        if (res) {
                          response = JSON.parse(res.responseText);
                          const data = response.friend;
                          if (
                            data.user_interactions.actions.send_map_invite
                              .has_maps
                          ) {
                            if (
                              confirm(
                                `Are you sure you'd like to invite this hunter?\n\nName: ${data.name}\nTitle: ${data.title_name} (${data.title_percent}%)\nLocation: ${data.environment_name}\nLast Active: ${data.last_active_formatted} ago`
                              )
                            ) {
                              hg.utils.TreasureMapUtil.sendInvites(mapId, [data.sn_user_id], function (inviteRes) {
                                if (inviteRes.success === 1) {
                                  refreshButton.click();
                                } else {
                                  alert(
                                    "Map invite unsuccessful - may be because map is full"
                                  );
                                }
                              }, function (errorResponse) {
                                alert("Error while inviting hunter to map");
                              });
                            }
                          } else {
                            if (data.name) {
                              alert(
                                `${data.name} cannot to be invited to a map at this time`
                              );
                            } else {
                              alert("Invalid hunter information");
                            }
                          }
                        }
                      } catch (error) {
                        alert("Error while requesting hunter information");
                        console.error(error.stack);
                      }
                    });
                  }
                }
              }
            });

            const span = document.createElement("span");
            span.className = "tsitu-mapping";
            span.style.display = "inline-block";
            span.style.marginBottom = "10px";
            span.style.marginLeft = "10px";
            span.appendChild(inputLabel);
            span.appendChild(inputField);
            span.appendChild(inviteButton);

            masterEl.insertAdjacentElement(
              "afterbegin",
              document.createElement("br")
            );
            masterEl.insertAdjacentElement("afterbegin", span);
          }
        }

        const imgIDMap = {};
        const idNameMap = {};
        cache[mapName].hunters.forEach(el => {
          if (el.profile_pic) imgIDMap[el.profile_pic] = el.sn_user_id;
          idNameMap[el.sn_user_id] = el.name;
        });

        // Utility function for image hover behavior
        function imgHover(img) {
          let imgURL;
          if (img.src) {
            imgURL = img.src;
          } else if (img.style.backgroundImage) {
            imgURL = img.style.backgroundImage.split('url("')[1].split('")')[0];
          }

          const snuid = imgIDMap[imgURL];
          if (snuid) {
            const name = idNameMap[snuid];
            if (name) {
              img.title = `Send SB+ to ${name}`;
            }

            img.href = "#";
            img.style.cursor = "pointer";
            img.onclick = function () {
              transferSB(snuid);
            };
            img.onmouseenter = function () {
              img.style.border = "dashed 1px green";
            };
            img.onmouseleave = function () {
              img.style.border = "";
            };
          }
        }

        // Hunter container images
        document
          .querySelectorAll(
            ".treasureMapView-hunter:not(.empty) .treasureMapView-hunter-image"
          )
          .forEach(img => {
            imgHover(img);
          });

        // Corkboard message images
        document
          .querySelectorAll("[data-message-id] .messageBoardView-message-image")
          .forEach(img => {
            imgHover(img);
          });

        // "x found these mice" images
        document
          .querySelectorAll(".treasureMapView-block-content-heading-image")
          .forEach(img => {
            imgHover(img);
          });
      }
    }

    // Final render
    document
      .querySelector(".treasureMapView-mapMenu")
      .insertAdjacentElement("afterend", masterEl);
  }

  // POST to specified endpoint URL with desired form data
  function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
  }

  // MutationObserver logic for map UI
  // Observers are attached to a *specific* element (will DC if removed from DOM)
  const observerTarget = document.getElementById("overlayPopup");
  if (observerTarget) {
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    const observer = new MutationObserver(function () {
      // Callback

      // Render if treasure map popup is available
      const mapTab = observerTarget.querySelector(
        ".treasureMapRootView-tab.active"
      );
      const groupLen = document.querySelectorAll(
        ".treasureMapView-goals-groups"
      ).length;

      // Prevent conflict with 'Bulk Map Invites'
      const inviteHeader = document.querySelector(
        ".treasureMapUserSelectorView" // TODO: may need fine tuning once that script is fixed
      );

      if (
        mapTab &&
        mapTab.className.indexOf("active") >= 0 &&
        groupLen > 0 &&
        !inviteHeader
      ) {
        // Disconnect and reconnect later to prevent infinite mutation loop
        observer.disconnect();

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

  // Queso Mapper functionality (deprecated as of v2.0 - may reinstate if in demand)
  function quesoMapperFuncDepr() {
    // ***
    // Check for valid Queso Canyon map name
    const mapNameSelector = document.querySelector(
      ".treasureMapPopup-header-title.mapName"
    );
    if (mapNameSelector) {
      const split = mapNameSelector.textContent.split("Rare ");
      const mapName = split.length === 2 ? split[1] : split[0];

      if (quesoMaps.indexOf(mapName) >= 0) {
        // Queso Mapper toggling
        const quesoToggle = document.createElement("input");
        quesoToggle.type = "checkbox";
        quesoToggle.className = "tsitu-mapping";
        quesoToggle.name = "tsitu-queso-toggle";
        quesoToggle.addEventListener("click", function () {
          localStorage.setItem("tsitu-queso-toggle", quesoToggle.checked);
          render();
        });

        const quesoToggleLabel = document.createElement("label");
        quesoToggleLabel.className = "tsitu-mapping";
        quesoToggleLabel.htmlFor = "tsitu-queso-toggle";
        quesoToggleLabel.innerText = "Toggle Queso Mapper functionality";

        const qtChecked = localStorage.getItem("tsitu-queso-toggle") || "false";
        quesoToggle.checked = qtChecked === "true";
        if (quesoToggle.checked) {
          quesoRender();
        }

        const quesoToggleDiv = document.createElement("div");
        quesoToggleDiv.className = "tsitu-queso-mapper";
        if (!quesoToggle.checked) quesoToggleDiv.style.marginBottom = "10px";
        quesoToggleDiv.appendChild(quesoToggle);
        quesoToggleDiv.appendChild(quesoToggleLabel);

        document
          .querySelector(".treasureMapPopup-hunterContainer")
          .insertAdjacentElement("afterend", quesoToggleDiv);
      }
    }
    // ***

    function quesoRender() {
      const mapMice = document.querySelectorAll(
        "div.treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex.mouse"
      );
      if (mapMice.length > 0) {
        // Generate DOM elements
        const displayDiv = document.createElement("div");
        displayDiv.className = "tsitu-queso-mapper";
        displayDiv.style.fontSize = "14px";
        displayDiv.style.marginBottom = "10px";
        displayDiv.innerText = "Preferred Location & Cheese -> ";

        const cacheSel = localStorage.getItem("tsitu-queso-mapper-sel");
        if (cacheSel) {
          const cache = JSON.parse(cacheSel);
          for (let location in quesoData) {
            const locSel = `${classBuilder(location, "loc")}`;
            if (cache[locSel] !== undefined) {
              const locationSpan = document.createElement("span");
              locationSpan.innerText = `${location}: `;
              let cheeseCount = 0;
              for (let cheese in quesoData[location]) {
                const cheeseSel = `${classBuilder(location, cheese)}`;
                if (cache[locSel].indexOf(cheeseSel) >= 0) {
                  const cheeseSpan = document.createElement("span");
                  let prependStr = "";
                  if (cheeseCount > 0) prependStr = ", ";

                  const imgSpan = document.createElement("span");
                  imgSpan.setAttribute(
                    "style",
                    `background-image:url('${quesoImg[cheese]}');width:20px;height:20px;display:inline-block;background-size:contain;background-repeat:no-repeat;position:relative;top:4px;`
                  );

                  let appendStr = "";
                  if (cheese !== "Standard" && cheese !== "SB+") {
                    appendStr += " Queso";
                  }

                  cheeseSpan.innerText = `${prependStr + cheese + appendStr}`;
                  locationSpan.append(cheeseSpan);
                  locationSpan.append(document.createTextNode("\u00A0"));
                  locationSpan.append(imgSpan);
                  cheeseCount += 1;
                }
              }
              displayDiv.appendChild(locationSpan);
            }
          }
        } else {
          displayDiv.style.marginTop = "5px";
          displayDiv.innerText = "Preferred Location & Cheese -> N/A";
        }

        const target = document.querySelector(
          ".treasureMapPopup-map-stateContainer.viewGoals"
        );
        if (target) target.insertAdjacentElement("beforebegin", displayDiv);

        mapMice.forEach(el => {
          if (el.className.indexOf("tsitu-queso-mapper-mouse") < 0) {
            function listener() {
              const span = el.querySelector("span");
              if (span) {
                const mouse = span.textContent;
                const mouseData = quesoMice[mouse];
                if (mouseData) {
                  const toCache = {};
                  for (let arr of mouseData) {
                    const locSel = classBuilder(arr[0], "loc");
                    const cheeseSel = classBuilder(arr[0], arr[1]);
                    if (toCache[locSel] === undefined) {
                      toCache[locSel] = [cheeseSel];
                    } else {
                      toCache[locSel].push(cheeseSel);
                    }
                    localStorage.setItem(
                      "tsitu-queso-mapper-sel",
                      JSON.stringify(toCache)
                    );
                    render();
                  }
                }
              }
            }

            el.addEventListener("mouseover", function () {
              listener();
            });

            el.addEventListener("click", function () {
              listener();
            });
          }
          el.classList.add("tsitu-queso-mapper-mouse");
        });
      }

      function classBuilder(location, cheese) {
        let retVal = "";

        switch (location) {
          case "Queso River":
            retVal += "river-";
            break;
          case "Prickly Plains":
            retVal += "plains-";
            break;
          case "Cantera Quarry":
            retVal += "quarry-";
            break;
          case "Cork Collecting":
            retVal += "cork-";
            break;
          case "Pressure Building":
            retVal += "pressure-";
            break;
          case "Small Eruption":
            retVal += "small-";
            break;
          case "Medium Eruption":
            retVal += "medium-";
            break;
          case "Large Eruption":
            retVal += "large-";
            break;
          case "Epic Eruption":
            retVal += "epic-";
            break;
          default:
            retVal += location;
        }

        switch (cheese) {
          case "Standard":
            retVal += "standard";
            break;
          case "SB+":
            retVal += "super";
            break;
          case "Bland":
            retVal += "bland";
            break;
          case "Mild":
            retVal += "mild";
            break;
          case "Medium":
            retVal += "medium";
            break;
          case "Hot":
            retVal += "hot";
            break;
          case "Flamin'":
            retVal += "flamin";
            break;
          case "Wildfire":
            retVal += "wildfire";
            break;
          default:
            retVal += cheese;
        }

        return retVal;
      }
    }

    // Valid Queso map variants
    const quesoMaps = [
      "Queso Canyoneer Treasure Map",
      "Queso Geyser Treasure Map",
      "Queso Canyon Grand Tour Treasure Map"
    ];

    // Queso cheese image icons
    const quesoImg = {
      "Standard":
        "https://www.mousehuntgame.com/images/items/bait/7e0daa548364166c46c0804e6cb122c6.gif?cv=243",
      "SB+":
        "https://www.mousehuntgame.com/images/items/bait/d3bb758c09c44c926736bbdaf22ee219.gif?cv=243",
      "Bland":
        "https://www.mousehuntgame.com/images/items/bait/4752dbfdce202c0d7ad60ce0bacbebae.gif?cv=243",
      "Mild":
        "https://www.mousehuntgame.com/images/items/bait/7193159aa90c85ba67cbe02d209e565f.gif?cv=243",
      "Medium":
        "https://www.mousehuntgame.com/images/items/bait/be747798c5e6a7747ba117e9c32a8a1f.gif?cv=243",
      "Hot":
        "https://www.mousehuntgame.com/images/items/bait/11d1170bc85f37d67e26b0a05902bc3f.gif?cv=243",
      "Flamin'":
        "https://www.mousehuntgame.com/images/items/bait/5a69c1ea617ba622bd1dd227afb69a68.gif?cv=243",
      "Wildfire":
        "https://www.mousehuntgame.com/images/items/bait/73891a065f1548e474177165734ce78d.gif?cv=243"
    };

    // Location -> Cheese -> Mouse
    const quesoData = {
      "Queso River": {
        "Standard": [
          "Tiny Saboteur",
          "Pump Raider",
          "Croquet Crusher",
          "Queso Extractor"
        ],
        "SB+": ["Sleepy Merchant"],
        "Wildfire": ["Queen Quesada"]
      },
      "Prickly Plains": {
        "Bland": ["Spice Seer", "Old Spice Collector"],
        "Mild": ["Spice Farmer", "Granny Spice"],
        "Medium": ["Spice Sovereign", "Spice Finder"],
        "Hot": ["Spice Raider", "Spice Reaper"],
        "Flamin'": ["Inferna, The Engulfed"]
      },
      "Cantera Quarry": {
        "Bland": ["Chip Chiseler", "Tiny Toppler"],
        "Mild": ["Ore Chipper", "Rubble Rummager"],
        "Medium": ["Nachore Golem", "Rubble Rouser"],
        "Hot": ["Grampa Golem", "Fiery Crusher"],
        "Flamin'": ["Nachous, The Molten"]
      },
      "Cork Collecting": {
        "Bland": ["Fuzzy Drake"],
        "Mild": ["Cork Defender"],
        "Medium": ["Burly Bruiser"],
        "Hot": ["Horned Cork Hoarder"],
        "Flamin'": ["Rambunctious Rain Rumbler", "Corky, the Collector"],
        "Wildfire": ["Corkataur"]
      },
      "Pressure Building": {
        "Mild": ["Steam Sailor"],
        "Medium": ["Warming Wyvern"],
        "Hot": ["Vaporior"],
        "Flamin'": ["Pyrehyde"],
        "Wildfire": ["Emberstone Scaled"]
      },
      "Small Eruption": {
        Mild: ["Sizzle Pup"],
        Medium: ["Sizzle Pup"],
        Hot: ["Sizzle Pup"]
        // Mild: ["Mild Spicekin", "Sizzle Pup"],
        // Medium: ["Sizzle Pup", "Smoldersnap", "Mild Spicekin"],
        // Hot: ["Sizzle Pup", "Ignatia"]
      },
      "Medium Eruption": {
        "Medium": ["Bearded Elder"],
        "Hot": ["Bearded Elder"],
        "Flamin'": ["Bearded Elder"]
        // Mild: ["Mild Spicekin"],
        // Medium: ["Bearded Elder", "Smoldersnap"],
        // Hot: ["Bearded Elder", "Ignatia"],
        // "Flamin'": ["Bearded Elder", "Bruticus, the Blazing"]
      },
      "Large Eruption": {
        "Hot": ["Cinderstorm"],
        "Flamin'": ["Cinderstorm"]
        // Medium: ["Smoldersnap"],
        // Hot: ["Cinderstorm", "Ignatia"],
        // "Flamin'": ["Cinderstorm", "Bruticus, the Blazing"]
      },
      "Epic Eruption": {
        "Flamin'": ["Stormsurge, the Vile Tempest"],
        "Wildfire": ["Kalor'ignis of the Geyser"]
        // Hot: ["Ignatia", "Stormsurge, the Vile Tempest"],
        // "Flamin'": ["Stormsurge, the Vile Tempest", "Bruticus, the Blazing"],
      },
      "Any Eruption": {
        "Mild": ["Mild Spicekin"],
        "Medium": ["Smoldersnap"],
        "Hot": ["Ignatia"],
        "Flamin'": ["Bruticus, the Blazing"]
      }
    };

    // Alternate representation: Mouse -> Location -> Cheese
    const quesoMice = {};
    for (let location in quesoData) {
      for (let cheese in quesoData[location]) {
        const arr = quesoData[location][cheese];
        for (let mouse of arr) {
          if (quesoMice[mouse] === undefined) {
            quesoMice[mouse] = [[location, cheese]];
          } else {
            quesoMice[mouse].push([location, cheese]);
          }
        }
      }
    }
  }
})();
