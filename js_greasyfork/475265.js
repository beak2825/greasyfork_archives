// ==UserScript==
// @name         98T Picture Preview
// @description  [REFACTORED] Combines the full functionality of v1.9.0 with a modern, multi-column, dark-mode grid UI at the top of the page.
// @version      2.0.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sehuatang.net
// @author       UnforgetMemory
// @namespace    https://www.sehuatang.net/*
// @namespace    https://www.sehuatang.org/*
// @match        https://www.sehuatang.net/forum*
// @match        https://www.sehuatang.org/forum*
// @match        https://www.sehuatang.net/forum.php?mod=forumdisplay&fid=103&page=*
// @match        https://www.sehuatang.org/forum.php?mod=forumdisplay&fid=103&page=*
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require		   https://cdn.jsdelivr.net/npm/i18next@23.11.5/i18next.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @license 	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/475265/98T%20Picture%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/475265/98T%20Picture%20Preview.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  const CONFIG = {
    AVID_REGEX: /[a-zA-Z]{2,6}[-\s]?\d{2,5}/gi,
    JAVDB_HOST: "javdb.com",
    HTTP_HEADERS: {
      "User-Agent": window.navigator.userAgent,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      Cookie: document.cookie,
      Referer: document.location.href,
    },
    LOCAL_STORAGE_KEYS: {
      VIEWED_AVIDS: "68905cf391b2428572e6446042ab1029",
      VIEWED_US_TITLES: "abba24c58fc69bf0955bddc7a0eadee1",
      HIDE_VIEWED_MODE: "780fbed5c332f7f96ca73e19e94a9749",
      JIANGUOYUN: "97f6483755d45ad927caf3108b61be91",
      LOCALE: "ee2757153264e82a1c8f64db8ddcb3e2",
    },
    JIANGUOYUN: {
      AVIDS_FILENAME: "95551967d3da7c5af36b141f630683c4",
      US_FILENAME: "53648e7622cfa657f1f6de856efd67c9",
      ELEMENT_IDS: {
        DAV_URL: "jgy_dav_url",
        ACCOUNT: "jgy_account",
        PASSWORD: "jgy_password",
      },
    },
    LOCALES: { enUS: "en-US", zhCN: "zh-CN", zhHK: "zh-HK", zhTW: "zh-TW" },
  };

  // --- I18N INITIALIZATION ---
  i18next.init({
    lng: GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.LOCALE, CONFIG.LOCALES.enUS),
    fallbackLng: CONFIG.LOCALES.enUS,
    resources: {
      "en-US": {
        translation: {
          Language: "🕮 Language",
          "Hide Viewed": "Hide Viewed",
          Jianguoyun: "☁️ Jianguoyun",
          "Jianguoyun Config": "☁️ Jianguoyun Config",
          "Upload To Jianguoyun": "↑ Upload To ☁️ Jianguoyun",
          "Download from Jianguoyun": "↓ Download from ☁️ Jianguoyun",
          "Local and Jianguoyun merge": "🔄 Local and ☁️ Jianguoyun merge",
          "DAV URL": "☁️  DAV URL",
          Account: "👤 Account",
          Password: "🔑 Password",
          "Show Password": "Show Password",
          Save: "Save",
          "Save Successful!": "Save Successful!",
          "Update Successful!": "Update Successful!",
          "Update Bad": "Update Bad",
          "Upload successful!": "Upload successful!",
          "Sync successful!": "Sync successful!",
          "Download successful!": "Download successful!",
          "Hidden Password": "Hidden Password",
          "Status ERROR": "Webdav Status Error",
          "Check Config!": "Check Config!",
          "No Data": "Cloud No historical data exists!",
          "Bad Download": "Bad Download Data",
          "Page to Refresh":
            "The page is about to refresh due to new data updates. Please wait...",
          "Viewed Total": "Viewed Total",
          click_all_magnet: "Copy All Magnet Links",
          click_all_torrent: "Download All Torrents",
        },
      },
      "zh-CN": {
        translation: {
          Language: "🕮 语言（简体）",
          "Hide Viewed": "隐藏已阅",
          Jianguoyun: "☁️ 坚果云",
          "Jianguoyun Config": "☁️ 坚果云配置",
          "Upload To Jianguoyun": "↑ 上传至 ☁️ 坚果云",
          "Download from Jianguoyun": "从 ☁️ 坚果云 ↓ 下载",
          "Local and Jianguoyun merge": "🔄 双端同步 ☁️ 坚果云 ",
          "DAV URL": "☁️  DAV URL",
          Account: "👤 账号",
          Password: "🔑 密码",
          "Show Password": "显示密码",
          Save: "保存",
          "Save Successful!": "保存成功!",
          "Update Successful!": "更新成功!",
          "Update Bad": "更新失败",
          "Upload successful!": "上传成功!",
          "Sync successful!": "同步成功!",
          "Download successful!": "下载完成!",
          "Hidden Password": "隐藏密码",
          "Status ERROR": "Webdav 状态异常",
          "Check Config!": "检查配置!",
          "No Data": "云端没有历史数据!",
          "Bad Download": "下载数据出错",
          "Page to Refresh": "数据更新，页面即将刷新，请稍候...",
          "Viewed Total": "浏览量",
          click_all_magnet: "复制所有磁力",
          click_all_torrent: "下载所有种子",
        },
      },
      "zh-TW": {
        translation: {
          Language: "🕮 語言（台）",
          "Hide Viewed": "隱藏已讀",
          Jianguoyun: "☁️ 堅果雲",
          "Jianguoyun Config": "☁️ 堅果雲配置",
          "Upload To Jianguoyun": "⬆️ 上傳至 ☁️ 堅果雲",
          "Download from Jianguoyun": "從 ☁️ 堅果雲 ⬇️ 下載",
          "Local and Jianguoyun merge": "本地與 ☁️ 堅果雲同步",
          "DAV URL": "☁️ DAV 網址",
          Account: " 帳戶",
          Password: " 密碼",
          "Show Password": "顯示密碼",
          Save: "儲存",
          "Save Successful!": "儲存成功！",
          "Hidden Password": "隱藏密碼",
          "Update Bad": "更新失敗",
          "Upload successful!": "上傳成功!",
          "Sync successful!": "同步成功!",
          "Download successful!": "下載完成!",
          "Status ERROR": "Webdav 狀態錯誤",
          "Check Config!": "檢查設定!",
          "No Data": "雲端沒有歷史資料!",
          "Bad Download": "下載數據錯誤",
          "Page to Refresh": "頁面即將重新整理，以更新資料。請稍候...",
          "Viewed Total": "瀏覽量",
          click_all_magnet: "點擊所有磁力連結",
          click_all_torrent: "點擊所有種子連結",
        },
      },
      "zh-HK": {
        translation: {
          Language: "🕮 語言（港）",
          "Hide Viewed": "收埋睇過",
          Jianguoyun: "☁️ 堅果雲",
          "Jianguoyun Config": "☁️ 堅果雲設定",
          "Upload To Jianguoyun": "⬆️ 上載到 ☁️ 堅果雲",
          "Download from Jianguoyun": "由 ☁️ 堅果雲 ⬇️ 下載",
          "Local and Jianguoyun merge": "本地同 ☁️ 堅果雲同步",
          "DAV URL": "☁️ DAV 網址",
          Account: "帳戶",
          Password: "密碼",
          "Show Password": "睇密碼",
          Save: "儲存",
          "Save Successful!": "儲存成功喇！",
          "Hidden Password": "收埋密碼",
          "Update Bad": "更新搞唔掂",
          "Upload successful!": "上傳成功喇!",
          "Sync successful!": "同步成功喇!",
          "Download successful!": "下載掂咗喇!",
          "Status ERROR": "Webdav 狀態搞唔掂",
          "Check Config!": "睇吓設定啱唔啱!",
          "No Data": "雲端咩資料都冇呀!",
          "Bad Download": "下載嘅資料壞咗",
          "Page to Refresh": "资料更新紧系，页面要更新喇！等阵先！",
          "Viewed Total": "瀏覽量",
          click_all_magnet: "點擊所有磁力連結",
          click_all_torrent: "點擊所有種子連結",
        },
      },
    },
  });

  // --- MODERN STYLES ---
  GM_addStyle(`
		:root { --bg-color: #121212; --card-bg-color: #1e1e1e; --text-color: #e0e0e0; --text-secondary-color: #a0a0a0; --accent-color: #03dac6; --border-color: #333333; --shadow-color: rgba(0, 0, 0, 0.4); }
		body { background-color: var(--bg-color) !important; }
        #filtered-info-bar { background-color: var(--card-bg-color); color: var(--text-secondary-color); padding: 10px 25px; font-size: 0.9rem; text-align: center; border-bottom: 1px solid var(--border-color); box-sizing: border-box; width: 100%; }
		#modern-preview-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; padding: 25px; width: 100%; box-sizing: border-box; }
		.preview-card { background-color: var(--card-bg-color); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 15px var(--shadow-color); transition: transform 0.3s ease, box-shadow 0.3s ease; }
		.preview-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px var(--shadow-color); }
		.preview-card.viewed { opacity: 0.6; transition: opacity 0.5s ease; }
        .preview-card.viewed:hover { opacity: 1; }
		.card-image-container { aspect-ratio: 16 / 10; background-color: #2a2a2a; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; }
		.card-image-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .preview-card:hover .card-image-container img { transform: scale(1.05); }
		.card-content { padding: 15px; display: flex; flex-direction: column; flex-grow: 1; }
		.card-title { font-size: 1.1rem; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
		.card-title a { color: inherit; text-decoration: none; transition: color 0.2s ease; }
		.card-title a:hover { color: var(--accent-color); }
		.card-meta { font-size: 0.8rem; color: var(--text-secondary-color); margin: 0 0 15px 0; }
		.card-links { margin-top: auto; display: flex; flex-direction: row; justify-content: flex-end; gap: 15px; }
		.card-links a { display: flex; align-items: center; justify-content: center; padding: 6px 12px; text-decoration: none; border-radius: 8px; font-size: 1.5rem; transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease; }
		.card-links a:hover { transform: scale(1.1); }
        .magnet-link { background-color: #443b17; color: #ffc107; }
        .magnet-link:hover { background-color: #ffc107; color: var(--card-bg-color); }
        .torrent-link { background-color: #1c3a1e; color: #4caf50; }
        .torrent-link:hover { background-color: #4caf50; color: var(--card-bg-color); }
	`);

  // --- UTILITY & SETUP ---
  const gmFetch = (details) =>
    new Promise((resolve, reject) => {
      details.onload = resolve;
      details.onerror = reject;
      details.ontimeout = reject;
      GM_xmlhttpRequest(details);
    });
  const getJsonValue = (key, defaultValue = "[]") =>
    JSON.parse(GM_getValue(key, defaultValue));
  const setJsonValue = (key, value) => GM_setValue(key, JSON.stringify(value));
  const showToast = (title, icon = "success") =>
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title,
      icon,
    });

  // --- LOCAL STORAGE HELPERS ---
  const viewedAVIDs = {
    list: () => getJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_AVIDS),
    has: (id) => viewedAVIDs.list().includes(id),
    add: (id) => {
      const c = viewedAVIDs.list();
      if (!c.includes(id))
        setJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_AVIDS, [...c, id]);
    },
    reset: (ids) => setJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_AVIDS, ids),
    merge: (newIds) => viewedAVIDs.reset(_.union(viewedAVIDs.list(), newIds)),
  };
  const viewedUSTitles = {
    list: () => getJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_US_TITLES),
    has: (title) => viewedUSTitles.list().includes(title),
    add: (title) => {
      const c = viewedUSTitles.list();
      if (!c.includes(title))
        setJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_US_TITLES, [...c, title]);
    },
    reset: (titles) =>
      setJsonValue(CONFIG.LOCAL_STORAGE_KEYS.VIEWED_US_TITLES, titles),
    merge: (newTitles) =>
      viewedUSTitles.reset(_.union(viewedUSTitles.list(), newTitles)),
  };

  // --- JIANGUOYUN (CLOUD SYNC) ---
  class JianguoyunClient {
    constructor() {
      const config = getJsonValue(CONFIG.LOCAL_STORAGE_KEYS.JIANGUOYUN, "{}");
      this.davURL = config.url;
      this.auth =
        config.account && config.password
          ? `Basic ${btoa(`${config.account}:${config.password}`)}`
          : null;
    }
    isValid() {
      return !!(this.davURL && this.auth);
    }
    async request(method, fileName, data = null) {
      if (!this.isValid()) return Promise.reject("Bad Jianguoyun Config!");
      const url = `${this.davURL}/${fileName}.json`.replace(
        /(?<!:)\/{2,}/g,
        "/"
      );
      try {
        return await gmFetch({
          method,
          url,
          data,
          headers: { Authorization: this.auth },
          timeout: 5000,
        });
      } catch (error) {
        console.error(
          `[Jianguoyun] ${method} request failed for ${fileName}`,
          error
        );
        throw error;
      }
    }
    async download(fileName) {
      return this.request("GET", fileName);
    }
    async upload(fileName, data) {
      return this.request("PUT", fileName, JSON.stringify(data));
    }
  }

  // --- CORE LOGIC ---
  function extractThreadInfo(el) {
    const linkEl = el.querySelector("th a.s.xst");
    if (!linkEl) return null;
    const title = linkEl.innerText.trim();
    const avIdMatch = title.match(CONFIG.AVID_REGEX);
    const avId = avIdMatch ? avIdMatch[0].toUpperCase() : null;
    const dateEl =
      el.querySelector("td.by em span span") ||
      el.querySelector("td.by em span");
    return {
      url: linkEl.href,
      fullTitle: title,
      avId,
      releaseDate: dateEl ? dateEl.innerText.trim() : "N/A",
    };
  }

  async function createAndAppendCard(info, container) {
    const isViewed = info.avId
      ? viewedAVIDs.has(info.avId)
      : viewedUSTitles.has(info.fullTitle);
    if (GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.HIDE_VIEWED_MODE) && isViewed)
      return;

    const card = document.createElement("div");
    card.className = "preview-card";
    // [FIXED] Add data attributes for later retrieval, avoiding the need to simulate clicks.
    if (info.avId) card.dataset.avid = info.avId;
    card.dataset.fullTitle = info.fullTitle;
    if (isViewed) card.classList.add("viewed");

    card.innerHTML = `
			<div class="card-image-container"></div>
			<div class="card-content">
				<h3 class="card-title">
					<a href="${
            info.avId
              ? `https://${CONFIG.JAVDB_HOST}/search?q=${info.avId}&f=all`
              : info.url
          }" target="_blank" rel="noopener noreferrer" title="${
      info.fullTitle
    }">${info.fullTitle}</a>
				</h3>
				<p class="card-meta">${info.releaseDate}</p>
				<div class="card-links"></div>
			</div>
		`;
    container.appendChild(card);

    const markCardAsViewed = () => {
      if (card.classList.contains("viewed")) return;
      if (info.avId) viewedAVIDs.add(info.avId);
      else viewedUSTitles.add(info.fullTitle);
      card.classList.add("viewed");
    };

    try {
      const res = await gmFetch({
        method: "GET",
        url: info.url,
        headers: CONFIG.HTTP_HEADERS,
      });
      const doc = new DOMParser().parseFromString(
        res.responseText,
        "text/html"
      );

      const imgFile = doc
        .querySelector("ignore_js_op > img")
        ?.getAttribute("zoomfile");
      const magnetLink = doc.querySelector(
        ".blockcode > div > ol > li"
      )?.innerText;
      const torrentEl = doc.querySelector(
        "div.pattl > ignore_js_op > dl > dd > p.attnm a"
      );
      const torrentLink = torrentEl ? torrentEl.href : null;
      const torrentText = torrentEl
        ? torrentEl.parentElement.innerText.trim()
        : "Download Torrent";

      if (imgFile) {
        const img = document.createElement("img");
        img.src = imgFile;
        img.alt = "Preview Cover";
        img.onclick = () => {
          window.open(info.url, "_blank");
          markCardAsViewed();
        };
        card.querySelector(".card-image-container").appendChild(img);
      }

      const linksContainer = card.querySelector(".card-links");
      if (magnetLink) {
        const a = document.createElement("a");
        a.href = magnetLink;
        a.className = "magnet-link";
        a.title = "复制磁力链接";
        a.textContent = "⚡";
        a.onclick = markCardAsViewed;
        linksContainer.appendChild(a);
      }
      if (torrentLink) {
        const a = document.createElement("a");
        a.href = torrentLink;
        a.className = "torrent-link";
        a.title = torrentText;
        a.textContent = "🌱";
        a.onclick = markCardAsViewed;
        linksContainer.appendChild(a);
      }
    } catch (error) {
      console.error(
        `[Modern Preview] Failed to fetch details for ${info.url}:`,
        error
      );
      card.querySelector(".card-meta").textContent += " (Failed to load)";
    }
  }

  function processAndMigrateElement(el, container) {
    const info = extractThreadInfo(el);
    if (info) {
      createAndAppendCard(info, container);
      el.style.display = "none";
    }
  }

  // --- MENU COMMANDS ---
  function setupMenu() {
    const { AVIDS_FILENAME, US_FILENAME } = CONFIG.JIANGUOYUN;

    GM_registerMenuCommand(i18next.t("Language"), () => {
      Swal.fire({
        title: "🕮 Language",
        input: "select",
        inputOptions: {
          "en-US": "🕮 Language",
          "zh-CN": "🕮 语言（简体）",
          "zh-HK": "🕮 語言（港）",
          "zh-TW": "🕮 語言（台）",
        },
        inputValue: i18next.language,
        showCancelButton: true,
        confirmButtonText: i18next.t("Save"),
      }).then((result) => {
        if (result.isConfirmed) {
          GM_setValue(CONFIG.LOCAL_STORAGE_KEYS.LOCALE, result.value);
          showToast(i18next.t("Save Successful!"), "success");
          setTimeout(() => location.reload(), 1000);
        }
      });
    });

    GM_registerMenuCommand(
      `${
        GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.HIDE_VIEWED_MODE) ? "✅" : "❌"
      } ${i18next.t("Hide Viewed")}`,
      () => {
        GM_setValue(
          CONFIG.LOCAL_STORAGE_KEYS.HIDE_VIEWED_MODE,
          !GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.HIDE_VIEWED_MODE)
        );
        location.reload();
      }
    );

    GM_registerMenuCommand(i18next.t("Jianguoyun Config"), () => {
      const oldConfig = getJsonValue(
        CONFIG.LOCAL_STORAGE_KEYS.JIANGUOYUN,
        "{}"
      );
      Swal.fire({
        title: i18next.t("Jianguoyun Config"),
        html: `
                    <input type="text" id="jgy_dav_url" class="swal2-input" placeholder="${i18next.t(
                      "DAV URL"
                    )}" value="${oldConfig.url || ""}">
                    <input type="text" id="jgy_account" class="swal2-input" placeholder="${i18next.t(
                      "Account"
                    )}" value="${oldConfig.account || ""}">
                    <input type="password" id="jgy_password" class="swal2-input" placeholder="${i18next.t(
                      "Password"
                    )}" value="${oldConfig.password || ""}">`,
        confirmButtonText: i18next.t("Save"),
        showCancelButton: true,
        preConfirm: () => {
          const config = {
            url: document.getElementById("jgy_dav_url").value,
            account: document.getElementById("jgy_account").value,
            password: document.getElementById("jgy_password").value,
          };
          setJsonValue(CONFIG.LOCAL_STORAGE_KEYS.JIANGUOYUN, config);
        },
      }).then(
        (result) =>
          result.isConfirmed && showToast(i18next.t("Save Successful!"))
      );
    });

    GM_registerMenuCommand(i18next.t("Upload To Jianguoyun"), async () => {
      const jgy = new JianguoyunClient();
      if (!jgy.isValid()) {
        showToast(i18next.t("Check Config!"), "error");
        return;
      }
      try {
        await jgy.upload(AVIDS_FILENAME, viewedAVIDs.list());
        await jgy.upload(US_FILENAME, viewedUSTitles.list());
        showToast(i18next.t("Upload successful!"));
      } catch (e) {
        showToast(i18next.t("Update Bad"), "error");
      }
    });

    GM_registerMenuCommand(i18next.t("Download from Jianguoyun"), async () => {
      const jgy = new JianguoyunClient();
      if (!jgy.isValid()) {
        showToast(i18next.t("Check Config!"), "error");
        return;
      }
      try {
        const avidRes = await jgy.download(AVIDS_FILENAME);
        if (avidRes.status === 200)
          viewedAVIDs.merge(JSON.parse(avidRes.responseText));
        const usRes = await jgy.download(US_FILENAME);
        if (usRes.status === 200)
          viewedUSTitles.merge(JSON.parse(usRes.responseText));
        showToast(i18next.t("Download successful!"));
        setTimeout(() => location.reload(), 1000);
      } catch (e) {
        showToast(i18next.t("Bad Download"), "error");
      }
    });

    GM_registerMenuCommand(
      i18next.t("Local and Jianguoyun merge"),
      async () => {
        const jgy = new JianguoyunClient();
        if (!jgy.isValid()) {
          showToast(i18next.t("Check Config!"), "error");
          return;
        }
        try {
          const avidRes = await jgy.download(AVIDS_FILENAME);
          const cloudAvids =
            avidRes.status === 200 ? JSON.parse(avidRes.responseText) : [];
          const mergedAvids = _.union(viewedAVIDs.list(), cloudAvids);
          viewedAVIDs.reset(mergedAvids);

          const usRes = await jgy.download(US_FILENAME);
          const cloudUsTitles =
            usRes.status === 200 ? JSON.parse(usRes.responseText) : [];
          const mergedUsTitles = _.union(viewedUSTitles.list(), cloudUsTitles);
          viewedUSTitles.reset(mergedUsTitles);

          await jgy.upload(AVIDS_FILENAME, mergedAvids);
          await jgy.upload(US_FILENAME, mergedUsTitles);

          showToast(i18next.t("Sync successful!"));
          setTimeout(() => location.reload(), 1000);
        } catch (e) {
          showToast(i18next.t("Update Bad"), "error");
        }
      }
    );

    GM_registerMenuCommand(
      `${i18next.t("Viewed Total")} ${viewedAVIDs.list().length}`,
      () => {}
    );

    GM_registerMenuCommand(i18next.t("click_all_magnet"), () => {
      const links = Array.from(
        document.querySelectorAll(".preview-card:not(.viewed) .magnet-link")
      );
      if (links.length === 0) {
        showToast("没有新的磁力链接", "info");
        return;
      }
      // 1. 复制所有链接到剪贴板
      GM_setClipboard(links.map((l) => l.href).join("\r\n"));

      // 2. [FIXED] 标记所有对应的卡片为已阅，但不触发点击事件
      links.forEach((link) => {
        const card = link.closest(".preview-card");
        if (card) {
          const avid = card.dataset.avid;
          const fullTitle = card.dataset.fullTitle;

          if (avid) {
            viewedAVIDs.add(avid);
          } else if (fullTitle) {
            // Fallback for items without AVID
            viewedUSTitles.add(fullTitle);
          }
          card.classList.add("viewed");
        }
      });

      showToast(`已复制 ${links.length} 个新磁力链接!`);
    });

    GM_registerMenuCommand(i18next.t("click_all_torrent"), () => {
      const links = document.querySelectorAll(
        ".preview-card:not(.viewed) .torrent-link"
      );
      if (links.length === 0) {
        showToast("没有新的种子文件", "info");
        return;
      }
      links.forEach((l) => l.click()); // Torrent links are for download, so clicking is the correct behavior.
      showToast(`正在下载 ${links.length} 个新种子!`, "info");
    });
  }

  // --- INITIALIZATION & OBSERVERS ---
  function main() {
    const threadListTable = document.getElementById("threadlisttableid");
    if (!threadListTable) return;

    threadListTable.style.display = "none";

    let filteredCount = 0;
    if (GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.HIDE_VIEWED_MODE, false)) {
      threadListTable
        .querySelectorAll('tbody[id^="normalthread_"]')
        .forEach((el) => {
          const info = extractThreadInfo(el);
          if (
            info &&
            (info.avId
              ? viewedAVIDs.has(info.avId)
              : viewedUSTitles.has(info.fullTitle))
          ) {
            filteredCount++;
          }
        });
    }

    const infoBar = document.createElement("div");
    infoBar.id = "filtered-info-bar";
    infoBar.textContent = `当前已为您隐藏 ${filteredCount} 个已阅条目。`;

    const modernContainer = document.createElement("div");
    modernContainer.id = "modern-preview-container";

    document.body.prepend(modernContainer);
    document.body.prepend(infoBar);

    const run = () => {
      threadListTable
        .querySelectorAll('tbody[id^="normalthread_"]:not([data-processed])')
        .forEach((el) => {
          el.dataset.processed = "true";
          processAndMigrateElement(el, modernContainer);
        });
    };

    const runDebounced = _.debounce(run, 300, { maxWait: 1000 });
    run();

    const observer = new MutationObserver(() => runDebounced());
    observer.observe(threadListTable, { childList: true, subtree: true });
  }

  // --- SCRIPT EXECUTION ---
  setupMenu();
  main();
})();
