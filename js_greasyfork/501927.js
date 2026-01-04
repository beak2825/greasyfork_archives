// ==UserScript==
// @name         Add-to-blacklist-Danbooru
// @namespace    https://danbooru.donmai.us/
// @version      2024-07-27
// @description  The script adds a button to add a tag to the blacklist on wiki pages
// @author       anonbl (https://danbooru.donmai.us/users/473183)
// @match        https://*.donmai.us/artists/*
// @match        https://*.donmai.us/wiki_pages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// @run-at       document-start
// @homepageURL  https://danbooru.donmai.us/forum_topics/28131
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501927/Add-to-blacklist-Danbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/501927/Add-to-blacklist-Danbooru.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var csrfToken;
  addEventListener("DOMContentLoaded", () => {
    let headerElement = document.querySelector(
      "#wiki-page-title, #a-show > div.flex.items-center.gap-2"
    );
    if (!headerElement.querySelector('a[class^="tag-type"]')) return;

    let tagInfoFetchPromise = fetch(document.location.pathname + ".json")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((json) => json?.name ?? json?.title)
      .catch(errorHandler);

    let profileInfoFetchPromise = getProfileInfo()
      .then((profile) => getBlacklist(profile))
      .catch(errorHandler);

    Promise.all([tagInfoFetchPromise, profileInfoFetchPromise])
      .then(([tag, blacklisted_tags]) => {
        var buttonsContainerElement = document.createElement("div");
        buttonsContainerElement.style.display = "inline-block";
        headerElement.append(buttonsContainerElement);
        if (!blacklisted_tags.includes(tag)) {
          buttonsContainerElement.append(createAddButton(tag));
        }
        for (const blacklistedTag of blacklisted_tags) {
          if (!blacklistedTag.includes(tag)) continue;
          buttonsContainerElement.append(createRemoveButton(blacklistedTag));
        }
      })
      .catch(errorHandler);
  });

  function addToBlacklist(tag) {
    return getProfileInfo()
      .then((profile) => {
        let blacklistArray = getBlacklist(profile);
        if (!blacklistArray.includes(tag)) blacklistArray.push(tag);
        blacklistArray.sort();
        let blacklisted_tags = blacklistArray.join("\n");
        return updateBlacklist(blacklisted_tags, profile.id);
      })
      .then((response) => response?.ok)
      .catch(errorHandler);
  }

  function removeFromBlacklist(tag) {
    return getProfileInfo()
      .then((profile) => {
        let blacklistArray = getBlacklist(profile);
        blacklistArray = blacklistArray.filter((t) => t != tag);
        blacklistArray.sort();
        let blacklisted_tags = blacklistArray.join("\n");
        return updateBlacklist(blacklisted_tags, profile.id);
      })
      .then((response) => response?.ok)
      .catch(errorHandler);
  }

  function getBlacklist(profile) {
    return profile?.blacklisted_tags?.split("\n") ?? [];
  }

  function getProfileInfo() {
    return fetch("/profile.json")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .catch(errorHandler);
  }

  function updateBlacklist(blacklisted_tags, userId) {
    csrfToken ??= document.head.querySelector('[name="csrf-token"][content]').content;
    return fetch(`/users/${userId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "same-origin",
      body: JSON.stringify({ user: { blacklisted_tags } }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response;
      })
      .catch(errorHandler);
  }

  function createAddButton(tag, button) {
    button = button ?? document.createElement("button");
    button.innerHTML = `Add to blacklist (${tag})`;
    button.setAttribute("class", "button-primary button-sm");
    button.onclick = () => {
      button.disabled = true;
      addToBlacklist(tag)
        .then((ok) => {
          if (!ok) return;
          showNotice(`${tag} has been added to the blacklist`);
          createRemoveButton(tag, button);
        })
        .finally(() => {
          button.disabled = false;
        });
    };
    return button;
  }

  function showNotice(msg) {
    let noticeElement = document.querySelector("#notice");
    noticeElement.querySelector("span").innerHTML = msg;
    noticeElement.style.display = "";
  }

  function errorHandler(err) {
    console.error(err);
    showNotice("Error: " + err?.message);
  }

  function createRemoveButton(tag, button) {
    button = button ?? document.createElement("button");
    button.innerHTML = `Remove from blacklist (${tag})`;
    button.setAttribute("class", "button-primary button-sm");
    button.onclick = () => {
      button.disabled = true;
      removeFromBlacklist(tag)
        .then((ok) => {
          if (!ok) return;
          createAddButton(tag, button);
          showNotice(`${tag} has been removed from the blacklist`);
        })
        .finally(() => {
          button.disabled = false;
        });
    };
    return button;
  }
})();
