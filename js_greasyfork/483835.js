// ==UserScript==
// @name         atcoder-navigation-dropdown
// @namespace    https://github.com/hotarupoyo
// @version      0.0.0
// @author       hotarupoyo
// @description  AtCoderの問題ページのタブをドロップダウン化して、AtCoderやAtCoder Problems から取得した問題一覧など情報を表示する
// @license      MIT
// @match        https://atcoder.jp/contests/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483835/atcoder-navigation-dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/483835/atcoder-navigation-dropdown.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .table-success,.table-success>th,.table-success>td{background-color:#c3e6cb!important}.table-hover .table-success:hover,.table-hover .table-success:hover>th,.table-hover .table-success:hover>td{background-color:#b1dfbb!important}.table-warning,.table-warning>th,.table-warning>td{background-color:#ffeeba!important}.table-hover .table-warning:hover,.table-hover .table-warning:hover>th,.table-hover .table-warning:hover>td{background-color:#ffe8a1!important}.table-danger,.table-danger>th,.table-danger>td{background-color:#f5c6cb!important}.table-hover .table-danger:hover,.table-hover .table-danger:hover>th,.table-hover .table-danger:hover>td{background-color:#f1b0b7!important}.difficulty-unavailable-circle.badge{margin-right:5px;font-size:5px}span.difficulty-circle{display:inline-block;border-radius:50%;border-style:solid;border-width:1px;margin-right:5px;height:12px;width:12px}.difficulty-red{color:red}.difficulty-orange{color:#ff8000}.difficulty-yellow{color:#c0c000}.difficulty-blue{color:#00f}.difficulty-cyan{color:#00c0c0}.difficulty-green{color:green}.difficulty-brown{color:#804000}.difficulty-grey{color:gray}.table-problem{position:relative}.table-success-intime,.table-success-intime>td,.table-success-intime>th,.table-success-language,.table-success-language>td,.table-success-language>th{background-color:#9ad59e}.table-warning-intime,.table-warning-intime>td,.table-warning-intime>th{background-color:#fd9}.table-success-before-contest,.table-success-before-contest>td,.table-success-before-contest>th{background-color:#9cf}.table-hover .table-success-intime:hover,.table-hover .table-success-intime:hover>td,.table-hover .table-success-intime:hover>th,.table-hover .table-success-language:hover,.table-hover .table-success-language:hover>td,.table-hover .table-success-language:hover>th{background-color:#8c8}.table-hover .table-warning-intime:hover,.table-hover .table-warning-intime:hover>td,.table-hover .table-warning-intime:hover>th{background-color:#f0cc99}.table-hover .table-success-before-contest:hover,.table-hover .table-success-before-contest:hover>td,.table-hover .table-success-before-contest:hover>th{background-color:#8bf}.table-problem-point,.table-problem-timespan{position:absolute;right:.1rem;bottom:0;color:#888;font-size:x-small}.table-problem-timespan .table-problem-timespan-penalty{color:red;margin-left:.2rem}.list-table tbody tr td,.list-table thead th{font-size:small;padding:.3rem;line-height:1;white-space:normal}@media only screen and (max-width: 480px){.contest-table-responsive table,.contest-table-responsive thead,.contest-table-responsive tbody,.contest-table-responsive th,.contest-table-responsive td,.contest-table-responsive tr{display:block}.contest-table-responsive td.table-problem-empty,.contest-table-responsive thead tr{display:none}.contest-table-responsive tr{border:1px solid #ccc}.contest-table-responsive td{position:relative;padding-left:.75rem;padding-top:6px;padding-bottom:6px}.contest-table-responsive.contest-regular-table-responsive td:not(:first-child){padding-left:2.5rem}}@media only screen and (max-width: 480px){.list-table table,.list-table thead,.list-table tbody,.list-table th,.list-table td,.list-table tr{display:block}.list-table thead tr{display:none}.list-table tbody tr{border:1px solid #ccc;margin-top:.5rem}.list-table tbody tr td{position:relative;padding-left:32%;padding-top:6px;padding-bottom:6px;min-height:calc(1rem + 12px)}.list-table tbody td:before{position:absolute;top:6px;left:6px;width:32%;padding-right:10px;text-align:left;font-weight:700;content:attr(data-col-name)}.list-table td p{margin-bottom:0}.react-bs-table-bordered{border:none}.react-bs-table .table-bordered>tbody>tr>td:first-child{border-left-width:1px}}.topcoder-like-circle{display:block;border-radius:50%;border-style:solid;border-width:1px;width:12px;height:12px}.topcoder-like-circle-big{border-width:3px;width:36px;height:36px}.rating-circle{display:inline-block}.dropdown-hover-open.dropdown:hover .dropdown-menu{display:block}.scrollable-menu{height:auto;max-height:512px;overflow-x:hidden}.dropdown-menu-center{left:50%;right:auto;text-align:center;transform:translate(-50%)}.dropdown-menu-center>table{text-align:initial} ");

(function () {
  'use strict';

  var _a;
  async function fetchJson(url) {
    const res = await fetch(url);
    if (res.ok)
      return res.json();
    console.error("response is not ok", res);
    throw new Error(`requests to ${url} failed`);
  }
  const ATCODER_PROBLEMS_URL = "https://kenkoooo.com/atcoder";
  const V3_API_URL = `${ATCODER_PROBLEMS_URL}/atcoder-api/v3`;
  function getApiUrl(name) {
    return `${ATCODER_PROBLEMS_URL}/resources/${name}.json`;
  }
  const CONTESTS_INFORMATION_URL = getApiUrl("contests");
  const getContests = () => fetchJson(CONTESTS_INFORMATION_URL);
  const PROBLEMS_INFORMATION_URL = getApiUrl("problems");
  const getProblems = () => fetchJson(PROBLEMS_INFORMATION_URL);
  const CONTESTS_AND_PROBLEMS_URL = getApiUrl("contest-problem");
  const getContestsAndProblems = () => fetchJson(CONTESTS_AND_PROBLEMS_URL);
  const SUBMISSION_DB_NAME = "ATCODER-PROBLEMS-API";
  const VERSION = 1;
  async function getSubmissionsCount(user, from, to) {
    const { count } = await fetchJson(`${V3_API_URL}/user/submission_count?user=${user}&from_second=${from}&to_second=${to}`);
    return count;
  }
  const getSubmissionsFromAPI = (user, from) => fetchJson(`${V3_API_URL}/user/submissions?user=${user}&from_second=${from}`);
  const INF = 10 ** 10;
  function openUserDb(user) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`${SUBMISSION_DB_NAME}-${user}`, VERSION);
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (event.oldVersion < 1) {
          const store = db.createObjectStore("submissions", { keyPath: "id" });
          store.createIndex("by_epoch_second", "epoch_second");
          store.createIndex("by_problem_id", "problem_id");
          store.createIndex("by_contest_id", "contest_id");
        }
      };
      request.onsuccess = (ev) => resolve(request.result);
      request.onerror = reject;
    });
  }
  function waitUntilSuccess(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = (_) => resolve(request.result);
    });
  }
  function getLastEntry(db, storeName) {
    const transaction = db.transaction(storeName, "readonly");
    const submissionsStore = transaction.objectStore(storeName);
    const request = submissionsStore.openCursor(null, "prev");
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (!cursor)
          resolve(void 0);
        else
          resolve(cursor.value);
      };
      request.onerror = reject;
    });
  }
  function getCount(db, storeName) {
    const transaction = db.transaction(storeName, "readonly");
    const submissionsStore = transaction.objectStore(storeName);
    return waitUntilSuccess(submissionsStore.count());
  }
  function add(db, storeName, entry) {
    const transaction = db.transaction(storeName, "readwrite");
    const submissionsStore = transaction.objectStore(storeName);
    return waitUntilSuccess(submissionsStore.add(entry));
  }
  function getAll(db, storeName) {
    const transaction = db.transaction(storeName, "readonly");
    const submissionsStore = transaction.objectStore(storeName);
    return waitUntilSuccess(submissionsStore.getAll());
  }
  async function getSubmissions(user) {
    var _a2;
    const count = await getSubmissionsCount(user, -1, INF);
    if (count === 0)
      return [];
    let db = await openUserDb(user);
    let lastEpoch = ((_a2 = await getLastEntry(db, "submissions")) == null ? void 0 : _a2.epoch_second) ?? -1;
    while (await getCount(db, "submissions") < count) {
      const latestSubmissions = await getSubmissionsFromAPI(user, lastEpoch + 1);
      if (latestSubmissions.length == 0)
        break;
      for (const submission of latestSubmissions) {
        await add(db, "submissions", submission);
        lastEpoch = submission.epoch_second;
      }
    }
    return await getAll(db, "submissions");
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var lscache$1 = { exports: {} };
  (function(module) {
    (function(root, factory) {
      if (module.exports) {
        module.exports = factory();
      } else {
        root.lscache = factory();
      }
    })(commonjsGlobal, function() {
      var CACHE_PREFIX = "lscache-";
      var CACHE_SUFFIX = "-cacheexpiration";
      var EXPIRY_RADIX = 10;
      var expiryMilliseconds = 60 * 1e3;
      var maxDate = calculateMaxDate(expiryMilliseconds);
      var cachedStorage;
      var cachedJSON;
      var cacheBucket = "";
      var warnings = false;
      function supportsStorage() {
        var key = "__lscachetest__";
        var value = key;
        if (cachedStorage !== void 0) {
          return cachedStorage;
        }
        try {
          if (!localStorage) {
            return false;
          }
        } catch (ex) {
          return false;
        }
        try {
          setItem(key, value);
          removeItem(key);
          cachedStorage = true;
        } catch (e) {
          if (isOutOfSpace(e) && localStorage.length) {
            cachedStorage = true;
          } else {
            cachedStorage = false;
          }
        }
        return cachedStorage;
      }
      function isOutOfSpace(e) {
        return e && (e.name === "QUOTA_EXCEEDED_ERR" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.name === "QuotaExceededError");
      }
      function supportsJSON() {
        if (cachedJSON === void 0) {
          cachedJSON = window.JSON != null;
        }
        return cachedJSON;
      }
      function escapeRegExpSpecialCharacters(text) {
        return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
      }
      function expirationKey(key) {
        return key + CACHE_SUFFIX;
      }
      function currentTime() {
        return Math.floor((/* @__PURE__ */ new Date()).getTime() / expiryMilliseconds);
      }
      function getItem(key) {
        return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
      }
      function setItem(key, value) {
        localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
        localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
      }
      function removeItem(key) {
        localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
      }
      function eachKey(fn) {
        var prefixRegExp = new RegExp("^" + CACHE_PREFIX + escapeRegExpSpecialCharacters(cacheBucket) + "(.*)");
        var keysToProcess = [];
        var key, i;
        for (i = 0; i < localStorage.length; i++) {
          key = localStorage.key(i);
          key = key && key.match(prefixRegExp);
          key = key && key[1];
          if (key && key.indexOf(CACHE_SUFFIX) < 0) {
            keysToProcess.push(key);
          }
        }
        for (i = 0; i < keysToProcess.length; i++) {
          fn(keysToProcess[i], expirationKey(keysToProcess[i]));
        }
      }
      function flushItem(key) {
        var exprKey = expirationKey(key);
        removeItem(key);
        removeItem(exprKey);
      }
      function flushExpiredItem(key) {
        var exprKey = expirationKey(key);
        var expr = getItem(exprKey);
        if (expr) {
          var expirationTime = parseInt(expr, EXPIRY_RADIX);
          if (currentTime() >= expirationTime) {
            removeItem(key);
            removeItem(exprKey);
            return true;
          }
        }
      }
      function warn(message, err) {
        if (!warnings)
          return;
        if (!("console" in window) || typeof window.console.warn !== "function")
          return;
        window.console.warn("lscache - " + message);
        if (err)
          window.console.warn("lscache - The error was: " + err.message);
      }
      function calculateMaxDate(expiryMilliseconds2) {
        return Math.floor(864e13 / expiryMilliseconds2);
      }
      var lscache2 = {
        /**
         * Stores the value in localStorage. Expires after specified number of minutes.
         * @param {string} key
         * @param {Object|string} value
         * @param {number} time
         * @return {boolean} whether the value was inserted successfully
         */
        set: function(key, value, time) {
          if (!supportsStorage())
            return false;
          if (!supportsJSON())
            return false;
          try {
            value = JSON.stringify(value);
          } catch (e) {
            return false;
          }
          try {
            setItem(key, value);
          } catch (e) {
            if (isOutOfSpace(e)) {
              var storedKeys = [];
              var storedKey;
              eachKey(function(key2, exprKey) {
                var expiration = getItem(exprKey);
                if (expiration) {
                  expiration = parseInt(expiration, EXPIRY_RADIX);
                } else {
                  expiration = maxDate;
                }
                storedKeys.push({
                  key: key2,
                  size: (getItem(key2) || "").length,
                  expiration
                });
              });
              storedKeys.sort(function(a, b) {
                return b.expiration - a.expiration;
              });
              var targetSize = (value || "").length;
              while (storedKeys.length && targetSize > 0) {
                storedKey = storedKeys.pop();
                warn("Cache is full, removing item with key '" + storedKey.key + "'");
                flushItem(storedKey.key);
                targetSize -= storedKey.size;
              }
              try {
                setItem(key, value);
              } catch (e2) {
                warn("Could not add item with key '" + key + "', perhaps it's too big?", e2);
                return false;
              }
            } else {
              warn("Could not add item with key '" + key + "'", e);
              return false;
            }
          }
          if (time) {
            setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
          } else {
            removeItem(expirationKey(key));
          }
          return true;
        },
        /**
         * Retrieves specified value from localStorage, if not expired.
         * @param {string} key
         * @return {string|Object}
         */
        get: function(key) {
          if (!supportsStorage())
            return null;
          if (flushExpiredItem(key)) {
            return null;
          }
          var value = getItem(key);
          if (!value || !supportsJSON()) {
            return value;
          }
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        },
        /**
         * Removes a value from localStorage.
         * Equivalent to 'delete' in memcache, but that's a keyword in JS.
         * @param {string} key
         */
        remove: function(key) {
          if (!supportsStorage())
            return;
          flushItem(key);
        },
        /**
         * Returns whether local storage is supported.
         * Currently exposed for testing purposes.
         * @return {boolean}
         */
        supported: function() {
          return supportsStorage();
        },
        /**
         * Flushes all lscache items and expiry markers without affecting rest of localStorage
         */
        flush: function() {
          if (!supportsStorage())
            return;
          eachKey(function(key) {
            flushItem(key);
          });
        },
        /**
         * Flushes expired lscache items and expiry markers without affecting rest of localStorage
         */
        flushExpired: function() {
          if (!supportsStorage())
            return;
          eachKey(function(key) {
            flushExpiredItem(key);
          });
        },
        /**
         * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
         * @param {string} bucket
         */
        setBucket: function(bucket) {
          cacheBucket = bucket;
        },
        /**
         * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
         */
        resetBucket: function() {
          cacheBucket = "";
        },
        /**
         * @returns {number} The currently set number of milliseconds each time unit represents in
         *   the set() function's "time" argument.
         */
        getExpiryMilliseconds: function() {
          return expiryMilliseconds;
        },
        /**
         * Sets the number of milliseconds each time unit represents in the set() function's
         *   "time" argument.
         * Sample values:
         *  1: each time unit = 1 millisecond
         *  1000: each time unit = 1 second
         *  60000: each time unit = 1 minute (Default value)
         *  360000: each time unit = 1 hour
         * @param {number} milliseconds
         */
        setExpiryMilliseconds: function(milliseconds) {
          expiryMilliseconds = milliseconds;
          maxDate = calculateMaxDate(expiryMilliseconds);
        },
        /**
         * Sets whether to display warnings when an item is removed from the cache or not.
         */
        enableWarnings: function(enabled) {
          warnings = enabled;
        }
      };
      return lscache2;
    });
  })(lscache$1);
  var lscacheExports = lscache$1.exports;
  const lscache = /* @__PURE__ */ getDefaultExportFromCjs(lscacheExports);
  const submitHtml = '<ul\n  class="dropdown-menu dropdown-menu-center table-hover scrollable-menu"\n  role="menu"\n>\n  <table class="table table-bordered table-striped small th-center">\n    <thead>\n      <tr>\n        <th>提出日時</th>\n        <th>問題</th>\n        <th>ユーザ</th>\n        <th>言語</th>\n        <th>得点</th>\n        <th>コード長</th>\n        <th>結果</th>\n        <th>実行時間</th>\n        <!-- <th width="8%">メモリ</th> -->\n        <th></th>\n      </tr>\n    </thead>\n    <tbody>\n      <!-- <tr>\n        <td class="no-break">\n          <time class="fixtime-second">2023-12-31 10:03:23</time>\n        </td>\n        <td>\n          <a href="/contests/abs/tasks/practice_1"\n            >PracticeA - Welcome to AtCoder</a\n          >\n        </td>\n        <td>\n          <a href="/users/hotarupoyo">hotarupoyo</a>\n        </td>\n        <td>C++ 23 (gcc 12.2)</td>\n        <td class="text-right submission-score" data-id="48945571">100</td>\n        <td class="text-right">180 Byte</td>\n        <td class="text-center">\n          <span\n            class="label label-success"\n            data-toggle="tooltip"\n            data-placement="top"\n            title=""\n            data-original-title="正解"\n            >AC</span\n          >\n        </td>\n        <td class="text-right">1 ms</td>\n        <td class="text-right">3576 KB</td>\n        <td class="text-center">\n          <a href="/contests/abs/submissions/48945571">詳細</a>\n        </td>\n      </tr> -->\n    </tbody>\n  </table>\n</ul>\n';
  const tasksHtml = '<ul class="dropdown-menu table-hover scrollable-menu" role="menu">\n  <li role="presentation" class="dropdown-header group-problem">Problem</li>\n  <!-- <li role="presentation"><a href="#">title</a></li> -->\n  <li role="presentation" class="dropdown-header group-submission">\n    Submission\n  </li>\n  <!-- <li role="presentation"><a href="#">問題Nの提出</a></li> -->\n  <!-- 本当は提出リンクを問題リンクの右に出したいけどドロップダウンの2列化が面倒だから下に出すぞ -->\n</ul>\n';
  const topHtml = '<ul class="dropdown-menu table-hover" role="menu">\n  <li role="presentation" class="dropdown-header group-recent">Recent</li>\n  <!-- <li role="presentation"><a href="#">title</a></li> -->\n  <li role="presentation" class="dropdown-header group-adjacent">Adjacent</li>\n  <!-- <li role="presentation"><a href="#">title</a></li> -->\n</ul>\n';
  const contestScreenName = location.pathname.split("/")[2] ?? "";
  const contestTitle = ((_a = document.querySelector(".contest-title")) == null ? void 0 : _a.innerText) ?? "";
  const userScreenName = (() => {
    const aElements = document.querySelectorAll("ul > li > ul > li > a");
    for (let i = 0; i < aElements.length; i++) {
      const element = aElements[i];
      if (element != null && ["マイプロフィール", "My Profile"].includes(element.innerText.trim())) {
        return element.pathname.split("/")[2];
      }
    }
    return void 0;
  })();
  const ConvertIso8601BasicToExtended = (iso8601basic) => {
    const d = iso8601basic;
    return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 11)}:${d.substring(11, 13)}`;
  };
  const contestDuration = document.querySelectorAll(".contest-duration > a");
  const contestStartTime = new Date(
    ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(0).search).get("iso") ?? "0")
  );
  const contestEndTime = new Date(
    ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(1).search).get("iso") ?? "0")
  );
  contestEndTime.getTime() - contestStartTime.getTime() >= 365 * 24 * 60 * 60 * 1e3;
  const nonPenaltyJudgeStatuses = ["AC", "CE", "IE", "WJ", "WR"];
  const lscacheKeyPrefix = "atcoder-navigation-dropdown";
  const lscacheKeyTop = `${lscacheKeyPrefix}-top`;
  const lscacheKeyMyScores = `${lscacheKeyPrefix}-my-scores-${contestScreenName}`;
  const lscacheKeyMySubmissions = `${lscacheKeyPrefix}-my-submissions-${userScreenName}-${contestScreenName}`;
  const parseMyScoresFromAtcoder = async () => {
    const res = await fetch(`https://atcoder.jp/contests/${contestScreenName}/score`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const scores = [];
    const scoreHtml = await res.text();
    const doc = new DOMParser().parseFromString(scoreHtml, "text/html");
    const tableRows = doc.querySelectorAll("table tbody tr");
    for (let i = 0; i < tableRows.length; i++) {
      const element = tableRows[i];
      const problemIndex = (element == null ? void 0 : element.children[0]).innerText;
      const id = (element == null ? void 0 : element.children[0]).firstElementChild.pathname.split("/")[4] ?? "";
      const name = (element == null ? void 0 : element.children[1]).innerText.trim();
      const score = Number((element == null ? void 0 : element.children[2]).innerText);
      const title = `${problemIndex}. ${name}`;
      scores.push({ id, contest_id: contestScreenName, problem_index: problemIndex, name, title, score });
    }
    return scores;
  };
  const parseMySubmissionsFromAtcoder = async () => {
    const res = await fetch(`https://atcoder.jp/contests/${contestScreenName}/submissions/me`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const submissions = [];
    const submissionsHtml = await res.text();
    const doc = new DOMParser().parseFromString(submissionsHtml, "text/html");
    const tableRows = doc.querySelectorAll("table tbody tr");
    for (let i = 0; i < tableRows.length; i++) {
      const element = tableRows[i];
      const epochSecond = new Date((element == null ? void 0 : element.children[0]).innerText).getTime() / 1e3;
      const pathname = (element == null ? void 0 : element.children[1]).firstElementChild.pathname;
      const contestId = pathname.split("/")[2] ?? "";
      const problemId = pathname.split("/")[4] ?? "";
      const userId = (element == null ? void 0 : element.children[2]).firstElementChild.pathname.split("/")[2] ?? "";
      const language = (element == null ? void 0 : element.children[3]).innerText;
      const point = Number((element == null ? void 0 : element.children[4]).innerText);
      const length = parseInt((element == null ? void 0 : element.children[5]).innerText);
      const result = (element == null ? void 0 : element.children[6]).innerText;
      const executionTime = parseInt((element == null ? void 0 : element.children[8]).innerText);
      const id = Number(
        (element == null ? void 0 : element.children[9]).firstElementChild.pathname.split("/")[4]
      );
      submissions.push({
        epoch_second: epochSecond,
        contest_id: contestId,
        problem_id: problemId,
        user_id: userId,
        language,
        point,
        length,
        result,
        execution_time: executionTime,
        id
        // 使わない値だし値取得が面倒だから仮の値を設定した
      });
    }
    return submissions;
  };
  const loadVisited11Contests = () => {
    let visited11Contests = lscache.get(lscacheKeyTop) ?? [];
    if (!visited11Contests.some((element) => element.id === contestScreenName)) {
      const contest = {
        id: contestScreenName,
        title: contestTitle,
        // 使わない値だし値取得が面倒だから仮の値を設定した
        start_epoch_second: 0,
        duration_second: 0,
        rate_change: ""
      };
      visited11Contests.push(contest);
    }
    visited11Contests = visited11Contests.slice(0, 11);
    lscache.set(lscacheKeyTop, visited11Contests, 365 * 24 * 60);
    return visited11Contests;
  };
  const fetchMyScoresFromAtcoder = async () => {
    const scoresLs = lscache.get(lscacheKeyMyScores);
    if (scoresLs != null) {
      return scoresLs;
    }
    try {
      const scoresA = await parseMyScoresFromAtcoder();
      lscache.set(lscacheKeyMyScores, scoresA, 10);
      return scoresA;
    } catch (_error) {
      lscache.set(lscacheKeyMyScores, [], 10);
      return [];
    }
  };
  const fetchMySubmissionsFromAtcoder = async () => {
    const submissionsLs = lscache.get(lscacheKeyMySubmissions);
    if (submissionsLs != null) {
      return submissionsLs;
    }
    try {
      const submissionsA = await parseMySubmissionsFromAtcoder();
      lscache.set(lscacheKeyMySubmissions, submissionsA, 10);
      return submissionsA;
    } catch (_error) {
      lscache.set(lscacheKeyMySubmissions, [], 10);
      return [];
    }
  };
  const submitTr = (s, p, cp) => {
    const time = new Date(s.epoch_second * 1e3).toLocaleString();
    const problemUrl = `/contests/${s.contest_id}/tasks/${s.problem_id}`;
    const problemTitle = `${cp.problem_index} - ${p.name}`;
    const labelStyle = s.result === "AC" ? "label-success" : s.result !== "WJ" ? "label-warning" : "label-default";
    return `
  <tr>
  <td class="no-break">
    <time class="fixtime-second">${time}</time>
  </td>
  <td>
    <a href="${problemUrl}">${problemTitle}</a>
  </td>
  <td>
    <a href="/users/${s.user_id}">${s.user_id}</a>
  </td>
  <td>${s.language}</td>
  <td class="text-right submission-score">${s.point}</td>
  <td class="text-right">${s.length} Byte</td>
  <td class="text-center">
    <span
      class="label ${labelStyle}"
      >${s.result}</span
    >
  </td>
  <td class="text-right">${s.execution_time} ms</td>
  <td class="text-center">
    <a href="/contests/${s.contest_id}/submissions/${s.id}">詳細</a>
  </td>
</tr>

  `;
  };
  const comparelexicographically = (a, b) => {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  };
  const lookupClassForIsSolvedStatus = (a) => {
    if (a === "successBefore") {
      return "table-success-before-contest";
    }
    if (a === "successIntime") {
      return "table-success-intime";
    }
    if (a === "success") {
      return "table-success";
    }
    if (a === "warningIntime") {
      return "table-warning-intime";
    }
    if (a === "warning") {
      return "table-warning";
    }
    return "";
  };
  const findSubmissionWithMaxScore = (submissions) => {
    if (submissions.length === 0) {
      return void 0;
    }
    return submissions.reduce((left, right) => left.point > right.point ? left : right);
  };
  const countPenalties = (submissions) => {
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);
    let penalties = 0;
    for (const iterator of submissions) {
      if (iterator.result === "AC") {
        return penalties;
      }
      if (!nonPenaltyJudgeStatuses.includes(iterator.result)) {
        penalties += 1;
      }
    }
    return penalties;
  };
  const findFirstAcceptedSubmission = (submissions) => {
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);
    const ac = submissions.filter((element) => element.result === "AC");
    return ac[0];
  };
  const findLatestAcceptedSubmission = (submissions) => {
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);
    const ac = submissions.filter((element) => element.result === "AC");
    return ac.slice(-1)[0];
  };
  const findLatestSubmission = (submissions) => {
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);
    return submissions.slice(-1)[0];
  };
  const findRepresentativeSubmissions = (submissionsArg, contestId, problemId) => {
    const submissions = submissionsArg.filter((element) => element.problem_id === problemId);
    submissions.sort((a, b) => a.epoch_second - b.epoch_second);
    const submissionsBeforeContest = submissions.filter(
      (element) => element.contest_id === contestId && element.epoch_second < contestStartTime.getTime() / 1e3
    );
    const submissionsInTime = submissions.filter(
      (element) => element.contest_id === contestId && element.epoch_second >= contestStartTime.getTime() / 1e3 && element.epoch_second < contestEndTime.getTime() / 1e3
    );
    const submissionsAfterContest = submissions.filter(
      (element) => element.contest_id === contestId && element.epoch_second >= contestEndTime.getTime() / 1e3
    );
    const submissionsAtAnotherContest = submissions.filter((element) => element.contest_id !== contestId);
    const before = {
      maxScore: findSubmissionWithMaxScore(submissionsBeforeContest),
      firstAc: findFirstAcceptedSubmission(submissionsBeforeContest),
      latestAc: findLatestAcceptedSubmission(submissionsBeforeContest),
      latest: findLatestSubmission(submissionsBeforeContest)
    };
    const intime = {
      maxScore: findSubmissionWithMaxScore(submissionsInTime),
      firstAc: findFirstAcceptedSubmission(submissionsInTime),
      latestAc: findLatestAcceptedSubmission(submissionsInTime),
      latest: findLatestSubmission(submissionsInTime),
      penalties: countPenalties(submissionsInTime)
    };
    const after = {
      maxScore: findSubmissionWithMaxScore(submissionsAfterContest),
      firstAc: findFirstAcceptedSubmission(submissionsAfterContest),
      latestAc: findLatestAcceptedSubmission(submissionsAfterContest),
      latest: findLatestSubmission(submissionsAfterContest)
    };
    const another = {
      maxScore: findSubmissionWithMaxScore(submissionsAtAnotherContest),
      firstAc: findFirstAcceptedSubmission(submissionsAtAnotherContest),
      latestAc: findLatestAcceptedSubmission(submissionsAtAnotherContest),
      latest: findLatestSubmission(submissionsAtAnotherContest)
    };
    const isSolvedStatus = (() => {
      var _a2, _b;
      if (before.latestAc != null) {
        return "successBefore";
      }
      if (((_a2 = intime.latestAc) == null ? void 0 : _a2.result) === "AC") {
        return "successIntime";
      }
      if (((_b = after.latestAc) == null ? void 0 : _b.result) === "AC") {
        return "success";
      }
      if (intime.latest != null) {
        return "warningIntime";
      }
      if (after.latest != null) {
        return "warning";
      }
      return void 0;
    })();
    return {
      before,
      intime,
      after,
      another,
      isSolvedStatus
    };
  };
  const countSuccessProblems = (submissions, contestId, problemIds) => {
    let count = 0;
    for (const iterator of problemIds) {
      const s = findRepresentativeSubmissions(submissions, contestId, iterator).isSolvedStatus;
      if (s === "successBefore" || s === "successIntime" || s === "success") {
        count += 1;
      }
    }
    return count;
  };
  const countSuccessIntimeProblems = (submissions, contestId, problemIds) => {
    let count = 0;
    for (const iterator of problemIds) {
      const s = findRepresentativeSubmissions(submissions, contestId, iterator).isSolvedStatus;
      if (s === "successBefore" || s === "successIntime") {
        count += 1;
      }
    }
    return count;
  };
  (async () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    lscache.flushExpired();
    let tabTop = void 0;
    let tabTasks = void 0;
    let tabSubmit = void 0;
    let tabSubmissions = void 0;
    const contestNavTabs = document.querySelectorAll("#contest-nav-tabs > ul > li");
    for (let i = 0; i < contestNavTabs.length; i++) {
      const element = contestNavTabs[i];
      const firstChild = element == null ? void 0 : element.firstElementChild;
      if (["トップ", "Top"].includes(firstChild.innerText.trim())) {
        tabTop = element;
      }
      if (["問題", "Tasks"].includes(firstChild.innerText.trim())) {
        tabTasks = element;
      }
      if (["提出", "Submit"].includes(firstChild.innerText.trim())) {
        tabSubmit = element;
      }
      if (["提出結果", "Results"].includes(firstChild.innerText.trim())) {
        tabSubmissions = element;
      }
    }
    if (tabTop == null || tabTasks == null || tabSubmit == null || tabSubmissions == null) {
      return;
    }
    tabTop.classList.add("dropdown", "dropdown-hover-open");
    (_a2 = tabTop.firstElementChild) == null ? void 0 : _a2.setAttribute("data-toggle", "dropdown");
    tabTasks.classList.add("dropdown", "dropdown-hover-open");
    (_b = tabTasks.firstElementChild) == null ? void 0 : _b.setAttribute("data-toggle", "dropdown");
    tabSubmit.classList.add("dropdown", "dropdown-hover-open");
    (_c = tabSubmit.firstElementChild) == null ? void 0 : _c.setAttribute("data-toggle", "dropdown");
    tabSubmissions.classList.add("dropdown", "dropdown-hover-open");
    (_d = tabTop.firstElementChild) == null ? void 0 : _d.addEventListener("click", () => {
      location.href = `/contests/${contestScreenName}`;
    });
    (_e = tabTasks.firstElementChild) == null ? void 0 : _e.addEventListener("click", () => {
      location.href = `/contests/${contestScreenName}/tasks`;
    });
    (_f = tabSubmit.firstElementChild) == null ? void 0 : _f.addEventListener("click", () => {
      location.href = `/contests/${contestScreenName}/submit`;
    });
    (_g = tabSubmissions.firstElementChild) == null ? void 0 : _g.addEventListener("click", () => {
      location.href = `/contests/${contestScreenName}/submissions`;
    });
    const visited11Contests = loadVisited11Contests();
    const [contests, problems, contestProblems, submissions] = await Promise.all([
      getContests(),
      getProblems(),
      getContestsAndProblems(),
      userScreenName != null ? getSubmissions(userScreenName) : []
    ]);
    const scoresFromAtcoder = /* @__PURE__ */ new Map();
    if (!contests.some((element) => element.id === contestScreenName)) {
      const [problemsFromAtcoder, submissionsFromAtCoder] = await Promise.all([
        fetchMyScoresFromAtcoder(),
        fetchMySubmissionsFromAtcoder()
      ]);
      problems.concat(problemsFromAtcoder);
      submissions.concat(submissionsFromAtCoder);
      for (const iterator of problemsFromAtcoder) {
        contestProblems.push({
          contest_id: iterator.contest_id,
          problem_id: iterator.id,
          problem_index: iterator.problem_index
        });
      }
      for (const iterator of problemsFromAtcoder) {
        scoresFromAtcoder.set(iterator.id, iterator.score);
      }
    }
    const compareContest = (a, b) => Math.abs(a.start_epoch_second - contestStartTime.getTime() / 1e3) - Math.abs(b.start_epoch_second - contestStartTime.getTime() / 1e3);
    const adjacentContests11 = contests.toSorted(compareContest).slice(0, 11).toSorted((a, b) => a.start_epoch_second - b.start_epoch_second).toReversed();
    const contestProblemsHere = contestProblems.filter((element2) => element2.contest_id === contestScreenName);
    const problemsHere = problems.filter((element) => {
      return contestProblemsHere.some((element2) => element2.problem_id === element.id);
    });
    if (problemsHere.length > 26) {
      problemsHere.sort((a, b) => comparelexicographically(a.problem_index, b.problem_index));
    }
    const submissionsHere = submissions.filter((element) => element.contest_id === contestScreenName).toSorted((a, b) => -(a.epoch_second - b.epoch_second));
    const representativeSubmissions = /* @__PURE__ */ new Map();
    for (const iterator of problemsHere) {
      representativeSubmissions.set(
        iterator.id,
        findRepresentativeSubmissions(submissions, iterator.contest_id, iterator.id)
      );
    }
    const docTop = new DOMParser().parseFromString(topHtml, "text/html");
    if (docTop.body.firstElementChild != null) {
      const groupRecent = docTop.querySelector(".group-recent");
      for (const iterator of visited11Contests) {
        if (iterator.id === contestScreenName) {
          continue;
        }
        const ids = contestProblems.filter((element) => element.contest_id === iterator.id).map((element) => element.problem_id);
        const countIntime = countSuccessIntimeProblems(submissions, iterator.id, ids);
        const count = countSuccessProblems(submissions, iterator.id, ids);
        const aClass = countIntime === ids.length ? "table-success-intime" : count === ids.length ? "table-success" : "";
        const url = `/contests/${iterator.id}`;
        const title = `${iterator.id.toUpperCase()} - ${iterator.title} (${count}/${ids.length})`;
        const html = `<li role="presentation"><a class="${aClass}" href="${url}">${title}</a></li>`;
        groupRecent == null ? void 0 : groupRecent.insertAdjacentHTML("afterend", html);
      }
      const groupAdjacent = docTop.querySelector(".group-adjacent");
      for (const iterator of adjacentContests11) {
        const liClass = iterator.id === contestScreenName ? "disabled" : "";
        const ids = contestProblems.filter((element) => element.contest_id === iterator.id).map((element) => element.problem_id);
        const countIntime = countSuccessIntimeProblems(submissions, iterator.id, ids);
        const count = countSuccessProblems(submissions, iterator.id, ids);
        const aClass = countIntime === ids.length ? "table-success-intime" : count === ids.length ? "table-success" : "";
        const url = `/contests/${iterator.id}`;
        const title = `${iterator.id.toUpperCase()} - ${iterator.title} (${count}/${ids.length})`;
        const html = `<li role="presentation" class="${liClass}"><a class="${aClass}" href="${url}">${title}</a></li>`;
        groupAdjacent == null ? void 0 : groupAdjacent.insertAdjacentHTML("afterend", html);
      }
      tabTop.insertAdjacentElement("beforeend", docTop.body.firstElementChild);
    }
    const docTasks = new DOMParser().parseFromString(tasksHtml, "text/html");
    if (docTasks.body.firstElementChild != null) {
      const groupProblem = docTasks.querySelector(".group-problem");
      const groupSubmission = docTasks.querySelector(".group-submission");
      for (const iterator of problemsHere) {
        const representative = representativeSubmissions.get(iterator.id);
        let aClass = lookupClassForIsSolvedStatus(representative == null ? void 0 : representative.isSolvedStatus);
        if ((scoresFromAtcoder.get(iterator.id) ?? 0) > 0) {
          aClass = lookupClassForIsSolvedStatus("successIntime");
        }
        const problemIndex = (_h = contestProblemsHere.find((element) => element.problem_id === iterator.id)) == null ? void 0 : _h.problem_index;
        const urlProblem = `/contests/${iterator.contest_id}/tasks/${iterator.id}`;
        const titleProblem = `${problemIndex} - ${iterator.name}`;
        const htmlProblem = `<li role="presentation"><a class="${aClass}" href="${urlProblem}">${titleProblem}</li>`;
        groupProblem == null ? void 0 : groupProblem.insertAdjacentHTML("afterend", htmlProblem);
        const submissionToLink = ((_i = representative == null ? void 0 : representative.after.latestAc) == null ? void 0 : _i.id) ?? ((_j = representative == null ? void 0 : representative.intime.latestAc) == null ? void 0 : _j.id) ?? ((_k = representative == null ? void 0 : representative.before.latestAc) == null ? void 0 : _k.id) ?? ((_l = representative == null ? void 0 : representative.another.latestAc) == null ? void 0 : _l.id) ?? ((_m = representative == null ? void 0 : representative.after.latest) == null ? void 0 : _m.id) ?? ((_n = representative == null ? void 0 : representative.intime.latest) == null ? void 0 : _n.id) ?? ((_o = representative == null ? void 0 : representative.before.latest) == null ? void 0 : _o.id) ?? ((_p = representative == null ? void 0 : representative.another.latest) == null ? void 0 : _p.id) ?? void 0;
        if (submissionToLink == null) {
          continue;
        }
        const urlSubmission = `/contests/${iterator.contest_id}/submissions/${submissionToLink}`;
        const titleSubmission = `${problemIndex}の提出`;
        const htmlSubmission = `<li role="presentation"><a class="${aClass}" href="${urlSubmission}">${titleSubmission}</a></li>`;
        groupSubmission == null ? void 0 : groupSubmission.insertAdjacentHTML("afterend", htmlSubmission);
      }
      tabTasks.insertAdjacentElement("beforeend", docTasks.body.firstElementChild);
    }
    const docSubmit = new DOMParser().parseFromString(submitHtml, "text/html");
    if (docSubmit.body.firstElementChild != null && submissionsHere.length > 0) {
      const tbody = docSubmit.querySelector("tbody");
      for (const iterator of submissionsHere) {
        const p = problemsHere.find((element) => element.id === iterator.problem_id);
        const cp = contestProblemsHere.find((element) => element.problem_id === iterator.problem_id);
        if (p == null || cp == null) {
          continue;
        }
        const html = submitTr(iterator, p, cp);
        tbody == null ? void 0 : tbody.insertAdjacentHTML("beforeend", html);
      }
      tabSubmit.insertAdjacentElement("beforeend", docSubmit.body.firstElementChild);
    }
  })();

})();