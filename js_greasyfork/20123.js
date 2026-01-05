// ==UserScript==
// @name        Github's Game of Life
// @namespace   https://github.com/ryanml/Github-Game-of-Life/
// @description Plays Conways' Game of Life with user's Github activity
// @include     https://github.com/*
// @version     1.3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20123/Github%27s%20Game%20of%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/20123/Github%27s%20Game%20of%20Life.meta.js
// ==/UserScript==
(function() {
  // Strict mode
  'use strict';
  // Constant hex values
  const INACTIVE_HEX = '#eeeeee';
  const ACTIVE_HEX_ARR = ['#d6e685', '#8cc665', '#44a340', '#1e6823'];
  // Interval by default is 200ms
  var IT_INTERVAL = 200;
  // Gets the <rect> wrapper tag <g> elements
  var columns = document.getElementsByTagName('g');
  var colDepth = 7;
  var play = false;
  var colorize = false;
  var generationCount = 0;
  var liveCellNum = 0;
  var play = false;
  var loop;
  var fillColumnGaps = fillGaps();
  var ui = buildUI();
  var grid = buildGrid();
  var originalState = buildGrid();
  var fillGrid = fillGrid();
  // Builds grid of appropriate length
  function buildGrid() {
    var grid = [];
    for (var col = 0; col < columns.length - 1; col++) {
      grid.push([]);
    }
    return grid;
  }
  // Resets grid to original state
  function resetGrid() {
    for (var x = 0; x < originalState.length; x++) {
      for (var y = 0; y < originalState[x].length; y++) {
        grid[x][y] = originalState[x][y][1];
        document.getElementById(x + ',' + y).setAttribute('fill', originalState[x][y][0]);
      }
    }
    updateLiveCellCount();
    document.getElementById('gol-info').innerHTML = '';
    document.getElementById('gcc').innerHTML = (generationCount = 0);
  }
  // Fills grid with initial states
  function fillGrid() {
    for (var y = 0; y < colDepth; y++) {
      for (var k = 1; k < columns.length; k++) {
        var x = k - 1;
        var cell = columns[k].children[y];
        cell.addEventListener('click', clickUpdateCell);
        cell.id = x + ',' + y;
        // If cell is default color (Not filled) push 0 to the grid, else 1
        var fill = cell.getAttribute('fill');
        var active = fill == INACTIVE_HEX ? 0 : 1;
        originalState[x].push([fill, active]);
        grid[x].push(active);
        updateLiveCellCount();
      }
    }
  }
  // Click event function for play/pause button. Starts and stops execution of the algorithm
  function controlSim() {
    if (!play) {
      this.id = 'pause';
      this.innerHTML = 'Pause';
      document.getElementById('gol-info').innerHTML = '';
      play = true;
      loop = setInterval(checkGrid, IT_INTERVAL);
    }
    else {
      this.id = 'play';
      this.innerHTML = 'Play';
      play = false;
      clearInterval(loop);
    }
  }
  // Applies one sweep of the algorithm to the grid
  function step() {
    if (!play) {
      checkGrid();
    }
  }
  // Sets all cells to dead (0)
  function clearGrid() {
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        updateCellAt(x, y, grid[x][y] = 0);
      }
    }
    updateLiveCellCount();
    document.getElementById('gcc').innerHTML = (generationCount = 0);
  }
  // Updates the interval on change of the range input
  function updateInterval() {
    IT_INTERVAL = this.value == 0 ? ((this.value + 1) * 10) : (this.value * 10);
    // If animation is playing, set new interval loop
    if (play) {
      clearInterval(loop);
      loop = setInterval(checkGrid, IT_INTERVAL);
    }
    document.getElementById('icc').innerHTML = IT_INTERVAL;
  }
  // Returns the number of live cells in the grid
  function updateLiveCellCount() {
    liveCellNum = 0;
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        if (grid[x][y] == 1) {
          liveCellNum++;
        }
      }
    }
    document.getElementById('lcc').innerHTML = liveCellNum;
  }
  // Checks if all cells are dead, displays message
  function checkForCellDeaths() {
    // Check for no cells
    if (liveCellNum == 0) {
      // If the simulation is being run it needs to stop
      if (play) {
        document.getElementById('pause').click();
      }
      document.getElementById('gol-info').innerHTML = ' - Mass Death! All your cells have died.';
    }
  }
  // Loops through grid and applies Conway's algorithm to cells
  function checkGrid() {
      for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
          var isAlive = grid[x][y] == 1 ? true : false;
          var nC = getNumNeighbors(x, y);
          if (isAlive && nC < 2) {
            grid[x][y] = 0;
          }
          else if (isAlive && nC == 2 || nC == 3) {
            grid[x][y] = 1;
          }
          else if (isAlive && nC > 3) {
            grid[x][y] = 0;
          }
          else if (!isAlive && nC == 3) {
            grid[x][y] = 1;
          }
          updateCellAt(x, y, grid[x][y]);
        }
      }
      updateLiveCellCount();
      checkForCellDeaths();
      document.getElementById('gcc').innerHTML = ++generationCount;
  }
  // Checks neighbors
  function getNumNeighbors(x, y) {
    // All possible coordinates of neighbors
    var fullCoords = [[x-1,y-1],[x,y-1],[x+1,y-1],[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y]];
    var neighborCells = [];
    // Checks to make sure the coordinates aren't out of bounds, if not, push to neighborCells
    for (var f = 0; f < fullCoords.length; f++) {
      if (fullCoords[f][0] >= 0 && fullCoords[f][0] <= (grid.length - 1)
          && fullCoords[f][1] >= 0 && fullCoords[f][1] <= colDepth - 1) {
        neighborCells.push(grid[fullCoords[f][0]][fullCoords[f][1]]);
      }
    }
    // Adds neighBorCell values via reduce, each live cell is represented by 1
    return neighborCells.reduce((c, p) => c + p);
  }
  // Updates the <rect> markup at given coordinates
  function updateCellAt(x, y, newState) {
     var cell = document.getElementById(x + ',' + y);
     var stateHex = newState == 0 ? INACTIVE_HEX : genRandomHex();
     cell.setAttribute('fill', stateHex);
  }
  // Given a click event on the cell, sets grid at cell to opposite stateHex
  function clickUpdateCell() {
    var slc = this.id.split(',');
    var x = slc[0], y = slc[1];
    grid[x][y] = grid[x][y] == 0 ? 1 : 0;
    updateCellAt(x, y, grid[x][y]);
    updateLiveCellCount();
   }
   // Generates/gets the appropriate random hex value
   function genRandomHex() {
     var chars = 'ABCDEF0123456789';
     var hex = '#';
     if (!colorize) {
       return ACTIVE_HEX_ARR[Math.floor(Math.random() * ACTIVE_HEX_ARR.length)];
     }
     else {
       for (var n = 0; n < 6; n++) {
         hex += chars[Math.floor(Math.random() * chars.length)];
       }
       return hex;
     }
   }
  // Fills gaps in the markup
  function fillGaps() {
    // Gets the needed number of cells and most recent y value for first row
    var fCol = columns[1];
    var fNodes = fCol.children;
    var fCellNo = (colDepth - fNodes.length);
    var fCellY = fNodes[0].getAttribute('y');
    var nextfCellY = parseInt(fCellY) - 13;
    // Gets the needed number of cells and most recent y value for last row
    var lCol = columns[columns.length - 1];
    var lNodes = lCol.children;
    var lCellNo = (colDepth - lNodes.length);
    var lCellY = lNodes[lNodes.length - 1].getAttribute('y');
    var nextlCellY = parseInt(lCellY) + 13;
    for (var f = 0; f < fCellNo; f++) {
      fCol.innerHTML = ('<rect class="day" width="11" height="11" y="' + nextfCellY + '" fill="' + INACTIVE_HEX + '"></rect>' + fCol.innerHTML);
      nextfCellY -= 13;
    }
    for (var l = 0; l < lCellNo; l++) {
      lCol.innerHTML += '<rect class="day" width="11" height="11" y="' + nextlCellY + '" fill="' + INACTIVE_HEX + '"></rect>';
      nextlCellY += 13;
    }
  }
  // Sets colorize variable on change
  function setColorize() {
    colorize = this.checked ? true : false;
  }
  // Builds UI and adds it to the document.
  function buildUI() {
    // Appends needed <style> to <head>
    GM_addStyle(" .calendar-graph.days-selected rect.day { opacity: 1 !important; } " +
      " .gol-span { display: inline-block; width: 125px; margin: 0px 7px; } " +
      " .gol-button { margin: 0px 3px; width: 50px; height: 35px; border-radius: 5px; color: #ffffff; font-weight:bold; font-size: 11px; } " +
      " .gol-button:focus { outline: none; } " +
      " #play { background: #66ff33; border: 2px solid #208000; } " +
      " #pause { background: #ff4d4d; border: 2px solid #cc0000; } " +
      " #step { background: #0066ff; border: 2px solid #003380; } " +
      " #clear { background: #e6e600; border: 2px solid #b3b300; } " +
      " #reset { background: #ff9900; border: 2px solid #cc7a00; } " +
      " #gol-range-span { width: 190px; } " +
      " #gol-range-lbl { margin-right: 5px; } " +
      " #gol-range { vertical-align:middle; width: 100px; } ");
    // Contributions tab will be the parent div
    var overTab = document.getElementsByClassName('overview-tab')[0];
    var contAct = document.getElementsByClassName('js-contribution-activity')[0];
    contAct.style.display = 'none';
    // Control panel container
    var golCont = document.createElement('div');
    golCont.className = 'boxed-group flush';
    var markUp = "<h3>Github's Game of Life Control Panel <span id='gol-info' style='color:#ff0000'></span></h3>" +
      "<div class='boxed-group-inner' style='padding:10px'>" +
      "<button class='gol-button' id='play'>Play</button>" +
      "<button class='gol-button' id='step'>Step</button>" +
      "<button class='gol-button' id='clear'>Clear</button>" +
      "<button class='gol-button' id='reset'>Reset</button>" +
      "<span class='gol-span'><strong>Live Cell Count: </strong><span id='lcc'></span></span>" +
      "<span class='gol-span' style='width:105px'><strong>Generation: </strong><span id='gcc'>0</span></span>" +
      "<span class='gol-span' id='gol-range-span'>" +
      "<span id='gol-range-lbl'><strong>Int (ms): </strong><span id='icc'>200</span></span>" +
      "<input type='range' id='gol-range' value='20'/>" +
      "</span>" +
      "<input type='checkbox' id='color-check' style='vertical-align:middle'/>" +
      "</div>";
    golCont.innerHTML = markUp;
    overTab.insertBefore(golCont, contAct);
    // Add events
    document.getElementById('play').addEventListener('click', controlSim);
    document.getElementById('step').addEventListener('click', step);
    document.getElementById('clear').addEventListener('click', clearGrid);
    document.getElementById('gol-range').addEventListener('change', updateInterval);
    document.getElementById('color-check').addEventListener('change', setColorize);
    document.getElementById('reset').addEventListener('click', resetGrid);
  }
})();