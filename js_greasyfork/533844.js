// ==UserScript==
// @name                Pixiv Previewer L
// @namespace           https://github.com/LolipopJ/PixivPreviewer
// @version             1.3.4-2025/10/31
// @description         Original project: https://github.com/Ocrosoft/PixivPreviewer.
// @author              Ocrosoft, LolipopJ
// @license             GPL-3.0
// @supportURL          https://github.com/LolipopJ/PixivPreviewer
// @match               *://www.pixiv.net/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM.xmlHttpRequest
// @icon                https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://www.pixiv.net
// @icon64              https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=64&url=https://www.pixiv.net
// @require             https://update.greasyfork.org/scripts/515994/1478507/gh_2215_make_GM_xhr_more_parallel_again.js
// @require             http://code.jquery.com/jquery-3.7.1.min.js
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/533844/Pixiv%20Previewer%20L.user.js
// @updateURL https://update.greasyfork.org/scripts/533844/Pixiv%20Previewer%20L.meta.js
// ==/UserScript==

// src/constants/index.ts
var g_version = "1.3.4";
var g_defaultSettings = {
  enablePreview: true,
  enableAnimePreview: true,
  previewDelay: 300,
  pageCount: 2,
  favFilter: 500,
  orderType: 0 /* BY_BOOKMARK_COUNT */,
  aiFilter: false,
  aiAssistedFilter: false,
  hideFavorite: true,
  hideByTag: false,
  hideByTagList: "",
  linkBlank: true,
  version: g_version
};
var g_loadingImage = "https://pp-1252089172.cos.ap-chengdu.myqcloud.com/loading.gif";
var PREVIEW_WRAPPER_BORDER_WIDTH = 2;
var PREVIEW_WRAPPER_BORDER_RADIUS = 8;
var PREVIEW_WRAPPER_DISTANCE_TO_MOUSE = 20;
var PREVIEW_PRELOAD_NUM = 5;
var TOOLBAR_ID = "pp-toolbar";
var SORT_BUTTON_ID = "pp-sort";
var SORT_EVENT_NAME = "PIXIV_PREVIEWER_RUN_SORT";
var SORT_NEXT_PAGE_BUTTON_ID = "pp-sort-next-page";
var SORT_NEXT_PAGE_EVENT_NAME = "PIXIV_PREVIEWER_JUMP_TO_NEXT_PAGE";
var HIDE_FAVORITES_BUTTON_ID = "pp-hide-favorites";
var AI_ASSISTED_TAGS = [
  "ai\u30A4\u30E9\u30B9\u30C8",
  "ai-generated",
  "ai-assisted",
  "ai-shoujo",
  "ai\u751F\u6210",
  "ai\u8F14\u52A9",
  "ai\u8F85\u52A9",
  "ai\u52A0\u7B46",
  "ai\u52A0\u7B14"
];

// src/utils/logger.ts
var ILog = class {
  prefix = "%c Pixiv Preview";
  v(...values) {
    console.log(
      this.prefix + " [VERBOSE] ",
      "color:#333 ;background-color: #fff",
      ...values
    );
  }
  i(...infos) {
    console.info(
      this.prefix + " [INFO] ",
      "color:#333 ;background-color: #fff;",
      ...infos
    );
  }
  w(...warnings) {
    console.warn(
      this.prefix + " [WARNING] ",
      "color:#111 ;background-color:#ffa500;",
      ...warnings
    );
  }
  e(...errors) {
    console.error(
      this.prefix + " [ERROR] ",
      "color:#111 ;background-color:#ff0000;",
      ...errors
    );
  }
  d(...data) {
    console.log(
      this.prefix + " [DATA] ",
      "color:#333 ;background-color: #fff;",
      ...data
    );
  }
};
var iLog = new ILog();
function DoLog(level = 3 /* Info */, ...msgOrElement) {
  switch (level) {
    case 1 /* Error */:
      iLog.e(...msgOrElement);
      break;
    case 2 /* Warning */:
      iLog.w(...msgOrElement);
      break;
    case 3 /* Info */:
      iLog.i(...msgOrElement);
      break;
    case 4 /* Elements */:
    case 0 /* None */:
    default:
      iLog.v(...msgOrElement);
  }
}

// src/databases/index.ts
var INDEX_DB_NAME = "PIXIV_PREVIEWER_L";
var INDEX_DB_VERSION = 1;
var ILLUSTRATION_DETAILS_CACHE_TABLE_KEY = "illustrationDetailsCache";
var ILLUSTRATION_DETAILS_CACHE_TIME = 1e3 * 60 * 60 * 6;
var NEW_ILLUSTRATION_NOT_CACHE_TIME = 1e3 * 60 * 60 * 1;
var request = indexedDB.open(INDEX_DB_NAME, INDEX_DB_VERSION);
var db;
request.onupgradeneeded = (event) => {
  const db2 = event.target.result;
  db2.createObjectStore(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY, {
    keyPath: "id"
  });
};
request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Open IndexedDB successfully:", db);
  deleteExpiredIllustrationDetails();
};
request.onerror = (event) => {
  iLog.e(`An error occurred while requesting IndexedDB`, event);
};
var cacheIllustrationDetails = (illustrations, now = /* @__PURE__ */ new Date()) => {
  return new Promise(() => {
    const cachedIllustrationDetailsObjectStore = db.transaction(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY, "readwrite").objectStore(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY);
    illustrations.forEach((illustration) => {
      const uploadTimestamp = illustration.uploadTimestamp * 1e3;
      if (now.getTime() - uploadTimestamp > NEW_ILLUSTRATION_NOT_CACHE_TIME) {
        const illustrationDetails = {
          ...illustration,
          cacheDate: now
        };
        const addCachedIllustrationDetailsRequest = cachedIllustrationDetailsObjectStore.put(illustrationDetails);
        addCachedIllustrationDetailsRequest.onerror = (event) => {
          iLog.e(`An error occurred while caching illustration details`, event);
        };
      }
    });
  });
};
var getCachedIllustrationDetails = (id, now = /* @__PURE__ */ new Date()) => {
  return new Promise((resolve) => {
    const cachedIllustrationDetailsObjectStore = db.transaction(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY, "readwrite").objectStore(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY);
    const getCachedIllustrationDetailsRequest = cachedIllustrationDetailsObjectStore.get(id);
    getCachedIllustrationDetailsRequest.onsuccess = (event) => {
      const illustrationDetails = event.target.result;
      if (illustrationDetails) {
        const { cacheDate } = illustrationDetails;
        if (now.getTime() - cacheDate.getTime() <= ILLUSTRATION_DETAILS_CACHE_TIME) {
          resolve(illustrationDetails);
        } else {
          cachedIllustrationDetailsObjectStore.delete(id).onerror = (event2) => {
            iLog.e(
              `An error occurred while deleting outdated illustration details`,
              event2
            );
          };
        }
      }
      resolve(null);
    };
    getCachedIllustrationDetailsRequest.onerror = (event) => {
      iLog.e(
        `An error occurred while getting cached illustration details`,
        event
      );
      resolve(null);
    };
  });
};
var deleteCachedIllustrationDetails = (ids) => {
  return new Promise((resolve) => {
    const cachedIllustrationDetailsObjectStore = db.transaction(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY, "readwrite").objectStore(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY);
    for (const id of ids) {
      const deleteCachedIllustrationDetailsRequest = cachedIllustrationDetailsObjectStore.delete(id);
      deleteCachedIllustrationDetailsRequest.onsuccess = () => {
        resolve();
      };
      deleteCachedIllustrationDetailsRequest.onerror = (event) => {
        iLog.w(
          `An error occurred while deleting cached details of illustration ${id}`,
          event
        );
        resolve();
      };
    }
  });
};
function deleteExpiredIllustrationDetails() {
  return new Promise((resolve) => {
    const now = (/* @__PURE__ */ new Date()).getTime();
    const cachedIllustrationDetailsObjectStore = db.transaction(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY, "readwrite").objectStore(ILLUSTRATION_DETAILS_CACHE_TABLE_KEY);
    const getAllRequest = cachedIllustrationDetailsObjectStore.getAll();
    getAllRequest.onsuccess = (event) => {
      const allEntries = event.target.result;
      allEntries.forEach((entry) => {
        if (now - entry.cacheDate.getTime() > ILLUSTRATION_DETAILS_CACHE_TIME) {
          cachedIllustrationDetailsObjectStore.delete(entry.id);
        }
      });
      resolve();
    };
  });
}

// src/features/hide-favorites.ts
var isHidden = false;
var hideFavorites = () => {
  const svgs = $("svg");
  const favoriteSvgs = svgs.filter(function() {
    return $(this).css("color") === "rgb(255, 64, 96)";
  });
  favoriteSvgs.each(function() {
    const listItem = $(this).closest("li");
    listItem.hide();
    listItem.attr("data-pp-fav-hidden", "true");
  });
  isHidden = true;
};

// src/icons/download.svg
var download_default = '<svg t="1742281193586" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"\n  p-id="24408" width="10" height="10">\n  <path\n    d="M1024 896v128H0v-320h128v192h768v-192h128v192zM576 554.688L810.688 320 896 405.312l-384 384-384-384L213.312 320 448 554.688V0h128v554.688z"\n    fill="#ffffff" p-id="24409"></path>\n</svg>';

// src/icons/loading.svg
var loading_default = '<svg t="1742282291278" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"\n  p-id="38665" width="48" height="48">\n  <path\n    d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3 0.1 19.9-16 36-35.9 36z"\n    p-id="38666" fill="#1296db"></path>\n</svg>';

// src/icons/page.svg
var page_default = '<svg viewBox="0 0 10 10" width="10" height="10">\n  <path\n    d="M 8 3 C 8.55228 3 9 3.44772 9 4 L 9 9 C 9 9.55228 8.55228 10 8 10 L 3 10 C 2.44772 10 2 9.55228 2 9 L 6 9 C 7.10457 9 8 8.10457 8 7 L 8 3 Z M 1 1 L 6 1 C 6.55228 1 7 1.44772 7 2 L 7 7 C 7 7.55228 6.55228 8 6 8 L 1 8 C 0.447715 8 0 7.55228 0 7 L 0 2 C 0 1.44772 0.447715 1 1 1 Z"\n    fill="#ffffff"></path>\n</svg>';

// src/utils/utils.ts
var pause = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
var convertObjectKeysFromSnakeToCamel = (obj) => {
  function snakeToCamel(snake) {
    return snake.replace(/_([a-z])/g, (result) => result[1].toUpperCase());
  }
  const newResponse = {};
  for (const key in obj) {
    newResponse[snakeToCamel(key)] = obj[key];
  }
  return newResponse;
};

// src/services/request.ts
var xmlHttpRequest = window.GM.xmlHttpRequest;
var request2 = (options) => {
  const { headers, ...restOptions } = options;
  return xmlHttpRequest({
    responseType: "json",
    ...restOptions,
    headers: {
      referer: "https://www.pixiv.net/",
      ...headers
    }
  });
};
var requestWithRetry = async (options) => {
  const {
    retryDelay = 1e4,
    maxRetryTimes = Infinity,
    onRetry,
    ...restOptions
  } = options;
  let response;
  let retryTimes = 0;
  while (retryTimes < maxRetryTimes) {
    response = await request2(restOptions);
    if (response.status === 200) {
      const responseData = response.response;
      if (!responseData.error) {
        return response;
      }
    }
    retryTimes += 1;
    onRetry?.(response, retryTimes);
    await pause(retryDelay);
  }
  throw new Error(
    `Request for ${restOptions.url} failed: ${response.responseText}`
  );
};
var request_default = request2;

// src/services/download.ts
var downloadFile = (url, filename, options = {}) => {
  const { onload, onerror, ...restOptions } = options;
  request_default({
    ...restOptions,
    url,
    method: "GET",
    responseType: "blob",
    onload: (resp) => {
      onload?.(resp);
      const blob = new Blob([resp.response], {
        // @ts-expect-error: specified in request options
        type: resp.responseType
      });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    },
    onerror: (resp) => {
      onerror?.(resp);
      iLog.e(`Download ${filename} from ${url} failed: ${resp.responseText}`);
    }
  });
};

// src/services/illustration.ts
var getIllustrationDetailsWithCache = async (id, retry = false) => {
  let illustDetails = await getCachedIllustrationDetails(id);
  if (illustDetails) {
    iLog.d(`Use cached details of illustration ${id}`, illustDetails);
  } else {
    const requestUrl = `/touch/ajax/illust/details?illust_id=${id}`;
    const getIllustDetailsRes = retry ? await requestWithRetry({
      url: requestUrl,
      onRetry: (response, retryTimes) => {
        iLog.w(
          `Get illustration details via api \`${requestUrl}\` failed:`,
          response,
          `${retryTimes} times retrying...`
        );
      }
    }) : await request_default({ url: requestUrl });
    if (getIllustDetailsRes.status === 200) {
      illustDetails = convertObjectKeysFromSnakeToCamel(
        getIllustDetailsRes.response.body.illust_details
      );
      cacheIllustrationDetails([illustDetails]);
    } else {
      illustDetails = null;
    }
  }
  return illustDetails;
};
var getUserIllustrations = async (userId) => {
  const response = await request_default({
    url: `/ajax/user/${userId}/profile/all?sensitiveFilterMode=userSetting&lang=zh`
  });
  const responseData = response.response.body;
  const illusts = Object.keys(responseData.illusts).reverse();
  const manga = Object.keys(responseData.manga).reverse();
  const artworks = [...illusts, ...manga].sort((a, b) => Number(b) - Number(a));
  return {
    illusts,
    manga,
    artworks
  };
};
var getUserIllustrationsWithCache = async (userId, { onRequesting } = {}) => {
  let userIllustrations = {
    illusts: [],
    manga: [],
    artworks: []
  };
  const userIllustrationsCacheKey = `PIXIV_PREVIEWER_CACHED_ARTWORKS_OF_USER_${userId}`;
  try {
    const userIllustrationsCacheString = sessionStorage.getItem(
      userIllustrationsCacheKey
    );
    if (!userIllustrationsCacheString)
      throw new Error("Illustrations cache not existed.");
    userIllustrations = JSON.parse(userIllustrationsCacheString);
  } catch (error) {
    iLog.i(
      `Get illustrations of current user from session storage failed, re-getting...`,
      error
    );
    onRequesting?.();
    userIllustrations = await getUserIllustrations(userId);
    sessionStorage.setItem(
      userIllustrationsCacheKey,
      JSON.stringify(userIllustrations)
    );
  }
  return userIllustrations;
};

// src/services/preview.ts
var downloadIllust = ({
  url,
  filename,
  options = {}
}) => {
  downloadFile(url, filename, {
    ...options,
    onerror: () => {
      window.open(url, "__blank");
    }
  });
};
var getIllustPagesRequestUrl = (id) => {
  return `/ajax/illust/${id}/pages`;
};
var getUgoiraMetadataRequestUrl = (id) => {
  return `/ajax/illust/${id}/ugoira_meta`;
};

// src/utils/debounce.ts
function debounce(func, delay = 100) {
  let timeout = null;
  return function(...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
var debounce_default = debounce;

// src/utils/event.ts
var stopEventPropagation = (event) => {
  event.stopPropagation();
};

// src/utils/illustration.ts
var checkIsR18 = (tags) => {
  const R18_TAGS = ["r-18", "r18"];
  for (const tag of tags) {
    if (R18_TAGS.includes(tag.toLowerCase())) {
      return true;
    }
  }
  return false;
};
var checkIsUgoira = (illustType) => {
  return illustType === 2 /* UGOIRA */;
};
var checkIsAiGenerated = (aiType) => {
  return aiType === 2 /* AI */;
};
var checkIsAiAssisted = (tags) => {
  for (const tag of tags) {
    if (AI_ASSISTED_TAGS.includes(tag.toLowerCase())) {
      return true;
    }
  }
  return false;
};

// src/utils/mouse-monitor.ts
var MouseMonitor = class {
  /** 鼠标相对网页的位置 */
  mousePos = [0, 0];
  /** 鼠标相对视窗的绝对位置 */
  mouseAbsPos = [0, 0];
  constructor() {
    document.addEventListener("mousemove", (mouseMoveEvent) => {
      this.mousePos = [mouseMoveEvent.pageX, mouseMoveEvent.pageY];
      this.mouseAbsPos = [mouseMoveEvent.clientX, mouseMoveEvent.clientY];
    });
  }
};
var mouseMonitor = new MouseMonitor();
var mouse_monitor_default = mouseMonitor;

// src/utils/ugoira-player.ts
function ZipImagePlayer(options) {
  this.op = options;
  this._URL = window.URL || window.webkitURL || window.MozURL || window.MSURL;
  this._Blob = window.Blob || window.WebKitBlob || window.MozBlob || window.MSBlob;
  this._BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  this._Uint8Array = window.Uint8Array || window.WebKitUint8Array || window.MozUint8Array || window.MSUint8Array;
  this._DataView = window.DataView || window.WebKitDataView || window.MozDataView || window.MSDataView;
  this._ArrayBuffer = window.ArrayBuffer || window.WebKitArrayBuffer || window.MozArrayBuffer || window.MSArrayBuffer;
  this._maxLoadAhead = 0;
  if (!this._URL) {
    this._debugLog("No URL support! Will use slower data: URLs.");
    this._maxLoadAhead = 10;
  }
  if (!this._Blob) {
    this._error("No Blob support");
  }
  if (!this._Uint8Array) {
    this._error("No Uint8Array support");
  }
  if (!this._DataView) {
    this._error("No DataView support");
  }
  if (!this._ArrayBuffer) {
    this._error("No ArrayBuffer support");
  }
  this._isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
  this._loadingState = 0;
  this._dead = false;
  this._context = options.canvas.getContext("2d");
  this._files = {};
  this._frameCount = this.op.metadata.frames.length;
  this._debugLog("Frame count: " + this._frameCount);
  this._frame = 0;
  this._loadFrame = 0;
  this._frameImages = [];
  this._paused = false;
  this._loadTimer = null;
  this._startLoad();
  if (this.op.autoStart) {
    this.play();
  } else {
    this._paused = true;
  }
}
ZipImagePlayer.prototype = {
  _trailerBytes: 3e4,
  _failed: false,
  _mkerr: function(msg) {
    const _this = this;
    return function() {
      _this._error(msg);
    };
  },
  _error: function(msg) {
    this._failed = true;
    throw Error("ZipImagePlayer error: " + msg);
  },
  _debugLog: function(msg) {
    if (this.op.debug) {
      console.log(msg);
    }
  },
  _load: function(offset, length, callback) {
    const _this = this;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      "load",
      function() {
        if (_this._dead) {
          return;
        }
        _this._debugLog(
          "Load: " + offset + " " + length + " status=" + xhr.status
        );
        if (xhr.status == 200) {
          _this._debugLog("Range disabled or unsupported, complete load");
          offset = 0;
          length = xhr.response.byteLength;
          _this._len = length;
          _this._buf = xhr.response;
          _this._bytes = new _this._Uint8Array(_this._buf);
        } else {
          if (xhr.status != 206) {
            _this._error("Unexpected HTTP status " + xhr.status);
          }
          if (xhr.response.byteLength != length) {
            _this._error(
              "Unexpected length " + xhr.response.byteLength + " (expected " + length + ")"
            );
          }
          _this._bytes.set(new _this._Uint8Array(xhr.response), offset);
        }
        if (callback) {
          callback.apply(_this, [offset, length]);
        }
      },
      false
    );
    xhr.addEventListener("error", this._mkerr("Fetch failed"), false);
    xhr.open("GET", this.op.source);
    xhr.responseType = "arraybuffer";
    if (offset != null && length != null) {
      const end = offset + length;
      xhr.setRequestHeader("Range", "bytes=" + offset + "-" + (end - 1));
      if (this._isSafari) {
        xhr.setRequestHeader("Cache-control", "no-cache");
        xhr.setRequestHeader("If-None-Match", Math.random().toString());
      }
    }
    xhr.send();
  },
  _startLoad: function() {
    const _this = this;
    if (!this.op.source) {
      this._loadNextFrame();
      return;
    }
    $.ajax({
      url: this.op.source,
      type: "HEAD"
    }).done(function(data, status, xhr) {
      if (_this._dead) {
        return;
      }
      _this._pHead = 0;
      _this._pNextHead = 0;
      _this._pFetch = 0;
      const len = parseInt(String(xhr.getResponseHeader("Content-Length")));
      if (!len) {
        _this._debugLog("HEAD request failed: invalid file length.");
        _this._debugLog("Falling back to full file mode.");
        _this._load(null, null, function(off2, len2) {
          _this._pTail = 0;
          _this._pHead = len2;
          _this._findCentralDirectory();
        });
        return;
      }
      _this._debugLog("Len: " + len);
      _this._len = len;
      _this._buf = new _this._ArrayBuffer(len);
      _this._bytes = new _this._Uint8Array(_this._buf);
      let off = len - _this._trailerBytes;
      if (off < 0) {
        off = 0;
      }
      _this._pTail = len;
      _this._load(off, len - off, function(off2) {
        _this._pTail = off2;
        _this._findCentralDirectory();
      });
    }).fail(this._mkerr("Length fetch failed"));
  },
  _findCentralDirectory: function() {
    const dv = new this._DataView(this._buf, this._len - 22, 22);
    if (dv.getUint32(0, true) != 101010256) {
      this._error("End of Central Directory signature not found");
    }
    const cd_count = dv.getUint16(10, true);
    const cd_size = dv.getUint32(12, true);
    const cd_off = dv.getUint32(16, true);
    if (cd_off < this._pTail) {
      this._load(cd_off, this._pTail - cd_off, function() {
        this._pTail = cd_off;
        this._readCentralDirectory(cd_off, cd_size, cd_count);
      });
    } else {
      this._readCentralDirectory(cd_off, cd_size, cd_count);
    }
  },
  _readCentralDirectory: function(offset, size, count) {
    const dv = new this._DataView(this._buf, offset, size);
    let p = 0;
    for (let i = 0; i < count; i++) {
      if (dv.getUint32(p, true) != 33639248) {
        this._error("Invalid Central Directory signature");
      }
      const compMethod = dv.getUint16(p + 10, true);
      const uncompSize = dv.getUint32(p + 24, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const cmtLen = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true);
      if (compMethod != 0) {
        this._error("Unsupported compression method");
      }
      p += 46;
      const nameView = new this._Uint8Array(this._buf, offset + p, nameLen);
      let name = "";
      for (let j = 0; j < nameLen; j++) {
        name += String.fromCharCode(nameView[j]);
      }
      p += nameLen + extraLen + cmtLen;
      this._files[name] = { off, len: uncompSize };
    }
    if (this._pHead >= this._pTail) {
      this._pHead = this._len;
      $(this).triggerHandler("loadProgress", [this._pHead / this._len]);
      this._loadNextFrame();
    } else {
      this._loadNextChunk();
      this._loadNextChunk();
    }
  },
  _loadNextChunk: function() {
    if (this._pFetch >= this._pTail) {
      return;
    }
    const off = this._pFetch;
    let len = this.op.chunkSize;
    if (this._pFetch + len > this._pTail) {
      len = this._pTail - this._pFetch;
    }
    this._pFetch += len;
    this._load(off, len, function() {
      if (off == this._pHead) {
        if (this._pNextHead) {
          this._pHead = this._pNextHead;
          this._pNextHead = 0;
        } else {
          this._pHead = off + len;
        }
        if (this._pHead >= this._pTail) {
          this._pHead = this._len;
        }
        $(this).triggerHandler("loadProgress", [this._pHead / this._len]);
        if (!this._loadTimer) {
          this._loadNextFrame();
        }
      } else {
        this._pNextHead = off + len;
      }
      this._loadNextChunk();
    });
  },
  _fileDataStart: function(offset) {
    const dv = new DataView(this._buf, offset, 30);
    const nameLen = dv.getUint16(26, true);
    const extraLen = dv.getUint16(28, true);
    return offset + 30 + nameLen + extraLen;
  },
  _isFileAvailable: function(name) {
    const info = this._files[name];
    if (!info) {
      this._error("File " + name + " not found in ZIP");
    }
    if (this._pHead < info.off + 30) {
      return false;
    }
    return this._pHead >= this._fileDataStart(info.off) + info.len;
  },
  _loadNextFrame: function() {
    if (this._dead) {
      return;
    }
    const frame = this._loadFrame;
    if (frame >= this._frameCount) {
      return;
    }
    const meta = this.op.metadata.frames[frame];
    if (!this.op.source) {
      this._loadFrame += 1;
      this._loadImage(frame, meta.file, false);
      return;
    }
    if (!this._isFileAvailable(meta.file)) {
      return;
    }
    this._loadFrame += 1;
    const off = this._fileDataStart(this._files[meta.file].off);
    const end = off + this._files[meta.file].len;
    let url;
    const mime_type = this.op.metadata.mime_type || "image/png";
    if (this._URL) {
      let slice;
      if (!this._buf.slice) {
        slice = new this._ArrayBuffer(this._files[meta.file].len);
        const view = new this._Uint8Array(slice);
        view.set(this._bytes.subarray(off, end));
      } else {
        slice = this._buf.slice(off, end);
      }
      let blob;
      try {
        blob = new this._Blob([slice], { type: mime_type });
      } catch (err) {
        this._debugLog(
          "Blob constructor failed. Trying BlobBuilder... (" + err.message + ")"
        );
        const bb = new this._BlobBuilder();
        bb.append(slice);
        blob = bb.getBlob();
      }
      url = this._URL.createObjectURL(blob);
      this._loadImage(frame, url, true);
    } else {
      url = "data:" + mime_type + ";base64," + base64ArrayBuffer(this._buf, off, end - off);
      this._loadImage(frame, url, false);
    }
  },
  _loadImage: function(frame, url, isBlob) {
    const _this = this;
    const image = new Image();
    const meta = this.op.metadata.frames[frame];
    image.addEventListener("load", function() {
      _this._debugLog("Loaded " + meta.file + " to frame " + frame);
      if (isBlob) {
        _this._URL.revokeObjectURL(url);
      }
      if (_this._dead) {
        return;
      }
      _this._frameImages[frame] = image;
      $(_this).triggerHandler("frameLoaded", frame);
      if (_this._loadingState == 0) {
        _this._displayFrame.apply(_this);
      }
      if (frame >= _this._frameCount - 1) {
        _this._setLoadingState(2);
        _this._buf = null;
        _this._bytes = null;
      } else {
        if (!_this._maxLoadAhead || frame - _this._frame < _this._maxLoadAhead) {
          _this._loadNextFrame();
        } else if (!_this._loadTimer) {
          _this._loadTimer = setTimeout(function() {
            _this._loadTimer = null;
            _this._loadNextFrame();
          }, 200);
        }
      }
    });
    image.src = url;
  },
  _setLoadingState: function(state) {
    if (this._loadingState != state) {
      this._loadingState = state;
      $(this).triggerHandler("loadingStateChanged", [state]);
    }
  },
  _displayFrame: function() {
    if (this._dead) {
      return;
    }
    const _this = this;
    const meta = this.op.metadata.frames[this._frame];
    this._debugLog("Displaying frame: " + this._frame + " " + meta.file);
    const image = this._frameImages[this._frame];
    if (!image) {
      this._debugLog("Image not available!");
      this._setLoadingState(0);
      return;
    }
    if (this._loadingState != 2) {
      this._setLoadingState(1);
    }
    if (this.op.autosize) {
      if (this._context.canvas.width != image.width || this._context.canvas.height != image.height) {
        this._context.canvas.width = image.width;
        this._context.canvas.height = image.height;
      }
    }
    this._context.clearRect(0, 0, this.op.canvas.width, this.op.canvas.height);
    this._context.drawImage(image, 0, 0);
    $(this).triggerHandler("frame", this._frame);
    if (!this._paused) {
      this._timer = setTimeout(function() {
        _this._timer = null;
        _this._nextFrame.apply(_this);
      }, meta.delay);
    }
  },
  _nextFrame: function() {
    if (this._frame >= this._frameCount - 1) {
      if (this.op.loop) {
        this._frame = 0;
      } else {
        this.pause();
        return;
      }
    } else {
      this._frame += 1;
    }
    this._displayFrame();
  },
  play: function() {
    if (this._dead) {
      return;
    }
    if (this._paused) {
      $(this).triggerHandler("play", [this._frame]);
      this._paused = false;
      this._displayFrame();
    }
  },
  pause: function() {
    if (this._dead) {
      return;
    }
    if (!this._paused) {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._paused = true;
      $(this).triggerHandler("pause", [this._frame]);
    }
  },
  rewind: function() {
    if (this._dead) {
      return;
    }
    this._frame = 0;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._displayFrame();
  },
  stop: function() {
    this._debugLog("Stopped!");
    this._dead = true;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    if (this._loadTimer) {
      clearTimeout(this._loadTimer);
    }
    this._frameImages = null;
    this._buf = null;
    this._bytes = null;
    $(this).triggerHandler("stop");
  },
  getCurrentFrame: function() {
    return this._frame;
  },
  getLoadedFrames: function() {
    return this._frameImages.length;
  },
  getFrameCount: function() {
    return this._frameCount;
  },
  hasError: function() {
    return this._failed;
  }
};
function base64ArrayBuffer(arrayBuffer, off, byteLength) {
  let base64 = "";
  const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes = new Uint8Array(arrayBuffer);
  const byteRemainder = byteLength % 3;
  const mainLength = off + byteLength - byteRemainder;
  let a, b, c, d;
  let chunk;
  for (let i = off; i < mainLength; i = i + 3) {
    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder == 2) {
    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }
  return base64;
}
var ugoira_player_default = ZipImagePlayer;

// src/features/preview.ts
var isInitialized = false;
var loadIllustPreview = (options) => {
  if (isInitialized) return;
  const { previewDelay, enableAnimePreview, linkBlank } = options;
  const mouseHoverDebounceWait = previewDelay / 5;
  const mouseHoverPreviewWait = previewDelay - mouseHoverDebounceWait;
  const getIllustMetadata = (target) => {
    let imgLink = target;
    while (!imgLink.is("A")) {
      imgLink = imgLink.parent();
      if (!imgLink.length) {
        return null;
      }
    }
    const illustHref = imgLink.attr("href");
    const illustHrefMatch = illustHref?.match(/\/artworks\/(\d+)(#(\d+))?/);
    if (!illustHrefMatch) {
      return null;
    }
    const illustId = illustHrefMatch[1];
    const previewPage = Number(illustHrefMatch[3] ?? 1);
    const ugoiraSvg = imgLink.children("div:first").find("svg:first");
    const illustType = ugoiraSvg.length || imgLink.hasClass("ugoku-illust") ? 2 /* UGOIRA */ : (
      // 合并漫画类型作品 IllustType.MANGA 为 IllustType.ILLUST 统一处理
      0 /* ILLUST */
    );
    return {
      /** 作品 ID */
      illustId,
      /** 作品页码 */
      previewPage,
      /** 作品类型 */
      illustType,
      /** 作品链接 DOM */
      illustLinkDom: imgLink
    };
  };
  const previewIllust = (() => {
    const previewedIllust = new PreviewedIllust();
    let currentHoveredIllustId = "";
    let getIllustPagesRequest = $.ajax();
    const getIllustPagesCache = {};
    const getUgoiraMetadataCache = {};
    return ({
      target,
      illustId,
      previewPage = 1,
      illustType
    }) => {
      getIllustPagesRequest.abort();
      currentHoveredIllustId = illustId;
      if (illustType === 2 /* UGOIRA */ && !enableAnimePreview) {
        iLog.i("\u52A8\u56FE\u9884\u89C8\u5DF2\u7981\u7528\uFF0C\u8DF3\u8FC7");
        return;
      }
      if ([0 /* ILLUST */, 1 /* MANGA */].includes(illustType)) {
        if (getIllustPagesCache[illustId]) {
          previewedIllust.setImage({
            illustId,
            illustElement: target,
            previewPage,
            ...getIllustPagesCache[illustId]
          });
          return;
        }
        getIllustPagesRequest = $.ajax(getIllustPagesRequestUrl(illustId), {
          method: "GET",
          success: (data) => {
            if (data.error) {
              iLog.e(
                `An error occurred while requesting preview urls of illust ${illustId}: ${data.message}`
              );
              return;
            }
            const urls = data.body.map((item) => item.urls);
            const regularUrls = urls.map((url) => url.regular);
            const originalUrls = urls.map((url) => url.original);
            getIllustPagesCache[illustId] = {
              regularUrls,
              originalUrls
            };
            if (currentHoveredIllustId !== illustId) return;
            previewedIllust.setImage({
              illustId,
              illustElement: target,
              previewPage,
              regularUrls,
              originalUrls
            });
          },
          error: (err) => {
            iLog.e(
              `An error occurred while requesting preview urls of illust ${illustId}: ${err}`
            );
          }
        });
      } else if (illustType === 2 /* UGOIRA */) {
        if (getUgoiraMetadataCache[illustId]) {
          previewedIllust.setUgoira({
            illustId,
            illustElement: target,
            ...getUgoiraMetadataCache[illustId]
          });
          return;
        }
        getIllustPagesRequest = $.ajax(getUgoiraMetadataRequestUrl(illustId), {
          method: "GET",
          success: (data) => {
            if (data.error) {
              iLog.e(
                `An error occurred while requesting metadata of ugoira ${illustId}: ${data.message}`
              );
              return;
            }
            getUgoiraMetadataCache[illustId] = data.body;
            if (currentHoveredIllustId !== illustId) return;
            const { src, originalSrc, mime_type, frames } = data.body;
            previewedIllust.setUgoira({
              illustId,
              illustElement: target,
              src,
              originalSrc,
              mime_type,
              frames
            });
          },
          error: (err) => {
            iLog.e(
              `An error occurred while requesting metadata of ugoira ${illustId}: ${err.responseText}`
            );
          }
        });
      } else {
        iLog.e("Unknown illust type.");
        return;
      }
    };
  })();
  const onMouseOverIllust = (target) => {
    const { illustId, previewPage, illustType, illustLinkDom } = getIllustMetadata(target) || {};
    if (illustId === void 0 || illustType === void 0) {
      return;
    }
    if (linkBlank) {
      illustLinkDom.attr({ target: "_blank", rel: "external" });
      illustLinkDom.off("click", stopEventPropagation);
      illustLinkDom.on("click", stopEventPropagation);
    }
    const previewIllustTimeout = setTimeout(() => {
      previewIllust({ target, illustId, previewPage, illustType });
    }, mouseHoverPreviewWait);
    const onMouseMove = (mouseMoveEvent) => {
      if (mouseMoveEvent.ctrlKey || mouseMoveEvent.metaKey) {
        clearTimeout(previewIllustTimeout);
        target.off("mousemove", onMouseMove);
      }
    };
    target.on("mousemove", onMouseMove);
    const onMouseOut = () => {
      clearTimeout(previewIllustTimeout);
      target.off("mouseout", onMouseOut);
    };
    target.on("mouseout", onMouseOut);
  };
  const onMouseMoveDocument = (() => {
    const debouncedOnMouseOverIllust = debounce_default(
      onMouseOverIllust,
      mouseHoverDebounceWait
    );
    let prevTarget;
    return (mouseMoveEvent) => {
      if (mouseMoveEvent.ctrlKey || mouseMoveEvent.metaKey) {
        return;
      }
      const currentTarget = $(
        mouseMoveEvent.target
      );
      if (currentTarget.is(prevTarget)) {
        return;
      }
      prevTarget = currentTarget;
      debouncedOnMouseOverIllust(currentTarget);
    };
  })();
  $(document).on("mousemove", onMouseMoveDocument);
  (function inactiveUnexpectedDoms() {
    const styleRules = $("<style>").prop("type", "text/css");
    styleRules.append(`
@keyframes pp-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`);
    styleRules.append(`
._layout-thumbnail img + div {
  pointer-events: none;
}`);
    styleRules.appendTo("head");
  })();
  isInitialized = true;
};
var PreviewedIllust = class {
  /** 当前正在预览的作品的 ID */
  illustId = "";
  /** 当前正在预览的作品的详细信息 */
  illustDetails = null;
  /** 当前正在预览的作品 DOM 元素 */
  illustElement = $();
  /** 当前预览的作品是否加载完毕 */
  illustLoaded = false;
  /** 图片的链接 */
  regularUrls = [];
  /** 图片的原图链接 */
  originalUrls = [];
  /** 当前预览图片的页数 */
  currentPage = 1;
  /** 当前预览图片的总页数 */
  pageCount = 1;
  /** 预览图片或动图容器 DOM */
  previewWrapperElement = $();
  /** 预览容器顶部栏 DOM */
  previewWrapperHeader = $();
  /** 当前预览作品的元数据 */
  illustMeta = $();
  /** 当前预览的是第几张图片标记 DOM */
  pageCountElement = $();
  pageCountText = $();
  /** 下载原图按钮 DOM */
  downloadOriginalElement = $();
  /** 预览图片或动图加载状态 DOM */
  previewLoadingElement = $();
  /** 当前预览的图片或动图 DOM */
  previewImageElement = $();
  /** 预加载图片的列表 */
  #images = [];
  /** 保存的鼠标位置 */
  #prevMousePos = [0, 0];
  /** 当前预览图片的实际尺寸 */
  #currentIllustSize = [0, 0];
  /** 当前预览的动图播放器 */
  // @ts-expect-error: ignore type defines
  #currentUgoiraPlayer;
  constructor() {
    this.reset();
  }
  /** 初始化预览组件 */
  reset() {
    this.illustId = "";
    this.illustDetails = null;
    this.illustElement = $();
    this.illustLoaded = false;
    this.regularUrls = [];
    this.originalUrls = [];
    this.currentPage = 1;
    this.pageCount = 1;
    this.previewWrapperElement?.remove();
    this.previewWrapperElement = $(document.createElement("div")).attr({ id: "pp-wrapper" }).css({
      position: "fixed",
      "z-index": "999999",
      border: `${PREVIEW_WRAPPER_BORDER_WIDTH}px solid rgb(0, 150, 250)`,
      "border-radius": `${PREVIEW_WRAPPER_BORDER_RADIUS}px`,
      background: "rgba(31, 31, 31, 0.8)",
      "backdrop-filter": "blur(4px)",
      "text-align": "center"
    }).hide().appendTo($("body"));
    this.previewWrapperHeader = $(document.createElement("div")).css({
      position: "absolute",
      top: "0px",
      left: "0px",
      right: "0px",
      padding: "5px",
      display: "flex",
      gap: "5px",
      "align-items": "center"
    }).hide().appendTo(this.previewWrapperElement);
    this.illustMeta = $(document.createElement("div")).css({
      display: "flex",
      gap: "5px",
      "align-items": "center",
      "margin-right": "auto"
    }).appendTo(this.previewWrapperHeader);
    this.pageCountText = $(document.createElement("span")).text("1/1");
    this.pageCountElement = $(document.createElement("div")).css({
      height: "20px",
      "border-radius": "12px",
      color: "white",
      background: "rgba(0, 0, 0, 0.32)",
      "font-size": "12px",
      "line-height": "1",
      "font-weight": "bold",
      padding: "3px 6px",
      cursor: "pointer",
      display: "flex",
      "align-items": "center",
      gap: "4px"
    }).append(page_default).append(this.pageCountText).hide().appendTo(this.previewWrapperHeader);
    this.downloadOriginalElement = $(document.createElement("a")).css({
      height: "20px",
      "border-radius": "12px",
      color: "white",
      background: "rgba(0, 0, 0, 0.32)",
      "font-size": "12px",
      "line-height": "1",
      "font-weight": "bold",
      padding: "3px 6px",
      cursor: "pointer",
      display: "flex",
      "align-items": "center",
      gap: "4px"
    }).append(`${download_default}<span>\u539F\u56FE</span>`).appendTo(this.previewWrapperHeader);
    this.previewLoadingElement = $(loading_default).css({ padding: "12px", animation: "pp-spin 1s linear infinite" }).appendTo(this.previewWrapperElement);
    this.previewImageElement = $(new Image()).css({
      "border-radius": `${PREVIEW_WRAPPER_BORDER_RADIUS}px`
    }).hide().appendTo(this.previewWrapperElement);
    this.#images.forEach((image) => {
      if (image) image.src = "";
    });
    this.#images = [];
    this.#prevMousePos = [0, 0];
    this.#currentIllustSize = [0, 0];
    this.#currentUgoiraPlayer?.stop();
    this.unbindPreviewImageEvents();
    this.unbindUgoiraPreviewEvents();
  }
  //#region 预览图片功能
  /** 初始化预览容器，默认显示第一张图片 */
  setImage({
    illustId,
    illustElement,
    previewPage = 1,
    regularUrls,
    originalUrls
  }) {
    this.reset();
    this.initPreviewWrapper();
    this.illustId = illustId;
    this.illustElement = illustElement;
    this.regularUrls = regularUrls;
    this.originalUrls = originalUrls;
    this.currentPage = previewPage;
    this.pageCount = regularUrls.length;
    this.preloadImages();
    this.bindPreviewImageEvents();
    this.updatePreviewImage();
    this.showIllustrationDetails();
  }
  bindPreviewImageEvents() {
    this.previewImageElement.on("load", this.onImageLoad);
    this.previewImageElement.on("click", this.onPreviewImageMouseClick);
    this.downloadOriginalElement.on("click", this.onDownloadImage);
    $(document).on("wheel", this.onPreviewImageMouseWheel);
    $(document).on("keydown", this.onPreviewImageKeyDown);
    $(document).on("mousemove", this.onMouseMove);
    window.addEventListener("wheel", this.preventPageZoom, { passive: false });
  }
  unbindPreviewImageEvents() {
    this.previewImageElement.off();
    this.downloadOriginalElement.off();
    $(document).off("wheel", this.onPreviewImageMouseWheel);
    $(document).off("keydown", this.onPreviewImageKeyDown);
    $(document).off("mousemove", this.onMouseMove);
    window.removeEventListener("wheel", this.preventPageZoom);
  }
  /** 显示 pageIndex 指向的图片 */
  updatePreviewImage(page = this.currentPage) {
    const currentImageUrl = this.regularUrls[page - 1];
    this.previewImageElement.attr("src", currentImageUrl);
    this.pageCountText.text(`${page}/${this.pageCount}`);
  }
  onImageLoad = () => {
    this.illustLoaded = true;
    this.previewLoadingElement.hide();
    this.previewImageElement.show();
    this.previewWrapperHeader.show();
    if (this.pageCount > 1) {
      this.pageCountElement.show();
    }
    this.previewImageElement.css({
      width: "",
      height: ""
    });
    this.#currentIllustSize = [
      this.previewImageElement.width() ?? 0,
      this.previewImageElement.height() ?? 0
    ];
    this.adjustPreviewWrapper({
      baseOnMousePos: false
    });
  };
  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage += 1;
    } else {
      this.currentPage = 1;
    }
    this.updatePreviewImage();
    this.preloadImages();
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    } else {
      this.currentPage = this.pageCount;
    }
    this.updatePreviewImage();
  }
  preloadImages(from = this.currentPage - 1, to = this.currentPage - 1 + PREVIEW_PRELOAD_NUM) {
    if (!this.#images.length) {
      this.#images = new Array(this.regularUrls.length);
    }
    for (let i = from; i < to && i < this.regularUrls.length; i += 1) {
      const preloadImage = new Image();
      preloadImage.src = this.regularUrls[i];
      this.#images[i] = preloadImage;
    }
  }
  onPreviewImageMouseClick = () => {
    this.nextPage();
  };
  onPreviewImageMouseWheel = (mouseWheelEvent) => {
    if (mouseWheelEvent.ctrlKey || mouseWheelEvent.metaKey) {
      mouseWheelEvent.preventDefault();
      if (mouseWheelEvent.originalEvent.deltaY > 0) {
        this.nextPage();
      } else {
        this.prevPage();
      }
    }
  };
  onPreviewImageKeyDown = (keyDownEvent) => {
    if (keyDownEvent.ctrlKey || keyDownEvent.metaKey) {
      keyDownEvent.preventDefault();
      switch (keyDownEvent.key) {
        case "ArrowUp":
        case "ArrowRight":
          this.nextPage();
          break;
        case "ArrowDown":
        case "ArrowLeft":
          this.prevPage();
          break;
      }
    }
  };
  onDownloadImage = (onClickEvent) => {
    onClickEvent.preventDefault();
    const currentImageOriginalUrl = this.originalUrls[this.currentPage - 1];
    const currentImageFilename = currentImageOriginalUrl.split("/").pop() || "illust.jpg";
    downloadIllust({
      url: currentImageOriginalUrl,
      filename: currentImageFilename
    });
  };
  //#endregion
  //#region 预览动图功能
  setUgoira({
    illustId,
    illustElement,
    src,
    // originalSrc,
    mime_type,
    frames
  }) {
    this.reset();
    this.initPreviewWrapper();
    this.illustId = illustId;
    this.illustElement = illustElement;
    illustElement.siblings("svg").css({ "pointer-events": "none" });
    this.#currentUgoiraPlayer = this.createUgoiraPlayer({
      source: src,
      metadata: {
        mime_type,
        frames
      }
    });
    this.bindUgoiraPreviewEvents();
    this.showIllustrationDetails();
  }
  createUgoiraPlayer(options) {
    const canvas = document.createElement("canvas");
    const p = new ugoira_player_default({
      canvas,
      chunkSize: 3e5,
      loop: true,
      autoStart: true,
      debug: false,
      ...options
    });
    p.canvas = canvas;
    return p;
  }
  bindUgoiraPreviewEvents() {
    $(this.#currentUgoiraPlayer).on("frameLoaded", this.onUgoiraFrameLoaded);
    $(document).on("mousemove", this.onMouseMove);
  }
  unbindUgoiraPreviewEvents() {
    $(this.#currentUgoiraPlayer).off();
    $(document).off("mousemove", this.onMouseMove);
  }
  onUgoiraFrameLoaded = (ev, frame) => {
    if (frame !== 0) {
      return;
    }
    this.illustLoaded = true;
    this.previewLoadingElement.hide();
    const canvas = $(this.#currentUgoiraPlayer.canvas);
    this.previewImageElement.after(canvas);
    this.previewImageElement.remove();
    this.previewImageElement = canvas;
    const ugoiraOriginWidth = ev.currentTarget._frameImages[0].width;
    const ugoiraOriginHeight = ev.currentTarget._frameImages[0].height;
    this.#currentIllustSize = [ugoiraOriginWidth, ugoiraOriginHeight];
    this.previewImageElement.attr({
      width: ugoiraOriginWidth,
      height: ugoiraOriginHeight
    });
    this.adjustPreviewWrapper({
      baseOnMousePos: false
    });
  };
  //#endregion
  async showIllustrationDetails() {
    const illustrationDetails = await getIllustrationDetailsWithCache(
      this.illustId
    );
    if (illustrationDetails && illustrationDetails.id === this.illustId) {
      this.illustMeta.empty();
      const { aiType, bookmarkId, bookmarkUserTotal, tags } = illustrationDetails;
      const isR18 = checkIsR18(tags);
      const isAi = checkIsAiGenerated(aiType);
      const isAiAssisted = checkIsAiAssisted(tags);
      const illustrationDetailsElements = [];
      const defaultElementCss = {
        height: "20px",
        "border-radius": "12px",
        color: "rgb(245, 245, 245)",
        background: "rgba(0, 0, 0, 0.32)",
        "font-size": "12px",
        "line-height": "1",
        "font-weight": "bold",
        padding: "3px 6px",
        display: "flex",
        "align-items": "center",
        gap: "4px"
      };
      if (isR18) {
        illustrationDetailsElements.push(
          $(document.createElement("div")).css({
            ...defaultElementCss,
            background: "rgb(255, 64, 96)"
          }).text("R-18")
        );
      }
      if (isAi) {
        illustrationDetailsElements.push(
          $(document.createElement("div")).css({
            ...defaultElementCss,
            background: "rgb(29, 78, 216)"
          }).text("AI \u751F\u6210")
        );
      } else if (isAiAssisted) {
        illustrationDetailsElements.push(
          $(document.createElement("div")).css({
            ...defaultElementCss,
            background: "rgb(109, 40, 217)"
          }).text("AI \u8F85\u52A9")
        );
      }
      illustrationDetailsElements.push(
        $(document.createElement("div")).css({
          ...defaultElementCss,
          background: bookmarkUserTotal > 5e4 ? "rgb(159, 18, 57)" : bookmarkUserTotal > 1e4 ? "rgb(220, 38, 38)" : bookmarkUserTotal > 5e3 ? "rgb(29, 78, 216)" : bookmarkUserTotal > 1e3 ? "rgb(21, 128, 61)" : "rgb(71, 85, 105)"
        }).text(`${bookmarkId ? "\u2764\uFE0F" : "\u2764"} ${bookmarkUserTotal}`)
      );
      this.illustMeta.append(illustrationDetailsElements);
    }
  }
  /** 初始化显示预览容器 */
  initPreviewWrapper() {
    this.previewWrapperElement.show();
    this.previewLoadingElement.show();
    this.adjustPreviewWrapper({
      baseOnMousePos: true
    });
  }
  /** 阻止页面缩放事件 */
  preventPageZoom = (mouseWheelEvent) => {
    if (mouseWheelEvent.ctrlKey || mouseWheelEvent.metaKey) {
      mouseWheelEvent.preventDefault();
    }
  };
  /**
   * 根据鼠标移动调整预览容器位置与显隐
   * @param mouseMoveEvent
   */
  onMouseMove = (mouseMoveEvent) => {
    if (mouseMoveEvent.ctrlKey || mouseMoveEvent.metaKey) {
      return;
    }
    const currentElement = $(mouseMoveEvent.target);
    if (currentElement.is(this.illustElement)) {
      this.adjustPreviewWrapper({
        baseOnMousePos: true
      });
    } else {
      this.reset();
    }
  };
  /**
   * 调整预览容器的位置与大小
   * @param `baseOnMousePos` 是否根据当前鼠标所在位置调整
   * @param `illustSize` 作品的实际大小
   */
  adjustPreviewWrapper({
    baseOnMousePos = true
  } = {}) {
    const [mousePosX, mousePosY] = baseOnMousePos ? mouse_monitor_default.mouseAbsPos : this.#prevMousePos;
    this.#prevMousePos = [mousePosX, mousePosY];
    const [illustWidth, illustHeight] = this.#currentIllustSize;
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    const isShowLeft = mousePosX > screenWidth / 2;
    const isShowTop = mousePosY > screenHeight / 2;
    const illustRatio = illustWidth / illustHeight;
    const screenRestWidth = isShowLeft ? mousePosX - PREVIEW_WRAPPER_DISTANCE_TO_MOUSE : screenWidth - mousePosX - PREVIEW_WRAPPER_DISTANCE_TO_MOUSE;
    const screenRestRatio = screenRestWidth / screenHeight;
    const isFitToFullHeight = screenRestRatio > illustRatio;
    let fitToScreenScale = 1;
    if (this.illustLoaded) {
      if (isFitToFullHeight) {
        fitToScreenScale = Number((screenHeight / illustHeight).toFixed(3));
      } else {
        fitToScreenScale = Number((screenRestWidth / illustWidth).toFixed(3));
      }
    }
    const previewImageFitWidth = Math.floor(illustWidth * fitToScreenScale);
    const previewImageFitHeight = Math.floor(illustHeight * fitToScreenScale);
    const previewWrapperElementPos = {
      left: "",
      right: "",
      top: "",
      bottom: ""
    };
    if (isShowLeft) {
      previewWrapperElementPos.right = `${screenWidth - mousePosX + PREVIEW_WRAPPER_DISTANCE_TO_MOUSE}px`;
    } else {
      previewWrapperElementPos.left = `${mousePosX + PREVIEW_WRAPPER_DISTANCE_TO_MOUSE}px`;
    }
    if (this.illustLoaded) {
      if (isFitToFullHeight) {
        previewWrapperElementPos.top = "0px";
      } else {
        const screenRestHeight = isShowTop ? mousePosY : screenHeight - mousePosY;
        if (previewImageFitHeight > screenRestHeight) {
          if (isShowTop) {
            previewWrapperElementPos.top = "0px";
          } else {
            previewWrapperElementPos.bottom = "0px";
          }
        } else {
          if (isShowTop) {
            previewWrapperElementPos.bottom = `${screenHeight - mousePosY}px`;
          } else {
            previewWrapperElementPos.top = `${mousePosY}px`;
          }
        }
      }
    } else {
      if (isShowTop) {
        previewWrapperElementPos.bottom = `${screenHeight - mousePosY}px`;
      } else {
        previewWrapperElementPos.top = `${mousePosY}px`;
      }
    }
    this.previewWrapperElement.css(previewWrapperElementPos);
    this.previewImageElement.css({
      width: `${previewImageFitWidth}px`,
      height: `${previewImageFitHeight}px`
    });
  }
};

// src/i18n/index.ts
var Texts = {
  install_title: "\u6B22\u8FCE\u4F7F\u7528 Pixiv Previewer (LolipopJ Edition) v",
  upgrade_body: `<div>
  <p style="line-height: 1.6;">
    \u672C\u811A\u672C\u57FA\u4E8E
    <a
      style="color: skyblue"
      href="https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer"
      target="_blank"
      >Pixiv Previewer</a
    >
    \u4E8C\u6B21\u5F00\u53D1\uFF0C\u65E8\u5728\u6EE1\u8DB3\u5F00\u53D1\u8005\u81EA\u5DF1\u9700\u8981\u7684\u80FD\u529B\u3002\u5982\u679C\u60A8\u6709\u4E0D\u9519\u7684\u60F3\u6CD5\u6216\u5EFA\u8BAE\uFF0C\u8BF7\u524D\u5F80\u539F\u811A\u672C\u7684
    <a
      style="color: skyblue"
      href="https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/feedback"
      target="_blank"
      >Greasy Fork \u53CD\u9988\u9875\u9762</a
    >\u6216\u5F00\u542F\u4E00\u4E2A\u65B0\u7684
    <a
      style="color: skyblue"
      href="https://github.com/Ocrosoft/PixivPreviewer/issues"
      target="_blank"
      >Github \u8BAE\u9898</a
    >\uFF01
  </p>
</div>
`,
  setting_language: "\u8BED\u8A00",
  setting_preview: "\u9884\u89C8",
  setting_animePreview: "\u52A8\u56FE\u9884\u89C8",
  setting_sort: "\u641C\u7D22\u9875\u81EA\u52A8\u6392\u5E8F",
  setting_anime: "\u52A8\u56FE\u4E0B\u8F7D\uFF08\u52A8\u56FE\u9884\u89C8\u53CA\u8BE6\u60C5\u9875\u751F\u6548\uFF09",
  setting_origin: "\u9884\u89C8\u65F6\u4F18\u5148\u663E\u793A\u539F\u56FE\uFF08\u6162\uFF09",
  setting_previewDelay: "\u5EF6\u8FDF\u663E\u793A\u9884\u89C8\u56FE\uFF08\u6BEB\u79D2\uFF09",
  setting_previewByKey: "\u4F7F\u7528\u6309\u952E\u63A7\u5236\u9884\u89C8\u56FE\u5C55\u793A\uFF08Ctrl\uFF09",
  setting_previewByKeyHelp: "\u5F00\u542F\u540E\u9F20\u6807\u79FB\u52A8\u5230\u56FE\u7247\u4E0A\u4E0D\u518D\u5C55\u793A\u9884\u89C8\u56FE\uFF0C\u6309\u4E0BCtrl\u952E\u624D\u5C55\u793A\uFF0C\u540C\u65F6\u201C\u5EF6\u8FDF\u663E\u793A\u9884\u89C8\u201D\u8BBE\u7F6E\u9879\u4E0D\u751F\u6548\u3002",
  setting_maxPage: "\u6BCF\u6B21\u6392\u5E8F\u65F6\u7EDF\u8BA1\u7684\u6700\u5927\u9875\u6570",
  setting_hideWork: "\u9690\u85CF\u6536\u85CF\u6570\u5C11\u4E8E\u8BBE\u5B9A\u503C\u7684\u4F5C\u54C1",
  setting_sortOrderByBookmark: "\u6309\u7167\u6536\u85CF\u6570\u6392\u5E8F\u4F5C\u54C1",
  setting_hideAiWork: "\u6392\u5E8F\u65F6\u9690\u85CF AI \u751F\u6210\u4F5C\u54C1",
  setting_hideAiAssistedWork: "\u6392\u5E8F\u65F6\u9690\u85CF AI \u8F85\u52A9\u4F5C\u54C1",
  setting_hideFav: "\u6392\u5E8F\u65F6\u9690\u85CF\u5DF2\u6536\u85CF\u7684\u4F5C\u54C1",
  setting_hideFollowed: "\u6392\u5E8F\u65F6\u9690\u85CF\u5DF2\u5173\u6CE8\u753B\u5E08\u4F5C\u54C1",
  setting_hideByTag: "\u6392\u5E8F\u65F6\u9690\u85CF\u6307\u5B9A\u6807\u7B7E\u7684\u4F5C\u54C1",
  setting_hideByTagPlaceholder: "\u8F93\u5165\u6807\u7B7E\u540D\uFF0C\u591A\u4E2A\u6807\u7B7E\u7528','\u5206\u9694",
  setting_clearFollowingCache: "\u6E05\u9664\u7F13\u5B58",
  setting_clearFollowingCacheHelp: "\u5173\u6CE8\u753B\u5E08\u4FE1\u606F\u4F1A\u5728\u672C\u5730\u4FDD\u5B58\u4E00\u5929\uFF0C\u5982\u679C\u5E0C\u671B\u7ACB\u5373\u66F4\u65B0\uFF0C\u8BF7\u70B9\u51FB\u6E05\u9664\u7F13\u5B58",
  setting_followingCacheCleared: "\u5DF2\u6E05\u9664\u7F13\u5B58\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u3002",
  setting_blank: "\u4F7F\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u4F5C\u54C1\u8BE6\u60C5\u9875",
  setting_turnPage: "\u4F7F\u7528\u952E\u76D8\u2190\u2192\u8FDB\u884C\u7FFB\u9875\uFF08\u6392\u5E8F\u540E\u7684\u641C\u7D22\u9875\uFF09",
  setting_save: "\u4FDD\u5B58\u8BBE\u7F6E",
  setting_reset: "\u91CD\u7F6E\u811A\u672C",
  setting_resetHint: "\u8FD9\u4F1A\u5220\u9664\u6240\u6709\u8BBE\u7F6E\uFF0C\u76F8\u5F53\u4E8E\u91CD\u65B0\u5B89\u88C5\u811A\u672C\uFF0C\u786E\u5B9A\u8981\u91CD\u7F6E\u5417\uFF1F",
  setting_novelSort: "\u5C0F\u8BF4\u6392\u5E8F",
  setting_novelMaxPage: "\u5C0F\u8BF4\u6392\u5E8F\u65F6\u7EDF\u8BA1\u7684\u6700\u5927\u9875\u6570",
  setting_novelHideWork: "\u9690\u85CF\u6536\u85CF\u6570\u5C11\u4E8E\u8BBE\u5B9A\u503C\u7684\u4F5C\u54C1",
  setting_novelHideFav: "\u6392\u5E8F\u65F6\u9690\u85CF\u5DF2\u6536\u85CF\u7684\u4F5C\u54C1",
  sort_noWork: "\u6CA1\u6709\u53EF\u4EE5\u663E\u793A\u7684\u4F5C\u54C1\uFF08\u9690\u85CF\u4E86 %1 \u4E2A\u4F5C\u54C1\uFF09",
  sort_getWorks: "\u6B63\u5728\u83B7\u53D6\u7B2C %1/%2 \u9875\u4F5C\u54C1",
  sort_getBookmarkCount: "\u83B7\u53D6\u6536\u85CF\u6570\uFF1A%1/%2",
  sort_getPublicFollowing: "\u83B7\u53D6\u516C\u5F00\u5173\u6CE8\u753B\u5E08",
  sort_getPrivateFollowing: "\u83B7\u53D6\u79C1\u6709\u5173\u6CE8\u753B\u5E08",
  sort_filtering: "\u8FC7\u6EE4%1\u6536\u85CF\u91CF\u4F4E\u4E8E%2\u7684\u4F5C\u54C1",
  sort_filteringHideFavorite: "\u5DF2\u6536\u85CF\u548C",
  sort_fullSizeThumb: "\u5168\u5C3A\u5BF8\u7F29\u7565\u56FE\uFF08\u641C\u7D22\u9875\u3001\u7528\u6237\u9875\uFF09",
  label_sort: "\u6392\u5E8F",
  label_sorting: "\u6392\u5E8F\u4E2D",
  label_nextPage: "\u4E0B\u4E00\u9875",
  label_hideFav: "\u8FC7\u6EE4\u6536\u85CF"
};
var i18n_default = Texts;

// src/icons/heart.svg
var heart_default = '<svg viewBox="0 0 32 32" width="32" height="32">\n  <path d="\nM21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183\nC16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5\nC4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366\nC17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>\n  <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5\nC8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328\nC15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5\nC26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" style="fill: #fafafa;">\n  </path>\n</svg>';

// src/icons/heart-filled.svg
var heart_filled_default = '<svg viewBox="0 0 32 32" width="32" height="32">\n  <path d="\nM21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183\nC16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5\nC4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366\nC17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>\n  <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5\nC8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328\nC15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5\nC26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" style="fill: #dc2626;">\n  </path>\n</svg>';

// src/icons/play.svg
var play_default = '<svg viewBox="0 0 24 24"\n  style="width: 48px; height: 48px; stroke: none; line-height: 0; font-size: 0px; vertical-align: middle;">\n  <circle cx="12" cy="12" r="10" style="fill: rgba(0, 0, 0, 0.32);"></circle>\n  <path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834\nC10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342\nC16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799\nC16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243\nC10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652\nC9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z" style="fill: rgb(245, 245, 245);"></path>\n</svg>';

// src/utils/promise.ts
var execLimitConcurrentPromises = async (promises, limit = 48) => {
  const results = [];
  let index = 0;
  const executeNext = async () => {
    if (index >= promises.length) return Promise.resolve();
    const currentIndex = index++;
    const result = await promises[currentIndex]();
    results[currentIndex] = result;
    return await executeNext();
  };
  const initialPromises = Array.from(
    { length: Math.min(limit, promises.length) },
    () => executeNext()
  );
  await Promise.all(initialPromises);
  return results;
};

// src/features/sort.ts
var TAG_PAGE_ILLUSTRATION_LIST_SELECTOR = "ul.sc-98699d11-1.hHLaTl";
var BOOKMARK_USER_PAGE_ILLUSTRATION_LIST_SELECTOR = "ul.sc-bf8cea3f-1.bCxfvI";
var USER_TYPE_ARTWORKS_PER_PAGE = 48;
var isInitialized2 = false;
var loadIllustSort = (options) => {
  if (isInitialized2) return;
  const {
    pageCount: optionPageCount,
    favFilter: optionFavFilter,
    orderType = 0 /* BY_BOOKMARK_COUNT */,
    hideFavorite = false,
    hideByTag = false,
    hideByTagList: hideByTagListString,
    aiFilter = false,
    aiAssistedFilter = false
    // csrfToken,
  } = options;
  let pageCount = Number(optionPageCount), favFilter = Number(optionFavFilter);
  if (pageCount <= 0) {
    pageCount = g_defaultSettings.pageCount;
  }
  if (favFilter < 0) {
    favFilter = g_defaultSettings.favFilter;
  }
  const hideByTagList = hideByTagListString.split(",").map((tag) => tag.trim().toLowerCase()).filter((tag) => !!tag);
  if (aiAssistedFilter) {
    hideByTagList.push(...AI_ASSISTED_TAGS);
  }
  class IllustSorter {
    type;
    illustrations;
    sorting = false;
    nextSortPage;
    listElement = $();
    progressElement = $();
    progressText = $();
    sortButtonElement = $(`#${SORT_BUTTON_ID}`);
    reset({ type }) {
      try {
        this.type = type;
        this.illustrations = [];
        this.sorting = false;
        this.nextSortPage = void 0;
        this.listElement = getIllustrationsListDom(type);
        this.progressElement?.remove();
        this.progressElement = $(document.createElement("div")).attr({
          id: "pp-sort-progress"
        }).css({
          width: "100%",
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "center",
          gap: "6px"
        }).append(
          $(new Image(96, 96)).attr({
            id: "sort-progress__loading",
            src: g_loadingImage
          }).css({
            "border-radius": "50%"
          })
        ).prependTo(this.listElement).hide();
        this.progressText = $(document.createElement("div")).attr({
          id: "pp-sort-progress__text"
        }).css({
          "text-align": "center",
          "font-size": "16px",
          "font-weight": "bold",
          color: "initial"
        }).appendTo(this.progressElement);
        this.sortButtonElement.text(i18n_default.label_sort);
      } catch (error) {
        iLog.e(`An error occurred while resetting sorter:`, error);
        throw new Error(error);
      }
    }
    async sort({
      type,
      api,
      searchParams
    }) {
      this.sorting = true;
      iLog.i("Start to sort illustrations.");
      this.sortButtonElement.text(i18n_default.label_sorting);
      try {
        let illustrations = [];
        const startPage = Number(searchParams.get("p") ?? 1);
        this.nextSortPage = startPage + pageCount;
        for (let page = startPage; page < startPage + pageCount; page += 1) {
          searchParams.set("p", String(page));
          if ([
            5 /* USER_ARTWORK */,
            6 /* USER_ILLUST */,
            7 /* USER_MANGA */
          ].includes(type)) {
            searchParams.set("is_first_page", page > 1 ? "0" : "1");
            searchParams.delete("ids[]");
            const userId = searchParams.get("user_id");
            const userIllustrations = await getUserIllustrationsWithCache(
              userId,
              {
                onRequesting: () => this.setProgress(`Getting illustrations of current user...`)
              }
            );
            const fromIndex = (page - 1) * USER_TYPE_ARTWORKS_PER_PAGE;
            const toIndex = page * USER_TYPE_ARTWORKS_PER_PAGE;
            switch (type) {
              case 5 /* USER_ARTWORK */:
                userIllustrations.artworks.slice(fromIndex, toIndex).forEach((id) => searchParams.append("ids[]", id));
                break;
              case 6 /* USER_ILLUST */:
                userIllustrations.illusts.slice(fromIndex, toIndex).forEach((id) => searchParams.append("ids[]", id));
                break;
              case 7 /* USER_MANGA */:
                userIllustrations.manga.slice(fromIndex, toIndex).forEach((id) => searchParams.append("ids[]", id));
                break;
            }
          } else if ([8 /* USER_BOOKMARK */].includes(type)) {
            searchParams.set(
              "offset",
              String((page - 1) * USER_TYPE_ARTWORKS_PER_PAGE)
            );
          }
          this.setProgress(`Getting illustration list of page ${page} ...`);
          const requestUrl = `${api}?${searchParams}`;
          const getIllustRes = await requestWithRetry({
            url: requestUrl,
            onRetry: (response, retryTimes) => {
              iLog.w(
                `Get illustration list through \`${requestUrl}\` failed:`,
                response,
                `${retryTimes} times retrying...`
              );
              this.setProgress(
                `Retry to get illustration list of page ${page} (${retryTimes} times)...`
              );
            }
          });
          const extractedIllustrations = getIllustrationsFromResponse(
            type,
            getIllustRes.response
          );
          illustrations = illustrations.concat(extractedIllustrations);
        }
        const getDetailedIllustrationPromises = [];
        for (let i = 0; i < illustrations.length; i += 1) {
          const illustration = illustrations[i];
          const illustrationId = illustration.id;
          const illustrationAuthorId = illustration.userId;
          if (String(illustrationAuthorId) === "0") {
            continue;
          }
          getDetailedIllustrationPromises.push(async () => {
            this.setProgress(
              `Getting details of ${i + 1}/${illustrations.length} illustration...`
            );
            const illustrationDetails = await getIllustrationDetailsWithCache(
              illustrationId,
              true
            );
            return {
              ...illustration,
              bookmarkUserTotal: illustrationDetails?.bookmarkUserTotal ?? -1
            };
          });
        }
        const detailedIllustrations = await execLimitConcurrentPromises(
          getDetailedIllustrationPromises
        );
        iLog.d("Queried detailed illustrations:", detailedIllustrations);
        this.setProgress("Filtering illustrations...");
        const filteredIllustrations = detailedIllustrations.filter(
          (illustration) => {
            if (hideFavorite && illustration.bookmarkData) {
              return false;
            }
            if (aiFilter && illustration.aiType === 2 /* AI */) {
              return false;
            }
            if ((hideByTag || aiAssistedFilter) && hideByTagList.length) {
              for (const tag of illustration.tags) {
                if (hideByTagList.includes(tag.toLowerCase())) {
                  return false;
                }
              }
            }
            return illustration.bookmarkUserTotal >= favFilter;
          }
        );
        this.setProgress("Sorting filtered illustrations...");
        const sortedIllustrations = orderType === 0 /* BY_BOOKMARK_COUNT */ ? filteredIllustrations.sort(
          (a, b) => b.bookmarkUserTotal - a.bookmarkUserTotal
        ) : filteredIllustrations;
        iLog.d("Filtered and sorted illustrations:", sortedIllustrations);
        iLog.i("Sort illustrations successfully.");
        this.illustrations = sortedIllustrations;
        this.showIllustrations();
      } catch (error) {
        iLog.e("Sort illustrations failed:", error);
      }
      this.hideProgress();
      this.sorting = false;
      this.sortButtonElement.text(i18n_default.label_sort);
    }
    setProgress(text) {
      this.progressText.text(text);
      this.progressElement.show();
    }
    hideProgress() {
      this.progressText.text("");
      this.progressElement.hide();
    }
    showIllustrations() {
      const fragment = document.createDocumentFragment();
      for (const {
        aiType,
        alt,
        bookmarkData,
        bookmarkUserTotal,
        id,
        illustType,
        pageCount: pageCount2,
        profileImageUrl,
        tags,
        title,
        url,
        userId,
        userName
      } of this.illustrations) {
        const isR18 = checkIsR18(tags);
        const isUgoira = checkIsUgoira(illustType);
        const isAi = checkIsAiGenerated(aiType);
        const isAiAssisted = checkIsAiAssisted(tags);
        const listItem = document.createElement("li");
        const container = document.createElement("div");
        container.style = "width: 184px;";
        const illustrationAnchor = document.createElement("a");
        illustrationAnchor.setAttribute("data-gtm-value", id);
        illustrationAnchor.setAttribute("data-gtm-user-id", userId);
        illustrationAnchor.href = `/artworks/${id}`;
        illustrationAnchor.target = "_blank";
        illustrationAnchor.rel = "external";
        illustrationAnchor.style = "display: block; position: relative; width: 184px;";
        const illustrationImageWrapper = document.createElement("div");
        illustrationImageWrapper.style = "position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;";
        const illustrationImage = document.createElement("img");
        illustrationImage.src = url;
        illustrationImage.alt = alt;
        illustrationImage.style = "object-fit: cover; object-position: center center; width: 100%; height: 100%; border-radius: 4px; background-color: rgb(31, 31, 31);";
        const ugoriaSvg = document.createElement("div");
        ugoriaSvg.style = "position: absolute;";
        ugoriaSvg.innerHTML = play_default;
        const illustrationMeta = document.createElement("div");
        illustrationMeta.style = "position: absolute; top: 0px; left: 0px; right: 0px; display: flex; align-items: flex-start; padding: 4px 4px 0; pointer-events: none; font-size: 10px;";
        illustrationMeta.innerHTML = `
          ${isR18 ? '<div style="padding: 0px 4px; border-radius: 4px; color: rgb(245, 245, 245); background: rgb(255, 64, 96); font-weight: bold; line-height: 16px; user-select: none;">R-18</div>' : ""}
          ${isAi ? '<div style="padding: 0px 4px; border-radius: 4px; color: rgb(245, 245, 245); background: rgb(29, 78, 216); font-weight: bold; line-height: 16px; user-select: none;">AI \u751F\u6210</div>' : isAiAssisted ? '<div style="padding: 0px 4px; border-radius: 4px; color: rgb(245, 245, 245); background: rgb(109, 40, 217); font-weight: bold; line-height: 16px; user-select: none;">AI \u8F85\u52A9</div>' : ""}
          ${pageCount2 > 1 ? `
                <div style="margin-left: auto;">
                  <div style="display: flex; justify-content: center; align-items: center; height: 20px; min-width: 20px; color: rgb(245, 245, 245); font-weight: bold; padding: 0px 6px; background: rgba(0, 0, 0, 0.32); border-radius: 10px; line-height: 10px;">
                    ${page_default}
                    <span>${pageCount2}</span>
                  </div>
                </div>` : ""}
        `;
        const illustrationToolbar = document.createElement("div");
        illustrationToolbar.style = "position: absolute; top: 154px; left: 0px; right: 0px; display: flex; align-items: center; padding: 0 4px 4px; pointer-events: none; font-size: 12px;";
        illustrationToolbar.innerHTML = `
          <div style="padding: 0px 4px; border-radius: 4px; color: rgb(245, 245, 245); background: ${bookmarkUserTotal > 5e4 ? "rgb(159, 18, 57)" : bookmarkUserTotal > 1e4 ? "rgb(220, 38, 38)" : bookmarkUserTotal > 5e3 ? "rgb(29, 78, 216)" : bookmarkUserTotal > 1e3 ? "rgb(21, 128, 61)" : "rgb(71, 85, 105)"}; font-weight: bold; line-height: 16px; user-select: none;">\u2764 ${bookmarkUserTotal}</div>
          <div style="margin-left: auto; display: none;">${bookmarkData ? heart_filled_default : heart_default}</div>
        `;
        const illustrationTitle = document.createElement("div");
        illustrationTitle.innerHTML = title;
        illustrationTitle.style = "margin-top: 4px; max-width: 100%; overflow: hidden; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; line-height: 22px; font-size: 14px; font-weight: bold; color: rgb(245, 245, 245); transition: color 0.2s;";
        const illustrationAuthor = document.createElement("a");
        illustrationAuthor.setAttribute("data-gtm-value", userId);
        illustrationAuthor.href = `/users/${userId}`;
        illustrationAuthor.target = "_blank";
        illustrationAuthor.rel = "external";
        illustrationAuthor.style = "display: flex; align-items: center; margin-top: 4px;";
        illustrationAuthor.innerHTML = `
          <img src="${profileImageUrl}" alt="${userName}" style="object-fit: cover; object-position: center top; width: 24px; height: 24px; border-radius: 50%; margin-right: 4px;">
          <span style="min-width: 0px; line-height: 22px; font-size: 14px; color: rgb(214, 214, 214); text-decoration: none; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${userName}</span>
        `;
        illustrationImageWrapper.appendChild(illustrationImage);
        if (isUgoira) illustrationImageWrapper.appendChild(ugoriaSvg);
        illustrationAnchor.appendChild(illustrationImageWrapper);
        illustrationAnchor.appendChild(illustrationMeta);
        illustrationAnchor.appendChild(illustrationToolbar);
        illustrationAnchor.appendChild(illustrationTitle);
        container.appendChild(illustrationAnchor);
        container.appendChild(illustrationAuthor);
        listItem.appendChild(container);
        fragment.appendChild(listItem);
      }
      if ([
        3 /* BOOKMARK_NEW */,
        4 /* BOOKMARK_NEW_R18 */,
        5 /* USER_ARTWORK */,
        6 /* USER_ILLUST */,
        7 /* USER_MANGA */,
        8 /* USER_BOOKMARK */
      ].includes(this.type)) {
        this.listElement.css({
          gap: "24px"
        });
      }
      this.listElement.find("li").remove();
      this.listElement.append(fragment);
    }
  }
  const illustSorter = new IllustSorter();
  window.addEventListener(SORT_EVENT_NAME, () => {
    if (illustSorter.sorting) {
      iLog.w("Current is in sorting progress.");
      return;
    }
    const url = new URL(location.href);
    const { pathname, searchParams } = url;
    const {
      type,
      api,
      searchParams: defaultSearchParams
    } = getSortOptionsFromPathname(pathname);
    if (type === void 0) {
      iLog.w("Current page doesn't support sorting illustrations.");
      return;
    }
    const mergedSearchParams = new URLSearchParams(defaultSearchParams);
    searchParams.forEach((value, key) => {
      mergedSearchParams.set(key, value);
    });
    illustSorter.reset({
      type
    });
    illustSorter.sort({
      type,
      api,
      searchParams: mergedSearchParams
    });
  });
  window.addEventListener(SORT_NEXT_PAGE_EVENT_NAME, () => {
    const url = new URL(location.href);
    const { origin, pathname, searchParams } = url;
    const currentPage = Number(searchParams.get("p") ?? 1);
    let nextPage = currentPage + 1;
    if (illustSorter.listElement?.length && illustSorter.nextSortPage) {
      iLog.i(
        "Illustrations in current page are sorted, jump to next available page..."
      );
      nextPage = illustSorter.nextSortPage;
    }
    searchParams.set("p", String(nextPage));
    location.href = `${origin}${pathname}?${searchParams}`;
  });
  isInitialized2 = true;
};
function getIllustrationsListDom(type) {
  let dom;
  if ([
    0 /* TAG_ARTWORK */,
    1 /* TAG_ILLUST */,
    2 /* TAG_MANGA */
  ].includes(type)) {
    dom = $(TAG_PAGE_ILLUSTRATION_LIST_SELECTOR);
    if (!dom.length) {
      dom = $("section").find("ul").last();
    }
  } else if ([
    3 /* BOOKMARK_NEW */,
    4 /* BOOKMARK_NEW_R18 */,
    8 /* USER_BOOKMARK */
  ].includes(type)) {
    dom = $(BOOKMARK_USER_PAGE_ILLUSTRATION_LIST_SELECTOR);
    if (!dom.length) {
      dom = $("section").find("ul").last();
    }
  } else if ([
    5 /* USER_ARTWORK */,
    6 /* USER_ILLUST */,
    7 /* USER_MANGA */
  ].includes(type)) {
    dom = $(BOOKMARK_USER_PAGE_ILLUSTRATION_LIST_SELECTOR);
    if (!dom.length) {
      dom = $(".__top_side_menu_body").find("ul").last();
    }
  }
  if (dom.length) {
    return dom;
  } else {
    throw new Error(
      `Illustrations list DOM not found in current page: ${location.href}. Please create a new issue here: ${"https://github.com/LolipopJ/PixivPreviewer/issues"}`
    );
  }
}
function getSortOptionsFromPathname(pathname) {
  let type;
  let api;
  let defaultSearchParams;
  let match;
  if (match = pathname.match(/\/tags\/(.+)\/(artworks|illustrations|manga)$/)) {
    const tagName = match[1];
    const filterType = match[2];
    switch (filterType) {
      case "artworks":
        type = 0 /* TAG_ARTWORK */;
        api = `/ajax/search/artworks/${tagName}`;
        defaultSearchParams = `word=${tagName}&order=date_d&mode=all&p=1&csw=0&s_mode=s_tag_full&type=all&lang=zh`;
        break;
      case "illustrations":
        type = 1 /* TAG_ILLUST */;
        api = `/ajax/search/illustrations/${tagName}`;
        defaultSearchParams = `word=${tagName}&order=date_d&mode=all&p=1&csw=0&s_mode=s_tag_full&type=illust_and_ugoira&lang=zh`;
        break;
      case "manga":
        type = 2 /* TAG_MANGA */;
        api = `/ajax/search/manga/${tagName}`;
        defaultSearchParams = `word=${tagName}&order=date_d&mode=all&p=1&csw=0&s_mode=s_tag_full&type=manga&lang=zh`;
        break;
    }
  } else if (match = pathname.match(/\/bookmark_new_illust(_r18)?\.php$/)) {
    const isR18 = !!match[1];
    api = "/ajax/follow_latest/illust";
    if (isR18) {
      type = 3 /* BOOKMARK_NEW */;
      defaultSearchParams = "mode=r18&lang=zh";
    } else {
      type = 4 /* BOOKMARK_NEW_R18 */;
      defaultSearchParams = "mode=all&lang=zh";
    }
  } else if (match = pathname.match(/\/users\/(\d+)\/bookmarks\/artworks$/)) {
    const userId = match[1];
    type = 8 /* USER_BOOKMARK */;
    api = `/ajax/user/${userId}/illusts/bookmarks`;
    defaultSearchParams = `tag=&offset=0&limit=${USER_TYPE_ARTWORKS_PER_PAGE}&rest=show&lang=zh`;
  } else if (match = pathname.match(/\/users\/(\d+)\/(artworks|illustrations|manga)$/)) {
    const userId = match[1];
    const filterType = match[2];
    api = `/ajax/user/${userId}/profile/illusts`;
    switch (filterType) {
      case "artworks":
        type = 5 /* USER_ARTWORK */;
        defaultSearchParams = `work_category=illustManga&is_first_page=1&sensitiveFilterMode=userSetting&user_id=${userId}&lang=zh`;
        break;
      case "illustrations":
        type = 6 /* USER_ILLUST */;
        defaultSearchParams = `work_category=illust&is_first_page=1&sensitiveFilterMode=userSetting&user_id=${userId}&lang=zh`;
        break;
      case "manga":
        type = 7 /* USER_MANGA */;
        defaultSearchParams = `work_category=manga&is_first_page=1&sensitiveFilterMode=userSetting&user_id=${userId}&lang=zh`;
        break;
    }
  }
  return {
    type,
    api,
    searchParams: new URLSearchParams(defaultSearchParams)
  };
}
function getIllustrationsFromResponse(type, response) {
  if (type === 0 /* TAG_ARTWORK */) {
    return response.body.illustManga.data ?? [];
  } else if (type === 1 /* TAG_ILLUST */) {
    return response.body.illust.data ?? [];
  } else if (type === 2 /* TAG_MANGA */) {
    return response.body.manga.data ?? [];
  } else if ([3 /* BOOKMARK_NEW */, 4 /* BOOKMARK_NEW_R18 */].includes(
    type
  )) {
    return response.body.thumbnails.illust ?? [];
  } else if ([
    5 /* USER_ARTWORK */,
    6 /* USER_ILLUST */,
    7 /* USER_MANGA */,
    8 /* USER_BOOKMARK */
  ].includes(type)) {
    return Object.values(
      response.body.works
    );
  }
  return [];
}

// src/utils/setting.ts
var SETTINGS_KEY = "PIXIV_PREVIEWER_L_SETTINGS";
var toggleSettingBooleanValue = (key) => {
  const settings = getSettings();
  const currentValue = Boolean(settings[key] ?? g_defaultSettings[key]);
  const newValue = !currentValue;
  GM_setValue(SETTINGS_KEY, { ...settings, [key]: newValue });
};
var setSettingStringValue = (key, label, {
  parseValue = (v) => v,
  onSet
}) => {
  const settings = getSettings();
  const currentValue = settings[key] ?? g_defaultSettings[key];
  const newValue = prompt(label, String(currentValue));
  if (newValue !== null) {
    const savedValue = parseValue(newValue);
    GM_setValue(SETTINGS_KEY, { ...settings, [key]: savedValue });
    onSet?.(savedValue);
  }
};
var setSettingValue = (key, value) => {
  const settings = getSettings();
  const newValue = value ?? g_defaultSettings[key];
  GM_setValue(SETTINGS_KEY, { ...settings, [key]: newValue });
};
var getSettings = () => {
  return GM_getValue(SETTINGS_KEY) ?? g_defaultSettings;
};
var resetSettings = () => {
  GM_setValue(SETTINGS_KEY, g_defaultSettings);
};

// src/index.ts
var g_csrfToken = "";
var g_pageType;
var g_settings;
var Pages = {
  [0 /* Search */]: {
    PageTypeString: "SearchPage",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/tags\/.+\/(artworks|illustrations|manga)/.test(
        url
      );
    },
    GetToolBar: getToolbar
  },
  [1 /* BookMarkNew */]: {
    PageTypeString: "BookMarkNewPage",
    CheckUrl: function(url) {
      return /^https:\/\/www.pixiv.net(\/en)?\/bookmark_new_illust(_r18)?.php.*/.test(
        url
      );
    },
    GetToolBar: getToolbar
  },
  [2 /* Discovery */]: {
    PageTypeString: "DiscoveryPage",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/discovery.*/.test(url);
    },
    GetToolBar: getToolbar
  },
  [3 /* Member */]: {
    PageTypeString: "MemberPage/MemberIllustPage/MemberBookMark",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/users\/\d+/.test(url);
    },
    GetToolBar: getToolbar
  },
  [4 /* Home */]: {
    PageTypeString: "HomePage",
    CheckUrl: function(url) {
      return /https?:\/\/www.pixiv.net(\/en)?\/?$/.test(url) || /https?:\/\/www.pixiv.net(\/en)?\/illustration\/?$/.test(url) || /https?:\/\/www.pixiv.net(\/en)?\/manga\/?$/.test(url) || /https?:\/\/www.pixiv.net(\/en)?\/cate_r18\.php$/.test(url);
    },
    GetToolBar: getToolbar
  },
  [5 /* Ranking */]: {
    PageTypeString: "RankingPage",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/ranking.php.*/.test(url);
    },
    GetToolBar: getToolbar
  },
  [6 /* NewIllust */]: {
    PageTypeString: "NewIllustPage",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/new_illust.php.*/.test(url);
    },
    GetToolBar: getToolbar
  },
  [7 /* R18 */]: {
    PageTypeString: "R18Page",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/cate_r18.php.*/.test(url);
    },
    GetToolBar: getToolbar
  },
  [8 /* Stacc */]: {
    PageTypeString: "StaccPage",
    CheckUrl: function(url) {
      return /^https:\/\/www.pixiv.net(\/en)?\/stacc.*/.test(url);
    },
    GetToolBar: function() {
      return getToolbarOld();
    }
  },
  [9 /* Artwork */]: {
    PageTypeString: "ArtworkPage",
    CheckUrl: function(url) {
      return /^https:\/\/www.pixiv.net(\/en)?\/artworks\/.*/.test(url);
    },
    GetToolBar: getToolbar
  },
  [10 /* NovelSearch */]: {
    PageTypeString: "NovelSearchPage",
    CheckUrl: function(url) {
      return /^https:\/\/www.pixiv.net(\/en)?\/tags\/.*\/novels/.test(url);
    },
    GetToolBar: getToolbar
  },
  [11 /* SearchTop */]: {
    PageTypeString: "SearchTopPage",
    CheckUrl: function(url) {
      return /^https?:\/\/www.pixiv.net(\/en)?\/tags\/[^/*]/.test(url);
    },
    GetToolBar: getToolbar
  }
};
function getToolbar() {
  const toolbar = $(`#${TOOLBAR_ID}`);
  if (toolbar.length > 0) {
    return toolbar.get(0);
  }
  $("body").append(
    `<div id="${TOOLBAR_ID}" style="position: fixed; right: 28px; bottom: 96px;"></div>`
  );
  return $(`#${TOOLBAR_ID}`).get(0);
}
function getToolbarOld() {
  return $("._toolmenu").get(0);
}
function showSearchLinksForDeletedArtworks() {
  const searchEngines = [
    { name: "Google", url: "https://www.google.com/search?q=" },
    { name: "Bing", url: "https://www.bing.com/search?q=" },
    { name: "Baidu", url: "https://www.baidu.com/s?wd=" }
  ];
  const spans = document.querySelectorAll("span[to]");
  spans.forEach((span) => {
    const artworkPath = span.getAttribute("to");
    if (span.textContent.trim() === "-----" && artworkPath.startsWith("/artworks/")) {
      const keyword = `pixiv "${artworkPath.slice(10)}"`;
      const container = document.createElement("span");
      container.className = span.className;
      searchEngines.forEach((engine, i) => {
        const link = document.createElement("a");
        link.href = engine.url + encodeURIComponent(keyword);
        link.textContent = engine.name;
        link.target = "_blank";
        container.appendChild(link);
        if (i < searchEngines.length - 1) {
          container.appendChild(document.createTextNode(" | "));
        }
      });
      span.parentNode.replaceChild(container, span);
    }
  });
}
var menuIds = [];
var registerSettingsMenu = () => {
  const settings = getSettings();
  for (const menuId of menuIds) {
    GM_unregisterMenuCommand(menuId);
  }
  menuIds = [];
  menuIds.push(
    GM_registerMenuCommand(
      `\u{1F5BC}\uFE0F \u63D2\u753B\u4F5C\u54C1\u9884\u89C8 ${settings.enablePreview ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("enablePreview");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F3A6} \u52A8\u56FE\u4F5C\u54C1\u9884\u89C8 ${settings.enableAnimePreview ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("enableAnimePreview");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F557} \u5EF6\u8FDF ${settings.previewDelay} \u6BEB\u79D2\u663E\u793A\u9884\u89C8\u56FE`,
      () => {
        setSettingStringValue("previewDelay", "\u5EF6\u8FDF\u663E\u793A\u9884\u89C8\u56FE\u65F6\u95F4\uFF08\u6BEB\u79D2\uFF09", {
          parseValue: (newValue) => Number(newValue) || g_defaultSettings.previewDelay,
          onSet: () => registerSettingsMenu()
        });
      }
    ),
    GM_registerMenuCommand(`\u{1F4DA}\uFE0F \u6BCF\u6B21\u6392\u5E8F ${settings.pageCount} \u9875`, () => {
      setSettingStringValue("pageCount", "\u6BCF\u6B21\u6392\u5E8F\u7684\u9875\u6570", {
        parseValue: (newValue) => Number(newValue) || g_defaultSettings.pageCount,
        onSet: () => registerSettingsMenu()
      });
    }),
    GM_registerMenuCommand(
      `\u{1F468}\u200D\u{1F469}\u200D\u{1F467} \u6392\u5E8F\u9690\u85CF\u6536\u85CF\u6570\u5C11\u4E8E ${settings.favFilter} \u7684\u4F5C\u54C1`,
      () => {
        setSettingStringValue("favFilter", "\u6392\u5E8F\u9690\u85CF\u5C11\u4E8E\u8BBE\u5B9A\u6536\u85CF\u6570\u7684\u4F5C\u54C1", {
          parseValue: (newValue) => Number(newValue) || g_defaultSettings.favFilter,
          onSet: () => registerSettingsMenu()
        });
      }
    ),
    GM_registerMenuCommand(
      `\u{1F3A8} \u6309\u7167 ${settings.orderType === 0 /* BY_BOOKMARK_COUNT */ ? "\u4F5C\u54C1\u6536\u85CF\u6570" : "\u4F5C\u54C1\u53D1\u5E03\u65F6\u95F4"} \u6392\u5E8F\u4F5C\u54C1`,
      () => {
        setSettingValue(
          "orderType",
          settings.orderType === 0 /* BY_BOOKMARK_COUNT */ ? 1 /* BY_DATE */ : 0 /* BY_BOOKMARK_COUNT */
        );
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F916} \u6392\u5E8F\u8FC7\u6EE4 AI \u751F\u6210\u4F5C\u54C1 ${settings.aiFilter ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("aiFilter");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F9BE} \u6392\u5E8F\u8FC7\u6EE4 AI \u8F85\u52A9\uFF08\u52A0\u7B14\uFF09\u4F5C\u54C1 ${settings.aiAssistedFilter ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("aiAssistedFilter");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u2764\uFE0F \u6392\u5E8F\u8FC7\u6EE4\u5DF2\u6536\u85CF\u4F5C\u54C1 ${settings.hideFavorite ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("hideFavorite");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F516} \u6392\u5E8F\u8FC7\u6EE4\u5305\u542B\u6307\u5B9A\u6807\u7B7E\u7684\u4F5C\u54C1 ${settings.hideByTag ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("hideByTag");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(
      `\u{1F516} \u6392\u5E8F\u8FC7\u6EE4\u7684\u6807\u7B7E\uFF1A${settings.hideByTagList}`,
      () => {
        setSettingStringValue(
          "hideByTagList",
          "\u8FC7\u6EE4\u7684\u6807\u7B7E\u5217\u8868\uFF0C\u4F7F\u7528`,`\u5206\u9694\u4E0D\u540C\u6807\u7B7E",
          {
            onSet: () => registerSettingsMenu()
          }
        );
      }
    ),
    GM_registerMenuCommand(
      `\u{1F4D1} \u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u4F5C\u54C1 ${settings.linkBlank ? "\u2705" : "\u274C"}`,
      () => {
        toggleSettingBooleanValue("linkBlank");
        registerSettingsMenu();
      }
    ),
    GM_registerMenuCommand(`\u{1F501} \u91CD\u7F6E\u8BBE\u7F6E`, () => {
      if (confirm("\u60A8\u786E\u5B9A\u8981\u91CD\u7F6E\u6240\u6709\u8BBE\u7F6E\u5230\u811A\u672C\u7684\u9ED8\u8BA4\u503C\u5417\uFF1F")) {
        resetSettings();
        location.reload();
      }
    })
  );
  return settings;
};
var ShowUpgradeMessage = () => {
  $("#pp-bg").remove();
  const bg = $('<div id="pp-bg"></div>').css({
    position: "fixed",
    "z-index": 9999,
    "background-color": "rgba(0, 0, 0, 0.8)",
    inset: "0px"
  });
  $("body").append(bg);
  bg.get(0).innerHTML = '<img id="pps-close" src="https://pp-1252089172.cos.ap-chengdu.myqcloud.com/Close.png"style="position: absolute; right: 35px; top: 20px; width: 32px; height: 32px; cursor: pointer;"><div style="position: absolute; width: 40%; left: 30%; top: 25%; font-size: 25px; font-weight: bold; text-align: center; color: white;">' + i18n_default.install_title + g_version + '</div><br><div style="position: absolute; left: 50%; top: 35%; font-size: 20px; color: white; transform: translate(-50%,0); height: 50%; overflow: auto;">' + i18n_default.upgrade_body + "</div>";
  $("#pps-close").on("click", () => {
    setSettingValue("version", g_version);
    $("#pp-bg").remove();
  });
};
var initializePixivPreviewer = () => {
  try {
    g_settings = registerSettingsMenu();
    iLog.i(
      "Start to initialize Pixiv Previewer with global settings:",
      g_settings
    );
    if (g_settings.version !== g_version) {
      ShowUpgradeMessage();
    }
    if (g_settings.enablePreview) {
      loadIllustPreview(g_settings);
    }
    $.get(location.href, function(data) {
      const matched = data.match(/token\\":\\"([a-z0-9]{32})/);
      if (matched.length > 0) {
        g_csrfToken = matched[1];
        DoLog(3 /* Info */, "Got g_csrfToken: " + g_csrfToken);
        loadIllustSort({ ...g_settings, csrfToken: g_csrfToken });
      } else {
        DoLog(
          1 /* Error */,
          "Can not get g_csrfToken, sort function is disabled."
        );
      }
    });
    for (let i = 0; i < Object.keys(Pages).length; i++) {
      if (Pages[i].CheckUrl(location.href)) {
        g_pageType = i;
        break;
      }
    }
    if (g_pageType !== void 0) {
      DoLog(
        3 /* Info */,
        "Current page is " + Pages[g_pageType].PageTypeString
      );
    } else {
      DoLog(3 /* Info */, "Unsupported page.");
      return;
    }
    if (g_pageType === 3 /* Member */) {
      showSearchLinksForDeletedArtworks();
    } else if (g_pageType === 9 /* Artwork */) {
      const artworkId = window.location.pathname.match(/\/artworks\/(\d+)/)?.[1];
      if (artworkId) {
        setTimeout(() => {
          deleteCachedIllustrationDetails([artworkId]);
        });
      }
    }
    const toolBar = Pages[g_pageType].GetToolBar();
    if (toolBar) {
      DoLog(4 /* Elements */, toolBar);
    } else {
      DoLog(2 /* Warning */, "Get toolbar failed.");
      return;
    }
    if (!$(`#${SORT_BUTTON_ID}`).length) {
      const newListItem = document.createElement("div");
      newListItem.title = "Sort artworks";
      newListItem.innerHTML = "";
      const newButton = document.createElement("button");
      newButton.id = SORT_BUTTON_ID;
      newButton.style.cssText = "box-sizing: border-box; background-color: rgba(0,0,0,0.32); color: #fff; margin-top: 5px; opacity: 0.8; cursor: pointer; border: none; padding: 0px; border-radius: 24px; width: 48px; height: 48px; font-size: 12px; font-weight: bold;";
      newButton.innerHTML = i18n_default.label_sort;
      newListItem.appendChild(newButton);
      toolBar.appendChild(newListItem);
      $(newButton).on("click", () => {
        const sortEvent = new Event(SORT_EVENT_NAME);
        window.dispatchEvent(sortEvent);
      });
    }
    if (!$(`#${SORT_NEXT_PAGE_BUTTON_ID}`).length) {
      const newListItem = document.createElement("div");
      newListItem.title = "Jump to next page";
      newListItem.innerHTML = "";
      const newButton = document.createElement("button");
      newButton.id = SORT_NEXT_PAGE_BUTTON_ID;
      newButton.style.cssText = "box-sizing: border-box; background-color: rgba(0,0,0,0.32); color: #fff; margin-top: 5px; opacity: 0.8; cursor: pointer; border: none; padding: 0px; border-radius: 24px; width: 48px; height: 48px; font-size: 12px; font-weight: bold;";
      newButton.innerHTML = i18n_default.label_nextPage;
      newListItem.appendChild(newButton);
      toolBar.appendChild(newListItem);
      $(newButton).on("click", () => {
        const sortEvent = new Event(SORT_NEXT_PAGE_EVENT_NAME);
        window.dispatchEvent(sortEvent);
      });
    }
    if (!$(`#${HIDE_FAVORITES_BUTTON_ID}`).length) {
      const newListItem = document.createElement("div");
      newListItem.title = "Hide favorite illustrations";
      newListItem.innerHTML = "";
      const newButton = document.createElement("button");
      newButton.id = HIDE_FAVORITES_BUTTON_ID;
      newButton.style.cssText = "box-sizing: border-box; background-color: rgba(0,0,0,0.32); color: #fff; margin-top: 5px; opacity: 0.8; cursor: pointer; border: none; padding: 0px; border-radius: 24px; width: 48px; height: 48px; font-size: 12px; font-weight: bold;";
      newButton.innerHTML = i18n_default.label_hideFav;
      newListItem.appendChild(newButton);
      toolBar.appendChild(newListItem);
      $(newButton).on("click", () => {
        hideFavorites();
      });
    }
  } catch (e) {
    DoLog(1 /* Error */, "An error occurred while initializing:", e);
  }
};
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializePixivPreviewer, 1e3);
});
