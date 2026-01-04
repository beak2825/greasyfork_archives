// ==UserScript==
// @name            喜马拉雅专辑下载器
// @version         1.3.5
// @description     XMLY Downloader
// @author          B-Y-F
// @match           *://www.ximalaya.com/*
// @grant           GM_download
// @icon            https://www.ximalaya.com/favicon.ico
// @require         https://registry.npmmirror.com/crypto-js/4.1.1/files/crypto-js.js
// @license         MIT
// @namespace https://greasyfork.org/users/323093
// @downloadURL https://update.greasyfork.org/scripts/514392/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/514392/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

async function fetchUntilSuccess(url) {
  while (true) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      console.error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function extractTrackUrl(tracks) {
  let timestamp = Date.now();
  return Array.from(tracks).map((t, index) => {
    timestamp += 5 * 60 * 1000 * index;
    const trackID = t.trackId;
    const title = t.title;
    const url = `https://www.ximalaya.com/mobile-playpage/track/v3/baseInfo/${timestamp}?device=web&trackId=${trackID}`;
    return { title, url };
  });
}

async function getAllTrackIds() {
  function getAlbumId() {
    const match = window.location.href.match(/.*\/(\d+)/);
    return match ? match[1] : null;
  }

  async function getTotalTrackCount() {
    const albumId = getAlbumId();
    const apiUrl = `https://www.ximalaya.com/tdk-web/seo/search/albumInfo?albumId=${albumId}`;
    const data = await fetchUntilSuccess(apiUrl);
    return data.data.trackCount;
  }

  async function fetchTracks(pages) {
    let tracks = [];

    for (let index = 0; index < pages; index++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      document.querySelectorAll(".sound-list li").forEach((li) => {
        if (li.classList.contains("_nO")) {
          // Assuming the child anchor tag holds the title and URL
          const anchor = li.querySelector("a");
          if (anchor) {
            const title = anchor.getAttribute("title");
            const trackId = anchor.getAttribute("href").split("/").pop();
            tracks.push({ title, trackId });
          } else {
            console.log("No anchor tag found in li with class '_nO'");
          }
        }
      });
      // Only execute part2 for the first n-1 iterations
      if (index < pages - 1) {
        const nextPageButton = document.querySelector(
          "li.page-next a.page-link"
        );
        nextPageButton.click();
      }
    }

    return tracks;
  }

  const totalTrackCount = await getTotalTrackCount();
  const pages = Math.ceil(totalTrackCount / 30);
  const tracks = await fetchTracks(pages);
  console.log("raw tracks", tracks);
  return extractTrackUrl(tracks);
}

function decrypt(t) {
  return CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64url.parse(t),
    },
    CryptoJS.enc.Hex.parse("aaad3e4fd540b0f79dca95606e72bf93"),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8);
}

async function fetchAudioUrl(apiUrl) {
  try {
    const data = await fetchUntilSuccess(apiUrl);
    if (data.ret === 1001) {
      throw new Error(
        "Rate limited!!! Wait for a while then download again..."
      );
    }
    const audioQualities = data.trackInfo.playUrlList;
    return audioQualities;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
}

function initializeUI() {
  const progressDisplay = document.createElement("div");
  progressDisplay.style.position = "fixed";
  progressDisplay.style.bottom = "50px";
  progressDisplay.style.right = "10px";
  progressDisplay.style.zIndex = 1000;
  progressDisplay.style.backgroundColor = "white";
  progressDisplay.style.padding = "10px";
  progressDisplay.style.border = "1px solid black";
  progressDisplay.style.display = "none"; // Initially hidden
  document.body.appendChild(progressDisplay);

  // Create a container div
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "10px";
  container.style.right = "10px";
  container.style.zIndex = 1000;
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.backgroundColor = "white";
  container.style.padding = "5px";
  document.body.appendChild(container);

  const button = document.createElement("button");
  button.textContent = "解析ID";
  container.appendChild(button);

  button.addEventListener("click", async function parseIds() {
    progressDisplay.style.display = "block";
    progressDisplay.textContent = "ID解析进行中...";
    const tracks = await getAllTrackIds();
    progressDisplay.textContent = "ID解析完成";
    button.textContent = "解析URL";

    button.removeEventListener("click", parseIds);
    button.addEventListener("click", async function parseUrls() {
      progressDisplay.textContent = "URL解析进行中...";
      // TODO
      let finalDownloadList = [];
      for (let index = 0; index < tracks.length; index++) {
        const t = tracks[index];
        const audioQualities = await fetchAudioUrl(t.url)
        finalDownloadList.push({ title: t.title, audioQualities });
        progressDisplay.textContent = `解析进程: ${index} / ${tracks.length}`;

      }

      console.log("Before set audio quality\n", finalDownloadList);

      if (finalDownloadList.length > 0) {
        progressDisplay.textContent = "URL解析完成。";

        // Create quality selection dropdown
        const qualityLabel = document.createElement("label");
        qualityLabel.htmlFor = "qualitySelect";
        qualityLabel.textContent = "音质: ";
        qualityLabel.style.marginRight = "5px";
        container.appendChild(qualityLabel);

        const qualitySelect = document.createElement("select");
        qualitySelect.id = "qualitySelect";
        qualitySelect.style.marginRight = "30px";

        // Get available quality types from the first item
        const availableQualities = finalDownloadList[0]['audioQualities'];
        availableQualities.forEach((quality, index) => {
          const option = document.createElement("option");
          option.value = index;
          option.textContent = `${quality.type} (${(quality.fileSize / 1024 / 1024).toFixed(2)}MB)`;
          qualitySelect.appendChild(option);
        });

        container.appendChild(qualitySelect);

        // Variable to store selected quality index
        let selectedQualityIndex = 0;
        qualitySelect.addEventListener("change", (e) => {
          selectedQualityIndex = parseInt(e.target.value);
        });
        const selectedQualityType = availableQualities[selectedQualityIndex].type;

        finalDownloadList = finalDownloadList.map((item) => {
          return {
            ...item,
            trueUrl: decrypt(item.audioQualities[selectedQualityIndex].url),
            fileName: `${item.title}.${selectedQualityType.split("_")[0]}`
          };
        });

        console.log("After decrypt url\n", finalDownloadList);

        button.textContent = "下载";
        button.style.marginRight = "30px";

        // Create the checkbox
        const label = document.createElement("label");
        label.htmlFor = "sequenceOrder";
        label.textContent = "加序号: ";
        label.style.marginRight = "5px";
        container.appendChild(label);
        const seqNumberCheckbox = document.createElement("input");
        seqNumberCheckbox.type = "checkbox";
        container.appendChild(seqNumberCheckbox);
        let isSequenceOrder = seqNumberCheckbox.checked;
        seqNumberCheckbox.addEventListener("change", () => {
          isSequenceOrder = seqNumberCheckbox.checked;
        });

        button.removeEventListener("click", parseUrls);
        button.addEventListener("click", function downloadFiles() {
          let count = 0;
          progressDisplay.textContent = `下载进程： ${count} / ${tracks.length}`;
          finalDownloadList.forEach((item, index) => {
            GM_download({
              url: item.trueUrl,
              name: isSequenceOrder
                ? `${index}.${item.fileName}`
                : `${item.fileName}`,
              onerror: function (error) {
                console.error("Error downloading " + item.fileName, error);
              },
              ontimeout: function () {
                console.error("Timeout downloading " + item.fileName);
              },
              onload: function () {
                console.log("Successfully downloaded " + item.fileName);
                count++;
                progressDisplay.textContent = `Downloaded ${count} / ${tracks.length}`;
              },
            });
          });
        });
      } else {
        progressDisplay.textContent = "URL解析失败，请重试";
      }
    });
  });
}

initializeUI();
