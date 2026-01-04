// ==UserScript==
// @name        Streameast Theater Mode
// @namespace   Violentmonkey Scripts
// @include     /https:\/\/[\w]*\.(thestreameast|streameast)\.[\w]*/
// @grant       none
// @version     1.0.1
// @author      -
// @description 2/15/2025, 4:56:23 PM
// @downloadURL https://update.greasyfork.org/scripts/527146/Streameast%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/527146/Streameast%20Theater%20Mode.meta.js
// ==/UserScript==
const streameastUrlRegex = /https:\/\/[\w]*\.(thestreameast|streameast)\.[\w]*\/(mlb|nba|soccer|nhl|nfl|cfb|f1|boxing|ufc|wwe)/;
const debugMode = false;
const searchTime = 10 * 1000; // how long to search for dom nodes? in ms
const searchInterval = 100; // check for dom nodes every how many ms?
const maxIterationCount = searchTime / searchInterval;
const theaterModeVideoWidth = 80; // A number from 0 to 100, represents how wide (in percent of screen width) you want the video to be
const theaterModeVideoWidthStyle = `${theaterModeVideoWidth}%`
const theaterModeChatWidthStyle = `${100 - theaterModeVideoWidth}%`
let isTheaterModeEnabled = false;
const config = {
  button: {
    node: null,
    getNode: () => {
      return document.getElementById("TiyatroModu");
    },
    disabled: {},
    enabled: {
      position: "fixed",
      zIndex: "1001",
      bottom: "70px",
      right: `calc(${theaterModeChatWidthStyle} + 10px)`
    },
  },
  video: {
    node: null,
    getNode: () => {
      return document.getElementById("PlayerDuzenBolumu");
    },
    disabled: {},
    enabled: {
      position: "fixed",
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: theaterModeVideoWidthStyle,
      width: theaterModeVideoWidthStyle,
      zIndex: "1000",
    },
  },
  iframe: {
    node: null,
    getNode: () => {
      return document.getElementById("iframe");
    },
    disabled: {},
    enabled: {
      height: "100%",
    },
  },
  chat: {
    node: null,
    getNode: () => {
      return document.getElementById("live-chat-iframe");
    },
    disabled: {},
    enabled: {
      position: "fixed",
      top: "0px",
      left: theaterModeVideoWidthStyle,
      right: "0px",
      bottom: "0px",
      width: theaterModeChatWidthStyle,
      zIndex: "1000"
    },
  }
}

const applyStyles = (node, styleJson) => {
  for (const [key, value] of Object.entries(styleJson)) {
    node.style[key] = value;
  }
}

const storeStyles = (node, styleKeys, storageObj) => {
  for (const key of styleKeys) {
    storageObj[key] = node.style[key];
  }
}

const applyTheaterModeStyles = () => {
  for (const key of Object.keys(config)) {
    const node = config[key].node;
    storeStyles(
      node,
      Object.keys(config[key].enabled),
      config[key].disabled,
    );
    applyStyles(
      node,
      config[key].enabled
    );
  }
  config["button"].node.onclick = disableTheaterModeStyles;
}

const disableTheaterModeStyles = () => {
  for (const key of Object.keys(config)) {
    const node = config[key].node;
    applyStyles(
      node,
      config[key].disabled
    )
  }
  config["button"].node.onclick = applyTheaterModeStyles;
}

const validateConfig = () => {
  if (typeof theaterModeVideoWidth === "number" && theaterModeVideoWidth >= 0 && theaterModeVideoWidth <= 100) {
    return true;
  }
  return false;
}

/**
 *  Searches for required dom nodes
 *  and returns true if they are
 *  all found
 */
const findDomNodes = () => {
  const nodeKeys = Object.keys(config);
  for (const key of nodeKeys) {
    config[key].node = config[key].getNode()
  }

  let hasAllNodes = true;
  for (const key of nodeKeys) {
    hasAllNodes = hasAllNodes && Boolean(config[key].node)
  }

  return hasAllNodes;
}


const runScript = () => {
  let intervalCount = 0;

  let interval = setInterval(() => {
    intervalCount = intervalCount + 1;
    const gatheredAllNodes = findDomNodes();

    if (gatheredAllNodes || intervalCount > maxIterationCount) {
      clearInterval(interval);
    }

    if (gatheredAllNodes) {
      config["button"].node.onclick = applyTheaterModeStyles;
    }
  }, searchInterval);

}

const main = () => {
  const href = window.location.href;
  const isMatch = href.match(streameastUrlRegex);
  if (isMatch) {
    const isValidConfig = validateConfig();
    if (isValidConfig) {
      runScript();
    }
  }
}


main();

