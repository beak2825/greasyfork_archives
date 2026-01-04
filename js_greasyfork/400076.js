// ==UserScript==
// @name         MouseHunt Maptain Helper + QCGT
// @author       Re
// @version      0.6
// @description  Map interface improvements, QCGT helper
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @namespace    https://greasyfork.org/users/413177
// @downloadURL https://update.greasyfork.org/scripts/400076/MouseHunt%20Maptain%20Helper%20%2B%20QCGT.user.js
// @updateURL https://update.greasyfork.org/scripts/400076/MouseHunt%20Maptain%20Helper%20%2B%20QCGT.meta.js
// ==/UserScript==

(function() {
    const ownedItems = {
        bait: {},
        base: {},
        skin: {},
        trinket: {},
        weapon: {}
    };

    // Endpoint listener - caches maps (which come in one at a time)
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            // Main mapping helper logic
            if (
                this.responseURL ===
                "https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php"
            ) {
                try {
                    const map = JSON.parse(this.responseText).treasure_map;
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
                        if (mapEl) render();
                    }
                } catch (error) {
                    console.log("Server response doesn't contain a valid treasure map");
                    console.error(error.stack);
                }
            }
            else if (
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
                            "re-owned-components",
                            JSON.stringify(ownedItems)
                        );
                        console.log("Equipment updated.")
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
                    const remainStr = `${currentMap.map_id}~${currentMap.remaining}`;
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
            if (cacheEnv) {
                if (envString !== cacheEnv) {
                    // Environment/setup has changed - fetch latest data
                    localStorage.setItem("tsitu-maptem-env", envString);
                    updateTEMData();
                } else {
                    // Environment/setup state unchanged - default render
                    mapTEMRender();
                }
            } else {
                // Initial cache write
                localStorage.setItem("tsitu-maptem-env", envString);
                updateTEMData();
            }
        });
        originalOpen.apply(this, arguments);
    };

    // Queries and caches uncaught mice on an active treasure map
    function updateMapData(mapId) {
        postReq(
            "https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
            `sn=Hitgrab&hg_is_ajax=1&action=map_info&map_id=${mapId}&uh=${user.unique_hash}`
        ).then(res => {
            let response = null;
            try {
                if (res) {
                    response = JSON.parse(res.responseText);
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
                }
            } catch (error) {
                console.log("Error while requesting treasure map details");
                console.error(error.stack);
            }
        });
    }

    // Queries and caches mice from current TEM
    function updateTEMData() {
        postReq(
            "https://www.mousehuntgame.com/managers/ajax/users/getmiceeffectiveness.php",
            `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}`
        ).then(res => {
            let response = null;
            try {
                if (res) {
                    response = JSON.parse(res.responseText);
                    const locationMice = [];
                    for (let el in response.effectiveness) {
                        const effMice = response.effectiveness[el].mice;
                        effMice.forEach(el => {
                            locationMice.push(el.name);
                        });
                    }
                    localStorage.setItem(
                        "tsitu-maptem-temmice",
                        JSON.stringify(locationMice)
                    );
                    mapTEMCompare();
                }
            } catch (error) {
                console.log("Error while requesting TEM details");
                console.error(error.stack);
            }
        });
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
        const existing = document.querySelector(".tsitu-maptem");
        if (existing) existing.remove();

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
        notifDiv.style.left = "300px";
        notifDiv.style.top = "-30px";
        notifDiv.style.background = backgroundColor;
        notifDiv.innerText = mouseList.length || 0;

        if (backgroundColor === "grey") {
            notifDiv.title =
                "You are likely seeing this because:\n\n- Map is complete\n- No active maps\n- Scavenger map (not supported)\n- Initial data has not been fetched\n\nClick OK and then OK again if you'd like to RESET all saved data";
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
            notifDiv.onclick = function(event) {
                alert(notifDiv.title);
                event.stopPropagation(); // Prevent bubbling up to bait toggle handler
                return false;
            };
        } else {
            notifDiv.onclick = function(event) {
                if (confirm(notifDiv.title)) {
                    if (confirm("Are you sure you'd like to reset all saved data?")) {
                        localStorage.removeItem("tsitu-maptem-cache-data");
                        localStorage.removeItem("tsitu-maptem-cache-color");
                        localStorage.removeItem("tsitu-maptem-temmice");
                        localStorage.removeItem("tsitu-maptem-mapmice");
                        localStorage.removeItem("tsitu-maptem-remain");
                        localStorage.removeItem("tsitu-maptem-env");
                    }
                }
                event.stopPropagation(); // Prevent bubbling up to bait toggle handler
                return false;
            };
        }

        userStatWrapper.appendChild(notifDiv);
        const target = document.querySelector(".campPage-trap-baitDetails");
        if (target) target.insertAdjacentElement("afterend", userStatWrapper);
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
        masterElLegend.innerText = "Maptain Helper 0.1a";
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

        refreshButton.addEventListener("click", function() {
            // Clear cache (is it possible to only do so for just a single map?)
            hg.views.TreasureMapManagerView.clearMapCache();

            // Parse map ID from 'Preview' button (should be robust enough)
            let mapId = -1;
            const previewButton = document.querySelector(
                ".treasureMapView-mapMenu-group-actions .mousehuntActionButton.tiny.lightBlue"
            );
            if (previewButton) {
                mapId = previewButton.onclick
                    .toString()
                    .split("RewardsDialog(")[1]
                    .split(");")[0];
            }

            // Close dialog and re-open with either current map or overview
            document.getElementById("jsDialogClose").click();
            mapId === -1
                ? hg.views.TreasureMapManagerView.show()
            : hg.views.TreasureMapManagerView.show(mapId);
        });

        refreshSpan.appendChild(refreshButton);
        masterEl.appendChild(refreshSpan);

        // Utility function that opens supply transfer page and auto-selects SB+
        function transferSB(snuid) {
            const newWindow = window.open(
                `https://www.mousehuntgame.com/supplytransfer.php?fid=${snuid}`
            );
            newWindow.addEventListener("load", function() {
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
            const checkMap = document.querySelector(
                ".treasureMapManagerView-task.active"
            );
            const checkPreview = document.querySelector(
                ".treasureMapView-previewBar-content"
            );

            let mapName;
            if (checkMap) {
                mapName = checkMap.querySelector(".treasureMapManagerView-task-name")
                    .textContent;
            }
            if (checkPreview) {
                mapName = checkPreview.textContent
                    .split("'s ")[1]
                    .split(".Back to Invites")[0];
            }

            if (cache[mapName] !== undefined) {
                // Must specify <a> because favorite button <div> also matches the selector
                const mapIdEl = document.querySelector("a[data-task-id].active");
                if (mapIdEl) {
                    // Abstract equality comparison because map ID can be number or string
                    const mapId = mapIdEl.getAttribute("data-task-id");
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
                            inputField.setAttribute("type", "string");
                            inputField.setAttribute("name", "tsitu-mapping-id-input");
                            inputField.setAttribute("data-lpignore", "true"); // Get rid of LastPass Autofill
                            inputField.setAttribute("min", 1);
                            inputField.setAttribute("max", 9999999);
                            inputField.setAttribute("placeholder", "e.g. 1234567");
                            inputField.setAttribute("required", true);
                            inputField.addEventListener("keyup", function(e) {
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
                            inviteButton.addEventListener("click", function() {
                                const rawText = inputField.value;
                                if (rawText.length > 0) {
                                    const hunterId = parseInt(rawText.match(/[0-9]+/)[0])
                                    const reRemain = parseInt(localStorage.getItem("tsitu-maptem-remain").split('~')[1])
                                    if (typeof hunterId === "number" && !isNaN(hunterId)) {
                                        if (hunterId > 0 && hunterId < 9999999) {
                                            postReq(
                                                "https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
                                                `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${hunterId}&uh=${user.unique_hash}`
                                            ).then(res => {
                                                let response = null;
                                                try {
                                                    if (res) {
                                                        response = JSON.parse(res.responseText);
                                                        const data = response.friend;
                                                        if (data.has_invitable_map) {
                                                            if (
                                                                confirm(
                                                                    `Are you sure you'd like to invite this hunter?\n\nName: ${data.name}\nTitle: ${data.title_name} (${data.title_percent}%)\nLocation: ${data.environment_name}\nLast Active: ${data.last_active_formatted} ago`
                                                                )
                                                            ) {
                                                                postReq(
                                                                    "https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
                                                                    `sn=Hitgrab&hg_is_ajax=1&action=send_invites&map_id=${mapId}&snuids%5B%5D=${data.snuid}&uh=${user.unique_hash}`
                                                                ).then(res2 => {
                                                                    let inviteRes = null;
                                                                    try {
                                                                        if (res2) {
                                                                            inviteRes = JSON.parse(res2.responseText);
                                                                            if (inviteRes.success === 1) {
                                                                                if(reRemain > 1){
                                                                                    transferSB(data.snuid)
                                                                                }
                                                                                refreshButton.click();
                                                                            } else {
                                                                                alert(
                                                                                    "Map invite unsuccessful - may be because map is full"
                                                                                );
                                                                            }
                                                                        }
                                                                    } catch (error2) {
                                                                        alert("Error while inviting hunter to map");
                                                                        console.error(error2.stack);
                                                                    }
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
                        img.onclick = function() {
                            transferSB(snuid);
                        };
                        img.onmouseenter = function() {
                            img.style.border = "dashed 1px green";
                        };
                        img.onmouseleave = function() {
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
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    resolve(this);
                }
            };
            xhr.onerror = function() {
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

        const observer = new MutationObserver(function() {
            // Callback

            // Render if treasure map popup is available
            const mapTab = observerTarget.querySelector(
                ".treasureMapManagerView-header-navigation-item.tasks.active"
            );
            const groupLen = document.querySelectorAll(
                ".treasureMapView-goals-groups"
            ).length;

            // Prevent conflict with 'Bulk Map Invites'
            const inviteHeader = document.querySelector(
                ".treasureMapManagerDialogView-inviteFriend-header"
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
                quesoToggle.addEventListener("click", function() {
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

                        el.addEventListener("mouseover", function() {
                            listener();
                        });

                        el.addEventListener("click", function() {
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

    function reQty(text){
        return parseFloat(text.toString().replace(/,/g, ''))
    }

    function reTravel(location,callback) {
        $.post(
            "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php",
            {
                sn: 'Hitgrab',
                hg_is_ajax: 1,
                destination: location,
                uh: user.unique_hash,
            },
            null,
            "json"
        ).done(callback);
    }

    function reMap(callback) {
        if(user.quests.QuestRelicHunter.default_map_id){
            $.post(
                "https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
                {
                    sn: 'Hitgrab',
                    hg_is_ajax: 1,
                    action: 'map_info',
                    map_id: user.quests.QuestRelicHunter.default_map_id,
                    uh: user.unique_hash,
                },
                null,
                "json"
            ).done(function(data){
                callback(data.treasure_map)
            });
        }
        else{
            callback(false)
        }
    }

    function reArmEq(baitName, weaponName, baseName, trinketName) {
        const rawData = localStorage.getItem("re-owned-components");
        const data = JSON.parse(rawData);
        const payload = {
            sn: "Hitgrab",
            hg_is_ajax: 1,
            uh: user.unique_hash
        };
        if(!data.bait[baitName]) baitName = Object.keys(data.bait).find(function(entry){return entry.indexOf(baitName) > -1})
        if(!data.weapon[weaponName]) weaponName = Object.keys(data.weapon).find(function(entry){return entry.indexOf(weaponName) > -1})
        if(!data.base[baseName]) baseName = Object.keys(data.base).find(function(entry){return entry.indexOf(baseName) > -1})
        if(!data.trinket[trinketName]) trinketName = Object.keys(data.trinket).find(function(entry){return entry.indexOf(trinketName) > -1})

        baitName = baitName ? baitName : "N/A"
        weaponName = weaponName ? weaponName : "N/A"
        baseName = baseName ? baseName : "N/A"
        trinketName = trinketName ? trinketName : "N/A"

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
        if (weaponName !== "N/A" && user.weapon_name.substring(0,15) !== weaponName.substring(0,15)) {
            payload.weapon = data.weapon[weaponName][0];
        }

        if (baitName === "N/A") payload.bait = "disarm";
        if (trinketName === "N/A") payload.trinket = "disarm";
        // Disarm skin too?

        // Cancel if setup isn't changing
        if (Object.keys(payload).length === 3) return;

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

    function reQCGT(){
        let cLocation = user.environment_type || "N/A"
        let desired = [cLocation,user.bait_name,user.weapon_name,user.base_name,user.trinket_name] // location,cheese
        let currentBait = user.bait_name

        let listQCmice = ["Sleepy Merchant","Croquet Crusher","Tiny Saboteur","Pump Raider","Queso Extractor","Queen Quesada",
                          "Spice Seer","Old Spice Collector","Spice Farmer","Granny Spice","Spice Sovereign","Spice Finder",
                          "Spice Raider","Spice Reaper","Inferna, The Engulfed","Chip Chiseler","Tiny Toppler","Ore Chipper",
                          "Rubble Rummager","Nachore Golem","Rubble Rouser","Grampa Golem","Fiery Crusher"]
        let listQGmice = ["Corkataur","Corky, the Collector","Rambunctious Rain Rumbler","Horned Cork Hoarder","Burly Bruiser","Cork Defender","Fuzzy Drake",
                          "Emberstone Scaled","Pyrehyde","Vaporior","Warming Wyvern","Steam Sailor","Mild Spicekin","Smoldersnap","Ignatia","Bruticus, the Blazing",
                          "Sizzle Pup","Bearded Elder","Cinderstorm","Stormsurge, the Vile Tempest","Kalor'ignis of the Geyser"]

        reMap(function(mapData){
            let mouseList = []

            function reMapC(... mice){
                for(let a of mice){
                    if(mouseList.indexOf(a) > -1){
                        return true
                    }
                }
                return false
            }

            function QCsetup(){
                if(desired[0] != cLocation){
                    reTravel(desired[0],function(){
                        reArmEq(... desired.slice(1))
                    })
                }
                else{
                    reArmEq(... desired.slice(1))
                }
            }

            if(mapData != false){
                let caughtList = [].concat(... mapData.hunters.map(a => a.completed_goal_ids.mouse))
                mouseList = mapData.goals.mouse.filter(a => caughtList.indexOf(a.unique_id) < 0).map(a => a.name)
            }

            let nonQG = reMapC(... listQCmice)
            let fromQG = reMapC(... listQGmice)

            function QGlogic(){
                let state = user.quests.QuestQuesoGeyser.state
                let stateData = user.quests.QuestQuesoGeyser.state_data
                let pressure = user.quests.QuestQuesoGeyser.pressure
                let maxPressure = user.quests.QuestQuesoGeyser.max_pressure
                let pressureDelta = maxPressure - pressure
                let tonic = user.quests.QuestQuesoGeyser.is_wild_tonic_enabled
                let needTonic = false

                let bark = reQty(user.quests.QuestQuesoGeyser.items.cork_bark_crafting_item.quantity)
                let rubber = reQty(user.quests.QuestQuesoGeyser.items.rubber_crafting_item.quantity)
                let geyserite = reQty(user.quests.QuestQuesoGeyser.items.geyserite_crafting_item.quantity)
                let tungsten = reQty(user.quests.QuestQuesoGeyser.items.tungsten_crafting_item.quantity)

                let canSmall = bark >= 10
                let canMedium = bark >= 30 && rubber >= 15
                let canLarge = bark >= 90 && geyserite >= 30
                let canEpic = bark >= 180 && tungsten >= 60

                let needStormsurge = reMapC("Stormsurge, the Vile Tempest") && (stateData == "eruption_epic")
                let needCinder = reMapC("Cinderstorm") && (stateData == "eruption_large")
                let needBrut = reMapC("Bruticus, the Blazing")
                let needIgnatia = reMapC("Ignatia") && !(stateData == "eruption_epic")
                let needSmoldersnap = reMapC("Smoldersnap") && !(stateData == "eruption_epic")
                let needMild = reMapC("Mild Spicekin") && !(stateData == "eruption_epic")

                let needEpic= reMapC("Kalor'ignis of the Geyser","Stormsurge, the Vile Tempest")
                let needLarge = (reMapC("Cinderstorm") || (reMapC("Emberstone Scaled") && !needEpic)) || (needEpic && !canEpic)
                let needMedium = reMapC("Bearded Elder") || (needLarge && !canLarge)
                let needSmall = reMapC("Sizzle Pup") || (needMedium && !canMedium)

                switch(state){
                    case "eruption":
                        if(needStormsurge || needBrut){
                            desired = ["queso_geyser","Flamin","Dragon Slayer Cannon","Prestige","Rift Ultimate Power Charm"]
                            needTonic = true
                        }
                        else if(needIgnatia){
                            desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(needSmoldersnap){
                            desired = ["queso_geyser","Medium","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(needMild){
                            desired = ["queso_geyser","Mild","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else{
                            switch(stateData){
                                case "eruption_epic":
                                    desired = ["queso_geyser","Wildfire","Dragon Slayer Cannon","Prestige","Dragonbane"]
                                    needTonic = true
                                    break
                                case "eruption_large":
                                    desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                                    break
                                case "eruption_medium":
                                    desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                                    break
                                case "eruption_small":
                                    desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                                    break
                            }
                        }
                        break

                    case "claim":
                    case "collecting":
                        if(reMapC("Corkataur")){
                            desired = ["queso_geyser","Wildfire","Dragon Slayer Cannon","Prestige","Ultimate Luck Charm"]
                        }
                        else if(reMapC("Corky, the Collector","Rambunctious Rain Rumbler")){
                            desired = ["queso_geyser","Flamin","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Horned Cork Hoarder")){
                            desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Burly Bruiser")){
                            desired = ["queso_geyser","Medium","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Cork Defender")){
                            desired = ["queso_geyser","Mild","Dragon Slayer Cannon","Prestige","Gilded"]
                        }
                        else if(reMapC("Fuzzy Drake")){
                            desired = ["queso_geyser","Bland","Dragon Slayer Cannon","Prestige","Gilded"]
                        }
                        else if(needSmall && canSmall){
                            alert("Enter Small.")
                        }
                        else if(needMedium && canMedium){
                            alert("Enter Medium.")
                        }
                        else if(needLarge && canLarge){
                            alert("Enter Large.")
                        }
                        else if(needEpic && canEpic){
                            alert("Enter Epic.")
                        }
                        else{
                            alert("Check remaining mice.")
                        }
                        break

                    case "corked":
                        if(reMapC("Steam Sailor")){
                            desired = ["queso_geyser","Mild","Dragon Slayer Cannon","Prestige","Gilded"]
                        }
                        else if(reMapC("Warming Wyvern")){
                            desired = ["queso_geyser","Medium","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Vaporior")){
                            desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Pyrehyde")){
                            desired = ["queso_geyser","Flamin","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(reMapC("Emberstone Scaled") && pressureDelta >= 500){
                            desired = ["queso_geyser","Wildfire","Dragon Slayer Cannon","Prestige","Ultimate Luck Charm"]
                        }
                        else if(pressureDelta <= 15){
                            desired = ["queso_geyser","Medium","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(pressureDelta < 60){
                            desired = ["queso_geyser","Hot","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(pressureDelta < 800){
                            desired = ["queso_geyser","Flamin","Dragon Slayer Cannon","Prestige","Ultimate Ancient"]
                        }
                        else if(pressureDelta <= 1500){
                            desired = ["queso_geyser","Wildfire","Dragon Slayer Cannon","Prestige","Ultimate Luck Charm"]
                        }
                        else{
                            desired = ["queso_geyser","Wildfire","Dragon Slayer Cannon","Prestige","Ultimate Luck Charm"]
                            needTonic = true
                        }
                        break
                }
                if(tonic != needTonic){
                    hg.views.HeadsUpDisplayQuesoRegionView.toggleWildTonic()
                }
                QCsetup()
            }

            if(nonQG){
                if(reMapC("Sleepy Merchant","Croquet Crusher")){
                    desired = ["queso_river","SUPER|brie+","Ember Prison","Prestige","Party Charm"]
                }
                else if(reMapC("Tiny Saboteur","Pump Raider","Queso Extractor")){
                    desired = ["queso_river","SUPER|brie+","Ember Prison","Prestige","Party Charm"]
                }
                else if(reMapC("Queen Quesada")){
                    desired = ["queso_river","Wildfire","Ember Prison","Prestige","Rift Ultimate Lucky Power Charm"]
                }
                else if(reMapC("Spice Seer","Old Spice Collector")){
                    desired = ["queso_plains","Bland","Golem Guardian","Overgrown Ember","Gilded"]
                }
                else if(reMapC("Spice Farmer","Granny Spice")){
                    desired = ["queso_plains","Mild","Golem Guardian","Overgrown Ember","Gilded"]
                }
                else if(reMapC("Spice Sovereign","Spice Finder")){
                    desired = ["queso_plains","Medium","Golem Guardian","Prestige","Party Charm"]
                }
                else if(reMapC("Spice Raider","Spice Reaper")){
                    desired = ["queso_plains","Hot","Golem Guardian","Prestige","Extreme Party"]
                }
                else if(reMapC("Inferna, The Engulfed")){
                    desired = ["queso_plains","Flamin","Golem Guardian","Prestige","Ultimate Luck Charm"]
                }
                else if(reMapC("Chip Chiseler","Tiny Toppler")){
                    desired = ["queso_quarry","Bland","Interdimensional","Overgrown Ember","Gilded"]
                }
                else if(reMapC("Ore Chipper","Rubble Rummager")){
                    desired = ["queso_quarry","Mild","Chrome Temporal","Overgrown Ember","Gilded"]
                }
                else if(reMapC("Nachore Golem","Rubble Rouser")){
                    desired = ["queso_quarry","Medium","Chrome Temporal","2020","Party Charm"]
                }
                else if(reMapC("Grampa Golem","Fiery Crusher")){
                    desired = ["queso_quarry","Hot","Chrome Temporal","2020","Party Charm"]
                }
                QCsetup()
            }
            else if(fromQG){
                if(cLocation != 'queso_geyser'){
                    reTravel('queso_geyser',function(){
                        hg.utils.PageUtil.refresh()
                        setTimeout(reQCGT,5000)
                    })
                }
                else{
                    QGlogic()
                }
            }
            else{
                if(cLocation == "queso_quarry" && currentBait == "Flamin' Queso"){
                    desired = ["queso_quarry","Flamin","Chrome Temporal","Prestige","Ultimate Party Charm"]
                    QCsetup()
                }
                else{
                    alert("All mice done")
                }
            }
        })
    }

    const target = document.querySelector(".mousehuntHud-gameInfo");
    if (target) {
        const link = document.createElement("a");
        link.innerText = "[Next Mouse]";
        link.addEventListener("click", reQCGT);
        target.prepend(link);
    }
})();