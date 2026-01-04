// ==UserScript==
// @name         LOTRO Wiki - Shortest Path Between Map Points
// @namespace    http://tampermonkey.net/
// @version      2024-09-16u3
// @description  Calculates and draws an overlay of the shortest path between points on a map page in the LOTRO Wiki (e.g. for doing explorer deeds)
// @author       Morde
// @match        https://lotro-wiki.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lotro-wiki.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508750/LOTRO%20Wiki%20-%20Shortest%20Path%20Between%20Map%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/508750/LOTRO%20Wiki%20-%20Shortest%20Path%20Between%20Map%20Points.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Wait until the map has loaded
    var interval = setInterval(() => {
        if (document.getElementById("mw-content-text")) return;

        // We have to check like this because the map page can be navigated to via a frontend router
        // (e.g. when clicking a coordinate link), so the URL can change without a page load actually happening
        var expectedNumPoints = window.location.href
        .matchAll(/(\d+\.\d+(?:S|N),\d+\.\d+(?:W|E))/g)
        .toArray().length;

        if (!expectedNumPoints) return;

        var container = document.querySelector("#content > div");

        if (!container) return;

        var points = Array.from(
            document.querySelectorAll("#content > div > img[style]")
        ).map((ele) => ({
            x:
            (Number(ele.style.left.slice(0, -1)) / 100) *
            Number(container.attributes.width.value),
            y:
            (Number(ele.style.top.slice(0, -1)) / 100) *
            Number(container.attributes.height.value),
        }));

        console.log(expectedNumPoints);

        if (points.length != expectedNumPoints) return;

        clearInterval(interval);

        var weights = {};

        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < points.length; j++) {
                if (i == j) continue;

                if (!weights[i]) weights[i] = {};

                weights[i][j] =
                    ((points[i].x - points[j].x) ** 2 +
                     (points[i].y - points[j].y) ** 2) **
                    0.5;
            }
        }

        console.table(weights);

        // Find a tentative permutation with the lowest sum of weight transitions
        var candidate = getBestCandidate(weights);

        drawBetweenPoints(candidate.chain, points, container);
    }, 100);

    function getBestCandidate(weights) {
        var numWeights = Object.keys(weights).length;

        var results = [];

        var start = new Date();

        for (var i = 0; i < numWeights; i++) results.push(getCandidate(weights, i));

        // filter out duplicates
        results = Object.values(
            results.reduce((acc, x) => {
                acc[x.chain.join(",")] = x;
                return acc;
            }, {})
        );

        results.sort((a, b) => a.distance - b.distance);

        console.table(results);

        var bestChain = results[0].chain;
        var bestDist = results[0].distance;

        console.log("Improving...");

        results = results.slice(0, Math.ceil(results.length / 2)); // check the more promising-looking half

        results.forEach(({ chain, distance }) => {
            var origDist = distance;
            var { chain, distance } = improveCandidate(
                chain,
                distance,
                weights,
                true
            );

            if (distance < bestDist) {
                console.log({ origDist, distance });
                bestChain = chain;
                bestDist = distance;
            }
        });

        var { chain, distance } = finalizeCandidate(bestChain, bestDist, weights);
        bestChain = chain;
        bestDist = distance;

        var elapsed = new Date() - start;
        console.log(`Took ${elapsed / 1000}s`);

        console.log(bestDist);

        return { chain: bestChain, distance: bestDist };
    }

    function getCandidate(weights, current) {
        var chain = [current];
        var used = new Set(chain);
        var numWeights = Object.keys(weights).length;
        var distance = 0;

        while (chain.length < numWeights) {
            var entries = Object.entries(weights[current]).map(([key, value]) => [
                Number(key),
                value,
            ]);
            var options = entries.filter(([key, value]) => !used.has(key));

            var [key, value] = options.reduce(
                ([bestKey, bestValue], [key, value]) => {
                    return value < bestValue ? [key, value] : [bestKey, bestValue];
                },
                [-1, Number.POSITIVE_INFINITY]
            );

            if (key < 0) break;

            used.add(key);
            chain.push(key);
            distance += value;

            current = key;
        }

        return improveCandidate(chain, distance, weights);
    }

    function improveCandidate(chain, distance, weights, double = false) {
        var improved = true;

        while (improved) {
            improved = false;

            var bestChain = chain;
            var bestDist = distance;

            for (var i0 = 0; i0 < chain.length; i0++) {
                // Try all possible variations where chain[i0] is moved to other parts of the chain
                for (var j0 = 0; j0 <= chain.length; j0++) {
                    if (i0 == j0) continue;

                    var testChain0 = chain.slice();
                    var value = testChain0[i0];
                    var offset = i0 < j0 ? -1 : 0;

                    testChain0.splice(i0, 1);
                    testChain0.splice(j0 + offset, 0, value);

                    if (!double) {
                        var testDist = getDistance(testChain0, weights);
                        if (testDist < bestDist) {
                            bestChain = testChain0;
                            bestDist = testDist;
                            improved = true;
                        }
                    } else {
                        // Try moving another part of the chain at the same time
                        for (var i1 = 0; i1 < chain.length; i1++) {
                            // Try all possible variations where chain[i1] is moved to other parts of the chain
                            for (var j1 = 0; j1 <= chain.length; j1++) {
                                var testChain1 = testChain0.slice();
                                if (i1 != j1) {
                                    value = testChain1[i1];
                                    offset = i1 < j1 ? -1 : 0;

                                    testChain1.splice(i1, 1);
                                    testChain1.splice(j1 + offset, 0, value);
                                }

                                var testDist = getDistance(testChain1, weights);
                                if (testDist < bestDist) {
                                    bestChain = testChain1;
                                    bestDist = testDist;
                                    improved = true;
                                }
                            }
                        }
                    }
                }
            }

            // Save change
            if (improved) {
                chain = bestChain;
                distance = bestDist;
            }
        }

        return { chain, distance };
    }

    function finalizeCandidate(chain, distance, weights) {
        var improved = true;

        while (improved) {
            improved = false;

            var bestChain = chain;
            var bestDist = distance;

            // Try to find a subset reversal that shortens the chain
            for (var i = 0; i < chain.length && !improved; i++) {
                for (var j = i + 1; j < chain.length && !improved; j++) {
                    var testChain = chain.slice();

                    var _i = i;
                    var _j = j;

                    // reverse between i and j
                    while (_i < _j) {
                        var value = testChain[_i];
                        testChain[_i] = testChain[_j];
                        testChain[_j] = value;
                        _i++;
                        _j--;
                    }

                    var testDist = getDistance(testChain, weights);

                    if (testDist < bestDist) {
                        bestChain = testChain;
                        bestDist = testDist;
                        improved = true;
                    }
                }
            }

            // Save change
            if (improved) {
                chain = bestChain;
                distance = bestDist;
            }
        }

        return { chain, distance };
    }

    function getDistance(chain, weights) {
        var result = 0;
        var prev = chain[0];
        for (var i = 1; i < chain.length; i++) {
            var next = chain[i];
            result += weights[prev][next];
            prev = next;
        }
        return result;
    }

    function drawBetweenPoints(indeces, points, container) {
        var prev = indeces[0];

        var imgs = Array.from(
            document.querySelectorAll("#content > div > img[style]")
        );
        console.log(indeces.map((x) => imgs[x]));

        for (var i = 1; i < indeces.length; i++) {
            var next = indeces[i];

            var prevPoint = points[prev];
            var nextPoint = points[next];

            drawFrom(prevPoint, nextPoint, container);

            prev = next;
        }
    }

    function drawFrom(pointA, pointB, container) {
        // Create a div of width=dist(pointA, pointB) at the midpoint between the points, rotated to be the angle between them
        var dist = ((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2) ** 0.5;
        var midX = (pointA.x + pointB.x) / 2 - dist / 2;
        var midY = (pointA.y + pointB.y) / 2;
        var angle =
            (Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI;

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = "3px";
        div.style.left = midX + "px";
        div.style.top = midY + "px";
        div.style.width = dist + "px";
        div.style.rotate = angle + "deg";
        div.style.background = "#0ff";

        container.childNodes[0].after(div);
    }
})();
