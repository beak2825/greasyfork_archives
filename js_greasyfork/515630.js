// ==UserScript==
// @name        7TV Emote set cloner
// @namespace   https://www.7tv.app/*
// @version     1
// @description Clone emote sets on 7tv
// @author      Azagro
// @match       https://*.7tv.app/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=7tv.app
// @grant       GM_log
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/515630/7TV%20Emote%20set%20cloner.user.js
// @updateURL https://update.greasyfork.org/scripts/515630/7TV%20Emote%20set%20cloner.meta.js
// ==/UserScript==

let __authToken;

function gql(body) {
  return fetch("https://7tv.io/v3/gql", {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${__authToken}`,
    },
    body,
    method: "POST",
  });
}

function createEmoteSet(targetUserId) {
  const payload = `{"operationName":"CreateEmoteSet","variables":{"user_id":"${targetUserId}","data":{"name":"cloned"}},"query":"mutation CreateEmoteSet($user_id: ObjectID!, $data: CreateEmoteSetInput!) {\\n  createEmoteSet(user_id: $user_id, data: $data) {\\n    id\\n    name\\n    capacity\\n    owner {\\n      id\\n      display_name\\n      style {\\n        color\\n        __typename\\n      }\\n      avatar_url\\n      __typename\\n    }\\n    emotes {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`;
  return gql(payload);
}

function changeEmoteInSet({ emoteId, emoteName }, targetEmoteSetId) {
  const payload = `{"operationName":"ChangeEmoteInSet","variables":{"action":"ADD","id":"${targetEmoteSetId}","emote_id":"${emoteId}","name":"${emoteName}"},"query":"mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\\n  emoteSet(id: $id) {\\n    id\\n    emotes(id: $emote_id, action: $action, name: $name) {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`;
  return gql(payload);
}

function searchUsers(username) {
  const payload = `{"operationName":"SearchUsers","variables":{"query":"${username}"},"query":"query SearchUsers($query: String!) {\\n  users(query: $query) {\\n    id\\n    username\\n    display_name\\n    roles\\n    style {\\n      color\\n      __typename\\n    }\\n    avatar_url\\n    __typename\\n  }\\n}"}`;
  return gql(payload);
}

function updateEmoteSet(emoteSetName, emoteSetId) {
  const payload = `{"operationName":"UpdateEmoteSet","variables":{"data":{"name":"${emoteSetName}","capacity":1000,"origins":null},"id":"${emoteSetId}"},"query":"mutation UpdateEmoteSet($id: ObjectID!, $data: UpdateEmoteSetInput!) {\\n  emoteSet(id: $id) {\\n    update(data: $data) {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`;
  return gql(payload);
}

function getEmoteSet(emoteSetId) {
  const payload = `{"operationName":"GetEmoteSet","variables":{"id":"${emoteSetId}"},"query":"query GetEmoteSet($id: ObjectID!) {\\n  emoteSet(id: $id) {\\n    id\\n    name\\n    flags\\n    capacity\\n    emotes {\\n      id\\n      name\\n      __typename\\n    }\\n    owner {\\n      id\\n      username\\n      display_name\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`;
  return gql(payload);
}

// Delay function for rate-limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEmotesInSet(emoteSetId) {
  const body = await getEmoteSet(emoteSetId).then((res) => res.json());
  return body.data.emoteSet.emotes;
}

async function changeEmotesInSet(emotes, emoteSetId) {
  if (!emotes.length) return;

  for (const emote of emotes) {
    await changeEmoteInSet(emote, emoteSetId);
    await delay(1000); // 1 second delay to respect rate limits
  }

  const {
    data: { emoteSet },
  } = await getEmoteSet(emoteSetId).then((res) => res.json());
  const currentEmotes = emoteSet.emotes;
  const capacity = emoteSet.capacity;

  let emotesToAdd = emotes.filter(
    ({ emoteId }) => !currentEmotes.some(({ id }) => id === emoteId)
  );

  if (currentEmotes.length + emotesToAdd.length > capacity) {
    const availableSlots = capacity - currentEmotes.length;
    emotesToAdd = emotesToAdd.slice(0, availableSlots);
  }

  return changeEmotesInSet(emotesToAdd, emoteSetId);
}

async function cloneEmoteSet(emotes, targetUser) {
  const res = await createEmoteSet(targetUser)
    .then((res) => res.json())
    .catch((e) => {
      throw new Error(
        "Something went wrong when creating emote set (check if you are editor)"
      );
    });

  const emoteSetId = res.data.createEmoteSet.id;
  await updateEmoteSet("cloned-set", emoteSetId);

  await changeEmotesInSet(emotes, emoteSetId);
}

function getOriginSetEmotes() {
  const emoteList = document.querySelector(".emote-card-list");

  return Array.from(emoteList.children).map((emoteCardWrapper) => {
    return {
      emoteId: emoteCardWrapper.getAttribute("emote-id"),
      emoteName:
        emoteCardWrapper.querySelector(".title-banner").firstChild.textContent,
    };
  });
}

function targetPrompt() {
  const targetChannel = prompt("Enter target channel");
  return targetChannel;
}

function createCloneButton() {
  const div = document.createElement("div");
  Object.assign(div, {
    class: "action-button",
    name: "clone",
  });
  div.style.display = "grid";
  div.style.placeItems = "center";
  div.style.borderRadius = "50%";
  div.style.height = "2em";
  div.style.width = "2em";
  div.style.cursor = "pointer";
  div.style.position = "relative";
  div.style.color = "white";
  div.style.backgroundColor = "#ffffff0d";
  const img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/512/3991/3991529.png";
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.maxHeight = "65%";
  img.style.maxWidth = "65%";
  img.style.filter = "brightness(0) invert(1)";
  div.appendChild(img);
  document.querySelector(".actions")?.appendChild(div);
  return div;
}

function main() {
  const button = createCloneButton();
  button.addEventListener("mouseup", async (e) => {
    __authToken = localStorage.getItem("7tv-auth-token");
    if (!__authToken) {
      alert("Not logged in");
      return;
    }

    const targetChannel = targetPrompt();
    if (!targetChannel) {
      alert("No channel entered");
      return;
    }

    const body = await searchUsers(targetChannel).then((res) => res.json());
    const targetChannelId = body.data.users[0].id;
    if (!targetChannelId) {
      alert("Target channel not found");
      return;
    }

    const emotes = getOriginSetEmotes();
    if (!emotes.length) {
      alert("No emotes found in the current set");
      return;
    }

    try {
      await cloneEmoteSet(emotes, targetChannelId);
      alert("Successfully cloned emote set");
    } catch (e) {
      alert(e.message);
    }
  });
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function onEmoteSetsPageLoad(cb) {
  let oldHref = "";
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        if (oldHref.includes("/emote-sets")) {
          cb();
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

(async function () {
  "use strict";
  onEmoteSetsPageLoad(() => {
    waitForElm(".actions").then(() => {
      main();
    });
  });
})();