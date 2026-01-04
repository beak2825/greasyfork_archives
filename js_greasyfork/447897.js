// ==UserScript==
// @name        AtCoder-Predictor-Chinese
// @namespace   http://ac-predictor.azurewebsites.net/
// @version     1.2.14
// @description 预测 AtCoder Contest 得分
// @author      keymoon & Sky390
// @license     MIT
// @supportURL  https://twitter.com/intent/tweet?screen_name=kymn_
// @match       https://atcoder.jp/*
// @exclude     https://atcoder.jp/*/json
// @downloadURL https://update.greasyfork.org/scripts/447897/AtCoder-Predictor-Chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/447897/AtCoder-Predictor-Chinese.meta.js
// ==/UserScript==
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

var dom = "<div id=\"predictor-alert\" class=\"row\"><h5 class=\"sidemenu-txt\">正在加载…</h5></div>\n<div id=\"predictor-data\" class=\"row\">\n    <div class=\"input-group col-xs-12\">\n        <span class=\"input-group-addon\">排行\n            <style>\n                .predictor-tooltip-icon:hover+.tooltip{\n                    opacity: .9;\n                    filter: alpha(opacity=90);\n                }\n            </style>\n            <span class=\"predictor-tooltip-icon glyphicon glyphicon-question-sign\"></span>\n            <div class=\"tooltip fade bottom\" style=\"pointer-events:none\">\n                <div class=\"tooltip-arrow\" style=\"left: 18%;\"></div>\n                <div class=\"tooltip-inner\">在额定范围内排名。多人同排时，加人数（第5名有4人按6.5计算）</div>\n            </div>\n        </span>\n        <input class=\"form-control\" id=\"predictor-input-rank\">\n        <span class=\"input-group-addon\">位</span>\n    </div>\n        \n    <div class=\"input-group col-xs-12\">\n        <span class=\"input-group-addon\">表现</span>\n        <input class=\"form-control\" id=\"predictor-input-perf\">\n    </div>\n\n    <div class=\"input-group col-xs-12\">\n        <span class=\"input-group-addon\">评分</span>\n        <input class=\"form-control\" id=\"predictor-input-rate\">\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"btn-group\">\n        <button class=\"btn btn-default\" id=\"predictor-current\">当前排名</button>\n        <button type=\"button\" class=\"btn btn-primary\" id=\"predictor-reload\" data-loading-text=\"更新中…\">更新</button>\n        <!--<button class=\"btn btn-default\" id=\"predictor-solved\" disabled>现问题 AC 后</button>-->\n    </div>\n</div>";

class Result {
    constructor(isRated, isSubmitted, userScreenName, place, ratedRank, oldRating, newRating, competitions, performance, innerPerformance) {
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

function analyzeStandingsData(fixed, standingsData, aPerfs, defaultAPerf, ratedLimit) {
    function analyze(isUserRated) {
        const contestantAPerf = [];
        const templateResults = {};
        let currentRatedRank = 1;
        let lastRank = 0;
        const tiedUsers = [];
        let ratedInTiedUsers = 0;
        function applyTiedUsers() {
            tiedUsers.forEach((data) => {
                if (isUserRated(data)) {
                    contestantAPerf.push(aPerfs[data.UserScreenName] || defaultAPerf);
                    ratedInTiedUsers++;
                }
            });
            const ratedRank = currentRatedRank + Math.max(0, ratedInTiedUsers - 1) / 2;
            tiedUsers.forEach((data) => {
                templateResults[data.UserScreenName] = new Result(isUserRated(data), true, data.UserScreenName, data.Rank, ratedRank, fixed ? data.OldRating : data.Rating, null, data.Competitions, null, null);
            });
            currentRatedRank += ratedInTiedUsers;
            tiedUsers.length = 0;
            ratedInTiedUsers = 0;
        }
        standingsData.forEach((data) => {
            if (lastRank !== data.Rank)
                applyTiedUsers();
            lastRank = data.Rank;
            tiedUsers.push(data);
        });
        applyTiedUsers();
        return {
            contestantAPerf: contestantAPerf,
            templateResults: templateResults,
        };
    }
    let analyzedData = analyze((data) => data.IsRated);
    let isRated = true;
    if (analyzedData.contestantAPerf.length === 0) {
        analyzedData = analyze((data) => data.OldRating < ratedLimit);
        isRated = false;
    }
    const res = analyzedData;
    res.isRated = isRated;
    return res;
}
class Contest {
    constructor(contestScreenName, contestInformation, standings, aPerfs) {
        this.ratedLimit = contestInformation.RatedRange[1] + 1;
        this.perfLimit = this.ratedLimit + 400;
        this.standings = standings;
        this.aPerfs = aPerfs;
        this.rankMemo = {};
        const analyzedData = analyzeStandingsData(standings.Fixed, standings.StandingsData, aPerfs, { 2000: 800, 2800: 1000, Infinity: 1200 }[this.ratedLimit] || 1200, this.ratedLimit);
        this.contestantAPerf = analyzedData.contestantAPerf;
        this.templateResults = analyzedData.templateResults;
        this.IsRated = analyzedData.isRated;
    }
    getRatedRank(X) {
        if (this.rankMemo[X])
            return this.rankMemo[X];
        return (this.rankMemo[X] = this.contestantAPerf.reduce((val, APerf) => val + 1.0 / (1.0 + Math.pow(6.0, (X - APerf) / 400.0)), 0.5));
    }
    getPerf(ratedRank) {
        return Math.min(this.getInnerPerf(ratedRank), this.perfLimit);
    }
    getInnerPerf(ratedRank) {
        let upper = 6144;
        let lower = -2048;
        while (upper - lower > 0.5) {
            const mid = (upper + lower) / 2;
            if (ratedRank > this.getRatedRank(mid))
                upper = mid;
            else
                lower = mid;
        }
        return Math.round((upper + lower) / 2);
    }
}

class Results {
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
function calcRatingFromHistory(history) {
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
function calcRatingFromLast(last, perf, ratedMatches) {
    if (ratedMatches === 0)
        return perf - 1200;
    last += f(ratedMatches);
    const weight = 9 - 9 * Math.pow(0.9, ratedMatches);
    const numerator = weight * Math.pow(2, (last / 800.0)) + Math.pow(2, (perf / 800.0));
    const denominator = 1 + weight;
    return Math.log2(numerator / denominator) * 800.0 - f(ratedMatches + 1);
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
        const rating = Math.round(calcRatingFromHistory(history.concat([mid])));
        if (targetRating <= rating)
            valid = mid;
        else
            invalid = mid;
    }
    return valid;
}
const colorNames = ["unrated", "gray", "brown", "green", "cyan", "blue", "yellow", "orange", "red"];
function getColor(rating) {
    const colorIndex = rating > 0 ? Math.min(Math.floor(rating / 400) + 1, 8) : 0;
    return colorNames[colorIndex];
}

class OnDemandResults extends Results {
    constructor(contest, templateResults) {
        super();
        this.Contest = contest;
        this.TemplateResults = templateResults;
    }
    getUserResult(userScreenName) {
        if (!Object.prototype.hasOwnProperty.call(this.TemplateResults, userScreenName))
            return null;
        const baseResults = this.TemplateResults[userScreenName];
        if (!baseResults)
            return null;
        if (!baseResults.Performance) {
            baseResults.InnerPerformance = this.Contest.getInnerPerf(baseResults.RatedRank);
            baseResults.Performance = Math.min(baseResults.InnerPerformance, this.Contest.perfLimit);
            baseResults.NewRating = Math.round(positivizeRating(calcRatingFromLast(unpositivizeRating(baseResults.OldRating), baseResults.Performance, baseResults.Competitions)));
        }
        return baseResults;
    }
}

class FixedResults extends Results {
    constructor(results) {
        super();
        this.resultsDic = {};
        results.forEach((result) => {
            this.resultsDic[result.UserScreenName] = result;
        });
    }
    getUserResult(userScreenName) {
        return Object.prototype.hasOwnProperty.call(this.resultsDic, userScreenName)
            ? this.resultsDic[userScreenName]
            : null;
    }
}

class PredictorModel {
    constructor(model) {
        this.enabled = model.enabled;
        this.contest = model.contest;
        this.history = model.history;
        this.updateInformation(model.information);
        this.updateData(model.rankValue, model.perfValue, model.rateValue);
    }
    setEnable(state) {
        this.enabled = state;
    }
    updateInformation(information) {
        this.information = information;
    }
    updateData(rankValue, perfValue, rateValue) {
        this.rankValue = rankValue;
        this.perfValue = perfValue;
        this.rateValue = rateValue;
    }
}

class CalcFromRankModel extends PredictorModel {
    updateData(rankValue, perfValue, rateValue) {
        perfValue = this.contest.getPerf(rankValue);
        rateValue = positivizeRating(calcRatingFromHistory(this.history.concat([perfValue])));
        super.updateData(rankValue, perfValue, rateValue);
    }
}

class CalcFromPerfModel extends PredictorModel {
    updateData(rankValue, perfValue, rateValue) {
        rankValue = this.contest.getRatedRank(perfValue);
        rateValue = positivizeRating(calcRatingFromHistory(this.history.concat([perfValue])));
        super.updateData(rankValue, perfValue, rateValue);
    }
}

class CalcFromRateModel extends PredictorModel {
    updateData(rankValue, perfValue, rateValue) {
        perfValue = calcRequiredPerformance(unpositivizeRating(rateValue), this.history);
        rankValue = this.contest.getRatedRank(perfValue);
        super.updateData(rankValue, perfValue, rateValue);
    }
}

function roundValue(value, numDigits) {
    return Math.round(value * Math.pow(10, numDigits)) / Math.pow(10, numDigits);
}

class ContestInformation {
    constructor(canParticipateRange, ratedRange, penalty) {
        this.CanParticipateRange = canParticipateRange;
        this.RatedRange = ratedRange;
        this.Penalty = penalty;
    }
}
function parseRangeString(s) {
    s = s.trim();
    if (s === "-")
        return [0, -1];
    if (s === "All")
        return [0, Infinity];
    if (!/[-~]/.test(s))
        return [0, -1];
    const res = s.split(/[-~]/).map((x) => parseInt(x.trim()));
    if (isNaN(res[0]))
        res[0] = 0;
    if (isNaN(res[1]))
        res[1] = Infinity;
    return res;
}
function parseDurationString(s) {
    if (s === "None" || s === "なし")
        return 0;
    if (!/(\d+[^\d]+)/.test(s))
        return NaN;
    const durationDic = {
        日: 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
        时间: 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        hours: 60 * 60 * 1000,
        分: 60 * 1000,
        minute: 60 * 1000,
        minutes: 60 * 1000,
        秒: 1000,
        second: 1000,
        seconds: 1000,
    };
    let res = 0;
    s.match(/(\d+[^\d]+)/g).forEach((x) => {
        var _a;
        const trimmed = x.trim();
        const num = parseInt(/\d+/.exec(trimmed)[0]);
        const unit = /[^\d]+/.exec(trimmed)[0];
        const duration = (_a = durationDic[unit]) !== null && _a !== void 0 ? _a : 0;
        res += num * duration;
    });
    return res;
}
function fetchJsonDataAsync(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (response.ok)
            return (yield response.json());
        throw new Error(`request to ${url} returns ${response.status}`);
    });
}
function fetchTextDataAsync(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (response.ok)
            return response.text();
        throw new Error(`request to ${url} returns ${response.status}`);
    });
}
function getStandingsDataAsync(contestScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetchJsonDataAsync(`https://atcoder.jp/contests/${contestScreenName}/standings/json`);
    });
}

function getAPerfsDataAsync(contestScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://data.ac-predictor.com/aperfs/${contestScreenName}.json`;
        // if (contestScreenName === "arc119") url = `https://raw.githubusercontent.com/key-moon/ac-predictor-data/master/aperfs/${contestScreenName}.json`;
        return yield fetchJsonDataAsync(url);
    });
}
function getResultsDataAsync(contestScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetchJsonDataAsync(`https://atcoder.jp/contests/${contestScreenName}/results/json`);
    });
}
function getHistoryDataAsync(userScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetchJsonDataAsync(`https://atcoder.jp/users/${userScreenName}/history/json`);
    });
}
function getContestInformationAsync(contestScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        const html = yield fetchTextDataAsync(`https://atcoder.jp/contests/${contestScreenName}`);
        const topPageDom = new DOMParser().parseFromString(html, "text/html");
        const dataParagraph = topPageDom.getElementsByClassName("small")[0];
        const data = Array.from(dataParagraph.children).map((x) => x.innerHTML.split(":")[1].trim());
        return new ContestInformation(parseRangeString(data[0]), parseRangeString(data[1]), parseDurationString(data[2]));
    });
}
/**
 * ユーザーのパフォーマンス履歴を時間昇順で取得
 */
function getPerformanceHistories(history) {
    const onlyRated = history.filter((x) => x.IsRated);
    onlyRated.sort((a, b) => {
        return new Date(a.EndTime).getTime() - new Date(b.EndTime).getTime();
    });
    return onlyRated.map((x) => x.Performance);
}

/**
* サイドメニューに追加される要素のクラス
*/
class SideMenuElement {
    shouldDisplayed(url) {
        return this.match.test(url);
    }
    /**
     * 要素のHTMLを取得
     */
    GetHTML() {
        return `<div class="menu-wrapper">
    <div class="menu-header">
        <h4 class="sidemenu-txt">${this.title}<span class="glyphicon glyphicon-menu-up" style="float: right"></span></h4>
    </div>
    <div class="menu-box"><div class="menu-content" id="${this.id}">${this.document}</div></div>
</div>`;
    }
}

function getGlobalVals() {
    const script = [...document.querySelectorAll("head script:not([src])")].map((x) => x.innerHTML).join("\n");
    const res = {};
    script.match(/var [^ ]+ = .+$/gm).forEach((statement) => {
        const match = /var ([^ ]+) = (.+)$/m.exec(statement);
        function safeEval(val) {
            function trim(val) {
                while (val.endsWith(";") || val.endsWith(" "))
                    val = val.substr(0, val.length - 1);
                while (val.startsWith(" "))
                    val = val.substr(1, val.length - 1);
                return val;
            }
            function isStringToken(val) {
                return 1 < val.length && val.startsWith('"') && val.endsWith('"');
            }
            function evalStringToken(val) {
                if (!isStringToken(val))
                    throw new Error();
                return val.substr(1, val.length - 2); // TODO: parse escape
            }
            val = trim(val);
            if (isStringToken(val))
                return evalStringToken(val);
            if (val.startsWith("moment("))
                return new Date(evalStringToken(trim(val.substr(7, val.length - (7 + 1)))));
            return val;
        }
        res[match[1]] = safeEval(match[2]);
    });
    return res;
}
const globalVals = getGlobalVals();
const userScreenName = globalVals["userScreenName"];
const contestScreenName = globalVals["contestScreenName"];
const startTime = globalVals["startTime"];

class AllRowUpdater {
    update(table) {
        Array.from(table.rows).forEach((row) => this.rowModifier.modifyRow(row));
    }
}

class StandingsRowModifier {
    isHeader(row) {
        return row.parentElement.tagName.toLowerCase() == "thead";
    }
    isFooter(row) {
        return row.firstElementChild.hasAttribute("colspan") && row.firstElementChild.getAttribute("colspan") == "3";
    }
    modifyRow(row) {
        if (this.isHeader(row))
            this.modifyHeader(row);
        else if (this.isFooter(row))
            this.modifyFooter(row);
        else
            this.modifyContent(row);
    }
}

class PerfAndRateChangeAppender extends StandingsRowModifier {
    modifyContent(content) {
        var _a;
        this.removeOldElem(content);
        if (content.firstElementChild.textContent === "-") {
            const longCell = content.getElementsByClassName("standings-result")[0];
            longCell.setAttribute("colspan", (parseInt(longCell.getAttribute("colspan")) + 2).toString());
            return;
        }
        const userScreenName = content.querySelector(".standings-username .username span").textContent;
        const result = (_a = this.results) === null || _a === void 0 ? void 0 : _a.getUserResult(userScreenName);
        const perfElem = (result === null || result === void 0 ? void 0 : result.IsSubmitted) ? this.getRatingSpan(Math.round(positivizeRating(result.Performance)))
            : "-";
        const ratingElem = result
            ? (result === null || result === void 0 ? void 0 : result.IsRated) && (this === null || this === void 0 ? void 0 : this.isRated)
                ? this.getChangedRatingElem(result.OldRating, result.NewRating)
                : this.getUnratedElem(result.OldRating)
            : "-";
        content.insertAdjacentHTML("beforeend", `<td class="standings-result standings-perf">${perfElem}</td>`);
        content.insertAdjacentHTML("beforeend", `<td class="standings-result standings-rate">${ratingElem}</td>`);
    }
    getChangedRatingElem(oldRate, newRate) {
        const oldRateSpan = this.getRatingSpan(oldRate);
        const newRateSpan = this.getRatingSpan(newRate);
        const diff = this.toSignedString(newRate - oldRate);
        return `<span class="bold">${oldRateSpan}</span> → <span class="bold">${newRateSpan}</span> <span class="grey">(${diff})</span>`;
    }
    toSignedString(n) {
        return `${n >= 0 ? "+" : ""}${n}`;
    }
    getUnratedElem(rate) {
        return `<span class="bold">${this.getRatingSpan(rate)}</span> <span class="grey">(unrated)</span>`;
    }
    getRatingSpan(rate) {
        return `<span class="user-${getColor(rate)}">${rate}</span>`;
    }
    modifyFooter(footer) {
        this.removeOldElem(footer);
        footer.insertAdjacentHTML("beforeend", '<td class="standings-result standings-perf standings-rate" colspan="2">-</td>');
    }
    modifyHeader(header) {
        this.removeOldElem(header);
        header.insertAdjacentHTML("beforeend", '<th class="standings-result-th standings-perf" style="width:84px;min-width:84px;">perf</th><th class="standings-result-th standings-rate" style="width:168px;min-width:168px;">Rated 变化</th>');
    }
    removeOldElem(row) {
        row.querySelectorAll(".standings-perf, .standings-rate").forEach((elem) => elem.remove());
    }
}

class PredictorElement extends SideMenuElement {
    constructor() {
        super(...arguments);
        this.id = "predictor";
        this.title = "Predictor";
        this.match = /atcoder.jp\/contests\/.+/;
        this.document = dom;
        this.historyData = [];
        this.contestOnUpdated = [];
        this.resultsOnUpdated = [];
    }
    set contest(val) {
        this._contest = val;
        this.contestOnUpdated.forEach((func) => func(val));
    }
    get contest() {
        return this._contest;
    }
    set results(val) {
        this._results = val;
        this.resultsOnUpdated.forEach((func) => func(val));
    }
    get results() {
        return this._results;
    }
    isStandingsPage() {
        return /standings([^/]*)?$/.test(document.location.href);
    }
    afterAppend() {
        const loaded = () => !!document.getElementById("standings-tbody");
        if (!this.isStandingsPage() || loaded()) {
            void this.initialize();
            return;
        }
        const loadingElem = document.getElementById("vue-standings").getElementsByClassName("loading-show")[0];
        new MutationObserver(() => {
            if (loaded())
                void this.initialize();
        }).observe(loadingElem, { attributes: true });
    }
    initialize() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const firstContestDate = new Date(2016, 6, 16, 21);
            const predictorElements = [
                "predictor-input-rank",
                "predictor-input-perf",
                "predictor-input-rate",
                "predictor-current",
                "predictor-reload",
            ];
            const isStandingsPage = this.isStandingsPage();
            const contestInformation = yield getContestInformationAsync(contestScreenName);
            const rowUpdater = new PerfAndRateChangeAppender();
            this.resultsOnUpdated.push((val) => {
                rowUpdater.results = val;
            });
            this.contestOnUpdated.push((val) => {
                rowUpdater.isRated = val.IsRated;
            });
            const tableUpdater = new AllRowUpdater();
            tableUpdater.rowModifier = rowUpdater;
            const tableElement = (_a = document.getElementById("standings-tbody")) === null || _a === void 0 ? void 0 : _a.parentElement;
            let model = new PredictorModel({
                rankValue: 0,
                perfValue: 0,
                rateValue: 0,
                enabled: false,
                history: this.historyData,
            });
            const updateData = (aperfs, standings) => __awaiter(this, void 0, void 0, function* () {
                this.contest = new Contest(contestScreenName, contestInformation, standings, aperfs);
                model.contest = this.contest;
                if (this.contest.standings.Fixed && this.contest.IsRated) {
                    const rawResult = yield getResultsDataAsync(contestScreenName);
                    rawResult.sort((a, b) => (a.Place !== b.Place ? a.Place - b.Place : b.OldRating - a.OldRating));
                    const sortedStandingsData = Array.from(this.contest.standings.StandingsData);
                    sortedStandingsData.sort((a, b) => {
                        if (a.TotalResult.Count === 0 && b.TotalResult.Count === 0)
                            return 0;
                        if (a.TotalResult.Count === 0)
                            return 1;
                        if (b.TotalResult.Count === 0)
                            return -1;
                        if (a.Rank !== b.Rank)
                            return a.Rank - b.Rank;
                        if (b.OldRating !== a.OldRating)
                            return b.OldRating - a.OldRating;
                        if (a.UserIsDeleted)
                            return -1;
                        if (b.UserIsDeleted)
                            return 1;
                        return 0;
                    });
                    let lastPerformance = this.contest.perfLimit;
                    let deletedCount = 0;
                    this.results = new FixedResults(sortedStandingsData.map((data, index) => {
                        let result = rawResult[index - deletedCount];
                        if (!result || data.OldRating !== result.OldRating) {
                            deletedCount++;
                            result = null;
                        }
                        return new Result(result ? result.IsRated : false, true, data.UserScreenName, data.Rank, -1, data.OldRating, result ? result.NewRating : 0, 0, result && result.IsRated ? (lastPerformance = result.Performance) : lastPerformance, result ? result.InnerPerformance : 0);
                    }));
                }
                else {
                    this.results = new OnDemandResults(this.contest, this.contest.templateResults);
                }
            });
            if (!shouldEnabledPredictor().verdict) {
                model.updateInformation(shouldEnabledPredictor().message);
                updateView();
                return;
            }
            try {
                let aPerfs;
                let standings;
                try {
                    standings = yield getStandingsDataAsync(contestScreenName);
                }
                catch (e) {
                    throw new Error("未能获得积分榜。");
                }
                try {
                    aPerfs = yield getAPerfsDataAsync(contestScreenName);
                }
                catch (e) {
                    throw new Error("获取 APerf 失败。");
                }
                yield updateData(aPerfs, standings);
                model.setEnable(true);
                model.updateInformation(`最终更新 : ${new Date().toTimeString().split(" ")[0]}`);
                if (isStandingsPage) {
                    new MutationObserver(() => {
                        tableUpdater.update(tableElement);
                    }).observe(tableElement.tBodies[0], {
                        childList: true,
                    });
                    const refreshElem = document.getElementById("refresh");
                    if (refreshElem)
                        new MutationObserver((mutationRecord) => {
                            const disabled = mutationRecord[0].target.classList.contains("disabled");
                            if (disabled) {
                                void (() => __awaiter(this, void 0, void 0, function* () {
                                    yield updateStandingsFromAPI();
                                    updateView();
                                }))();
                            }
                        }).observe(refreshElem, {
                            attributes: true,
                            attributeFilter: ["class"],
                        });
                }
            }
            catch (e) {
                model.updateInformation(e.message);
                model.setEnable(false);
            }
            updateView();
            {
                const reloadButton = document.getElementById("predictor-reload");
                reloadButton.addEventListener("click", () => {
                    void (() => __awaiter(this, void 0, void 0, function* () {
                        model.updateInformation("正在加载…");
                        reloadButton.disabled = true;
                        updateView();
                        yield updateStandingsFromAPI();
                        reloadButton.disabled = false;
                        updateView();
                    }))();
                });
                document.getElementById("predictor-current").addEventListener("click", () => {
                    const myResult = this.contest.templateResults[userScreenName];
                    if (!myResult)
                        return;
                    model = new CalcFromRankModel(model);
                    model.updateData(myResult.RatedRank, model.perfValue, model.rateValue);
                    updateView();
                });
                document.getElementById("predictor-input-rank").addEventListener("keyup", () => {
                    const inputString = document.getElementById("predictor-input-rank").value;
                    const inputNumber = parseInt(inputString);
                    if (!isFinite(inputNumber))
                        return;
                    model = new CalcFromRankModel(model);
                    model.updateData(inputNumber, 0, 0);
                    updateView();
                });
                document.getElementById("predictor-input-perf").addEventListener("keyup", () => {
                    const inputString = document.getElementById("predictor-input-perf").value;
                    const inputNumber = parseInt(inputString);
                    if (!isFinite(inputNumber))
                        return;
                    model = new CalcFromPerfModel(model);
                    model.updateData(0, inputNumber, 0);
                    updateView();
                });
                document.getElementById("predictor-input-rate").addEventListener("keyup", () => {
                    const inputString = document.getElementById("predictor-input-rate").value;
                    const inputNumber = parseInt(inputString);
                    if (!isFinite(inputNumber))
                        return;
                    model = new CalcFromRateModel(model);
                    model.updateData(0, 0, inputNumber);
                    updateView();
                });
            }
            function updateStandingsFromAPI() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const shouldEnabled = shouldEnabledPredictor();
                        if (!shouldEnabled.verdict) {
                            model.updateInformation(shouldEnabled.message);
                            model.setEnable(false);
                            return;
                        }
                        const standings = yield getStandingsDataAsync(contestScreenName);
                        const aperfs = yield getAPerfsDataAsync(contestScreenName);
                        yield updateData(aperfs, standings);
                        model.updateInformation(`最终更新 : ${new Date().toTimeString().split(" ")[0]}`);
                        model.setEnable(true);
                    }
                    catch (e) {
                        model.updateInformation(e.message);
                        model.setEnable(false);
                    }
                });
            }
            function shouldEnabledPredictor() {
                if (new Date() < startTime)
                    return { verdict: false, message: "比赛尚未开始" };
                if (startTime < firstContestDate)
                    return {
                        verdict: false,
                        message: "这是现行 Rated 计算制度之前的一场比赛",
                    };
                if (contestInformation.RatedRange[0] > contestInformation.RatedRange[1])
                    return {
                        verdict: false,
                        message: "不是 Rated 竞赛",
                    };
                return { verdict: true, message: "" };
            }
            function updateView() {
                const roundedRankValue = isFinite(model.rankValue) ? roundValue(model.rankValue, 2).toString() : "";
                const roundedPerfValue = isFinite(model.perfValue) ? roundValue(model.perfValue, 2).toString() : "";
                const roundedRateValue = isFinite(model.rateValue) ? roundValue(model.rateValue, 2).toString() : "";
                document.getElementById("predictor-input-rank").value = roundedRankValue;
                document.getElementById("predictor-input-perf").value = roundedPerfValue;
                document.getElementById("predictor-input-rate").value = roundedRateValue;
                document.getElementById("predictor-alert").innerHTML = `<h5 class='sidemenu-txt'>${model.information}</h5>`;
                if (model.enabled)
                    enabled();
                else
                    disabled();
                if (isStandingsPage && shouldEnabledPredictor().verdict) {
                    tableUpdater.update(tableElement);
                }
                function enabled() {
                    predictorElements.forEach((element) => {
                        document.getElementById(element).disabled = false;
                    });
                }
                function disabled() {
                    predictorElements.forEach((element) => {
                        document.getElementById(element).disabled = false;
                    });
                }
            }
        });
    }
    afterOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            getPerformanceHistories(yield getHistoryDataAsync(userScreenName)).forEach((elem) => this.historyData.push(elem));
        });
    }
}
const predictor = new PredictorElement();

var dom$1 = "<div id=\"estimator-alert\"></div>\n<div class=\"row\">\n\t<div class=\"input-group\">\n\t\t<span class=\"input-group-addon\" id=\"estimator-input-desc\"></span>\n\t\t<input type=\"number\" class=\"form-control\" id=\"estimator-input\">\n\t</div>\n</div>\n<div class=\"row\">\n\t<div class=\"input-group\">\n\t\t<span class=\"input-group-addon\" id=\"estimator-res-desc\"></span>\n\t\t<input class=\"form-control\" id=\"estimator-res\" disabled=\"disabled\">\n\t\t<span class=\"input-group-btn\">\n\t\t\t<button class=\"btn btn-default\" id=\"estimator-toggle\">调换</button>\n\t\t</span>\n\t</div>\n</div>\n<div class=\"row\" style=\"margin: 10px 0px;\">\n\t<a class=\"btn btn-default col-xs-offset-8 col-xs-4\" rel=\"nofollow\" onclick=\"window.open(encodeURI(decodeURI(this.href)),'twwindow','width=550, height=450, personalbar=0, toolbar=0, scrollbars=1'); return false;\" id=\"estimator-tweet\">分享到推特</a>\n</div>";

class EstimatorModel {
    constructor(inputValue, perfHistory) {
        this.inputDesc = "";
        this.resultDesc = "";
        this.perfHistory = perfHistory;
        this.updateInput(inputValue);
    }
    updateInput(value) {
        this.inputValue = value;
        this.resultValue = this.calcResult(value);
    }
    toggle() {
        return null;
    }
    calcResult(input) {
        return input;
    }
}

class CalcRatingModel extends EstimatorModel {
    constructor(inputValue, perfHistory) {
        super(inputValue, perfHistory);
        this.inputDesc = "表现分";
        this.resultDesc = "成就等级";
    }
    toggle() {
        return new CalcPerfModel(this.resultValue, this.perfHistory);
    }
    calcResult(input) {
        return positivizeRating(calcRatingFromHistory(this.perfHistory.concat([input])));
    }
}

class CalcPerfModel extends EstimatorModel {
    constructor(inputValue, perfHistory) {
        super(inputValue, perfHistory);
        this.inputDesc = "表现分";
        this.resultDesc = "到达的 Rating";
    }
    toggle() {
        return new CalcRatingModel(this.resultValue, this.perfHistory);
    }
    calcResult(input) {
        return calcRequiredPerformance(unpositivizeRating(input), this.perfHistory);
    }
}

function GetEmbedTweetLink(content, url) {
    return `https://twitter.com/share?text=${encodeURI(content)}&url=${encodeURI(url)}`;
}

function getLS(key) {
    const val = localStorage.getItem(key);
    return (val ? JSON.parse(val) : val);
}
function setLS(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    }
    catch (error) {
        console.log(error);
    }
}
const models = [CalcPerfModel, CalcRatingModel];
function GetModelFromStateCode(state, value, history) {
    let model = models.find((model) => model.name === state);
    if (!model)
        model = CalcPerfModel;
    return new model(value, history);
}
class EstimatorElement extends SideMenuElement {
    constructor() {
        super(...arguments);
        this.id = "estimator";
        this.title = "Estimator";
        this.document = dom$1;
        this.match = /atcoder.jp/;
    }
    afterAppend() {
        //nothing to do
    }
    // nothing to do
    afterOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const estimatorInputSelector = document.getElementById("estimator-input");
            const estimatorResultSelector = document.getElementById("estimator-res");
            let model = GetModelFromStateCode(getLS("sidemenu_estimator_state"), getLS("sidemenu_estimator_value"), getPerformanceHistories(yield getHistoryDataAsync(userScreenName)));
            updateView();
            document.getElementById("estimator-toggle").addEventListener("click", () => {
                model = model.toggle();
                updateLocalStorage();
                updateView();
            });
            estimatorInputSelector.addEventListener("keyup", () => {
                updateModel();
                updateLocalStorage();
                updateView();
            });
            /** modelをinputの値に応じて更新 */
            function updateModel() {
                const inputNumber = estimatorInputSelector.valueAsNumber;
                if (!isFinite(inputNumber))
                    return;
                model.updateInput(inputNumber);
            }
            /** modelの状態をLSに保存 */
            function updateLocalStorage() {
                setLS("sidemenu_estimator_value", model.inputValue);
                setLS("sidemenu_estimator_state", model.constructor.name);
            }
            /** modelを元にviewを更新 */
            function updateView() {
                const roundedInput = roundValue(model.inputValue, 2);
                const roundedResult = roundValue(model.resultValue, 2);
                document.getElementById("estimator-input-desc").innerText = model.inputDesc;
                document.getElementById("estimator-res-desc").innerText = model.resultDesc;
                estimatorInputSelector.value = String(roundedInput);
                estimatorResultSelector.value = String(roundedResult);
                const tweetStr = `AtCoder 用户名: ${userScreenName}\n${model.inputDesc}: ${roundedInput}\n${model.resultDesc}: ${roundedResult}\n`;
                document.getElementById("estimator-tweet").href = GetEmbedTweetLink(tweetStr, "https://greasyfork.org/ja/scripts/369954-ac-predictor");
            }
        });
    }
}
const estimator = new EstimatorElement();

var sidemenuHtml = "<style>\n    #menu-wrap {\n        display: block;\n        position: fixed;\n        top: 0;\n        z-index: 20;\n        width: 400px;\n        right: -350px;\n        transition: all 150ms 0ms ease;\n        margin-top: 50px;\n    }\n\n    #sidemenu {\n        background: #000;\n        opacity: 0.85;\n    }\n    #sidemenu-key {\n        border-radius: 5px 0px 0px 5px;\n        background: #000;\n        opacity: 0.85;\n        color: #FFF;\n        padding: 30px 0;\n        cursor: pointer;\n        margin-top: 100px;\n        text-align: center;\n    }\n\n    #sidemenu {\n        display: inline-block;\n        width: 350px;\n        float: right;\n    }\n\n    #sidemenu-key {\n        display: inline-block;\n        width: 50px;\n        float: right;\n    }\n\n    .sidemenu-active {\n        transform: translateX(-350px);\n    }\n\n    .sidemenu-txt {\n        color: #DDD;\n    }\n\n    .menu-wrapper {\n        border-bottom: 1px solid #FFF;\n    }\n\n    .menu-header {\n        margin: 10px 20px 10px 20px;\n        user-select: none;\n    }\n\n    .menu-box {\n        overflow: hidden;\n        transition: all 300ms 0s ease;\n    }\n    .menu-box-collapse {\n        height: 0px !important;\n    }\n    .menu-box-collapse .menu-content {\n        transform: translateY(-100%);\n    }\n    .menu-content {\n        padding: 10px 20px 10px 20px;\n        transition: all 300ms 0s ease;\n    }\n    .cnvtb-fixed {\n        z-index: 19;\n    }\n</style>\n<div id=\"menu-wrap\">\n    <div id=\"sidemenu\" class=\"container\"></div>\n    <div id=\"sidemenu-key\" class=\"glyphicon glyphicon-menu-left\"></div>\n</div>";

//import "./sidemenu.scss";
class SideMenu {
    constructor() {
        this.pendingElements = [];
        this.Generate();
    }
    Generate() {
        document.getElementById("main-div").insertAdjacentHTML("afterbegin", sidemenuHtml);
        resizeSidemenuHeight();
        const key = document.getElementById("sidemenu-key");
        const wrap = document.getElementById("menu-wrap");
        key.addEventListener("click", () => {
            this.pendingElements.forEach((elem) => {
                elem.afterOpen();
            });
            this.pendingElements.length = 0;
            key.classList.toggle("glyphicon-menu-left");
            key.classList.toggle("glyphicon-menu-right");
            wrap.classList.toggle("sidemenu-active");
        });
        window.addEventListener("onresize", resizeSidemenuHeight);
        document.getElementById("sidemenu").addEventListener("click", (event) => {
            const target = event.target;
            const header = target.closest(".menu-header");
            if (!header)
                return;
            const box = target.closest(".menu-wrapper").querySelector(".menu-box");
            box.classList.toggle("menu-box-collapse");
            const arrow = target.querySelector(".glyphicon");
            arrow.classList.toggle("glyphicon-menu-down");
            arrow.classList.toggle("glyphicon-menu-up");
        });
        function resizeSidemenuHeight() {
            document.getElementById("sidemenu").style.height = `${window.innerHeight}px`;
        }
    }
    addElement(element) {
        if (!element.shouldDisplayed(document.location.href))
            return;
        const sidemenu = document.getElementById("sidemenu");
        sidemenu.insertAdjacentHTML("afterbegin", element.GetHTML());
        const content = sidemenu.querySelector(".menu-content");
        content.parentElement.style.height = `${content.offsetHeight}px`;
        element.afterAppend();
        this.pendingElements.push(element);
    }
}

const sidemenu = new SideMenu();
const elements = [predictor, estimator];
for (let i = elements.length - 1; i >= 0; i--) {
    sidemenu.addElement(elements[i]);
}
