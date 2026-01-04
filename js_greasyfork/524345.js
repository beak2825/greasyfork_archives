// ==UserScript==
// @name         Comment Scraper
// @namespace    discord.gg/-----
// @version      2
// @description  MacOS like comment scrape into discord webhook
// @author       Simon (dork)
// @match        https://www.kogama.com/games/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524345/Comment%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/524345/Comment%20Scraper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const MAX_FILE_SIZE = 8 * 1024 * 1024; // 9mb Webhook file limit | DO NOT CHANGE
  let processedRequests = 0;
  let totalPages = 0;
  let isMenuVisible = true;

  const extractGameIdFromUrl = () => {
    const match = window.location.pathname.match(/\/games\/play\/([^/]+)\//);
    return match ? match[1] : null;
  };

  const extractGameTitle = () => {
    const titleElement = document.querySelector("section._10ble h1.game-title");
    return titleElement ? titleElement.textContent.trim() : "Unknown Game";
  };

  const createMenu = () => {
    const style = document.createElement("style");
    style.innerHTML = `
            #u7465 {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 280px;
                background: #fff;
                color: #333;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                z-index: 9999;
                transition: all 0.3s ease;
                display: block;
                padding: 20px;
            }
            #u7465 .top-bar {
                height: 30px;
                background: #f1f1f1;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0 10px;
                cursor: move;
            }
            #u7465 .top-bar .button {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #ff5f57;
                margin-right: 6px;
                cursor: pointer;
            }
            #u7465 .top-bar .minimize {
                background-color: #ffbd2e;
            }
            #u7465 .top-bar .close {
                background-color: #ff5f57;
            }
            #u7465 .top-bar .maximize {
                background-color: #27c93f;
            }
            #u7465 .top-bar .button:hover {
                opacity: 0.7;
            }
            #u7465 h1 {
                font-size: 18px;
                margin: 10px;
                color: #333;
                text-align: center;
                font-weight: 600;
            }
            #u7465 input, #u7465 button {
                width: calc(100% - 20px);
                padding: 10px;
                margin: 8px 0;
                border-radius: 8px;
                border: 1px solid #ddd;
                box-sizing: border-box;
                background-color: #f9f9f9;
                font-size: 14px;
                color: #333;
            }
            #u7465 input:focus, #u7465 button:focus {
                outline: none;
                border-color: #007aff;
            }
            #u7465 button {
                background: linear-gradient(45deg, #ff79c6, #ff9a8b, #9b59b6);
                color: white;
                cursor: pointer;
                transition: transform 0.2s, background-color 0.2s;
                border: none;
            }
            #u7465 button:hover {
                transform: scale(1.05);
                background-color: #d45e9b;
            }
            #u7465 button:active {
                background-color: #c34b7a;
            }
            #u7465 #progress {
                font-size: 14px;
                text-align: center;
                margin-top: 10px;
                color: #555;
            }
        `;
    document.head.appendChild(style);

    const menu = document.createElement("div");
    menu.id = "u7465";
    menu.innerHTML = `
            <div class="top-bar">
                <div class="button close"></div>
                <div class="button minimize"></div>
                <div class="button maximize"></div>
            </div>
            <h1>Comment Scraper</h1>
            <input id="webhook-url" type="text" placeholder="Webhook URL">
            <input id="total-pages" type="number" placeholder="Total Pages">
            <button id="start-button">Start Scraping</button>
            <div id="progress">Progress: 0 / 0</div>
        `;
    document.body.appendChild(menu);

    makeDraggable(menu);

    document.getElementById("total-pages").addEventListener("input", (e) => {
      totalPages = parseInt(e.target.value, 10);
      updateProgress();
    });

    document
      .querySelector(".close")
      .addEventListener("click", () => toggleMenuVisibility(false));
    document
      .querySelector(".minimize")
      .addEventListener("click", () => toggleMenuVisibility(true));
  };

  const toggleMenuVisibility = (isVisible) => {
    const menu = document.getElementById("u7465");
    menu.style.display = isVisible ? "block" : "none";
    isMenuVisible = isVisible;
  };

  const makeDraggable = (element) => {
    let isDragging = false,
      startX,
      startY,
      initialX,
      initialY;
    const topBar = element.querySelector(".top-bar");
    topBar.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = element.offsetLeft;
      initialY = element.offsetTop;
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", onStopDrag);
    });

    const onDrag = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      element.style.left = `${initialX + dx}px`;
      element.style.top = `${initialY + dy}px`;
    };

    const onStopDrag = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", onStopDrag);
    };
  };

  const fetchPage = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      processedRequests++;
      updateProgress();
      return await response.json();
    } else {
      throw new Error(`Failed to fetch ${url}`);
    }
  };

  const sendFileToWebhook = async (webhookUrl, fileData, fileName) => {
    const blob = new Blob([fileData], { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", blob, fileName);

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send file");
    }

    console.log("File sent successfully");
  };

  const formatCommentData = (comment) => {
    const content = JSON.parse(comment._data).data || "No Content";
    const createdAt = new Date(comment.created).toLocaleString();
    return `[${createdAt}] ${comment.profile_username} (${comment.profile_id}): ${content}`;
  };

  const generateMetadata = () => {
    const date = new Date().toLocaleString();
    const gameId = extractGameIdFromUrl();
    return `Date: ${date}\nGame ID: ${gameId}\nTotal Pages: ${totalPages}\n\n▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃\n\n `;
  };

  const updateProgress = () => {
    const progressText = `${processedRequests} / ${totalPages}`;
    document.getElementById(
      "progress"
    ).textContent = `Progress: ${progressText}`;
  };

  const processAllComments = async (webhookUrl) => {
    const fetchPromises = [];
    let currentPage = 1;

    while (currentPage <= totalPages) {
      const pageUrl = `https://www.kogama.com/game/${extractGameIdFromUrl()}/comment/?page=${currentPage}&count=400`;
      fetchPromises.push(fetchPage(pageUrl));
      currentPage++;
    }

    try {
      const allPageResults = await Promise.all(fetchPromises);
      let allComments = [];
      allPageResults.forEach((result) => {
        if (result.data) {
          allComments = allComments.concat(result.data);
        }
      });

      allComments.sort((a, b) => new Date(b.created) - new Date(a.created));

      const formattedData = allComments.map(formatCommentData).join("\n");
      const totalComments = formattedData.split("\n").length;

      let currentFileData = generateMetadata();
      let currentFileSize = 0;
      let fileCount = 1;
      a;

      let fileDataBuffer = currentFileData + formattedData;

      if (new Blob([fileDataBuffer]).size > MAX_FILE_SIZE) {
        const gameTitle = extractGameTitle().replace(/[\/\\?%*:|"<>]/g, "_");
        await sendFileToWebhook(
          webhookUrl,
          fileDataBuffer,
          `${gameTitle}_comments_${fileCount}.txt`
        );
        fileCount++;
        fileDataBuffer = formattedData;
      }

      if (fileDataBuffer) {
        const gameTitle = extractGameTitle().replace(/[\/\\?%*:|"<>]/g, "_");
        await sendFileToWebhook(
          webhookUrl,
          fileDataBuffer,
          `${gameTitle}_comments_${fileCount}.txt`
        );
      }

      console.log("All comments processed and files sent!");
    } catch (err) {
      console.error("Error processing comments:", err);
    }
  };

  const startProcess = async () => {
    const webhookUrl = document.getElementById("webhook-url").value;

    if (!webhookUrl || isNaN(totalPages) || totalPages <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }

    processedRequests = 0;
    updateProgress();

    await processAllComments(webhookUrl);
  };

  createMenu();
  document
    .getElementById("start-button")
    .addEventListener("click", startProcess);
})();
