/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(url);
        if (res.ok)
            return res.json();
        console.error("response is not ok", res);
        throw new Error(`requests to ${url} failed`);
    });
}

const ATCODER_PROBLEMS_URL = 'https://kenkoooo.com/atcoder';
const V3_API_URL = `${ATCODER_PROBLEMS_URL}/atcoder-api/v3`;

function getApiUrl(name) {
    return `${ATCODER_PROBLEMS_URL}/resources/${name}.json`;
}
// Information API
const CONTESTS_INFORMATION_URL = getApiUrl("contests");
const getContests = () => fetchJson(CONTESTS_INFORMATION_URL);
const PROBLEMS_INFORMATION_URL = getApiUrl("problems");
const getProblems = () => fetchJson(PROBLEMS_INFORMATION_URL);
const DETAILED_PROBLEMS_INFORMATION_URL = getApiUrl("merged-problems");
const getDetailedProblems = () => fetchJson(DETAILED_PROBLEMS_INFORMATION_URL);
const CONTESTS_AND_PROBLEMS_URL = getApiUrl("contest-problem");
const getContestsAndProblems = () => fetchJson(CONTESTS_AND_PROBLEMS_URL);
// Resources
const ESTIMATED_DIFFICULTIES_URL = getApiUrl("problem-models");
const getEstimatedDifficulties = () => fetchJson(ESTIMATED_DIFFICULTIES_URL);

var information = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getContests: getContests,
    getProblems: getProblems,
    getDetailedProblems: getDetailedProblems,
    getContestsAndProblems: getContestsAndProblems,
    getEstimatedDifficulties: getEstimatedDifficulties
});

function getStatisticsFunctions(name) {
    const ranking = (from, to) => fetchJson(`${V3_API_URL}/${name}_ranking?from=${from}&to=${to}`);
    const userRank = (user) => fetchJson(`${V3_API_URL}/user/${name}_rank?user=${user}`);
    return { ranking, userRank };
}
const { ranking: getAcceptedCountRanking, userRank: getUserAcceptedCountRank } = getStatisticsFunctions("ac");
const { ranking: getRatedPointSumRanking, userRank: getUserRatedPointSumRank } = getStatisticsFunctions("rated_point_sum");
const { ranking: getLongestStreakRanking, userRank: getUserLongestStreakRank } = getStatisticsFunctions("streak");
const getLanguageAcceptedCountRanking = (from, to, language) => fetchJson(`${V3_API_URL}/language_ranking?from=${from}&to=${to}&language=${language}`);
const getUserLanguageAcceptedCountRank = (user) => fetchJson(`${V3_API_URL}/user/language_rank?user=${user}`);
const getLanguageList = () => fetchJson(`${V3_API_URL}/language_list`);

var statistics = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getAcceptedCountRanking: getAcceptedCountRanking,
    getUserAcceptedCountRank: getUserAcceptedCountRank,
    getRatedPointSumRanking: getRatedPointSumRanking,
    getUserRatedPointSumRank: getUserRatedPointSumRank,
    getLongestStreakRanking: getLongestStreakRanking,
    getUserLongestStreakRank: getUserLongestStreakRank,
    getLanguageAcceptedCountRanking: getLanguageAcceptedCountRanking,
    getUserLanguageAcceptedCountRank: getUserLanguageAcceptedCountRank,
    getLanguageList: getLanguageList
});

const SUBMISSION_DB_NAME = "ATCODER-PROBLEMS-API";
const VERSION = 1;
function getSubmissionsCount(user, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const { count } = yield fetchJson(`${V3_API_URL}/user/submission_count?user=${user}&from_second=${from}&to_second=${to}`);
        return count;
    });
}
const getSubmissionsFromAPI = (user, from) => fetchJson(`${V3_API_URL}/user/submissions?user=${user}&from_second=${from}`);
const INF = Math.pow(10, 10);
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
        request.onsuccess = _ => resolve(request.result);
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
                resolve(undefined);
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
function getSubmissions(user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield getSubmissionsCount(user, -1, INF);
        if (count === 0)
            return [];
        let db = yield openUserDb(user);
        let lastEpoch = (_b = (_a = (yield getLastEntry(db, "submissions"))) === null || _a === void 0 ? void 0 : _a.epoch_second) !== null && _b !== void 0 ? _b : -1;
        while ((yield getCount(db, "submissions")) < count) {
            const latestSubmissions = yield getSubmissionsFromAPI(user, lastEpoch + 1);
            if (latestSubmissions.length == 0)
                break;
            for (const submission of latestSubmissions) {
                yield add(db, "submissions", submission);
                lastEpoch = submission.epoch_second;
            }
        }
        return yield getAll(db, "submissions");
    });
}

var submission = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getSubmissions: getSubmissions
});

Object.assign(window, Object.assign(Object.assign(Object.assign({}, information), statistics), submission));
