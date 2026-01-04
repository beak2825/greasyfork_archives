// ==UserScript==
// @name        Get current FPL Team
// @namespace   Violentmonkey Scripts
// @match       https://fantasy.premierleague.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      xydone
// @license     MIT
// @description Gets current FPL team selection in .json
// @downloadURL https://update.greasyfork.org/scripts/544446/Get%20current%20FPL%20Team.user.js
// @updateURL https://update.greasyfork.org/scripts/544446/Get%20current%20FPL%20Team.meta.js
// ==/UserScript==

(function () {
  function getAuthToken() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("oidc.user:https://account.premierleague.com/as:")) {
        try {
          const value = localStorage.getItem(key);
          const parsed = JSON.parse(value);
          if (parsed && parsed.access_token) {
            return parsed.access_token;
          }
        } catch (e) {
          console.warn("Error parsing auth token", e);
        }
      }
    }
    return null;
  }

  GM_registerMenuCommand("Fetch team", () => {
    const authToken = getAuthToken();

    if (!authToken) {
      alert("Token not found. Refresh and try again.");
      return;
    }

    GM_xmlhttpRequest({
      method: "GET",
      url: "https://fantasy.premierleague.com/api/me/",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        Referer: "https://fantasy.premierleague.com/",
        Origin: "https://fantasy.premierleague.com",
        "User-Agent": navigator.userAgent,
        "X-API-Authorization": `Bearer ${authToken}`,
      },
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          const teamId = data.player.entry;

          GM_xmlhttpRequest({
            method: "GET",
            url: `https://fantasy.premierleague.com/api/my-team/${encodeURIComponent(teamId)}`,
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              "X-Requested-With": "XMLHttpRequest",
              Referer: "https://fantasy.premierleague.com/",
              Origin: "https://fantasy.premierleague.com",
              "User-Agent": navigator.userAgent,
              "X-API-Authorization": `Bearer ${authToken}`,
            },
            onload: function (response) {
              try {
                const data = JSON.parse(response.responseText);

                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);

                window.open(url);

                setTimeout(() => URL.revokeObjectURL(url), 60000);
              } catch (e) {
                alert("Error parsing json from /my-team/ response.");
                console.error(e);
              }
            },
            onerror: function () {
              alert("Error fetching /my-team/ endpoint.");
            },
          });
        } catch (e) {
          alert(`Error parsing json from /me/ response.`);
          console.error(e);
        }
      },
      onerror: function () {
        alert("Error fetching /me/ endpoint.");
      },
    });
  });
})();
