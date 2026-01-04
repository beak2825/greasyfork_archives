// ==UserScript==
// @name         Torn Custom Race Evaluator
// @namespace    underko.torn.scripts.racing
// @version      1.2
// @author       underko[3362751]
// @description  Scores and sorts custom races by RS potential, colors join button
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541947/Torn%20Custom%20Race%20Evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/541947/Torn%20Custom%20Race%20Evaluator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const trackStats = {
        "Uptown":       { avgLapSec:  72, lapMiles: 2.25, tem: 0.862 },
        "Withdrawal":   { avgLapSec: 112, lapMiles: 3.40, tem: 0.825 },
        "Underdog":     { avgLapSec:  85, lapMiles: 1.73, tem: 0.593 },
        "Parkland":     { avgLapSec: 150, lapMiles: 3.43, tem: 0.608 },
        "Docks":        { avgLapSec: 160, lapMiles: 3.81, tem: 0.737 },
        "Commerce":     { avgLapSec:  50, lapMiles: 1.09, tem: 0.476 },
        "Two Islands":  { avgLapSec:  99, lapMiles: 2.71, tem: 0.799 },
        "Industrial":   { avgLapSec:  77, lapMiles: 1.35, tem: 0.451 },
        "Vector":       { avgLapSec:  61, lapMiles: 1.16, tem: 0.430 },
        "Mudpit":       { avgLapSec:  36, lapMiles: 1.06, tem: 0.510 },
        "Hammerhead":   { avgLapSec:  55, lapMiles: 1.16, tem: 0.482 },
        "Sewage":       { avgLapSec:  94, lapMiles: 1.50, tem: 0.000 }, // min
        "Meltdown":     { avgLapSec:  57, lapMiles: 1.20, tem: 0.499 },
        "Speedway":     { avgLapSec:  27, lapMiles: 0.90, tem: 1.000 }, // max
        "Stone Park":   { avgLapSec:  72, lapMiles: 2.08, tem: 0.695 },
        "Convict":      { avgLapSec:  60, lapMiles: 1.64, tem: 0.622 },
    };

    function calculateRaceScore(track, laps, participants, maxParticipants, waitMinutes) {
        const stats = trackStats[track];
        if (!stats) return { score: 0 };

        const avgLapTimeMin = stats.avgLapSec / 60;
        const totalRaceTimeMin = laps * avgLapTimeMin;

        // 1. Track Efficiency Multiplier (TEM)
        // Higher distance per second = better training yield.
        // Weight: 40%
        const tem = trackStats[track].tem;

        // 2. Lap Efficiency Multiplier (LEM)
        // Ideal is 80 laps, penalize deviation.
        // Weight: 20%
        const lapScore = 1 - Math.abs(laps - 80) / 80;

        // 3. Participant Count Multiplier (PCM)
        // Max value 1 at 100 players; 0.5 at 50 players, etc.
        // Weight: 100%
        const participantScore = Math.min(1, participants / 100);

        // 4. Wait Time Multiplier (WTM)
        // Wait time reduces score but is less punishing for good races.
        // Considers total race length.
        const waitRatio = waitMinutes / totalRaceTimeMin;
        const waitMultiplier = 1 - Math.min(1, waitRatio);

        // Final RS Score
        const baseScore = 0.4 * tem + 0.2 * lapScore + 1.0 * participantScore;
        const rawScore = 5 * baseScore * waitMultiplier;
        const finalScore = participants == maxParticipants ? 0 : Math.max(0, Math.min(5, rawScore));

        return {
            score: finalScore,
            tem: tem.toFixed(3),
            lem: lapScore.toFixed(3),
            pcm: participantScore.toFixed(3),
            wm: waitMultiplier.toFixed(3)
        };
    }

    function parseTrackName(nameRaw) {
        const knownTracks = Object.keys(trackStats);
        for (const track of knownTracks) {
            if (nameRaw.toLowerCase().includes(track.toLowerCase())) return track;
        }
        return "Unknown";
    }

    function parseWaitTime(str) {
        if (!str || str.toLowerCase().includes("waiting")) return 0;
        let mins = 0;
        const hMatch = str.match(/(\d+)\s*h/);
        const mMatch = str.match(/(\d+)\s*m/);
        if (hMatch) mins += parseInt(hMatch[1], 10) * 60;
        if (mMatch) mins += parseInt(mMatch[1], 10);
        return mins;
    }

    function parseLaps(str) {
        const match = str.match(/(\d+)\s*laps/i);
        return match ? parseInt(match[1], 10) : 80;
    }

    function waitForElement(selector, callback) {
        const processed = new WeakSet();

        const observer = new MutationObserver(() => {
            document.querySelectorAll(selector).forEach(el => {
                if (!processed.has(el)) {
                    processed.add(el);
                    callback(el);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll(selector).forEach(el => {
            if (!processed.has(el)) {
                processed.add(el);
                callback(el);
            }
        });
    }

    waitForElement('a[href*="createCustomRace"]', () => {
        const raceBlocks = Array.from(document.querySelectorAll('.events-list>li'));
        const raceData = [];

        raceBlocks.forEach(block => {
            const trackAndLapEl = block.querySelector('.track');
            const driversEl = block.querySelector('.drivers');
            const timeEl = block.querySelector('.startTime');
            const joinLi = block.querySelector('li.join');

            if (!trackAndLapEl || !driversEl || !timeEl || !joinLi) return;

            const trackAndLap = trackAndLapEl.innerText.trim();
            const track = parseTrackName(trackAndLap.split('(')[0].trim());
            const waitMinutes = parseWaitTime(timeEl.textContent.trim());
            const participants = parseInt(driversEl.textContent.replace(/\D+/g, ' ').trim().split(" ")[0].trim()) || 0;
            const maxParticipants = parseInt(driversEl.textContent.replace(/\D+/g, ' ').trim().split(" ")[1].trim()) || 0;
            const laps = parseLaps(trackAndLap || '');
            const raceScore = calculateRaceScore(track, laps, participants, maxParticipants, waitMinutes);

            const rawScore = raceScore.score;
            const tem = raceScore.tem;
            const lem = raceScore.lem;
            const pcm = raceScore.pcm;
            const wm = raceScore.wm;

            raceData.push({ block, track, laps, participants, waitMinutes, rawScore, joinLi, tem, lem, pcm, wm });
        });

        // Normalize scores to 0–5 range
        const scores = raceData.map(r => r.rawScore);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const scoreRange = maxScore - minScore || 1;

        raceData.forEach(r => {
            const normScore = ((r.rawScore - minScore) / scoreRange) * 5;
            const hue = (normScore / 5) * 120;
            const color = `hsl(${hue}, 100%, 50%)`;

            r.joinLi.style.background = color;
            r.joinLi.title = `RS Score: ${normScore.toFixed(2)} (${r.track}, ${r.laps} laps, ${r.waitMinutes} wait, ${r.participants} drivers)<br/>` +
                             `Debug: TEM: ${r.tem}, LEM: ${r.lem}, PCM: ${r.pcm}, WM: ${r.wm}`;
        });

        // Sort races by normalized score descending
        const container = document.querySelector('.events-list');
        if (container) {
            raceData.sort((a, b) => b.rawScore - a.rawScore);
            raceData.forEach(r => container.appendChild(r.block));
        }
    });
})();
