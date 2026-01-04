// ==UserScript==
// @name         OsuProfileScoresTimeGraph
// @namespace    https://github.com/Magnus-Cosmos
// @version      1.1.12
// @description  Adds graphing for which hours scores were set at
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/441005-osuweb/code/OsuWeb.js
// @require      https://greasyfork.org/scripts/441010-osupageobserver/code/OsuPageObserver.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.34/moment-timezone-with-data.min.js
// @downloadURL https://update.greasyfork.org/scripts/441373/OsuProfileScoresTimeGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/441373/OsuProfileScoresTimeGraph.meta.js
// ==/UserScript==

const web = new Web();
const timezones = moment.tz.names();
let localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let currTimezone = localTimezone;
let selectedTz = null;

function wait(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

function escRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

const flagUrl = code => {
    const baseFileName = code.split('').map((c) => (c.charCodeAt(0) + 127397).toString(16)).join("-");
    return `/assets/images/flags/${baseFileName}.svg`;
};

$(document.head).append($("<style class='circlescript-style'></style>").html(
`
.graph-button {
    display: inline-block;
}

.graph-close {
    background-color: hsl(var(--hsl-red-3)) !important;
}

.graph-close:hover {
    background-color: hsl(var(--hsl-red-2)) !important;
}

.graph-button-container {
    display: table-cell;
    text-align: right;
}

.graph-container {
    margin: 2px 0;
    padding: 10px;
    border-radius: 10px;
    background-color: hsl(var(--hsl-b3));
}

.timezone {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}

.timezone-label {
    display: inline;
    font-weight: 700;
    color: hsl(var(--hsl-f1));
}

.timezone-input {
    text-align: center;
    font-size: 12px;
}

.graph-heading {
    display: table;
    table-layout: fixed;
    width: 100%;
    margin-top: 10px;
}

.timezones-popup {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    z-index: 100;
    margin-top: 3px;
}

.timezones-popup .simple-menu--nav2 {
    will-change: auto;
}

.timezones-content {
    max-height: 189px !important;
    min-height: 0px !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.timezones-content::-webkit-scrollbar {
    display: none;
}

.timezones-menu__item--hover {
    background-color: var(--item-hover-bg);
    color: var(--item-hover-colour);
}

.timezones-menu__item--hover:before {
    content: "";
    border-radius: 10px;
    position: absolute;
    top: 7px;
    left: 10px;
    width: 3px;
    height: calc(100% - 14px);
    background-color: var(--stripe-bg);
}

.flag-country--flat {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
}

#best-plays-graph {
    display: block;
}
`
));

function staticPage() {
    [this.type, ...this.paths] = location.pathname.split("/").slice(1).map(val => {
        const int = parseInt(val);
        return val == int ? int : val;
    });
}

function getProfileJson() {
    const json = $(".osu-layout--full").attr("data-initial-data");
    if (json) {
        return JSON.parse(json);
    }
    return null;
}

const osuWebObserver = new OsuWebObserver(staticPage, function() {
    switch(this.type) {
        case "users": {
            const profile = getProfileJson();
            const self = currentUser.id;
            const user = profile.user;
            const userIsSelf = self === user.id;
            const mode = this.paths[1] ? this.paths[1] : user.playmode;
            const lazyObserver = new MutationObserver((mutations) => {
               if (user) {
                   graphTimes("best", user, mode, userIsSelf);
                   graphTimes("firsts", user, mode, userIsSelf);
               }
            });
            lazyObserver.observe($(`div[data-page-id="top_ranks"]`).find(".lazy-load")[0], {
                attributes: true,
                attributeFilter: ["class"]
            });
        }
    }
});

const ScoreType = {
    firsts: 2,
    best: 1
}

function filterTimezones() {
    $(this).next().children().first().attr("data-visibility", "visible");
    $(this).next().children().first().removeClass("hidden");
    $(this).next().find(".simple-menu__content").empty();
    const matches = [];
    const input = $(this).val().replace(" ", "_");
    const regex = new RegExp(escRegex(input), "i");
    const prevSelectedTimezone = selectedTz?.attr("data-timezone");
    selectedTz = null;
    if (input.length === 2 && input.toUpperCase() === input) {
        const tzs =  moment.tz.zonesForCountry(input);
        tzs?.forEach(tz => {
            matches.push(tz);
            const isActive = $(this).next().children().first().attr("data-current-timezone") === tz;
            const button = $(
            `<button type="button" class="timezones-menu__item simple-menu__item${isActive ? " simple-menu__item--active" : ""}" data-timezone="${tz}">
                <span class="nav2-locale-item">
                    <span class="nav2-locale-item__flag">
                        <div class="flag-country flag-country--flat" style="background-image: url('${flagUrl(input)}');"></div>
                    </span>
                    ${tz}
                </span>
            </button>`);
            $(this).next().find(".simple-menu__content").append(button);
            if (button.attr("data-timezone") === prevSelectedTimezone) {
                selectedTz = button.addClass("timezones-menu__item--hover");
            }
        });
    } else {
        timezones.forEach(timezone => {
            const match = timezone.match(regex);
            if (match) {
                matches.push(timezone);
                const isActive = $(this).next().children().first().attr("data-current-timezone") === timezone;
                const countries = moment.tz.zone(timezone).countries();
                const countryCode = countries[0];
                const button = $(
                `<button type="button" class="timezones-menu__item simple-menu__item${isActive ? " simple-menu__item--active" : ""}" data-timezone="${timezone}">
                    <span class="nav2-locale-item">
                        <span class="nav2-locale-item__flag">
                            <div class="flag-country flag-country--flat" style="background-image: url('${flagUrl(countryCode ? countryCode : "XX")}');"></div>
                        </span>
                        ${timezone}
                    </span>
                </button>`);
                $(this).next().find(".simple-menu__content").append(button);
                if (button.attr("data-timezone") === prevSelectedTimezone) {
                    selectedTz = button.addClass("timezones-menu__item--hover");
                }
                if (countries.length > 1) {
                    const swapFlagBg = i => {
                        const flag = button.find(".flag-country");
                        const visible = button.parent().parent().attr("data-visibility") === "visible";
                        if (flag && visible) {
                            const code = countries[i];
                            flag.css("background-image", `url('${flagUrl(code)}')`);
                            wait(2000).then(swapFlagBg.bind(this, (i + 1) % countries.length));
                        }
                    }
                    swapFlagBg(Math.floor(Math.random() * countries.length));
                }
            }
        });
    }
    
    if (matches.length === 0) {
        $(this).next().children().first().attr("data-visibility", "hidden");
    } else {
        $(".timezones-menu__item").on("mousedown", function() {
            $(this).parent().parent().parent().prev().val($(this).attr("data-timezone"));
            currTimezone = $(this).attr("data-timezone");
            selectedTz = null;
        });
    }
    return matches;
}

function graphTimes(type, user, mode, userIsSelf) {
    let data = null;
    let matches = [];
    const oh3 = $(`div[data-page-id="top_ranks"]`).find("h3").toArray().filter(el => $(el).css("display") !== "none")[ScoreType[type]];
    const amount = $(oh3).find(".title__count").text();
    if (parseInt(amount) === 0 || !oh3) {
        return;
    }
    currTimezone = localTimezone;
    if (!userIsSelf) {
        const userTimezones =  moment.tz.zonesForCountry(user.country.code);
        if (userTimezones.length > 0) {
            currTimezone = userTimezones[0];
        }
    }
    const h3 = $(oh3).clone().get();
    $(oh3).css("display", "none");
    $(h3).insertAfter(oh3);
    $(h3).wrap(`<div class="graph-heading"></div>`);
    $(`<div class="graph-button-container">
        <button type="button" class="show-more-link graph-button graph-button--${type}">
            <span class="show-more-link__spinner">
                <div class="la-ball-clip-rotate"></div>
            </span>
            <span class="show-more-link__label">
                <span class="show-more-link__label-text">graph</span>
            </span>
        </button>
    </div>`).insertAfter(h3);
    $(`<div class="timezone">
        <input list="timezones" class="account-edit-entry__input timezone-input timezone-input--${type}" value="${currTimezone}" title="Timezone">
        <div class="timezones-popup">
            <div class="simple-menu simple-menu--nav2" data-visibility="hidden" data-current-timezone="${currTimezone}">
                <div class="simple-menu__content timezones-content"></div>
            </div>
        </div>
    </div>`).insertAfter(h3);
    $(`.timezone-input--${type}`).on("focus", function() {
        matches = filterTimezones.call(this);
    });
    $(`.timezone-input--${type}`).on("input", function() {
        matches = filterTimezones.call(this);
    });
    $(`.timezone-input--${type}`).on("change", function() {  
        let count = 0;
        for (const timezone of timezones) {
            const regex = new RegExp(`^${escRegex($(this).val().replace(" ", "_"))}$`, "i");
            const match = timezone.match(regex);
            if (match) {
                count++;
                currTimezone = timezone;
                $(this).next().children().first().attr("data-current-timezone", timezone);
                $(this).val(timezone);
                const chart = Chart.getChart(`graph-${type}`);
                if (chart) {
                    chart.destroy();
                    if (data) {
                        const hidden = $(`.graph-container--${type}`).css("display") === "none";
                        if (!hidden) {
                            graph(`graph-${type}`, hourBins(data));
                        }
                    }
                }
                break;
            }
        }
        if (count === 0) {
            $(this).val($(this).next().children().first().attr("data-current-timezone"));
        }
        if (selectedTz) {
            $(this).next().find(".timezones-menu__item").removeClass("simple-menu__item--active");
            selectedTz.addClass("simple-menu__item--active");
        }
    });
    $(`.timezone-input--${type}`).on("blur", function() {
        $(this).next().children().first().attr("data-visibility", "hidden");
        selectedTz = null;
    });
    $(`.timezone-input--${type}`).keydown(function (e) {
        const tzs = $(this).next().find(".timezones-menu__item");
        if (e.which === 13) {
            if (selectedTz) {
                $(this).next().children().first().attr("data-current-timezone", selectedTz.attr("data-timezone"));
                $(this).val(selectedTz.attr("data-timezone"));
                $(this).blur();
            } else {
                if (matches.length > 0) {
                    $(this).next().children().first().attr("data-current-timezone", matches[0]);
                    $(this).val(matches[0]);
                    $(this).blur();
                }
            }
        } else if (e.which === 38 || e.which === 40) {
            if (selectedTz) {
                selectedTz.removeClass("timezones-menu__item--hover");
                let nextTz;
                if (e.which === 38) {
                    nextTz = selectedTz.prev();
                    if (nextTz.length > 0) {
                        selectedTz = nextTz.addClass("timezones-menu__item--hover");
                    } else {
                        selectedTz = tzs.eq(tzs.length - 1).addClass("timezones-menu__item--hover");
                    }
                } else {
                    nextTz = selectedTz.next();
                    if (nextTz.length > 0) {
                        selectedTz = nextTz.addClass("timezones-menu__item--hover");
                    } else {
                        selectedTz = tzs.eq(0).addClass("timezones-menu__item--hover");
                    }
                }
            } else {
                if (e.which === 38) {
                    selectedTz = tzs.eq(tzs.length - 1).addClass("timezones-menu__item--hover");
                } else {
                    selectedTz = tzs.eq(0).addClass("timezones-menu__item--hover");
                }
            }
            const container = selectedTz.parent().get(0);
            const selectedEl = selectedTz.get(0);
            container.scrollTop = selectedEl.offsetTop - (container.clientHeight + 10) + selectedEl.clientHeight;
            return false;
        }
    });
    $(`div[data-page-id="top_ranks"]`).find(".show-more-link--profile-page").css("margin-bottom", "5px");
    $(`.graph-button--${type}`).on("click", function() {
        $(this).children().first().css("display", "inline-flex");
        $(this).children().last().css("visibility", "hidden");
        $(this).prop("disabled", true);
        const successFn = scores => {
            data = scores;
            const bins = hourBins(data);
            $(`<div class="graph-container graph-container--${type}"></div>`).append(`<canvas id="graph-${type}"></canvas>`).insertAfter($(this).parent().parent());
            graph(`graph-${type}`, bins);
            $(this).children().first().removeAttr("style");
            $(this).children().last().removeAttr("style");
            $(this).find(".show-more-link__label-text").text("close graph");
            $(this).addClass("graph-close");
            $(this).unbind("click");
            $(this).prop("disabled", false);
            $(this).on("click", function() {
                const hidden = $(`.graph-container--${type}`).css("display") === "none";
                if (hidden) {
                    $(this).find(".show-more-link__label-text").text("close graph");
                    $(this).addClass("graph-close");
                    $(`.graph-container--${type}`).show();
                    const chart = Chart.getChart(`graph-${type}`);
                    if (!chart && data) {
                        graph(`graph-${type}`, hourBins(data));
                    }
                } else {
                    $(this).find(".show-more-link__label-text").text("show graph");
                    $(this).removeClass("graph-close");
                    $(`.graph-container--${type}`).hide();
                } 
            });
        };
        const errorFn = err => {
            $(this).children().first().removeAttr("style");
            $(this).children().last().removeAttr("style");
            $(this).prop("disabled", false);
            console.log(err);
        }
        switch (type) {
            case "firsts": {
                getFirstPlaces(user, [], mode, 0, successFn, errorFn);
                break;
            }
            case "best": {
                web.get(`/users/${user.id}/scores/best`, { mode: mode, limit: 100 }, res => {
                    res.json().then(successFn).catch(errorFn);
                }, errorFn, { credentials: "include" });
                break;
            }
        }
    });
}

function getFirstPlaces(user, scores, mode, offset, successFn, errorFn, tries = 0) {
    web.get(`/users/${user.id}/scores/firsts`, { mode: mode, limit: 100, offset: offset }, res => {
        res.json().then(data => {
            if (data.length === 0) {
                successFn(scores);
                return;
            }
            scores.push(...data);
            getFirstPlaces(user, scores, mode, offset + 100, successFn, errorFn);
        }).catch(err => {
            if (tries > 8) {
                errorFn(err);
                return;
            }
            wait(5000 * (tries + 1)).then(() => getFirstPlaces(user, scores, mode, offset, successFn, errorFn, tries + 1));
        });
    }, errorFn, { credentials: "include" });
}

function hourBins(scores) {
    const bins = scores.reduce((obj, score) => {
        let hour = null;
        if (timezones.includes(currTimezone)) {
            const date = moment(score.ended_at).tz(currTimezone);
            hour = date.hours();
        } else {
            const date = new Date(score.ended_at);
            hour = date.getHours();
        }
        obj[hour]++;
        return obj;
    }, Object.fromEntries([...Array(24).keys()].map(k => [k, 0])));
    return Object.entries(bins).map(([k, v]) => {
        return {
            x: k,
            y: v
        };
    });
}


function graph(id, data) {
    const ctx = document.getElementById(id).getContext("2d");
    const font = "Torus,Inter,Helvetica Neue,Tahoma,Arial,Hiragino Kaku Gothic ProN,Meiryo,Microsoft YaHei,Apple SD Gothic Neo,sans-serif";
    const chartAreaBorder = {
        id: "chartAreaBorder",
        beforeDraw(chart, args, options) {
            const {ctx, chartArea: {left, top, width, height}} = chart;
            ctx.save();
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.setLineDash(options.borderDash || []);
            ctx.lineDashOffset = options.borderDashOffset;
            ctx.strokeRect(left, top, width, height);
            ctx.restore();
        }
    };
    return new Chart(ctx, {
        type: "bar",
        data: {
            datasets: [{
                data: data,
                backgroundColor: [
                    "rgba(31, 119, 180, 0.5)",
                ],
                barPercentage: 1,
                categoryPercentage: 0.96,
                borderRadius: 4,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            layout: {
                padding: {
                    right: 10
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Hour of the day",
                        color: "rgba(255,255,255,0.6)",
                        font: {
                            family: font,
                            weight: 400,
                            size: 14
                        }
                    },
                    ticks: {
                        offset: false,
                        color: "rgba(255,255,255,0.4)",
                        font: {
                            family: font,
                            weight: 100
                        }
                    },
                    offset: true,
                    grid: {
                        offset: true,
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "# of plays set",
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
                    },
                    grid: {
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                },
                chartAreaBorder: {
                    borderColor: "rgba(0,0,0,0.25)",
                    borderWidth: 1
                }
            }
        },
        plugins: [chartAreaBorder]
    });
}