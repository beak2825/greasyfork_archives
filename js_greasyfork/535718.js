// ==UserScript==
// @name         Anh Hoàng Douyin
// @namespace    https://github.com/bleach929
// @version      1.1
// @description  Extract and download Douyin user videos with date filters, caching, parallel fetching, custom file naming, download history, pagination, customizable videos per page, mobile optimization, single video download, download status filter, and confirmation dialogs
// @author       bleach929
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535718/Anh%20Ho%C3%A0ng%20Douyin.user.js
// @updateURL https://update.greasyfork.org/scripts/535718/Anh%20Ho%C3%A0ng%20Douyin.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Thêm Tailwind CSS
  const tailwindCDN = document.createElement("script");
  tailwindCDN.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(tailwindCDN);

  // Thêm JSZip
  const jszipScript = document.createElement("script");
  jszipScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
  document.head.appendChild(jszipScript);

  // Thêm Google Fonts (Inter)
  const googleFonts = document.createElement("link");
  googleFonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  googleFonts.rel = "stylesheet";
  document.head.appendChild(googleFonts);

  // Trạng thái toàn cục
  const state = {
    videos: [],
    filteredVideos: [],
    selectedVideos: new Set(),
    isFetching: false,
    isDownloading: false,
    fetchedCount: 0,
    totalFound: 0,
    isDialogOpen: false,
    downloadProgress: 0,
    channelName: "unknown",
    currentPage: 1,
    videosPerPage: 50,
    videosToDownload: 0,
    downloadHistory: JSON.parse(localStorage.getItem("douyin_download_history") || "{}"),
    enableCache: true,
    filter: {
      startDate: null,
      endDate: null,
      downloadStatus: "all",
    },
  };

  // Cấu hình
  const CONFIG = {
    API_BASE_URL: "https://www.douyin.com/aweme/v1/web/aweme/post/",
    API_WATERMARKLESS: "https://api16-normal-c-useast1a.tiktokcdn.com/aweme/v1/play/",
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
    REQUEST_DELAY_MS: 500,
    MAX_CONCURRENT_REQUESTS: 3,
    BATCH_SIZE: 5,
    MAX_CACHE_SIZE: 4 * 1024 * 1024,
  };

  // Hàm tiện ích
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForElement = (selector, timeout = 5000, interval = 100) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const timeoutId = setTimeout(() => {
        observer.disconnect();
        clearInterval(checkInterval);
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

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
        if (error.message.includes("429")) {
          const delay = CONFIG.RETRY_DELAY_MS * Math.pow(2, i);
          console.warn(`Rate limit reached. Waiting ${delay}ms...`);
          document.getElementById("fetch-status").textContent = `Giới hạn tốc độ. Thử lại sau ${delay/1000}s...`;
          await sleep(delay);
        } else {
          await sleep(CONFIG.RETRY_DELAY_MS);
        }
      }
    }
    document.getElementById("fetch-status").textContent = `Lỗi: ${lastError.message}`;
    throw lastError;
  };

  // Lấy tên từ dòng chứa "抖音号："
  function getChannelName() {
    try {
      const spans = document.querySelectorAll("span");
      let nickname = null;

      for (const span of spans) {
        const textContent = span.textContent;
        if (textContent.includes("抖音号：")) {
          console.log(`Đã tìm thấy "抖音号：" trong span:`, textContent);
          const parts = textContent.split("抖音号：");
          if (parts.length > 1) {
            nickname = parts[1].trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
            console.log(`Nickname tìm thấy: ${nickname}`);
            return nickname || "unknown";
          }
        }
      }

      console.log("Không tìm thấy '抖音号：', chuyển sang lấy tên dự phòng...");
      const fallbackElement = document.querySelector('[data-e2e="user-nickname"]') || 
                             document.querySelector('[data-e2e="user-title"]') || 
                             document.querySelector('h1');
      if (fallbackElement) {
        const fallbackName = fallbackElement.textContent.trim().replace(/\s+/g, "_").replace(/[^a-zAZ0-9_]/g, "");
        console.log("Lấy tên dự phòng từ fallback element:", fallbackName);
        return fallbackName || "unknown";
      }

      console.log("Không tìm thấy tên dự phòng, lấy từ document.title...");
      const titleName = document.title.split(" ")[0].trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      return titleName || "unknown";
    } catch (error) {
      console.error("Lỗi khi lấy tên kênh:", error);
      return "unknown";
    }
  }

  // Quan sát sự thay đổi để cập nhật channelName
  function observeChannelName() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newName = getChannelName();
          if (newName !== state.channelName && newName !== "unknown") {
            console.log(`Cập nhật channelName từ ${state.channelName} sang ${newName}`);
            state.channelName = newName;
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => observer.disconnect(), 10000);
  }

  // Quản lý lịch sử tải
  function saveDownloadHistory(videoId, type) {
    state.downloadHistory[videoId] = {
      type,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("douyin_download_history", JSON.stringify(state.downloadHistory));
  }

  function isVideoDownloaded(videoId, type) {
    const history = state.downloadHistory[videoId];
    return history && history.type === type;
  }

  // Hiển thị hộp thoại xác nhận
  function showConfirmDialog(message, onConfirm) {
    const dialog = document.createElement("div");
    dialog.className = "fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-[10001] flex items-center justify-center";
    dialog.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 font-inter">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">${message}</h3>
        <div class="flex justify-end space-x-3">
          <button id="cancel-confirm" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Hủy</button>
          <button id="confirm-action" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all">Xác nhận</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    document.getElementById("cancel-confirm").addEventListener("click", () => {
      document.body.removeChild(dialog);
    });

    document.getElementById("confirm-action").addEventListener("click", () => {
      onConfirm();
      document.body.removeChild(dialog);
    });
  }

  function clearCache() {
    showConfirmDialog("Bạn có chắc muốn xóa cache? Hành động này không thể hoàn tác.", () => {
      localStorage.removeItem(new DouyinDownloader().cacheKey);
      state.videos = [];
      state.filteredVideos = [];
      state.selectedVideos.clear();
      state.currentPage = 1;
      updateVideoTable();
      document.getElementById("fetch-status").textContent = "Đã xóa cache.";
    });
  }

  function clearDownloadHistory() {
    showConfirmDialog("Bạn có chắc muốn xóa lịch sử tải? Hành động này không thể hoàn tác.", () => {
      state.downloadHistory = {};
      localStorage.removeItem("douyin_download_history");
      updateVideoTable();
      document.getElementById("fetch-status").textContent = "Đã xóa lịch sử tải.";
    });
  }

  // Tạo giao diện chính
  function createMainUI() {
    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-[9999] hidden";
    backdrop.id = "douyin-downloader-backdrop";

    const container = document.createElement("div");
    container.className =
      "fixed top-4 sm:top-1/2 left-1/2 transform sm:-translate-x-1/2 sm:-translate-y-1/2 w-full max-w-[95%] sm:max-w-4xl bg-white dark:bg-gray-900 dark:text-white rounded-xl shadow-2xl z-[10000] hidden font-inter";
    container.id = "douyin-downloader";

    container.innerHTML = `
      <div class="flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <img src="https://www.douyin.com/favicon.ico" class="w-6 h-6 sm:w-8 sm:h-8" alt="Douyin">
            <h2 class="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white">Douyin Downloader</h2>
          </div>
          <button id="close-dialog" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 sm:p-6 flex-1 overflow-hidden flex flex-col gap-4 sm:gap-6">
          <!-- Status -->
          <div id="fetch-status" class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium"></div>

          <!-- Filters -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Ngày bắt đầu:</label>
              <input type="date" id="start-date-filter" class="w-32 sm:w-36 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all">
            </div>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Ngày kết thúc:</label>
              <input type="date" id="end-date-filter" class="w-32 sm:w-36 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all">
            </div>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Video mỗi trang:</label>
              <input type="number" id="videos-per-page" class="w-20 sm:w-24 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all" value="50" min="10" max="500">
            </div>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Số video cần tải:</label>
              <input type="number" id="videos-to-download" class="w-20 sm:w-24 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all" value="0" min="0">
            </div>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái tải:</label>
              <select id="download-status-filter" class="w-32 sm:w-36 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all">
                <option value="all">Tất cả</option>
                <option value="not-downloaded">Chưa tải</option>
                <option value="downloaded-video">Đã tải video</option>
              </select>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <button id="apply-filter" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-md hover:from-pink-600 hover:to-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all">Áp dụng</button>
            <button id="clear-cache" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Xóa Cache</button>
            <button id="select-new-videos" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Chọn video chưa tải</button>
            <button id="clear-history" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Xóa lịch sử tải</button>
          </div>

          <!-- Progress Bar -->
          <div class="hidden" id="download-progress-container">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
              <div id="download-progress-bar" class="bg-gradient-to-r from-pink-500 to-pink-600 h-2 sm:h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2" id="download-progress-text">0%</div>
          </div>

          <!-- Table -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-xl flex-1 flex flex-col overflow-hidden">
            <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div class="flex items-center space-x-2 sm:space-x-4">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="select-all" class="rounded text-pink-600 focus:ring-pink-500">
                  <label for="select-all" class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300" title="Chỉ chọn video trên trang hiện tại">
                    Chọn tất cả trên trang (<span id="selected-count">0</span>/<span id="total-count">0</span>)
                  </label>
                </div>
                <div class="h-4 border-l border-gray-300 dark:border-gray-600 hidden sm:block"></div>
                <div class="relative inline-block text-left" id="download-dropdown">
                  <button disabled id="download-btn" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-md hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center transition-all">
                    Tải xuống
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div class="hidden absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50" id="dropdown-menu">
                    <div class="py-1">
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" data-action="video">Tải Video (MP4)</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" data-action="txt">Tải Links (TXT)</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" data-action="force-download">Tải Lại (Bỏ qua lịch sử)</button>
                    </div>
                  </div>
                </div>
              </div>
              <button id="fetch-videos" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-md hover:from-pink-600 hover:to-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 inline-flex items-center transition-all">
                <span>Lấy Videos</span>
              </button>
            </div>
            <div class="overflow-x-auto flex-1">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th scope="col" class="w-12 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chọn</th>
                    <th scope="col" class="w-16 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT</th>
                    <th scope="col" class="w-16 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ảnh bìa</th>
                    <th scope="col" class="w-[200px] sm:w-[300px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tiêu đề</th>
                    <th scope="col" class="w-24 sm:w-32 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày</th>
                    <th scope="col" class="w-20 sm:w-24 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody id="videos-table-body" class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"></tbody>
              </table>
            </div>
            <!-- Pagination -->
            <div class="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <button id="prev-page" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Trang trước
              </button>
              <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Trang <span id="current-page">1</span> / <span id="total-pages">1</span>
              </div>
              <button id="next-page" class="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(container);

    return { backdrop, container };
  }

  // Thêm nút tải xuống vào hồ sơ
  async function addDownloadButton() {
    try {
      await sleep(1000);
      const selectorsToTry = [
        '[data-e2e="user-tab-count"]',
        '[data-e2e="user-post-count"]',
        '[data-e2e="user-profile-stats"]',
        '[data-e2e="user-info"]',
        '.user-profile-tab-count',
        '.stats-container',
        '.user-info-container',
        '[data-e2e="user-bio"]',
        '.user-container',
      ];

      let tabCountElement = null;
      for (const selector of selectorsToTry) {
        console.log(`Trying selector: ${selector}`);
        try {
          tabCountElement = await waitForElement(selector, 5000);
          console.log(`Found element with selector: ${selector}`);
          break;
        } catch (err) {
          console.warn(`Selector ${selector} not found:`, err.message);
        }
      }

      if (!tabCountElement) {
        console.error("Không tìm thấy phần tử để gắn nút Download sau khi thử tất cả selector.");
        alert("Không thể tìm thấy vị trí để thêm nút Download. Cấu trúc trang có thể đã thay đổi. Vui lòng kiểm tra và thử lại.");
        throw new Error("Không tìm thấy phần tử để gắn nút Download.");
      }

      const parentElement = tabCountElement.parentNode;
      if (!parentElement || !parentElement.isConnected) {
        throw new Error("Phần tử cha không ổn định.");
      }

      const downloadButton = document.createElement("button");
      downloadButton.className = "ml-2 text-pink-600 hover:text-pink-700 transition-colors";
      downloadButton.innerHTML = `
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      `;
      downloadButton.title = "Tải tất cả video";

      if (tabCountElement.nextSibling) {
        parentElement.insertBefore(downloadButton, tabCountElement.nextSibling);
      } else {
        parentElement.appendChild(downloadButton);
      }

      downloadButton.addEventListener("click", showDialog);

      const observer = new MutationObserver(() => {
        if (!downloadButton.isConnected && tabCountElement.isConnected) {
          if (tabCountElement.nextSibling) {
            parentElement.insertBefore(downloadButton, tabCountElement.nextSibling);
          } else {
            parentElement.appendChild(downloadButton);
          }
        }
      });

      observer.observe(parentElement, { childList: true, subtree: true });
    } catch (error) {
      console.error("Không thể thêm nút tải:", error);
      alert("Khởi tạo Douyin Downloader thất bại. Vui lòng kiểm tra trang hồ sơ và thử lại.");
    }
  }

  // Hiển thị/Ẩn dialog
  function showDialog() {
    const backdrop = document.getElementById("douyin-downloader-backdrop");
    const dialog = document.getElementById("douyin-downloader");

    backdrop.classList.remove("hidden");
    dialog.classList.remove("hidden");

    dialog.classList.add("animate-fade-in");
    backdrop.classList.add("animate-fade-in");

    state.isDialogOpen = true;
    state.channelName = getChannelName();
  }

  function hideDialog() {
    const backdrop = document.getElementById("douyin-downloader-backdrop");
    const dialog = document.getElementById("douyin-downloader");

    backdrop.classList.add("hidden");
    dialog.classList.add("hidden");

    state.isDialogOpen = false;
  }

  // Thiết lập sự kiện dialog
  function setupDialogEventListeners() {
    document.getElementById("close-dialog")?.addEventListener("click", hideDialog);
    document.getElementById("douyin-downloader-backdrop")?.addEventListener("click", hideDialog);
    document.getElementById("douyin-downloader")?.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.isDialogOpen) {
        hideDialog();
      }
    });

    document.getElementById("apply-filter")?.addEventListener("click", applyFilter);
    document.getElementById("clear-cache")?.addEventListener("click", clearCache);
    document.getElementById("clear-history")?.addEventListener("click", clearDownloadHistory);
    document.getElementById("select-new-videos")?.addEventListener("click", () => {
      const videosToDisplay = state.filteredVideos.length ? state.filteredVideos : state.videos;
      state.selectedVideos.clear();
      videosToDisplay.forEach((v) => {
        const downloaded = isVideoDownloaded(v.id, "video") || isVideoDownloaded(v.id, "video-nowatermark");
        if (!downloaded) {
          state.selectedVideos.add(v.id);
        }
      });
      updateVideoTable();
    });

    if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  }

  // Áp dụng bộ lọc
  function applyFilter() {
    const startDateInput = document.getElementById("start-date-filter");
    const endDateInput = document.getElementById("end-date-filter");
    const videosPerPageInput = document.getElementById("videos-per-page");
    const videosToDownloadInput = document.getElementById("videos-to-download");
    const downloadStatusFilter = document.getElementById("download-status-filter");

    // Cập nhật bộ lọc
    state.filter.startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    state.filter.endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    state.filter.downloadStatus = downloadStatusFilter.value;

    // Cập nhật số video mỗi trang và đặt lại về trang 1 để đảm bảo bảng hiển thị đúng
    const videosPerPage = parseInt(videosPerPageInput.value);
    if (isNaN(videosPerPage) || videosPerPage < 10 || videosPerPage > 500) {
      videosPerPageInput.value = state.videosPerPage;
      document.getElementById("fetch-status").textContent = "Số video mỗi trang phải từ 10 đến 500.";
      setTimeout(() => {
        document.getElementById("fetch-status").textContent = "";
      }, 3000);
      return;
    }
    if (state.videosPerPage !== videosPerPage) {
      state.videosPerPage = videosPerPage;
      state.currentPage = 1; // Đặt lại về trang 1 khi thay đổi videosPerPage
    }

    // Cập nhật số video cần tải
    const videosToDownload = parseInt(videosToDownloadInput.value);
    if (isNaN(videosToDownload) || videosToDownload < 0 || videosToDownload > state.videos.length) {
      videosToDownloadInput.value = state.videosToDownload;
      document.getElementById("fetch-status").textContent = `Số video cần tải phải từ 0 đến ${state.videos.length}.`;
      setTimeout(() => {
        document.getElementById("fetch-status").textContent = "";
      }, 3000);
      return;
    }
    state.videosToDownload = videosToDownload;

    // Lọc video theo ngày và trạng thái tải
    let filtered = state.videos.filter((video) => {
      let passesFilter = true;
      const videoDate = new Date(video.createTime);
      if (state.filter.startDate) {
        passesFilter = passesFilter && videoDate >= state.filter.startDate;
      }
      if (state.filter.endDate) {
        passesFilter = passesFilter && videoDate <= state.filter.endDate;
      }
      if (state.filter.downloadStatus !== "all") {
        const isVideoDownloadedStatus = isVideoDownloaded(video.id, "video") || isVideoDownloaded(video.id, "video-nowatermark");
        if (state.filter.downloadStatus === "not-downloaded") {
          passesFilter = passesFilter && !isVideoDownloadedStatus;
        } else if (state.filter.downloadStatus === "downloaded-video") {
          passesFilter = passesFilter && isVideoDownloadedStatus;
        }
      }
      return passesFilter;
    });

    // Giới hạn số video cần tải
    if (state.videosToDownload > 0) {
      filtered = filtered.slice(0, state.videosToDownload);
    }

    state.filteredVideos = filtered;

    // Tự động chọn tất cả video trong danh sách đã lọc
    state.selectedVideos.clear();
    state.filteredVideos.forEach((video) => {
      state.selectedVideos.add(video.id);
    });

    // Điều chỉnh currentPage để phù hợp với videosPerPage mới
    const totalPages = Math.ceil(state.filteredVideos.length / state.videosPerPage);
    if (state.currentPage > totalPages && totalPages > 0) {
      state.currentPage = totalPages;
    } else if (totalPages === 0) {
      state.currentPage = 1;
    }

    updateVideoTable();
  }

  // Tạo hàng video
  function createVideoRow(video, index) {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 dark:hover:bg-gray-800 transition-all";

    const date = new Date(video.createTime);
    const formattedDate = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const isVideoDownloadedStatus = isVideoDownloaded(video.id, "video") || isVideoDownloaded(video.id, "video-nowatermark");

    const globalIndex = (state.currentPage - 1) * state.videosPerPage + index + 1;

    row.innerHTML = `
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
        <input type="checkbox" data-video-id="${video.id}" class="video-checkbox rounded text-pink-600 focus:ring-pink-500" ${state.selectedVideos.has(video.id) ? "checked" : ""}>
      </td>
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">${globalIndex}</td>
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
          <img src="${video.coverUrl}" class="w-full h-full object-cover" alt="${video.title}">
        </div>
      </td>
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
        <div class="text-xs sm:text-sm text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-[300px]" title="${video.title}">${video.title}</div>
      </td>
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">${formattedDate}</td>
      <td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        ${isVideoDownloadedStatus ? '<span title="Video đã tải" class="text-green-500">✅</span>' : ""}
      </td>
    `;

    return row;
  }

  // Cập nhật bảng video với phân trang
  function updateVideoTable() {
    const tableBody = document.getElementById("videos-table-body");
    const fragment = document.createDocumentFragment();

    const videosToDisplay = state.filteredVideos.length > 0 ? state.filteredVideos : state.videos;
    const startIndex = (state.currentPage - 1) * state.videosPerPage;
    const endIndex = startIndex + state.videosPerPage;
    const videosForPage = videosToDisplay.slice(startIndex, endIndex);

    videosForPage.forEach((video, index) => {
      fragment.appendChild(createVideoRow(video, index));
    });

    requestAnimationFrame(() => {
      tableBody.innerHTML = "";
      tableBody.appendChild(fragment);
      updateUI();
    });
  }

  // Cập nhật giao diện
  function updateUI() {
    const videosToDisplay = state.filteredVideos.length > 0 ? state.filteredVideos : state.videos;
    const selectedCount = state.selectedVideos.size;
    const totalCount = videosToDisplay.length;

    const totalPages = Math.ceil(totalCount / state.videosPerPage);

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    prevButton.disabled = state.currentPage === 1;
    nextButton.disabled = state.currentPage === totalPages || totalPages === 0;

    document.getElementById("current-page").textContent = state.currentPage;
    document.getElementById("total-pages").textContent = totalPages || 1;

    document.getElementById("selected-count").textContent = selectedCount;
    document.getElementById("total-count").textContent = totalCount;

    const selectAllCheckbox = document.getElementById("select-all");
    const startIndex = (state.currentPage - 1) * state.videosPerPage;
    const endIndex = startIndex + state.videosPerPage;
    const videosForPage = videosToDisplay.slice(startIndex, endIndex);
    const allSelectedOnPage = videosForPage.every((video) => state.selectedVideos.has(video.id));
    selectAllCheckbox.checked = allSelectedOnPage && videosForPage.length > 0;

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.disabled = selectedCount === 0 || state.isDownloading;

    if (state.isDownloading) {
      const progressContainer = document.getElementById("download-progress-container");
      const progressBar = document.getElementById("download-progress-bar");
      const progressText = document.getElementById("download-progress-text");

      progressContainer.classList.remove("hidden");
      progressBar.style.width = `${state.downloadProgress}%`;
      progressText.textContent = `${Math.round(state.downloadProgress)}%`;
    } else {
      document.getElementById("download-progress-container").classList.add("hidden");
    }
  }

  // Thiết lập sự kiện
  function setupEventListeners() {
    const fetchVideosButton = document.getElementById("fetch-videos");
    const downloadBtn = document.getElementById("download-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const statusEl = document.getElementById("fetch-status");

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    prevButton.addEventListener("click", () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        state.selectedVideos.clear();
        updateVideoTable();
      }
    });

    nextButton.addEventListener("click", () => {
      const videosToDisplay = state.filteredVideos.length > 0 ? state.filteredVideos : state.videos;
      const totalPages = Math.ceil(videosToDisplay.length / state.videosPerPage);
      if (state.currentPage < totalPages) {
        state.currentPage++;
        state.selectedVideos.clear();
        updateVideoTable();
      }
    });

    fetchVideosButton.addEventListener("click", async () => {
      if (state.isFetching) return;

      state.isFetching = true;
      state.fetchedCount = 0;
      state.videos = [];
      state.filteredVideos = [];
      state.selectedVideos.clear();
      state.currentPage = 1;

      const tableBody = document.getElementById("videos-table-body");
      tableBody.innerHTML = "";

      fetchVideosButton.disabled = true;
      fetchVideosButton.innerHTML = `
        <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang lấy...
      `;

      try {
        const downloader = new DouyinDownloader();
        await downloader.fetchAllVideos((newVideos) => {
          newVideos.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
          state.videos.push(...newVideos);
          state.fetchedCount += newVideos.length;
          applyFilter();
          updateUI();
        });

        statusEl.textContent = `Đã lấy ${state.fetchedCount} video`;
        setupTableEventListeners();
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
        statusEl.textContent = "Lỗi: " + error.message;
        if (error.message.includes("403") || error.message.includes("401")) {
          statusEl.textContent += ". Vui lòng đăng nhập Douyin và thử lại.";
        }
      } finally {
        state.isFetching = false;
        fetchVideosButton.disabled = false;
        fetchVideosButton.innerHTML = "<span>Lấy Videos</span>";
      }
    });

    downloadBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!downloadBtn.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });

    dropdownMenu.addEventListener("click", async (e) => {
      const action = e.target.dataset.action;
      if (!action) return;

      const selectedVideos = (state.filteredVideos.length > 0 ? state.filteredVideos : state.videos)
        .filter((v) => state.selectedVideos.has(v.id));
      
      if (selectedVideos.length === 0) {
        document.getElementById("fetch-status").textContent = "Vui lòng chọn ít nhất một video để tải.";
        return;
      }

      dropdownMenu.classList.add("hidden");

      switch (action) {
        case "video":
          await downloadFiles(selectedVideos, "video");
          break;
        case "txt":
          FileHandler.saveVideoUrls(selectedVideos, { downloadJson: false, downloadTxt: true, downloadCsv: false });
          break;
        case "force-download":
          await downloadFiles(selectedVideos, "video", false, true);
          break;
      }
    });
  }

  // Thiết lập sự kiện bảng
  function setupTableEventListeners() {
    const selectAllCheckbox = document.getElementById("select-all");
    selectAllCheckbox.addEventListener("change", (e) => {
      const videosToDisplay = state.filteredVideos.length > 0 ? state.filteredVideos : state.videos;
      const startIndex = (state.currentPage - 1) * state.videosPerPage;
      const endIndex = startIndex + state.videosPerPage;
      const videosForPage = videosToDisplay.slice(startIndex, endIndex);

      videosForPage.forEach((video) => {
        if (e.target.checked) {
          state.selectedVideos.add(video.id);
        } else {
          state.selectedVideos.delete(video.id);
        }
      });
      updateVideoTable();
    });

    document.getElementById("videos-table-body").addEventListener("change", (e) => {
      if (e.target.classList.contains("video-checkbox")) {
        const videoId = e.target.dataset.videoId;
        if (e.target.checked) {
          state.selectedVideos.add(videoId);
        } else {
          state.selectedVideos.delete(videoId);
        }
        updateUI();
      }
    });
  }

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
        if (response.status === 429) {
          throw new Error("Đã đạt giới hạn yêu cầu API. Vui lòng thử lại sau vài phút.");
        } else if (response.status === 403 || response.status === 401) {
          throw new Error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại Douyin.");
        }
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.aweme_list) {
        console.warn("Cấu trúc phản hồi API đã thay đổi:", data);
        document.getElementById("fetch-status").textContent = "Lỗi: Cấu trúc phản hồi API đã thay đổi. Vui lòng kiểm tra cập nhật.";
        throw new Error("Cấu trúc phản hồi API không hợp lệ");
      }

      return data;
    }

    async fetchVideoNoWatermark(videoId) {
      const url = new URL(CONFIG.API_WATERMARKLESS);
      url.searchParams.append("aweme_id", videoId);
      url.searchParams.append("device_platform", "webapp");
      url.searchParams.append("channel", "channel_pc_web");

      const response = await fetch(url, {
        headers: {
          ...CONFIG.DEFAULT_HEADERS,
          referrer: `https://www.douyin.com/user/${this.secUserId}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      return response.url || response.blob();
    }
  }

  // Xử lý dữ liệu video
  class VideoDataProcessor {
    static extractVideoMetadata(video) {
      if (!video) return null;

      const metadata = {
        id: video.aweme_id || "",
        desc: video.desc || "",
        title: video.desc || "",
        createTime: video.create_time ? new Date(video.create_time * 1000).toISOString() : "",
        digg_count: video.statistics?.digg_count || 0,
        play_count: video.statistics?.play_count || 0,
        comment_count: video.statistics?.comment_count || 0,
        share_count: video.statistics?.share_count || 0,
        duration: video.video?.duration || 0,
        videoUrl: "",
        audioUrl: "", // Giữ lại để có thể khôi phục sau nếu cần
        coverUrl: "",
        dynamicCoverUrl: "",
      };

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

      // Giữ lại logic audioUrl để có thể khôi phục sau nếu cần
      if (video.music?.play_url) {
        metadata.audioUrl = video.music.play_url.url_list[0];
      }

      if (video.video?.cover) {
        metadata.coverUrl = video.video.cover.url_list[0];
      } else if (video.cover) {
        metadata.coverUrl = video.cover.url_list[0];
      }

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

      const videoData = data.aweme_list
        .map((video) => this.extractVideoMetadata(video))
        .filter((item) => item && item.videoUrl);

      return {
        videoData,
        hasMore: data.has_more,
        maxCursor: data.max_cursor,
      };
    }
  }

  // Xử lý tệp
  class FileHandler {
    static saveVideoUrls(videoData, options = { downloadJson: true, downloadTxt: true, downloadCsv: false }) {
      if (!videoData || videoData.length === 0) {
        console.warn("Không có dữ liệu video để lưu");
        return { savedCount: 0 };
      }

      const channelName = state.channelName || "unknown";
      const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
      let savedCount = 0;

      if (options.downloadJson) {
        const jsonContent = JSON.stringify(videoData, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: "application/json" });
        const jsonUrl = URL.createObjectURL(jsonBlob);

        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = `douyin_${channelName}_${date}.json`;
        jsonLink.style.display = "none";
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
      }

      if (options.downloadTxt) {
        const urlList = videoData.map((video) => video.videoUrl).join("\n");
        const txtBlob = new Blob([urlList], { type: "text/plain" });
        const txtUrl = URL.createObjectURL(txtBlob);

        const txtLink = document.createElement("a");
        txtLink.href = txtUrl;
        txtLink.download = `douyin_${channelName}_${date}.txt`;
        txtLink.style.display = "none";
        document.body.appendChild(txtLink);
        txtLink.click();
        document.body.removeChild(txtLink);
        URL.revokeObjectURL(txtUrl);
      }

      if (options.downloadCsv) {
        const headers = [
          "ID",
          "Tiêu đề",
          "Thời gian tạo",
          "Lượt thích",
          "Lượt xem",
          "Bình luận",
          "Chia sẻ",
          "Thời lượng (ms)",
          "URL Video",
          "URL Ảnh bìa",
        ];
        const csvContent = [
          headers.join(","),
          ...videoData.map((video) =>
            [
              video.id,
              `"${video.title.replace(/"/g, '""')}"`,
              video.createTime,
              video.digg_count,
              video.play_count,
              video.comment_count,
              video.share_count,
              video.duration,
              video.videoUrl,
              video.coverUrl,
            ].join(",")
          ),
        ].join("\n");

        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);

        const csvLink = document.createElement("a");
        csvLink.href = csvUrl;
        csvLink.download = `douyin_${channelName}_${date}.csv`;
        csvLink.style.display = "none";
        document.body.appendChild(csvLink);
        csvLink.click();
        document.body.removeChild(csvLink);
        URL.revokeObjectURL(csvUrl);
      }

      savedCount = videoData.length;
      return { savedCount };
    }
  }

  // Trình tải chính
  class DouyinDownloader {
    constructor() {
      this.validateEnvironment();
      this.secUserId = this.extractSecUserId();
      this.apiClient = new DouyinApiClient(this.secUserId);
      this.cacheKey = `douyin_videos_${this.secUserId}`;
    }

    validateEnvironment() {
      if (typeof window === "undefined" || !window.location) {
        throw new Error("Script phải chạy trong môi trường trình duyệt");
      }

      const loginIndicator = document.querySelector('[data-e2e="user-login-status"]') || document.cookie.includes("login");
      if (!loginIndicator) {
        document.getElementById("fetch-status").textContent = "Vui lòng đăng nhập Douyin để lấy video.";
        throw new Error("Người dùng chưa đăng nhập");
      }
    }

    extractSecUserId() {
      const secUserId = location.pathname.replace("/user/", "");
      if (!secUserId || location.pathname.indexOf("/user/") === -1) {
        throw new Error("Vui lòng chạy script trên trang hồ sơ Douyin!");
      }
      return secUserId;
    }

    getCachedVideos() {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const cacheAge = Date.now() - timestamp;
      if (cacheAge > 24 * 60 * 60 * 1000) return null;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        createTime: item.createTime,
        videoUrl: item.videoUrl,
        audioUrl: item.audioUrl,
        coverUrl: item.coverUrl,
        digg_count: item.digg_count,
        play_count: item.play_count,
        comment_count: item.comment_count,
        share_count: item.share_count,
        duration: item.duration,
      }));
    }

    setCachedVideos(videos) {
      if (!state.enableCache) {
        console.log("Tính năng cache đã bị tắt, không lưu video vào localStorage.");
        return;
      }

      const videosToCache = videos.map(video => ({
        id: video.id,
        title: video.title,
        createTime: video.createTime,
        videoUrl: video.videoUrl,
        audioUrl: video.audioUrl,
        coverUrl: video.coverUrl,
        digg_count: video.digg_count,
        play_count: video.play_count,
        comment_count: video.comment_count,
        share_count: video.share_count,
        duration: video.duration,
      }));

      const cacheData = {
        data: videosToCache,
        timestamp: Date.now(),
      };

      const cacheString = JSON.stringify(cacheData);
      const cacheSize = new Blob([cacheString]).size;

      if (cacheSize > CONFIG.MAX_CACHE_SIZE) {
        console.warn(`Dữ liệu cache (${cacheSize} bytes) vượt quá giới hạn (${CONFIG.MAX_CACHE_SIZE} bytes), không lưu vào localStorage.`);
        document.getElementById("fetch-status").textContent = "Dữ liệu video quá lớn, không lưu cache để tránh lỗi quota.";
        setTimeout(() => {
          document.getElementById("fetch-status").textContent = "";
        }, 5000);
        return;
      }

      try {
        localStorage.setItem(this.cacheKey, cacheString);
        console.log(`Đã lưu ${videosToCache.length} video vào cache (${cacheSize} bytes).`);
      } catch (error) {
        console.error("Lỗi khi lưu cache vào localStorage:", error);
        document.getElementById("fetch-status").textContent = "Không thể lưu cache do giới hạn dung lượng. Vui lòng xóa cache hoặc giảm số lượng video.";
        setTimeout(() => {
          document.getElementById("fetch-status").textContent = "";
        }, 5000);
      }
    }

    async fetchAllVideos(onProgress) {
      const cachedVideos = this.getCachedVideos();
      if (cachedVideos) {
        state.videos = cachedVideos;
        applyFilter();
        updateUI();
        return;
      }

      let hasMore = true;
      let maxCursor = 0;
      const cursors = [];

      while (hasMore) {
        cursors.push(maxCursor);
        const data = await retryWithDelay(() => this.apiClient.fetchVideos(maxCursor));
        const { hasMore: more, maxCursor: newCursor } = VideoDataProcessor.processVideoData(data);
        hasMore = more;
        maxCursor = newCursor;
      }

      const batches = [];
      for (let i = 0; i < cursors.length; i += CONFIG.MAX_CONCURRENT_REQUESTS) {
        batches.push(cursors.slice(i, i + CONFIG.MAX_CONCURRENT_REQUESTS));
      }

      for (const batch of batches) {
        const promises = batch.map((cursor) => retryWithDelay(() => this.apiClient.fetchVideos(cursor)));
        const results = await Promise.all(promises);
        for (const data of results) {
          const { videoData } = VideoDataProcessor.processVideoData(data);
          if (onProgress) onProgress(videoData);
        }
        await sleep(CONFIG.RETRY_DELAY_MS);
      }

      this.setCachedVideos(state.videos);
    }
  }

  // Hiển thị popup tải hoàn tất
  function showDownloadCompletePopup(successful, failed, type, noWatermark) {
    const dialog = document.createElement("div");
    dialog.className = "fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-[10001] flex items-center justify-center";
    dialog.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 font-inter">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tải xuống hoàn tất</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Đã tải thành công: ${successful} ${type}${noWatermark ? " (không watermark)" : ""}<br>
          Thất bại: ${failed}
        </p>
        <div class="flex justify-end">
          <button id="close-popup" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all">Đóng</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    document.getElementById("close-popup").addEventListener("click", () => {
      document.body.removeChild(dialog);
    });
  }

  // Tải tệp dưới dạng ZIP
  async function downloadFiles(files, type = "video", noWatermark = false, forceDownload = false) {
    const statusEl = document.getElementById("fetch-status");
    const total = files.length;
    let successful = 0;
    let failed = 0;

    if (typeof JSZip === "undefined") {
      statusEl.textContent = "Lỗi: Thư viện JSZip chưa tải. Vui lòng kiểm tra kết nối mạng và thử lại.";
      return;
    }

    state.isDownloading = true;
    state.downloadProgress = 0;
    updateUI();

    const zip = new JSZip();
    const channelName = state.channelName || "unknown";
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const folder = zip.folder(`douyin_${channelName}_${type}s${noWatermark ? "_no-watermark" : ""}`);
    const downloader = new DouyinDownloader();

    for (let i = 0; i < files.length; i += CONFIG.BATCH_SIZE) {
      const batch = files.slice(i, i + CONFIG.BATCH_SIZE);
      const promises = batch.map(async (file, index) => {
        const downloadType = noWatermark ? "video-nowatermark" : type;
        if (!forceDownload && isVideoDownloaded(file.id, downloadType)) {
          console.log(`Bỏ qua ${downloadType} đã tải cho video ${file.id}`);
          return;
        }

        let url = file.videoUrl;
        if (!url) {
          failed++;
          return;
        }

        if (noWatermark && type === "video") {
          try {
            url = await downloader.apiClient.fetchVideoNoWatermark(file.id);
          } catch (error) {
            console.warn(`Không lấy được URL không watermark cho video ${file.id}:`, error);
            failed++;
            return;
          }
        }

        statusEl.textContent = `Đang tải ${type} ${i + index + 1}/${total}...`;

        const timestamp = new Date(file.createTime).toISOString().split("T")[0];
        const filename = `douyin_${type}_${timestamp}_${file.id}.mp4`;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
          const blob = await response.blob();
          folder.file(filename, blob);
          saveDownloadHistory(file.id, downloadType);
          successful++;
        } catch (error) {
          console.error(`Tải ${filename} thất bại:`, error);
          failed++;
        }
      });

      await Promise.all(promises);
      state.downloadProgress = ((i + batch.length) / total) * 100;
      updateUI();
      await sleep(1000);
    }

    if (successful > 0) {
      const zipFilename = `douyin_${channelName}_${type}s_${date}${noWatermark ? "_no-watermark" : ""}.zip`;

      statusEl.textContent = `Đang tạo tệp ZIP...`;

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = zipFilename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    }

    state.isDownloading = false;
    showDownloadCompletePopup(successful, failed, type, noWatermark);
    statusEl.textContent = "";
    updateUI();
  }

  // Khởi tạo giao diện
  async function initializeUI() {
    const style = document.createElement("style");
    style.textContent = `
      /* Áp dụng phông chữ Inter toàn cục */
      .font-inter {
        font-family: 'Inter', sans-serif;
      }
      /* Hiệu ứng fadeIn */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      /* Thanh cuộn tùy chỉnh */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      .dark ::-webkit-scrollbar-track {
        background: #374151;
      }
      .dark ::-webkit-scrollbar-thumb {
        background: #6b7280;
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      /* Hiệu ứng hover cho hàng bảng */
      tbody tr {
        transition: background-color 0.2s ease;
      }
      /* Xóa outline mặc định cho input */
      input:focus, select:focus {
        outline: none;
      }
      /* Tùy chỉnh input date */
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(300deg);
      }
      .dark input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(0.8);
      }
    `;
    document.head.appendChild(style);

    createMainUI();
    await addDownloadButton();
    setupEventListeners();
    setupDialogEventListeners();
    observeChannelName();
  }

  // Bắt đầu script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeUI().catch((error) => console.error("Khởi tạo giao diện thất bại:", error));
    });
  } else {
    initializeUI().catch((error) => console.error("Khởi tạo giao diện thất bại:", error));
  }
})();