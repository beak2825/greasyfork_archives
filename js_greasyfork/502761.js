// ==UserScript==
// @name        TorrentBD-Torrent Downloader
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.net/*
// @match       https://www.torrentbd.com/*
// @match       https://www.torrentbd.org/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAkASURBVHhe7dxrcFTlGQfw//Oec/aSGzGsgHZ00QIbLpXlUsfLsFAqWNAWxxl7sbYsCFKkDu10ZJyp0+kXe4GhdCilpSKstlXH2qGCExnscFmmpRdGlgFJFpWQikBTVi6RZDd7zvP0QxIa35JkL9ndl7i/DzD8n5O9/LN7zuHs2QOUlZWVlZWVlZWVlWWL1EAndy5cbR14fhWmPfS0L3khUX353Gk2LDdV3zg6YKc6PE4yycwS6Y42gBnCcsN0VwBguKtrhbTTZy68/85pV0WNqB51s7z84dnTqbY2554nN9rPPTxKqvdXSCUvun7W4hoyjJFsO6NIiKBkOZKAsdJOu4TpCjjpFBmW63pmrmbHYRAghOlmMMDcdSM9f9OVP0BCgKUES5kEEQnDlNJOfwAiaViui3aqo9l0ey/aqY4m01PRwo59wnR7/216K8/F/rS683+PcHAUrehpDz1dnWq7cJOdSn6apTMBzOPAPBYEP4A6MKpABICL+bC6MQCSAH8I4DRAzcx8jIRoNF2eZjLNd257YFnri8smdf9Gs1ewZzRx7vKR0nGmSDsdJKK7mXk8mD8FwKMuq68rv/RWEJ0A8HcS4i1hmAfd1bXHD237qa3+RF8Grejb5q+8wUl33i6d9N0s5Z0s5TgAI9TlhogOgBsB+qdhud4C0T7DW3HiyI51aXXBHjkXfcfDPxIXzzZPAXAfO84MZjkZwPXqcp8QklmuOb7/hafUQY+si57w+cf80nEeYuksADAVgKEu80kkTGt94+5nV6p5j4yLnnTvihF2qmMVS7kYwHXq/JONQYaxoGnPlu3qpIdQg6upn7V4sp1s/xtL+b1yyVdBotXyVv1FjXsbsOiJc5ZPYSnfYOZb1FlZF9Pt2XKkYX1CzXsbsGgn3fkzADeo+RAiiUQHiN4jIY4J02oUptVIJJqI6JK6sIpIPOcbM/n7aq7qdx39mXlPTE23f3SQmftd7hqTIiFiJMQBIvEPMsx3TZf7nDCtVk91XariupEkLBOXzjRTx6XzI5zOlJ+lDLJjB0BUL+20AAlBgpoN0/X622/+apt6B1fTb4ET5z6+xE62P6vm16jjIPq15fa+cXTXxiZ1WGj9rjpYSreaXWuY+T/M/ISrqmZ6fN/WdaUoGQMVbVjWya7jD9esQ0Q04/j+5zccaVjfpg6Lqd+iWcpDBFxU87wxdx9HKBxmGZWOPTMejcTVWSkM+HIdP3vpXmmnZ6p5lloAxEB0yDCtU53tbcdMt7cGoCBLZx6AfG//44haLW/lXUd3bnhPHZXKgEVPunfFV9LJ9pevHPPNBBHAHAdzg+F27xKmdeDozl/2+c4IzFi4HEQb1TxXpqdi8du7Nm5V81IasGgAqJ/16CaWzmNq/n+IEgRqEJb1suWt2nN4x9oOdZG+jJ+9ZJ607e+oedaItsf3bV2gxqXW7zq6hyFcjxsu90YQXf74hEDCuChMc7cwrWWGZU1o2rflm8f+vKkhm5IBwHR71xJR3hss0+XZrGY6yOgV3WPinOU3M/MsduxaELWTEI2uypqW2GtrTqnL5qJ+1qNvsnTuUfOMEcU9NXVTD+9Y266OSi2rogtt/Oylq6WdflLNMyUM84XGPZsXqrkOMlp1FAtL+S81ywrRfjXShVZFkxB5fIhAEIapze6cSq+i1SAr3MZSnlRTXWhVNOfxv0USBlyVNWqsDb2KljK3s4eYIUxTVNSNyO9NUUBaFW26PWPVLCNEkLb9PkunVR3pQquinc5On5plhkFC1JBhVKoTXWhVNMB1apIRBohomLTtctEDuePrzxjMfJOaZ6Rr1SHbE2dz35oWmDZFp9ovVYFRpeaZY3CO29Ji0KbodPtHdQDnfK4eA5BOxuccFp02RRMJL+fzeAr/oU1ecn9ig4xZjgbgUvOhQpuinXSnmdWnOAoigIw8DpUUmDZFs+OoUbaIhL4f2WtTtLCsSWqWFaKUYbkG/bsng0WbolnKajXLHIOEka4YPkrb3Q6dis5jJ5ggHfuU3ZksH+sYCEsn9y1hF+nx1OZ7GwWjTdEgkddxCgLIU1OrxtrQpmhhmhPVLHMMYbnk1K89og60oU3RyOscbIJ07Kaf3E7lVceA8tkWdm1MtTuXozd9is7j9QwAhuXS57lchTYPjmV+73pmblQznWhTdL6knb6gZjoZGkUTwfLmtXdYcEOjaGZmx9bizP6+DI2iASltO6mGOhkSRZMwOj21w8tFFxpLpzV56fwHaq6TIVE0CUGuyuo898QLa2gUTeLsrXfdp3ztQy8lKToQCo8LhMLT1DxX0rHPbntqthMIhbW9AkPRiw6EwtsBPA3guwC+GgiF/xQIhav6+Vd9vDEJQ3/0x1Dbb7CZY+1G5jfhGJVh7NNe8zI8Y9LfY9zb7VGDZ1PZ4FtDvez1c4NZN6rJNIAXAXgByBZDEA5HPrMKVlk7OoAABjVHJwBgBYFp6i2I2PeBGWF9jd6Hv9O6zV7LXWZ8ZDHadQDf5O6S0FcwZ8oQm0WNCD9+0Jd8N14N6LjPEJ+qWE5O1DzKzK61oJ4ANQD8LYEJOdRMZGQbZj5uTwAbRfNOqjXRW8oNaIaM7mq3hU9aE5E5xjg4G7V1F23aBsL5CAYFxfDvD4tC6n8k8Xqh78M2YpSdUWg6Av/LXKYhqV1u0WjTxpRyOD/9mKPRorhCBGqp1YcB3vhRVUWb3gfg6AyPbqOe8AiEqHfBGUFO3DxA4KnwQBEPOQJaahQxrE8RBz7ZQr9jPX1KAIYT/cxpGchSv1XyIYhw2uTy66YhpSB0JGSRKZJxbz6jWIULdvKS7cVYYhzKFnqQMOJYKv2VTEuuxBqzAfOt2VWWuDDjPaG5Wol8uWTqQJeWNvmQW5Z9FtWCwxCaFNJpF7GlCW+1z/RzSLKuWIaQ4ZRwMxOqTUXmLvl64xVJIkMg7vP3X31FFl1OhJOHJ8m9NYOD4zNapBQHOTJF0Xz5YgJhbfg47sAyCOCxCF3+JhV6E2LQEM21+kXO+MfCMwDxMpB9T8TJz5dECmU6iGFZxOGnxZFYrEhJpMW5+KdcbJ/6QlC7CwZu+aHGi6zE7YgFB9T8x6gGQzD88YpSDIvJAzUUkYUJoTJZNB+HdqhXJJ/LXo91HGzZOvlQEPR8L+KhCE7cEJ8v8q5LHX6NLdqYJMOYBFi6cCfCzTFi2v8QJo5CCUYPl5SbD6j8QECjzqmDRFu0iF5xBJI0B7l20YggzHYVJQ6m7XZN0xH4z7vX/s5lhI6Ef0wIkz4AQk9BUtN5uD3rJd/Qo00AiwI2Nc2s82WuS/P4jI3kOpN3P8Q6WnQk7aZKwJ2LXAHtqF7FJX8+/sxKKy7g8u7F+GKpqaRLfgCAQTdKVZWVlZWVlVUy+C+CYV5W5k2yyQAAAABJRU5ErkJggg==
// @version     2.1
// @run-at      document-end
// @author      TheMyth
// @grant       GM_registerMenuCommand
// @license MIT
// @description A Scripts that donwload torrent file from torrentBD. Just Config the UserConfig you are done.
// @downloadURL https://update.greasyfork.org/scripts/502761/TorrentBD-Torrent%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/502761/TorrentBD-Torrent%20Downloader.meta.js
// ==/UserScript==

// Default configuration
const defaultConfig = {
  max: [200,"mb"],
  min: [100, "mb"],
  downloadLimit: 200,
  sumDownloadSize: null,
};

// Function to get current user config
function getUserConfig() {
  const savedConfig = localStorage.getItem("torrentBDConfig");
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error("Failed to parse saved config:", e);
      return defaultConfig;
    }
  }
  return defaultConfig;
}

// Function to process config into working format
function processConfig(userConfig) {
  const t_c = {};

  function converter(x) {
    if (["kib", "kb"].includes(String(x[1]).toLowerCase())) {
      return parseFloat(x[0]);
    } else if (["mib", "mb"].includes(String(x[1]).toLowerCase())) {
      return parseFloat(x[0]) * 1024;
    } else if (["gib", "gb"].includes(String(x[1]).toLowerCase())) {
      return parseFloat(x[0]) * 1024 * 1024;
    } else if (["tib", "tb"].includes(String(x[1]).toLowerCase())) {
      return parseFloat(x[0]) * 1024 * 1024 * 1024;
    } else {
      return null;
    }
  }

  if (userConfig.max) {
    t_c.max = converter(userConfig.max);
  } else {
    t_c.max = null;
  }
  if (userConfig.min) {
    t_c.min = converter(userConfig.min);
  } else {
    t_c.min = null;
  }
  if (userConfig.sumDownloadSize) {
    t_c.sumDownloadSize = converter(userConfig.sumDownloadSize);
  } else {
    t_c.sumDownloadSize = null;
  }
  t_c.downloadLimit = userConfig.downloadLimit;
  return t_c;
}

// Initialize config
let Config = processConfig(getUserConfig());

let sumDownlodSize = 0.0;
let DownloadedTorrents = 0;

console.log(`User Config:`, Config);
console.log("Last History:",getLocal());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function setLocal(object) {
  localStorage.setItem("endof", JSON.stringify(object));
  alert(`Download Done!\nTotalDownloads:${object.DownloadedTorrents}\nLatTorrentName:${object.lastTorrentName}\nTotalFileSize:${object.sumDownlodSize}`)
}

function getLocal() {
  if (localStorage.getItem("endof")) {
    return JSON.parse(localStorage.getItem("endof"));
  } else {
    return null;
  }
}

/**
 *
 * @param {HTMLElement} element
 */
function getTheFileSize(element) {
  let el_TextContent = element
    .querySelector('div[title="File Size"')
    .textContent.split(" ");
  if (el_TextContent[2].toLowerCase() == "kib") {
    return parseFloat(el_TextContent[1]);
  } else if (el_TextContent[2].toLowerCase() == "mib") {
    return parseFloat(el_TextContent[1]) * 1024;
  } else if (el_TextContent[2].toLowerCase() == "gib") {
    return parseFloat(el_TextContent[1]) * 1024 * 1024;
  } else if (el_TextContent[2].toLowerCase() == "tib") {
    return parseFloat(el_TextContent[1]) * 1024 * 1024 * 1024;
  }
}

// Function to format file sizes with appropriate units
function formatFileSize(sizeInKB) {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;

    if (sizeInKB < KB) {
        return `${sizeInKB.toFixed(2)} KB`;
    } else if (sizeInKB < MB) {
        return `${(sizeInKB / KB).toFixed(2)} MB`;
    } else if (sizeInKB < GB) {
        return `${(sizeInKB / MB).toFixed(2)} GB`;
    } else {
        return `${(sizeInKB / GB).toFixed(2)} TB`;
    }
}

async function getTorrentData() {
  // Get fresh config at the start of download
  const currentUserConfig = getUserConfig();
  Config = processConfig(currentUserConfig);
  console.log('Using current config:', Config);

  while (true) {
    /**
     *
     * @param {HTMLElement} element
     * @param {Float} fileSize
     */
    async function downloadHelper(element, fileSize) {
      let title = element.querySelector("td:nth-child(2) a");
      let dwnLink = element.querySelector("td:nth-child(3) a");
      sumDownlodSize += fileSize;
      DownloadedTorrents += 1;
      dwnLink.click();
      console.log(`${DownloadedTorrents}:${title.textContent}`);
    }
    let tableBody = document.querySelector(
      "#kuddus-results-container > table > tbody"
    );
    let lastTorrentName = "";
    for (let index = 0; index < tableBody.children.length; index++) {
      const element = tableBody.children[index];

      let fileSize = getTheFileSize(element);
      if (Config.max && Config.min) {
        if (fileSize >= Config.min && fileSize <= Config.max) {
          downloadHelper(element, fileSize);
          await sleep(2000);
        }
      } else if (Config.max && fileSize <= Config.max) {
        downloadHelper(element, fileSize);
        await sleep(2000);
      } else if (Config.min && fileSize >= Config.min) {
        downloadHelper(element, fileSize);
        await sleep(2000);
      }

      if (Config.downloadLimit && Config.downloadLimit == DownloadedTorrents) {
        lastTorrentName =
          element.querySelector("td:nth-child(2) a").textContent;
        break;
      } else if (
        Config.sumDownloadSize &&
        sumDownlodSize >= Config.sumDownloadSize
      ) {
        lastTorrentName =
          element.querySelector("td:nth-child(2) a").textContent;
        break;
      } else if (
        !Config.sumDownloadSize &&
        !Config.downloadLimit &&
        DownloadedTorrents == 100
      ) {
        lastTorrentName =
          element.querySelector("td:nth-child(2) a").textContent;
        break;
      }
    }
    console.log(formatFileSize(sumDownlodSize));
    console.log(DownloadedTorrents);
    let next = document.querySelector('li[title="Next page"]');
    if (Config.downloadLimit && Config.downloadLimit == DownloadedTorrents) {
      setLocal({
        sumDownlodSize: sumDownlodSize,
        DownloadedTorrents: DownloadedTorrents,
        page: parseInt(next.getAttribute("data-paginate-to")) - 1,
        lastTorrentName: lastTorrentName,
      });
      return
    } else if (
      Config.sumDownloadSize &&
      sumDownlodSize >= Config.sumDownloadSize
    ) {
      setLocal({
        sumDownlodSize: sumDownlodSize,
        DownloadedTorrents: DownloadedTorrents,
        page: parseInt(next.getAttribute("data-paginate-to")) - 1,
        lastTorrentName: lastTorrentName,
      });
      return
    } else if (
      !Config.sumDownloadSize &&
      !Config.downloadLimit &&
      DownloadedTorrents == 100
    ) {
      setLocal({
        sumDownlodSize: sumDownlodSize,
        DownloadedTorrents: DownloadedTorrents,
        page: parseInt(next.getAttribute("data-paginate-to")) - 1,
        lastTorrentName: lastTorrentName,
      });
      return
    }

    if (!next) {
      return
    } else {
      next.click();
      await sleep(2000);
    }
  }
}

async function dwnBtnFunc() {

  let resultContainer = document.querySelector("#kuddus-results-container");
  if (resultContainer.childNodes.length == 0) {
    alert("No Torrent Found on th page");
  } else if (resultContainer.childNodes.length > 0) {
    sumDownlodSize = 0.0;
    DownloadedTorrents = 0;
    getTorrentData();
  }
}

// Create configuration UI
function createConfigUI(panel) {
  const configPanel = document.createElement("div");
  configPanel.id = "torrentbd-config-panel";
  configPanel.style = "position: absolute; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2); z-index: 9999; display: none; color: black; font-size: 12px; width: 300px; top: 5%;left:30%;";

  // Get current user config for the UI
  const currentUserConfig = getUserConfig();

  configPanel.innerHTML = `
    <h3 style="margin: 0 0 5px 0; font-size: 14px;">TorrentBD Settings</h3>
    <div style="display: grid; grid-template-columns: auto 60px 50px 55px; gap: 5px; align-items: center;">
      <label title="Maximum size of a single torrent file">Max Size:</label>
      <input type="number" id="config-max-value" value="${currentUserConfig.max ? currentUserConfig.max[0] : ''}" style="width: 100%;" />
      <select id="config-max-unit" style="width: 100%;">
        ${['kb', 'mb', 'gb', 'tb'].map(unit => `<option value="${unit}" ${currentUserConfig.max && currentUserConfig.max[1].toLowerCase() === unit ? 'selected' : ''}>${unit}</option>`).join('')}
      </select>
      <div>
        <input type="checkbox" id="config-max-enabled" ${currentUserConfig.max ? 'checked' : ''} />
        <label for="config-max-enabled"></label>
      </div>

      <label title="Minimum size of a single torrent file">Min Size:</label>
      <input type="number" id="config-min-value" value="${currentUserConfig.min ? currentUserConfig.min[0] : ''}" style="width: 100%;" />
      <select id="config-min-unit" style="width: 100%;">
        ${['kb', 'mb', 'gb', 'tb'].map(unit => `<option value="${unit}" ${currentUserConfig.min && currentUserConfig.min[1].toLowerCase() === unit ? 'selected' : ''}>${unit}</option>`).join('')}
      </select>
      <div>
        <input type="checkbox" id="config-min-enabled" ${currentUserConfig.min ? 'checked' : ''} />
        <label for="config-min-enabled"></label>
      </div>

      <label title="Number of torrents to download">Download Limit:</label>
      <input type="number" id="config-limit-value" value="${currentUserConfig.downloadLimit || ''}" style="width: 100%;" />
      <span></span>
      <div>
        <input type="checkbox" id="config-limit-enabled" ${currentUserConfig.downloadLimit ? 'checked' : ''} />
        <label for="config-limit-enabled"></label>
      </div>

      <label title="Total size of all downloaded torrents">Sum Size:</label>
      <input type="number" id="config-sum-value" value="${currentUserConfig.sumDownloadSize ? currentUserConfig.sumDownloadSize[0] : ''}" style="width: 100%;" />
      <select id="config-sum-unit" style="width: 100%;">
        ${['kb', 'mb', 'gb', 'tb'].map(unit => `<option value="${unit}" ${currentUserConfig.sumDownloadSize && currentUserConfig.sumDownloadSize[1].toLowerCase() === unit ? 'selected' : ''}>${unit}</option>`).join('')}
      </select>
      <div>
        <input type="checkbox" id="config-sum-enabled" ${currentUserConfig.sumDownloadSize ? 'checked' : ''} />
        <label for="config-sum-enabled"></label>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <button id="config-save" style="padding: 3px 8px;">Save</button>
      <button id="config-cancel" style="padding: 3px 8px;">Cancel</button>
    </div>
    <div style="font-size: 10px; margin-top: 5px;">
      <strong>Tips:</strong> Hover over labels for descriptions
    </div>
  `;

  panel.appendChild(configPanel);

  // Add event listeners
  document.getElementById("config-save").addEventListener("click", saveConfig);
  document.getElementById("config-cancel").addEventListener("click", hideConfigPanel);

  // Helper functions
  function saveConfig() {
    const config = {};

    if (document.getElementById("config-max-enabled").checked) {
      config.max = [
        parseFloat(document.getElementById("config-max-value").value),
        document.getElementById("config-max-unit").value
      ];
    } else {
      config.max = null;
    }

    if (document.getElementById("config-min-enabled").checked) {
      config.min = [
        parseFloat(document.getElementById("config-min-value").value),
        document.getElementById("config-min-unit").value
      ];
    } else {
      config.min = null;
    }

    if (document.getElementById("config-limit-enabled").checked) {
      config.downloadLimit = parseInt(document.getElementById("config-limit-value").value, 10);
    } else {
      config.downloadLimit = null;
    }

    if (document.getElementById("config-sum-enabled").checked) {
      config.sumDownloadSize = [
        parseFloat(document.getElementById("config-sum-value").value),
        document.getElementById("config-sum-unit").value
      ];
    } else {
      config.sumDownloadSize = null;
    }

    localStorage.setItem("torrentBDConfig", JSON.stringify(config));

    // Update the current Config object immediately
    Config = processConfig(config);
    console.log('Config updated:', Config);

    alert("Settings saved successfully! You can now use DownloadStart with the new configuration.");
    hideConfigPanel();
  }

  function hideConfigPanel() {
    const panel = document.getElementById("torrentbd-config-panel");
    if (panel) {
      panel.style.display = "none";
    }
  }
}

function showConfigPanel() {
  const panel = document.getElementById("torrentbd-config-panel");
  if (panel) {
    panel.style.display = "block";
  } else {
    console.error("Config panel not found. Make sure createConfigUI was called.");
  }
}

// Register menu command for configuration
GM_registerMenuCommand('TorrentBD Downloader Settings', showConfigPanel);

let panel = document.querySelector("#kuddus-wrapper");

const dwnBtn = document.createElement("button");
dwnBtn.textContent = "DownloadStart";
dwnBtn.setAttribute("align", "center");
dwnBtn.setAttribute("title", "DownloadStart");
dwnBtn.style =
  "position: fixed; top: -6px; left: 70px; border-radius: 4px; margin: 6px 8px; padding: 6px 14px; border: none; opacity: 0.5;";
dwnBtn.addEventListener("click", dwnBtnFunc);

if (panel.children.length > 0) {
  // Check if panel has children to avoid errors
  panel.insertBefore(dwnBtn, panel.children[panel.children.length - 1]);
} else {
  panel.appendChild(dwnBtn); // If panel has no children, just append it
}

let panel2=document.querySelector(".kuddus")
// Initialize configuration UI
createConfigUI(panel2);
