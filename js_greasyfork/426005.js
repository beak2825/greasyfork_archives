// ==UserScript==
// @name            Twitch Follower Count
// @namespace       https://github.com/aranciro/
// @version         1.2.1
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @description     Configurable browser userscript that shows follower count when in a twitch channel page.
// @author          aranciro
// @homepage        https://github.com/aranciro/Twitch-Follower-Count
// @supportURL      https://github.com/aranciro/Twitch-Follower-Count/issues
// @icon            https://github.com/aranciro/Twitch-Follower-Count/raw/master/res/twitch-follower-count-icon32.png
// @icon64          https://github.com/aranciro/Twitch-Follower-Count/raw/master/res/twitch-follower-count-icon64.png
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @include         *://*.twitch.tv/*
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/426005/Twitch%20Follower%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/426005/Twitch%20Follower%20Count.meta.js
// ==/UserScript==

const pollingInterval = 5000;
const followerCountNodeName = "ChannelFollowerCount";
const channelPageTitleRegExp = /^([^\s-]+)\s-\s(?:T|t)witch$/;

let titleObserver;

const selectors = {
  channelNameAnchorNode: "div.channel-info-content a[href^='/']",
  channelNameNode: "div.channel-info-content a[href^='/'] > h1.tw-title",
  channelPartnerBadgeNode:
    "div.channel-info-content div.sc-AxjAm.gOCWUc > figure.tw-svg > svg",
  divNextToButtonsNode:
    "div.sc-AxjAm.StDqN.metadata-layout__secondary-button-spacing",
  divWithButtonsRowNode: "div.sc-AxjAm.fAqNuL",
};

const configLiterals = {
  smallFontSize: "Small",
  mediumFontSize: "Medium",
  bigFontSize: "Big",
  positionChannelName: "Next to channel name",
  positionFollowButton: "Left of the follow button",
};

const fontSizeMap = {
  [configLiterals.smallFontSize]: "5",
  [configLiterals.mediumFontSize]: "4",
  [configLiterals.bigFontSize]: "3",
};

GM_config.init({
  id: "Twitch_Follower_Count_config",
  title: "Twitch Follower Count - Configuration",
  fields: {
    fontSize: {
      label: "Font size",
      type: "select",
      options: [
        configLiterals.smallFontSize,
        configLiterals.mediumFontSize,
        configLiterals.bigFontSize,
      ],
      default: configLiterals.mediumFontSize,
      title: "Select the follower count font size",
    },
    position: {
      label: "Position",
      type: "select",
      options: [
        configLiterals.positionChannelName,
        configLiterals.positionFollowButton,
      ],
      default: configLiterals.positionChannelName,
      title: "Select where the follower count should appear",
    },
    localeString: {
      type: "checkbox",
      default: true,
      label: "Format the follower count (puts thousands separator etc.)",
      title:
        "Uncheck if you don't want the follower count to have separator for thousands",
    },
    enclosed: {
      type: "checkbox",
      default: false,
      label: "Parenthesize the follower count",
      title: "Parenthesize the follower count",
    },
  },
  events: {
    save: () => {
      updateConfig();
    },
  },
});

GM_addStyle(`
@keyframes blinker { 50% { opacity: 0; } } 
.updating-counter { animation: blinker 1s linear infinite; } 
`);

GM_registerMenuCommand("Configure Twitch Follower Count", () => {
  GM_config.open();
});

const currentChannel = {
  name: undefined,
  nameShown: undefined,
  followers: undefined,
};

const config = {
  fontSize: fontSizeMap[GM_config.get("fontSize")],
  insertNextToFollowButton:
    configLiterals.positionFollowButton === GM_config.get("position"),
  localeString: GM_config.get("localeString"),
  enclosed: GM_config.get("enclosed"),
};

const updateConfig = () => {
  config.fontSize = fontSizeMap[GM_config.get("fontSize")];
  config.insertNextToFollowButton =
    configLiterals.positionFollowButton === GM_config.get("position");
  config.localeString = GM_config.get("localeString");
  config.enclosed = GM_config.get("enclosed");
  removeExistingFollowerCountNodes();
  insertFollowerCountNode();
};

const run = () => {
  const channelNameNode = document.querySelector(selectors.channelNameNode);
  if (channelNameNode) {
    const followerCountNodes = document.getElementsByName(
      followerCountNodeName
    );
    const followerCountNodesExist = followerCountNodes.length > 0;
    const channelNameAnchorNode = document.querySelector(
      selectors.channelNameAnchorNode
    );
    if (channelNameAnchorNode) {
      const anchorHref = channelNameAnchorNode.getAttribute("href");
      if (anchorHref && anchorHref.length > 1) {
        const channelNameFromAnchor = anchorHref.substr(1);
        if (
          currentChannel.name !== channelNameFromAnchor ||
          !followerCountNodesExist
        ) {
          followerCountNodes.forEach((fcNode) =>
            fcNode.classList.add("updating-counter")
          );
          currentChannel.nameShown = channelNameNode.innerText;
          currentChannel.name = channelNameFromAnchor;
          getFollowerCount()
            .then((response) => handleFollowerCountAPIResponse(response))
            .catch((error) => {
              console.error(error);
            });
        }
      }
    }
  }
};

const removeExistingFollowerCountNodes = () => {
  const followerCountNodes = document.getElementsByName(followerCountNodeName);
  followerCountNodes.forEach((fcNode) => fcNode.remove());
};

const getFollowerCount = async () => {
  const url = "https://gql.twitch.tv/gql";
  const requestBody = JSON.stringify([
    {
      operationName: "ChannelPage_ChannelFollowerCount",
      variables: {
        login: currentChannel.name,
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            "87f496584ac60bcfb00db2ce59054b73155f297f1796e5e2418d685213233ad9",
        },
      },
    },
  ]);
  const followerCountResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    },
    body: requestBody,
  });
  if (followerCountResponse.ok) {
    let followerCountResponseBody = await followerCountResponse.json();
    return followerCountResponseBody;
  } else {
    console.error(followerCountResponse);
    const errorMessage = `Endpoint responded with status: ${followerCountResponse.status}`;
    throw new Error(errorMessage);
  }
};

const responseIsValid = (response) => {
  return (
    Array.isArray(response) &&
    response.length > 0 &&
    "data" in response[0] &&
    "user" in response[0].data &&
    "followers" in response[0].data.user &&
    "totalCount" in response[0].data.user.followers &&
    response[0].data.user.followers.totalCount !== null &&
    response[0].data.user.followers.totalCount !== undefined
  );
};

const handleFollowerCountAPIResponse = (response) => {
  if (!responseIsValid(response)) {
    console.error(response);
    const errorMessage = "Invalid response body";
    throw new Error(errorMessage);
  }
  currentChannel.followers = response[0].data.user.followers.totalCount;
  removeExistingFollowerCountNodes();
  insertFollowerCountNode();
  monitorTitle();
};

const monitorTitle = () => {
  if (titleObserver) {
    titleObserver.disconnect();
  }
  titleObserver = new MutationObserver(() => handleTitleChange());
  titleObserver.observe(document.querySelector("title"), {
    subtree: true,
    characterData: true,
    childList: true,
  });
};

const handleTitleChange = () => {
  const isChannelPage = document.querySelector(selectors.channelNameNode);
  if (isChannelPage) {
    const matches = channelPageTitleRegExp.exec(document.title);
    if (matches && matches.length > 1) {
      const channelNameFromTitle = matches[1];
      const channelHasChanged =
        currentChannel.nameShown &&
        channelNameFromTitle.toLowerCase() !==
          currentChannel.nameShown.toLowerCase();
      if (channelHasChanged) {
        run();
      }
    }
  }
};

const insertFollowerCountNode = () => {
  const channelNameNode = document.querySelector(selectors.channelNameNode);
  channelNameNode.style.display = "inline-block";
  const channelPartnerBadgeNode = document.querySelector(
    selectors.channelPartnerBadgeNode
  );
  const followerCountNode = createFollowerCountNode();
  if (config.insertNextToFollowButton) {
    const divWithButtonsRowNode = document.querySelector(
      selectors.divWithButtonsRowNode
    );
    const followerCountContainerNode =
      createFollowerCountContainerNode(followerCountNode);
    divWithButtonsRowNode.insertBefore(
      followerCountContainerNode,
      divWithButtonsRowNode.firstChild
    );
  } else if (channelPartnerBadgeNode) {
    channelPartnerBadgeNode.parentNode.insertBefore(
      followerCountNode,
      channelPartnerBadgeNode.nextSibling
    );
  } else {
    channelNameNode.parentNode.insertBefore(
      followerCountNode,
      channelNameNode.nextSibling
    );
  }
};

const createFollowerCountNode = () => {
  const followerCountTextNode = createFollowerCountTextNode();
  const followerCountNode = document.createElement("h2");
  followerCountNode.setAttribute("name", followerCountNodeName);
  followerCountNode.classList.add(
    "tw-c-text-alt-2",
    `tw-font-size-${config.fontSize}`,
    "tw-semibold"
  );
  followerCountNode.style.marginLeft = "1rem";
  followerCountNode.style.marginRight = "1rem";
  followerCountNode.style.display = "inline-block";
  followerCountNode.appendChild(followerCountTextNode);
  return followerCountNode;
};

const createFollowerCountTextNode = () => {
  let followersText = currentChannel.followers;
  if (config.localeString) {
    followersText = Number(followersText).toLocaleString();
  }
  if (config.enclosed) {
    followersText = `(${followersText})`;
  }
  return document.createTextNode(followersText);
};

const createFollowerCountContainerNode = (followerCountNode) => {
  const followerCountContainerNode = document.createElement("div");
  followerCountContainerNode.style.display = "flex";
  followerCountContainerNode.style.justifyContent = "center";
  followerCountContainerNode.style.alignContent = "center";
  followerCountContainerNode.style.flexDirection = "column";
  followerCountContainerNode.appendChild(followerCountNode);
  return followerCountContainerNode;
};

(() => {
  console.log("Twitch Follower Count userscript - START");
  try {
    run();
    setInterval(() => run(), pollingInterval);
  } catch (e) {
    console.log("Twitch Follower Count userscript - STOP (ERROR) \n", e);
  }
})();