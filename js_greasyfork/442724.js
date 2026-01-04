// ==UserScript==
// @name                FF Progs
// @name:en             FF Progs
// @description         Improves FFlogs.
// @description:en      Improves FFlogs.
// @version             1.5.2
// @namespace           k_fizzel
// @author              Chad Bradly
// @website             https://www.fflogs.com/character/id/12781922
// @icon                https://assets.rpglogs.com/img/ff/favicon.png?v=2
// @match               https://*.fflogs.com/*
// @match               https://*.warcraftlogs.com/*
// @match               https://*.tomestone.gg/*
// @require             https://code.jquery.com/jquery-3.2.0.min.js
// @grant               unsafeWindow
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @license             MIT License
// @downloadURL https://update.greasyfork.org/scripts/442724/FF%20Progs.user.js
// @updateURL https://update.greasyfork.org/scripts/442724/FF%20Progs.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // If you want to add more filter expression presets, you can add them here.
  const PIN_PRESETS = {
    "No Filter": "",
    "Calculated Damage": "type='calculateddamage'",
    Damage: "type='damage'",
    Cast: "type='cast'",
    Targetability: "type='targetabilityupdate'",
    Ghosted: "isUnpairedCalculation=true",
    Missed: `2$Main$#feff14$script$let friendlyDamageEvents=[],damageEventLookup=new Map;const initializePinForFight=i=>{friendlyDamageEvents=i.allEventsByCategoryAndDisposition("calculatedDamage","friendly"),damageEventLookup=new Map;for(const i of friendlyDamageEvents){if(!i.ability)continue;let s=damageEventLookup.get(i.timestamp);if(s||(s=new Map,damageEventLookup.set(i.timestamp,s)),s.has(i.ability.id)){const t=s.get(i.ability.id);i.isMiss||(t.hasNonMiss=!0)}else s.set(i.ability.id,{firstIsMiss:i.isMiss,hasNonMiss:!i.isMiss})}},pinMatchesFightEvent=(i,s)=>{if(!i.ability)return!1;const t=damageEventLookup.get(i.timestamp);if(!t)return!1;const e=t.get(i.ability.id);return!!e&&(!!e.firstIsMiss||!!i.isMiss&&!e.hasNonMiss)};`,
    GCD: "ability.isOffGCD=false",
    "Kill Event": "kill",
    LB: `2$Main$#ffff14$script$let limitBreakTimestamps=[];const initializePinForFight=f=>{if(!f?.events)return;const t=f.events.filter((e=>"limitbreakupdate"===e.type));limitBreakTimestamps=t.map((e=>e.timestamp))},pinMatchesFightEvent=(e,f)=>{if(!e)return!1;switch(e.type){case"limitbreakupdate":return limitBreakTimestamps.includes(e.timestamp)||limitBreakTimestamps.push(e.timestamp),!0;case"calculateddamage":if("Player"===e.target?.type&&limitBreakTimestamps.includes(e.timestamp))return!0;break;case"heal":if(!e.isTick&&limitBreakTimestamps.includes(e.timestamp))return!0}return!1};`,
    Magical: "ability.type=1024",
    Physical: "ability.type=128",
    Heal: "ability.type=8",
    DOT: "ability.type=64",
    "Buff/Debuff": "ability.type=1",
    Darkness: "ability.type=124",
    True: "ability.type=32",
    System: "ability.type=0",
  };

  const ABILITY_TYPES = {
    0: "System",
    1: "Buff/Debuff",
    // 2: "Unknown",
    // 4: "Unknown",
    8: "Heal",
    // 16: "Unknown",
    32: "True",
    64: "DOT",
    124: "Darkness",
    // 125: "Darkness?",
    // 126: "Darkness?",
    // 127: "Darkness?",
    128: "Physical",
    // 256: "Magical?",
    // 512: "Unknown",
    1024: "Magical",
  };

  const PASSIVE_LB_GAIN = [
    ["75"], // one bar
    ["180"], // two bars
    ["220", "170", "160", "154", "144", "140"], // three bars
  ];

  // For fights similar to M6S
  const RANK_PERCENTILE_FIGHTS = ["98"]

  const REPORTS_PATH_REGEX = /\/reports\/.+/;
  const ZONE_RANKINGS_PATH_REGEX = /\/zone\/rankings\/.+/;
  const CHARACTER_PATH_REGEX = /\/character\/.+/;
  const PROFILE_PATH_REGEX = /\/profile/;
  const LB_REGEX = /The limit break gauge updated to (\d+). There are (\d+) total bars./;
  const apiKey = GM_getValue("apiKey");
  let zones;

  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    return params;
  };

  const changeQueryParams = (defaultParams) => {
    const url = new URL(window.location);

    const queryParams = new URLSearchParams(url.search);

    Object.entries(defaultParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    });

    changeView(queryParams);
  };

  const updateTable = (onTableChange, tableName) => {
    const tableContainer = document.querySelector(tableName);
    if (tableContainer) {
      const observer = new MutationObserver(onTableChange);
      observer.observe(tableContainer, {
        attributes: true,
        characterData: true,
        childList: true,
      });
    }
  };

  const parseTime = (cell) => {
    const [_, sign, m, s, ms] = $(cell)
      .text()
      .match(/(-?)(\d+):(\d+)\.(\d+)/);
    const totalMs = (+m * 60000 + +s * 1000 + +ms) * (sign === "-" ? -1 : 1);
    return totalMs;
  }

 const escapeHtmlAttr = (str) => {
   if (str.length > 100) {
     return str.replace(/&/g, "&amp;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#39;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;");
   }
   return str;
 }


  const getBossId = () => {
    const src = $('#filter-fight-boss-icon').attr('src');
    const bossId = src.match(/\/(\d+)-icon\.jpg$/)?.[1];
    return bossId;
  }

  const characterAllStar = (rank, outOf, playerMetricAmmount, playerMetricRankOneAmmount) => {
    const bossId = getBossId();

    if (RANK_PERCENTILE_FIGHTS.includes(bossId)) {
      return Math.min(Math.max(120 * (1 - (rank - 1) / (outOf - 1)), 0), 120);
    }

    return Math.min(Math.max(100 * (playerMetricAmmount / playerMetricRankOneAmmount), 100 - (rank / outOf) * 100) + 20 * (playerMetricAmmount / playerMetricRankOneAmmount), 120);
  };

  // This Dose not work for 0.05 patches becaues fflogs rounds down on rankings page also only works for standard logs
  const getPartitionId = async (fightId, patch, area, partitionType) => {
    if (!zones) {
      const response = await fetch(`https://www.fflogs.com/v1/zones?api_key=${GM_getValue("apiKey")}`);
      if (!response.ok) {
        console.error("Failed to fetch zones:", response.statusText);
        return null;
      }
      zones = await response.json();
    }
    const foundZone = zones.find(zone => Array.isArray(zone.encounters) && zone.encounters.some(enc => enc.id === fightId)
    );
    if (!foundZone) return null;
    let i = 1;
    const matchingPartitions = (foundZone.partitions || []).filter(part => {
      if (!part.id) part.id = i++;
      if (!part.filtered_name) return false;
      return part.filtered_name.includes(patch) && part.compact.includes(partitionType) && !part.compact.includes("Non") && part.area === area
    });
    if (matchingPartitions.length === 0) {
      return foundZone.partitions.find(part => part.default === true)?.id || null;
    }

    const defaultPartition = matchingPartitions.find(part => part.default === true);
    if (defaultPartition) return defaultPartition.id;

    return matchingPartitions[0].id;
  }

  // AdBlock
  $(
    "#top-banner, .side-rail-ads, #bottom-banner, #subscription-message-tile-container, #playwire-video-container, #right-ad-box, #right-vertical-banner, #gear-box-ad, .a52596fdd-sticky-footer__children, .content-sidebar, #ap-ea8a4fe5-container, #tile-content-ap, #builds-banner"
  ).remove();
  $(".content-with-sidebar").css("display", "block");
  ['ad-sidebar-thin-container','ad-sidebar-skyscraper-container'].forEach(id=>document.getElementById(id)?.remove()),new MutationObserver(()=>{['ad-sidebar-thin-container','ad-sidebar-skyscraper-container'].forEach(id=>document.getElementById(id)?.remove())}).observe(document.documentElement,{childList:true,subtree:true});


  $("#table-container").css("margin", "0 0 0 0");

  // Reports Page
  if (REPORTS_PATH_REGEX.test(location.pathname)) {
    // Add XIV Analysis Button
    $("#filter-analyze-tab").before(
      `<a target="_blank" class="big-tab view-type-tab" id="xivanalysis-tab"><span class="zmdi zmdi-time-interval"></span> <span class="big-tab-text"><br>xivanalysis</span></a>`
    );
    $("#xivanalysis-tab").on("click", () => {
      window.open(`https://xivanalysis.com/report-redirect/${location.href}`, "_blank");
    });

    if (!$("#filter-rankings-tab").length) {
      $("#filter-replay-tab").before(
        `<a href="#" class="big-tab view-type-tab" id="filter-rankings-tab" onclick="return changeFilterView('rankings', this)" oncontextmenu="changeFilterView('rankings', this)"><span class="zmdi zmdi-sort"></span><span class="big-tab-text"><br>Rankings</span></a>`
      );
    }
    if ($("#report-archived-notice").length) {
      changeQueryParams({ view: "rankings", type: "" });
    }
    // Fixes Cursor behavior on Filter Type Tabs
    $("#filter-type-tabs").css("cursor", "default");

    const rankOnes = {};
    let jobs;

    const onTableChange = () => {
      let queryParams = getQueryParams();
      let lastLbGain;
      let lastTimeDiff;
      let lastSkillName;
      let lastSelectedPreset;

      // Filter Presets
      if (!queryParams.view || queryParams.view === "events" || queryParams.view === "timeline" || queryParams.view === "execution") {
        if (!$("#presets").length) {
          $("#graph-title-strip > div:first-child").after(
            `<div style="margin-left: auto; padding-right: 8px;" id="presets">
                No Overwrite:
                <input type="checkbox" id="no-overwrite" style="margin-right: 8px;">
                Filter Presets:
                  <select id="presets-select" style="margin-right: 8px;">
                    ${Object.entries(PIN_PRESETS)
              .map(([name, pin]) => `<option value="${escapeHtmlAttr(pin)}">${name}</option>`)
              .join("")}
                  </select>
                </div>`
          );

          $("#presets-select").on("change", (e) => {
            const selected = $("#presets-select").val();
            const name = $("#presets-select option:selected").text();

            if (!selected) {
              changeQueryParams({
                type: "",
                view: "",
                source: "",
                hostility: "",
                pins: "",
                start: "",
                end: "",
              });
              lastSelectedPreset = null;
              return;
            }
            if (name === "LB") {
              changeQueryParams({
                type: "summary",
                view: "events",
                source: "",
                pins: PIN_PRESETS.LB,
              });
              lastSelectedPreset = name
              return;
            }
            if (name === "Missed") {
              changeQueryParams({
                type: "damage-done",
                view: "events",
                source: "",
                pins: PIN_PRESETS.Missed,
              });
              lastSelectedPreset = name
              return;
            }
            if (name === "Kill Event") {
              changeQueryParams({
                type: "resources",
                view: "events",
                source: "",
                hostility: "1",
                pins: "",
                start: fightSegmentEndTime - 5 * 1000,
                end: fightSegmentEndTime,
              });
              lastSelectedPreset = name
              return;
            }
            const pinTemplate = `2$Off$#244F4B$expression$${selected}`;
            if ($("#no-overwrite").is(":checked") && lastSelectedPreset !== "LB" && lastSelectedPreset !== "Kill Event" && lastSelectedPreset !== "Missed") {
              queryParams = getQueryParams();
              changeQueryParams({ pins: queryParams.pins ? `${queryParams.pins}^${pinTemplate}` : pinTemplate });
            } else {
              changeQueryParams({ pins: pinTemplate });
            }
            lastSelectedPreset = name
          });
        }
      }

      // Rankings Tab
      if (queryParams.view === "rankings") {
        if (!GM_getValue("apiKey")) return;
        const rows = [];
        if (!jobs) {
          fetch(`https://www.fflogs.com/v1/classes?api_key=${GM_getValue("apiKey")}`)
            .then((res) => res.json())
            .then((data) => {
              jobs = data[0].specs;
              rows.forEach((row) => {
                updatePoints(row);
              });
            })
            .catch((err) => console.error(err));
        } else {
          setTimeout(() => {
            rows.forEach((row) => {
              updatePoints(row);
            });
          }, 0);
        }

        const updatePoints = async (row) => {
          const queryParams = getQueryParams();
          const rank = Number($(row).find("td:nth-child(2)").text().replace("~", ""));
          const outOf = Number($(row).find("td:nth-child(3)").text().replace(",", ""));
          const playerMetricAmmount = Number($(row).find("td:nth-child(6)").text().replace(",", ""));
          const jobName = $(row).find("td:nth-child(5) > a").attr("class") || "";
          const jobName2 = $(row).find("td:nth-child(5) > a:nth-last-child(1)").attr("class") || "";
          const patch = $(row).find("td:nth-child(8)").text().replace("\n", "");
          const patchNumber = parseFloat(patch);
          const playerMetric = patch < 5 ? "dps" : (queryParams.playermetric || "rdps");;

          // 1 is for non KR/CN reports kind of a magic number
          const partationId = await getPartitionId(reportsCache.filterFightBoss, patch, 1, "Standard");

          if (jobName2 !== "players-table-realm") {
            $(row)
              .find("td:nth-child(7)")
              .html(`<center><img src="https://cdn.7tv.app/emote/62523dbbbab59cfd1b8b889d/1x.webp" title="No api v1 endpoint for combined damage." style="height: 15px;"></center>`);
            return;
          }

          const updateCharecterAllStar = async () => {
            $(row).find("td:nth-child(7)").html(characterAllStar(rank, outOf, playerMetricAmmount, rankOnes[jobName][playerMetric]).toFixed(2));
          };

          if (!rankOnes[jobName]) {
            rankOnes[jobName] = {};
          }

          if (!rankOnes[jobName][playerMetric]) {
            const url = `https://www.fflogs.com/v1/rankings/encounter/${reportsCache.filterFightBoss}?metric=${playerMetric}&spec=${jobs.find((job) => job.name.replace(" ", "") === jobName)?.id}&partition=${partationId}&api_key=${GM_getValue("apiKey")}`;
            fetch(url)
              .then((res) => res.json())
              .then((data) => {
                rankOnes[jobName][playerMetric] = Number(data.rankings[0].total.toFixed(1));
                updateCharecterAllStar();
              })
              .catch((err) => console.error(err));
          } else {
            updateCharecterAllStar();
          }
        };

        $(".player-table").each((_i, table) => {
          $(table)
            .find("thead tr th:nth-child(6)")
            .after(
              `<th class="sorting ui-state-default" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Patch: activate to sort column ascending"><div class="DataTables_sort_wrapper">Points<span class="DataTables_sort_icon css_right ui-icon ui-icon-caret-2-n-s"></span></div></th>`
            );
          $(table)
            .find("tbody tr")
            .each((_i, row) => {
              $(row)
                .find("td:nth-child(6)")
                .after(`<td class="rank-per-second primary main-table-number"><center><span class="zmdi zmdi-spinner zmdi-hc-spin" style="color:white font-size:24px"></center></span></td>`);
              rows.push(row);
            });
        });
      }

      // Events Tab
      if (queryParams.view === "events") {
        if (queryParams.type === "resources") {
          return;
        }
        $(".events-table")
          .find("thead tr th:nth-child(1)")
          .after(`<th class="ui-state-default sorting_disabled" rowspan="1" colspan="1"><div class="DataTables_sort_wrapper">Diff<span class="DataTables_sort_icon"></span></div></th>`);

        $(".main-table-number").each((_i, cell) => {
          if (lastTimeDiff !== undefined) {
            const time = parseTime(cell);
            const diff = ((time - lastTimeDiff) / 1000).toFixed(3);
            const whiteListlastSkill = ["Ten", "Chi", "Jin", "Savage Claw"];
            const whiteListSkill = ["Quadruple Technical Finish", "Pneuma", "Star Prism"];
            let bgColor = "";
            const skillName = $(cell).next().next().find("a").text();
            if (queryParams.type === "casts" && !!queryParams.source && !whiteListlastSkill.includes(lastSkillName) && !!lastSkillName && !whiteListSkill.includes(skillName) && !!skillName) {
              if (diff < 0.576 && diff > 0.2) {
                bgColor = "background-color: chocolate !important;";
              }
              if (diff > 5) {
                bgColor = "background-color: gray !important;";
              }
            }
            lastSkillName = skillName;
            $(cell).after(`<td style="width: 2em; text-align: right; ${bgColor}">${diff}</td>`);
            lastTimeDiff = time;
          } else {
            $(cell).after(`<td style="width: 2em; text-align: right;"> - </td>`);
            lastTimeDiff = parseTime(cell);
          }
        });

        if (queryParams.type === "casts" && queryParams.hostility === "1") {
          $(".event-ability-cell a").each((_i, cell) => {
            const actionId = $(cell).attr("href").split("/")[5];
            const hexId = parseInt(actionId).toString(16);
            $(cell).text(`${$(cell).text()} [${hexId}]`);
          });
        }
      }

      // LB Pin
      if (queryParams.view === "events" && queryParams.type === "summary" && queryParams.pins === PIN_PRESETS.LB) {
        $(".events-table")
          .find("thead tr th:nth-last-child(3)")
          .after(`<th class="ui-state-default sorting_disabled" rowspan="1" colspan="1"><div class="DataTables_sort_wrapper">Active<span class="DataTables_sort_icon"></span></div></th>`);
        $(".events-table")
          .find("thead tr th:nth-last-child(2)")
          .after(`<th class="ui-state-default sorting_disabled" rowspan="1" colspan="1"><div class="DataTables_sort_wrapper">Bars<span class="DataTables_sort_icon"></span></div></th>`);

        $(".event-description-cell").each((_i, cell) => {
          const text = $(cell).text();
          if (text === "Event") {
            $(cell).html(`<div class="DataTables_sort_wrapper">Limit Break Total<span class="DataTables_sort_icon"></span></div>`);
            return;
          }

          if (!LB_REGEX.test(text)) {
            $(cell).before(`<td style="width: 2em; text-align: right; white-space: nowrap;"> * </td>`);
            $(cell).after(`<td style="width: 2em; text-align: right;"> * </td>`);
            return;
          }

          const lb = text.match(LB_REGEX);
          const currentLb = Number(lb?.[1]);
          const currentBars = Number(lb?.[2]);

          if (lb) {
            let diff;
            if (lastLbGain !== undefined) {
              diff = (currentLb - lastLbGain).toLocaleString();
            } else {
              diff = " - ";
            }
            lastLbGain = currentLb;
            let actualDiff = diff > 0 ? `+${diff}` : diff;

            if (PASSIVE_LB_GAIN[currentBars - 1].includes(diff)) {
              // passive lb gain
              diff = " - ";
            } else {
              // active lb gain
            }

            $(cell).before(`<td style="width: 2em; text-align: right; white-space: nowrap;">${diff}</td>`);
            $(cell).html(`${Number(currentLb).toLocaleString()} / ${(Number(currentBars) * 10000).toLocaleString()} <span style="float: right;">${actualDiff}</span>`);
            $(cell).after(`<td style="width: 2em; text-align: right;">${currentBars}</td>`);
          }
        });
      }
    };

    updateTable(onTableChange, "#table-container");
    onTableChange()
  }

  // Zone Rankings Page
  if (ZONE_RANKINGS_PATH_REGEX.test(location.pathname)) {
    const onTableChange = () => {
      // Auto Translate Report Links
      $(".main-table-name").each((_i, cell) => {
        if ($(cell).find(".main-table-guild").attr("href").includes("translate=true")) return;
        if ($(cell).find(".main-table-guild").attr("href").includes("guild")) return;
        $(cell)
          .find(".main-table-guild")
          .attr("href", `${$(cell).find(".main-table-guild").attr("href")}&translate=true`);
      });
    };

    onTableChange();
    updateTable(onTableChange, "#table-container");
  }

  // Character Page
  if (CHARACTER_PATH_REGEX.test(location.pathname)) {
    const onTableChange = () => {
      $(".all-stars-strip").each((_i, cell) => {
        if (!($(cell).find(".zone-all-star-name"))) return;
        $(cell)
          .find(".zone-all-star-name")
          .css({ "height": "2lh", "display": "flex", "align-items": "center", "justify-content": "center", "max-width": "none" })
        $(cell)
          .find(".zone-all-star-icon-and-points")
          .css({ "width": "auto", "min-width": "120px" })
        $(cell)
          .find(".zone-all-star-info")
          .css({ "margin": "4px" })
        $(cell).find(".zone-all-star-name").each((_j, nameEl) => {
          const $nameEl = $(nameEl);
          const text = $nameEl.text().trim();
          $nameEl.html(`<div style="max-width: 100px">${text}</div>`);
        });
      });
    };

    updateTable(onTableChange, "#raids-table-container");

    // Chad Bradly's Profile Customization
    const CHAD_ID_REGEX = /\/character\/id\/12781922/;
    const CHAD_NAME_REGEX = /\/character\/na\/sargatanas\/chad%20bradly/;
    const CHAD_ICON_URL = "https://media.tenor.com/epNMHGvRyHcAAAAd/gigachad-chad.gif";

    if (CHAD_ID_REGEX.test(location.pathname) || CHAD_NAME_REGEX.test(location.pathname)) {
      $("#character-portrait-image").attr("src", CHAD_ICON_URL);
    }
  }

  // Profile Page
  if (PROFILE_PATH_REGEX.test(location.pathname)) {
    const $extension = $(`
          <div id="extension" class="dialog-block">
            <div id="extension-title" class="dialog-title">FF Progs</div>
            <div id="extension-content" style="margin:1em"></div>
          </div>
        `);

    const $apiInputContainer = $(`
          <div id="api-input-container" style="margin:1em">
            <div>Enter your FFLogs API Key</div>
            <input type="text" id="api-key-input" style="margin-left: 10px" value="${apiKey || ""}">
            <input type="button" id="api-save-button" style="margin-left: 10px" value="${apiKey ? "Update API Key" : "Save API Key"}">
          </div>
        `);

    const $apiStatus = $(`
          <div id="api-status" style="margin:1em; display: ${apiKey ? "block" : "none"}">
            <div>API Key ${apiKey ? "saved" : "not saved"}</div>
            <input type="button" id="api-remove-button" style="margin-left: 10px" value="Remove API Key">
          </div>
        `);

    const saveApiKey = () => {
      const newApiKey = $("#api-key-input").val().trim();
      if (newApiKey) {
        GM_setValue("apiKey", newApiKey);
        $apiStatus.show().find("div").text("API Key saved");
        $apiInputContainer.hide();
        setTimeout(() => {
          $apiStatus.hide();
          $apiInputContainer.show();
        }, 2000);
      }
    };

    const removeApiKey = () => {
      GM_deleteValue("apiKey");
      $apiStatus.show().find("div").text("API Key removed");
      $apiStatus.find("#api-remove-button").remove();
      $apiInputContainer.show();
      setTimeout(() => {
        $apiStatus.hide();
      }, 2000);
    };

    $extension.insertAfter("#api");
    $apiInputContainer.appendTo("#extension-content");
    $apiStatus.appendTo("#extension-content");

    $apiInputContainer.on("click", "#api-save-button", saveApiKey);
    $apiStatus.on("click", "#api-remove-button", removeApiKey);
  }
})();