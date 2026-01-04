// ==UserScript==
// @name         RHPI+
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add colors in RHPI holidays dashboard
// @author       Victor Ros
// @match        https://*.com/webplace/ceg.jsp*
// @icon         https://img.icons8.com/color/512/sunbathe.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458167/RHPI%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/458167/RHPI%2B.meta.js
// ==/UserScript==

/* jshint esversion:10 */

(async function() {
    "use strict";

    const log = (_msg, ..._args) => {
        if (typeof _msg === "object") {
            console.log("[RHPI+]", _msg, ..._args);
        } else {
            console.log(`[RHPI+] ${_msg}`, ..._args);
        }
    };

    // Constants
    const ABSENCES_REGEX = /Planning individuel des absences/; // Label to detect if script can be run
    const EVTS = [
        {label: "Congés payés", color: "#03a9f4"},
        {label: "Jour de repos", color: "#ab47bc"},
        {label: "Télétravail", color: "#ff9800"},
    ];

    /**
     * Returns days with EVTs.
     * In RHPI, there are 3 elements with class "planning_evt" per EVT.
     * @returns {Set}
     */
    function findDaysWithEvts() {
        log("Look for days with EVTs");
        const daysEvts = Array.from(document.querySelectorAll("table.planning tr.planning_jour > td > table.planning_evt"));
        return daysEvts.reduce((_acc, _elt, _idx) => {
            const parentElt = _elt.parentElement;
            if (!_acc.has(parentElt)) {
                _acc.add(parentElt);
            }
            return _acc;
        }, new Set());
    }

    /**
     * Get EVT kind based on title (the only data we have).
     * @param {string} _title Title (tooltip).
     * @returns {string} EVT kind.
     */
    function getEvtKind(_title) {
        return EVTS.find((_evt) => _title.startsWith(_evt.label));
    }

    /**
     * Get EVTs infos for specific day.
     * @param {HTMLElement} _dayEvts A day with EVTs.
     * @returns {object} EVTs infos.
     */
    function getInfos(_dayEvts) {
        const evts = Array.from(_dayEvts.querySelectorAll("table.planning_evt td[title]"));
        const infos = evts.map((_evt) => {
            return {
                evt: _evt,
                label: _evt.title,
                onclick: _evt.onclick,
                kind: getEvtKind(_evt.title),
            };
        });
        log(infos);
        return infos;
    }

    /**
     * Update colors.
     * @param {object} _infos EVTs infos.
     * @returns {void} Nothing.
     */
    function updateColors(_infos) {
        _infos.forEach((_info) => {
            _info.evt.style.backgroundColor = _info.kind?.color;
        });
    }

    /**
     * Add EVT in legend.
     * @param {string} _color Color to of the event.
     * @param {string} _text Text to display.
     * @returns {void} Nothing.
     */
    function addLegend(_color, _text) {
        log(`Add ${_text} to legend!`);
        const legendPanel = document.getElementById("planning_legende");

        const brTabIndex = document.createElement("br");
        brTabIndex.setAttribute("tabindex", "-1");

        const spanTabIndex = document.createElement("span");
        spanTabIndex.setAttribute("style", `background-color:${_color}`);
        spanTabIndex.setAttribute("tabindex", "-1");
        spanTabIndex.innerHTML = "&nbsp;&nbsp;&nbsp;";

        const legend = document.createElement("span");
        legend.innerHTML = ` ${_text}`;

        const firstElt = document.getElementById("planning_legende").firstChild;

        const emptySpan = document.createElement("span");
        emptySpan.innerHTML = "&nbsp;&nbsp;";

        legendPanel.insertBefore(brTabIndex, firstElt);
        legendPanel.insertBefore(emptySpan, firstElt);
        legendPanel.insertBefore(spanTabIndex, firstElt);
        legendPanel.insertBefore(legend, firstElt);
        legendPanel.insertBefore(brTabIndex.cloneNode(), firstElt);
    }

    /**
     * Update Legend.
     * @returns {void} Nothing.
     */
    function updateLegend() {
        log("Update legend...");
        EVTS.forEach((_evt) => {
            addLegend(_evt.color, _evt.label);
        });
        log("Legend updated!");
    }

    function run() {
        const planning = Array.from(document.querySelectorAll(".planning"));

        if (planning.length > 0) {
            log("Start RHPI+ script!");
            updateLegend();
            const daysEvts = findDaysWithEvts();
            daysEvts.forEach((_dayEvts) => {
                const infos = getInfos(_dayEvts);
                updateColors(infos);
            });
            log("Finish RHPI+ script!");
        } else {
            log("Not in Absences page.");
        }
    }

    run();
})();