// ==UserScript==
// @name         Steam Community - Leave Banned Groups
// @icon         https://store.steampowered.com/favicon.ico
// @namespace    https://github.com/tkhquang
// @version      1.21
// @description  Add a button to leave invisble banned groups on steam
// @author       Quang Trinh
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/391660-steam-community-leave-banned-groups
// @include      /^https?:\/\/steamcommunity\.com\/(?:id|profiles)\/[\w-_]+\/groups\/?$/
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/391660/Steam%20Community%20-%20Leave%20Banned%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/391660/Steam%20Community%20-%20Leave%20Banned%20Groups.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global GM_getValue:true, GM_setValue:true, GM_deleteValue:true, unsafeWindow */

(function (window) {
  "use strict";

  const $ = window.jQuery.noConflict(true);

  const steamId = window.g_steamID;
  const sessionId = window.g_sessionID;

  // On not logged in, exit
  if (!steamId || !sessionId) {
    return;
  }

  // On someone else's profile, exit
  if (window.g_rgProfileData.steamid !== steamId) {
    return;
  }

  const GMChecks = [
    typeof GM_setValue !== "undefined",
    typeof GM_getValue !== "undefined",
    typeof GM_deleteValue !== "undefined",
  ];

  const useLocalStorage = !GMChecks.every(function (check) {
    return Boolean(check);
  });

  if (useLocalStorage) {
    GM_getValue = function (key, def) {
      return window.localStorage[key] || def;
    };
    GM_setValue = function (key, value) {
      window.localStorage[key] = value;
    };
    GM_deleteValue = function (key) {
      return window.localStorage.removeItem(key);
    };
  }

  const SteamApiKey = (function () {
    let currentKey = GM_getValue("LBG_STEAM_API_KEY", "");
    while (currentKey !== null && !/[0-9A-Z]{32}/.test(currentKey)) {
      currentKey = prompt(
        "Steam Leave Banned Group Userscript\n" +
          "Please enter your Steam API Key\n" +
          "Get from here:\n" +
          "https://steamcommunity.com/dev/apikey\n"
      );
    }
    return currentKey;
  })();

  // On cancel, exit
  if (SteamApiKey === null) {
    return;
  }

  GM_setValue("LBG_STEAM_API_KEY", SteamApiKey);

  console.log("LBG - API Key", SteamApiKey);

  async function doAjax(opts) {
    try {
      const data = await $.ajax(opts);
      return data;
    } catch (response) {
      if (response instanceof Error) {
        return Promise.reject(response);
      }
      // is jqXHR
      const error = new Error();
      error.message = response.statusText;
      return Promise.reject(error);
    }
  }

  // Get all groups which the user is in
  async function getAllGroups() {
    try {
      // This return the id [g:1:${id}]
      const { response } = await doAjax({
        type: "GET",
        url: "https://api.steampowered.com/ISteamUser/GetUserGroupList/v1/",
        data: {
          key: SteamApiKey,
          steamid: steamId,
        },
        dataType: "json",
      });

      return response.groups.map(function (groups) {
        return groups.gid;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function getVisibleGroups() {
    const pattern = /group_(\d+)/;

    try {
      const visibleGroups = $("#search_results")
        .find("div[id^='group_']")
        .toArray()
        .map(function (item) {
          return pattern.exec($(item).attr("id"))[1];
        });
      return visibleGroups;
    } catch (error) {
      return error;
    }
  }

  // Filter out other types of groups (offcial game groups, .etc)
  async function filterOutNotBanned(groupIds) {
    try {
      const results = await Promise.all(
        groupIds.map(async function (groupId) {
          const html = await doAjax({
            url: `https://steamcommunity.com/gid/[g:1:${groupId}]?l=english`,
            type: "get",
            dataType: "html",
          });
          return /This group has been removed for violating/.test(html) ? groupId : null;
        })
      );
      return results.filter(function (result) {
        return result !== null;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function getBannedGroupInfo(groupIds) {
    const pattern = /<!\[CDATA\[(.*)]]>/;

    try {
      const groupInfo = await Promise.all(
        groupIds.map(async function (groupId) {
          const xml = await doAjax({
            url: `https://steamcommunity.com/gid/[g:1:${groupId}]/memberslistxml/`,
            data: {
              xml: 1,
            },
            type: "GET",
            dataType: "xml",
          });
          return {
            groupID64: $(xml).find("groupID64").html(),
            groupName: pattern.exec($(xml).find("groupName").html())[1],
          };
        })
      );
      return groupInfo;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function sendLeaveRequest(groupInfo) {
    const data = {
      action: "leave_group",
      sessionid: sessionId,
      ajax: 1,
      steamid: steamId,
      steamids: [groupInfo.groupID64],
    };

    try {
      const response = await doAjax({
        url: `https://steamcommunity.com/profiles/${steamId}/friends/action`,
        type: "POST",
        dataType: "json",
        data,
      });
      console.log(`Left ${groupInfo.groupName}`, response);
      return response;
    } catch (error) {
      console.log(`Error leaving ${groupInfo.groupName}`, error);
      return Promise.reject(error);
    }
  }
  $(function () {
    $("<button />", {
      id: "lbg_btn",
      title: "Click to leave banned groups",
      text: "Leave banned groups",
      type: "button",
    }).appendTo(".friends_nav");

    $("<a />", {
      id: "lbg_clear_btn",
      title: "Click to remove current Steam API Key",
      text: "Remove current Steam API Key",
      href: "javascript:void(0)",
    }).appendTo(".friends_nav");

    $("<style>")
      .prop("type", "text/css")
      .html(
        `
        #lbg_btn {
          width: 100%;
          background-color: #015e80;
          border-radius: 5px;
          border: 1px solid #015e80;
          display: inline-block;
          cursor: pointer;
          color: #ffffff;
          padding: 8px 16px;
          text-decoration: none;
          text-shadow: 0px 1px 0px #2f6627;
        }
        #lbg_btn:hover:enabled {
          background-color: #004a50;
        }
        #lbg_btn:active {
          position: relative;
          top: 1px;
        }
        #lbg_btn:disabled {
          cursor: not-allowed;
        }
        #lbg_clear_btn {
          background-color: none;
          text-align: center;
          padding: 5px;
        }
        `
      )
      .appendTo("head");

    const btn = $("#lbg_btn");
    const btnClear = $("#lbg_clear_btn");
    const originalText = btn.text();

    let timer;

    function setText(el, text) {
      const $this = el;
      clearTimeout(timer);

      $this.text(text);
      timer = setTimeout(function () {
        $this.text(originalText);
      }, 5000);
    }

    function setPermText(el, text) {
      const $this = el;
      $this.text(text);
    }

    async function initialize() {
      btn.attr("disabled", true);
      setPermText(btn, "Checking...");

      const allGroups = await getAllGroups();
      const visibleGroups = getVisibleGroups();

      // This may be offical game groups or banned groups, .etc
      const unknownGroups = $(allGroups).not(visibleGroups).get();

      // Contains verified banned groups
      const bannedGroups = await filterOutNotBanned(unknownGroups);

      if (!bannedGroups.length) {
        setText(btn, "No banned groups to leave");
        console.log("No banned groups to leave");
        alert("No banned groups to leave");
        return;
      }

      // Get groupID64 and groupName
      const bannedGroupWithInfo = await getBannedGroupInfo(bannedGroups);

      setPermText(btn, `Leaving ${bannedGroupWithInfo.length} groups...`);

      // Send requests to leave those groups
      await Promise.all(
        bannedGroupWithInfo.map(function (groupInfo) {
          return sendLeaveRequest(groupInfo);
        })
      );

      // Success
      console.log(`Left ${bannedGroupWithInfo.length} Steam Groups successfully`);
      console.log("Groups", bannedGroupWithInfo);
      setText(btn, `Left ${bannedGroupWithInfo.length} groups`);
      alert(`Left ${bannedGroupWithInfo.length} groups\nCheck the browser console for more information`);
    }

    btn.click(async function (e) {
      e.preventDefault();
      try {
        await initialize();
      } catch (error) {
        console.log("An error occured", error);
        alert("An error occured");
        setText(btn, "An error occured");
      } finally {
        btn.removeAttr("disabled");
      }
    });

    btnClear.click(function (e) {
      e.preventDefault();
      try {
        GM_deleteValue("LBG_STEAM_API_KEY");
        setPermText(btnClear, "Remove API Key Success");
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      } catch (error) {
        console.log("An error occured", error);
        alert("An error occured");
        setText(btnClear, "An error occured");
      }
    });
  });
})(unsafeWindow);
