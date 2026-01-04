// ==UserScript==
// @name         WKStats Projections Page
// @version      1.4.1
// @description  Make a temporary projections page for WKStats
// @author       UInt2048
// @match        https://www.wkstats.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/684166
// @downloadURL https://update.greasyfork.org/scripts/438640/WKStats%20Projections%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/438640/WKStats%20Projections%20Page.meta.js
// ==/UserScript==

//jshint esversion:6
/*eslint max-len: ["error", { "code": 120 }]*/

(function() {
    "use strict";

    Date.prototype.add = function(seconds) {
        return this.setTime(this.getTime() + (seconds*1000)) && this;
    };

    Date.prototype.subtractDate = function(date) {
        return (this.getTime() - date.getTime()) / 1000;
    };

    Date.prototype.format = function() {
        return new window.Intl.DateTimeFormat("default", {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(this);
    };

    const P = {
        maxLevel: null,
        progressions: [],
        stats: null,
        now: null,

        addGlobalStyle: function addGlobalStyle() {
            const head = document.getElementsByTagName("head")[0], css = `
.main-content .chart table.coverage {margin-top:1em; position:relative;}
.main-content .chart table.coverage {border-collapse:collapse; border-spacing:0; margin-left:auto; margin-right:auto;}
.main-content .chart table.coverage tr {border-left:1px solid #000;}
.main-content .chart table.coverage tr:first-child {border-top:1px solid #000;}
.main-content .chart table.coverage tr:last-child {border-bottom:1px solid #000;}
.main-content .chart table.coverage tr.header {background-color:#ffd; font-weight:bold;}
.main-content .chart table.coverage tr.header:nth-child(2) {line-height:1em;}
.main-content .chart table.coverage tr.header.bottom {border-bottom:1px solid #000;}
.main-content .chart table.coverage tr:not(.header) + tr:not(.header):not(.current_level) {border-top:1px solid #ddd;}
.main-content .chart table.coverage tr:not(.header):nth-child(even) {background-color:#efe;}
.main-content .chart table.coverage td {padding:0 .5em;}
.main-content .chart table.coverage td:first-child {border-right:1px solid #000;}
.main-content .chart table.coverage td:last-child {border-right:1px solid #000;}
.main-content .chart table.coverage tr.header td.header_div {border-bottom:1px solid #0001;}
.main-content .chart table.coverage tr.count td {font-weight:normal; font-size:0.625em;}
.main-content .chart table.coverage tr.current_level {border:2px solid #000;}
.main-content .chart table.coverage tr.current_level:after
{content:"\f061"; font-family:FontAwesome; position:absolute; display:inline-block; left:-1.25em;}
            `;
            if (head) {
                const style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = css.replace(/;/g, " !important;");
                head.appendChild(style);
            }
        },

        median: function median(arr) {
            const mid = Math.floor(arr.length / 2);
            return arr.length === 0 ? 0 : arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
        },

        countComponent: function(componentLevel, itemLevel) {
            // For items in future levels, don't count passing time for components on preceding levels
            return !(itemLevel > P.progressions[P.progressions.length - 1].level && componentLevel < itemLevel);
        },

        levelDuration: function(level) {
            return new Date(level.passed_at || level.abandoned_at).subtractDate(new Date(level.unlocked_at));
        },

        getLater: function(a, b) {
            return new Date(Math.max(a, b));
        },

        getFools: function(date, fools) {
            return fools ? new Date(date.getFullYear() + (date.getMonth() >= 3), 3, 1) : date;
        },

        get: function(a, b) {
            return a && a[b];
        },

        getID: function(a, b) {
            return P.get(document.getElementById(a), b);
        },

        getHyp: function(fastest, isCurrent) {
            const s = isCurrent ? "current" : fastest;
            return P.getID("speed" + (P.getID("hypothetical", "checked") ? "-" + s : ""), "value") * 3600 || 864000;
        },

        formatInterval: function(seconds) {
            const days = seconds / 86400;
            const hours = (days % 1) * 24;
            const minutes = (hours % 1) * 60;
            const secs = (minutes % 1) * 60;
            return `${Math.floor(days)}d ${Math.floor(hours)}h ${Math.floor(minutes)}m ${Math.floor(secs)}s`;
        },

        findLevel: function(levels, level) {
            return levels.slice().reverse().find(p => level == p.level);
        },

        rangeFormat: function(arr) {
            return arr.map((n, i) => i < arr.length - 1 && arr[i + 1] - n === 1 ?
                           `${i > 0 && n - arr[i - 1] === 1 ? "" : n}-` : `${n}, `
        ).join("").replace(/-+/g, "-").slice(0, -2);
    },

        project: function project() {
            const current = P.progressions[P.progressions.length - 1];
            const levels = P.progressions.slice().concat(Array.from({length: P.maxLevel - current.level + 2},
                                                                    (_, i) => ({level: current.level + 1 + i})));
            const medianSpeed = P.median(P.progressions.slice(0, -1).map(P.levelDuration).sort((a, b) => a - b));
            const showPast = P.getID("showPast", "checked");
            const fools = P.getID("fools", "checked");
            const hypothetical = P.getID("hypothetical", "checked");
            const time = P.stats.map(d => d.length && d.sort((a, b) => a[0] - b[0])[Math.ceil(d.length * 0.9) - 1][0]);
            const expanded = P.getID("expand", "checked") && P.findLevel(levels, P.getID("expanded", "value"));
            const u = time.map((d, i) => {
                const unlocked = P.get(P.findLevel(levels, i), "unlocked_at");
                return [(unlocked ? P.now.subtractDate(new Date(unlocked)) : 0) + d, i];
            });

            let output = `<input type="checkbox" id="expand" class="project" ${expanded ? "checked" : ""}>
            <label for="speed">Show Details for Level:</label>
            <input type="number" id="expanded" size="3" value="${P.get(expanded, "level") || current.level}"><br/>
            <input type="checkbox" id="showPast" class="project" ${showPast ? "checked" : ""}>
            <label for="showPast">Show Past Levels</label><br/>
            <input type="checkbox" id="fools" class="project" ${fools ? "checked" : ""}>
            <label for="fools">Dark Blockchain</label><br/>
            <input type="checkbox" id="hypothetical" class="project" ${hypothetical ? "checked" : ""}>
            <label for="hypothetical">Expand Hypothetical</label><br/>
            ${hypothetical ? Array.from(new Set(u.slice(current.level, -1).map(d => d[0]))).map((time, i) => {
                const s = i === 0 ? "current" : time;
                return `<label for="speed-${s}">Hypothetical Speed for fastest ${P.formatInterval(time)}
                (levels ${P.rangeFormat(u.filter((d, i) => time === d[0]).map(d => d[1]))}):</label>
                <input type="number" id="speed-${s}" size="4" value="${P.getHyp(time, i === 0) / 3600}">h<br/>`;
            }).reduce((a, b) => a + b) : `<label for="speed">Hypothetical Speed:</label>
            <input type="number" id="speed" size="4" value="${P.getHyp(time) / 3600}">h`}
            <button id="project" class="project">Project</button><br/>
            <table class="coverage"><tbody><tr class="header"> ${expanded ?
            "<td>Kanji</td><td colspan=3>Fastest</td>" :
        "<td>Level </td><td> Real/Predicted </td><td> Fastest </td><td> Hypothetical</td>"}</tr>`,
            unlocked = new Date(P.now), currentReached = false, info = "",
            real = null, fastest = null, given = null, p = [];

        for (const i of levels) {
            if (i === current) currentReached = true;
            if (!showPast && !currentReached) continue;

            const l = i.level,
                  _fastest = new Date(fastest || P.now).add(time[l - 1]),
                  _real = P.getLater(new Date(real || unlocked).add(l === P.maxLevel + 2 ? time[l - 1] : medianSpeed),
                                     _fastest),
                  _given = P.getLater(new Date(given || unlocked).add(l === P.maxLevel + 2 ? time[l - 1] :
                                                                      P.getHyp(time[l - 1], l === current.level + 1)),
                                      _fastest);

            if (i.unlocked_at) {
                unlocked = new Date(i.unlocked_at);
                info = `<td> ${unlocked.format()} </td><td> - </td><td> - </td>`;
            } else if (l <= P.maxLevel) {
                p[l] = {fastest: P.getFools(fastest = _fastest, fools).format(),
                        real: (real = _real).format(),
                        given: (given = _given).format()};
                info = `<td> ${p[l].real} </td><td> ${p[l].fastest} </td><td> ${p[l].given} </td>`;
            } else {
                p[l] = {fastest: P.getFools(_fastest, fools).format(),
                        real: _real.format(),
                        given: _given.format()};
                info = `<td> ${p[l].real} </td><td> ${p[l].fastest} </td><td> ${p[l].given} </td>`;
            }

            if (!expanded) {
                output += `<tr ${i === current ? "class=\"current_level\"" : ""}><td> ${
                l === P.maxLevel + 2 ? "全火" : String("0" + l).slice(-2)} </td> ${info} </tr>`;
            } else if (expanded === i) {
                for (const kan of P.stats[expanded.level]) {
                    const date = (kan[0] < 0 ? "Passed on " : "") + (new Date(fastest || P.now)).add(kan[0]).format();
                    output += `<tr><td>${kan[1].data.characters}</td><td colspan=3>${date}</tr>`;
                }
            }
        }

        output += "</tbody></table>";

        const element = document.getElementsByClassName("projections")[0];
        if (!element.className.includes("chart")) element.className += " chart";
        element.innerHTML = output;
        Array.from(document.getElementsByClassName("project")).forEach(x => x.addEventListener("click", project));
        P.addGlobalStyle();

        return JSON.stringify(Object.assign({}, p));
    },

        api: function api(userData, levels, systems, items) {
            if (P.progressions.length > 0) return P.project();

            P.maxLevel = userData.subscription.max_level_granted;
            P.progressions = Object.values(levels).map(level => level.data);
            P.now = new Date();

            const time = function(item, burn) {
                if (!P.get(item.assignments, burn ? "burned_at" : "passed_at")) {
                    let interval = P.get(item.assignments, "available_at") ?
                        Math.max(0, (new Date(item.assignments.available_at)).subtractDate(P.now)) : 0;
                    const srs = systems[item.data.spaced_repetition_system_id].data;
                    const target = P.get(srs, burn ? "burning_stage_position" : "passing_stage_position");
                    for (let i = (P.get(item.assignments, "srs_stage") || 0) + 1; i < target; i++) {
                        interval += srs.stages[i].interval;
                    }
                    return interval;
                }
                return (new Date(P.get(item.assignments, burn ? "burned_at" : "passed_at"))).subtractDate(P.now);
            };

            const unlock = function(item, itemLevel, burn) {
                return P.countComponent(item.data.level, itemLevel) ?
                    (item.object === "radical" || item.object === "kana_vocabulary" ? 0 : item.data.component_subject_ids.
                     map(id => Math.max(0, unlock(items.find(o => o.id === id), item.data.level))).
                     reduce((a, b) => Math.max(a, b))) + time(item, burn) : 0;
            };

            P.stats = Array.from(Array(P.maxLevel + 1), () => []);
            for (const item of items) {
                if (item.data.hidden_at || item.object !== "kanji") continue;
                P.stats[item.data.level].push([unlock(item, item.data.level, false), item]);
            }

            let burnStats = items.filter(item => !item.data.hidden_at).map(item => unlock(item, item.data.level, true));
            P.stats.push([[burnStats.sort((a, b) => a - b)[burnStats.length - 1], burnStats]]);

            return P.project();
        }
    };

    window.wkof.include("ItemData, Apiv2");
    window.wkof.ready("ItemData, Apiv2").then(() => {
        window.wkof.Apiv2.get_endpoint("user").then(userData => {
            window.wkof.Apiv2.get_endpoint("level_progressions").then(levels => {
                window.wkof.Apiv2.get_endpoint("spaced_repetition_systems").then(systems => {
                    window.wkof.ItemData.get_items("subjects, assignments").then(items => {
                        // Enable callback when we enter the progression page
                        window.wkof.on("wkstats.projections.loaded", () => P.api(userData, levels, systems, items));
                    });
                });
            });
        });
    });
})();
