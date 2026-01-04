/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = usLibs.global;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = usLibs.rating;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = usLibs.data;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = moment;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = usLibs.contestInformation;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(1);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(4);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./src/libs/database/database.js
﻿/**
 * オブジェクト生成用のコンストラクタです
 * @param {Function} [getNewData] 更新の際に新たなデータオブジェクトを返す関数です。
 * @param {string} [lsKey] 保存に用いるローカルストレージのkeyです。
 * @param {Function} [onUpdate] 更新の際に呼ばれる関数です。
 */
class DataBase {
    /**
     * オブジェクト生成用のコンストラクタです
     * @param {string} [name] indexedDBにアクセスする際に用いる名前です。
     * @param {Number} [version] indexedDBにアクセスする際に用いるバージョンです。
     */
    constructor(name, version, update) {
        this.name = name;
        this.version = version;
        indexedDB.open(name, version).onupgradeneeded = update;
    }

    /**
     * データをデータベースに追加/更新します。
     * @param {string} [storeName] indexedDBからストアを取得する際の名前です。
     * @param {string} [key] ストアにセットする際に用いるkeyです。
     * @param {Object} [value] ストアにセットする値です。
     * @returns {Promise} 非同期のpromiseです。
     */
    async setData(storeName, key, value) {
        return new Promise((resolve, reject) => {
            try {
                indexedDB.open(this.name).onsuccess = e => {
                    const db = e.target.result;
                    const trans = db.transaction(storeName, "readwrite");
                    const objStore = trans.objectStore(storeName);
                    const data = { id: key, data: value };
                    const putReq = objStore.put(data);
                    putReq.onsuccess = () => {
                        db.close();
                        resolve();
                    };
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * データをデータベースから取得します。存在しなかった場合はrejectされます。
     * @param {string} [storeName] indexedDBからストアを取得する際の名前です。
     * @param {string} [key] ストアにセットする際に用いるkeyです。
     * @returns {Promise} 非同期のpromiseです。
     */
    async getData(storeName, key) {
        return new Promise((resolve, reject) => {
            try {
                indexedDB.open(this.name).onsuccess = openEvent => {
                    const db = openEvent.target.result;
                    const trans = db.transaction(storeName, "readwrite");
                    const objStore = trans.objectStore(storeName);
                    objStore.get(key).onsuccess = getEvent => {
                        const result = getEvent.target.result;
                        db.close();
                        if (!result)
                            reject(
                                `key '${key}' not found in store '${storeName}'`
                            );
                        else resolve(result.data);
                    };
                };
            } catch (e) {
                reject(e);
            }
        });
    }
}

// CONCATENATED MODULE: ./src/libs/database/predictorDB.js
﻿

const StoreKeys = { aperfs: "APerfs", standings: "Standings" };
class predictorDB_PredictorDB extends DataBase {
    constructor() {
        super("PredictorDB", 1, event => {
            const db = event.target.result;
            const storeNames = ["APerfs", "Standings"];
            storeNames.forEach(store => {
                db.createObjectStore(store, { keyPath: "id" });
            });
        });
    }
}

// CONCATENATED MODULE: ./src/libs/contest/results/result.js
class Result {
    /***
     * @param {boolean} isRated
     * @param {boolean} isSubmitted
     * @param {string} userScreenName
     * @param {number} performance
     * @param {number} place
     * @param {number} ratedRank
     * @param {number} competitions
     * @param {number} innerPerformance
     * @param {number} oldRating
     * @param {number} newRating
     */
    constructor(
        isRated,
        isSubmitted,
        userScreenName,
        place,
        ratedRank,
        oldRating,
        newRating,
        competitions,
        performance,
        innerPerformance
    ) {
        this.IsRated = isRated;
        this.IsSubmitted = isSubmitted;
        this.UserScreenName = userScreenName;
        this.Place = place;
        this.RatedRank = ratedRank;
        this.OldRating = oldRating;
        this.NewRating = newRating;
        this.Competitions = competitions;
        this.Performance = performance;
        this.InnerPerformance = innerPerformance;
    }
}

// CONCATENATED MODULE: ./src/libs/contest/contest.js


class contest_Contest {
    constructor(contestScreenName, contestInformation, standings, aPerfs) {
        this.ratedLimit = contestInformation.RatedRange[1] + 1;
        this.perfLimit = this.ratedLimit + 400;
        this.standings = standings;
        this.aPerfs = aPerfs;
        this.rankMemo = {};

        const analyzedData = analyzeStandingsData(
            standings.Fixed,
            standings.StandingsData,
            aPerfs,
            { 2000: 800, 2800: 1000, Infinity: 1200 }[this.ratedLimit] || 1200,
            this.ratedLimit
        );
        this.contestantAPerf = analyzedData.contestantAPerf;
        this.templateResults = analyzedData.templateResults;
        this.IsRated = analyzedData.isRated;

        /** @return {{contestantAPerf: number[], templateResults: Object<string, Result>, isRated: boolean}} */
        function analyzeStandingsData(
            fixed,
            standingsData,
            aPerfs,
            defaultAPerf,
            ratedLimit
        ) {
            let analyzedData = analyze(
                data => data.IsRated && data.TotalResult.Count !== 0
            );
            analyzedData.isRated = true;
            if (analyzedData.contestantAPerf.length === 0) {
                analyzedData = analyze(
                    data =>
                        data.OldRating < ratedLimit &&
                        data.TotalResult.Count !== 0
                );
                analyzedData.isRated = false;
            }
            return analyzedData;

            /** @return {{contestantAPerf: number[], templateResults: Object.<string, Result>}}*/
            function analyze(isUserRated) {
                let contestantAPerf = [];
                let templateResults = {};

                let currentRatedRank = 1;

                let lastRank = 0;
                let tiedUsers = [];
                let ratedInTiedUsers = 0;
                function applyTiedUsers() {
                    tiedUsers.forEach(data => {
                        if (isUserRated(data)) {
                            contestantAPerf.push(
                                aPerfs[data.UserScreenName] || defaultAPerf
                            );
                            ratedInTiedUsers++;
                        }
                    });

                    let ratedRank =
                        currentRatedRank +
                        Math.max(0, ratedInTiedUsers - 1) / 2;
                    tiedUsers.forEach(data => {
                        templateResults[data.UserScreenName] = new Result(
                            isUserRated(data),
                            data.TotalResult.Count !== 0,
                            data.UserScreenName,
                            data.Rank,
                            ratedRank,
                            fixed ? data.OldRating : data.Rating,
                            null,
                            data.Competitions,
                            null,
                            null
                        );
                    });
                    currentRatedRank += ratedInTiedUsers;
                    tiedUsers.length = 0;
                    ratedInTiedUsers = 0;
                }

                standingsData.forEach(data => {
                    if (lastRank !== data.Rank) applyTiedUsers();
                    lastRank = data.Rank;
                    tiedUsers.push(data);
                });
                applyTiedUsers();

                return {
                    contestantAPerf: contestantAPerf,
                    templateResults: templateResults
                };
            }
        }
    }

    getRatedRank(X) {
        if (this.rankMemo[X]) return this.rankMemo[X];
        return (this.rankMemo[X] = this.contestantAPerf.reduce(
            (val, APerf) =>
                val + 1.0 / (1.0 + Math.pow(6.0, (X - APerf) / 400.0)),
            0
        ));
    }

    getPerf(ratedRank) {
        return Math.min(this.getInnerPerf(ratedRank), this.perfLimit);
    }

    getInnerPerf(ratedRank) {
        let upper = 6144;
        let lower = -2048;
        while (upper - lower > 0.5) {
            const mid = (upper + lower) / 2;
            if (ratedRank - 0.5 > this.getRatedRank(mid)) upper = mid;
            else lower = mid;
        }
        return Math.round((upper + lower) / 2);
    }
}

// CONCATENATED MODULE: ./src/libs/contest/results/results.js
class Results {
    constructor() {}
    /**
     * @param {string} userScreenName
     * @return {Result}
     */
    getUserResult(userScreenName) {}
}

// EXTERNAL MODULE: external "usLibs.rating"
var external_usLibs_rating_ = __webpack_require__(2);

// CONCATENATED MODULE: ./src/libs/contest/results/standingsResults.js



class standingsResults_OnDemandResults extends Results {
    /**
     * @param {Contest} contest
     * @param {Results[]} templateResults
     */
    constructor(contest, templateResults) {
        super();
        this.Contest = contest;
        this.TemplateResults = templateResults;
    }
    /**
     * @param {string} userScreenName
     * @return {Result}
     */
    getUserResult(userScreenName) {
        const baseResults = this.TemplateResults[userScreenName];
        if (!baseResults) return null;
        if (!baseResults.Performance) {
            baseResults.InnerPerformance = this.Contest.getInnerPerf(
                baseResults.RatedRank
            );
            baseResults.Performance = Math.min(
                baseResults.InnerPerformance,
                this.Contest.perfLimit
            );
            baseResults.NewRating = Math.round(
                Object(external_usLibs_rating_["positivizeRating"])(
                    Object(external_usLibs_rating_["calcRatingFromLast"])(
                        Object(external_usLibs_rating_["unpositivizeRating"])(baseResults.OldRating),
                        baseResults.Performance,
                        baseResults.Competitions
                    )
                )
            );
        }
        return baseResults;
    }
}

// CONCATENATED MODULE: ./src/libs/contest/results/fIxedResults.js


class fIxedResults_FixedResults extends Results {
    /**
     * @param {Result[]} results
     */
    constructor(results) {
        super();
        this.resultsDic = {};
        results.forEach(result => {
            this.resultsDic[result.UserScreenName] = result;
        });
    }
    /**
     * @param {string} userScreenName
     * @return {Result}
     */
    getUserResult(userScreenName) {
        return this.resultsDic[userScreenName] || null;
    }
}

// EXTERNAL MODULE: external "usLibs.data"
var external_usLibs_data_ = __webpack_require__(3);

// EXTERNAL MODULE: external "usLibs.global"
var external_usLibs_global_ = __webpack_require__(0);

// EXTERNAL MODULE: external "usLibs.contestInformation"
var external_usLibs_contestInformation_ = __webpack_require__(5);

// CONCATENATED MODULE: ./src/elements/predictor/script.js












const firstContestDate = external_moment_default()("2016-07-16 21:00");
const aPerfUpdatedTimeKey = "predictor-aperf-last-updated";
const updateDuration = 10 * 60 * 1000;

async function afterAppend() {
    const isStandingsPage = /standings([^/]*)?$/.test(document.location.href);
    const predictorDB = new predictorDB_PredictorDB();
    const contestInformation = await Object(external_usLibs_contestInformation_["fetchContestInformation"])(external_usLibs_global_["contestScreenName"]);

    /** @type Results */
    let results;

    /** @type Contest */
    let contest;

    if (!shouldEnabledPredictor().verdict) {
        return;
    }

    try {
        await initPredictor();
    } catch (e) {
        console.error(e.message);
    }

    async function initPredictor() {
        let aPerfs;
        let standings;

        try {
            standings = await Object(external_usLibs_data_["getStandingsData"])(external_usLibs_global_["contestScreenName"]);
        } catch (e) {
            throw new Error("順位表の取得に失敗しました。");
        }

        try {
            const lastUpdated = Object(external_usLibs_global_["getLS"])(aPerfUpdatedTimeKey);
            const now = Date.now();
            aPerfs = await (standings.Fixed ||
            now - lastUpdated <= updateDuration
                ? getAPerfsFromLocalData().catch(() => getAPerfsFromAPI())
                : getAPerfsFromAPI().catch(() => getAPerfsFromLocalData()));
        } catch (e) {
            throw new Error("APerfの取得に失敗しました。");
        }

        async function getAPerfsFromAPI() {
            Object(external_usLibs_global_["setLS"])(aPerfUpdatedTimeKey, Date.now());
            return await Object(external_usLibs_data_["getAPerfsData"])(external_usLibs_global_["contestScreenName"]);
        }
        async function getAPerfsFromLocalData() {
            return await predictorDB.getData("APerfs", external_usLibs_global_["contestScreenName"]);
        }

        await updateData(aPerfs, standings);

        if (isStandingsPage) {
            external_jQuery_("thead > tr").append(
                '<th class="standings-result-th" style="width:84px;min-width:84px;">perf</th><th class="standings-result-th" style="width:168px;min-width:168px;">レート変化</th>'
            );
            new MutationObserver(addPerfToStandings).observe(
                document.getElementById("standings-tbody"),
                { childList: true }
            );
            new MutationObserver(async mutationRecord => {
                const isDisabled = mutationRecord[0].target.classList.contains(
                    "disabled"
                );
                if (isDisabled) {
                    await updateStandingsFromAPI();
                }
            }).observe(document.getElementById("refresh"), {
                attributes: true,
                attributeFilter: ["class"]
            });
        }
        addPerfToStandings();
    }

    async function updateStandingsFromAPI() {
        try {
            const shouldEnabled = shouldEnabledPredictor();
            if (!shouldEnabled.verdict) return;
            const standings = await Object(external_usLibs_data_["getStandingsData"])(external_usLibs_global_["contestScreenName"]);
            await updateData(contest.aPerfs, standings);
        } catch (e) {
        }
    }

    async function updateData(aperfs, standings) {
        if (Object.keys(aperfs).length === 0) {
            throw new Error("APerfのデータが提供されていません");
        }
        contest = new contest_Contest(
            external_usLibs_global_["contestScreenName"],
            contestInformation,
            standings,
            aperfs
        );
        await updateResultsData();
    }

    function shouldEnabledPredictor() {
        if (!external_usLibs_global_["startTime"].isBefore())
            return { verdict: false, message: "コンテストは始まっていません" };
        if (external_moment_default()(external_usLibs_global_["startTime"]) < firstContestDate)
            return {
                verdict: false,
                message: "現行レートシステム以前のコンテストです"
            };
        if (contestInformation.RatedRange[0] > contestInformation.RatedRange[1])
            return {
                verdict: false,
                message: "ratedなコンテストではありません"
            };
        return { verdict: true, message: "" };
    }

    //全員の結果データを更新する
    async function updateResultsData() {
        if (contest.standings.Fixed && contest.IsRated) {
            let rawResult = await Object(external_usLibs_data_["getResultsData"])(external_usLibs_global_["contestScreenName"]);
            rawResult.sort((a, b) =>
                a.Place !== b.Place
                    ? a.Place - b.Place
                    : b.OldRating - a.OldRating
            );
            let sortedStandingsData = Array.from(
                contest.standings.StandingsData
            ).filter(x => x.TotalResult.Count !== 0);
            sortedStandingsData.sort((a, b) =>
                a.TotalResult.Count === 0 && b.TotalResult.Count === 0
                    ? 0
                    : a.TotalResult.Count === 0
                    ? 1
                    : b.TotalResult.Count === 0
                    ? -1
                    : a.Rank !== b.Rank
                    ? a.Rank - b.Rank
                    : b.OldRating !== a.OldRating
                    ? b.OldRating - a.OldRating
                    : a.UserIsDeleted
                    ? -1
                    : b.UserIsDeleted
                    ? 1
                    : 0
            );

            let lastPerformance = contest.perfLimit;
            let deletedCount = 0;
            results = new fIxedResults_FixedResults(
                sortedStandingsData.map((data, index) => {
                    let result = rawResult[index - deletedCount];
                    if (!result || data.OldRating !== result.OldRating) {
                        deletedCount++;
                        result = null;
                    }
                    return new Result(
                        result ? result.IsRated : false,
                        data.TotalResult.Count !== 0,
                        data.UserScreenName,
                        data.Rank,
                        -1,
                        data.OldRating,
                        result ? result.NewRating : 0,
                        0,
                        result && result.IsRated
                            ? (lastPerformance = result.Performance)
                            : lastPerformance,
                        result ? result.InnerPerformance : 0
                    );
                })
            );
        } else {
            results = new standingsResults_OnDemandResults(contest, contest.templateResults);
        }
    }

    //結果データを順位表に追加する
    function addPerfToStandings() {
        external_jQuery_(".standings-perf , .standings-rate").remove();

        external_jQuery_("#standings-tbody > tr").each((index, elem) => {
            if (elem.firstElementChild.textContent === "-") {
                let longCell = elem.getElementsByClassName(
                    "standings-result"
                )[0];
                longCell.setAttribute(
                    "colspan",
                    parseInt(longCell.getAttribute("colspan")) + 2
                );
                return;
            }
            const result = results
                ? results.getUserResult(
                      external_jQuery_(".standings-username .username", elem).text()
                  )
                : null;
            const perfElem =
                !result || !result.IsSubmitted
                    ? "-"
                    : getRatingSpan(result.Performance);
            const rateElem = !result
                ? "-"
                : result.IsRated && contest.IsRated
                ? getRatingChangeElem(result.OldRating, result.NewRating)
                : getUnratedElem(result.OldRating);
            external_jQuery_(elem).append(
                `<td class="standings-result standings-perf">${perfElem}</td>`
            );
            external_jQuery_(elem).append(
                `<td class="standings-result standings-rate">${rateElem}</td>`
            );
            function getRatingChangeElem(oldRate, newRate) {
                return `<span class="bold">${getRatingSpan(
                    oldRate
                )}</span> → <span class="bold">${getRatingSpan(
                    newRate
                )}</span> <span class="grey">(${
                    newRate >= oldRate ? "+" : ""
                }${newRate - oldRate})</span>`;
            }
            function getUnratedElem(rate) {
                return `<span class="bold">${getRatingSpan(
                    rate
                )}</span> <span class="grey">(unrated)</span>`;
            }
            function getRatingSpan(rate) {
                return `<span class="user-${Object(external_usLibs_rating_["getColor"])(rate)}">${rate}</span>`;
            }
        });
    }
}

// CONCATENATED MODULE: ./src/main.js
// ==UserScript==
// @name        ac-predictor-minimal
// @namespace   http://ac-predictor.azurewebsites.net/
// @version     1.0.0
// @description AtCoderのパフォーマンスを予測し、順位表に表示します。
// @author      keymoon
// @license     MIT
// @require     https://greasyfork.org/scripts/386712-atcoder-userscript-libs/code/atcoder-userscript-libs.js
// @supportURL  https://github.com/key-moon/ac-predictor.user.js/issues
// @match       https://atcoder.jp/*/standings
// @exclude     https://atcoder.jp/*/standings/json
// @downloadURL https://update.greasyfork.org/scripts/386999/ac-predictor-minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/386999/ac-predictor-minimal.meta.js
// ==/UserScript==



afterAppend();

/***/ })
/******/ ]);