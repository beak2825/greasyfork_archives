// ==UserScript==
// @name         Douyin User Video Downloader
// @namespace    https://github.com/CaoCuong2404
// @version      1.6
// @description  Extract video links and metadata from Douyin user profiles
// @author       CaoCuong2404
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528620/Douyin%20User%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/528620/Douyin%20User%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add Tailwind CSS
  const tailwindCDN = document.createElement("script");
  tailwindCDN.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(tailwindCDN);

  // Global state
  const state = {
    videos: [],
    selectedVideos: new Set(),
    isFetching: false,
    fetchedCount: 0,
    totalFound: 0,
    isDialogOpen: false,
  };

  function createMainUI() {
    // Create backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden";
    backdrop.id = "douyin-downloader-backdrop";

    // Create dialog container
    const container = document.createElement("div");
    container.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] bg-white rounded-lg shadow-xl z-[10000] hidden";
    container.id = "douyin-downloader";

    container.innerHTML = `
      <div class="flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center space-x-2">
            <img src="https://www.douyin.com/favicon.ico" class="w-6 h-6" alt="Douyin">
            <h2 class="text-xl font-bold text-gray-800">Douyin Downloader</h2>
          </div>
          <button id="close-dialog" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 flex-1 overflow-hidden flex flex-col min-h-[500px]">
          <div id="fetch-status" class="text-sm text-gray-500 mb-4"></div>

          <div class="border rounded-lg flex-1 flex flex-col overflow-hidden">
            <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="select-all" class="rounded text-[#FE2C55]">
                  <label for="select-all" class="text-sm font-medium text-gray-700">
                    Select All (<span id="selected-count">0</span>/<span id="total-count">0</span>)
                  </label>
                </div>
                
                <div class="h-4 border-l border-gray-300"></div>
                
                <div class="flex items-center space-x-2" id="action-buttons">
                  <div class="relative inline-block text-left" id="download-dropdown">
                    <button disabled id="download-btn" class="px-3 py-1.5 text-sm font-medium text-white bg-[#FE2C55] rounded-md shadow-sm hover:bg-[#fe2c55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE2C55] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
                      Download
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div class="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" id="dropdown-menu">
                      <div class="py-1">
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-action="audio">
                          Download Audios (MP3)
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-action="video">
                          Download Videos (MP4)
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-action="json">
                          Download Metadata (JSON)
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-action="txt">
                          Download Links (TXT)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button id="fetch-videos" class="px-3 py-1.5 text-sm font-medium text-white bg-[#FE2C55] rounded-md shadow-sm hover:bg-[#fe2c55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE2C55] inline-flex items-center">
                <span>Fetch Videos</span>
              </button>
            </div>
            
            <div class="overflow-auto flex-1">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" class="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th scope="col" class="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th scope="col" class="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cover
                    </th>
                    <th scope="col" class="w-[300px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" class="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody id="videos-table-body" class="bg-white divide-y divide-gray-200">
                  <!-- Videos will be inserted here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(container);

    return { backdrop, container };
  }

  async function addDownloadButton() {
    try {
      // Wait initial 2s for UI to stabilize and translations to complete
      await sleep(2000);

      // Try to find the element multiple times
      let attempts = 3;
      let tabCountElement = null;

      while (attempts > 0 && !tabCountElement) {
        try {
          tabCountElement = await waitForElement('[data-e2e="user-tab-count"]', 10000); // 10s timeout per attempt
          break;
        } catch (err) {
          attempts--;
          if (attempts > 0) {
            console.log("Retrying to find tab count element...");
            // Wait between attempts
            await sleep(1000);
          } else {
            throw new Error(
              "Could not find video count element after multiple attempts. This could be due to UI changes or page translation.",
            );
          }
        }
      }

      // Extra check for parent element stability
      const parentElement = tabCountElement.parentNode;
      if (!parentElement || !parentElement.isConnected) {
        throw new Error("Parent element of video count is not stable");
      }

      const downloadButton = document.createElement("button");
      downloadButton.className = "ml-2 text-[#FE2C55] hover:text-[#fe2c55]/90 transition-colors";
      downloadButton.innerHTML = `
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      `;
      downloadButton.title = "Download all videos";

      // Insert after the count with stability check
      if (tabCountElement.nextSibling) {
        parentElement.insertBefore(downloadButton, tabCountElement.nextSibling);
      } else {
        parentElement.appendChild(downloadButton);
      }

      // Add click handler
      downloadButton.addEventListener("click", showDialog);

      // Monitor for potential DOM changes that could affect the button
      const observer = new MutationObserver((mutations) => {
        if (!downloadButton.isConnected) {
          // Button was removed, try to re-add it
          if (tabCountElement.isConnected) {
            if (tabCountElement.nextSibling) {
              parentElement.insertBefore(downloadButton, tabCountElement.nextSibling);
            } else {
              parentElement.appendChild(downloadButton);
            }
          }
        }
      });

      observer.observe(parentElement, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error("Failed to add download button:", error);
    }
  }

  function showDialog() {
    const backdrop = document.getElementById("douyin-downloader-backdrop");
    const dialog = document.getElementById("douyin-downloader");

    backdrop.classList.remove("hidden");
    dialog.classList.remove("hidden");

    // Add animation classes
    dialog.classList.add("animate-fade-in");
    backdrop.classList.add("animate-fade-in");

    state.isDialogOpen = true;
  }

  function hideDialog() {
    const backdrop = document.getElementById("douyin-downloader-backdrop");
    const dialog = document.getElementById("douyin-downloader");

    backdrop.classList.add("hidden");
    dialog.classList.add("hidden");

    state.isDialogOpen = false;
  }

  function setupDialogEventListeners() {
    // Close button
    document.getElementById("close-dialog")?.addEventListener("click", hideDialog);

    // Close on backdrop click
    document.getElementById("douyin-downloader-backdrop")?.addEventListener("click", hideDialog);

    // Prevent dialog close when clicking inside
    document.getElementById("douyin-downloader")?.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.isDialogOpen) {
        hideDialog();
      }
    });
  }

  function createVideoRow(video, index) {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";

    const date = new Date(video.createTime);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    row.innerHTML = `
      <td class="px-4 py-4 whitespace-nowrap">
        <input type="checkbox" data-video-id="${video.id}" class="video-checkbox rounded text-[#FE2C55]">
      </td>
      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        ${index + 1}
      </td>
      <td class="px-4 py-4 whitespace-nowrap">
        <div class="w-12 h-12 rounded-lg overflow-hidden">
          <img src="${video.dynamicCoverUrl || video.coverUrl}" class="w-full h-full object-cover" alt="${video.title}">
        </div>
      </td>
      <td class="px-4 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 font-medium truncate max-w-[300px]" title="${video.title}">
          ${video.title}
        </div>
      </td>
      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formattedDate}
      </td>
      <td class="px-4 py-4 whitespace-nowrap text-sm">
        <div class="flex items-center space-x-2">
          <a href="${video.videoUrl}" target="_blank" class="text-[#FE2C55] hover:text-[#fe2c55]/90">
            Video
          </a>
          ${
            video.audioUrl
              ? `
            <span class="text-gray-300">|</span>
            <a href="${video.audioUrl}" target="_blank" class="text-[#FE2C55] hover:text-[#fe2c55]/90">
              Audio
            </a>
          `
              : ""
          }
        </div>
      </td>
    `;

    return row;
  }

  function updateUI() {
    const selectedCount = state.selectedVideos.size;
    const totalCount = state.videos.length;

    // Update counts
    document.getElementById("selected-count").textContent = selectedCount;
    document.getElementById("total-count").textContent = totalCount;

    // Update select all checkbox
    const selectAllCheckbox = document.getElementById("select-all");
    selectAllCheckbox.checked = selectedCount === totalCount && totalCount > 0;

    // Update download button
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.disabled = selectedCount === 0;
  }

  function setupEventListeners() {
    // Fetch videos button
    document.getElementById("fetch-videos").addEventListener("click", async () => {
      if (state.isFetching) return;

      state.isFetching = true;
      state.fetchedCount = 0;
      state.videos = [];
      state.selectedVideos.clear();

      const button = document.getElementById("fetch-videos");
      const statusEl = document.getElementById("fetch-status");
      const tableBody = document.getElementById("videos-table-body");
      tableBody.innerHTML = "";

      button.disabled = true;
      button.innerHTML = `
        <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Fetching...
      `;

      try {
        const downloader = new DouyinDownloader();
        await downloader.fetchAllVideos((newVideos) => {
          // Sort new videos by date (latest first)
          newVideos.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

          // Add new videos to state
          state.videos.push(...newVideos);
          state.fetchedCount += newVideos.length;

          // Update table
          state.videos.forEach((video, index) => {
            const existingRow = document.querySelector(`[data-video-id="${video.id}"]`)?.closest("tr");
            if (!existingRow) {
              tableBody.appendChild(createVideoRow(video, index));
            }
          });

          // Update status
          statusEl.textContent = `Fetched ${state.fetchedCount} videos`;
          updateUI();
        });

        setupTableEventListeners();
      } catch (error) {
        console.error("Error fetching videos:", error);
        statusEl.textContent = "Error: " + error.message;
      } finally {
        state.isFetching = false;
        button.disabled = false;
        button.innerHTML = "<span>Fetch Videos</span>";
      }
    });

    // Download dropdown
    const downloadBtn = document.getElementById("download-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    downloadBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!downloadBtn.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });

    // Download actions
    dropdownMenu.addEventListener("click", async (e) => {
      const action = e.target.dataset.action;
      if (!action) return;

      const selectedVideos = state.videos.filter((v) => state.selectedVideos.has(v.id));
      if (selectedVideos.length === 0) return;

      // Hide dropdown
      dropdownMenu.classList.add("hidden");

      switch (action) {
        case "audio":
          await downloadFiles(selectedVideos, "audio");
          break;
        case "video":
          await downloadFiles(selectedVideos, "video");
          break;
        case "json":
          FileHandler.saveVideoUrls(selectedVideos, { downloadJson: true, downloadTxt: false });
          break;
        case "txt":
          FileHandler.saveVideoUrls(selectedVideos, { downloadJson: false, downloadTxt: true });
          break;
      }
    });
  }

  function setupTableEventListeners() {
    // Select all checkbox
    document.getElementById("select-all").addEventListener("change", (e) => {
      const checkboxes = document.querySelectorAll(".video-checkbox");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
        const videoId = checkbox.dataset.videoId;
        if (e.target.checked) {
          state.selectedVideos.add(videoId);
        } else {
          state.selectedVideos.delete(videoId);
        }
      });
      updateUI();
    });

    // Individual video checkboxes
    document.querySelectorAll(".video-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const videoId = e.target.dataset.videoId;
        if (e.target.checked) {
          state.selectedVideos.add(videoId);
        } else {
          state.selectedVideos.delete(videoId);
        }
        updateUI();
      });
    });
  }

  // Configuration
  const CONFIG = {
    API_BASE_URL: "https://www.douyin.com/aweme/v1/web/aweme/post/",
    DEFAULT_HEADERS: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi",
      "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="118", "Microsoft Edge";v="118"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0",
    },
    RETRY_DELAY_MS: 2000,
    MAX_RETRIES: 5,
    REQUEST_DELAY_MS: 1000,
  };

  // Utility functions
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForElement = (selector, timeout = 30000, interval = 100) => {
    return new Promise((resolve, reject) => {
      // Check if element already exists
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      // Set up the timeout
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        clearInterval(checkInterval);
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);

      // Set up the mutation observer
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          resolve(element);
        }
      });

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Also poll periodically as a backup
      const checkInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          resolve(element);
        }
      }, interval);
    });
  };

  const retryWithDelay = async (fn, retries = CONFIG.MAX_RETRIES) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${i + 1} failed:`, error);
        await sleep(CONFIG.RETRY_DELAY_MS);
      }
    }
    throw lastError;
  };

  // API Client
  class DouyinApiClient {
    constructor(secUserId) {
      this.secUserId = secUserId;
    }

    async fetchVideos(maxCursor) {
      const url = new URL(CONFIG.API_BASE_URL);
      const params = {
        device_platform: "webapp",
        aid: "6383",
        channel: "channel_pc_web",
        sec_user_id: this.secUserId,
        max_cursor: maxCursor,
        count: "20",
        version_code: "170400",
        version_name: "17.4.0",
      };

      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

      const response = await fetch(url, {
        headers: {
          ...CONFIG.DEFAULT_HEADERS,
          referrer: `https://www.douyin.com/user/${this.secUserId}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return response.json();
    }
  }

  // Data Processing
  class VideoDataProcessor {
    static extractVideoMetadata(video) {
      if (!video) return null;

      // Initialize the metadata object
      const metadata = {
        id: video.aweme_id || "",
        desc: video.desc || "",
        title: video.desc || "", // Using desc as the title since title field isn't directly available
        createTime: video.create_time ? new Date(video.create_time * 1000).toISOString() : "",
        videoUrl: "",
        audioUrl: "",
        coverUrl: "",
        dynamicCoverUrl: "",
      };

      // Extract video URL
      if (video.video?.play_addr) {
        metadata.videoUrl = video.video.play_addr.url_list[0];
        if (metadata.videoUrl && !metadata.videoUrl.startsWith("https")) {
          metadata.videoUrl = metadata.videoUrl.replace("http", "https");
        }
      } else if (video.video?.download_addr) {
        metadata.videoUrl = video.video.download_addr.url_list[0];
        if (metadata.videoUrl && !metadata.videoUrl.startsWith("https")) {
          metadata.videoUrl = metadata.videoUrl.replace("http", "https");
        }
      }

      // Extract audio URL
      if (video.music?.play_url) {
        metadata.audioUrl = video.music.play_url.url_list[0];
      }

      // Extract cover URL (static thumbnail)
      if (video.video?.cover) {
        metadata.coverUrl = video.video.cover.url_list[0];
      } else if (video.cover) {
        metadata.coverUrl = video.cover.url_list[0];
      }

      // Extract dynamic cover URL (animated thumbnail)
      if (video.video?.dynamic_cover) {
        metadata.dynamicCoverUrl = video.video.dynamic_cover.url_list[0];
      } else if (video.dynamic_cover) {
        metadata.dynamicCoverUrl = video.dynamic_cover.url_list[0];
      }

      return metadata;
    }

    static processVideoData(data) {
      if (!data?.aweme_list) {
        return { videoData: [], hasMore: false, maxCursor: 0 };
      }

      const videoData = data.aweme_list.map((video) => this.extractVideoMetadata(video)).filter((item) => item && item.videoUrl);

      return {
        videoData,
        hasMore: data.has_more,
        maxCursor: data.max_cursor,
      };
    }
  }

  // File Handler
  class FileHandler {
    static saveVideoUrls(videoData, options = { downloadJson: true, downloadTxt: true }) {
      if (!videoData || videoData.length === 0) {
        console.warn("No video data to save");
        return { savedCount: 0 };
      }

      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      let savedCount = 0;

      // Save complete JSON data if option is enabled
      if (options.downloadJson) {
        const jsonContent = JSON.stringify(videoData, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: "application/json" });
        const jsonUrl = URL.createObjectURL(jsonBlob);

        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = `douyin-video-data-${timestamp}.json`;
        jsonLink.style.display = "none";
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);

        console.log(`Saved ${videoData.length} videos with metadata to JSON file`);
      }

      // Save plain URLs list if option is enabled
      if (options.downloadTxt) {
        // Create a list of video URLs
        const urlList = videoData.map((video) => video.videoUrl).join("\n");
        const txtBlob = new Blob([urlList], { type: "text/plain" });
        const txtUrl = URL.createObjectURL(txtBlob);

        const txtLink = document.createElement("a");
        txtLink.href = txtUrl;
        txtLink.download = `douyin-video-links-${timestamp}.txt`;
        txtLink.style.display = "none";
        document.body.appendChild(txtLink);
        txtLink.click();
        document.body.removeChild(txtLink);

        console.log(`Saved ${videoData.length} video URLs to text file`);
      }

      savedCount = videoData.length;
      return { savedCount };
    }
  }

  // Main Downloader
  class DouyinDownloader {
    constructor() {
      this.validateEnvironment();
      const secUserId = this.extractSecUserId();
      this.apiClient = new DouyinApiClient(secUserId);
    }

    validateEnvironment() {
      if (typeof window === "undefined" || !window.location) {
        throw new Error("Script must be run in a browser environment");
      }
    }

    extractSecUserId() {
      const secUserId = location.pathname.replace("/user/", "");
      if (!secUserId || location.pathname.indexOf("/user/") === -1) {
        throw new Error("Please run this script on a DouYin user profile page!");
      }
      return secUserId;
    }

    async fetchAllVideos(onProgress) {
      let hasMore = true;
      let maxCursor = 0;

      while (hasMore) {
        const data = await retryWithDelay(() => this.apiClient.fetchVideos(maxCursor));
        const { videoData, hasMore: more, maxCursor: newCursor } = VideoDataProcessor.processVideoData(data);

        if (onProgress) {
          onProgress(videoData);
        }

        hasMore = more;
        maxCursor = newCursor;
        await sleep(CONFIG.REQUEST_DELAY_MS);
      }
    }
  }

  // Initialize the UI
  async function initializeUI() {
    // Add custom styles for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out;
      }
    `;
    document.head.appendChild(style);

    // Create UI elements (hidden initially)
    createMainUI();

    // Add download button to profile
    await addDownloadButton();

    // Setup all event listeners
    setupEventListeners();
    setupTableEventListeners();
    setupDialogEventListeners();
  }

  // Start the script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeUI().catch((error) => {
        console.error("Failed to initialize UI:", error);
      });
    });
  } else {
    initializeUI().catch((error) => {
      console.error("Failed to initialize UI:", error);
    });
  }

  async function downloadFile(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      return true;
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error);
      return false;
    }
  }

  async function downloadFiles(files, type = "video") {
    const statusEl = document.getElementById("fetch-status");
    const total = files.length;
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = type === "video" ? file.videoUrl : file.audioUrl;
      if (!url) {
        failed++;
        continue;
      }

      // Update status
      statusEl.textContent = `Downloading ${type} ${i + 1}/${total}...`;

      // Generate filename
      const timestamp = new Date(file.createTime).toISOString().split("T")[0];
      const filename = `douyin_${type}_${timestamp}_${file.id}.${type === "video" ? "mp4" : "mp3"}`;

      // Download file
      const success = await downloadFile(url, filename);
      if (success) {
        successful++;
      } else {
        failed++;
      }

      // Small delay between downloads to prevent browser blocking
      await sleep(500);
    }

    // Final status update
    statusEl.textContent = `Download complete: ${successful} successful, ${failed} failed`;
    setTimeout(() => {
      statusEl.textContent = "";
    }, 5000);
  }
})();
