// ==UserScript==
// @name         Optimal v2.1 Worker
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Optimal
// @author       You
// @license      GPL-3.0-or-later
// @match        https://fair.kaliburg.de
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kaliburg.de
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/timsort@0.3.0/build/timsort.min.js
// @downloadURL https://update.greasyfork.org/scripts/469062/Optimal%20v21%20Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/469062/Optimal%20v21%20Worker.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    class FlyWorker {
        /**
         * Executes a function in a worker and returns the result
         * @param  {function} funct Function to execute in the worker
         * @param  {inject} inject Functions to inject into the worker
         * @param  {...Object} args Parameters for the function
         * @returns {Promise} Promise object represents the result of the worker
         */
        async exec(funct, inject, ...args) {
            // Check type of funct
            if (typeof(funct) !== 'function') {
                throw new TypeError(`${funct} is not a function`);
            }

            // Cast worker function to string and build blob
            const functionString = this.worker.toString();
            const workerString = functionString.substring(functionString.indexOf('{') + 1, functionString.lastIndexOf('}'));
            const workerLink = window.URL.createObjectURL( new Blob([ workerString ]), {type: 'application/javascript'} );

            // Initialize worker
            const wrkr = new Worker(workerLink);

            // Send function to worker
            wrkr.postMessage({ callback: funct.toString(), inject: inject.map(fn => `${fn.name} = ${fn.toString()}`), args });
            const result = await new Promise((next, error) => {
                wrkr.onmessage = e => (e.data && e.data.error) ? error(e.data.error) : next(e.data);
                wrkr.onerror = e => error(e.message);
            });

            // Kill worker
            wrkr.terminate(); window.URL.revokeObjectURL(workerLink);

            return result;
        }
        worker() {
            onmessage = async function (e) {
                try {
                    e.data.inject.forEach(eval);
                    const cb = new Function(`return ${e.data.callback}`)();
                    const args = e.data.args;
                    try {
                        const result = await cb.apply(this, args);
                        return postMessage(result);
                    } catch (e) { throw new Error(`CallbackError: ${e}`); }
                } catch (e) { postMessage({error: e.message}); }
            }
        }
    }

    function timeToRanker(ranker, ranker2) {
        //Calculating the relative acceleration of the two players
        const p1Acceleration = getAcceleration(ranker);
        const p2Acceleration = getAcceleration(ranker2);
        const accelerationDiff = p2Acceleration - p1Acceleration;

        //Calculating the relative current speed of the two players
        const p1Speed = ranker.growing ? ranker.power : 0;
        const p2Speed = ranker2.growing ? ranker2.power : 0;
        const speedDiff = p2Speed - p1Speed;

        //Calculating the current distance between the two players
        const p1Points = ranker.points;
        const p2Points = ranker2.points;
        const pointsDiff = p2Points - p1Points;

        const timeLeftInSeconds = solveQuadratic(
            accelerationDiff / 2,
            speedDiff,
            pointsDiff
        );
        return timeLeftInSeconds;
    }

    function timeToPoints(ranker, points) {
        //To calculate the time to reach a certain point, we pretend to ty to catch up to a ranker that is not growing and has the exact points we want to reach
        const accelerationDiff = -getAcceleration(ranker);
        const speedDiff = ranker.growing ? -ranker.power : 0;
        const p1Points = ranker.points;
        const p2Points = points;
        const pointsDiff = p2Points - p1Points;

        const timeLeftInSeconds = solveQuadratic(
            accelerationDiff,
            speedDiff,
            pointsDiff
        );
        return timeLeftInSeconds;
    }

    function timeToRank(ladder, ranker, rank) {
        const allRankers = ladder.rankers;
        for (let i = 0; i < allRankers.length; i++) {
            if (allRankers[i].rank === rank) {
                return timeToRanker(ranker, allRankers[i]);
            }
        }
    }

    function timeToFirst(ladder, ranker) {
        const etaRequirement = timeToPoints(ranker, ladder.stats.pointsNeededForManualPromote);

        // We are already first place. So we only need to reach the promotion limit.
        if (ranker.rank === 1) {
            return etaRequirement;
        }

        // We need to reach the promotion limit and the first place, so we take the max.
        return Math.max(etaRequirement, timeToRank(ladder, ranker, 1));
    }

    // Returns a ranker's acceleration
    function getAcceleration(ranker) {
        if (!ranker.growing || ranker.rank === 1) {
            return 0;
        }
        return (ranker.bias + ranker.rank - 1) * ranker.multi;
    }

    function sleep(ms) {
        return new Promise(resolve=>setTimeout(resolve, ms))
    }

    // Solves quadratic formula and returns minimal positive solution or Infinity
    function solveQuadratic(a, b, c) {
        if (a === 0) {
            const solution = -c / b;
            return solution >= 0 ? solution : Infinity;
        }
        let discriminant = b ** 2 - 4 * a * c;
        if (discriminant < 0) {
            return Infinity;
        }
        discriminant = Math.sqrt(discriminant);
        const root1 = (-b + discriminant) / (2 * a);
        const root2 = (-b - discriminant) / (2 * a);
        if (root1 > 0 && root2 > 0) {
            return Math.min(root1, root2);
        }
        const maxRoot = Math.max(root1, root2);
        if (maxRoot < 0) {
            return Infinity;
        }
        return maxRoot;
    }

    // Solves displacement where u is the initial velocity, a is the acceleration, and t is time.
    function solveDisplacement(u, a, t) {
        return u * t + 0.5*a*t**2
    }

    // Converts duration in seconds to "7m 08s" display or "00h 07m 08s" depending on longVersion
    function secondsToHms(duration,longVersion) {
        duration = Math.ceil(Number(duration));

        if (!isFinite(duration)) {
            return "Never";
        }
        else if (duration === 0) {
            if (longVersion) {
                return "00h 00m 00s ";
            }
            else {
                return "0s";
            }
        }

        const h = Math.floor(duration / 3600);
        const m = Math.floor(duration % 3600 / 60);
        const s = Math.floor(duration % 3600 % 60);

        let hDisplay = "";
        let mDisplay = "";
        let sDisplay = "";

        if (longVersion) {
            hDisplay = String(h).padStart(2, "0") + "h ";
            mDisplay = String(m).padStart(2, "0") + "m ";
            sDisplay = String(s).padStart(2, "0") + "s ";
        }
        else {
            hDisplay = h > 0 ? h + "h" : "";
            mDisplay = h > 0 ? " " + String(m).padStart(2, "0") + "m" : m > 0 ? m + "m" : "";
            sDisplay = (h > 0 || m > 0) ? " " + String(s).padStart(2, "0") + "s" : s > 0 ? s + "s" : "";
        }

        return hDisplay + mDisplay + sDisplay;
    }

    function simulateBias(ladderData, ranker) {
        // Variables
        let simulatedLadderData = JSON.parse(JSON.stringify(ladderData));
        const myID = ranker.accountId;

        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].points = 0;
        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].bias += 1;
        timsort.sort(simulatedLadderData.rankers, (a, b) => b.points - a.points);
        simulatedLadderData.rankers.forEach((ranker, index) => {
            ranker.rank = index + 1;
        });

        return simulatedLadderData;
    }

    function simulateMulti(ladderData, ranker) {
        // Variables
        let simulatedLadderData = JSON.parse(JSON.stringify(ladderData));
        const myID = ranker.accountId;

        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].points = 0;
        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].bias = 0;
        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].power = 0;
        simulatedLadderData.rankers.filter(x => x.accountId == myID)[0].multi += 1;
        timsort.sort(simulatedLadderData.rankers, (a, b) => b.points - a.points);
        simulatedLadderData.rankers.forEach((ranker, index) => {
            ranker.rank = index + 1;
        });

        return simulatedLadderData;
    }

    function nextUpgradeCost(ladder, currentUpgrade) {
        // https://github.com/TheExkaliburg/MoreFair/blob/develop/backend/src/main/java/de/kaliburg/morefair/game/UpgradeUtils.java
        if (ladder.types.includes("CHEAP")) {
            return Math.pow((ladder.number * 0.8) + 1, (currentUpgrade - 1) + 1) * 0.5;
        }
        if (ladder.types.includes("EXPENSIVE")) {
            return Math.pow((ladder.number * 1.2) + 1, (currentUpgrade + 1) + 1) * 1.5;
        }
        return Math.pow(ladder.number + 1, currentUpgrade + 1)

    }

    function nextBiasCost(ladder) {
        return nextUpgradeCost(ladder, ladder.rankers.find(ranker => ranker.you).bias);
    }

    function nextMultiCost(ladder) {
        return nextUpgradeCost(ladder, ladder.rankers.find(ranker => ranker.you).multi);
    }

    // Add multiple options for people in #1 and can promote; autopromote, manual, wall, and maybe a chance for each.
    // Simulate grapes gain
    function simulateTicks(rankers, ticks = 1) {
        if (ticks === 0) return rankers;
        rankers = JSON.parse(JSON.stringify(rankers));

        for (let i = 0; i < ticks; i++) {
            const len = rankers.length;
            for (let j = 0; j < len; j++) {
                const ranker = rankers[j];
                if (!ranker.growing) {
                    continue;
                }
                ranker.power += getAcceleration(ranker);
                ranker.points += ranker.power;
                // Assume rank 1 always autopromotes
                // TODO: include 30s wait
                // TODO: remove reference to basePointsToPromote, as it currently uses old value and always includes 30s wait
                // TODO: pass in ladder instead of rankers to get basePointsToPromote
                // We make sure to let you keep growing, otherwise it breaks other scripts due to waiting for you to keep growing
                if (j === 0 && ranker.points >= state.ladder.basePointsToPromote && !ranker.you) {
                    // comment out to use worst case scenario
                    ranker.growing = false;
                }
            }

            if (!Array.isArray(rankers)) console.log(rankers)
            timsort.sort(rankers, (a, b) => b.points - a.points);

            for (let j = 0; j < rankers.length; j++) {
                rankers[j].rank = j + 1;
            }
        }

        return rankers;
    }

    function simulateUntil(condition, ladder) {
        const goodAccuracy = 24 * 60 * 60;
        ladder = JSON.parse(JSON.stringify(ladder))
        let time = goodAccuracy;
        while (time > 0 && !condition(ladder)) {
            ladder.rankers = simulateTicks(ladder.rankers, 1);
            time -= 1;
        }
        return {
            timeTaken: time === 0 ? Infinity : goodAccuracy-time,
            ladder
        };
    }

    function simulateUntilBias(ladder, fast) {
        ladder = JSON.parse(JSON.stringify(ladder));
        let preSimLadder = JSON.parse(JSON.stringify(ladder));

        // See: simulateTicks
        // Make sure you keep growing - otherwise calculations will return Infinity.
        if (!ladder.rankers[0].you && ladder.rankers[0].points >= ladder.basePointsToPromote) ladder.rankers[0].growing = false;

        const goodAccuracy = fast
        ? 6 * 60 * 60
        : 30 * 60;
        let end = goodAccuracy;
        let bestTimeForBias = Infinity;
        let bestTimeForPromote = Infinity;
        let bestTimeForCurrent = Infinity;
        let beforeBiasLadder = ladder;
        let afterBiasRankers = ladder;
        let leastAmountOfPromotions = Infinity;

        let t1 = performance.now();

        // Simulate until next bias
        let current = simulateUntil(currLadder => currLadder.rankers.find(ranker => ranker.you).points >= nextBiasCost(currLadder), ladder);
        ladder.rankers = current.ladder.rankers;
        const extraTime = current.timeTaken;

        // Loop through biasing every interval, each time checking if it's the best time to bias compared to other ones
        const timeInterval = fast ? 20 : 60
        for (let time = 0; time < end; time += timeInterval) {
            let preBiasLadder = JSON.parse(JSON.stringify(ladder));
            let biasedLadder = simulateBias(ladder, ladder.rankers.find(ranker => ranker.you));

            if (fast) {
                let current = timeToFirst(biasedLadder, biasedLadder.rankers.find(ranker => ranker.you));

                if (extraTime + time + current < bestTimeForPromote) {
                    bestTimeForCurrent = time;
                    bestTimeForPromote = extraTime + time + current;
                    beforeBiasLadder = preBiasLadder;
                    bestTimeForBias = extraTime + time;
                }
            } else {
                //? Should we be comparing points with promote? This factors in the waiting for promotion once we reach #1, when we could probably seperate this into two sims instead.
                //? This should be the case - find how long it takes to get to #1, and then find how long it takes to promote from there.
                //? We can always split it later.
                let current = simulateUntil(
                    currLadder => currLadder.rankers[0].you && currLadder.rankers[0].points >= currLadder.stats.pointsNeededForManualPromote,
                    biasedLadder
                );

                if (extraTime + time + current.timeTaken < bestTimeForPromote) {
                    afterBiasRankers = current.ladder.rankers;
                    bestTimeForCurrent = time;
                    bestTimeForPromote = extraTime + time + current.timeTaken;
                    beforeBiasLadder = preBiasLadder;
                    bestTimeForBias = extraTime + time;
                }
            }

            ladder.rankers = simulateTicks(ladder.rankers, timeInterval);
        }

        // get accurate data
        if (fast) {
            let biasedLadder = simulateBias(beforeBiasLadder, beforeBiasLadder.rankers.find(ranker => ranker.you));
            let current = simulateUntil(
                currLadder => currLadder.rankers[0].you && currLadder.rankers[0].points >= currLadder.stats.pointsNeededForManualPromote,
                biasedLadder
            );

            bestTimeForPromote = extraTime + bestTimeForCurrent + current.timeTaken;
            bestTimeForBias = extraTime + bestTimeForCurrent;
            afterBiasRankers = current.ladder.rankers;
        }

        let t2 = performance.now();
        //console.log(`Simulated ticks for bias took ${t2 - t1} milliseconds!`)
        // return two objects instead: afterBiasSimulation, beforeBiasSimulation
        // may be confusing though
        // beforeBiasSimulation: { timeTaken: bestTimeForBias, rankers: beforeBiasLadder.rankers }
        // afterBiasSimulation: { timeTaken: bestTimeForPromote, rankers: afterBiasRankers }
        return {
            secondsToPromoteAfterBias: bestTimeForPromote,
            secondsUntilBias: bestTimeForBias,
            beforeBiasLadder,
            afterBiasRankers
        };
    }

    function cloneRanker(ranker) {
        return {
            ...ranker,
            grapes:  parseFloat(ranker.grapes),
            points:  parseFloat(ranker.points),
            power:   parseFloat(ranker.power),
            vinegar: parseFloat(ranker.vinegar),
        }
    }

    function cloneLadder(ladder) {
        return {
            ...ladder,
            basePointsToPromote: parseFloat(ladder.basePointsToPromote),
            stats: {
                ...ladder.stats,
                pointsNeededForManualPromote: parseFloat(ladder.stats.pointsNeededForManualPromote)
            },
            types: [...ladder.types],
            rankers: ladder.rankers.map(cloneRanker),
            yourRanker: cloneRanker(ladder.yourRanker),
        }
    }

    // need to consider pointsNeededForManualPromote so we don't reach #1 too early
    async function updateOptimalWorker(state, averageTickTime) {
        self.importScripts("https://cdn.jsdelivr.net/npm/timsort@0.3.0/build/timsort.min.js");
        self.importScripts("https://cdn.jsdelivr.net/npm/swarm-numberformat@0.4.0/dist/swarm-numberformat.min.js");

        const t1 = performance.now();

        self.state = state;

        const numberFormatter = new numberformat.Formatter({
            format: "hybrid",
            sigfigs: 5,
            flavor: "short",
            minSuffix: 1e6,
            maxSmall: 0,
            default: 0,
        });
        let ladder = state.ladder;
        let rankers = ladder.rankers;
        let yourRanker = ladder.yourRanker;
        let pointsNeededForManualPromote = ladder.stats.pointsNeededForManualPromote;
        let pointsForPromote = Number(state.settings.pointsForPromote);
        let basePointsToPromote = ladder.basePointsToPromote;
        const myID = yourRanker.accountId;

        if (!yourRanker.growing) {
            postMessage({
                newHTML: "On a different ladder!",
                shouldBias: false,
                shouldMulti: false,
                playBoom: false,
            });
            return;
        }

        // TODO: add option to maximize grapes
        // TODO: include sim with same bias
        let multiLadder = simulateMulti(ladder, yourRanker);

        const waitTillPromote = currLadder => currLadder.rankers[0].you && currLadder.rankers[0].points >= currLadder.stats.pointsNeededForManualPromote;
        let { secondsToPromoteAfterBias, secondsUntilBias, beforeBiasLadder, afterBiasRankers } = simulateUntilBias(ladder, true);
        let multiSimulation = simulateUntil(waitTillPromote, multiLadder);
        let currentSimulation = simulateUntil(waitTillPromote, JSON.parse(JSON.stringify(ladder)));

        // account for 30s wait before manual promote
        afterBiasRankers = simulateTicks(afterBiasRankers, 30);
        multiSimulation.ladder.rankers = simulateTicks(multiSimulation.ladder.rankers, 30);
        currentSimulation.ladder.rankers = simulateTicks(currentSimulation.ladder.rankers, 30);

        let biasTimeToPromote = Math.ceil((secondsToPromoteAfterBias + 30) / averageTickTime) * averageTickTime;
        let multiTimeToPromote = Math.ceil((multiSimulation.timeTaken + 30) / averageTickTime) * averageTickTime;
        let currentTimetoPromote = Math.ceil((currentSimulation.timeTaken + 30) / averageTickTime) * averageTickTime;

        // We aren't using Math.max(basePointsToPromote, pointsNeededForManualPromote) because if we are first, we don't need pointsNeededForManualPromote.
        let ableToManualPromoteAfterBias = afterBiasRankers.find(ranker => ranker.you).points >= basePointsToPromote;
        let ableToManualPromoteAfterMulti = multiSimulation.ladder.rankers.find(ranker => ranker.you).points >= basePointsToPromote;
        let ableToManualPromoteNow = currentSimulation.ladder.rankers.find(ranker => ranker.you).points >= basePointsToPromote;

        const biasNewPromotes = afterBiasRankers.filter(ranker => !ranker.growing).length;
        const multiNewPromotes = multiSimulation.ladder.rankers.filter(ranker => !ranker.growing).length;
        const currentPromotes = currentSimulation.ladder.rankers.filter(ranker => !ranker.growing).length;

        // can't promote with less than 10 rankers, not sure whether to include
        let shouldMulti =
            rankers.length >= 10 &&
            multiTimeToPromote < currentTimetoPromote &&
            ableToManualPromoteAfterMulti &&
            yourRanker.power > nextMultiCost(ladder);

        let shouldBias = rankers.length >= 10 &&
            secondsUntilBias === 0 &&
            biasTimeToPromote < currentTimetoPromote &&
            ableToManualPromoteAfterBias &&
            yourRanker.points > nextBiasCost(ladder) &&
            // We should always multi before bias
            !shouldMulti;

        let shouldBuyAutoPromote = rankers[rankers.length - 1].you &&
            !currentSimulation.ladder.rankers.find(ranker => ranker.you).autoPromote;

        let playBoom = shouldBias || shouldMulti || shouldBuyAutoPromote;

        postMessage({
            newHTML: `
        Round Base Point Requirement: ${numberFormatter.formatShort(pointsForPromote)}<br>
        Ladder Base Point Requirement: ${numberFormatter.formatShort(pointsNeededForManualPromote)}<br>
        Best Bias Timer: ~${secondsUntilBias != 0 ? secondsToHms(secondsUntilBias) : "0s"} (${numberFormatter.formatShort(beforeBiasLadder.rankers.find(ranker => ranker.you).points)} points) ${secondsUntilBias === 0 ? "🟩" : "🟥"}<br>
        Time to Promote Incl. Best Bias: ${secondsToHms(Math.floor(biasTimeToPromote))} (${biasNewPromotes + 1}th) ${currentTimetoPromote >= biasTimeToPromote ? "🟩" : "🟥"}<br>
        Time to Promote After Multi: ${secondsToHms(Math.floor(multiTimeToPromote))} (${multiNewPromotes + 1}th) ${currentTimetoPromote >= multiTimeToPromote ? "🟩" : "🟥"}<br>
        Current Time to Promote: ${secondsToHms(Math.floor(currentTimetoPromote))} (${currentPromotes + 1}th)<br>
        Can Promote After Bias: ${numberFormatter.formatShort(afterBiasRankers.find(ranker => ranker.you).points)} points ${ableToManualPromoteAfterBias ? "🟩" : "🟥"}<br>
        Can Promote After Multi: ${numberFormatter.formatShort(multiSimulation.ladder.rankers.find(ranker => ranker.you).points)} points ${ableToManualPromoteAfterMulti ? "🟩" : "🟥"}<br>
        Can Promote Now: ${numberFormatter.formatShort(currentSimulation.ladder.rankers.find(ranker => ranker.you).points)} points ${ableToManualPromoteNow ? "🟩" : "🟥"}<br>
        Ranker Count Ten Or Above: ${rankers.length >= 10 ? "🟩" : "🟥"}<br>
        Average Tick Time: ${averageTickTime}<br>
        Update took: ${Math.floor(performance.now() - t1) / 1000}s`,
            shouldBias,
            shouldMulti,
            shouldBuyAutoPromote,
            playBoom,
        })
        // Should Bias: ${secondsUntilBias === 0 && currentTimetoPromote >= biasTimeToPromote && ableToManualPromoteAfterBias ? "🟩" : "🟥"}<br>
        // Should Multi: ${currentTimetoPromote >= multiTimeToPromote && ableToManualPromoteAfterMulti ? "🟩" : "🟥"}<br>
    }

    unsafeWindow.FlyWorker = FlyWorker;
    unsafeWindow.timsort = timsort;
    unsafeWindow.updateOptimalWorker = updateOptimalWorker;

    let boom = new Audio("https://www.myinstants.com/media/sounds/vine-boom.mp3")

    let waitTicks = 0;

    let averageTickTime = 1.0;
    let tickTimes = [];
    const ticksToCount = 10;

    await sleep(2000);

    Fair.register(e => unsafeWindow.store = e);

    const worker = new FlyWorker();

    const functionList = [
        timeToRanker, timeToPoints, timeToRank, timeToFirst, getAcceleration, sleep, solveQuadratic, solveDisplacement, secondsToHms,
        simulateBias, simulateMulti, nextBiasCost, nextMultiCost, simulateTicks, simulateUntil, simulateUntilBias, nextUpgradeCost,
        cloneRanker, cloneLadder
    ]

    functionList.forEach(el => unsafeWindow[el.name] = el);

    store.subscribeToHook("onTick", async function(e) {
        //if (document.hidden) return;

        tickTimes.push(e.delta.toNumber());
        if (tickTimes.length > ticksToCount) {
            tickTimes.shift();
        }
        averageTickTime = tickTimes.reduce((a, b) => a + b) / tickTimes.length;

        const { newHTML, playBoom, shouldBias, shouldMulti, shouldBuyAutoPromote } = await worker.exec(
            updateOptimalWorker,
            functionList,
            JSON.parse(JSON.stringify({
                ...store.state,
                ladder: cloneLadder(store.state.ladder),
            })),
            averageTickTime
        );

        document.querySelector(".col-6:nth-child(2)").innerHTML = newHTML;
        document.querySelector(".col-6:nth-child(2)").style.overflowY = "auto";
        document.querySelector(".col-6:nth-child(2)").style.height = "100%";
        //https://tailwindcss.com/docs/customizing-colors
        document.querySelectorAll('.btn.btn-outline-primary.shadow-none.w-100')[0].style.backgroundColor = shouldMulti ? "#14532d" : "#7f1d1d";
        document.querySelectorAll('.btn.btn-outline-primary.shadow-none.w-100')[1].style.backgroundColor = shouldBias ? "#14532d" : "#7f1d1d";
        document.querySelectorAll(".btn.btn-outline-primary.shadow-none.w-100")[2].style.backgroundColor = shouldBuyAutoPromote ? "#14532d" : "#7f1d1d";
        if (playBoom) {
            boom.play();
        }
        if (playBoom) {
            document.title = "!! More Fair Game !!";
        } else {
            document.title = "More Fair Game";
        };
    })

    // bit cheaty
    unsafeWindow.confirm = function() {
        return true;
    }
})();