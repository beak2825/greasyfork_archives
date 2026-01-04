// ==UserScript==
// @name         CircleScript
// @namespace    https://github.com/Magnus-Cosmos
// @version      1.0.15
// @description  Adds replay analysis to osu pages
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @match        https://lazer.ppy.sh/*
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://greasyfork.org/scripts/441005-osuwebrequests/code/OsuWebRequests.js
// @require      https://greasyfork.org/scripts/441010-osupageobserver/code/OsuPageObserver.js
// @require      https://greasyfork.org/scripts/441171-beatmapparser/code/BeatmapParser.js
// @require      https://unpkg.com/lzma@2.3.2/src/lzma_worker-min.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/441022/CircleScript.user.js
// @updateURL https://update.greasyfork.org/scripts/441022/CircleScript.meta.js
// ==/UserScript==

const web = new Web();

const defaultNumberFormatter = new Intl.NumberFormat(window.currentLocale);

function formatNumber(num, precision = null, options = null, locale = null) {
  if (precision == null && options == null && locale == null) {
    return defaultNumberFormatter.format(num);
  }

  options = options ?? {};

  if (precision != null) {
    options.minimumFractionDigits = precision;
    options.maximumFractionDigits = precision;
  }

  return num.toLocaleString(locale ?? window.currentLocale, options);
}

//#region Styles
$(document.head).append($("<style class='circlescript-style'></style>").html(
`
.fa-gear::before {
    content: "\\f013";
}

.circlescript-div {
    padding: 10px;
}

.circlescript-menu {
    display: flex;
}

.circlescript-label {
    width: 100%;
    flex: auto;
}

.circlescript-button--user {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
}

.circlescript-button--score {
    display: block;
    margin: auto;
    // grid-column: 1/span 2;
}

.circlescript-page-content {
    padding: 20px;
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    // grid-gap: 7px;
}

.circlescript-loading-btn {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    display: none;
}

.graph-container {
    padding: 10px;
}
`
));
//#endregion

//#region Elements
async function insertSettings() {
    const apiKey = await GM.getValue("apiKey");
    web.key = apiKey;

    if ($(".circlescript-gear").length > 0) {
        return;
    }

    $(`<div class="nav2__col circlescript-gear">
        <button class="nav-button nav-button--stadium js-click-menu" data-click-menu-target="circlescript-locale-popup">
            <span class="fas fa-gear"></span>
        </button>
        <div class="nav-click-popup">
            <div class="circlescript-div simple-menu simple-menu--nav2 js-click-menu js-nav2--centered-popup hidden" data-click-menu-id="circlescript-locale-popup" data-visibility="hidden">
                <div class="circlescript-menu">
                    <input class="account-edit-entry__input circlescript-input" maxlength="40" value=${apiKey ? apiKey : ""}>
                    <div class="account-edit-entry__label circlescript-label">
                        API key
                    </div>
                </div>
            </div>
        </div>
    </div>`).insertBefore(".nav2__col--avatar");

    $(".circlescript-input").on("input", async function() {
        const k = $(this).val();
        web.key = k;
        await GM.setValue("apiKey", k);
    });
};

function createAnalyzeButton(type, text) {
    return $(`<button class="btn-osu-big btn-osu-big--rounded-thin circlescript-button--${type}">
        <span class="btn-osu-big__content"><span class="btn-osu--text">${text}</span><div class="la-ball-clip-rotate circlescript-loading-btn"></div></span></span>
    </button>`);
}

function insertCompactOsuPage() {
    $(`<div class="osu-page osu-page--generic-compact circlescript-page"><div class="circlescript-page-content"></div></div>`).insertAfter(".osu-page--generic-compact");
    $(".circlescript-page-content").append(createAnalyzeButton("score", "Replay Analysis"));
}
//#endregion

//#region Functions
function getScoreJson() {
    const jsonShow = document.querySelector("#json-show");
    if (jsonShow?.textContent != null) {
        return JSON.parse(jsonShow.textContent);
    }
}

function base64ToArray(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

async function staticPage() {
    [this.type, this.id] = location.pathname.split("/").slice(1).map(val => {
        const int = parseInt(val);
        return val == int ? int : val;
    });
    await insertSettings();
}
//#endregion

const osuWebObserver = new OsuWebObserver(staticPage, function() {
    switch(this.type) {
        case "users":
            // createAnalyzeButton("user", "Analyze").insertAfter(`.js-sortable--page[data-page-id="recent_activity"] h2`);
            break;
        case "scores": {
            const score = getScoreJson();
            score.mods_old = score.mods.map(mod => mod.acronym);
            if (score?.replay) {
                insertCompactOsuPage();
                // TODO: make button class
                $(".circlescript-button--score").on("click", () => {
                    $(".btn-osu--text").css("visibility", "hidden");
                    $(".circlescript-loading-btn").show();
                    $(".circlescript-button--score").prop("disabled", true);
                    web.api(`/get_replay`, {s: score.legacy_score_id ? score.legacy_score_id : score.id, m: score.beatmap.mode_int}, res => {
                        replayHandler(score, res, () => {
                            $(".circlescript-button--score").remove();
                            $(".circlescript-page").prepend(
                                `<div class="beatmapsets__toolbar">
                                    <div class="beatmapsets__toolbar-item">
                                        <div class="sort sort--beatmapsets">
                                            <div class="sort__items">
                                                <button class="sort__item sort__item--button sort__item--active" data-field="statistics" disabled>Statistics</button>
                                                <button class="sort__item sort__item--button" data-field="hittimes">Hit Times</button>
                                                <button class="sort__item sort__item--button" data-field="frametimes">Frametimes</button>
                                                <button class="sort__item sort__item--button" data-field="keypress">Keypress Times</button>
                                                <button class="sort__item sort__item--button" data-field="sliderend">Sliderend Release Times</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="beatmapsets__toolbar-item">
                                        <div class="sort hidden-xs">
                                            <div class="sort__items">
                                                <button class="sort__item sort__item--button" data-field="settings">
                                                    <span class="fas fa-gear"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`);
                            $(".circlescript-page-content").append(`<div class="wiki-main-page-panel graph-container"></div>`);
                            const maxScore = formatNumber ? formatNumber(score.parsedBeatmap.maxScore) : score.parsedBeatmap.maxScore;
                            $(".graph-container").append(`<div class="circlescript-stats">Max Score (${score.mods_old.join("")}): ${maxScore}</div>`);
                            $(".graph-container").append(`<div class="circlescript-settings">TBA</div>`);
                            $(".graph-container").append(`<canvas id="circlescript-graph"></canvas>`);
                            $(".circlescript-settings").hide();
                            $("#circlescript-graph").hide();
                            $(".sort__item").on("click", function() {
                                $(".sort__item").prop("disabled", false);
                                $(".sort__item").removeClass("sort__item--active");
                                $(this).prop("disabled", true);
                                $(this).addClass("sort__item--active");
                                const chart = Chart.getChart("circlescript-graph");
                                if (chart) {
                                    chart.destroy();
                                }
                                if ($(this).attr("data-field") === "statistics") {
                                    $("#circlescript-graph").hide();
                                    $(".circlescript-settings").hide();
                                    $(".circlescript-stats").show();
                                } else if ($(this).attr("data-field") === "settings") {
                                    $("#circlescript-graph").hide();
                                    $(".circlescript-stats").hide();
                                    $(".circlescript-settings").show();
                                } else {
                                    switch($(this).attr("data-field")) {
                                        case "frametimes": {
                                            frametimeGraph("circlescript-graph", score.ftBins, score.rate, score.ftMax);
                                            break;
                                        }
                                        case "keypress": {
                                            keypressGraph("circlescript-graph", score.ktBins, score.rate);
                                            break;
                                        }
                                        case "sliderend": {
                                            sliderendGraph("circlescript-graph", score.stBins, score.rate);
                                            break;
                                        }
                                    }
                                    $(".circlescript-stats").hide();
                                    $(".circlescript-settings").hide();
                                    $("#circlescript-graph").show();
                                }
                            });
                        }, err => {
                            $(".btn-osu--text").css("visibility", "visible");
                            $(".circlescript-loading-btn").hide();
                            $(".circlescript-button--score").prop("disabled", false);
                        });
                    });
                });
            }
            break;
        }
    }
});

//#region Replay
function replayHandler(score, res, successFn, errorFn, graphFn) {
    res.json().then(data => {
        const lzmaString = data.content;
        const arr = base64ToArray(lzmaString);
        LZMA.decompress(arr, (data, err) => {
            if (err) {
                throw new Error(err);
            }
            const events = parseReplayData(data);
            score.rate = 1.0;
            if (score.mods_old.includes("DT") || score.mods_old.includes("NC")) {
                score.rate *= 1.5;
            }
            if (score.mods_old.includes("HT")) {
                score.rate *= 0.75;
            }
            score.kt = keypressTimes(events);
            score.ft = events.map(e => e.dt);
            score.ktBins = bins(score.kt.map(k => (k.hold + 0.5) / score.rate));
            score.ftBins = bins(score.ft.map(t => (t + 0.5) / score.rate));
            const mode = score.ftBins.reduce((mode, val) => {
                if (parseFloat(val.y) > parseFloat(mode.y)) {
                    return val;
                }
                return mode;
            });
            const high = score.ftBins.filter(val => {
                return Math.abs(parseFloat(val.x) - parseFloat(mode.x)) < parseFloat(mode.x) / 1.5 || parseFloat(val.y) > parseFloat(mode.y) / 20;
            }).sort((prev, curr) => {
                if (parseFloat(prev.x) > parseFloat(curr.x)) {
                    return 1;
                }
                return -1;
            });
            score.ftMax = Math.max(20, Math.min(50, Math.ceil(Math.ceil(parseFloat(high[high.length - 1].x)) / 5) * 5));
            parseBeatmap(score, () => {
                score.st = sliderendTimes(score);
                score.stBins = bins(score.st.map(t => (t + 0.5) / score.rate));
                successFn();
            });
        });
    }).catch(err => {
        errorFn(err);
        console.log(err);
    });
    
}

function parseReplayData(replayStr) {
    let time = 0;
    return replayStr.slice(0, -1).split(",").map((e, i, arr) => {
        const event = e.split("|");
        const dt = parseInt(event[0]);
        const x = parseFloat(event[1]);
        const y = parseFloat(event[2]);
        const keys = parseInt(event[3]);
        time += dt;
        if (dt === -12345 && i === arr.length - 1) {
            return;
        }
        const replayEvent = {
            t: time,
            dt: dt,
            x: x,
            y: y,
            keys: keys
        }
        return replayEvent;
    }).filter(e => e).slice(2);
}

const Key = {
    M1: 1 << 0,
    M2: 1 << 1,
    K1: 1 << 2,
    K2: 1 << 3,
    SMOKE: 1 << 4
}

function keypressTimes(events) {
    let m1p, m2p = false;
    let m1s, m1e, m2s, m2e = 0;
    const m1t = [];
    const m2t = [];
    events.forEach(e => {
        if (!m1p && (e.keys & Key.M1)) {
            m1p = true;
            m1s = e.t;
        } else if (m1p && !(e.keys & Key.M1)) {
            m1p = false;
            m1e = e.t;
            m1t.push({
                x: e.x,
                y: e.y,
                start: m1s,
                end: m1e,
                hold: m1e - m1s
            });
        }

        if (!m2p && (e.keys & Key.M2)) {
            m2p = true;
            m2s = e.t;
        } else if (m2p && !(e.keys & Key.M2)) {
            m2p = false;
            m2e = e.t;
            m2t.push({
                x: e.x,
                y: e.y,
                start: m2s,
                end: m2e,
                hold: m2e - m2s
            });
        }
    });
    const kt = [...m1t, ...m2t].sort((a, b) => {
        if (a.start > b.start) {
            return 1;
        }
        return -1;
    });
    return kt;
}

function sliderendTimes(score) {
    const keypresses = score.kt;
    const beatmap = score.parsedBeatmap;
    const hw50 = Math.trunc(diffRange(beatmap.od, 200, 150, 100, score.mod_int));

    const releaseTimes = [];
    const hitObjs = beatmap.hitObjects;

    let kp_i = 0
    let ho_i = 0

    while (ho_i < hitObjs.length && kp_i < keypresses.length) {
        const ho = hitObjs[ho_i];
        const kp = keypresses[kp_i];
        let endTime = ho.endTime;

        if (ho instanceof HitCircle) {
            endTime += hw50 + 1;
        }

        if (kp.start < ho.startTime - 400) {
            kp_i++;
            continue;
        }

        if (kp.start <= ho.startTime - hw50) {
            if (ho instanceof Slider) {
                const releaseTime = kp.end - ho.endTime;
                releaseTimes.push(releaseTime);
                while (keypresses[kp_i].start < ho.endTime) {
                    kp_i ++;
                    if (kp_i >= keypresses.length) {
                        break;
                    }
                }
            } else {
                kp_i++;
            }
            ho_i++;
        } else if (kp.start >= endTime) {
            ho_i++;
        } else {
            if (kp.start < ho.startTime + hw50 && !(ho instanceof Spinner)) {
                if (ho instanceof Slider) {
                    const releaseTime = kp.end - ho.endTime;
                    releaseTimes.push(releaseTime);
                    while (keypresses[kp_i].start < ho.endTime) {
                        kp_i ++;
                        if (kp_i >= keypresses.length) {
                            break;
                        }
                    }
                } else {
                    kp_i++;
                }
                ho_i++;
            } else {
                kp_i++;
            }
        }
    }
    return releaseTimes;
}

function parseBeatmap(score, cb) {
    web.get(`/osu/${score.beatmap.id}`, {}, res => {
        res.text().then(data => {
            score.mod_int = score.mods_old.reduce((mod_int, mod) => {
                if (mod === "PF") {
                    mod_int |= Mod.SD;
                }
                if (mod === "NC") {
                    mod_int |= Mod.DT;
                }
                mod_int |= Mod[mod];
                return mod_int;
            }, 0);
            score.parsedBeatmap = new Beatmap(data, score.mod_int);
            cb();
        });
    });
}
//#endregion

//#region Graphing
function graph(id, data, rate, min, max, color, xlabel, tooltip = true, line = false, linePos = (1000 / 60), lineColor = "rgba(255,0,0,0.25)") {
    const ctx = document.getElementById(id).getContext("2d");
    const font = "Torus,Inter,Helvetica Neue,Tahoma,Arial,Hiragino Kaku Gothic ProN,Meiryo,Microsoft YaHei,Apple SD Gothic Neo,sans-serif";
    const arbitraryLine = {
        id: "arbitraryLine",
        beforeDraw(chart, args, options) {
            if (options.enabled) {
                const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
                ctx.save();
                const xWidth = 2;
                ctx.fillStyle = options.lineColor;
                ctx.fillRect(x.getPixelForValue(options.xPosition) - (xWidth / 2), top, xWidth, height);
                ctx.restore();
            }
        }
    };
    return new Chart(ctx, {
        type: "bar",
        data: {
            datasets: [{
                data: data,
                backgroundColor: [
                    color,
                ],
                barPercentage: 1,
                categoryPercentage: 0.96,
                borderRadius: 4,
                // barThickness: 10
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "linear",
                    beginAtZero: true,
                    min: min,
                    max: max,
                    offset: false,
                    grid: {
                        offset: false
                    },
                    title: {
                        display: true,
                        text: xlabel,
                        color: "rgba(255,255,255,0.6)",
                        font: {
                            family: font,
                            weight: 400,
                            size: 14
                        }
                    },
                    ticks: {
                        color: "rgba(255,255,255,0.4)",
                        font: {
                            family: font,
                            weight: 100
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Count",
                        color: "rgba(255,255,255,0.6)",
                        font: {
                            family: font,
                            weight: 400,
                            size: 14
                        }
                    },
                    ticks: {
                        color: "rgba(255,255,255,0.4)",
                        font: {
                            family: font,
                            weight: 100
                        },
                        callback: (label, index, labels) => {
                            if (Math.floor(label) === label) {
                                return label;
                            }
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: tooltip,
                    callbacks: {
                        title: items => {
                            const item = items[0];
                            const x = item.parsed.x;
                            return `${(x - 0.5 / rate).toFixed(2)}`;
                        },
                        label: context => {
                            return "";
                        }
                    },
                    xAlign: "center",
                    yAlign: "bottom",
                    titleAlign: "center",
                    titleFont: {
                        family: "Torus,Inter,Helvetica Neue,Tahoma,Arial,Hiragino Kaku Gothic ProN,Meiryo,Microsoft YaHei,Apple SD Gothic Neo,sans-serif",
                    }
                },
                arbitraryLine: {
                    enabled: line,
                    lineColor: lineColor,
                    xPosition: linePos
                }
            }
        },
        plugins: [arbitraryLine]
    });
}

function frametimeGraph(id, data, rate, max) {
    return graph(id, data, rate, 0, max, "rgba(31, 119, 180, 0.5)", "Frametime (ms)", true, true);
}

function keypressGraph(id, data, rate, max = 160) {
    return graph(id, data, rate, 0, max, "rgba(31, 119, 180, 0.5)", "Keypress Time (ms)");
}

function sliderendGraph(id, data, rate, min = -400, max = 400) {
    return graph(id, data, rate, min, max, "rgba(31, 119, 180, 0.5)", "Sliderend Release Time (ms)", false);
}

function bins(data) {
    const bins = data.reduce((obj, val) => {
        obj[val] = obj[val] ? obj[val] + 1 : 1;
        return obj;
    }, {});
    return Object.entries(bins).map(([k, v]) => {
        return {
            x: parseFloat(k),
            y: v
        };
    });
}
//#endregion