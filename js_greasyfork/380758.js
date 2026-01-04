// ==UserScript==
// @name         MouseHunt - Bulk Map Invites
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.1
// @description  Easily invite many friends to your maps
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/380758/MouseHunt%20-%20Bulk%20Map%20Invites.user.js
// @updateURL https://update.greasyfork.org/scripts/380758/MouseHunt%20-%20Bulk%20Map%20Invites.meta.js
// ==/UserScript==

(function() {
  const observerTarget = document.getElementById("overlayPopup");
  if (observerTarget) {
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    const observer = new MutationObserver(function() {
      // Callback
      const inviteHeader = document.querySelector(
        ".treasureMapPopup-inviteFriend-header"
      );

      // Render if friend invite header is in DOM
      if (inviteHeader) {
        // Disconnect and reconnect later to prevent mutation loop
        observer.disconnect();
        render(observer);
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

  function render(observer) {
    const obj = {}; // key = location, value = <a> array
    const friendVal = localStorage.getItem("tsitu-invite-friends") || "false";

    document
      .querySelectorAll(
        ".userSelectorView-userList-group.default a.treasureMapPopup-inviteFriend-row"
      )
      .forEach(el => {
        if (el.children.length === 7) insert(el);
      });

    if (friendVal == "true") {
      document
        .querySelectorAll(
          ".userSelectorView-userList-group.busy a.treasureMapPopup-inviteFriend-row"
        )
        .forEach(el => {
          if (el.children.length === 7) insert(el);
        });
    }

    // Insert location and <a> into obj
    function insert(el) {
      const location = el.children[1].textContent;
      if (obj[location] === undefined) {
        obj[location] = [el];
      } else {
        obj[location].push(el);
      }
    }

    const target = document.querySelector(
      ".treasureMapPopup-map-state.inviteFriends .treasureMapPopup-rightBlock"
    );
    if (target) {
      // Remove master div if it exists
      const existing = document.querySelector(".tsitu-map-invites-div");
      if (existing) existing.remove();

      // Initialize master div + styling
      const div = document.createElement("div");
      div.className = "tsitu-map-invites-div";
      div.style.margin = "0 10px 0 10px";
      div.style.textAlign = "center";

      function clickListener() {
        // Updates localStorage and re-renders
        observer.disconnect();

        localStorage.setItem(
          "tsitu-invite-friends",
          document.querySelector(".tsitu-map-friends-box").checked
        );

        localStorage.setItem(
          "tsitu-invite-sort",
          document.querySelector(".tsitu-loc-sort-box").checked
        );

        localStorage.setItem(
          "tsitu-invite-select",
          document.querySelector(".tsitu-friend-select-box").checked
        );

        render(observer);

        observer.observe(observerTarget, {
          childList: true,
          subtree: true
        });
      }

      // All friends or only those not currently on a map
      const friendType = document.createElement("input");
      friendType.type = "checkbox";
      friendType.className = "tsitu-map-friends-box";
      friendType.name = "tsitu-map-friends";
      friendType.addEventListener("click", clickListener);

      const friendTypeLabel = document.createElement("label");
      friendTypeLabel.className = "tsitu-map-friends-label";
      friendTypeLabel.htmlFor = "tsitu-map-friends";
      friendTypeLabel.innerHTML = "Friends: <b>Not On Map</b> / All";

      // friendType checkmark
      const ftChecked = localStorage.getItem("tsitu-invite-friends") || "false";
      friendType.checked = ftChecked === "true";
      if (friendType.checked) {
        friendTypeLabel.innerHTML = "Friends: Not On Map / <b>All</b>";
      }

      // Sort locations alphabetically or by most hunters
      const locationSort = document.createElement("input");
      locationSort.type = "checkbox";
      locationSort.className = "tsitu-loc-sort-box";
      locationSort.name = "tsitu-loc-sort";
      locationSort.addEventListener("click", clickListener);

      const locationSortLabel = document.createElement("label");
      locationSortLabel.className = "tsitu-loc-sort-label";
      locationSortLabel.htmlFor = "tsitu-loc-sort";
      locationSortLabel.innerHTML = "Sort: <b>Alpha</b> / # Hunters";

      // locationSort checkmark
      const lsChecked = localStorage.getItem("tsitu-invite-sort") || "false";
      locationSort.checked = lsChecked === "true";
      if (locationSort.checked) {
        locationSortLabel.innerHTML = "Sort: Alpha / <b># Hunters</b>";
      }

      // Select friends randomly or by most clues found
      const friendSelect = document.createElement("input");
      friendSelect.type = "checkbox";
      friendSelect.className = "tsitu-friend-select-box";
      friendSelect.name = "tsitu-friend-select";
      friendSelect.addEventListener("click", clickListener);

      const friendSelectLabel = document.createElement("label");
      friendSelectLabel.className = "tsitu-friend-select-label";
      friendSelectLabel.htmlFor = "tsitu-friend-select";
      friendSelectLabel.innerHTML = "Select: <b>Random</b> / # Clues";

      // friendSelect checkmark
      const fsChecked = localStorage.getItem("tsitu-invite-select") || "false";
      friendSelect.checked = fsChecked === "true";
      if (friendSelect.checked) {
        friendSelectLabel.innerHTML = "Select: Random / <b># Clues</b>";
      }

      // Button to click <a>'s
      const goButton = document.createElement("button");
      goButton.className = "button";
      goButton.style.fontSize = "1.7em";
      goButton.style.marginBottom = "5px";
      goButton.innerText = "Go";
      goButton.addEventListener("click", function() {
        observer.disconnect();
        unclickRows();

        // Routine to click up to 8 friends
        const location = document.querySelector(".tsitu-map-loc-dropdown")
          .value;
        if (location) {
          // Cache location name
          localStorage.setItem("tsitu-invite-location", location);

          // Get friend select preference
          const selectVal =
            localStorage.getItem("tsitu-invite-select") == "true";

          if (location === "All") {
            const rawArr = [];
            for (let el of Object.keys(obj)) {
              for (let a of obj[el]) {
                rawArr.push(a);
              }
            }
            let sortArr = [];
            if (selectVal) {
              sortArr = arrayClues(rawArr);
            } else {
              sortArr = arrayShuffle(rawArr);
            }
            const maxIter = sortArr.length > 8 ? 8 : sortArr.length;
            for (let i = 0; i < maxIter; i++) {
              sortArr[i].click();
            }
          } else {
            let sortArr = [];
            if (selectVal) {
              sortArr = arrayClues(obj[location]);
            } else {
              sortArr = arrayShuffle(obj[location]);
            }
            const maxIter = sortArr.length > 8 ? 8 : sortArr.length;
            for (let i = 0; i < maxIter; i++) {
              sortArr[i].click();
            }
          }
        }

        observer.observe(observerTarget, {
          childList: true,
          subtree: true
        });
      });

      // Button to unclick <a>'s
      const undoButton = document.createElement("button");
      undoButton.className = "button";
      undoButton.style.fontSize = "1.3em";
      undoButton.innerText = "↩️";
      undoButton.addEventListener("click", function() {
        observer.disconnect();
        unclickRows();
        observer.observe(observerTarget, {
          childList: true,
          subtree: true
        });
      });

      // Final element manipulation
      div.appendChild(goButton);
      div.appendChild(undoButton);
      div.appendChild(document.createElement("br"));
      div.appendChild(populateDropdown(obj));
      div.appendChild(document.createElement("br"));
      div.appendChild(friendType);
      div.appendChild(friendTypeLabel);
      div.appendChild(document.createElement("br"));
      div.appendChild(locationSort);
      div.appendChild(locationSortLabel);
      div.appendChild(document.createElement("br"));
      div.appendChild(friendSelect);
      div.appendChild(friendSelectLabel);
      target.appendChild(div);
    }
  }

  /**
   * Return <select> dropdown of sorted locations
   * Includes # of hunters per location in parentheses
   * Implicitly handles empty obj
   * @param {object} obj Object with key = location, value = array of <a>
   * @return {<select>} <select> with desired friend inclusion & location sort
   */
  function populateDropdown(obj) {
    // Remove dropdown if it exists
    const existing = document.querySelector(".tsitu-map-loc-dropdown");
    if (existing) existing.remove();

    // Create new dropdown and style it
    const dropdown = document.createElement("select");
    dropdown.className = "tsitu-map-loc-dropdown";
    dropdown.style.width = "100%";
    dropdown.style.marginBottom = "2px";

    // Add initial 'All' location option
    let counter = 0;
    const unsortedKeys = Object.keys(obj);
    unsortedKeys.forEach(el => {
      counter += obj[el].length;
    });

    const allOption = document.createElement("option");
    allOption.textContent = `All (${counter})`;
    allOption.value = "All";
    dropdown.appendChild(allOption);

    // Apply desired sort to location keys
    const sortVal = localStorage.getItem("tsitu-invite-sort") || "false";
    let sortedKeys = unsortedKeys;
    if (sortVal == "false") {
      sortedKeys = unsortedKeys.sort();
    } else if (sortVal == "true") {
      sortedKeys = unsortedKeys.sort(function(a, b) {
        return obj[b].length - obj[a].length;
      });
    }

    // Append <option>'s to the <select>
    for (let loc of sortedKeys) {
      const option = document.createElement("option");
      option.textContent = `${loc} (${obj[loc].length})`;
      option.value = loc;
      dropdown.appendChild(option);
    }

    // Select a dropdown value if available from cache
    const cachedLoc = localStorage.getItem("tsitu-invite-location");
    for (let el of dropdown.options) {
      const loc = el.textContent.split(" (")[0];
      if (loc === cachedLoc) {
        dropdown.value = cachedLoc;
      }
    }

    return dropdown;
  }

  // Routine to unclick invited friend rows
  function unclickRows() {
    // First pass: Try highlighted rows
    const highlighted = document.querySelectorAll(
      ".treasureMapPopup-inviteFriend-row.selected"
    );
    highlighted.forEach(el => el.click());

    // Second pass: Try to match icon images and names
    const selected = document.querySelectorAll(
      ".treasureMapPopup-inviteAction-friendSlot:not(.empty)"
    );
    if (selected.length > 0) {
      // Memoize obj with key = graph icon ID, value = player name
      const memo = {};
      selected.forEach(el => {
        const id = el.style.backgroundImage
          .split(".com/")[1]
          .split("/picture")[0];
        const name = el.title;
        memo[id] = name;
      });

      const memoKeys = Object.keys(memo);
      const rows = document.querySelectorAll(
        ".treasureMapPopup-inviteFriend-row.userSelectorView-user"
      );
      rows.forEach(el => {
        const id = el
          .querySelector(".treasureMapPopup-inviteFriend-profilePic")
          .style.backgroundImage.split(".com/")[1]
          .split("/picture")[0];
        if (memoKeys.indexOf(id) >= 0) {
          const name = el.querySelector(
            ".treasureMapPopup-inviteFriend-friendName"
          ).textContent;
          if (memo[id] === name) {
            el.click();
          }
        }
      });
    }
  }

  /**
   * @param {<a>[]} arr Input <a> array
   * @return {<a>[]} Randomly shuffled <a> array
   */
  function arrayShuffle(arr) {
    // Durstenfeld Shuffle
    let shuffledArr = arr.slice(0);
    for (let i = shuffledArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArr[i];
      shuffledArr[i] = shuffledArr[j];
      shuffledArr[j] = temp;
    }

    return shuffledArr;
  }

  /**
   * Returns an <a> array sorted by most clues found
   * @param {<a>[]} arr Input <a> array
   * @return {<a>[]} Sorted <a> array
   */
  function arrayClues(arr) {
    return arr.sort(function(a, b) {
      return (
        parseInt(b.children[2].textContent) -
        parseInt(a.children[2].textContent)
      );
    });
  }
})();
