// ==UserScript==
// @name         Neggsweeper solver
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  win at neggsweeper (neo-legal)
// @author       You
// @match        http*://www.neopets.com/games/neggsweeper/neggsweeper.phtml
// @grant        none
// @require    http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422569/Neggsweeper%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/422569/Neggsweeper%20solver.meta.js
// ==/UserScript==

/* Known issues:
1. Inner fringe calculations do not take into account the number of mines left in the game. As a result, sometimes mines that are clear may be marked with a percentage
2. Occasionally, a clear mine simply isn't marked at all, being registered as a 1 or 2 on the grid. Still unsure why this happens
*/
(function() {
    // 'use strict';

    var NS_KEY = "nsg"
    var htmlGrid = [];
    var grid = [];
    // map size to mine number
    var modeMap = {
        9: 10,
        12: 25,
        14: 40
    }
    var debugMode = false;
    var DEBUG_KEY = "debuggrid"

    function debugLog(s) {
        debugMode && console.log(s)
    }

    // size based on number of rows
    // TODO: deal with variable columns too
    function getTotalNumberOfMines(grid) {
        return modeMap[grid.length]
    }

    /* UI Components */
    function isUnknown(el) { // tested
        return $(el).find('[src="http://images.neopets.com/x/gn.gif"]').length || $(el).find('[src="//images.neopets.com/x/gn.gif"]').length || $(el).find('[src="https://images.neopets.com/x/gn.gif"]').length;
    }

    function isMarked(el) { // tested
        return $(el).find('[src="http://images.neopets.com/games/neggsweeper/old/flagnegg.gif"]').length;
    }

    function getSurroundingNumber(el) { // tested
        return +($(el).find('b').html() || 0);
    }

    /*
    turns neopets grid into a 2d array. Knowns are filled as numbers, unknowns filled as null
    */
    function parseHtmlGrid() { // tested
        var g = []
        var rows = $($('[name=grid] tbody')[0]).find('tr');

        rows.each(function(r, d) {
            if (r >= 3) {
                var htmlRow = [];
                var row = [];
                $(d).find('td').each(function(i, el) {
                    htmlRow.push(el);
                    if (isUnknown(el) || isMarked(el)) {
                        row.push(null);
                    } else {
                        row.push(getSurroundingNumber(el));
                    }
                });
                htmlGrid.push(htmlRow);
                g.push(row);
            }
        })
        return g;
    }

    function markBad(row, col) { // tested
        $(htmlGrid[row][col]).css('border', '3px solid red');
    }

    function markGood(row, col) { // tested
        $(htmlGrid[row][col]).css('border', '3px solid green');
    }

    function markPercentBad(row, col, p, color) { // tested
        color = color || "red"
        $(htmlGrid[row][col]).append('<font color="' + color + '">' + Math.round(100 * p) + '%</font>');
    }

    function displayGridMarks() { // tested
        for (var r = 0; r < grid.length; ++r) {
            for (var c = 0; c < grid[0].length; ++c) {
                if (grid[r][c]) {
                    if (grid[r][c] === "x") {
                        markBad(r, c);
                    } else if (grid[r][c] === "o") {
                        markGood(r, c);
                    } else if (grid[r][c] > 0 && grid[r][c] < 1) {
                        markPercentBad(r, c, grid[r][c]);
                    }
                }
            }
        }
    }

    function getNumGood() {
      return +$('form[name="grid"]').find('td')[3].innerHTML.match(/\d+/)[0];
    }

    /* Logic components */
    /* Constructor for Coords objects */
    Array.prototype.indexOfCoord = function (c) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i].row === c.row && this[i].col === c.col) {
                return i;
            }
        }
        return -1;
    }

    function Coords(row, col) {
        this.row = row;
        this.col = col;
        this.isMine = false;
        this.mineOdds = 0;
        this.hits = 0; // currently not really used, maybe for isolated cluster solution in the future

        this.equals = function(c) {
            return c.row === this.row && c.col === this.col;
        };
        this.deepCopy = function() {
            var temp = new Coords(this.row, this.col);
            temp.isMine = this.isMine;
            temp.mineOdds = this.mineOdds;
            temp.hits = this.hits;
            return temp;
        }
    }

    /* Constructor for unsolved tree node
     * coords: Coords
     * unsolvedList: [coords<Coords>, ...]
     * numSurround: 1 (number of surrounding mines)
     * possibleConfig: [1, 0, 0, 0] (1 being a mine, 0 not)
     */
    function UnsolvedNode(coords, unsolvedNeighbors, numSurround) {
        this.coords = coords;
        this.unsolvedNeighbors = unsolvedNeighbors; // source of truth
        this.numSurround = numSurround;
        this.fixedIdx = [];

        this.countMines = function() { return this.unsolvedNeighbors && this.unsolvedNeighbors.map(d => +d.isMine).reduce(function(a,b){ return a + b }) };
        this.validate = function() {
            return this.countMines() <= this.numSurround;
        }
        this.generateConfig = function * (config, numMines, idx) { //
            config = [...config];
            if (idx === config.length - 1) {
                var sumMines = config.reduce((a,b) => a + b);
                if (this.fixedIdx.indexOf(idx) === -1) {
                    config[idx] = 0;
                    sumMines = config.reduce((a,b) => a + b);
                    if (sumMines === numMines) {
                        yield config;
                    }

                    if (sumMines < numMines) {
                        config[idx] = 1;
                        sumMines = config.reduce((a,b) => a + b);
                        if (sumMines === numMines) {
                            yield config;
                        }
                    }
                } else {
                    config[idx] = +this.unsolvedNeighbors[idx].isMine;
                    if (sumMines === numMines) {
                        yield config;
                    }
                }
            } else {
                if (this.fixedIdx.indexOf(idx) === -1) {
                    config[idx] = 0;
                    yield * this.generateConfig(config, numMines, idx + 1);

                    if (config.reduce((a,b) => a + b) < numMines) {
                        config[idx] = 1;
                        yield * this.generateConfig(config, numMines, idx + 1);
                    }
                } else {
                    config[idx] = this.unsolvedNeighbors[idx].isMine ? 1 : 0;
                    yield * this.generateConfig(config, numMines, idx + 1);
                }
            }
        }
        this.configGenerator = null;
        this.mapConfigToNodes = function(cfg) {
            var that = this;
            if (cfg) {
                cfg.forEach(function(d, i) {
                    that.unsolvedNeighbors[i].isMine = !!d;
                });
                return this.unsolvedNeighbors;
            }
            return null;
        }
        this.getNextPossibleConfig = function() {
            /* config: [1, 0, 0, 0] (1 being a mine, 0 not) */
            if (numSurround <= this.unsolvedNeighbors.length) {
                if (this.configGenerator === null) {
                    this.configGenerator = this.generateConfig(this.unsolvedNeighbors.map(d => d.isMine? 1: 0), this.numSurround, 0);
                }
                var val = this.configGenerator.next().value;
                if (val === null) {
                    this.configGenerator = null;
                }
                //while (val && numSurround !== val.reduce((a,b) => a + b)) {
                //    this.configGenerator.next().value
                //}
                return this.mapConfigToNodes(val)
            } else {
                console.error("UnsolvedNode > incorrect number of mines to possible squares. Is this really unsolved? call this.validate() first");
            }
        }
        this.reset = function() {
            this.fixedIdx = [];
            this.configGenerator = null;
        };
        /* Return a new mc that takes all marked mines of the rhs and marks them for this object */
        this.merge = function(otherNode) {
            var that = this;
            otherNode.unsolvedNeighbors.forEach(function(d) {
                var idx = that.unsolvedNeighbors.indexOfCoord(d);
                if (idx > -1) {
                    if (that.fixedIdx.indexOf(idx) === -1) {
                        that.fixedIdx.push(idx);
                    }
                }
            });
            return this.validate();
        };
        this.deepCopy = function() {
            var temp = new UnsolvedNode(this.coords.deepCopy(), this.unsolvedNeighbors.map(d => d.deepCopy()), this.numSurround);
            temp.fixedIdx = [...this.fixedIdx];
            return temp;
        }
    }

    function Solution(unsolvedNodes) {
        var that = this;
        this.nodes = []; //[UnsolvedNode, ...]
        unsolvedNodes.forEach(function(d) {
            that.nodes.push(d.deepCopy());
        });
        this.allNeighbors = [];

        this.nodes.forEach(function(d) {
            d.unsolvedNeighbors.forEach(function(n, i, a) {
                var idx = that.allNeighbors.indexOfCoord(n);
                if (idx === -1) {
                    that.allNeighbors.push(n);
                } else {
                    a[i] = that.allNeighbors[idx];
                }
            })
        })
    }

    function getNeighbors(r, c, testfn) { // tested
        // Assume bigger than 1x1
        var n = [];
        testfn = testfn || function (x) { return x === null };
        if (r > 0) {
            if (c > 0) {
                if (testfn(grid[r - 1][c - 1])) {
                    n.push(new Coords(r - 1, c - 1));
                }
            }
            if (c < grid[0].length - 1) {
                if (testfn(grid[r - 1][c + 1])) {
                    n.push(new Coords(r - 1, c + 1));
                }
            }
            if (testfn(grid[r - 1][c])) {
                n.push(new Coords(r - 1, c));
            }
        }
        if (r < grid.length - 1) {
            if (c > 0) {
                if (testfn(grid[r + 1][c - 1])) {
                    n.push(new Coords(r + 1, c - 1));
                }
            }
            if (c < grid[0].length - 1) {
                if (testfn(grid[r + 1][c + 1])) {
                    n.push(new Coords(r + 1, c + 1));
                }
            }
            if (testfn(grid[r + 1][c])) {
                n.push(new Coords(r + 1, c));
            }
        }
        if (c > 0) {
            if (testfn(grid[r][c - 1])) {
                n.push(new Coords(r, c - 1));
            }
        }
        if (c < grid[0].length - 1) {
            if (testfn(grid[r][c + 1])) {
                n.push(new Coords(r, c + 1));
            }
        }
        return n;
    }

    function findAllUnsolvedNodes() { // tested
        var result = {};
        var unsolvedNodes = [];
        var allCoords = [];
        grid.forEach(function(r, i) {
            r.forEach(function(c, j) {
                if (c >= 1) {
                  var n;
                  if (localStorage.getItem(NS_KEY)) {
                    n = getNeighbors(i, j, function(x) { return x === 'x' }); // identify neighbors who are mines
                    c -= n.length; // did we completely solve the node already?
                    n = getNeighbors(i, j, function(x) { return x === null || (x > 0 && x < 1) }); // find remaining unknowns
                    debugLog(i + ", " + j + " remaining mines: "+ c)
                    debugLog(n.length + " unsolved nodes ")
                    if (c && n && n.length) {
                      unsolvedNodes.push(new UnsolvedNode(new Coords(i, j), n, c)); // consider the number of surrounding mines reduced by our solution
                    } else if (c === 0) {
                      n.forEach(function (d) { 
                        d.isMine = false;
                        grid[d.row][d.col] = 'o';
                      });
                      
                    }
                  } else {
                    n = getNeighbors(i, j);
                    if (n && n.length) {
                        unsolvedNodes.push(new UnsolvedNode(new Coords(i, j), n, c));
                    }
                  }
                }
            });
        });

        result.unsolvedNodes = unsolvedNodes;
        result.allCoords = allCoords;
        return unsolvedNodes;
    }

    function findAllSolutionsHelper(unsolvedNodes, idx, solutions) {
        if (idx === unsolvedNodes.nodes.length - 1) {
            unsolvedNodes.nodes[idx].unsolvedNeighbors = unsolvedNodes.nodes[idx].getNextPossibleConfig();
            while (unsolvedNodes.nodes[idx].unsolvedNeighbors !== null) {
                var minesMatch = true;
                for (var i = 0; i < unsolvedNodes.nodes.length; ++i) {
                    var numMines = unsolvedNodes.nodes[i].countMines();

                    if (unsolvedNodes.nodes[i].numSurround !== numMines) {
                        minesMatch = false;
                        break;
                    }
                }
                if (minesMatch) {
                    solutions.push(new Solution(unsolvedNodes.nodes));
                }
                unsolvedNodes.nodes[idx].unsolvedNeighbors = unsolvedNodes.nodes[idx].getNextPossibleConfig();
            }
        } else if (idx < unsolvedNodes.nodes.length - 1) {
            var isValid = true;
            unsolvedNodes.nodes[idx].unsolvedNeighbors = unsolvedNodes.nodes[idx].getNextPossibleConfig();
            while (unsolvedNodes.nodes[idx].unsolvedNeighbors !== null) {
                for (var j = idx + 1; (j < unsolvedNodes.nodes.length) && isValid; ++j) {
                    isValid = unsolvedNodes.nodes[j].merge(unsolvedNodes.nodes[idx]);
                }

                //if (isValid) {
                    findAllSolutionsHelper(new Solution(unsolvedNodes.nodes), idx + 1, solutions);
                    for (j = idx + 1; (j < unsolvedNodes.nodes.length) && isValid; ++j) {
                        unsolvedNodes.nodes[j].reset();
                    }
                //}
                unsolvedNodes.nodes[idx].unsolvedNeighbors = unsolvedNodes.nodes[idx].getNextPossibleConfig();
            }
        }
        /*var tempUnsolvedNodes = [];
        unsolvedNodes.forEach(function(d) { tempUnsolvedNodes.push( d.deepCopy()); })
        var isValid = true;
        if (idx >= unsolvedNodes.length - 1) {
            while (tempUnsolvedNodes[idx].unsolvedNeighbors = unsolvedNodes[idx].getNextPossibleConfig()) {
                console.log(tempUnsolvedNodes[idx]);
                var minesMatch = true;
                for (var i = 0; i < tempUnsolvedNodes.length; ++i) {
                    var numMines = tempUnsolvedNodes[idx].countMines();

                    if (tempUnsolvedNodes[i].numSurround !== numMines) {
                        minesMatch = false;
                        break;
                    }
                }
                if (minesMatch) {
                    tempUnsolvedNodes[idx] = tempUnsolvedNodes[idx].deepCopy();
                    solutions.push(tempUnsolvedNodes);
                }
                tempUnsolvedNodes = [];
                unsolvedNodes.forEach(function(d) { tempUnsolvedNodes.push( d.deepCopy()); })
            }
        } else {
            var tempConfig = unsolvedNodes[idx].getNextPossibleConfig();
            while (tempConfig && tempConfig.length) {
                for (var j = idx + 1; (j < tempUnsolvedNodes.length) && isValid; ++j) {
                    isValid = tempUnsolvedNodes[j].merge(tempConfig);
                }

                if (isValid) {
                    findAllSolutionsHelper(unsolvedNodes, idx + 1, solutions);
                    for (j = idx + 1; (j < tempUnsolvedNodes.length) && isValid; ++j) {
                        isValid = unsolvedNodes[j].reset();
                    }
                }
                tempConfig = unsolvedNodes[idx].getNextPossibleConfig();
            }
        }*/
    }

    function findAllSolutions() {
        var solutions = []; // [Solution(), ...]

        var unsolvedNodes = findAllUnsolvedNodes();
        debugLog("unsolvedNodes");
        debugLog(unsolvedNodes);

        findAllSolutionsHelper(new Solution(unsolvedNodes), 0, solutions);

        return solutions;
    }

    function combineSolutions() {
        var solutions = findAllSolutions();
        debugLog("solutions", solutions);
        var coords = [];

        solutions.forEach(function(s) {
            s.allNeighbors.forEach(function(coord) {
                var idx = coords.indexOfCoord(coord);
                if (idx === -1) {
                    coords.push(coord);
                    coord.mineOdds += +coord.isMine;
                } else {
                    coords[idx].mineOdds += +coord.isMine;
                }
                coord.hits++;
            })
        })

        coords.forEach(function(d) {
            d.mineOdds = d.mineOdds / solutions.length;
        });

        return coords;
    }

    function markGrid(solution) {
        solution.forEach(function(coord){
            if (coord.mineOdds === 0) {
                grid[coord.row][coord.col] = 'o';
            } else if (coord.mineOdds === 1) {
                grid[coord.row][coord.col] = 'x';
            } else {
                grid[coord.row][coord.col] = coord.mineOdds;
            }
        });
    }
  
  function precompute() {
    var previousGrid = localStorage.getItem(NS_KEY);
    grid = parseHtmlGrid();
    if (previousGrid) {
      previousGrid = JSON.parse(previousGrid);
      for (var r = 0; r < grid.length; ++r) {
        for (var c = 0; c < grid[0].length; ++c) {
          grid[r][c] = grid[r][c] === null ? previousGrid[r][c] : grid[r][c]
        }
      }
    }
  }

  function markOuterFringe() {
    var numOuter = 0;
    var numUnknown = 0;
    var numExpectedMines = 0;
    var numGood = getNumGood();

    for (var r = 0; r < grid.length; ++r) {
        for (var c = 0; c < grid.length; ++c) {
            if (grid[r][c] === null) {
                numOuter++;
                numUnknown++;
            } else if (grid[r][c] < 1 && grid[r][c] > 0) {
                numExpectedMines += grid[r][c];
                numUnknown++;
            } else if (grid[r][c] === 'o') {
                numUnknown++;
            }
        }
    }

    if (numOuter > 0) {
        var probOuter = (Math.max(numUnknown - numGood - numExpectedMines, 0) / numOuter)

        for (r = 0; r < grid.length; ++r) {
            for (c = 0; c < grid.length; ++c) {
                if (grid[r][c] === null) {
                    if (probOuter === 1) {
                        grid[r][c] = 'x';
                    } else if (probOuter === 0) {
                        grid[r][c] = 'o';
                    } else {
                        grid[r][c] = probOuter;
                    }
                }
            }
        }

        debugLog("outer fringe calculation", grid);
    }
  }
  
  function postcompute() {
    localStorage.setItem(NS_KEY, JSON.stringify(grid));
  }

    /*function copyGrid(g) {
        var newGrid = [];
        for (var r = 0; r < g.length; ++r) {
            newGrid.push([...g[r]]);
        }
        return newGrid;
    }*/


    /* Main */
    var ended = /You Lose|You Won/.test($('form[name="grid"]').html())
    if (ended) {
      localStorage.removeItem(NS_KEY);
      localStorage.removeItem(DEBUG_KEY)
    } else {
      precompute()
      if (debugMode) {
        var debugData = JSON.parse(localStorage.getItem(DEBUG_KEY))
        if (!debugData) {
            debugData = {
                'gridData': [{
                    'grid': grid,
                }]
            }
        } else {
            debugData.gridData.push({"grid": grid})
        }
        localStorage.setItem(DEBUG_KEY, JSON.stringify(debugData))
      }

      debugLog('grid');
      debugLog(grid);

      debugLog('findallunsolvednodes result')
      debugLog(findAllUnsolvedNodes())
      markGrid(combineSolutions())

      postcompute()
      markOuterFringe();

      displayGridMarks();

      if (debugMode) {
        debugData.gridData.push({'grid': grid})
        debugMode && localStorage.setItem(DEBUG_KEY, JSON.stringify(debugData))
      }

      debugLog('grid');
      debugLog(grid);
    }

    
/*
var n = new UnsolvedNode(new Coords(0,0), [new Coords(1,2),new Coords(1,3),new Coords(1,4),new Coords(1,5)],1)
    var an = new UnsolvedNode(new Coords(0,1), [new Coords(1,2),new Coords(1,6),new Coords(1,7),new Coords(1,8)],1)
    var s = new Solution([n, an]);
    console.log(s);
    s.allNeighbors[0].isMine = true;
n = new UnsolvedNode(new Coords(0,0), [new Coords(1,1),new Coords(1,1),new Coords(1,1),new Coords(1,1)],1)
n.configGenerator = n.generateConfig([0,0,0,0],1,0)
n.fixedIdx=[1];
n.configGenerator.next().value

n = new UnsolvedNode(new Coords(0,0), [new Coords(1,1),new Coords(1,1),new Coords(1,1),new Coords(1,1)],1)
an = new UnsolvedNode(new Coords(0,0), [new Coords(1,1),new Coords(1,1),new Coords(1,1),new Coords(1,1)],1)
an.unsolvedNeighbors[1].isMine = true;
n.configGenerator = n.generateConfig([0,1,0,0],1,0)
n.configGenerator.next().value

n = new UnsolvedNode(new Coords(0,0), [new Coords(1,2),new Coords(1,3),new Coords(1,4),new Coords(1,5)],1)
an = new UnsolvedNode(new Coords(0,1), [new Coords(1,2),new Coords(1,6),new Coords(1,7),new Coords(1,8)],1)
n.unsolvedNeighbors[0].isMine = true;
an.merge(n.unsolvedNeighbors)
*/


})();