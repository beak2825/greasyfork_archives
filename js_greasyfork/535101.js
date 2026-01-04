// ==UserScript==
// @name         ac-history-perf-estimator-with-AJL
// @namespace    http://ac-history-perf-filler.example.com
// @version      1.0.3
// @description  ac-history-perf-estimatorをAJLスコアに対応させました
// @match        https://atcoder.jp/users/*/history*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535101/ac-history-perf-estimator-with-AJL.user.js
// @updateURL https://update.greasyfork.org/scripts/535101/ac-history-perf-estimator-with-AJL.meta.js
// ==/UserScript==



// should not be here
function isDebugMode() {
    return isDebug;
}

const colorNames = ["unrated", "gray", "brown", "green", "cyan", "blue", "yellow", "orange", "red"];
async function getColor(rating) {
    const colorIndex = rating > 0 ? Math.min(Math.floor(rating / 400) + 1, 8) : 0;
    return colorNames[colorIndex];
}

async function getAPerfs(contestScreenName) {
    const result = await fetch(`https://data.ac-predictor.com/aperfs/${contestScreenName}.json`);
    if (!result.ok) {
        throw new Error(`Failed to fetch aperfs: ${result.status}`);
    }
    return await result.json();
}

// [start, end]
class Range {
    start;
    end;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    contains(val) {
        return this.start <= val && val <= this.end;
    }
    hasValue() {
        return this.start <= this.end;
    }
}

class ContestDetails {
    contestName;
    contestScreenName;
    contestType;
    startTime;
    duration;
    ratedrange;
    constructor(contestName, contestScreenName, contestType, startTime, duration, ratedRange) {
        this.contestName = contestName;
        this.contestScreenName = contestScreenName;
        this.contestType = contestType;
        this.startTime = startTime;
        this.duration = duration;
        this.ratedrange = ratedRange;
    }
    get endTime() {
        return new Date(this.startTime.getTime() + this.duration * 1000);
    }
    get defaultAPerf() {
        if (this.contestType == "heuristic")
            return 1000;
        if (!this.ratedrange.hasValue()) {
            throw new Error("unrated contest");
        }
        // value is not relevant as it is never used
        if (!this.ratedrange.contains(0))
            return 800;
        if (this.ratedrange.end == 1199)
            return 800;
        if (this.ratedrange.end == 1999)
            return 800;
        const DEFAULT_CHANGED_AT = new Date("2019-05-25"); // maybe wrong
        if (this.ratedrange.end == 2799) {
            if (this.startTime < DEFAULT_CHANGED_AT)
                return 1600;
            else
                return 1000;
        }
        if (4000 <= this.ratedrange.end) {
            if (this.startTime < DEFAULT_CHANGED_AT)
                return 1600;
            else
                return 1200;
        }
        throw new Error("unknown contest type");
    }
    get performanceCap() {
        if (this.contestType == "heuristic")
            return Infinity;
        if (!this.ratedrange.hasValue()) {
            throw new Error("unrated contest");
        }
        if (4000 <= this.ratedrange.end)
            return Infinity;
        return this.ratedrange.end + 1 + 400;
    }
    beforeContest(dateTime) {
        return dateTime < this.startTime;
    }
    duringContest(dateTime) {
        return this.startTime < dateTime && dateTime < this.endTime;
    }
    isOver(dateTime) {
        return this.endTime < dateTime;
    }
}

async function getContestDetails() {
    const result = await fetch(`https://data.ac-predictor.com/contest-details.json`);
    if (!result.ok) {
        throw new Error(`Failed to fetch contest details: ${result.status}`);
    }
    const parsed = await result.json();
    const res = [];
    for (const elem of parsed) {
        if (typeof elem !== "object")
            throw new Error("invalid object returned");
        if (typeof elem.contestName !== "string")
            throw new Error("invalid object returned");
        const contestName = elem.contestName;
        if (typeof elem.contestScreenName !== "string")
            throw new Error("invalid object returned");
        const contestScreenName = elem.contestScreenName;
        if (elem.contestType !== "algorithm" && elem.contestType !== "heuristic")
            throw new Error("invalid object returned");
        const contestType = elem.contestType;
        if (typeof elem.startTime !== "number")
            throw new Error("invalid object returned");
        const startTime = new Date(elem.startTime * 1000);
        if (typeof elem.duration !== "number")
            throw new Error("invalid object returned");
        const duration = elem.duration;
        if (typeof elem.ratedrange !== "object" || typeof elem.ratedrange[0] !== "number" || typeof elem.ratedrange[1] !== "number")
            throw new Error("invalid object returned");
        const ratedRange = new Range(elem.ratedrange[0], elem.ratedrange[1]);
        res.push(new ContestDetails(contestName, contestScreenName, contestType, startTime, duration, ratedRange));
    }
    return res;
}

class Cache {
    cacheDuration;
    cacheExpires = new Map();
    cacheData = new Map();
    constructor(cacheDuration) {
        this.cacheDuration = cacheDuration;
    }
    has(key) {
        return this.cacheExpires.has(key) || Date.now() <= this.cacheExpires.get(key);
    }
    set(key, content) {
        const expire = Date.now() + this.cacheDuration;
        this.cacheExpires.set(key, expire);
        this.cacheData.set(key, content);
    }
    get(key) {
        if (!this.has(key)) {
            throw new Error(`invalid key: ${key}`);
        }
        return this.cacheData.get(key);
    }
}



class EloPerformanceProvider {
    ranks;
    ratings;
    cap;
    rankMemo = new Map();
    constructor(ranks, ratings, cap) {
        this.ranks = ranks;
        this.ratings = ratings;
        this.cap = cap;
    }
    availableFor(userScreenName) {
        return this.ranks.has(userScreenName);
    }
    getPerformance(userScreenName) {
        if (!this.availableFor(userScreenName)) {
            throw new Error(`User ${userScreenName} not found`);
        }
        const rank = this.ranks.get(userScreenName);
        return this.getPerformanceForRank(rank);
    }
    getPerformances() {
        const performances = new Map();
        for (const userScreenName of this.ranks.keys()) {
            performances.set(userScreenName, this.getPerformance(userScreenName));
        }
        return performances;
    }
    getPerformanceForRank(rank) {
        let upper = 6144;
        let lower = -2048;
        while (upper - lower > 0.5) {
            const mid = (upper + lower) / 2;
            if (rank > this.getRankForPerformance(mid))
                upper = mid;
            else
                lower = mid;
        }
        return Math.min(this.cap, Math.round((upper + lower) / 2));
    }
    getRankForPerformance(performance) {
        if (this.rankMemo.has(performance))
            return this.rankMemo.get(performance);
        const res = this.ratings.reduce((val, APerf) => val + 1.0 / (1.0 + Math.pow(6.0, (performance - APerf) / 400.0)), 0.5);
        this.rankMemo.set(performance, res);
        return res;
    }
}

function getRankToUsers(ranks) {
    const rankToUsers = new Map();
    for (const [userScreenName, rank] of ranks) {
        if (!rankToUsers.has(rank))
            rankToUsers.set(rank, []);
        rankToUsers.get(rank).push(userScreenName);
    }
    return rankToUsers;
}
function getMaxRank(ranks) {
    return Math.max(...ranks.values());
}
class InterpolatePerformanceProvider {
    ranks;
    maxRank;
    rankToUsers;
    baseProvider;
    constructor(ranks, baseProvider) {
        this.ranks = ranks;
        this.maxRank = getMaxRank(ranks);
        this.rankToUsers = getRankToUsers(ranks);
        this.baseProvider = baseProvider;
    }
    availableFor(userScreenName) {
        return this.ranks.has(userScreenName);
    }
    getPerformance(userScreenName) {
        if (!this.availableFor(userScreenName)) {
            throw new Error(`User ${userScreenName} not found`);
        }
        if (this.performanceCache.has(userScreenName))
            return this.performanceCache.get(userScreenName);
        let rank = this.ranks.get(userScreenName);
        while (rank <= this.maxRank) {
            const perf = this.getPerformanceIfAvailable(rank);
            if (perf !== null) {
                return perf;
            }
            rank++;
        }
        this.performanceCache.set(userScreenName, -Infinity);
        return -Infinity;
    }
    performanceCache = new Map();
    getPerformances() {
        let currentPerformance = -Infinity;
        const res = new Map();
        for (let rank = this.maxRank; rank >= 0; rank--) {
            const users = this.rankToUsers.get(rank);
            if (users === undefined)
                continue;
            const perf = this.getPerformanceIfAvailable(rank);
            if (perf !== null)
                currentPerformance = perf;
            for (const userScreenName of users) {
                res.set(userScreenName, currentPerformance);
            }
        }
        this.performanceCache = res;
        return res;
    }
    cacheForRank = new Map();
    getPerformanceIfAvailable(rank) {
        if (!this.rankToUsers.has(rank))
            return null;
        if (this.cacheForRank.has(rank))
            return this.cacheForRank.get(rank);
        for (const userScreenName of this.rankToUsers.get(rank)) {
            if (!this.baseProvider.availableFor(userScreenName))
                continue;
            const perf = this.baseProvider.getPerformance(userScreenName);
            this.cacheForRank.set(rank, perf);
            return perf;
        }
        return null;
    }
}

function normalizeRank(ranks) {
    const rankValues = [...new Set(ranks.values()).values()];
    const rankToUsers = new Map();
    for (const [userScreenName, rank] of ranks) {
        if (!rankToUsers.has(rank))
            rankToUsers.set(rank, []);
        rankToUsers.get(rank).push(userScreenName);
    }
    rankValues.sort((a, b) => a - b);
    const res = new Map();
    let currentRank = 1;
    for (const rank of rankValues) {
        const users = rankToUsers.get(rank);
        const averageRank = currentRank + (users.length - 1) / 2;
        for (const userScreenName of users) {
            res.set(userScreenName, averageRank);
        }
        currentRank += users.length;
    }
    return res;
}

//Copyright © 2017 koba-e964.
//from : https://github.com/koba-e964/atcoder-rating-estimator
const finf = bigf(400);
function bigf(n) {
    let pow1 = 1;
    let pow2 = 1;
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; ++i) {
        pow1 *= 0.81;
        pow2 *= 0.9;
        numerator += pow1;
        denominator += pow2;
    }
    return Math.sqrt(numerator) / denominator;
}
function f(n) {
    return ((bigf(n) - finf) / (bigf(1) - finf)) * 1200.0;
}
/**
 * calculate unpositivized rating from performance history
 * @param {Number[]} [history] performance history with ascending order
 * @returns {Number} unpositivized rating
 */
function calcAlgRatingFromHistory(history) {
    const n = history.length;
    let pow = 1;
    let numerator = 0.0;
    let denominator = 0.0;
    for (let i = n - 1; i >= 0; i--) {
        pow *= 0.9;
        numerator += Math.pow(2, history[i] / 800.0) * pow;
        denominator += pow;
    }
    return Math.log2(numerator / denominator) * 800.0 - f(n);
}
/**
 * calculate unpositivized rating from last state
 * @param {Number} [last] last unpositivized rating
 * @param {Number} [perf] performance
 * @param {Number} [ratedMatches] count of participated rated contest
 * @returns {number} estimated unpositivized rating
 */
function calcAlgRatingFromLast(last, perf, ratedMatches) {
    if (ratedMatches === 0)
        return perf - 1200;
    last += f(ratedMatches);
    const weight = 9 - 9 * 0.9 ** ratedMatches;
    const numerator = weight * 2 ** (last / 800.0) + 2 ** (perf / 800.0);
    const denominator = 1 + weight;
    return Math.log2(numerator / denominator) * 800.0 - f(ratedMatches + 1);
}
/**
 * calculate the performance required to reach a target rate
 * @param {Number} [targetRating] targeted unpositivized rating
 * @param {Number[]} [history] performance history with ascending order
 * @returns {number} performance
 */
function calcRequiredPerformance(targetRating, history) {
    let valid = 10000.0;
    let invalid = -10000.0;
    for (let i = 0; i < 100; ++i) {
        const mid = (invalid + valid) / 2;
        const rating = Math.round(calcAlgRatingFromHistory(history.concat([mid])));
        if (targetRating <= rating)
            valid = mid;
        else
            invalid = mid;
    }
    return valid;
}
/**
 * Gets the weight used in the heuristic rating calculation
 * based on its start and end dates
 * @param {Date} startAt - The start date of the contest.
 * @param {Date} endAt - The end date of the contest.
 * @returns {number} The weight of the contest.
 */
function getWeight(startAt, endAt) {
    const isShortContest = endAt.getTime() - startAt.getTime() < 24 * 60 * 60 * 1000;
    if (endAt < new Date("2025-01-01T00:00:00+09:00")) {
        return 1;
    }
    return isShortContest ? 0.5 : 1;
}
/**
 * calculate unpositivized rating from performance history
 * @param {RatingMaterial[]} [history] performance histories
 * @returns {Number} unpositivized rating
 */
function calcHeuristicRatingFromHistory(history) {
    const S = 724.4744301;
    const R = 0.8271973364;
    const qs = [];
    for (const material of history) {
        const adjustedPerformance = material.Performance + 150 - 100 * material.DaysFromLatestContest / 365;
        for (let i = 1; i <= 100; i++) {
            qs.push({ q: adjustedPerformance - S * Math.log(i), weight: material.Weight });
        }
    }
    qs.sort((a, b) => b.q - a.q);
    let r = 0.0;
    let s = 0.0;
    for (const { q, weight } of qs) {
        s += weight;
        r += q * (R ** (s - weight) - R ** s);
    }
    return r;
}
/**
 * (-inf, inf) -> (0, inf)
 * @param {Number} [rating] unpositivized rating
 * @returns {number} positivized rating
 */
function positivizeRating(rating) {
    if (rating >= 400.0) {
        return rating;
    }
    return 400.0 * Math.exp((rating - 400.0) / 400.0);
}
/**
 * (0, inf) -> (-inf, inf)
 * @param {Number} [rating] positivized rating
 * @returns {number} unpositivized rating
 */
function unpositivizeRating(rating) {
    if (rating >= 400.0) {
        return rating;
    }
    return 400.0 + 400.0 * Math.log(rating / 400.0);
}

function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}



let StandingsWrapper$1 = class StandingsWrapper {
    data;
    constructor(data) {
        this.data = data;
    }
    toRanks(onlyRated = false, contestType = "algorithm") {
        const res = new Map();
        for (const data of this.data.StandingsData) {
            if (onlyRated && !this.isRated(data, contestType))
                continue;
            res.set(data.UserScreenName, data.Rank);
        }
        return res;
    }
    toRatedUsers(contestType) {
        const res = [];
        for (const data of this.data.StandingsData) {
            if (this.isRated(data, contestType)) {
                res.push(data.UserScreenName);
            }
        }
        return res;
    }
    toScore(user) {
        for (const data of this.data.StandingsData) {
            if (data.UserScreenName == user) return data.TotalResult.Score
        }
    }
    isRated(data, contestType = "algorithm") {
        if (contestType === "algorithm") {
            return data.IsRated;
        }
        if (contestType === "heuristic") {
            return data.IsRated && data.TotalResult.Count !== 0;
        }
        throw new Error("unreachable");
    }
};
const STANDINGS_CACHE_DURATION$1 = 10 * 1000;
const cache$1 = new Cache(STANDINGS_CACHE_DURATION$1);
async function getStandings(contestScreenName) {
    if (!cache$1.has(contestScreenName)) {
        const result = await fetch(`https://atcoder.jp/contests/${contestScreenName}/standings/json`);
        if (!result.ok) {
            throw new Error(`Failed to fetch standings: ${result.status}`);
        }
        cache$1.set(contestScreenName, await result.json());
    }
    return new StandingsWrapper$1(cache$1.get(contestScreenName));
}
async function loadPerformances() {
    'use strict';
    const pathParts = location.pathname.split('/');
    const user = pathParts[2];

    // コンテスト詳細一覧を取得
    const contestDetailsList = await getContestDetails();

    // 各行に処理を並列で適用
    const rowPromises = Array.from(document.querySelectorAll('#history tbody tr')).map(async (row) => {
        const perfCell = row.children[3];
        if (perfCell && perfCell.textContent.trim() === '-') {
            const link = row.children[1].querySelector('a');
            if (!link) return;

            const parts = link.pathname.split('/');
            const contestScreenName = parts[2];
            const contestDetails = contestDetailsList.find(details => details.contestScreenName == contestScreenName);
            if (!contestDetails) return;

            const aperfsDict = await getAPerfs(contestDetails.contestScreenName);
            const defaultAPerf = contestDetails.defaultAPerf;
            const standings = await getStandings(contestDetails.contestScreenName);
            const score = standings.toScore(user);
            const normalizedRanks = normalizeRank(standings.toRanks(true, contestDetails.contestType));
            const aperfsList = standings.toRatedUsers(contestDetails.contestType).map(user => hasOwnProperty(aperfsDict, user) ? aperfsDict[user] : defaultAPerf);
            const basePerformanceProvider = new EloPerformanceProvider(normalizedRanks, aperfsList, contestDetails.performanceCap);
            const performanceProvider = new InterpolatePerformanceProvider(standings.toRanks(), basePerformanceProvider);
            const perfRaw = score == 0 ? 0 : parseInt(positivizeRating(performanceProvider.getPerformance(user)));

            const span = document.createElement("span");
            span.textContent = perfRaw.toString();
            span.style.color = await getColor(perfRaw);
            span.style.opacity = "0.6";
            perfCell.innerHTML = "";
            perfCell.appendChild(span);
        }
    });

    await Promise.all(rowPromises); // 全ての行の処理を待つ
}

(async () => {
    await loadPerformances(); // 完了まで待つ

    console.debug("Loading AJL Scores");

    const table = Array.from(document.querySelector("#history").rows);
    const tableTitleElem = document.createElement("th");
    tableTitleElem.style["text-align"] = "center";
    tableTitleElem.textContent = "AJL";
    tableTitleElem.classList.add("sorting", "ajl");
    tableTitleElem.addEventListener("click", () => {
        document.querySelector("th:nth-child(4)").click();
    });
    table[0].insertBefore(tableTitleElem, table[0].childNodes[5]);

    const scores = [];
    table.slice(1).forEach((element) => {
        const perf = Number(element.childNodes[7].textContent);
        const ajlScore = perf == 0 ? 0 : Math.round(Math.pow(2, perf / 400) * 1000);
        const ajlScoreElem = document.createElement("td");
        ajlScoreElem.textContent = ajlScore;
        if (!isNaN(ajlScore)) {
            scores.push(ajlScore);
        }
        const ratingElem = element.childNodes[11];
        element.insertBefore(ajlScoreElem, ratingElem);
    });

    const labelEle = document.createElement("label");
    labelEle.textContent = "AJL Calculator (Please enter the latest number of doses you would like.) ->";
    labelEle.htmlFor = "ajl-cal";
    const numEle = document.createElement("input");
    numEle.type = "number";
    numEle.id = "ajl-cal";
    numEle.value = table.slice(1).length;

    const titleEle = document.querySelector("div.col-sm-12:has(h2) #user-nav-tabs");
    titleEle.parentNode.insertBefore(numEle, titleEle);
    numEle.parentNode.insertBefore(labelEle, numEle);

    const ansEle = document.createElement("p");
    titleEle.parentNode.insertBefore(ansEle, titleEle);

    function getScore(count) {
        const src = scores.slice(0, count).sort((a, b) => b - a);
        let sum = 0, cnt = 0;
        for (let i = 0; i < src.length && cnt < 10; i++) {
            if (isNaN(src[i])) continue;
            sum += src[i];
            cnt++;
        }
        ansEle.textContent = "AJL Score: " + sum;
    }

    getScore(numEle.value);
    numEle.addEventListener("change", () => getScore(numEle.value));
})();

