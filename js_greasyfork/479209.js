// ==UserScript==
// @name         DFProfiler Path Finder
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Find the fastest path in DFProfiler
// @author       Runonstof
// @match        https://*.dfprofiler.com/bossmap
// @match        https://*.dfprofiler.com/profile/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dfprofiler.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479209/DFProfiler%20Path%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/479209/DFProfiler%20Path%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Utility functions ===

    function GM_addStyle(css) {
        var style = document.getElementById("GM_addStyleBy8626") || (function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        var sheet = style.sheet;

        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function GM_addStyle_object(selector, styles) {
        var css = selector + "{";
        for (var key in styles) {
            css += key + ":" + styles[key] + ";";
        }
        css += "}";
        GM_addStyle(css);
    }


    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function AStar(emptyCells) {
        this.emptyCells == emptyCells || [];

        this.Node = function Node(x, y) {
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.g = 0; // cost from start node
            this.h = 0; // heuristic (estimated cost to target)
            this.f = 0; // total cost (g + h)
            this.parent = null;

            this.withoutParent = function () {
                var node = new Node(this.x, this.y);
                node.g = this.g;
                node.h = this.h;
                node.f = this.f;
                return node;
            }
        }

        this.isInsideMap = function(x, y) {
            return x >= 1000 && x <= 1058 && y >= 981 && y <= 1035;
        };

        this.isCellEmpty = function(x, y) {
            return emptyCells.some(function(cell) {
                return cell.x == x && cell.y == y;
            });
        };

        this.heuristic = function(node, target) {
            var dx = Math.abs(node.x - target.x);
            var dy = Math.abs(node.y - target.y);
            var diagonalSteps = Math.min(dx, dy);
            var straightSteps = Math.abs(dx - dy);

            return (1.2 * diagonalSteps) + straightSteps;
        }

        this.find = function(startPos, endPos) {
            var openList = [];
            var closedList = [];

            var startNode = new this.Node(startPos.x, startPos.y);
            var endNode = new this.Node(endPos.x, endPos.y);

            var diagonalCost = 1.2;
            var neighbors = [
                { x: 1, y: 0 },  // Right
                { x: -1, y: 0 }, // Left
                { x: 0, y: 1 },  // Down
                { x: 0, y: -1 }, // Up
                { x: 1, y: 1 },  // Diagonal down-right
                { x: -1, y: -1 },// Diagonal up-left
                { x: 1, y: -1 }, // Diagonal up-right
                { x: -1, y: 1 },   // Diagonal down-left
            ];

            openList.push(startNode);

            while (openList.length > 0) {
                var currentNode = openList[0];
                var currentIndex = 0;

                for (var i = 1; i < openList.length; i++) {
                    if (openList[i].f < currentNode.f) {
                        currentNode = openList[i];
                        currentIndex = i;
                    }
                }

                openList.splice(currentIndex, 1);
                closedList.push(currentNode);

                if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
                    var path = [];
                    var current = currentNode;
                    while (current !== null) {
                        path.push(current.withoutParent());
                        current = current.parent;
                    }
                    return path.reverse();
                }


                for (var neighbourIndex in neighbors) {
                    var neighborDelta = neighbors[neighbourIndex];
                    var neighborX = currentNode.x + neighborDelta.x;
                    var neighborY = currentNode.y + neighborDelta.y;

                    if (!this.isInsideMap(neighborX, neighborY) || this.isCellEmpty(neighborX, neighborY)) {
                        // console.log('cell is empty or outside map:', neighborX, neighborY);
                        continue;
                    }

                    var neighborNode = new this.Node(neighborX, neighborY);

                    var checkNeighbor = function(node) {
                        return node.x === neighborX && node.y === neighborY;
                    };

                    if (closedList.some(checkNeighbor)) {
                        continue;
                    }

                    var movementCost = 1;

                    if (neighborDelta.x != 0 && neighborDelta.y != 0) {
                        movementCost = diagonalCost;
                    }
                    //     movementCost = diagonalCost;
                    //     // // console.log('diagonal');
                    //     // // movementCost = diagonalCost;=
                    //     // // This is a diagonal movement
                    //     // if (this.isCellEmpty(currentNode.x + neighborDelta.x, currentNode.y) ||
                    //     //     this.isCellEmpty(currentNode.x, currentNode.y + neighborDelta.y)) {
                    //     //     // Increase diagonal cost if there is an adjacent empty cell
                    //     //     movementCost = 1.50; // You can adjust this value based on your preference
                    //     // } else {
                    //     //     movementCost = 1;
                    //     // }

                    // }

                    var tentativeG = currentNode.g + movementCost; // Assuming each step costs 1

                    if (!openList.some(checkNeighbor) || tentativeG < neighborNode.g) {
                        neighborNode.g = tentativeG;
                        neighborNode.h = this.heuristic(neighborNode, endNode);
                        neighborNode.f = neighborNode.g + neighborNode.h;
                        neighborNode.parent = currentNode;

                        if (!openList.some(checkNeighbor)) {
                            openList.push(neighborNode);
                        }
                    }
                }
            }

            // console.log(closedList);

            return null; // No path found
        }
    }

    // formats ms to hh:mm:ss
    function formatTime(ms) {
        var seconds = Math.floor(ms / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);

        seconds -= minutes * 60;
        minutes -= hours * 60;

        var time = '';
        if (hours > 0) {
            time += hours + 'h ';
        }
        if (minutes > 0) {
            time += minutes + 'm ';
        }
        if (seconds > 0) {
            time += seconds + 's';
        }

        return time;
    }

    // === CSS styles ===

    GM_addStyle_object('#boss-data-section #mission-info, #bossmap-page #mission-info', {
        'border-radius': '25px 25px 0 0',
    });
    GM_addStyle_object('#boss-data-section #mission-info-distance-viewer, #bossmap-page #mission-info-distance-viewer', {
        'position': 'absolute !important',
        'background-color': 'hsla(0,0%,5%,.8)',
        'border-radius': '0 0 25px 25px',
        'padding': '5px',
        'top': '770px',
        'left': 'calc(50% - 16pt * 20)',
        'right': 'calc(50% - 16pt * 20)',
    });

    GM_addStyle_object('#boss-data-section #mission-info-buttons-title, #bossmap-page #mission-info-buttons-title', {
        'color': 'white',
        'font-size': '20px',
    });
    // GM_addStyle_object('#boss-data-section #mission-info-buttons-subtitle, #bossmap-page #mission-info-buttons-subtitle', {
    //     'color': 'white',
    //     'font-size': '14px',
    // });
    GM_addStyle_object('#boss-data-section button.mission-info-button, #bossmap-page button.mission-info-button', {
        'background-color': 'gray',
        'color': 'black',
        'padding': '0.25em 0.5em',
    });
    GM_addStyle_object('#boss-data-section button.mission-info-button:hover, #bossmap-page button.mission-info-button:hover', {
        'color': 'white',
    });
    GM_addStyle_object('#boss-data-section .dist-buttons, #bossmap-page .dist-buttons', {
        'display': 'flex',
        'gap': '10px',
        'justify-content': 'center',
        'margin-bottom': '10px',
        'align-items': 'center',
    });
    GM_addStyle_object('#boss-data-section td.coord.path, #bossmap-page td.coord.path', {
        'background-color': 'yellow !important',
        'color': 'black !important',
    });

    // GM_addStyle_object('#coord-hover-tooltip', {
    //     'position': 'absolute',
    //     'background-color': 'hsla(0,0%,5%,.8)',
    //     'border-radius': '5px',
    //     'padding': '5px',
    // });


    ready(function () {

        // === Create Elements ===
        var missionHolder = document.getElementById('mission-holder');

        var container = document.createElement('div');
        container.id = 'mission-info-distance-viewer';

        container.innerHTML = '<div id="mission-info-buttons-title">Path finder</div>';
        container.innerHTML += '<div class="dist-buttons"><button id="dist-clear" style="display: none;" class="mission-info-button">Clear path</button></div>';
        container.innerHTML += '<div class="dist-buttons"><button id="dist-set-start" class="mission-info-button">Set path start</button><button id="dist-set-end" class="mission-info-button">Set path end</button></div>';
        container.innerHTML += '<div class="dist-buttons" style="display:none;">Player navigation: <button id="dist-set-goal" class="mission-info-button">Set path goal</button></div>';

        missionHolder.appendChild(container);

        var mapTopInfo = document.createElement('div');
        mapTopInfo.id = 'map-top-info';
        mapTopInfo.innerHTML = '<div id="mission-info-buttons-subtitle">No path selected, click on a cell to set a start and end point</div>';

        var bossTable = document.querySelector('#boss-table');
        if (bossTable.previousElementSibling) {
            bossTable.previousElementSibling.insertAdjacentElement('afterend', mapTopInfo);
        } else {
            bossTable.insertAdjacentElement('beforebegin', mapTopInfo);
        }

        // var tooltip = document.createElement('div');
        // tooltip.id = 'coord-hover-tooltip';
        // tooltip.style.display = 'none';

        // unsafeWindow.document.body.appendChild(tooltip);

        // function showTooltip(event, info) {
        //     tooltip.style.display = 'block';
        //     tooltip.style.position = 'absolute';
        //     // muose position
        //     tooltip.style.top = event.pageY + 10 + 'px';
        //     tooltip.style.left = event.pageX + 10 + 'px';
        //     tooltip.innerHTML = info;
        // }

        // function hideTooltip() {
        //     tooltip.style.display = 'none';
        // }


        unsafeWindow.closeMissionHolder = function (event) {
            if (event.target.closest('#mission-info-distance-viewer')) return;

            missionHolder.style.display = 'none';
        };

        missionHolder.setAttribute('onclick', 'closeMissionHolder(event)');

        var startCellButton = document.getElementById('dist-set-start');
        var endCellButton = document.getElementById('dist-set-end');
        var clearPathButton = document.getElementById('dist-clear');
        var setGoalButton = document.getElementById('dist-set-goal');

        var subtitle = document.getElementById('mission-info-buttons-subtitle');

        // === Scan empty cells

        var emptyCells = Array.from(document.querySelectorAll('td.coord'))
            .filter(function (el) {
                return el.computedStyleMap().get('opacity').toString() == '0';
            })
            .map(function (el) {
                return {
                    x: el.classList[1].replace('x', ''),
                    y: el.classList[2].replace('y', ''),
                };
            });

        var startCell = null;
        var endCell = null;

        var trackingGps = false;
        var lastTrackTime = null;
        var lastRemainingCellCount = 0;


        var pathFinder = new AStar(emptyCells);
        function maybeUpdatePath() {
            if (!startCell || !endCell) return false;

            var path = pathFinder.find(startCell, endCell);

            // Clear existing path cells
            var pathCells = unsafeWindow.document.querySelectorAll('td.coord.path');
            for (var i = 0; i < pathCells.length; i++) {
                pathCells[i].classList.remove('path');
                delete pathCells[i].dataset.distanceDebug;
                delete pathCells[i].dataset.distanceIndex;
                // pathCells[i].onmouseover = null;
            }

            // console.log(path);
            if (!path) return false;

            for(var i = 0; i < path.length; i++) {
                var cellCoord = path[i];
                // console.log(cellCoord);
                var cell = unsafeWindow.document.querySelector('td.coord.x' + cellCoord.x + '.y' + cellCoord.y);
                cell.classList.add('path');
                cell.dataset.distanceDebug = JSON.stringify(cellCoord);
                cell.dataset.distanceIndex = i;
                // cell.onmouseover = function(event) {
                //     if (!event.target.dataset.distanceDebug) return;

                //     var info = JSON.parse(event.target.dataset.distanceDebug);
                //     var index = parseInt(event.target.dataset.distanceIndex) + 1;
                //     showTooltip(event, 'Index: ' + index + '<br>Cell: ' + info.x + 'x' + info.y + '<br>Total cost: ' + info.g + '<br>Heuristic: ' + info.h + '<br>Total: ' + info.f);
                // };
            }
            clearPathButton.style.display = 'initial';

            subtitle.innerHTML = 'Path length: ' + path.length + ' cells';
            if (trackingGps) {
                subtitle.innerHTML += ' (tracking player)';

                // subtitle.innerHTML += '<br>' + (lastTrackTime === null ? 'Start walking to see estimated time' : 'Estimated time: ');
                subtitle.innerHTML += '<br>';

                if (lastTrackTime === null) {
                    subtitle.innerHTML += 'Start walking to see estimated time';
                } else {
                    var now = new Date().getTime();
                    var timeDiff = now - lastTrackTime;
                    var cellsTraveled = Math.abs(lastRemainingCellCount - path.length);

                    var timeRemaining;
                    if (!cellsTraveled) {
                        timeRemaining = 'Unknown';
                    } else {
                        var timePerCell = timeDiff / cellsTraveled;
                        timeRemaining = formatTime(timePerCell * path.length);
                    }

                    subtitle.innerHTML += 'Estimated time remaining: ' + timeRemaining;
                    subtitle.innerHTML += '<br>Cells traveled: ' + cellsTraveled;
                    subtitle.innerHTML += '<br>Time passed: ' + formatTime(timeDiff);
                }
            }
            return true;
        }

        var playerCoords = null;
        var playerCell = unsafeWindow.document.querySelector('td.playerlocation');

        if (playerCell) {
            playerCoords = [
                playerCell.classList[1].replace('x', ''),
                playerCell.classList[2].replace('y', ''),
            ];
        }


        startCellButton.onclick = function () {
            // current pos
            var img = unsafeWindow.document.querySelector('#mission-info img');
            var matches = img.src.match(/Fairview_(\d+)x(\d+)/);
            var x = matches[1];
            var y = matches[2];
            trackingGps = false;
            lastTrackTime = null;

            startCell = { x: x, y: y };

            unsafeWindow.document.querySelector('td.coord.x' + x + '.y' + y).classList.add('path');

            missionHolder.style.display = 'none';
            maybeUpdatePath();
        };

        endCellButton.onclick = function () {
            // current pos
            var img = document.querySelector('#mission-info img');
            var matches = img.src.match(/Fairview_(\d+)x(\d+)/);
            var x = matches[1];
            var y = matches[2];

            endCell = { x: x, y: y };

            unsafeWindow.document.querySelector('td.coord.x' + x + '.y' + y).classList.add('path');

            missionHolder.style.display = 'none';
            maybeUpdatePath();
        };

        clearPathButton.onclick = function () {
            startCell = null;
            endCell = null;
            trackingGps = false;
            lastTrackTime = null;

            clearPathButton.style.display = 'none';

            // Clear existing path cells
            var pathCells = unsafeWindow.document.querySelectorAll('td.coord.path');
            for (var i = 0; i < pathCells.length; i++) {
                pathCells[i].classList.remove('path');
            }

            subtitle.innerHTML = 'No path selected, click on a cell to set a start and end point';
            missionHolder.style.display = 'none';
        };

        var updatePlayerTrackPath = function () {
            if (!trackingGps) return;

            var playerCell = unsafeWindow.document.querySelector('td.playerlocation');
            if (!playerCell) {
                setTimeout(updatePlayerTrackPath, 7500);
                return;
            };


            playerCoords = [
                playerCell.classList[1].replace('x', ''),
                playerCell.classList[2].replace('y', ''),
            ];

            startCell = { x: playerCoords[0], y: playerCoords[1] };

            maybeUpdatePath();

            setTimeout(updatePlayerTrackPath, 7500);
        };


        setGoalButton.onclick = function () {
            trackingGps = true;
            missionHolder.style.display = 'none';

            // current pos
            var img = document.querySelector('#mission-info img');
            var matches = img.src.match(/Fairview_(\d+)x(\d+)/);
            var x = matches[1];
            var y = matches[2];

            endCell = { x: x, y: y };

            if (playerCoords) {
                startCell = { x: playerCoords[0], y: playerCoords[1] };
            } else {
                startCell = { x: x, y: y };
            }

            unsafeWindow.document.querySelector('td.coord.x' + x + '.y' + y).classList.add('path');
            var result = maybeUpdatePath();
            if (!result) {
                trackingGps = false;
                return;
            }

            lastTrackTime = new Date().getTime();
            lastRemainingCellCount = pathFinder.find(startCell, endCell).length;
            updatePlayerTrackPath();
        };


        $(unsafeWindow.document).ajaxComplete(function(event, jqXHR, ajaxOptions) {
            console.log('ajaxComplete', ajaxOptions.url)
            if (ajaxOptions.url.indexOf('/profile/json/') == -1) return;
            setGoalButton.parentElement.style.display = 'initial';
            playerCoords = jqXHR.responseJSON.gpscoords;

            // if (!trackingGps) return;
            // startCell = { x: coords[0], y: coords[1] };
            // maybeUpdatePath();
        });
    });
})();
