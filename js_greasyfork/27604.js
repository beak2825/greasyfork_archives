// ==UserScript==
// @name         WME Wazebar
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2025.04.06.01
// @description  Displays a bar at the top of the editor that displays inbox, forum & wiki links
// @author       JustinS83
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/discuss/*
// @include      https://webnew.waze.com/discuss/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @connect      storage.googleapis.com
// @connect      greasyfork.org
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/27604/WME%20Wazebar.user.js
// @updateURL https://update.greasyfork.org/scripts/27604/WME%20Wazebar.meta.js
// ==/UserScript==

/* global $ */
/* global I18n */

(function () {
  "use strict";
  var WazeBarSettings = [];
  var forumInterval;
  var currentState = "";
  var States = {};
  var forumUnreadOffset = 0;
  const SCRIPT_VERSION = GM_info.script.version.toString();
  const SCRIPT_NAME = GM_info.script.name;
  const DOWNLOAD_URL = GM_info.script.downloadURL;
  var debug = false;
  let wmeSDK;

  var isBeta = /beta/.test(location.href);
  var forumPage = /discuss/.test(location.href);

  console.log(`${SCRIPT_NAME}: isBeta:`, isBeta);
  console.log(`${SCRIPT_NAME}: forumPage:`, forumPage);

  if (!forumPage) {
    window.SDK_INITIALIZED.then(bootstrap);
  } else {
    initScript();
  }

  function bootstrap() {
    console.log(`${SCRIPT_NAME}: bootstrap() called`);
    wmeSDK = getWmeSdk({
      scriptId: SCRIPT_NAME.replaceAll(" ", ""),
      scriptName: SCRIPT_NAME,
    });

    Promise.all([wmeReady()])
      .then(() => {
        console.log(`${SCRIPT_NAME}: All dependencies are ready.`);
        initScript();
      })
      .catch((error) => {
        console.error(`${SCRIPT_NAME}: Error during bootstrap -`, error);
      });
  }

  function wmeReady() {
    return new Promise((resolve) => {
      if (wmeSDK.State.isReady()) {
        resolve();
      } else {
        wmeSDK.Events.once({ eventName: "wme-ready" }).then(resolve);
      }
    });
  }

  function initScript() {
    if (debug) console.log(`${SCRIPT_NAME}: initScript() called`);
    if (forumPage) {
      loadScript("https://use.fontawesome.com/73f886e1d5.js", loadAppComponents);
    } else {
      loadAppComponents();
    }
  }

  function loadAppComponents() {
    if (debug) console.log(`${SCRIPT_NAME}: loadAppComponents() called`);
    LoadSettingsObj();
    LoadStatesObj();

    if (!forumPage || (forumPage && WazeBarSettings.DisplayWazeForum)) {
      if (!forumPage) {
        if (wmeSDK.Events) {
          // Register map move events
          wmeSDK.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: () => setTimeout(updateCurrentStateEntries, 100),
          });

          // Register map zoom change event
          wmeSDK.Events.on({
            eventName: "wme-map-zoom-changed",
            eventHandler: () => setTimeout(updateCurrentStateEntries, 100),
          });
        }
      }
      BuildWazebar();
      injectCss();
      BuildSettingsInterface();
      console.log(`${SCRIPT_NAME}: Waze Bar Loaded`);
    }
  }

  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          if (callback != null) callback();
        }
      };
    } else {
      //Others
      script.onload = function () {
        if (callback != null) callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  function getCurrentState() {
    const topState = wmeSDK.DataModel.States.getTopState();
    if (debug) console.log(`${SCRIPT_NAME}: getCurrentState() called: topState =`, topState);
    if (topState === null) {
      return null; // Handle the case where no top state is available
    }
    return topState.name;
  }

  function updateCurrentStateEntries() {
    const topState = wmeSDK.DataModel.States.getTopState();
    if (debug) console.log(`${SCRIPT_NAME}: updateCurrentStateEntries() called: topState =`, topState);

    if (topState !== null && currentState !== getCurrentState()) {
      // User panned/zoomed to a different state, so we need to update the current state forum & wiki entries
      BuildWazebar();
      currentState = getCurrentState();
    }
  }

  function BuildWazebar() {
    if (debug) console.log(`${SCRIPT_NAME}: BuildWazebar() called`);
    $("#Wazebar").remove();
    var $Wazebar = $("<div>", { id: "Wazebar" });
    $Wazebar.html(
      [
        '<div class="WazeBarIcon" id="WazeBarSettingsButton"><i class="fa fa-cog" aria-hidden="true"></i></div>',
        '<div class="WazeBarIcon" id="WazeBarRefreshButton"><i class="fa fa-refresh" aria-hidden="true"></i></div>',
        '<div class="WazeBarIcon" id="WazeBarFavoritesIcon"><i class="fa fa-star" aria-hidden="true"></i>',
        '<div id="WazeBarFavorites">',
        '<ul id="WazeBarFavoritesList"></ul>',
        '<div id="WazeBarFavoritesAddContainer">',
        '<input type="text" id="WazeBarURL" placeholder="URL">',
        '<input type="text" id="WazeBarText" placeholder="Label">',
        '<button id="WazeBarAddFavorite">Add</button>',
        "</div>",
        "</div>",
        "</div>",
        // Other forum links
        WazeBarSettings.WMEBetaForum ? '<div class="WazeBarText WazeBarForumItem" id="WMEBetaForum"><a href="https://www.waze.com/discuss/c/editors/beta-community/4088" ' + LoadNewTab() + ">WME Beta</a></div>" : "",
        WazeBarSettings.scriptsForum ? '<div class="WazeBarText WazeBarForumItem" id="ScriptsForum"><a href="https://www.waze.com/discuss/c/editors/addons-extensions-and-scripts/3984" ' + LoadNewTab() + ">Scripts</a></div>" : "",
        WazeBarSettings.USSMForum ? '<div class="WazeBarText WazeBarForumItem" id="USSMForum"><a href="https://www.waze.com/discuss/c/editors/united-states/us-state-managers/4890" ' + LoadNewTab() + ">US SM</a></div>" : "",
        WazeBarSettings.USChampForum ? '<div class="WazeBarText WazeBarForumItem" id="USChampForum"><a href="https://www.waze.com/discuss/c/editors/united-states/us-waze-champs/4893" ' + LoadNewTab() + ">US Champ</a></div>" : "",
        WazeBarSettings.USWikiForum ? '<div class="WazeBarText WazeBarForumItem" id="USWikiForum"><a href="https://www.waze.com/discuss/c/editors/united-states/us-wiki-discussion/4894" ' + LoadNewTab() + ">US Wiki</a></div>" : "",
        BuildStateForumEntries(),
        BuildStateUnlockEntries(),
        BuildCustomEntries(),
        BuildRegionWikiEntries(),
        BuildStateWikiEntries(),
        BuildCurrentStateEntries(),
        WazeBarSettings.NAServerUpdate ? '<div class="WazeBarText WazeBarServerUpdate;" id="WazebarStatus">NA Server Update: </div>' : "",
        WazeBarSettings.ROWServerUpdate ? '<div class="WazeBarText WazeBarServerUpdate;" id="WazebarStatusROW">ROW Server Update: </div>' : "",
      ].join("")
    );

    function prependWazebarToHeader(retries = 5, interval = 200) {
      if (forumPage) {
        const attemptPrepend = () => {
          const header = $(".d-header");
          if (header.length) {
            header.prepend($Wazebar);
            $("#Wazebar").css({
              "background-color": "white",
              width: "100%",
            });
          } else if (retries > 0) {
            retries--;
            setTimeout(attemptPrepend, interval);
          } else {
            console.warn("Warning: .d-header not found after multiple attempts.");
          }
        };
    
        attemptPrepend();
      } else {
        $(".app.container-fluid").before($Wazebar);
      }
    }
    
    prependWazebarToHeader();

    checkForums();
    StartIntervals();

    // Event handler for settings button to show the settings dialog
    $("#WazeBarSettingsButton").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Settings button clicked`);
      $("#WazeBarSettings").fadeIn();
    });

    $("#WazeBarAddFavorite").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: AddFavorite button clicked`);
      var url = $("#WazeBarURL").val();
      var text = $("#WazeBarText").val();
      if (url !== "" && text !== "") {
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
          url = "http://" + url;
        }
        WazeBarSettings.Favorites.push({ href: url, text: text });
        $("#WazeBarURL").val("");
        $("#WazeBarText").val("");
        LoadFavorites();
        SaveSettings();
      }
    });

    $("#WazeBarFavoritesIcon").mouseleave(function () {
      $("#WazeBarFavorites").css({ display: "none" });
    });

    $("#WazeBarFavoritesIcon").mouseenter(function () {
      $("#WazeBarFavorites").css({ display: "block" });
    });

    LoadFavorites();

    $("#WazeBarFavoritesList a").click(function () {
      $("#WazeBarFavorites").css({ display: "none" });
    });

    if (WazeBarSettings.NAServerUpdate) {
      fetch("https://storage.googleapis.com/waze-tile-build-public/release-history/na-feed-v2.xml")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`${SCRIPT_NAME}: Network response was not ok: ${response.statusText}`);
          }
          return response.text();
        })
        .then((data) => ParseStatusFeed(data, "NA", "WazebarStatus"))
        .catch((error) => console.error(`${SCRIPT_NAME}: Error fetching NA Server Update:`, error));
    }

    if (WazeBarSettings.ROWServerUpdate) {
      fetch("https://storage.googleapis.com/waze-tile-build-public/release-history/intl-feed-v2.xml")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`${SCRIPT_NAME}: Network response was not ok: ${response.statusText}`);
          }
          return response.text();
        })
        .then((data) => ParseStatusFeed(data, "ROW", "WazebarStatusROW"))
        .catch((error) => console.error(`${SCRIPT_NAME}: Error fetching ROW Server Update:`, error));
    }

    $("#WazeBarRefreshButton").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Refresh button clicked`);
      $("#WazeBarRefreshButton i").addClass("fa-spin");
      window.clearInterval(forumInterval);
      checkForums();
      StartIntervals();
      $("#WazeBarRefreshButton i").removeClass("fa-spin");
    });

    // Initially set height for the app container
    setHeightForAppContainer();
  }

  // Function for setting height dynamically
  function setHeightForAppContainer() {
    if (debug) console.log(`${SCRIPT_NAME}: setHeightForAppContainer called`);
    const wazebarHeight = $("#Wazebar").height();
    $("body > div.app.container-fluid").css("height", `calc(100vh - ${wazebarHeight}px)`);
    window.dispatchEvent(new Event("resize")); // Adjust WME editing area
  }

  function LoadSettingsInterface() {
    if (debug) console.log(`${SCRIPT_NAME}: LoadSettingsInterface() called`);
    // Load JSON settings and use default if not present
    const loadedSettings = localStorage.getItem("Wazebar_Settings") || JSON.stringify(defaultSettings, null, 4);
    $("#txtWazebarSettings")[0].innerHTML = loadedSettings;

    // Update the UI elements
    setChecked("WazeForumSetting", WazeBarSettings?.DisplayWazeForum !== undefined ? WazeBarSettings.DisplayWazeForum : defaultSettings.DisplayWazeForum);
    setChecked("WMEBetaForumSetting", WazeBarSettings?.WMEBetaForum !== undefined ? WazeBarSettings.WMEBetaForum : defaultSettings.WMEBetaForum);
    setChecked("ScriptsForum", WazeBarSettings?.scriptsForum !== undefined ? WazeBarSettings.scriptsForum : defaultSettings.scriptsForum);
    setChecked("USSMForumSetting", WazeBarSettings?.USSMForum !== undefined ? WazeBarSettings.USSMForum : defaultSettings.USSMForum);
    if (!forumPage) setChecked("USChampForumSetting", WazeBarSettings?.USChampForum !== undefined ? WazeBarSettings.USChampForum : defaultSettings.USChampForum);
    setChecked("USWikiForumSetting", WazeBarSettings?.USWikiForum !== undefined ? WazeBarSettings.USWikiForum : defaultSettings.USWikiForum);
    setChecked("NAServerUpdateSetting", WazeBarSettings?.NAServerUpdate !== undefined ? WazeBarSettings.NAServerUpdate : defaultSettings.NAServerUpdate);
    setChecked("ROWServerUpdateSetting", WazeBarSettings?.ROWServerUpdate !== undefined ? WazeBarSettings.ROWServerUpdate : defaultSettings.ROWServerUpdate);
    $("#forumInterval")[0].value = WazeBarSettings?.forumInterval !== undefined ? WazeBarSettings.forumInterval : defaultSettings.forumInterval;
    $("#forumHistory")[0].value = WazeBarSettings?.forumHistory !== undefined ? WazeBarSettings.forumHistory : defaultSettings.forumHistory;
    $("#WazeBarFontSize")[0].value = WazeBarSettings?.BarFontSize !== undefined ? WazeBarSettings.BarFontSize : defaultSettings.BarFontSize;
    $("#colorPickerForumFont").val(WazeBarSettings?.ForumFontColor !== undefined ? WazeBarSettings.ForumFontColor : defaultSettings.ForumFontColor);
    $("#colorPickerWikiFont").val(WazeBarSettings?.WikiFontColor !== undefined ? WazeBarSettings.WikiFontColor : defaultSettings.WikiFontColor);
    serializeSettings();
    LoadCustomLinks();
  }

  function LoadNewTab() {
    return forumPage ? "" : ' target="_blank"';
  }

  function LoadFavorites() {
    if (debug) console.log(`${SCRIPT_NAME}: LoadFavorites() called`);
    var favoritesList = $("#WazeBarFavoritesList");
    favoritesList.empty(); // Clear the list

    // For each favorite, append a structured item
    WazeBarSettings.Favorites.forEach((favorite, index) => {
      const listItem = $(`
                <li class="WazeBarFavoritesList favorite-item">
                    <a href="${favorite.href}" target="_blank">${favorite.text}</a>
                    <i class="fa fa-times" title="Remove from favorites" data-index="${index}"></i>
                </li>
            `);
      favoritesList.append(listItem);
    });

    // Use event delegation to handle the removal of items
    favoritesList.on("click", ".fa-times", function () {
      const index = $(this).data("index");
      WazeBarSettings.Favorites.splice(index, 1);
      SaveSettings();
      LoadFavorites();
    });
  }

  function LoadCustomLinks() {
    if (debug) console.log(`${SCRIPT_NAME}: LoadCustomLinks() called`);
    const customList = $("#WazeBarCustomLinksList");
    customList.empty(); // Clear the list
  
    // Append structured items for each custom link
    WazeBarSettings.CustomLinks.forEach((customLink, index) => {
      const listItem = $(`
        <li class="custom-item">
          <a href="${customLink.href}"${LoadNewTab()}>${customLink.text}</a>
          <i class="fa fa-times" title="Remove custom link" data-index="${index}"></i>
        </li>
      `);
      customList.append(listItem);
    });
  
    // Handle removal using event delegation
    customList.off("click", ".fa-times").on("click", ".fa-times", function () {
      const index = $(this).data("index");
      if (index >= 0 && index < WazeBarSettings.CustomLinks.length) {
        WazeBarSettings.CustomLinks.splice(index, 1);
        serializeSettings();
        LoadCustomLinks();
        BuildWazebar();
      }
    });
  
    // Ensure index management when using close functionality
    $('[id^="WazeBarCustomLinksListClose"]').off("click").on("click", function () {
      const index = Number(this.id.replace("WazeBarCustomLinksListClose", ""));
      if (index >= 0 && index < WazeBarSettings.CustomLinks.length) {
        WazeBarSettings.CustomLinks.splice(index, 1);
        serializeSettings();
        LoadCustomLinks();
        BuildWazebar();
      }
    });
  }

  function StartIntervals() {
    forumInterval = setInterval(checkForums, WazeBarSettings.forumInterval * 60000);
  }

  function checkForums() {
    if (debug) console.log(`${SCRIPT_NAME}: checkForums() called`);
    if (WazeBarSettings.WMEBetaForum) checkUnreadTopics("https://www.waze.com/discuss/c/editors/beta-community/4088", "WMEBetaForum", "WMEBetaForumCount");
    if (WazeBarSettings.scriptsForum) checkUnreadTopics("https://www.waze.com/discuss/c/editors/addons-extensions-and-scripts/3984", "ScriptsForum", "ScriptsCount");
    if (WazeBarSettings.USSMForum) checkUnreadTopics("https://www.waze.com/discuss/c/editors/united-states/us-state-managers/4890", "USSMForum", "USSMForumCount");
    if (WazeBarSettings.USChampForum) checkUnreadTopics("https://www.waze.com/discuss/c/editors/united-states/us-waze-champs/4893", "USChampForum", "USChampForumCount");
    if (WazeBarSettings.USWikiForum) checkUnreadTopics("https://www.waze.com/discuss/c/editors/united-states/us-wiki-discussion/4894", "USWikiForum", "USWikiForumCount");

    Object.keys(WazeBarSettings.header).forEach(function (state, index) {
      if (WazeBarSettings.header[state].forum) checkUnreadTopics(WazeBarSettings.header[state].forum, state.replace(" ", "_") + "Forum", state.replace(" ", "_") + "ForumCount");

      if (WazeBarSettings.header[state].unlock) {
        var url = "https://www.waze.com/discuss/search?q=" + encodeURIComponent(state) + "%20%23united-states%3Aus-unlock-and-update-requests%20order%3Alatest";
        checkUnreadTopics(url, state.replace(" ", "_") + "Unlock", state.replace(" ", "_") + "UnlockCount");
      }
    });

    for (var i = 0; i < WazeBarSettings.CustomLinks.length; i++) {
      if (WazeBarSettings.CustomLinks[i].href.includes("/discuss/")) checkUnreadTopics(WazeBarSettings.CustomLinks[i].href, WazeBarSettings.CustomLinks[i].text.replace(/\s/g, "") + i + "Forum", WazeBarSettings.CustomLinks[i].text.replace(/\s/g, "") + i + "ForumCount"); // JS55CT TEST
    }
  }

  // General Function logic for checkUnreadTopics() from dalverson Github fork - Oct 10, 20204
  function checkUnreadTopics(path, parentID, spanID) {
    var count = 0;
    var jdat, dat1;

    if (debug) console.log(`${SCRIPT_NAME}: CheckUnreadTopics() called for `, path, parentID, spanID);

    $.get(path, function (page) {
      const jpattern = /data-preloaded=\"(.*)\">/;
      var dat = jpattern.exec(page);

      if (dat && dat.length > 1) {
        dat1 = dat[1].replace(/&quot;/g, '"');
        try {
          jdat = JSON.parse(dat1);
        } catch (error) {
          console.error(`${SCRIPT_NAME}: JSON parse error in checkUnreadTopics()`, error);
          return;
        }

        var jdat2;
        var topix;

        if (jdat.search) {
          jdat2 = JSON.parse(jdat.search);
          topix = jdat2.topics; // Access topics directly from search JSON format
        } else if (jdat.topic_list) {
          jdat2 = JSON.parse(jdat.topic_list);
          topix = jdat2.topic_list?.topics; // Access topics from the nested topic_list property
        } else {
          console.warn(`${SCRIPT_NAME}: invalid JSON format in checkUnreadTopics() for `, parentID);
          return;
        }

        if (!topix || topix.length === 0) {
          console.warn(`${SCRIPT_NAME}: No topics found in checkUnreadTopics() for`, parentID);
          return;
        }

        $("#" + spanID).remove();
        var links = "";
        for (var tp in topix) {
          if (Object.prototype.hasOwnProperty.call(topix, tp)) {
            var tobj = topix[tp];
            const ldate = Date.parse(tobj.last_posted_at);
            const formattedDate = formatDate(new Date(ldate));
            const diff = Date.now() - ldate;
            const dfhrs = diff / 3600000; // hours since last post on this topic
            var lrpn = tobj.last_read_post_number ? tobj.last_read_post_number : 0;
            var hpn = tobj.highest_post_number ? tobj.highest_post_number : 0;
            var item_to_read = lrpn > 0 && lrpn < hpn ? lrpn + 1 : hpn;
            var fh = WazeBarSettings.forumHistory * 24;

            if (((lrpn > 0 && lrpn < hpn) || (dfhrs < fh && lrpn == 0) || tobj.unseen || tobj.unread > 0 || tobj.unread_posts > 0) && dfhrs < fh) {
              count += 1;
              links += `
            <li class="WazeBarUnreadList unread-item">
                <a href="https://www.waze.com/discuss/t/${tobj.slug}/${tobj.id}/${item_to_read}" ${LoadNewTab()}>${tobj.fancy_title} (${formattedDate})</a>
            </li>`;
            }
          }
        }

        if (count > 0) {
          $("#" + parentID + " a").append(`
                  <span style='color:red;font-weight:bold;' id='${spanID}'> 
                  (${count})
                  <div class='WazeBarUnread' id='WazeBarUnread${spanID}' style='visibility:hidden;
                      animation-fill-mode: forwards;
                      left:${$("#" + parentID).position().left}px;
                      top:${parseInt($("#" + parentID).height()) + forumUnreadOffset}px;'>
                      <ul class='WazeBarUnreadList' id='WazeBarUnreadList${spanID}'>
                      </ul>
                  </div>
                  </span>
              `);

          $("#WazeBarUnreadList" + spanID).html(links);

          $("#" + spanID)
            .on("mouseenter", function () {
              $("#WazeBarUnread" + spanID).css({ visibility: "visible" });
            })
            .on("mouseleave", function () {
              $("#WazeBarUnread" + spanID).css({ visibility: "hidden" });
            });

          $("#" + spanID + " a").click(function (event) {
            event.stopPropagation();
            $("#WazeBarUnread" + spanID).css({ visibility: "hidden" });
          });
        }
      } else {
        console.warn(`${SCRIPT_NAME}: No <data-preloaded> section on /discuss webpage for `, parentID);
      }
    });
    return count;
  }

  function ParseStatusFeed(data, updateType, targetId) {
    if (debug) console.log(`${SCRIPT_NAME}: ParseStatusFeed() called with updateType = ${updateType}`);

    // Parse the XML data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    if (xmlDoc.querySelector("parsererror")) {
      console.error(`${SCRIPT_NAME}: Error parsing XML`);
      return;
    }

    // Get the first <entry> element
    const firstEntry = xmlDoc.querySelector("entry");
    if (!firstEntry) {
      console.error(`${SCRIPT_NAME}: No entry element found`);
      return;
    }

    // Extract and check the <title> element
    const title = firstEntry.querySelector("title")?.textContent || "";
    if ((updateType === "NA" && title.includes("North America")) || (updateType === "ROW" && title.includes("International"))) {
      // Extract the <updated> element
      const updated = firstEntry.querySelector("updated")?.textContent;
      if (debug) console.log(`${SCRIPT_NAME}: Parsed <update> object: ${updated}`);

      if (!updated) {
        console.error(`${SCRIPT_NAME}: No updated element found`);
        return;
      }

      const date = new Date(updated); // The date string is expected to already be in UTC (Z) format
      if (isNaN(date)) {
        console.error(`${SCRIPT_NAME}: Unable to convert <update> date: ${updated}`);
      } else {
        if (debug) console.log(`${SCRIPT_NAME}: Converted <update> to date object: ${date}`);

        const formattedDate = formatDate(date);
        const label = updateType === "NA" ? "NA Server Update: " : "ROW Server Update: ";
        const $target = $("#" + targetId);
        $target.empty().append(label + formattedDate);

        if (debug) console.log(`${SCRIPT_NAME}: Update found for ${updateType}: ${formattedDate}`);
      }
    } else {
      if (debug) console.log(`${SCRIPT_NAME}: Title does not match expected format for ${updateType}`);
    }
  }

  function formatDate(date) {
    // Extract the date in YYYY-MM-DD format
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const dateString = date.toLocaleDateString("en-CA", dateOptions);

    // Extract the time in HH:MM AM/PM format
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const timeString = date.toLocaleTimeString("en-US", timeOptions);

    // Combine and format the date and time
    return `${dateString} ${timeString}`;
  }

  function BuildStateForumEntries() {
    var stateForums = "";
    Object.keys(WazeBarSettings.header).forEach(function (state) {
      if (WazeBarSettings.header[state].forum)
        stateForums += '<div class="WazeBarText WazeBarForumItem" id="' + state.replace(" ", "_") + 'Forum"><a href="' + WazeBarSettings.header[state].forum + '" ' + LoadNewTab() + ">" + WazeBarSettings.header[state].abbr + "</a></div>";
    });
    return stateForums;
  }

  function BuildCurrentStateEntries() {
    var currentState = "";

    if (!forumPage) {
      const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
      const topCountryId = topCountry ? topCountry.id : null;

      if (topCountryId === 235) {
        // Only proceed if the top country is the US
        var currState = getCurrentState();
        if (!currState || !States[currState]) {
          return currentState; // Return an empty string if currState or its corresponding States entry is invalid.
        }
        currentState += '<div class="WazeBarText WazeBarCurrState" id="' + currState.replace(" ", "_") + 'ForumCurrState"><a href="' + States[currState].forum + '" ' + LoadNewTab() + ">" + States[currState].abbr + "</a></div>";
        currentState += '<div class="WazeBarText WazeBarCurrState"><a href="' + States[currState].wiki + '"' + LoadNewTab() + ">" + States[currState].abbr + " Wiki</a></div>";
      }
    }
    return currentState;
  }

  function BuildCustomEntries() {
    var customList = "";
    if (WazeBarSettings.CustomLinks && WazeBarSettings.CustomLinks.length > 0) {
      //Categories like Forum Entries & User Profiles
      for (var i = 0; i < WazeBarSettings.CustomLinks.length; i++) {
        if (WazeBarSettings.CustomLinks[i].href.includes("/discuss/c/") || WazeBarSettings.CustomLinks[i].href.includes("/discuss/u/")) {
          customList +=
            '<div class="WazeBarText WazeBarForumItem" id="' +
            WazeBarSettings.CustomLinks[i].text.replace(/\s/g, "") +
            i +
            'Forum"><a href="' +
            WazeBarSettings.CustomLinks[i].href +
            '" ' +
            LoadNewTab() +
            ">" +
            WazeBarSettings.CustomLinks[i].text +
            "</a></div>";
        }
      }

        for (i = 0; i < WazeBarSettings.CustomLinks.length; i++) {
          if (
            WazeBarSettings.CustomLinks[i].href.includes("/discuss/t/") ||
            WazeBarSettings.CustomLinks[i].href.includes("/discuss/tag/")
          ) {
            customList +=
              '<div class="WazeBarText WazeBarWikiItem" id="' +
              WazeBarSettings.CustomLinks[i].text.replace(/\s/g, "") +
              i +
              'Forum"><a href="' + //'Wiki"><a href="' +
              WazeBarSettings.CustomLinks[i].href +
              '" ' +
              LoadNewTab() +
              ">" +
              WazeBarSettings.CustomLinks[i].text +
              "</a></div>";
          }
        }

      return customList;
    }
  }

  function BuildStateWikiEntries() {
    var stateWikis = "";
    Object.keys(WazeBarSettings.header).forEach(function (state) {
      if (WazeBarSettings.header[state].wiki) {
        stateWikis += 
          '<div class="WazeBarText WazeBarWikiItem"><a href="' +
          WazeBarSettings.header[state].wiki +
          '"' +
          LoadNewTab() +
          ">" +
          WazeBarSettings.header[state].abbr +
          " Wiki</a></div>";
      }
    });
    return stateWikis;
  }

  function BuildStateUnlockEntries() {
    var stateUnlocks = "";
    Object.keys(WazeBarSettings.header).forEach(function (state) {
      if (WazeBarSettings.header[state].unlock) {
        // Construct the URL with the correct use of encodeURIComponent
        var url = `https://www.waze.com/discuss/search?q=${encodeURIComponent(state)}%20%23united-states%3Aus-unlock-and-update-requests%20order%3Alatest`;
        stateUnlocks += '<div class="WazeBarText WazeBarForumItem" id="' + state.replace(" ", "_") + 'Unlock"><a href="' + url + '" ' + LoadNewTab() + ">" + WazeBarSettings.header[state].abbr + " Unlock</a></div>";
      }
    });
    return stateUnlocks;
  }

  function BuildRegionWikiEntries() {
    var regionWikis = "";
    if (WazeBarSettings.header.region) {
      Object.keys(WazeBarSettings.header.region).forEach(function (region) {
        if (WazeBarSettings.header.region[region].wiki) {
          regionWikis += 
            '<div class="WazeBarText WazeBarWikiItem"><a href="' +
            WazeBarSettings.header.region[region].wiki +
            '"' +
            LoadNewTab() +
            ">" +
            WazeBarSettings.header.region[region].abbr +
            " Wiki</a></div>";
        }
      });
    }
    return regionWikis;
  }

  function BuildSettingsInterface() {
    if (debug) console.log(`${SCRIPT_NAME}: BuildSettingsInterface() called`);

    var $section = $("<div>", { id: "WazeBarSettings" });
    $section.html(
      [
        "<div>",
        "<div class='flex-container' style='margin-bottom: 10px;'>",

        // Start of the 1st Flex Column
        "<div class='flex-column left-column'>",
        "<div style='display: flex; flex-direction: column; gap: 4px;'>",
        // Font size with default value
        "<div style='display: flex; align-items: center; gap: 4px;'>",
        "<input type='number' id='WazeBarFontSize' min='8' max='30' style='width: 50px; height: 20px' value='" + WazeBarSettings.BarFontSize + "'/>",
        "<label for='WazeBarFontSize'>Font size</label>",
        "</div>",
        // Forum font color with default value
        "<div style='display: flex; align-items: center; gap: 4px;'>",
        "<input type='color' id='colorPickerForumFont' style='width: 50px; height: 25px' value='" + WazeBarSettings.ForumFontColor + "'/>",
        "<label for='colorPickerForumFont'>Forum link Color</label>",
        "</div>",
        // Wiki font color with default value
        "<div style='display: flex; align-items: center; gap: 4px;'>",
        "<input type='color' id='colorPickerWikiFont' style='width: 50px; height: 25px' value='" + WazeBarSettings.WikiFontColor + "'/>",
        "<label for='colorPickerWikiFont'>Wiki link Color</label>",
        "</div>",

        // Forum check frequency
        "<div style='display: flex; align-items: center; gap: 4px;'>",
        "<input type='number' id='forumInterval' min='1' style='width: 50px; height: 20px' value='" + WazeBarSettings.forumInterval + "'/>",
        "<label for='forumInterval'>Refresh freq. (mins)</label>",
        "</div>",
        // Forum History
        "<div style='display: flex; align-items: center; gap: 4px;'>",
        "<input type='number' id='forumHistory' min='1' style='width: 50px; height: 20px' value='" + WazeBarSettings.forumHistory + "'/>",
        "<label for='forumHistory'>History (Days)</label>",
        "</div>",
        // Horizontal rule before Custom Links section
        "<hr>",

        // Export/Import Section
        "<div id='exportImportSection'>",
        "<h4>Export/Import</h4>",
        "<div class='flex-row' style='align-items: flex-start; gap: 4px;'>",
        "<button class='export-button fa fa-upload' id='btnWazebarCopySettings' title='Copy Wazebar settings to the clipboard' data-clipboard-target='#txtWazebarSettings'></button>",
        "<textarea readonly id='txtWazebarSettings' placeholder='Copied settings will appear here'></textarea>",
        "</div>",
        "<div class='flex-row' style='align-items: flex-start; gap: 4px; margin-top: 8px;'>",
        "<button class='import-button fa fa-download' id='btnWazebarImportSettings' title='Import copied settings'></button>",
        "<textarea id='txtWazebarImportSettings' placeholder='Paste JSON formated settings here to import'></textarea>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",

        // Start of the 2nd Flex Column
        // Start of the major Forums and Server update check boxes
        "<div class='flex-column right-column'>",
        "<div id='WBDisplayOptions'>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='WazeForumSetting' " + (WazeBarSettings.DisplayWazeForum ? "checked" : "") + " />",
        "<label for='WazeForumSetting'>Display on Forum pages</label>",
        "</div>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='WMEBetaForumSetting' " + (WazeBarSettings.WMEBetaForum ? "checked" : "") + " />",
        "<label for='WMEBetaForumSetting'>WME Beta Forum</label>",
        "</div>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='ScriptsForum' " + (WazeBarSettings.scriptsForum ? "checked" : "") + " />",
        "<label for='ScriptsForum'>Scripts Forum</label>",
        "</div>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='USSMForumSetting' " + (WazeBarSettings.USSMForum ? "checked" : "") + " />",
        "<label for='USSMForumSetting'>US SM Forum</label>",
        "</div>",

        // Conditionally render US Champ Forum checkbox

        !forumPage && wmeSDK.State.getUserInfo().rank >= 5 ? ["<div class='checkbox-container'>", "<input type='checkbox' id='USChampForumSetting' " + (WazeBarSettings.USChampForum ? "checked" : "") + " />", "<label for='USChampForumSetting'>US Champ Forum</label>", "</div>"].join("") : "",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='USWikiForumSetting' " + (WazeBarSettings.USWikiForum ? "checked" : "") + " />",
        "<label for='USWikiForumSetting'>US Wiki Forum</label>",
        "</div>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='NAServerUpdateSetting' " + (WazeBarSettings.NAServerUpdate ? "checked" : "") + " />",
        "<label for='NAServerUpdateSetting'>NA Server Update</label>",
        "</div>",

        "<div class='checkbox-container'>",
        "<input type='checkbox' id='ROWServerUpdateSetting' " + (WazeBarSettings.ROWServerUpdate ? "checked" : "") + " />",
        "<label for='ROWServerUpdateSetting'>ROW Server Update</label>",
        "</div>",

        // Start of the Region Dropdown and State check boxes
        BuildRegionDropdown(),
        "<div id='WBStates' style='margin-top: 12px;'></div>",
        "</div>",
        "</div>",

        // Start of the 3nd Flex Column
        "<div class='flex-column right-column'>",
        // Custom Links Section
        "<div id='customLinksSection'>",
        "<h4>Custom /Discuss Links</h4>",
        "<ul id='WazeBarCustomLinksList'></ul>",
        "<div>",
        "<div style='display: flex; flex-direction: column;'>",
        "<input type='text' id='WazeBarCustomURL' placeholder='Enter URL'/>",
        "<input type='text' id='WazeBarCustomText' placeholder='Enter Link Text'/>",
        "<button id='WazeBarAddCustomLink'>Add</button>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",

        // Bottom Div section with WazeBar Forum Link, Save and Cancel buttons
        "<div style='display: flex; justify-content: space-between; margin-top: 8px;'>",
        "<a href='https://www.waze.com/discuss/t/script-wazebar/208863' target='_blank'>Waze Bar Forum Thread</a>",
        "<span>Version: " + SCRIPT_VERSION + "</span>",
        "<div>",
        "<button id='WBSettingsSave'>Save</button>",
        "<button id='WBSettingsCancel'>Cancel</button>",
        "</div>",
        "</div>",
      ].join(" ")
    );

    if (forumPage) {
      $("body").append($section);
    } else {
      $("#WazeMap").append($section);
    }

    // Apply draggable functionality to the #WazeBarSettings div
    makeDialogMovable(document.getElementById('WazeBarSettings'));
    LoadCustomLinks();
    serializeSettings(); // Load the current JSON settings into the Export Text Box

    $("#WazeBarAddCustomLink").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Add Custom Link clicked`);
      if ($("#WazeBarCustomText").val() !== "" && $("#WazeBarCustomURL").val() !== "") {
        var url = $("#WazeBarCustomURL").val();
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
          url = "http://" + url;
        }
        WazeBarSettings.CustomLinks.push({
          href: url,
          text: $("#WazeBarCustomText").val(),
        });
        $("#WazeBarCustomURL").val("");
        $("#WazeBarCustomText").val("");
        LoadCustomLinks();
        SaveSettings();
        BuildWazebar();
      }
    });

    // Cancel button logic
    $("#WBSettingsCancel").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Settings Interface Cancel button clicked`);

      LoadSettingsObj();
      LoadSettingsInterface();
      var regionValue = $("#WBRegions").val();
      // Check if #WBRegions has a selected value and call SelectedRegionChanged() accordingly
      if (regionValue !== "" && regionValue !== null) {
        SelectedRegionChanged();
      }
      BuildWazebar();
      injectCss();
      $("#WazeBarSettings").fadeOut();
    });

    // Save button logic
    $("#WBSettingsSave").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Settings Interface Save button clicked`);
      updateWazeBarSettingsFromUI(); // Step 1: Update settings
      serializeSettings(); // Step 2 & 3: Serialize settings calls Save Settings
      BuildWazebar(); // Step 4: Rebuild the WazeBar
      injectCss(); // Step 5: Inject CSS
      $("#WazeBarSettings").fadeOut(); // Step 6: Hide settings dialog
      $(".WazeBarText").css("font-size", $("#WazeBarFontSize").val() + "px"); // Step 7: Update font size
      setHeightForAppContainer(); // Step 8: Reside the the .app.container for any possable changes in font size of the Wazrbar
    });

    $("#WBRegions").change(SelectedRegionChanged);

    // Import Settings button logic
    $("#btnWazebarImportSettings").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Import Settings button clicked`);
      const inputSettings = $("#txtWazebarImportSettings").val().trim();

      if (inputSettings === "") {
        localAlertInfo(SCRIPT_NAME, "Import Settings Input string is empty.");
        return;
      }

      if (!isValidJson(inputSettings)) {
        localAlertInfo(SCRIPT_NAME, "Import Settings has Invalid JSON format.");
        return;
      }

      try {
        const parsedSettings = JSON.parse(inputSettings);
        if (debug) console.log(`${SCRIPT_NAME}: parsedSettings:`, parsedSettings);

        if (typeof parsedSettings === "object" && parsedSettings !== null) {
          WazeBarSettings = { ...defaultSettings, ...parsedSettings };

          // Update the UI elements to reflect imported settings
          LoadSettingsInterface();
          SelectedRegionChanged();
          BuildWazebar();
          injectCss();

          localAlertInfo(SCRIPT_NAME, "Settings imported successfully and Saved. Please review.");
        } else {
          localAlertInfo(SCRIPT_NAME, "Valid JSON, but the format is not suitable for WazeBar settings.");
        }
      } catch (e) {
        console.error(`${SCRIPT_NAME}: Exception Details:`, e.message);
        console.error(e.stack);
      }
    });

    function isValidJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        console.error(`${SCRIPT_NAME}: Invalid JSON detected in #btnWazebarImportSettings: `, e.message);
        return false;
      }
      return true;
    }

    // Copy Settings button logic
    let clipboardInstance;
    $("#btnWazebarCopySettings").click(function () {
      if (debug) console.log(`${SCRIPT_NAME}: Export/Copy Settings button clicked`);
      updateWazeBarSettingsFromUI(); // Step 1: Update settings
      serializeSettings(); // Step 2 & 3: Serialize settings calls Savesettings
      BuildWazebar(); // Step 4: Rebuild the WazeBar
      injectCss(); // Step 5: Inject CSS
      // Step 6: Instantiate Clipboard
      if (clipboardInstance) {
        clipboardInstance.destroy();
      }
      clipboardInstance = new Clipboard("#btnWazebarCopySettings");

      if (debug) console.log(`${SCRIPT_NAME}: Clipboard = `, clipboardInstance);
      //Inform the user that settings are copied
      localAlertInfo(SCRIPT_NAME, "Your settings have been copied to the clipboard.");
    });

    $("#WazeBarSettings").hide(); // Ensure the settings dialog is initially hidden
  }
  
  function makeDialogMovable(element) {
    var pos = { top: 0, left: 0, x: 0, y: 0 };
  
    const mouseDownHandler = function (e) {
      // Set the cursor
      element.style.cursor = 'grabbing';
  
      // Starting position
      pos = {
        left: element.offsetLeft,
        top: element.offsetTop,
        x: e.clientX,
        y: e.clientY,
      };
  
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };
  
    const mouseMoveHandler = function (e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
  
      // Update the element's position
      element.style.left = `${pos.left + dx}px`;
      element.style.top = `${pos.top + dy}px`;
    };
  
    const mouseUpHandler = function () {
      // Remove cursors and event listeners
      element.style.cursor = 'move';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  
    // Apply the mouse down handler to start the drag
    element.addEventListener('mousedown', mouseDownHandler);
  }

  function SelectedRegionChanged() {
    setChecked("RegionWikiSetting", false);
    var selectedItem = $("#WBRegions")[0].options[$("#WBRegions")[0].selectedIndex];
    var region = selectedItem.value;
    var wiki = selectedItem.getAttribute("data-wiki");

    if (!WazeBarSettings.header.region) WazeBarSettings.header.region = {};
    if (WazeBarSettings.header.region[region] == null) WazeBarSettings.header.region[region] = {};
    if (WazeBarSettings.header.region[region].wiki && WazeBarSettings.header.region[region].wiki !== "") setChecked("RegionWikiSetting", true);

    var wikiCheckboxState = $("#RegionWikiSetting").is(":checked");
    BuildStatesDiv(region, wikiCheckboxState, wiki);
  }

  function BuildStatesDiv(region, wikiCheckboxState) {
    // Get the state list for this region
    var selectedItem = $("#WBRegions")[0].options[$("#WBRegions")[0].selectedIndex];

    var statesData = selectedItem.getAttribute("data-states") || "";
    var states = statesData.split(",").filter((state) => state.trim() !== "");

    if (!statesData) {
      if (debug) console.log(`${SCRIPT_NAME}: No data-states attribute found for selected region:`, selectedItem);
    }

    $("#WBStates").empty();

    // Create the header row
    var headerHTML = `
        <div class="state-header">
            <div class="state-column">Name</div>
            <div class="checkbox-column">Forum</div>
            <div class="checkbox-column">Wiki</div>
            <div class="checkbox-column">Unlock</div>
        </div>
    `;

    // Include the selected region as the first row, only with the Wiki checkbox
    var regionHTML = `
        <div class="state-row">
            <div class="state-column">${region}</div>
            <div class="checkbox-column">-</div> <!-- No Forum checkbox for region -->
            <div class="checkbox-column"><input type='checkbox' id='RegionWikiSetting' ${wikiCheckboxState ? "checked" : ""} /></div>
            <div class="checkbox-column">-</div> <!-- No Unlock checkbox for region -->
        </div>
    `;

    // Create the state rows with all checkboxes
    var statesHTML = states
      .map(function (state) {
        var stateId = state.replace(" ", "_");
        return `
                <div class="state-row">
                    <div class="state-column">${state}</div>
                    <div class="checkbox-column"><input type='checkbox' id='${stateId}ForumSetting' /></div>
                    <div class="checkbox-column"><input type='checkbox' id='${stateId}WikiSetting' /></div>
                    <div class="checkbox-column"><input type='checkbox' id='${stateId}UnlockSetting' /></div>
                </div>
            `;
      })
      .join("");

    // Append the header and region (incl. check state) and states rows to the container
    $("#WBStates").append(headerHTML + regionHTML + statesHTML);

    $("#RegionWikiSetting").change(function () {
      var selectedItem = $("#WBRegions")[0].options[$("#WBRegions")[0].selectedIndex];
      var region = selectedItem.value;
      var wiki = selectedItem.getAttribute("data-wiki");
      var abbr = selectedItem.getAttribute("data-abbr");

      if (!WazeBarSettings.header.region) WazeBarSettings.header.region = {};
      if (WazeBarSettings.header.region[region] == null) WazeBarSettings.header.region[region] = {};
      if (this.checked) {
        WazeBarSettings.header.region[region].wiki = wiki;
        WazeBarSettings.header.region[region].abbr = abbr;
      } else {
        delete WazeBarSettings.header.region[region].wiki;
      }
    });

    // Checking previously saved settings (if any) and setting checkboxes accordingly
    states.forEach(function (state) {
      var stateKey = state.replace(" ", "_");

      if (WazeBarSettings.header[state]) {
        if (WazeBarSettings.header[state].forum && WazeBarSettings.header[state].forum !== "") {
          setChecked(`${stateKey}ForumSetting`, true);
        }
        if (WazeBarSettings.header[state].wiki && WazeBarSettings.header[state].wiki !== "") {
          setChecked(`${stateKey}WikiSetting`, true);
        }
        if (WazeBarSettings.header[state].unlock && WazeBarSettings.header[state].unlock !== "") {
          setChecked(`${stateKey}UnlockSetting`, true);
        }
      }

      $(`#${stateKey}ForumSetting`).change(function () {
        var stateName = this.id.replace("ForumSetting", "").replace("_", " ");
        if (!WazeBarSettings.header[stateName]) WazeBarSettings.header[stateName] = {};
        if (this.checked) {
          WazeBarSettings.header[stateName].forum = States[stateName].forum;
          WazeBarSettings.header[stateName].abbr = States[stateName].abbr;
        } else {
          delete WazeBarSettings.header[stateName].forum;
        }
        SaveSettings();
      });

      $(`#${stateKey}WikiSetting`).change(function () {
        var stateName = this.id.replace("WikiSetting", "").replace("_", " ");
        if (!WazeBarSettings.header[stateName]) WazeBarSettings.header[stateName] = {};
        if (this.checked) {
          WazeBarSettings.header[stateName].wiki = States[stateName].wiki;
          WazeBarSettings.header[stateName].abbr = States[stateName].abbr;
        } else {
          delete WazeBarSettings.header[stateName].wiki;
        }
        SaveSettings();
      });

      $(`#${stateKey}UnlockSetting`).change(function () {
        var stateName = this.id.replace("UnlockSetting", "").replace("_", " ");
        if (!WazeBarSettings.header[stateName]) WazeBarSettings.header[stateName] = {};
        if (this.checked) {
          WazeBarSettings.header[stateName].unlock = "https://www.waze.com/discuss/search?q=" + encodeURIComponent(stateName) + "%20%23united-states%3Aus-unlock-and-update-requests%20order%3Alatest";
          WazeBarSettings.header[stateName].abbr = States[stateName].abbr;
        } else {
          delete WazeBarSettings.header[stateName].unlock;
        }
        SaveSettings();
      });
    });
  }

  function BuildRegionDropdown() {
    var $places = $("<div>");
    $places.html(
      [
        '<select id="WBRegions" class="styled-select">',
        '<option value="" selected disabled>Select Region</option>', // Default placeholder option
        '<option value="Northwest" data-abbr="NWR" data-states="Alaska,Idaho,Montana,Washington,Oregon,Wyoming" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-northwest/378999">Northwest</option>',
        '<option value="Southwest" data-abbr="SWR" data-states="Arizona,California,Colorado,Hawaii,Nevada,New Mexico,Utah" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-southeast/379033">Southwest</option>',
        '<option value="Plains" data-abbr="PLN" data-states="Iowa,Kansas,Minnesota,Missouri,Nebraska,North Dakota,South Dakota" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-plains/379009">Plains</option>',
        '<option value="South Central" data-abbr="SCR" data-states="Arkansas,Louisiana,Mississippi,Oklahoma,Texas" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-south-central/379032">South Central</option>',
        '<option value="Great Lakes" data-abbr="GLR" data-states="Illinois,Indiana,Michigan,Ohio,Wisconsin" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-great-lakes/379001">Great Lakes</option>',
        '<option value="South Atlantic" data-abbr="SAT" data-states="Kentucky,North Carolina,South Carolina,Tennessee" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-south-atlantic/379018">South Atlantic</option>',
        '<option value="Southeast" data-abbr="SER" data-states="Alabama,Florida,Georgia" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-southeast/379033">Southeast</option>',
        '<option value="New England" data-abbr="NER" data-states="Connecticut,Maine,Massachusetts,New Hampshire,Rhode Island,Vermont" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-new-england/378990">New England</option>',
        '<option value="Northeast" data-abbr="NOR" data-states="Delaware,New Jersey,New York,Pennsylvania" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-northeast/378995">Northeast</option>',
        '<option value="Mid Atlantic" data-abbr="MAR" data-states="District of Columbia,Maryland,Virginia,West Virginia" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-mid-atlantic/378978">Mid Atlantic</option>',
        '<option value="Territories" data-abbr="ATR" data-states="American Samoa,Guam,Puerto Rico,South Pacific Territories,US Virgin Islands" data-forum="" data-wiki="https://www.waze.com/discuss/t/usa-territories/379027">Territories</option>',
        "</select>",
      ].join(" ")
    );
    return $places.html();
  }

  function LoadStatesObj() {
    if (debug) console.log(`${SCRIPT_NAME}: LoadStatesObj() called`);
    States.Alabama = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/alabama/4839",
      wiki: "https://www.waze.com/discuss/t/usa/377944",
      abbr: "AL",
    };
    States.Alaska = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/alaska/4840",
      wiki: "https://www.waze.com/discuss/t/alaska/377724",
      abbr: "AK",
    };
    States.Arizona = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/arizona/4841",
      wiki: "https://www.waze.com/discuss/t/arizona/377756",
      abbr: "AZ",
    };
    States.Arkansas = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/arkansas/4842",
      wiki: "https://www.waze.com/discuss/t/arkansas/377785",
      abbr: "AR",
    };
    States.California = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/california/4843",
      wiki: "https://www.waze.com/discuss/t/california/377832",
      abbr: "CA",
    };
    States.Colorado = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/colorado/4844",
      wiki: "https://www.waze.com/discuss/t/colorado/377867",
      abbr: "CO",
    };
    States.Connecticut = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/connecticut/4845",
      wiki: "https://www.waze.com/discuss/t/connecticut/377887",
      abbr: "CT",
    };
    States.Delaware = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/delaware/4846",
      wiki: "https://www.waze.com/discuss/t/delaware/377914",
      abbr: "DE",
    };
    States["District of Columbia"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/district-of-columbia/4847",
      wiki: "https://www.waze.com/discuss/t/district-of-columbia/377933",
      abbr: "DC",
    };
    States.Florida = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/florida/4848",
      wiki: "https://www.waze.com/discuss/t/usa-southeast/379033",
      abbr: "FL",
    };
    States.Georgia = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/georgia/4849",
      wiki: "https://www.waze.com/discuss/t/usa-southeast/379033",
      abbr: "GA",
    };
    States.Hawaii = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/hawaii/4850",
      wiki: "https://www.waze.com/discuss/t/hawaii/378021",
      abbr: "HI",
    };
    States.Idaho = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/idaho/4851",
      wiki: "https://www.waze.com/discuss/t/idaho/378060",
      abbr: "ID",
    };
    States.Illinois = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/illinois/4852",
      wiki: "https://www.waze.com/discuss/t/illinois/378077",
      abbr: "IL",
    };
    States.Indiana = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/indiana/4853",
      wiki: "https://www.waze.com/discuss/t/indiana/378111",
      abbr: "IN",
    };
    States.Iowa = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/iowa/4854",
      wiki: "https://www.waze.com/discuss/t/iowa/378125",
      abbr: "IA",
    };
    States.Kansas = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/kansas/4855",
      wiki: "https://www.waze.com/discuss/t/kansas/378134",
      abbr: "KS",
    };
    States.Kentucky = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/kentucky/4856",
      wiki: "https://www.waze.com/discuss/t/kentucky/378155",
      abbr: "KY",
    };
    States.Louisiana = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/louisiana/4857",
      wiki: "https://www.waze.com/discuss/t/louisiana/378174",
      abbr: "LA",
    };
    States.Maine = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/maine/4858",
      wiki: "https://www.waze.com/discuss/t/maine/378206",
      abbr: "ME",
    };
    States.Maryland = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/maryland/4859",
      wiki: "https://www.waze.com/discuss/t/maryland/378225",
      abbr: "MD",
    };
    States.Massachusetts = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/massachusetts/4860",
      wiki: "https://www.waze.com/discuss/t/massachusetts/378224",
      abbr: "MA",
    };
    States.Michigan = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/michigan/4861",
      wiki: "https://www.waze.com/discuss/t/michigan/378213",
      abbr: "MI",
    };
    States.Minnesota = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/minnesota/4862",
      wiki: "https://www.waze.com/discuss/t/minnesota/378223",
      abbr: "MN",
    };
    States.Mississippi = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/mississippi/4863",
      wiki: "https://www.waze.com/discuss/t/mississippi/378226",
      abbr: "MS",
    };
    States.Missouri = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/missouri/4864",
      wiki: "https://www.waze.com/discuss/t/missouri/378227",
      abbr: "MO",
    };
    States.Montana = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/montana/4865",
      wiki: "https://www.waze.com/discuss/t/montana/378228",
      abbr: "MT",
    };
    States.Nebraska = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/nebraska/4866",
      wiki: "https://www.waze.com/discuss/t/nebraska/378397",
      abbr: "NE",
    };
    States.Nevada = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/nevada/4867",
      wiki: "https://www.waze.com/discuss/t/nevada/378399",
      abbr: "NV",
    };
    States["New Hampshire"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/New-Hampshire/4868",
      wiki: "https://www.waze.com/discuss/t/new-hampshire/378422",
      abbr: "NH",
    };
    States["New Jersey"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/new-jersey/4869",
      wiki: "https://www.waze.com/discuss/t/new-jersey/378446",
      abbr: "NJ",
    };
    States["New Mexico"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/new-mexico/4870",
      wiki: "https://www.waze.com/discuss/t/new-mexico/378462",
      abbr: "NM",
    };
    States["New York"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/new-york/4871",
      wiki: "https://www.waze.com/discuss/t/new-york/378477",
      abbr: "NY",
    };
    States["North Carolina"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/north-carolina/4872",
      wiki: "https://www.waze.com/discuss/t/south-carolina/378795",
      abbr: "NC",
    };
    States["North Dakota"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/north-dakota/4873",
      wiki: "https://www.waze.com/discuss/t/north-dakota/378534",
      abbr: "ND",
    };
    States.Ohio = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/ohio/4874",
      wiki: "https://www.waze.com/discuss/t/ohio/378559",
      abbr: "OH",
    };
    States.Oklahoma = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/oklahoma/4875",
      wiki: "https://www.waze.com/discuss/t/oklahoma/378576",
      abbr: "OK",
    };
    States.Oregon = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/oregon/4876",
      wiki: "https://www.waze.com/discuss/t/oregon/378592",
      abbr: "OR",
    };
    States.Pennsylvania = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/pennsylvania/4877",
      wiki: "https://www.waze.com/discuss/t/pennsylvania/378626",
      abbr: "PA",
    };
    States["Rhode Island"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/rhode-island/4880",
      wiki: "https://www.waze.com/discuss/t/rhode-island/378697",
      abbr: "RI",
    };
    States["South Carolina"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/south-carolina/4881",
      wiki: "https://www.waze.com/discuss/t/south-carolina/378795",
      abbr: "SC",
    };
    States["South Dakota"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/south-dakota/4882",
      wiki: "https://www.waze.com/discuss/t/south-dakota/378798",
      abbr: "SD",
    };
    States.Tennessee = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/tennessee/4884",
      wiki: "https://www.waze.com/discuss/t/tennessee/378849",
      abbr: "TN",
    };
    States.Texas = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/texas/4885",
      wiki: "https://www.waze.com/discuss/t/texas/378229",
      abbr: "TX",
    };
    States.Utah = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/utah/4895",
      wiki: "https://www.waze.com/discuss/t/utah/379059",
      abbr: "UT",
    };
    States.Vermont = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/vermont/4896",
      wiki: "https://www.waze.com/discuss/t/vermont/379061",
      abbr: "VT",
    };
    States.Virginia = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/virginia/4897",
      wiki: "https://www.waze.com/discuss/t/virginia/379094",
      abbr: "VA",
    };
    States.Washington = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/washington/4898",
      wiki: "https://www.waze.com/discuss/t/washington/379099",
      abbr: "WA",
    };
    States["West Virginia"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/west-virginia/4899",
      wiki: "https://www.waze.com/discuss/t/west-virginia/379151",
      abbr: "WV",
    };
    States.Wisconsin = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/wisconsin/4900",
      wiki: "https://www.waze.com/discuss/t/wisconsin/379101",
      abbr: "WI",
    };
    States.Wyoming = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/wyoming/4901",
      wiki: "https://www.waze.com/discuss/t/wyoming/379211",
      abbr: "WY",
    };
    States["Puerto Rico"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/puerto-rico/4879",
      wiki: "https://www.waze.com/discuss/t/puerto-rico/378675",
      abbr: "PR",
    };
    States["US Virgin Islands"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/us-virgin-islands/4892",
      wiki: "hhttps://www.waze.com/discuss/t/virgin-islands/379085",
      abbr: "VI",
    };
    States["South Pacific Territories"] = {
      forum: "https://www.waze.com/discuss/c/editors/united-states/south-pacific-territories/4883",
      wiki: "",
      abbr: "SP",
    };
    States["American Samoa"] = {
      forum: "",
      wiki: "https://www.waze.com/discuss/t/american-samoa/377744",
      abbr: "AS",
    };
    States["Guam"] = {
      forum: "",
      wiki: "https://www.waze.com/discuss/t/guam/378007",
      abbr: "GU",
    };
  }

  function injectCss() {
    if (debug) console.log(`${SCRIPT_NAME}: injectCss() called`);
    var css = [
      // General text styling for WazeBar elements
      ".WazeBarText { display: inline; padding-right: 4px; margin-left: 4px; border-right: thin solid grey; font-size: " + WazeBarSettings.BarFontSize + "px; color: #555555;}",
      // WazeBar Forum / Wiki / Current State Forum & Wiki links styling
      ".WazeBarText.WazeBarWikiItem a { color: " + WazeBarSettings.WikiFontColor + "; }",
      ".WazeBarText.WazeBarForumItem a { color: " + WazeBarSettings.ForumFontColor + "; }",
      ".WazeBarText.WazeBarCurrState a { color: #FF0000; }",
      ".WazeBarText.WazeBarServerUpdate {}",
      ".WazeBarIcon { display: inline; margin-left: 8px; cursor: pointer; font-size: " + WazeBarSettings.BarFontSize + "px; color: #555555;}",

      // WazeBar styling
      // WazeBar Favorites dropdown styling
      "#WazeBarFavorites { max-height: 500px; z-index: 100; overflow: auto; display: none; position: absolute; background-color: #f9f9f9; min-width: 200px;  margin-top: -2px; padding: 10px; }",
      "#WazeBarFavoritesList { list-style: none; padding: 0; margin: 0; }",
      ".favorite-item { position: relative; padding: 4px 4px; margin: 4px 0; background: #f1f1f1; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }",
      ".favorite-item a { flex-grow: 1; text-decoration: none; color: #555555; }",
      ".favorite-item a:visited { color: #555555; }",
      ".favorite-item i { cursor: pointer; color: #c00; }",
      ".favorite-item:hover { background: #33CCFF; }",
      "#WazeBarFavoritesAddContainer { display: flex; flex-direction: column; margin-top: 10px; gap: 8px; }",
      "#WazeBarFavoritesAddContainer input { height: 25px; border: 1px solid #000000; padding: 4px; border-radius: 6px; background-color: white}",
      "#WazeBarAddFavorite { padding: 8px 8px; font-size: 1rem; background-color: #8BC34A; color: white; border: 2px solid #8BC34A; border-radius: 25px; cursor: pointer; box-sizing: border-box; transition: background-color 0.3s ease, border-color 0.3s ease; }",
      "#WazeBarAddFavorite:hover { background-color: #689F38; border-color: #689F38; }",

      // Unread messages popup delay styling
      ".WazeBarUnread { max-height: 500px; z-index: 100; overflow: auto; display: flex; position: absolute; background-color: #f9f9f9; min-width: 200px; max-width: 700px; margin-top: -2px; padding: 8px; }",
      ".WazeBarUnreadList {   list-style: none; padding: 0; margin: 0; }",
      ".WazeBarUnreadList.unread-item { position: relative; padding: 4px 4px; margin: 4px 0; background: #f1f1f1; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }",
      ".WazeBarUnreadList.unread-item a { flex-grow: 1; text-decoration: none; color: #333; font-weight: normal;}",
      ".WazeBarUnreadList.unread-item i { cursor: pointer; color: #c00; }",
      ".WazeBarUnreadList.unread-item:hover { background: #33CCFF; }",

      // Main Setting Menu diolog
      "#WazeBarSettings {cursor: move; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; border: 3px solid #000; border-radius: 5%; padding: 12px; color: #000000;}", 
      "#WazeBarSettings input[type='number'], #WazeBarSettings input[type='text'], #WazeBarSettings textarea { border: 1px solid #000; padding: 5px; border-radius: 6px; margin-bottom: 0px; background-color: white; color: #000000; }",
      "#WazeBarSettings button { padding: 8px 12px; border: none; border-radius: 25px; cursor: pointer; }",
      "#WazeBarSettings button#WBSettingsSave { background-color: #007bff; color: #fff; }",
      "#WazeBarSettings button#WBSettingsSave:hover { background-color: #0056b3; }",
      "#WazeBarSettings button#WBSettingsCancel { background-color: #6c757d; color: #fff; }",
      "#WazeBarSettings button#WBSettingsCancel:hover { background-color: #5a6268; }",
      "#WazeBarSettings h4 { margin-top: 4px; margin-bottom: 4px; font-size: 14px; line-height: 1.2; text-align: center; }",
      "#WazeBarSettings #customLinksSection { margin-top: 5px; }",
      "#WazeBarSettings #customLinksSection div { margin-bottom: 0; }",
      "#WazeBarSettings label { font-weight: normal; margin-bottom: auto;}",
      // Inline element alignment for the settings inputs
      "#WazeBarSettings .flex-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }",

      // Flex container holds the flex columns on the Main Setting Menu diolog
      ".flex-container { display: flex; align-items: flex-start; width: 100%; gap: 8px; box-sizing: border-box; height: 490px; overflow-y: auto;}",
      ".flex-column { padding: 8px; position: relative; box-sizing: border-box; border: 1px solid #ccc; background-color: #f9f9f9; width: 230px; flex: 1 1 auto; min-height: 490px; border-radius: 1%;}",
      ".left-column::after { content: ''; position: absolute; top: 0; right: 0; width: 0px; height: 100%; background-color: #ccc; }",
      ".right-column::before { content: ''; position: absolute; top: 0; left: 0; width: 0px; height: 100%; background-color: #ccc; }",

      // Color Picker styling for Forumn and Wiki links
      "#colorPickerForumFont, #colorPickerWikiFont {border: 1px solid #000000; border-radius: 6px; background-color: white; }",

      // State rows styling
      ".state-row { display: flex; align-items: center; }",
      ".state-row div { padding: 4px 4px; }",
      ".checkbox-column { display: flex; justify-content: center; align-items: center; }",
      // State Table header styling
      ".state-header { display: inline-flex; }",
      ".state-header div { padding: 8px; }",
      // State Flex-box for the table
      ".state-column { flex: 6; }",
      ".checkbox-column { flex: 1; }",

      // Horizontal rule styling
      "hr { border: none; border-top: 1px solid #ccc; margin: 10px 0 0 0; width: calc(100% - 16px); }",

      // Additional styles for Custom Links section inputs to match Favorites section inputs
      "#WazeBarCustomURL, #WazeBarCustomText, #WazeBarAddCustomLink { box-sizing: border-box; width: 100%; margin: 5px; }",
      "#WazeBarCustomURL, #WazeBarCustomText { height: 25px; border: 1px solid #000000; padding: 8px; border-radius: 6px; margin-bottom: 3px; }",
      "#WazeBarAddCustomLink { padding: 8px 0; font-size: 1rem; background-color: #8BC34A; color: white; border: 2px solid #8BC34A; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease, border-color 0.3s ease; }",
      "#WazeBarAddCustomLink:hover { background-color: #689F38; border-color: #689F38; }",

      // Custom List link styling
      "#WazeBarCustomLinksList { list-style: none; padding: 0; margin: 0;  }",
      ".custom-item { position: relative; padding: 4px; margin: 4px 0;  background: #f1f1f1; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; width: 100%; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); transition: background 0.3s ease, transform 0.3s ease; border: 1px solid #ddd; }",
      ".custom-item a { display: block; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-decoration: none; color: #555555; }",
      ".custom-item a:visited { color: #555555; }",
      ".custom-item i { cursor: pointer; color: #f56a6a;  }",
      ".custom-item:hover { background: #33CCFF;  }",
      ".custom-item i:hover { }",

      // Export/Import Section Styling
      ".flex-row { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }",
      ".export-button, .import-button { font-size: 1.5rem; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease; }",
      ".export-button:hover, .import-button:hover { background-color: #0056b3; transform: scale(1.05); }",
      "#txtWazebarSettings, #txtWazebarImportSettings { width: 100%; height: 140px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px; box-sizing: border-box; resize: none; }",

      // Ensure textareas align properly in flex container
      ".flex-row textarea { flex-grow: 0; }",

      // Adjust Export and Import button font sizes for better alignment
      ".fa-upload, .fa-download { font-size: 1.2rem; padding: 10px; }",

      // styling for checkbox containers to align labels and checkboxes
      ".checkbox-container { display: flex; align-items: center; margin-bottom: 4px; }",
      ".checkbox-container input[type='checkbox'] { margin-right: 8px; }",

      // Custom styling for the region dropdown
      ".styled-select { width: 95%;  border-radius: 6px; }",
      ".styled-select:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); outline: none; }",
    ].join(" ");

    // Remove the previous styles if they exist
    $("#WazeBarStyles").remove();

    // Append the new styles
    $('<style type="text/css" id="WazeBarStyles">' + css + "</style>").appendTo("head");
  }

  // Call the function to inject the CSS
  injectCss();

  function isChecked(checkboxId) {
    return $("#" + checkboxId).is(":checked");
  }

  function setChecked(checkboxId, checked) {
    $("#" + checkboxId).prop("checked", checked);
  }

  const defaultSettings = {
    forumInterval: 2,
    forumHistory: 7,
    scriptsForum: false,
    header: { region: {} },
    USSMForum: false,
    USChampForum: false,
    USWikiForum: false,
    NAServerUpdate: true,
    WMEBetaForum: false,
    DisplayWazeForum: false,
    Favorites: [
      {
        href: "https://www.waze.com/discuss/t/waze-map-editor-welcome/379135",
        text: "Map Editor Welcome",
      },
      {
        href: "https://www.waze.com/discuss/t/waze-etiquette/378211",
        text: "Etiquette",
      },
      {
        href: "https://www.waze.com/discuss/t/glossary/377948",
        text: "Glossary",
      },
    ],
    ForumFontColor: "#1E90FF",
    WikiFontColor: "#32CD32",
    BarFontSize: 13,
    CustomLinks: [],
    ROWServerUpdate: false,
  };

  function LoadSettingsObj() {
    if (debug) console.log(`${SCRIPT_NAME}: LoadSettingsObj() called:`);

    let loadedSettings;
    try {
      loadedSettings = JSON.parse(localStorage.getItem("Wazebar_Settings"));
    } catch (err) {
      loadedSettings = null;
    }

    WazeBarSettings = loadedSettings ? loadedSettings : { ...defaultSettings };

    for (const prop in defaultSettings) {
      if (!WazeBarSettings.hasOwnProperty(prop)) WazeBarSettings[prop] = defaultSettings[prop];
    }
  }

  function serializeSettings() {
    SaveSettings(); // Save current settings to localStorage
    const settings = JSON.parse(localStorage.getItem("Wazebar_Settings")) || {};
    const serialized = JSON.stringify(settings, null, 2); // Pretty print JSON with 2 spaces indentation
    // Update #txtWazebarSettings with the serialized settings
    $("#txtWazebarSettings").text(serialized);
    return serialized;
  }
  // Function to update WazeBarSettings from the UI elements
  function updateWazeBarSettingsFromUI() {
    WazeBarSettings.DisplayWazeForum = isChecked("WazeForumSetting");
    WazeBarSettings.WMEBetaForum = isChecked("WMEBetaForumSetting");
    WazeBarSettings.scriptsForum = isChecked("ScriptsForum");
    WazeBarSettings.USSMForum = isChecked("USSMForumSetting");
    if (!forumPage) {
      WazeBarSettings.USChampForum = isChecked("USChampForumSetting");
    }
    WazeBarSettings.USWikiForum = isChecked("USWikiForumSetting");
    WazeBarSettings.ForumFontColor = $("#colorPickerForumFont").val();
    WazeBarSettings.WikiFontColor = $("#colorPickerWikiFont").val();
    WazeBarSettings.forumInterval = $("#forumInterval").val();
    WazeBarSettings.forumHistory = $("#forumHistory").val();
    WazeBarSettings.NAServerUpdate = isChecked("NAServerUpdateSetting");
    WazeBarSettings.ROWServerUpdate = isChecked("ROWServerUpdateSetting");
    WazeBarSettings.BarFontSize = $("#WazeBarFontSize").val();
    if (WazeBarSettings.BarFontSize < 8) {
      WazeBarSettings.BarFontSize = 8;
      $("#WazeBarFontSize").val(8);
    }
  }

  function SaveSettings() {
    if (debug) console.log(`${SCRIPT_NAME}: SaveSettings() called:`);
    if (localStorage) {
      var localsettings = {
        BarFontSize: WazeBarSettings.BarFontSize,
        ForumFontColor: WazeBarSettings.ForumFontColor,
        WikiFontColor: WazeBarSettings.WikiFontColor,
        forumInterval: WazeBarSettings.forumInterval,
        forumHistory: WazeBarSettings.forumHistory,
        DisplayWazeForum: WazeBarSettings.DisplayWazeForum,
        WMEBetaForum: WazeBarSettings.WMEBetaForum,
        scriptsForum: WazeBarSettings.scriptsForum,
        header: WazeBarSettings.header,
        USChampForum: WazeBarSettings.USChampForum,
        USSMForum: WazeBarSettings.USSMForum,
        USWikiForum: WazeBarSettings.USWikiForum,
        NAServerUpdate: WazeBarSettings.NAServerUpdate,
        ROWServerUpdate: WazeBarSettings.ROWServerUpdate,
        Favorites: WazeBarSettings.Favorites,
        CustomLinks: WazeBarSettings.CustomLinks,
      };
      localStorage.setItem("Wazebar_Settings", JSON.stringify(localsettings));
    }
  }

  function localAlertInfo(scriptName, message, disableTimeout = false) {
    // Create the basic alert element
    const alertHtml = `
      <div class="toast-info">
        <div class="toast-header">
          <b>${scriptName} - Info</b>
          <button type="button" class="toast-close-button">&times;</button>
        </div>
        <div class="toast-message">
        <br>
        ${message}
        </div>
      </div>
    `;

    // Create the alert element and style it to be centered in the window
    const $alertElement = $(alertHtml).css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: 1000, // Ensure it's on top of other content
    });

    // Style for the close button
    $alertElement.find(".toast-close-button").css({
      position: "absolute",
      top: "0px",
      right: "5px",
      fontSize: "25px",
      color: "#fff",
      background: "none",
      border: "none",
      cursor: "pointer",
    });

    // Append the alert element to the specified container

    if (forumPage) {
      $("body").append($alertElement);
    } else {
      $("#waze-map-container").append($alertElement);
    }

    // Handle the close button functionality
    $alertElement.find(".toast-close-button").on("click", function () {
      $alertElement.remove();
    });

    // Auto-dismiss if disableTimeout is not true
    if (!disableTimeout) {
      setTimeout(() => {
        $alertElement.fadeOut(() => $alertElement.remove());
      }, 3000); // 5-second timeout by default
    }
  }
})();
