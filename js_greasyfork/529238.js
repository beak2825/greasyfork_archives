// ==UserScript==
// @name         Torn War Stuff Enhanced
// @namespace    namespace
// @version      1.9.2
// @description  Show travel status and hospital time and sort by hospital time on war page. Fork of https://greasyfork.org/en/scripts/448681-torn-war-stuff
// @author       xentac
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/529238/Torn%20War%20Stuff%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/529238/Torn%20War%20Stuff%20Enhanced.meta.js
// ==/UserScript==

(async function () {
  ("use strict");

  if (document.querySelector("div#FFScouterV2DisableWarMonitor")) {
    // We're already set up...
    return;
  }

  const ffScouterV2DisableWarMonitor = document.createElement("div");
  ffScouterV2DisableWarMonitor.id = "FFScouterV2DisableWarMonitor";
  ffScouterV2DisableWarMonitor.style.display = "none";
  document.documentElement.appendChild(ffScouterV2DisableWarMonitor);

  let apiKey =
    localStorage.getItem("xentac-torn_war_stuff_enhanced-apikey") ??
    "###PDA-APIKEY###";
  const sort_enemies = true;
  let ever_sorted = false;
  const CONTENT = "data-twse-content";
  const TRAVELING = "data-twse-traveling";
  const HIGHLIGHT = "data-twse-highlight";

  try {
    GM_registerMenuCommand("Set Api Key", function () {
      checkApiKey(false);
    });
  } catch (error) {
    // This is fine, but we need to handle torn pda too
  }

  function checkApiKey(checkExisting = true) {
    if (
      !checkExisting ||
      apiKey === null ||
      apiKey.indexOf("PDA-APIKEY") > -1 ||
      apiKey.length != 16
    ) {
      let userInput = prompt(
        "Please enter a PUBLIC Api Key, it will be used to get basic faction information:",
        apiKey ?? "",
      );
      if (userInput !== null && userInput.length == 16) {
        apiKey = userInput;
        localStorage.setItem(
          "xentac-torn_war_stuff_enhanced-apikey",
          userInput,
        );
      } else {
        console.error(
          "[TornWarStuffEnhanced] User cancelled the Api Key input.",
        );
      }
    }
  }

  GM_addStyle(`
.members-list li:has(div.status[data-twse-highlight="true"]) {
  background-color: #afa5 !important;
}
`);

  GM_addStyle(`
.members-list div.status[data-twse-traveling="true"]::after {
  color: #F287FF !important;
}
`);

  GM_addStyle(`
.members-list div.status {
  position: relative !important;
  color: transparent !important;
}
.members-list div.status::after {
  content: attr(data-twse-content);
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 10px);
  height: 100%;
  background: inherit;
  display: flex;
  right: 10px;
  justify-content: flex-end;
  align-items: center;
}
.members-list .ok.status::after {
    color: var(--user-status-green-color);
}


.members-list .not-ok.status::after {
    color: var(--user-status-red-color);
}

.members-list .abroad.status::after, .members-list .traveling.status::after {
    color: var(--user-status-blue-color);
}
`);

  let running = true;
  let found_war = false;
  let pageVisible = !document.hidden;

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
  });

  let member_lists = document.querySelectorAll("ul.members-list");

  const refresh_member_lists = () => {
    member_lists = document.querySelectorAll("ul.members-list");
  };

  function get_faction_ids() {
    refresh_member_lists();
    const nodes = get_member_lists();
    const faction_ids = [];
    nodes.forEach((elem) => {
      const q = elem.querySelector(`A[href^='/factions.php']`);
      if (!q) {
        return;
      }
      const s = q.href.split("ID=");
      if (s.length <= 1) {
        return;
      }
      const id = s[1];
      if (id) {
        faction_ids.push(id);
      }
    });
    return faction_ids;
  }

  function get_member_lists() {
    return member_lists;
  }

  function get_sorted_column(member_list) {
    const member_div = member_list.parentNode.querySelector("div.member div");
    const level_div = member_list.parentNode.querySelector("div.level div");
    const points_div = member_list.parentNode.querySelector("div.points div");
    const status_div = member_list.parentNode.querySelector("div.status div");

    let column = null;
    let order = null;

    let classname = "";

    if (member_div && member_div.className.match(/activeIcon__/)) {
      column = "member";
      classname = member_div.className;
    } else if (level_div && level_div.className.match(/activeIcon__/)) {
      column = "level";
      classname = level_div.className;
    } else if (points_div && points_div.className.match(/activeIcon__/)) {
      column = "points";
      classname = points_div.className;
    } else if (status_div && status_div.className.match(/activeIcon__/)) {
      column = "status";
      classname = status_div.className;
    }

    if (classname && classname.match(/asc__/)) {
      order = "asc";
    } else {
      order = "desc";
    }

    if (column != "score" && order != "desc") {
      ever_sorted = true;
    }

    return { column: column, order: order };
  }

  function pad_with_zeros(n) {
    if (n < 10) {
      return "0" + n;
    }
    return n;
  }

  const member_status = new Map();
  const member_lis = new Map();

  let last_request = null;
  const MIN_TIME_SINCE_LAST_REQUEST = 10000;

  const description_cache = new Map();

  const descriptions_observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.classList && node.classList.contains("descriptions")) {
          console.log("[TornWarStuffEnhanced] .descriptions added to DOM");
          faction_war_observer.observe(node, {
            childList: true,
            subtree: true,
          });
          // Check to see if the node already exists on add
          for (const child of node.childNodes) {
            faction_war_check(child);
          }
        }
      }
      for (const node of mutation.removedNodes) {
        if (node.classList && node.classList.contains("descriptions")) {
          console.log("[TornWarStuffEnhanced] .descriptions removed from DOM");
          faction_war_observer.disconnect();
        }
      }
    }
  });

  const faction_war_check = (node) => {
    if (node.classList && node.classList.contains("faction-war")) {
      console.log(
        "[TornWarStuffEnhanced] Observed mutation of .faction-war node",
      );
      found_war = true;
      extract_all_member_lis();
      update_statuses();
      faction_war_observer.disconnect();
    }
  };

  const faction_war_observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        faction_war_check(node);
      }
    }
  });

  const found_faction_war_list = (factwarlist) => {
    console.log("[TornWarStuffEnhanced] Found #faction_war_list_id");
    if (factwarlist.querySelector(".faction-war")) {
      console.log("[TornWarStuffEnhanced] .faction-war already exists");
      found_war = true;
      extract_all_member_lis();
      update_statuses();
      return;
    }
    if (found_war) {
      return;
    }
    console.log("[TornWarStuffEnhanced] Adding descriptions observer");
    descriptions_observer.observe(factwarlist, { childList: true });
    const descriptions = factwarlist.querySelector(".descriptions");
    if (descriptions) {
      console.log(
        "[TornWarStuffEnhanced] .descriptions already exists, adding .faction-war observer",
      );
      faction_war_observer.observe(descriptions, {
        childList: true,
        subtree: true,
      });
    }
  };

  const document_observer = new MutationObserver(() => {
    const factwarlist = document.querySelector("#faction_war_list_id");
    if (factwarlist) {
      console.log(
        "[TornWarStuffEnhanced] Found #faction_war_list_id within a mutation.",
      );
      found_faction_war_list(factwarlist);
      document_observer.disconnect();
    }
  });

  // Check to see if #faction_war_list_id already exists
  const factwarlist = document.querySelector("#faction_war_list_id");
  if (factwarlist) {
    console.log(
      "[TornWarStuffEnhanced] Found #faction_war_list_id in document already.",
    );
    found_faction_war_list(factwarlist);
    document_observer.disconnect();
  }

  // Observe all page changes till we find #faction_war_list_id
  document_observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
  console.log(
    "[TornWarStuffEnhanced] #faction_war_list_id observer installed.",
  );

  // Wait 10 seconds and check one last time for #faction_war_list_id
  // Then remove the observer even if we don't find it
  setTimeout(() => {
    const factwarlist = document.querySelector("#faction_war_list_id");
    if (factwarlist) {
      console.log(
        "[TornWarStuffEnhanced] Found #faction_war_list_id in document after 10 seconds.",
      );
      found_faction_war_list(factwarlist);
    }
    document_observer.disconnect();
  }, 10000);

  async function update_statuses() {
    if (!running) {
      return;
    }
    const faction_ids = get_faction_ids();
    // If the faction ids are not yet available, give up and let us request again next time
    if (faction_ids.length == 0) {
      return;
    }
    if (
      last_request &&
      new Date() - last_request < MIN_TIME_SINCE_LAST_REQUEST
    ) {
      return;
    }
    last_request = new Date();
    for (let i = 0; i < faction_ids.length; i++) {
      if (!update_status(faction_ids[i])) {
        return;
      }
    }
  }

  async function update_status(faction_id) {
    let error = false;
    const status = await fetch(
      `https://api.torn.com/faction/${faction_id}?selections=basic&key=${apiKey}&comment=TornWarStuffEnhanced`,
    )
      .then((r) => r.json())
      .catch((m) => {
        console.error("[TornWarStuffEnhanced] ", m);
        error = true;
      });
    if (error) {
      return true;
    }
    if (status.error) {
      console.log(
        "[TornWarStuffEnhanced] Received error from torn API ",
        status.error,
      );
      if (
        [0, 1, 2, 3, 4, 6, 7, 10, 12, 13, 14, 16, 18, 21].includes(status.error)
      ) {
        console.log(
          "[TornWarStuffEnhanced] Received a non-recoverable error. Giving up.",
        );
        running = false;
        return false;
      }
      if ([5, 8, 9].includes(status.error.code)) {
        // 5: Too many requests error code
        // 8: IP block
        // 9: API disabled
        // Try again in 30 + MIN_TIME_SINCE_LAST_REQUEST seconds
        console.log("[TornWarStuffEnhanced] Retrying in 40 seconds.");
        last_request = new Date() + 30000;
      }
      return false;
    }
    if (!status.members) {
      return false;
    }
    for (const [k, v] of Object.entries(status.members)) {
      let d_cache = description_cache.get(v.status.description);
      if (!d_cache) {
        d_cache = v.status.description
          .replace("South Africa", "SA")
          .replace("Cayman Islands", "CI")
          .replace("United Kingdom", "UK")
          .replace("Argentina", "Arg")
          .replace("Switzerland", "Switz");
      }
      v.status.description = d_cache;
      member_status.set(k, v.status);
    }
  }

  function extract_all_member_lis() {
    member_lis.clear();
    refresh_member_lists();
    get_member_lists().forEach((ul) => {
      extract_member_lis(ul);
    });
  }

  function extract_member_lis(ul) {
    const lis = ul.querySelectorAll("LI.enemy, li.your");
    lis.forEach((li) => {
      const atag = li.querySelector(`A[href^='/profiles.php']`);
      if (!atag) {
        return;
      }
      const id = atag.href.split("ID=")[1];
      member_lis.set(id, {
        li: li,
        div: li.querySelector("DIV.status"),
      });
    });
  }

  const TIME_BETWEEN_FRAMES = 500;
  const deferredWrites = [];

  function watch() {
    let dirtySort = false;
    deferredWrites.length = 0;
    member_lis.forEach((elem, id) => {
      const li = elem.li;
      if (!li) {
        return;
      }
      const status = member_status.get(id);
      const status_DIV = elem.div;
      if (!status_DIV) {
        return;
      }
      if (!status || !running) {
        // Make sure the user sees something before we've downloaded state
        deferredWrites.push([status_DIV, CONTENT, status_DIV.textContent]);
        return;
      }

      if (li.getAttribute("data-until") != status.until) {
        deferredWrites.push([li, "data-until", status.until]);
        dirtySort = true;
      }
      let data_location = "";
      switch (status.state) {
        case "Abroad":
        case "Traveling":
          if (
            !(
              status_DIV.classList.contains("traveling") ||
              status_DIV.classList.contains("abroad")
            )
          ) {
            deferredWrites.push([status_DIV, CONTENT, status_DIV.textContent]);
            break;
          }
          if (status.description.includes("Traveling to ")) {
            if (li.getAttribute("data-sortA") != "4") {
              deferredWrites.push([li, "data-sortA", "4"]);
              dirtySort = true;
            }
            const content = "► " + status.description.split("Traveling to ")[1];
            data_location = content;
            deferredWrites.push([status_DIV, CONTENT, content]);
          } else if (status.description.includes("In ")) {
            if (li.getAttribute("data-sortA") != "3") {
              deferredWrites.push([li, "data-sortA", "3"]);
              dirtySort = true;
            }
            const content = status.description.split("In ")[1];
            data_location = content;
            deferredWrites.push([status_DIV, CONTENT, content]);
          } else if (status.description.includes("Returning")) {
            if (li.getAttribute("data-sortA") != "2") {
              deferredWrites.push([li, "data-sortA", "2"]);
              dirtySort = true;
            }
            const content =
              "◄ " + status.description.split("Returning to Torn from ")[1];
            data_location = content;
            deferredWrites.push([status_DIV, CONTENT, content]);
          } else if (status.description.includes("Traveling")) {
            if (li.getAttribute("data-sortA") != "5") {
              deferredWrites.push([li, "data-sortA", "5"]);
              dirtySort = true;
            }
            const content = "Traveling";
            data_location = content;
            deferredWrites.push([status_DIV, CONTENT, content]);
          }
          break;
        case "Hospital":
        case "Jail":
          if (
            !(
              status_DIV.classList.contains("hospital") ||
              status_DIV.classList.contains("jail")
            )
          ) {
            deferredWrites.push([status_DIV, CONTENT, status_DIV.textContent]);
            deferredWrites.push([status_DIV, TRAVELING, "false"]);
            deferredWrites.push([status_DIV, HIGHLIGHT, "false"]);
            break;
          }
          if (li.getAttribute("data-sortA") != "1") {
            deferredWrites.push([li, "data-sortA", "1"]);
            dirtySort = true;
          }
          if (status.description.includes("In a")) {
            deferredWrites.push([status_DIV, TRAVELING, "true"]);
          } else {
            deferredWrites.push([status_DIV, TRAVELING, "false"]);
          }

          let now = new Date().getTime() / 1000;
          if (window.getCurrentTimestamp) {
            now = window.getCurrentTimestamp() / 1000;
          }
          const hosp_time_remaining = Math.round(status.until - now);
          if (hosp_time_remaining <= 0) {
            deferredWrites.push([status_DIV, HIGHLIGHT, "false"]);
            return;
          }
          const s = Math.floor(hosp_time_remaining % 60);
          const m = Math.floor((hosp_time_remaining / 60) % 60);
          const h = Math.floor(hosp_time_remaining / 60 / 60);
          const time_string = `${pad_with_zeros(h)}:${pad_with_zeros(m)}:${pad_with_zeros(s)}`;

          if (status_DIV.getAttribute(CONTENT) != time_string) {
            deferredWrites.push([status_DIV, CONTENT, time_string]);
          }

          if (hosp_time_remaining < 300) {
            deferredWrites.push([status_DIV, HIGHLIGHT, "true"]);
          } else {
            deferredWrites.push([status_DIV, HIGHLIGHT, "false"]);
          }
          break;

        default:
          deferredWrites.push([status_DIV, CONTENT, status_DIV.textContent]);
          if (li.getAttribute("data-sortA") != "0") {
            deferredWrites.push([li, "data-sortA", "0"]);
            dirtySort = true;
          }
          deferredWrites.push([status_DIV, TRAVELING, "false"]);
          deferredWrites.push([status_DIV, HIGHLIGHT, "false"]);
          break;
      }
      if (li.getAttribute("data-location") != data_location) {
        deferredWrites.push([li, "data-location", data_location]);
        dirtySort = true;
      }
    });
    for (const [elem, attrib, value] of deferredWrites) {
      elem.setAttribute(attrib, value);
    }
    deferredWrites.length = 0;
    if (sort_enemies && dirtySort) {
      // Only sort if Status is the field to be sorted
      const nodes = get_member_lists();
      for (let i = 0; i < nodes.length; i++) {
        let sorted_column = get_sorted_column(nodes[i]);
        if (!ever_sorted) {
          sorted_column = { column: "status", order: "asc" };
        }
        if (sorted_column["column"] != "status") {
          continue;
        }
        let lis = nodes[i].childNodes;
        let sorted_lis = Array.from(lis).sort((a, b) => {
          let left = a;
          let right = b;
          if (sorted_column["order"] == "desc") {
            left = b;
            right = a;
          }
          const sorta =
            left.getAttribute("data-sortA") - right.getAttribute("data-sortA");
          if (sorta != 0) {
            return sorta;
          }
          const left_location = left.getAttribute("data-location");
          const right_location = right.getAttribute("data-location");
          if (left_location && right_location) {
            if (left_location < right_location) {
              return -1;
            } else if (left_location == right_location) {
              return 0;
            } else {
              return 1;
            }
          }
          return (
            left.getAttribute("data-until") - right.getAttribute("data-until")
          );
        });
        let sorted = true;
        for (let j = 0; j < sorted_lis.length; j++) {
          if (nodes[i].children[j] !== sorted_lis[j]) {
            sorted = false;
            break;
          }
        }
        if (!sorted) {
          const fragment = document.createDocumentFragment();
          sorted_lis.forEach((li) => {
            fragment.appendChild(li);
          });
          nodes[i].appendChild(fragment);
        }
      }
    }
    for (const [id, ref] of member_lis) {
      if (!ref.li.isConnected) {
        member_lis.delete(id);
      }
    }
  }

  setInterval(() => {
    if (!running || !found_war) return;
    update_statuses();
  }, MIN_TIME_SINCE_LAST_REQUEST);

  setInterval(() => {
    if (!found_war || !running || !pageVisible) {
      return;
    }

    watch();
  }, TIME_BETWEEN_FRAMES);

  console.log("[TornWarStuffEnhanced] Initialized");

  window.dispatchEvent(new Event("FFScouterV2DisableWarMonitor"));
})();
