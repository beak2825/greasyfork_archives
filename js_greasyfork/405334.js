// ==UserScript==
// @name         MouseHunt - QoL Utilities
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.1.7
// @description  Miscellaneous utilities to turbo-charge your MH experience
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/405334/MouseHunt%20-%20QoL%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/405334/MouseHunt%20-%20QoL%20Utilities.meta.js
// ==/UserScript==

(function () {
  /**
   * IDEA BANK
   * TODO: Alert when sounding horn after unseen trap check (user set 00, 15, 30, 45) to avoid wasted hunt if TC'd something
   * TODO: Track outbound supply transfers
   */

  // Adds direct hunter ID / snuid navigation popup via button on 'Friends' dropdown
  (function hunterIdNav() {
    document
      .querySelectorAll(".tsitu-hunter-id-nav")
      .forEach(el => el.remove());

    const target = document.querySelector("li .friend_list");
    if (target) {
      const li = document.createElement("li");
      li.className = "tsitu-hunter-id-nav";
      const button = document.createElement("a");
      button.href = "#";
      button.innerText = "ID Navigation";
      button.onclick = function () {
        const existing = document.querySelector("#tsitu-hunter-id-nav-ui");
        if (existing) existing.remove();
        else render();
        return false;
      };
      const icon = document.createElement("div");
      icon.className = "icon";
      button.appendChild(icon);
      li.appendChild(button);
      target.insertAdjacentElement("afterend", li);

      function render() {
        document
          .querySelectorAll("#tsitu-hunter-id-nav-ui")
          .forEach(el => el.remove());

        const div = document.createElement("div");
        div.id = "tsitu-hunter-id-nav-ui";
        div.style.backgroundColor = "#F5F5F5";
        div.style.position = "fixed";
        div.style.zIndex = "9999";
        div.style.left = "22.3vw";
        div.style.top = "28vh";
        div.style.border = "solid 3px #696969";
        div.style.borderRadius = "20px";
        div.style.padding = "10px";
        div.style.textAlign = "center";

        const closeButton = document.createElement("button", {
          id: "close-button"
        });
        closeButton.textContent = "x";
        closeButton.onclick = function () {
          document.body.removeChild(div);
        };

        const table = document.createElement("table");
        table.style.textAlign = "left";
        table.style.borderSpacing = "1em 0";
        const rowHid = document.createElement("tr");
        const rowSnuid = document.createElement("tr");

        const hidRadio = document.createElement("input");
        hidRadio.type = "radio";
        hidRadio.name = "tsitu-hunter-id";
        hidRadio.id = "tsitu-radio-hid";
        hidRadio.defaultChecked = true;
        hidRadio.onchange = function () {
          processRadio();
        };

        const hidRadioLabel = document.createElement("label");
        hidRadioLabel.innerText = "Hunter ID: ";
        hidRadioLabel.htmlFor = "tsitu-radio-hid";

        const hidInput = document.createElement("input");
        hidInput.type = "text";
        hidInput.id = "tsitu-input-hid";
        hidInput.placeholder = "e.g. 3795351";
        hidInput.onkeyup = function (event) {
          if (event.keyCode === 13) {
            goButton.click();
          }
        };

        const colHid = document.createElement("td");
        const colHidInput = document.createElement("td");
        colHid.appendChild(hidRadio);
        colHid.appendChild(document.createTextNode("\u00A0"));
        colHid.appendChild(hidRadioLabel);
        colHidInput.appendChild(hidInput);
        rowHid.appendChild(colHid);
        rowHid.appendChild(colHidInput);

        const snuidRadio = document.createElement("input");
        snuidRadio.type = "radio";
        snuidRadio.name = "tsitu-hunter-id";
        snuidRadio.id = "tsitu-radio-snuid";
        snuidRadio.onchange = function () {
          processRadio();
        };

        const snuidRadioLabel = document.createElement("label");
        snuidRadioLabel.innerText = "SN User ID: ";
        snuidRadioLabel.htmlFor = "tsitu-radio-snuid";

        const snuidInput = document.createElement("input");
        snuidInput.type = "text";
        snuidInput.id = "tsitu-input-snuid";
        snuidInput.placeholder = "e.g. 1062432650";
        snuidInput.onkeyup = function (event) {
          if (event.keyCode === 13) {
            goButton.click();
          }
        };

        const colSnuid = document.createElement("td");
        const colSnuidInput = document.createElement("td");
        colSnuid.appendChild(snuidRadio);
        colSnuid.appendChild(document.createTextNode("\u00A0"));
        colSnuid.appendChild(snuidRadioLabel);
        colSnuidInput.appendChild(snuidInput);
        rowSnuid.appendChild(colSnuid);
        rowSnuid.appendChild(colSnuidInput);

        function processRadio() {
          if (hidRadio.checked) {
            hidInput.disabled = false;
            snuidInput.disabled = true;
            localStorage.setItem("tsitu-id-radio", "hid");
          } else if (snuidRadio.checked) {
            hidInput.disabled = true;
            snuidInput.disabled = false;
            localStorage.setItem("tsitu-id-radio", "snuid");
          }
        }

        const goButton = document.createElement("button");
        goButton.style.fontWeight = "bold";
        goButton.innerText = "Go";
        goButton.onclick = function () {
          if (hidRadio.checked) {
            const val = hidInput.value;
            if (
              val.length > 0 &&
              val.length === parseInt(val).toString().length
            ) {
              const newWindow = window.open(
                `https://www.mousehuntgame.com/profile.php?id=${val}`
              );
            }
          } else if (snuidRadio.checked) {
            const val = snuidInput.value;
            if (
              val.length > 0 &&
              val.length === parseInt(val).toString().length
            ) {
              const newWindow = window.open(
                `https://www.mousehuntgame.com/profile.php?snuid=${val}`
              );
            }
          }
        };

        table.appendChild(rowHid);
        table.appendChild(rowSnuid);
        div.appendChild(closeButton);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(table);
        div.appendChild(document.createElement("br"));
        div.appendChild(goButton);
        document.body.appendChild(div);

        // Apply cached radio selection
        const radioCache = localStorage.getItem("tsitu-id-radio");
        if (radioCache) {
          if (radioCache === "hid") {
            hidRadio.checked = true;
          } else if (radioCache === "snuid") {
            snuidRadio.checked = true;
          }
        }
        processRadio();
      }
    }
  })();

  // TODO: Claim-time map participants/duster tracker (move to mapping helper?)
  (function mapTracker() {
    const map = temp1;
    if (map.can_claim_reward && map.is_complete) {
      //
    }

    const data = {};
    map.hunters.forEach(hunter => {
      if (hunter.is_active) {
        data[hunter.user_id] = {
          name: hunter.name
        };

        const completedItems = hunter.completed_goal_ids.item;
        const completedMice = hunter.completed_goal_ids.mouse;
        if (completedItems.length > 0) {
          data[hunter.user_id].i = completedItems.length;
        }
        if (completedMice.length > 0) {
          data[hunter.user_id].m = completedMice.length;
        }

        if (hunter.upgrader) {
          data[hunter.user_id].d = true;
        }
      }
    });
    console.log(data);
  });

  (function lockConvertibleButtons() {
    // Observe for 'Special' tab of Inventory
    const observerTarget = document.querySelector(".mousehuntPage-content");
    if (observerTarget) {
      MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

      const observer = new MutationObserver(function () {
        const isSpecial = observerTarget.querySelector(
          ".mousehuntHud-page-tabContent.special.active"
        );
        if (isSpecial) {
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

    function render() {
      document
        .querySelectorAll(".tsitu-lock-convertible")
        .forEach(el => el.remove());

      const convertibles = document.querySelectorAll(
        ".inventoryPage-item.full.convertible"
      );
      if (convertibles.length > 0) {
        // Apply cached locks on page load
        const cacheRaw = localStorage.getItem("tsitu-convertible-locks");
        if (cacheRaw) {
          const cache = JSON.parse(cacheRaw);
          convertibles.forEach(el => {
            const id = el.getAttribute("data-item-id");
            if (cache.indexOf(id) >= 0) {
              el.querySelectorAll(
                ".inventoryPage-item-content-action .button"
              ).forEach(button => {
                if (!button.classList.contains("disabled")) {
                  button.classList.toggle("disabled");
                }
              });
            }
          });
        }

        // Generate individual item lock buttons
        convertibles.forEach(el => {
          const a = document.createElement("a");
          a.href = "#";
          a.className =
            "inventoryPage-item-larryLexicon tsitu-lock-convertible";
          a.style.right = "22px";
          a.style.height = "15px";
          a.innerText = "🔒";
          a.onclick = function () {
            el.querySelectorAll(
              ".inventoryPage-item-content-action .button"
            ).forEach(button => {
              button.classList.toggle("disabled");
            });
            updateLockCache();
            return false;
          };
          const target = el.querySelector(".inventoryPage-item-name");
          if (target) target.insertAdjacentElement("afterend", a);
        });

        function updateLockCache() {
          const cacheArr = [];
          convertibles.forEach(el => {
            const button = el.querySelector(
              ".inventoryPage-item-content-action .button"
            );
            if (button.classList.contains("disabled")) {
              cacheArr.push(el.getAttribute("data-item-id"));
            }
          });
          localStorage.setItem(
            "tsitu-convertible-locks",
            JSON.stringify(cacheArr)
          );
        }

        // Add buttons for [un]locking entire tabs
        const lockableTabs = [
          "Baskets & Kits",
          "Scrolls, Posters, Assignments",
          "Spring Egg Hunt",
          "Treasure Chests"
        ];
        observerTarget
          .querySelectorAll(".inventoryPage-tagContent-tagGroup.clear-block")
          .forEach(tab => {
            const tabType = tab.getAttribute("data-name");
            if (lockableTabs.indexOf(tabType) >= 0) {
              const span = document.createElement("span");
              span.className =
                "inventoryPage-tagContent-tagTitle tsitu-lock-convertible";
              span.style.margin = "5px 0 5px 0";

              const lockAll = document.createElement("button");
              lockAll.innerText = "Lock Tab";
              lockAll.onclick = function () {
                if (
                  confirm(
                    `Are you sure you'd like to lock all convertibles on this tab?\n\n- ${tabType}`
                  )
                ) {
                  tab
                    .querySelectorAll(
                      ".inventoryPage-item-content-action .button"
                    )
                    .forEach(button => {
                      if (!button.classList.contains("disabled")) {
                        button.classList.toggle("disabled");
                      }
                    });
                  updateLockCache();
                }
              };

              const unlockAll = document.createElement("button");
              unlockAll.innerText = "Unlock Tab";
              unlockAll.onclick = function () {
                if (
                  confirm(
                    `Are you sure you'd like to unlock all convertibles on this tab?\n\n- ${tabType}`
                  )
                ) {
                  tab
                    .querySelectorAll(
                      ".inventoryPage-item-content-action .button"
                    )
                    .forEach(button => {
                      if (button.classList.contains("disabled")) {
                        button.classList.toggle("disabled");
                      }
                    });
                  updateLockCache();
                }
              };

              span.appendChild(lockAll);
              span.appendChild(document.createTextNode("\u00A0\u00A0"));
              span.appendChild(unlockAll);
              const target = tab.querySelector(
                ".inventoryPage-tagContent-tagTitle"
              );
              if (target) target.appendChild(span);
            }
          });
      }
    }
  })();

  // Adds RH location and 'Travel' button directly underneath clue
  (function relicHunterHintTravel() {
    const hintMap = {
      "Standing on the other side of a green and purple portal.":
        "Acolyte Realm",
      "Inside an elaborate one-way trap designed by Plankrun.": "Acolyte Realm",
      "Outside a smoky purple tower.": "Acolyte Realm",
      "Roaming amongst the most powerful of Lich mice.": "Balack's Cove",
      "Lurking in a damp and darkened grotto.": "Balack's Cove",
      "Searching for the best deals in the Burroughs.": "Bazaar",
      "Ducking between stalls and tents and loud merchants.": "Bazaar",
      "Under the pointiest tent in all the Kingdom!": "Bazaar",
      "Hobnobbing with giants.": "Bountiful Beanstalk",
      "Infiltrating a lofty castle.": "Bountiful Beanstalk",
      "Taking a relaxing hike through a forested area.": "Calm Clearing",
      "By a peaceful rock in a grassy clearing.": "Calm Clearing",
      "Tucked behind dense trees where it's quiet and peaceful.":
        "Calm Clearing",
      "Watching the peaceful gathering of tribal mice.": "Cape Clawed",
      "On a small bit of land near a volcano.": "Cape Clawed",
      "Listening for sinister secrets deep underground.": "Catacombs",
      "Walking through dark hallways in search of a Keeper's Candle.":
        "Catacombs",
      "Keeping an eye on the long-arm of the law.": "Claw Shot City",
      "Spitting in a spittoon! Yuck!": "Claw Shot City",
      "Leafing through ancient tomes of knowledge.": "Crystal Library",
      "Expanding knowledge and climbing endless ladders.": "Crystal Library",
      "Ankle deep in rocky, tropical sand.": "Derr Dunes",
      "Tumbling down hills of rreD sand.": "Derr Dunes",
      "Practicing an ancient art with fledgling warriors.": "Dojo",
      "Safely inside the bottom floor of a bamboo building.": "Dojo",
      "Carefully watching the training activities of advanced students.":
        "Dojo",
      "Near the bluE waters of the island.": "Elub Shore",
      "Watching the calm waters of Rodentia while remaining safely ashore.":
        "Elub Shore",
      "Marching through the Sandtail Desert.": "Fiery Warpath",
      "Dodging arrows, spears, swords, and spells!": "Fiery Warpath",
      "Investigating what can be built in a workshop.": "Floating Islands",
      "Searching the skies for treasure.": "Floating Islands",
      "Peering through an oculus.": "Floating Islands",
      "In the clouds above Hollow Heights.": "Floating Islands",
      "Watching hunters' dirigibles fly by.": "Floating Islands",
      "Avoiding falling victim to Sky Pirates.": "Floating Islands",
      "Trapped between two planes of existence.": "Forbidden Grove",
      "Behind heavy stone gates.": "Forbidden Grove",
      "Reaping what she sowed...": "Foreword Farm",
      "Cultivating a hearty yield...": "Foreword Farm",
      "Toiling away in fertile fields...": "Foreword Farm",
      "Carefully navigating a subterranean and humid environment.":
        "Fungal Cavern",
      "Deep inside of an infested, glowing, twisting, unending cave of untold riches...":
        "Fungal Cavern",
      "Tracing the deep patterns of bark growing on ancient towers.":
        "Great Gnarled Tree",
      "By a tree older than Gnawnia itself.": "Great Gnarled Tree",
      "Finding shade in the largest tree in the Kingdom.": "Great Gnarled Tree",
      "Near the loud and low horns and the dinging of bells.": "Harbour",
      "Visiting where many new hunters seek out seafaring mice.": "Harbour",
      "By the sea where there's plenty of fresh air and sunshine.": "Harbour",
      "Where royal strength rewards hunting prowess.": "King's Arms",
      "Under a circular roof atop arm-shared paths.": "King's Arms",
      "Browsing wares available with a most royal currency.": "King's Arms",
      "Climbing up spiralling, menacing stairs.": "King's Gauntlet",
      "Trekking up a massive tower in Valour.": "King's Gauntlet",
      "Atop a tall tower with the perfect view of an Eclipse.":
        "King's Gauntlet",
      "Performing bizarre experiments and chemical reactions.": "Laboratory",
      "Where the powerful and strange breeds of mice first arose.":
        "Laboratory",
      "Amongst brightly glowing potions.": "Laboratory",
      "Waist-deep in a shallow, sparkling pond.": "Lagoon",
      "Amongst sparkling, still water.": "Lagoon",
      "Climbing jagged rocks and slick moss.": "Lagoon",
      "Tending to a most troublesome and dangerous garden.": "Living Garden",
      "Enjoying a drink on the overgrown rooftop patio.": "Living Garden",
      "Looking across vast landscapes and the many horizons of the land.":
        "Mountain",
      "Cutting through the pass to reach the town on the other side.":
        "Mountain",
      "In a treacherous environment where only the toughest of mice survive.":
        "Mountain",
      "Investigating the spirits of slain mice.": "Mousoleum",
      "Surveying where scientists harvest 'spare parts'.": "Mousoleum",
      "Studying the spooky remains of Zombie Mice.": "Mousoleum",
      "Climbing and exploring some long lost ruins.": "Moussu Picchu",
      "Up high upon a weather changing plateau.": "Moussu Picchu",
      "Visiting a walled city that is no stranger to sieges.": "Muridae Market",
      "Keeping a close eye on would-be thieves...": "Muridae Market",
      "Investigating a well-seasoned Gumbo Cheese.": "Nerg Plains",
      "Running through flat fields of greeN.": "Nerg Plains",
      "Reeling it in...": "Prologue Pond",
      "Choosing the right tackle...": "Prologue Pond",
      "Enjoying a quick dip in a cheesy bath.": "Queso River",
      "Sipping delicious liquid cheese from a river.": "Queso River",
      "Protecting her ears from the sound of loud pumps.": "Queso River",
      "Testing out balance on the high seas.": "S.S. Huntington IV",
      "Looking a bit queasy...": "S.S. Huntington IV",
      "Watching the sky and wondering what the weather will bring.":
        "Seasonal Garden",
      "Braving the ever-changing elements.": "Seasonal Garden",
      "Walking along the coldest waters in Gnawnia.": "Slushy Shoreline",
      "At the beachside site of an invasion force!": "Slushy Shoreline",
      "Shivering near the edges of the mainland.": "Slushy Shoreline",
      "Walking along the bottom of the Rodentia Ocean.": "Sunken City",
      "Investigating powerful diving equipment.": "Sunken City",
      "Sitting down at a wooden table...": "Table of Contents",
      "Creating clever characters...": "Table of Contents",
      "Amongst the triumphant trumpets of master hunters of old.":
        "Tournament Hall",
      "Browsing the rewards of competitive champions.": "Tournament Hall",
      "Competing for the limelight amongst the finest champions.":
        "Tournament Hall",
      "Exploring the deep and winding caverns near a technologically-advanced underground city.":
        "Town of Digby",
      "Amongst powerful drills and excavation equipment.": "Town of Digby",
      "Hiding in the shadows while standing in the limelight.": "Town of Digby",
      "Hiding within the hustle and bustle in the city of the crown.":
        "Town of Gnawnia",
      "Trying to spot the King himself.": "Town of Gnawnia",
      "In a town with a dense population.": "Town of Gnawnia",
      "Standing among the ranks of new students out in the field.":
        "Training Grounds",
      "Watching the careful training of artful students.": "Training Grounds",
      "Relaxing in the shade of tall engraved rock.": "Training Grounds",
      "Observing the churning and grinding of the new harvest.": "Windmill",
      "By an agricultural structure once owned by one of Gnawnia's most prosperous farmers.":
        "Windmill",
      "Grinding up hundreds of tiny seeds from a stalky, golden plant.":
        "Windmill"
    };

    // MutationObserver logic for map UI
    // Observers are attached to a *specific* element (will DC if removed from DOM)
    const observerTarget = document.getElementById("overlayPopup");
    if (observerTarget) {
      MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

      const observer = new MutationObserver(function () {
        // Render if Relic Hunter hint is available
        const rhHint = observerTarget.querySelector(
          ".treasureMapInventoryView-relicHunter-hint"
        );

        // Prevent conflict with 'Mapping Helper'
        const mapTab = observerTarget.querySelector(
          ".treasureMapManagerView-header-navigation-item.tasks.active"
        );

        // Prevent conflict with 'Bulk Map Invites'
        const inviteHeader = document.querySelector(
          // ".treasureMapPopup-inviteFriend-header"
          ".treasureMapManagerDialogView-userSelector"
        );

        if (rhHint && !mapTab && !inviteHeader) {
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

    function render() {
      document.querySelectorAll(".tsitu-rh-helper").forEach(el => el.remove());

      const div = document.createElement("div");
      div.style.textAlign = "center";
      div.className = "tsitu-rh-helper";
      const button = document.createElement("a");
      button.href = "#";
      button.className = "mousehuntActionButton small";
      const locSpan = document.createElement("span");
      locSpan.style.fontSize = "12px";
      locSpan.innerText = "N/A";

      const rhHint = observerTarget.querySelector(
        ".treasureMapInventoryView-relicHunter-hint"
      );
      const hint = rhHint.textContent;
      Object.keys(hintMap).forEach(key => {
        const loc = hintMap[key];
        if (hint == key) {
          locSpan.innerText = `Location: ${loc}`;
          button.onclick = function () {
            const newWindow = window.open(
              "https://www.mousehuntgame.com/travel.php?tab=map"
            );
            newWindow.addEventListener("load", function () {
              const hud = newWindow.document.querySelector(
                ".mousehuntHud-page-tabContent[data-tab='map']"
              );
              if (hud && hud.classList.contains("full")) {
                newWindow.document
                  .querySelectorAll(
                    ".travelPage-map-region-environment-link-name"
                  )
                  .forEach(el => {
                    if (el.textContent == loc) {
                      el.click();
                    }
                  });

                const scrollTo = newWindow.document.querySelector(
                  ".travelPage-map-simpleToggle.full"
                );
                if (scrollTo) {
                  scrollTo.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                    inline: "nearest"
                  });
                }
              }
            });
            return false;
          };
        }
      });

      const buttonText = document.createElement("span");
      buttonText.innerText = "Travel";
      button.appendChild(buttonText);

      div.appendChild(button);
      div.appendChild(locSpan);
      rhHint.insertAdjacentElement("afterend", div);
    }
  })();
})();
