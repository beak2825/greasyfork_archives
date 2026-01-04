// ==UserScript==
// @name         atcoder-standings-difficulty-analyzer
// @namespace    iilj
// @version      2025.5.5
// @description  順位表の得点情報を集計し，推定 difficulty やその推移を表示します．
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/atcoder-standings-difficulty-analyzer/issues
// @match        https://atcoder.jp/*standings*
// @exclude      https://atcoder.jp/*standings/json
// @resource     loaders.min.css https://cdnjs.cloudflare.com/ajax/libs/loaders.css/0.1.2/loaders.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546253/atcoder-standings-difficulty-analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/546253/atcoder-standings-difficulty-analyzer.meta.js
// ==/UserScript==
var css = "#acssa-contents .table.acssa-table {\n  width: 100%;\n  table-layout: fixed;\n  margin-bottom: 1.5rem;\n}\n#acssa-contents .table.acssa-table .acssa-thead {\n  font-weight: bold;\n}\n#acssa-contents .table.acssa-table > tbody > tr > td.success.acssa-task-success.acssa-task-success-suppress {\n  background-color: transparent;\n}\n#acssa-contents #acssa-tab-wrapper {\n  display: none;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-chart-tab {\n  margin-bottom: 0.5rem;\n  display: inline-block;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-chart-tab a {\n  cursor: pointer;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-chart-tab a span.glyphicon {\n  margin-right: 0.5rem;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab {\n  margin-bottom: 0.5rem;\n  display: inline-block;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab li a {\n  color: black;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab li a:hover {\n  background-color: transparent;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab li a label {\n  cursor: pointer;\n  margin: 0;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab li a label input {\n  cursor: pointer;\n  margin: 0;\n}\n#acssa-contents #acssa-tab-wrapper #acssa-checkbox-tab #acssa-checkbox-toggle-log-plot-parent {\n  display: none;\n}\n#acssa-contents .acssa-loader-wrapper {\n  background-color: #337ab7;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n  border-radius: 3px;\n}\n#acssa-contents .acssa-chart-wrapper {\n  display: none;\n}\n#acssa-contents .acssa-chart-wrapper.acssa-chart-wrapper-active {\n  display: block;\n}";

var teamalert = "<div class=\"alert alert-warning\">\n    チーム戦順位表が提供されています．個人単位の順位表ページでは，difficulty 推定値が不正確になります．\n</div>";

const arrayLowerBound = (arr, n) => {
    let first = 0, last = arr.length - 1, middle;
    while (first <= last) {
        middle = 0 | ((first + last) / 2);
        if (arr[middle] < n)
            first = middle + 1;
        else
            last = middle - 1;
    }
    return first;
};
const getColor = (rating) => {
    if (rating < 400)
        return '#808080';
    //          gray
    else if (rating < 800)
        return '#804000';
    //     brown
    else if (rating < 1200)
        return '#008000';
    //    green
    else if (rating < 1600)
        return '#00C0C0';
    //    cyan
    else if (rating < 2000)
        return '#0000FF';
    //    blue
    else if (rating < 2400)
        return '#C0C000';
    //    yellow
    else if (rating < 2800)
        return '#FF8000';
    //    orange
    else if (rating == 9999)
        return '#000000';
    return '#FF0000'; //                            red
};
const formatTimespan = (sec) => {
    let sign;
    if (sec >= 0) {
        sign = '';
    }
    else {
        sign = '-';
        sec *= -1;
    }
    return `${sign}${Math.floor(sec / 60)}:${`0${sec % 60}`.slice(-2)}`;
};
/** 現在のページから，コンテストの開始から終了までの秒数を抽出する */
const getContestDurationSec = () => {
    if (contestScreenName.startsWith('past')) {
        return 300 * 60;
    }
    // toDate.diff(fromDate) でミリ秒が返ってくる
    return endTime.diff(startTime) / 1000;
};
const getCenterOfInnerRatingFromRange = (contestRatedRange) => {
    if (contestScreenName.startsWith('abc')) {
        return 800;
    }
    if (contestScreenName.startsWith('arc')) {
        const contestNumber = Number(contestScreenName.substring(3, 6));
        return contestNumber >= 104 ? 1000 : 1600;
    }
    if (contestScreenName.startsWith('agc')) {
        const contestNumber = Number(contestScreenName.substring(3, 6));
        return contestNumber >= 34 ? 1200 : 1600;
    }
    if (contestRatedRange[1] === 1999) {
        return 800;
    }
    else if (contestRatedRange[1] === 2799) {
        return 1000;
    }
    else if (contestRatedRange[1] === Infinity) {
        return 1200;
    }
    return 800;
};
// ContestRatedRange
/*
function getContestInformationAsync(contestScreenName) {
    return __awaiter(this, void 0, void 0, function* () {
        const html = yield fetchTextDataAsync(`https://atcoder.jp/contests/${contestScreenName}`);
        const topPageDom = new DOMParser().parseFromString(html, "text/html");
        const dataParagraph = topPageDom.getElementsByClassName("small")[0];
        const data = Array.from(dataParagraph.children).map((x) => x.innerHTML.split(":")[1].trim());
        return new ContestInformation(parseRangeString(data[0]), parseRangeString(data[1]), parseDurationString(data[2]));
    });
}
*/
function parseRangeString(s) {
    s = s.trim();
    if (s === '-')
        return [0, -1];
    if (s === 'All')
        return [0, Infinity];
    if (!/[-~]/.test(s))
        return [0, -1];
    const res = s.split(/[-~]/).map((x) => parseInt(x.trim()));
    if (res.length !== 2) {
        throw new Error('res is not [number, number]');
    }
    if (isNaN(res[0]))
        res[0] = 0;
    if (isNaN(res[1]))
        res[1] = Infinity;
    return res;
}
const getContestRatedRangeAsync = async (contestScreenName) => {
    const html = await fetch(`https://atcoder.jp/contests/${contestScreenName}`);
    const topPageDom = new DOMParser().parseFromString(await html.text(), 'text/html');
    const dataParagraph = topPageDom.getElementsByClassName('small')[0];
    const data = Array.from(dataParagraph.children).map((x) => x.innerHTML.split(':')[1].trim());
    // console.log("data", data);
    return parseRangeString(data[1]);
    // return new ContestInformation(parseRangeString(data[0]), parseRangeString(data[1]), parseDurationString(data[2]));
};
const rangeLen = (len) => Array.from({ length: len }, (v, k) => k);

const BASE_URL = 'https://raw.githubusercontent.com/iilj/atcoder-standings-difficulty-analyzer/main/json/standings';
const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    const obj = (await res.json());
    return obj;
};
const fetchContestAcRatioModel = async (contestScreenName, contestDurationMinutes) => {
    // https://raw.githubusercontent.com/iilj/atcoder-standings-difficulty-analyzer/main/json/standings/abc_100m.json
    let modelLocation = undefined;
    if (/^agc(\d{3,})$/.exec(contestScreenName)) {
        if ([110, 120, 130, 140, 150, 160, 180, 200, 210, 240, 270, 300].includes(contestDurationMinutes)) {
            modelLocation = `${BASE_URL}/agc_${contestDurationMinutes}m.json`;
        }
    }
    else if (/^arc(\d{3,})$/.exec(contestScreenName)) {
        if ([100, 120, 150].includes(contestDurationMinutes)) {
            modelLocation = `${BASE_URL}/arc_${contestDurationMinutes}m.json`;
        }
    }
    else if (/^abc(\d{3,})$/.exec(contestScreenName)) {
        if ([100, 120].includes(contestDurationMinutes)) {
            modelLocation = `${BASE_URL}/abc_${contestDurationMinutes}m.json`;
        }
    }
    if (modelLocation !== undefined) {
        return await fetchJson(modelLocation);
    }
    return undefined;
};
const fetchInnerRatingsFromPredictor = async (contestScreenName) => {
    const url = `https://data.ac-predictor.com/aperfs/${contestScreenName}.json`;
    try {
        return await fetchJson(url);
    }
    catch (e) {
        return {};
    }
};

class RatingConverter {
}
/** 表示用の低レート帯補正レート → 低レート帯補正前のレート */
RatingConverter.toRealRating = (correctedRating) => {
    if (correctedRating >= 400)
        return correctedRating;
    else
        return 400 * (1 - Math.log(400 / correctedRating));
};
/** 低レート帯補正前のレート → 内部レート推定値 */
RatingConverter.toInnerRating = (realRating, comp) => {
    return (realRating +
        (1200 * (Math.sqrt(1 - Math.pow(0.81, comp)) / (1 - Math.pow(0.9, comp)) - 1)) / (Math.sqrt(19) - 1));
};
/** 低レート帯補正前のレート → 表示用の低レート帯補正レート */
RatingConverter.toCorrectedRating = (realRating) => {
    if (realRating >= 400)
        return realRating;
    else
        return Math.floor(400 / Math.exp((400 - realRating) / 400));
};

class DifficultyCalculator {
    constructor(sortedInnerRatings) {
        this.innerRatings = sortedInnerRatings;
        this.prepared = new Map();
        this.memo = new Map();
    }
    perf2ExpectedAcceptedCount(m) {
        let expectedAcceptedCount;
        if (this.prepared.has(m)) {
            expectedAcceptedCount = this.prepared.get(m);
        }
        else {
            expectedAcceptedCount = this.innerRatings.reduce((prev_expected_accepts, innerRating) => (prev_expected_accepts += 1 / (1 + Math.pow(6, (m - innerRating) / 400))), 0);
            this.prepared.set(m, expectedAcceptedCount);
        }
        return expectedAcceptedCount;
    }
    perf2Ranking(x) {
        return this.perf2ExpectedAcceptedCount(x) + 0.5;
    }
    rank2InnerPerf(rank) {
        let upper = 9999;
        let lower = -9999;
        while (upper - lower > 0.1) {
            const mid = (upper + lower) / 2;
            if (rank > this.perf2Ranking(mid))
                upper = mid;
            else
                lower = mid;
        }
        return Math.round((upper + lower) / 2);
    }
    /** Difficulty 推定値を算出する */
    binarySearchCorrectedDifficulty(acceptedCount) {
        if (this.memo.has(acceptedCount)) {
            return this.memo.get(acceptedCount);
        }
        let lb = -10000;
        let ub = 10000;
        while (ub - lb > 1) {
            const m = Math.floor((ub + lb) / 2);
            const expectedAcceptedCount = this.perf2ExpectedAcceptedCount(m);
            if (expectedAcceptedCount < acceptedCount)
                ub = m;
            else
                lb = m;
        }
        const difficulty = lb;
        const correctedDifficulty = RatingConverter.toCorrectedRating(difficulty);
        this.memo.set(acceptedCount, correctedDifficulty);
        return correctedDifficulty;
    }
}

var html$1 = "<div id=\"acssa-loader\" class=\"loader acssa-loader-wrapper\">\n    <div class=\"loader-inner ball-pulse\">\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>\n</div>\n<div id=\"acssa-chart-block\">\n    <div class=\"acssa-chart-wrapper acssa-chart-wrapper-active\" id=\"acssa-mydiv-difficulty-wrapper\">\n        <div id=\"acssa-mydiv-difficulty\" style=\"width:100%;\"></div>\n    </div>\n    <div class=\"acssa-chart-wrapper\" id=\"acssa-mydiv-accepted-count-wrapper\">\n        <div id=\"acssa-mydiv-accepted-count\" style=\"width:100%;\"></div>\n    </div>\n    <div class=\"acssa-chart-wrapper\" id=\"acssa-mydiv-accepted-time-wrapper\">\n        <div id=\"acssa-mydiv-accepted-time\" style=\"width:100%;\"></div>\n    </div>\n</div>";

const LOADER_ID = 'acssa-loader';
const plotlyDifficultyChartId = 'acssa-mydiv-difficulty';
const plotlyAcceptedCountChartId = 'acssa-mydiv-accepted-count';
const plotlyLastAcceptedTimeChartId = 'acssa-mydiv-accepted-time';
const yourMarker = {
    size: 10,
    symbol: 'cross',
    color: 'red',
    line: {
        color: 'white',
        width: 1,
    },
};
const config = { autosize: true };
// 背景用設定
const alpha = 0.3;
const colors = [
    [0, 400, `rgba(128,128,128,${alpha})`],
    [400, 800, `rgba(128,0,0,${alpha})`],
    [800, 1200, `rgba(0,128,0,${alpha})`],
    [1200, 1600, `rgba(0,255,255,${alpha})`],
    [1600, 2000, `rgba(0,0,255,${alpha})`],
    [2000, 2400, `rgba(255,255,0,${alpha})`],
    [2400, 2800, `rgba(255,165,0,${alpha})`],
    [2800, 10000, `rgba(255,0,0,${alpha})`],
];
class Charts {
    constructor(parent, tasks, scoreLastAcceptedTimeMap, taskAcceptedCounts, taskAcceptedElapsedTimes, yourTaskAcceptedElapsedTimes, yourScore, yourLastAcceptedTime, participants, dcForDifficulty, dcForPerformance, ratedRank2EntireRank, tabs) {
        this.tasks = tasks;
        this.scoreLastAcceptedTimeMap = scoreLastAcceptedTimeMap;
        this.taskAcceptedCounts = taskAcceptedCounts;
        this.taskAcceptedElapsedTimes = taskAcceptedElapsedTimes;
        this.yourTaskAcceptedElapsedTimes = yourTaskAcceptedElapsedTimes;
        this.yourScore = yourScore;
        this.yourLastAcceptedTime = yourLastAcceptedTime;
        this.participants = participants;
        this.dcForDifficulty = dcForDifficulty;
        this.dcForPerformance = dcForPerformance;
        this.ratedRank2EntireRank = ratedRank2EntireRank;
        this.tabs = tabs;
        parent.insertAdjacentHTML('beforeend', html$1);
        this.duration = getContestDurationSec();
        this.xtick = 60 * 10 * Math.max(1, Math.ceil(this.duration / (60 * 10 * 20))); // 10 分を最小単位にする
    }
    async plotAsync() {
        // 以降の計算は時間がかかる
        this.taskAcceptedElapsedTimes.forEach((ar) => {
            ar.sort((a, b) => a - b);
        });
        // 時系列データの準備
        const [difficultyChartData, acceptedCountChartData] = await this.getTimeSeriesChartData();
        // 得点と提出時間データの準備
        const [lastAcceptedTimeChartData, maxAcceptedTime] = this.getLastAcceptedTimeChartData();
        // 軸フォーマットをカスタムする
        this.overrideAxisFormat();
        // Difficulty Chart 描画
        await this.plotDifficultyChartData(difficultyChartData);
        // Accepted Count Chart 描画
        await this.plotAcceptedCountChartData(acceptedCountChartData);
        // LastAcceptedTime Chart 描画
        await this.plotLastAcceptedTimeChartData(lastAcceptedTimeChartData, maxAcceptedTime);
    }
    /** 時系列データの準備 */
    async getTimeSeriesChartData() {
        /** Difficulty Chart のデータ */
        const difficultyChartData = [];
        /** AC Count Chart のデータ */
        const acceptedCountChartData = [];
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let j = 0; j < this.tasks.length; ++j) {
            //
            const interval = Math.ceil(this.taskAcceptedCounts[j] / 140);
            const [taskAcceptedElapsedTimesForChart, taskAcceptedCountsForChart] = this.taskAcceptedElapsedTimes[j].reduce(([ar, arr], tm, idx) => {
                const tmpInterval = Math.max(1, Math.min(Math.ceil(idx / 10), interval));
                if (idx % tmpInterval == 0 || idx == this.taskAcceptedCounts[j] - 1) {
                    ar.push(tm);
                    arr.push(idx + 1);
                }
                return [ar, arr];
            }, [[], []]);
            const correctedDifficulties = [];
            let counter = 0;
            for (const taskAcceptedCountForChart of taskAcceptedCountsForChart) {
                correctedDifficulties.push(this.dcForDifficulty.binarySearchCorrectedDifficulty(taskAcceptedCountForChart));
                counter += 1;
                // 20回に1回setTimeout(0)でeventループに処理を移す
                if (counter % 20 == 0) {
                    await sleep(0);
                }
            }
            difficultyChartData.push({
                x: taskAcceptedElapsedTimesForChart,
                y: correctedDifficulties,
                type: 'scattergl',
                name: `${this.tasks[j].Assignment}`,
            });
            acceptedCountChartData.push({
                x: taskAcceptedElapsedTimesForChart,
                y: taskAcceptedCountsForChart,
                type: 'scattergl',
                name: `${this.tasks[j].Assignment}`,
            });
        }
        // 現在のユーザのデータを追加
        if (this.yourScore !== -1) {
            const yourAcceptedTimes = [];
            const yourAcceptedDifficulties = [];
            const yourAcceptedCounts = [];
            for (let j = 0; j < this.tasks.length; ++j) {
                if (this.yourTaskAcceptedElapsedTimes[j] !== -1) {
                    yourAcceptedTimes.push(this.yourTaskAcceptedElapsedTimes[j]);
                    const yourAcceptedCount = arrayLowerBound(this.taskAcceptedElapsedTimes[j], this.yourTaskAcceptedElapsedTimes[j]) + 1;
                    yourAcceptedCounts.push(yourAcceptedCount);
                    yourAcceptedDifficulties.push(this.dcForDifficulty.binarySearchCorrectedDifficulty(yourAcceptedCount));
                }
            }
            this.tabs.yourDifficultyChartData = {
                x: yourAcceptedTimes,
                y: yourAcceptedDifficulties,
                mode: 'markers',
                type: 'scattergl',
                name: `${userScreenName}`,
                marker: yourMarker,
            };
            this.tabs.yourAcceptedCountChartData = {
                x: yourAcceptedTimes,
                y: yourAcceptedCounts,
                mode: 'markers',
                type: 'scattergl',
                name: `${userScreenName}`,
                marker: yourMarker,
            };
            difficultyChartData.push(this.tabs.yourDifficultyChartData);
            acceptedCountChartData.push(this.tabs.yourAcceptedCountChartData);
        }
        return [difficultyChartData, acceptedCountChartData];
    }
    /** 得点と提出時間データの準備 */
    getLastAcceptedTimeChartData() {
        const lastAcceptedTimeChartData = [];
        const scores = [...this.scoreLastAcceptedTimeMap.keys()];
        scores.sort((a, b) => b - a);
        let acc = 0;
        let maxAcceptedTime = 0;
        scores.forEach((score) => {
            const lastAcceptedTimes = this.scoreLastAcceptedTimeMap.get(score);
            lastAcceptedTimes.sort((a, b) => a - b);
            const interval = Math.ceil(lastAcceptedTimes.length / 100);
            const lastAcceptedTimesForChart = lastAcceptedTimes.reduce((ar, tm, idx) => {
                if (idx % interval == 0 || idx == lastAcceptedTimes.length - 1)
                    ar.push(tm);
                return ar;
            }, []);
            const lastAcceptedTimesRanks = lastAcceptedTimes.reduce((ar, tm, idx) => {
                if (idx % interval == 0 || idx == lastAcceptedTimes.length - 1)
                    ar.push(acc + idx + 1);
                return ar;
            }, []);
            lastAcceptedTimeChartData.push({
                x: lastAcceptedTimesRanks,
                y: lastAcceptedTimesForChart,
                type: 'scattergl',
                name: `${score}`,
            });
            if (score === this.yourScore) {
                const lastAcceptedTimesRank = arrayLowerBound(lastAcceptedTimes, this.yourLastAcceptedTime);
                this.tabs.yourLastAcceptedTimeChartData = {
                    x: [acc + lastAcceptedTimesRank + 1],
                    y: [this.yourLastAcceptedTime],
                    mode: 'markers',
                    type: 'scattergl',
                    name: `${userScreenName}`,
                    marker: yourMarker,
                };
                this.tabs.yourLastAcceptedTimeChartDataIndex = lastAcceptedTimeChartData.length + 0;
                lastAcceptedTimeChartData.push(this.tabs.yourLastAcceptedTimeChartData);
            }
            acc += lastAcceptedTimes.length;
            if (lastAcceptedTimes[lastAcceptedTimes.length - 1] > maxAcceptedTime) {
                maxAcceptedTime = lastAcceptedTimes[lastAcceptedTimes.length - 1];
            }
        });
        return [lastAcceptedTimeChartData, maxAcceptedTime];
    }
    /**
     * 軸フォーマットをカスタムする
     * Support specifying a function for tickformat · Issue #1464 · plotly/plotly.js
     * https://github.com/plotly/plotly.js/issues/1464#issuecomment-498050894
     */
    overrideAxisFormat() {
        const org_locale = Plotly.d3.locale;
        Plotly.d3.locale = (locale) => {
            const result = org_locale(locale);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const org_number_format = result.numberFormat;
            result.numberFormat = (format) => {
                if (format != 'TIME') {
                    return org_number_format(format);
                }
                return (x) => formatTimespan(x).toString();
            };
            return result;
        };
    }
    /** Difficulty Chart 描画 */
    async plotDifficultyChartData(difficultyChartData) {
        const maxAcceptedCount = this.taskAcceptedCounts.reduce((a, b) => Math.max(a, b));
        const yMax = RatingConverter.toCorrectedRating(this.dcForDifficulty.binarySearchCorrectedDifficulty(1));
        const yMin = RatingConverter.toCorrectedRating(this.dcForDifficulty.binarySearchCorrectedDifficulty(Math.max(2, maxAcceptedCount)));
        // 描画
        const layout = {
            title: 'Difficulty',
            xaxis: {
                dtick: this.xtick,
                tickformat: 'TIME',
                range: [0, this.duration],
                // title: { text: 'Elapsed' }
            },
            yaxis: {
                dtick: 400,
                tickformat: 'd',
                range: [
                    Math.max(0, Math.floor((yMin - 100) / 400) * 400),
                    Math.max(0, Math.ceil((yMax + 100) / 400) * 400),
                ],
                // title: { text: 'Difficulty' }
            },
            shapes: colors.map((c) => {
                return {
                    type: 'rect',
                    layer: 'below',
                    xref: 'x',
                    yref: 'y',
                    x0: 0,
                    x1: this.duration,
                    y0: c[0],
                    y1: c[1],
                    line: { width: 0 },
                    fillcolor: c[2],
                };
            }),
            margin: {
                b: 60,
                t: 30,
            },
        };
        await Plotly.newPlot(plotlyDifficultyChartId, difficultyChartData, layout, config);
        window.addEventListener('resize', () => {
            if (this.tabs.activeTab == 0)
                void Plotly.relayout(plotlyDifficultyChartId, {
                    width: document.getElementById(plotlyDifficultyChartId).clientWidth,
                });
        });
    }
    /** Accepted Count Chart 描画 */
    async plotAcceptedCountChartData(acceptedCountChartData) {
        this.tabs.acceptedCountYMax = this.participants;
        const rectSpans = colors.reduce((ar, cur) => {
            const bottom = this.dcForDifficulty.perf2ExpectedAcceptedCount(cur[1]);
            if (bottom > this.tabs.acceptedCountYMax)
                return ar;
            const top = cur[0] == 0 ? this.tabs.acceptedCountYMax : this.dcForDifficulty.perf2ExpectedAcceptedCount(cur[0]);
            if (top < 0.5)
                return ar;
            ar.push([Math.max(0.5, bottom), Math.min(this.tabs.acceptedCountYMax, top), cur[2]]);
            return ar;
        }, []);
        // 描画
        const layout = {
            title: 'Accepted Count',
            xaxis: {
                dtick: this.xtick,
                tickformat: 'TIME',
                range: [0, this.duration],
                // title: { text: 'Elapsed' }
            },
            yaxis: {
                // type: 'log',
                // dtick: 100,
                tickformat: 'd',
                range: [0, this.tabs.acceptedCountYMax],
                // range: [
                //     Math.log10(0.5),
                //     Math.log10(acceptedCountYMax)
                // ],
                // title: { text: 'Difficulty' }
            },
            shapes: rectSpans.map((span) => {
                return {
                    type: 'rect',
                    layer: 'below',
                    xref: 'x',
                    yref: 'y',
                    x0: 0,
                    x1: this.duration,
                    y0: span[0],
                    y1: span[1],
                    line: { width: 0 },
                    fillcolor: span[2],
                };
            }),
            margin: {
                b: 60,
                t: 30,
            },
        };
        await Plotly.newPlot(plotlyAcceptedCountChartId, acceptedCountChartData, layout, config);
        window.addEventListener('resize', () => {
            if (this.tabs.activeTab == 1)
                void Plotly.relayout(plotlyAcceptedCountChartId, {
                    width: document.getElementById(plotlyAcceptedCountChartId).clientWidth,
                });
        });
    }
    /** LastAcceptedTime Chart 描画 */
    async plotLastAcceptedTimeChartData(lastAcceptedTimeChartData, maxAcceptedTime) {
        const xMax = this.participants;
        // Rated 内のランクから，全体のランクへ変換する
        const convRatedRank2EntireRank = (ratedRank) => {
            const intRatedRank = Math.floor(ratedRank);
            if (intRatedRank >= this.ratedRank2EntireRank.length)
                return xMax;
            return this.ratedRank2EntireRank[intRatedRank];
        };
        const yMax = Math.ceil((maxAcceptedTime + this.xtick / 2) / this.xtick) * this.xtick;
        const rectSpans = colors.reduce((ar, cur) => {
            const right = cur[0] == 0 ? xMax : convRatedRank2EntireRank(this.dcForPerformance.perf2Ranking(cur[0]));
            if (right < 1)
                return ar;
            const left = cur[1] === 10000 ? 0 : convRatedRank2EntireRank(this.dcForPerformance.perf2Ranking(cur[1]));
            if (left > xMax)
                return ar;
            ar.push([Math.max(0, left), Math.min(xMax, right), cur[2]]);
            return ar;
        }, []);
        // console.log(colors);
        // console.log(rectSpans);
        const layout = {
            title: 'LastAcceptedTime v.s. Rank',
            xaxis: {
                // dtick: 100,
                tickformat: 'd',
                range: [0, xMax],
                // title: { text: 'Elapsed' }
            },
            yaxis: {
                dtick: this.xtick,
                tickformat: 'TIME',
                range: [0, yMax],
                // range: [
                //     Math.max(0, Math.floor((yMin - 100) / 400) * 400),
                //     Math.max(0, Math.ceil((yMax + 100) / 400) * 400)
                // ],
                // title: { text: 'Difficulty' }
            },
            shapes: rectSpans.map((span) => {
                return {
                    type: 'rect',
                    layer: 'below',
                    xref: 'x',
                    yref: 'y',
                    x0: span[0],
                    x1: span[1],
                    y0: 0,
                    y1: yMax,
                    line: { width: 0 },
                    fillcolor: span[2],
                };
            }),
            margin: {
                b: 60,
                t: 30,
            },
        };
        await Plotly.newPlot(plotlyLastAcceptedTimeChartId, lastAcceptedTimeChartData, layout, config);
        window.addEventListener('resize', () => {
            if (this.tabs.activeTab == 2)
                void Plotly.relayout(plotlyLastAcceptedTimeChartId, {
                    width: document.getElementById(plotlyLastAcceptedTimeChartId).clientWidth,
                });
        });
    }
    hideLoader() {
        document.getElementById(LOADER_ID).style.display = 'none';
    }
}

/** レートを表す難易度円(◒)の HTML 文字列を生成 */
const generateDifficultyCircle = (rating, isSmall = true) => {
    const size = isSmall ? 12 : 36;
    const borderWidth = isSmall ? 1 : 3;
    const style = `display:inline-block;border-radius:50%;border-style:solid;border-width:${borderWidth}px;` +
        `margin-right:5px;vertical-align:initial;height:${size}px;width:${size}px;`;
    if (rating < 3200) {
        // 色と円がどのぐらい満ちているかを計算
        const color = getColor(rating);
        const percentFull = ((rating % 400) / 400) * 100;
        // ◒を生成
        return (`
                <span style='${style}border-color:${color};background:` +
            `linear-gradient(to top, ${color} 0%, ${color} ${percentFull}%, ` +
            `rgba(0, 0, 0, 0) ${percentFull}%, rgba(0, 0, 0, 0) 100%); '>
                </span>`);
    }
    // 金銀銅は例外処理
    else if (rating < 3600) {
        return (`<span style="${style}border-color: rgb(150, 92, 44);` +
            'background: linear-gradient(to right, rgb(150, 92, 44), rgb(255, 218, 189), rgb(150, 92, 44));"></span>');
    }
    else if (rating < 4000) {
        return (`<span style="${style}border-color: rgb(128, 128, 128);` +
            'background: linear-gradient(to right, rgb(128, 128, 128), white, rgb(128, 128, 128));"></span>');
    }
    else {
        return (`<span style="${style}border-color: rgb(255, 215, 0);` +
            'background: linear-gradient(to right, rgb(255, 215, 0), white, rgb(255, 215, 0));"></span>');
    }
};

const COL_PER_ROW = 20;
class DifficyltyTable {
    constructor(parent, tasks, isEstimationEnabled, dc, taskAcceptedCounts, yourTaskAcceptedElapsedTimes, acCountPredicted) {
        // insert
        parent.insertAdjacentHTML('beforeend', `
            <p><span class="h2">Difficulty</span></p>
            <div id="acssa-table-wrapper">
                ${rangeLen(Math.ceil(tasks.length / COL_PER_ROW))
            .map((tableIdx) => `
                    <table id="acssa-table-${tableIdx}" class="table table-bordered table-hover th-center td-center td-middle acssa-table">
                        <tbody>
                        <tr id="acssa-thead-${tableIdx}" class="acssa-thead"></tr>
                        </tbody>
                        <tbody>
                        <tr id="acssa-tbody-${tableIdx}" class="acssa-tbody"></tr>
                        ${isEstimationEnabled
            ? `<tr id="acssa-tbody-predicted-${tableIdx}" class="acssa-tbody"></tr>`
            : ''}
                        </tbody>
                    </table>
                `)
            .join('')}
            </div>
        `);
        if (isEstimationEnabled) {
            for (let tableIdx = 0; tableIdx < Math.ceil(tasks.length / COL_PER_ROW); ++tableIdx) {
                document.getElementById(`acssa-thead-${tableIdx}`).insertAdjacentHTML('beforeend', `<th></th>`);
                document.getElementById(`acssa-tbody-${tableIdx}`).insertAdjacentHTML('beforeend', `<th>Current</td>`);
                document.getElementById(`acssa-tbody-predicted-${tableIdx}`).insertAdjacentHTML('beforeend', `<th>Predicted</td>`);
            }
        }
        // build
        for (let j = 0; j < tasks.length; ++j) {
            const tableIdx = Math.floor(j / COL_PER_ROW);
            const correctedDifficulty = dc.binarySearchCorrectedDifficulty(taskAcceptedCounts[j]);
            const tdClass = yourTaskAcceptedElapsedTimes[j] === -1 ? '' : 'class="success acssa-task-success"';
            document.getElementById(`acssa-thead-${tableIdx}`).insertAdjacentHTML('beforeend', `
                <td ${tdClass}>
                  ${tasks[j].Assignment}
                </td>
            `);
            const id = `td-assa-difficulty-${j}`;
            document.getElementById(`acssa-tbody-${tableIdx}`).insertAdjacentHTML('beforeend', `
                <td ${tdClass} id="${id}" style="color:${getColor(correctedDifficulty)};">
                ${correctedDifficulty === 9999 ? '-' : correctedDifficulty}</td>
            `);
            if (correctedDifficulty !== 9999) {
                document.getElementById(id).insertAdjacentHTML('afterbegin', generateDifficultyCircle(correctedDifficulty));
            }
            if (isEstimationEnabled) {
                const correctedPredictedDifficulty = dc.binarySearchCorrectedDifficulty(acCountPredicted[j]);
                const idPredicted = `td-assa-difficulty-predicted-${j}`;
                document.getElementById(`acssa-tbody-predicted-${tableIdx}`).insertAdjacentHTML('beforeend', `
                    <td ${tdClass} id="${idPredicted}" style="color:${getColor(correctedPredictedDifficulty)};">
                    ${correctedPredictedDifficulty === 9999 ? '-' : correctedPredictedDifficulty}</td>
                `);
                if (correctedPredictedDifficulty !== 9999) {
                    document.getElementById(idPredicted).insertAdjacentHTML('afterbegin', generateDifficultyCircle(correctedPredictedDifficulty));
                }
            }
        }
    }
}

var html = "<p><span class=\"h2\">Chart</span></p>\n<div id=\"acssa-tab-wrapper\">\n    <ul class=\"nav nav-pills small\" id=\"acssa-chart-tab\">\n        <li class=\"active\">\n            <a class=\"acssa-chart-tab-button\"><span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span>Difficulty</a>\n        </li>\n        <li>\n            <a class=\"acssa-chart-tab-button\"><span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span>AC\n                Count</a>\n        </li>\n        <li>\n            <a class=\"acssa-chart-tab-button\"><span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span>LastAcceptedTime</a>\n        </li>\n    </ul>\n    <ul class=\"nav nav-pills\" id=\"acssa-checkbox-tab\">\n        <li id=\"acssa-checkbox-toggle-your-result-visibility-parent\">\n            <a><label><input type=\"checkbox\" id=\"acssa-checkbox-toggle-your-result-visibility\" checked=\"checked\"> Plot your\n                    result</label></a>\n        </li>\n        <li id=\"acssa-checkbox-toggle-log-plot-parent\">\n            <a><label><input type=\"checkbox\" id=\"acssa-checkbox-toggle-log-plot\">Log plot</label></a>\n        </li>\n        <li>\n            <a><label><input type=\"checkbox\" id=\"acssa-checkbox-toggle-onload-plot\">Onload plot</label></a>\n        </li>\n    </ul>\n</div>";

const TABS_WRAPPER_ID = 'acssa-tab-wrapper';
const CHART_TAB_ID = 'acssa-chart-tab';
const CHART_TAB_BUTTON_CLASS = 'acssa-chart-tab-button';
const CHECKBOX_TOGGLE_YOUR_RESULT_VISIBILITY = 'acssa-checkbox-toggle-your-result-visibility';
const PARENT_CHECKBOX_TOGGLE_YOUR_RESULT_VISIBILITY = `${CHECKBOX_TOGGLE_YOUR_RESULT_VISIBILITY}-parent`;
const CHECKBOX_TOGGLE_LOG_PLOT = 'acssa-checkbox-toggle-log-plot';
const CHECKBOX_TOGGLE_ONLOAD_PLOT = 'acssa-checkbox-toggle-onload-plot';
const CONFIG_CNLOAD_PLOT_KEY = 'acssa-config-onload-plot';
const PARENT_CHECKBOX_TOGGLE_LOG_PLOT = `${CHECKBOX_TOGGLE_LOG_PLOT}-parent`;
class Tabs {
    constructor(parent, yourScore, participants) {
        var _a;
        this.yourScore = yourScore;
        this.participants = participants;
        // insert
        parent.insertAdjacentHTML('beforeend', html);
        this.showYourResultCheckbox = document.getElementById(CHECKBOX_TOGGLE_YOUR_RESULT_VISIBILITY);
        this.logPlotCheckbox = document.getElementById(CHECKBOX_TOGGLE_LOG_PLOT);
        this.logPlotCheckboxParent = document.getElementById(PARENT_CHECKBOX_TOGGLE_LOG_PLOT);
        this.onloadPlotCheckbox = document.getElementById(CHECKBOX_TOGGLE_ONLOAD_PLOT);
        this.onloadPlot = JSON.parse((_a = localStorage.getItem(CONFIG_CNLOAD_PLOT_KEY)) !== null && _a !== void 0 ? _a : 'true');
        this.onloadPlotCheckbox.checked = this.onloadPlot;
        // チェックボックス操作時のイベントを登録する */
        this.showYourResultCheckbox.addEventListener('change', () => {
            if (this.showYourResultCheckbox.checked) {
                document.querySelectorAll('.acssa-task-success.acssa-task-success-suppress').forEach((elm) => {
                    elm.classList.remove('acssa-task-success-suppress');
                });
            }
            else {
                document.querySelectorAll('.acssa-task-success').forEach((elm) => {
                    elm.classList.add('acssa-task-success-suppress');
                });
            }
        });
        this.showYourResultCheckbox.addEventListener('change', () => {
            void this.onShowYourResultCheckboxChangedAsync();
        });
        this.logPlotCheckbox.addEventListener('change', () => {
            void this.onLogPlotCheckboxChangedAsync();
        });
        this.onloadPlotCheckbox.addEventListener('change', () => {
            this.onloadPlot = this.onloadPlotCheckbox.checked;
            localStorage.setItem(CONFIG_CNLOAD_PLOT_KEY, JSON.stringify(this.onloadPlot));
        });
        this.activeTab = 0;
        this.showYourResult = [true, true, true];
        this.acceptedCountYMax = -1;
        this.useLogPlot = [false, false, false];
        this.yourDifficultyChartData = null;
        this.yourAcceptedCountChartData = null;
        this.yourLastAcceptedTimeChartData = null;
        this.yourLastAcceptedTimeChartDataIndex = -1;
        document
            .querySelectorAll(`.${CHART_TAB_BUTTON_CLASS}`)
            .forEach((btn, key) => {
            btn.addEventListener('click', () => void this.onTabButtonClicked(btn, key));
        });
        if (this.yourScore == -1) {
            // disable checkbox
            this.showYourResultCheckbox.checked = false;
            this.showYourResultCheckbox.disabled = true;
            const checkboxParent = this.showYourResultCheckbox.parentElement;
            checkboxParent.style.cursor = 'default';
            checkboxParent.style.textDecoration = 'line-through';
        }
    }
    async onShowYourResultCheckboxChangedAsync() {
        this.showYourResult[this.activeTab] = this.showYourResultCheckbox.checked;
        if (this.showYourResultCheckbox.checked) {
            // show
            switch (this.activeTab) {
                case 0:
                    if (this.yourScore > 0 && this.yourDifficultyChartData !== null)
                        await Plotly.addTraces(plotlyDifficultyChartId, this.yourDifficultyChartData);
                    break;
                case 1:
                    if (this.yourScore > 0 && this.yourAcceptedCountChartData !== null)
                        await Plotly.addTraces(plotlyAcceptedCountChartId, this.yourAcceptedCountChartData);
                    break;
                case 2:
                    if (this.yourLastAcceptedTimeChartData !== null && this.yourLastAcceptedTimeChartDataIndex != -1) {
                        await Plotly.addTraces(plotlyLastAcceptedTimeChartId, this.yourLastAcceptedTimeChartData, this.yourLastAcceptedTimeChartDataIndex);
                    }
                    break;
            }
        }
        else {
            // hide
            switch (this.activeTab) {
                case 0:
                    if (this.yourScore > 0)
                        await Plotly.deleteTraces(plotlyDifficultyChartId, -1);
                    break;
                case 1:
                    if (this.yourScore > 0)
                        await Plotly.deleteTraces(plotlyAcceptedCountChartId, -1);
                    break;
                case 2:
                    if (this.yourLastAcceptedTimeChartDataIndex != -1) {
                        await Plotly.deleteTraces(plotlyLastAcceptedTimeChartId, this.yourLastAcceptedTimeChartDataIndex);
                    }
                    break;
            }
        }
    } // end async onShowYourResultCheckboxChangedAsync()
    async onLogPlotCheckboxChangedAsync() {
        if (this.acceptedCountYMax == -1)
            return;
        this.useLogPlot[this.activeTab] = this.logPlotCheckbox.checked;
        if (this.activeTab == 1) {
            if (this.logPlotCheckbox.checked) {
                // log plot
                const layout = {
                    yaxis: {
                        type: 'log',
                        range: [Math.log10(0.5), Math.log10(this.acceptedCountYMax)],
                    },
                };
                await Plotly.relayout(plotlyAcceptedCountChartId, layout);
            }
            else {
                // linear plot
                const layout = {
                    yaxis: {
                        type: 'linear',
                        range: [0, this.acceptedCountYMax],
                    },
                };
                await Plotly.relayout(plotlyAcceptedCountChartId, layout);
            }
        }
        else if (this.activeTab == 2) {
            if (this.logPlotCheckbox.checked) {
                // log plot
                const layout = {
                    xaxis: {
                        type: 'log',
                        range: [Math.log10(0.5), Math.log10(this.participants)],
                    },
                };
                await Plotly.relayout(plotlyLastAcceptedTimeChartId, layout);
            }
            else {
                // linear plot
                const layout = {
                    xaxis: {
                        type: 'linear',
                        range: [0, this.participants],
                    },
                };
                await Plotly.relayout(plotlyLastAcceptedTimeChartId, layout);
            }
        }
    } // end async onLogPlotCheckboxChangedAsync
    async onTabButtonClicked(btn, key) {
        // check whether active or not
        const buttonParent = btn.parentElement;
        if (buttonParent.className == 'active')
            return;
        // modify visibility
        this.activeTab = key;
        document.querySelector(`#${CHART_TAB_ID} li.active`).classList.remove('active');
        document.querySelector(`#${CHART_TAB_ID} li:nth-child(${key + 1})`).classList.add('active');
        document.querySelector('#acssa-chart-block div.acssa-chart-wrapper-active').classList.remove('acssa-chart-wrapper-active');
        document.querySelector(`#acssa-chart-block div.acssa-chart-wrapper:nth-child(${key + 1})`).classList.add('acssa-chart-wrapper-active');
        // resize charts
        switch (key) {
            case 0:
                await Plotly.relayout(plotlyDifficultyChartId, {
                    width: document.getElementById(plotlyDifficultyChartId).clientWidth,
                });
                this.logPlotCheckboxParent.style.display = 'none';
                break;
            case 1:
                await Plotly.relayout(plotlyAcceptedCountChartId, {
                    width: document.getElementById(plotlyAcceptedCountChartId).clientWidth,
                });
                this.logPlotCheckboxParent.style.display = 'block';
                break;
            case 2:
                await Plotly.relayout(plotlyLastAcceptedTimeChartId, {
                    width: document.getElementById(plotlyLastAcceptedTimeChartId).clientWidth,
                });
                this.logPlotCheckboxParent.style.display = 'block';
                break;
        }
        if (this.showYourResult[this.activeTab] !== this.showYourResultCheckbox.checked) {
            await this.onShowYourResultCheckboxChangedAsync();
        }
        if (this.activeTab !== 0 && this.useLogPlot[this.activeTab] !== this.logPlotCheckbox.checked) {
            await this.onLogPlotCheckboxChangedAsync();
        }
    }
    showTabsControl() {
        document.getElementById(TABS_WRAPPER_ID).style.display = 'block';
        if (!this.onloadPlot) {
            document.getElementById(CHART_TAB_ID).style.display = 'none';
            document.getElementById(PARENT_CHECKBOX_TOGGLE_YOUR_RESULT_VISIBILITY).style.display =
                'none';
        }
    }
}

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
    const numerator = weight * Math.pow(2, last / 800.0) + Math.pow(2, perf / 800.0);
    const denominator = 1 + weight;
    return Math.log2(numerator / denominator) * 800.0 - f(ratedMatches + 1);
}
// class Random {
//     x: number
//     y: number
//     z: number
//     w: number
//     constructor(seed = 88675123) {
//         this.x = 123456789;
//         this.y = 362436069;
//         this.z = 521288629;
//         this.w = seed;
//     }
//     // XorShift
//     next(): number {
//         let t;
//         t = this.x ^ (this.x << 11);
//         this.x = this.y; this.y = this.z; this.z = this.w;
//         return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
//     }
//     // min以上max以下の乱数を生成する
//     nextInt(min: number, max: number): number {
//         const r = Math.abs(this.next());
//         return min + (r % (max + 1 - min));
//     }
// };
class PerformanceTable {
    constructor(parent, tasks, isEstimationEnabled, yourStandingsEntry, taskAcceptedCounts, acCountPredicted, standingsData, innerRatingsFromPredictor, dcForPerformance, centerOfInnerRating, useRating) {
        this.centerOfInnerRating = centerOfInnerRating;
        if (yourStandingsEntry === undefined)
            return;
        // コンテスト終了時点での順位表を予測する
        const len = acCountPredicted.length;
        const rems = [];
        for (let i = 0; i < len; ++i) {
            rems.push(Math.ceil(acCountPredicted[i] - taskAcceptedCounts[i])); //
        }
        const scores = []; // (現レート，スコア合計，時間，問題ごとのスコア，rated)
        const highestScores = tasks.map(() => 0);
        let rowPtr = undefined;
        // const ratedInnerRatings: Rating[] = [];
        const ratedUserRanks = [];
        // console.log(standingsData);
        const threthold = moment('2021-12-03T21:00:00+09:00');
        const isAfterABC230 = startTime >= threthold;
        // OldRating が全員 0 なら，強制的に Rating を使用する（コンテスト終了後，レート更新前）
        standingsData.forEach((standingsEntry) => {
            const userScores = [];
            let penalty = 0;
            for (let j = 0; j < tasks.length; ++j) {
                const taskResultEntry = standingsEntry.TaskResults[tasks[j].TaskScreenName];
                if (!taskResultEntry) {
                    // 未提出
                    userScores.push(0);
                }
                else {
                    userScores.push(taskResultEntry.Score / 100);
                    highestScores[j] = Math.max(highestScores[j], taskResultEntry.Score / 100);
                    penalty += taskResultEntry.Score === 0 ? taskResultEntry.Failure : taskResultEntry.Penalty;
                }
            }
            // const isRated = standingsEntry.IsRated && standingsEntry.TotalResult.Count > 0;
            const isRated = standingsEntry.IsRated && (isAfterABC230 || standingsEntry.TotalResult.Count > 0);
            if (!isRated) {
                if (standingsEntry.TotalResult.Score === 0 && penalty === 0 && standingsEntry.TotalResult.Count == 0) {
                    return; // NoSub を飛ばす
                }
            }
            standingsEntry.Rating;
            // const innerRating: Rating = isTeamOrBeginner
            //     ? correctedRating
            //     : standingsEntry.UserScreenName in innerRatingsFromPredictor
            //         ? innerRatingsFromPredictor[standingsEntry.UserScreenName]
            //         : RatingConverter.toInnerRating(
            //             Math.max(RatingConverter.toRealRating(correctedRating), 1),
            //             standingsEntry.Competitions
            //         );
            const innerRating = standingsEntry.UserScreenName in innerRatingsFromPredictor
                ? innerRatingsFromPredictor[standingsEntry.UserScreenName]
                : this.centerOfInnerRating;
            if (isRated) {
                // ratedInnerRatings.push(innerRating);
                ratedUserRanks.push(standingsEntry.EntireRank);
                // if (innerRating || true) {
                const row = [
                    innerRating,
                    standingsEntry.TotalResult.Score / 100,
                    standingsEntry.TotalResult.Elapsed + 300 * standingsEntry.TotalResult.Penalty,
                    userScores,
                    isRated,
                ];
                scores.push(row);
                if ((standingsEntry.UserScreenName == userScreenName)) {
                    rowPtr = row;
                }
                // }
            }
        });
        const sameRatedRankCount = ratedUserRanks.reduce((prev, cur) => {
            if (cur == yourStandingsEntry.EntireRank)
                prev++;
            return prev;
        }, 0);
        const ratedRank = ratedUserRanks.reduce((prev, cur) => {
            if (cur < yourStandingsEntry.EntireRank)
                prev += 1;
            return prev;
        }, (1 + sameRatedRankCount) / 2);
        // レート順でソート
        scores.sort((a, b) => {
            const [innerRatingA, scoreA, timeElapsedA] = a;
            const [innerRatingB, scoreB, timeElapsedB] = b;
            if (innerRatingA != innerRatingB) {
                return innerRatingB - innerRatingA; // 降順（レートが高い順）
            }
            if (scoreA != scoreB) {
                return scoreB - scoreA; // 降順（順位が高い順）
            }
            return timeElapsedA - timeElapsedB; // 昇順（順位が高い順）
        });
        // const random = new Random(0);
        // スコア変化をシミュレート
        // (現レート，スコア合計，時間，問題ごとのスコア，rated)
        scores.forEach((score) => {
            const [, , , scoresA] = score;
            // 自分は飛ばす
            if (score == rowPtr)
                return;
            for (let j = 0; j < tasks.length; ++j) {
                // if (random.nextInt(0, 9) <= 2) continue;
                // まだ満点ではなく，かつ正解者を増やせるなら
                if (scoresA[j] < highestScores[j] && rems[j] > 0) {
                    const dif = highestScores[j] - scoresA[j];
                    score[1] += dif;
                    score[2] += 1000000000 * 60 * 30; // とりあえず30分で解くと仮定する
                    scoresA[j] = highestScores[j];
                    rems[j]--;
                }
                if (rems[j] == 0)
                    break;
            }
        });
        // 順位でソート
        scores.sort((a, b) => {
            const [innerRatingA, scoreA, timeElapsedA, ,] = a;
            const [innerRatingB, scoreB, timeElapsedB, ,] = b;
            if (scoreA != scoreB) {
                return scoreB - scoreA; // 降順（順位が高い順）
            }
            if (timeElapsedA != timeElapsedB) {
                return timeElapsedA - timeElapsedB; // 昇順（順位が高い順）
            }
            return innerRatingB - innerRatingA; // 降順（レートが高い順）
        });
        // 順位を求める
        let estimatedRank = -1;
        let rank = 0;
        let sameCnt = 0;
        for (let i = 0; i < scores.length; ++i) {
            if (estimatedRank == -1) {
                if (scores[i][4] === true) {
                    rank++;
                }
                if (scores[i] === rowPtr) {
                    if (rank === 0)
                        rank = 1;
                    estimatedRank = rank;
                    // break;
                }
            }
            else {
                if (rowPtr === undefined)
                    break;
                if (scores[i][1] === rowPtr[1] && scores[i][2] === rowPtr[2]) {
                    sameCnt++;
                }
                else {
                    break;
                }
            }
        } //1246
        estimatedRank += sameCnt / 2;
        // const dc = new DifficultyCalculator(ratedInnerRatings);
        // insert
        parent.insertAdjacentHTML('beforeend', `
            <p><span class="h2">Performance</span></p>
            <div id="acssa-perf-table-wrapper">
                <table id="acssa-perf-table" class="table table-bordered table-hover th-center td-center td-middle acssa-table">
                <tbody>
                    <tr class="acssa-thead">
                        ${isEstimationEnabled ? '<td></td>' : ''}
                        <td id="acssa-thead-perf" class="acssa-thead">perf</td>
                        <td id="acssa-thead-perf" class="acssa-thead">レート変化</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr id="acssa-perf-tbody" class="acssa-tbody"></tr>
                    ${isEstimationEnabled
            ? `
                        <tr id="acssa-perf-tbody-predicted" class="acssa-tbody"></tr>
                    `
            : ''}
                    </tbody>
                </table>
            </div>
        `);
        if (isEstimationEnabled) {
            document.getElementById(`acssa-perf-tbody`).insertAdjacentHTML('beforeend', `<th>Current</td>`);
            document.getElementById(`acssa-perf-tbody-predicted`).insertAdjacentHTML('beforeend', `<th>Predicted</td>`);
        }
        // build
        const id = `td-assa-perf-current`;
        // TODO: ちゃんと判定する
        // const perf = Math.min(2400, dc.rank2InnerPerf(ratedRank));
        const perf = RatingConverter.toCorrectedRating(dcForPerformance.rank2InnerPerf(ratedRank));
        //
        document.getElementById(`acssa-perf-tbody`).insertAdjacentHTML('beforeend', `
            <td id="${id}" style="color:${getColor(perf)};">
            ${perf === 9999 ? '-' : perf}</td>
        `);
        if (perf !== 9999) {
            document.getElementById(id).insertAdjacentHTML('afterbegin', generateDifficultyCircle(perf));
            const oldRating = useRating ? yourStandingsEntry.Rating : yourStandingsEntry.OldRating;
            // const oldRating = yourStandingsEntry.Rating;
            const nextRating = Math.round(RatingConverter.toCorrectedRating(calcRatingFromLast(RatingConverter.toRealRating(oldRating), perf, yourStandingsEntry.Competitions)));
            const sign = nextRating > oldRating ? '+' : nextRating < oldRating ? '-' : '±';
            document.getElementById(`acssa-perf-tbody`).insertAdjacentHTML('beforeend', `
                <td>
                <span style="font-weight:bold;color:${getColor(oldRating)}">${oldRating}</span> → 
                <span style="font-weight:bold;color:${getColor(nextRating)}">${nextRating}</span>
                <span style="color:gray">(${sign}${Math.abs(nextRating - oldRating)})</span>
                </td>
            `);
        }
        if (isEstimationEnabled) {
            if (estimatedRank != -1) {
                const perfEstimated = RatingConverter.toCorrectedRating(dcForPerformance.rank2InnerPerf(estimatedRank));
                const id2 = `td-assa-perf-predicted`;
                document.getElementById(`acssa-perf-tbody-predicted`).insertAdjacentHTML('beforeend', `
                <td id="${id2}" style="color:${getColor(perfEstimated)};">
                ${perfEstimated === 9999 ? '-' : perfEstimated}</td>
            `);
                if (perfEstimated !== 9999) {
                    document.getElementById(id2).insertAdjacentHTML('afterbegin', generateDifficultyCircle(perfEstimated));
                    const oldRating = useRating ? yourStandingsEntry.Rating : yourStandingsEntry.OldRating;
                    // const oldRating = yourStandingsEntry.Rating;
                    const nextRating = Math.round(RatingConverter.toCorrectedRating(calcRatingFromLast(RatingConverter.toRealRating(oldRating), perfEstimated, yourStandingsEntry.Competitions)));
                    const sign = nextRating > oldRating ? '+' : nextRating < oldRating ? '-' : '±';
                    document.getElementById(`acssa-perf-tbody-predicted`).insertAdjacentHTML('beforeend', `
                        <td>
                        <span style="font-weight:bold;color:${getColor(oldRating)}">${oldRating}</span> → 
                        <span style="font-weight:bold;color:${getColor(nextRating)}">${nextRating}</span>
                        <span style="color:gray">(${sign}${Math.abs(nextRating - oldRating)})</span>
                        </td>
                    `);
                }
            }
            else {
                document.getElementById(`acssa-perf-tbody-predicted`).insertAdjacentHTML('beforeend', '<td>?</td>');
            }
        }
    }
}

const NS2SEC = 1000000000;
const CONTENT_DIV_ID = 'acssa-contents';
class Parent {
    constructor(acRatioModel, centerOfInnerRating) {
        const loaderStyles = GM_getResourceText('loaders.min.css');
        GM_addStyle(loaderStyles + '\n' + css);
        // this.centerOfInnerRating = getCenterOfInnerRating(contestScreenName);
        this.centerOfInnerRating = centerOfInnerRating;
        this.acRatioModel = acRatioModel;
        this.working = false;
        this.oldStandingsData = null;
        this.hasTeamStandings = this.searchTeamStandingsPage();
        this.yourStandingsEntry = undefined;
    }
    searchTeamStandingsPage() {
        const teamStandingsLink = document.querySelector(`a[href*="/contests/${contestScreenName}/standings/team"]`);
        return teamStandingsLink !== null;
    }
    async onStandingsChanged(standings) {
        if (!standings)
            return;
        if (this.working)
            return;
        this.tasks = standings.TaskInfo;
        const standingsData = standings.StandingsData; // vueStandings.filteredStandings;
        if (this.oldStandingsData === standingsData)
            return;
        if (this.tasks.length === 0)
            return;
        this.oldStandingsData = standingsData;
        this.working = true;
        this.removeOldContents();
        const currentTime = moment();
        this.elapsedMinutes = Math.floor(currentTime.diff(startTime) / 60 / 1000);
        this.isDuringContest = startTime <= currentTime && currentTime < endTime;
        this.isEstimationEnabled = this.isDuringContest && this.elapsedMinutes >= 1 && this.tasks.length < 10;
        const useRating = this.isDuringContest || this.areOldRatingsAllZero(standingsData);
        this.innerRatingsFromPredictor = await fetchInnerRatingsFromPredictor(contestScreenName);
        this.scanStandingsData(standingsData);
        this.predictAcCountSeries();
        const standingsElement = document.getElementById('vue-standings');
        const acssaContentDiv = document.createElement('div');
        acssaContentDiv.id = CONTENT_DIV_ID;
        standingsElement.insertAdjacentElement('afterbegin', acssaContentDiv);
        if (this.hasTeamStandings) {
            if (!location.href.includes('/standings/team')) {
                // チーム戦順位表へ誘導
                acssaContentDiv.insertAdjacentHTML('afterbegin', teamalert);
            }
        }
        // difficulty
        new DifficyltyTable(acssaContentDiv, this.tasks, this.isEstimationEnabled, this.dcForDifficulty, this.taskAcceptedCounts, this.yourTaskAcceptedElapsedTimes, this.acCountPredicted);
        new PerformanceTable(acssaContentDiv, this.tasks, this.isEstimationEnabled, this.yourStandingsEntry, this.taskAcceptedCounts, this.acCountPredicted, standingsData, this.innerRatingsFromPredictor, this.dcForPerformance, this.centerOfInnerRating, useRating);
        // console.log(this.yourStandingsEntry);
        // console.log(this.yourStandingsEntry?.EntireRank);
        // console.log(this.dc.rank2InnerPerf((this.yourStandingsEntry?.EntireRank ?? 10000) - 0));
        // tabs
        const tabs = new Tabs(acssaContentDiv, this.yourScore, this.participants);
        const charts = new Charts(acssaContentDiv, this.tasks, this.scoreLastAcceptedTimeMap, this.taskAcceptedCounts, this.taskAcceptedElapsedTimes, this.yourTaskAcceptedElapsedTimes, this.yourScore, this.yourLastAcceptedTime, this.participants, this.dcForDifficulty, this.dcForPerformance, this.ratedRank2EntireRank, tabs);
        if (tabs.onloadPlot) {
            // 順位表のその他の描画を優先するために，プロットは後回しにする
            void charts.plotAsync().then(() => {
                charts.hideLoader();
                tabs.showTabsControl();
                this.working = false;
            });
        }
        else {
            charts.hideLoader();
            tabs.showTabsControl();
        }
    }
    removeOldContents() {
        const oldContents = document.getElementById(CONTENT_DIV_ID);
        if (oldContents) {
            // oldContents.parentNode.removeChild(oldContents);
            oldContents.remove();
        }
    }
    scanStandingsData(standingsData) {
        // init
        this.scoreLastAcceptedTimeMap = new Map();
        this.taskAcceptedCounts = rangeLen(this.tasks.length).fill(0);
        this.taskAcceptedElapsedTimes = rangeLen(this.tasks.length).map(() => []);
        this.innerRatings = [];
        this.ratedInnerRatings = [];
        this.ratedRank2EntireRank = [];
        this.yourTaskAcceptedElapsedTimes = rangeLen(this.tasks.length).fill(-1);
        this.yourScore = -1;
        this.yourLastAcceptedTime = -1;
        this.participants = 0;
        this.yourStandingsEntry = undefined;
        // scan
        const threthold = moment('2021-12-03T21:00:00+09:00');
        const isAfterABC230 = startTime >= threthold;
        for (let i = 0; i < standingsData.length; ++i) {
            const standingsEntry = standingsData[i];
            const isRated = standingsEntry.IsRated && (isAfterABC230 || standingsEntry.TotalResult.Count > 0);
            if (isRated) {
                const ratedInnerRating = standingsEntry.UserScreenName in this.innerRatingsFromPredictor
                    ? this.innerRatingsFromPredictor[standingsEntry.UserScreenName]
                    : this.centerOfInnerRating;
                this.ratedInnerRatings.push(ratedInnerRating);
                this.ratedRank2EntireRank.push(standingsEntry.EntireRank);
            }
            if (!standingsEntry.TaskResults)
                continue; // 参加登録していない
            if (standingsEntry.UserIsDeleted)
                continue; // アカウント削除
            // let correctedRating = this.isDuringContest ? standingsEntry.Rating : standingsEntry.OldRating;
            let correctedRating = standingsEntry.Rating;
            const isTeamOrBeginner = correctedRating === 0;
            if (isTeamOrBeginner) {
                // continue; // 初参加 or チーム
                correctedRating = this.centerOfInnerRating;
            }
            const innerRating = isTeamOrBeginner
                ? correctedRating
                : standingsEntry.UserScreenName in this.innerRatingsFromPredictor
                    ? this.innerRatingsFromPredictor[standingsEntry.UserScreenName]
                    : RatingConverter.toInnerRating(Math.max(RatingConverter.toRealRating(correctedRating), 1), standingsEntry.Competitions);
            // これは飛ばしちゃダメ（提出しても 0 AC だと Penalty == 0 なので）
            // if (standingsEntry.TotalResult.Score == 0 && standingsEntry.TotalResult.Penalty == 0) continue;
            let score = 0;
            let penalty = 0;
            for (let j = 0; j < this.tasks.length; ++j) {
                const taskResultEntry = standingsEntry.TaskResults[this.tasks[j].TaskScreenName];
                if (!taskResultEntry)
                    continue; // 未提出
                score += taskResultEntry.Score;
                penalty += taskResultEntry.Score === 0 ? taskResultEntry.Failure : taskResultEntry.Penalty;
            }
            if (score === 0 && penalty === 0 && standingsEntry.TotalResult.Count == 0)
                continue; // NoSub を飛ばす
            this.participants++;
            // console.log(i + 1, score, penalty);
            score /= 100;
            if (this.scoreLastAcceptedTimeMap.has(score)) {
                this.scoreLastAcceptedTimeMap.get(score).push(standingsEntry.TotalResult.Elapsed / NS2SEC);
            }
            else {
                this.scoreLastAcceptedTimeMap.set(score, [standingsEntry.TotalResult.Elapsed / NS2SEC]);
            }
            // console.log(this.isDuringContest, standingsEntry.Rating, standingsEntry.OldRating, innerRating);
            // if (standingsEntry.IsRated && innerRating) {
            // if (innerRating) {
            //     this.innerRatings.push(innerRating);
            // } else {
            //     console.log(i, innerRating, correctedRating, standingsEntry.Competitions, standingsEntry, this.innerRatingsFromPredictor[standingsEntry.UserScreenName]);
            //     continue;
            // }
            this.innerRatings.push(innerRating);
            for (let j = 0; j < this.tasks.length; ++j) {
                const taskResultEntry = standingsEntry.TaskResults[this.tasks[j].TaskScreenName];
                const isAccepted = (taskResultEntry === null || taskResultEntry === void 0 ? void 0 : taskResultEntry.Score) > 0 && (taskResultEntry === null || taskResultEntry === void 0 ? void 0 : taskResultEntry.Status) == 1;
                if (isAccepted) {
                    ++this.taskAcceptedCounts[j];
                    this.taskAcceptedElapsedTimes[j].push(taskResultEntry.Elapsed / NS2SEC);
                }
            }
            if ((standingsEntry.UserScreenName == userScreenName)) {
                this.yourScore = score;
                this.yourLastAcceptedTime = standingsEntry.TotalResult.Elapsed / NS2SEC;
                this.yourStandingsEntry = standingsEntry;
                for (let j = 0; j < this.tasks.length; ++j) {
                    const taskResultEntry = standingsEntry.TaskResults[this.tasks[j].TaskScreenName];
                    const isAccepted = (taskResultEntry === null || taskResultEntry === void 0 ? void 0 : taskResultEntry.Score) > 0 && (taskResultEntry === null || taskResultEntry === void 0 ? void 0 : taskResultEntry.Status) == 1;
                    if (isAccepted) {
                        this.yourTaskAcceptedElapsedTimes[j] = taskResultEntry.Elapsed / NS2SEC;
                    }
                }
            }
        } // end for
        this.innerRatings.sort((a, b) => a - b);
        this.ratedInnerRatings.sort((a, b) => a - b);
        this.ratedRank2EntireRank.sort((a, b) => a - b);
        this.dcForDifficulty = new DifficultyCalculator(this.innerRatings);
        this.dcForPerformance = new DifficultyCalculator(this.ratedInnerRatings);
    } // end async scanStandingsData
    predictAcCountSeries() {
        if (!this.isEstimationEnabled) {
            this.acCountPredicted = [];
            return;
        }
        // 時間ごとの AC 数推移を計算する
        const taskAcceptedCountImos = rangeLen(this.tasks.length).map(() => rangeLen(this.elapsedMinutes).map(() => 0));
        this.taskAcceptedElapsedTimes.forEach((ar, index) => {
            ar.forEach((seconds) => {
                const minutes = Math.floor(seconds / 60);
                if (minutes >= this.elapsedMinutes)
                    return;
                taskAcceptedCountImos[index][minutes] += 1;
            });
        });
        const taskAcceptedRatio = rangeLen(this.tasks.length).map(() => []);
        taskAcceptedCountImos.forEach((ar, index) => {
            let cum = 0;
            ar.forEach((imos) => {
                cum += imos;
                taskAcceptedRatio[index].push(cum / this.participants);
            });
        });
        // 差の自乗和が最小になるシーケンスを探す
        this.acCountPredicted = taskAcceptedRatio.map((ar) => {
            if (this.acRatioModel === undefined)
                return 0;
            if (ar[this.elapsedMinutes - 1] === 0)
                return 0;
            let minerror = 1.0 * this.elapsedMinutes;
            // let argmin = '';
            let last_ratio = 0;
            Object.keys(this.acRatioModel).forEach((key) => {
                if (this.acRatioModel === undefined)
                    return;
                const ar2 = this.acRatioModel[key];
                let error = 0;
                for (let i = 0; i < this.elapsedMinutes; ++i) {
                    error += Math.pow(ar[i] - ar2[i], 2);
                }
                if (error < minerror) {
                    minerror = error;
                    // argmin = key;
                    if (ar2[this.elapsedMinutes - 1] > 0) {
                        last_ratio = ar2[ar2.length - 1] * (ar[this.elapsedMinutes - 1] / ar2[this.elapsedMinutes - 1]);
                    }
                    else {
                        last_ratio = ar2[ar2.length - 1];
                    }
                }
            });
            // console.log(argmin, minerror, last_ratio);
            if (last_ratio > 1)
                last_ratio = 1;
            return this.participants * last_ratio;
        });
    } // end predictAcCountSeries();
    areOldRatingsAllZero(standingsData) {
        return standingsData.every((standingsEntry) => standingsEntry.OldRating == 0);
    }
}
Parent.init = async () => {
    const contestRatedRange = await getContestRatedRangeAsync(contestScreenName);
    const centerOfInnerRating = getCenterOfInnerRatingFromRange(contestRatedRange);
    const curr = moment();
    if (startTime <= curr && curr < endTime) {
        const contestDurationMinutes = endTime.diff(startTime) / 1000 / 60;
        return new Parent(await fetchContestAcRatioModel(contestScreenName, contestDurationMinutes), centerOfInnerRating);
    }
    else {
        return new Parent(undefined, centerOfInnerRating);
    }
};

{
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.33.1/plotly.min.js';
    script.async = true;
    script.onload = async () => {
        const parent = await Parent.init();
        vueStandings.$watch('standings', (standings) => {
            void parent.onStandingsChanged(standings);
        }, { deep: true, immediate: true });
    };
    script.onerror = () => {
        console.error('plotly load failed');
    };
    document.head.appendChild(script);
}
