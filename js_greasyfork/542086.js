// ==UserScript==
// @name         DeepCo Statistics
// @namespace    https://deepco.app/
// @version      2025-08-08
// @description  Track RC rate and chart it.
// @author       Corns
// @match        https://deepco.app/dig
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://code.highcharts.com/stock/highstock.js
// @require      https://code.highcharts.com/modules/boost.js
// @require      https://code.highcharts.com/modules/mouse-wheel-zoom.js
// @downloadURL https://update.greasyfork.org/scripts/542086/DeepCo%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/542086/DeepCo%20Statistics.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const SCHEMA = [['Timestamp', 'TileCount', 'RC', 'Level', 'DC', 'Players', 'DCIncome', 'Processing Rating', 'Grid Size']];

  // Load existing logs or initialize with header row
  let db = await GM.getValue('nudgeLogs', SCHEMA);
  fixTimestamps(db);
  let myChart = null;
  let recursionTime = null;
  let startingRC = null; // in case reset happens in the middle of a run

  new MutationObserver((mutation, observer) => {
    const deptScaling = document.querySelector('.department-scaling');
    if (deptScaling) {
      observer.disconnect();
      console.log("[Stats] Started");
      applyFontPatch();
      waitForTargetAndObserve()
    }
  }).observe(document.body, { childList: true, subtree: true });

  function waitForTargetAndObserve() {
    const frame = document.getElementById('flash-messages');
    createPanel();

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const text = node.textContent.trim();
          if (text.includes('[DC]')) {
            logStats(text);
          }
        }
      }
    }).observe(frame, { childList: true, subtree: false });
  }

  function createPanel() {
    const grid = document.getElementById('grid-panel');
    const panelContainer = document.createElement("div");
    panelContainer.className = 'grid-wrapper';
    // add buttons
    const btnContainer = document.createElement("div");
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    btnContainer.style.gap = '10px'; // optional spacing between buttons
    // Export button
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export Player Stats";
    exportBtn.addEventListener("click", exportStats);
    btnContainer.appendChild(exportBtn);

    // Reset button
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Stats";
    resetBtn.addEventListener("click", resetStats);
    btnContainer.appendChild(resetBtn);

    // 2. Create container for buttons
    const chartContainer = document.createElement('div');
    chartContainer.id = 'hc-container';

    panelContainer.appendChild(chartContainer);
    panelContainer.appendChild(btnContainer);
    grid.appendChild(panelContainer);

    const savedZoom = JSON.parse(localStorage.getItem('chartZoom') || 'null');
    const chartData = calcData();
    const seriesData = getSeriesData(chartData);
    // series visibility
    const savedVis = JSON.parse(localStorage.getItem('chartVisibility') || '[]');
    seriesData.forEach((s, i) => {
      s.visible = savedVis[i] !== false;
    });

    // 3. Render Highcharts chart
    myChart = Highcharts.chart('hc-container', {
      chart: {
        zooming: {
          type: 'x',
          mouseWheel: {
            enabled: true,
            type: 'x'
          }
        }
      },
      rangeSelector: {
        buttons: [{
          count: 1,
          type: 'minute',
          text: '1M'
        }, {
          count: 5,
          type: 'minute',
          text: '5M'
        }, {
          count: 10,
          type: 'minute',
          text: '10M'
        }, {
          count: 30,
          type: 'minute',
          text: '30M'
        }, {
          count: 1,
          type: 'hour',
          text: '1HR'
        }, {
          type: 'all',
          text: 'All'
        }],
        enabled: true,
        inputEnabled: false,
      },
      title: { text: 'Statistics' },
      subtitle: {
        text: document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' :
        'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'datetime',
        events: {
          afterSetExtremes: function (e) {
            const zoomState = {
              min: e.min,
              max: e.max
            };
            localStorage.setItem('chartZoom', JSON.stringify(zoomState));
          }
        },
        // Optional: apply saved zoom on load
        min: savedZoom?.min,
        max: savedZoom?.max,
        scrollbar: {
          enabled: true
        },
      },
      yAxis: [{
        title: { text: 'RC/hr' }
      }, {
        title: { text: 'RC' },
        opposite: true
      }, {
        title: { text: 'Level/Grid Size' },
        top: '60%',
        height: '40%',
        min: 0,
        max: 10,
        opposite: true,
        gridLineWidth: 0,
      }, {
        title: { text: 'Rating' }
      }],
      plotOptions: {
        series: {
          events: {
            // Fires when legend item is clicked (toggles visibility)
            legendItemClick: function () {
              const visibility = this.chart.series.map(s => s.visible);
              localStorage.setItem('chartVisibility', JSON.stringify(visibility));
            }
          }
        }
      },
      series: seriesData,
      tooltip: {
        xDateFormat: '%Y-%m-%d %H:%M:%S.%L',
        valueDecimals: 2
      }
    });

    // reattach panel if removed
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        for (const removedNode of mutation.removedNodes) {
          if (removedNode === panelContainer) {
            observer.disconnect();
            createPanel();
          }
        }
      }
    }).observe(grid, { childList: true });;
  }

  function calcData() {
    const seriesData = Array.from({ length: 7 }, () => []);

    // Determine cutoff timestamp (24 hours before last entry)
    const lastTime = db[db.length - 1][0];
    const cutoff = lastTime - 24 * 3600_000;
    // Find first data index >= cutoff (skip header row 0)
    let startIndex = 1;
    while (startIndex < db.length && db[startIndex][0] < cutoff) {
      startIndex++;
    }

    let pastIndex = startIndex; // sliding window pointer for past min calc

    // start at 1 to skip header
    for (let i = startIndex; i < db.length; i++) {
      const [currentTime, , currentRC, level, , , , procRating, gridSize] = db[i];

      // avg since last recursion
      // first row of data or proc rating decrease -> set recursion time to now
      const prevProcRating = db[i-1][7];
      const recursionEvent = i === 1 || procRating != null && prevProcRating != null && procRating < prevProcRating;
      if (recursionEvent) {
        recursionTime = currentTime;
        startingRC = currentRC;
        seriesData[6].push([currentTime, 10]);
      } else {
        seriesData[6].push([currentTime, 0]);
      }
      if (recursionTime) {
        if (currentRC >= 1) {
          const timeElapsed = (currentTime - recursionTime) / 3600_000;
          const rcDelta = currentRC - startingRC;
          const rcPerHrSinceRecursion = timeElapsed > 0 ? rcDelta / timeElapsed : 0;
          seriesData[0].push([currentTime, rcPerHrSinceRecursion]);
        } else if (currentRC !== 0) {
          seriesData[0].push([currentTime, 0]);
        }
      }

      // --- RC per hour past minute (sliding window) ---
      while (pastIndex < i && db[pastIndex][0] <= currentTime - 60_000) {
        pastIndex++;
      }

      const pastTime = db[pastIndex][0];
      const pastRC = db[pastIndex][2];

      const deltaRC = currentRC - pastRC;
      const deltaTime = (currentTime - pastTime) / 3600_000; // in hours

      const rcPerHourPastMinute = deltaTime > 0 ? deltaRC / deltaTime : 0;
      if (pastRC !== 0 && deltaRC > 0) {
        seriesData[1].push([currentTime, rcPerHourPastMinute]);
      }

      // static points
      seriesData[2].push([currentTime, currentRC]);
      if (level) seriesData[3].push([currentTime, level]);
      if (gridSize) seriesData[4].push([currentTime, gridSize]);
      if (procRating) seriesData[5].push([currentTime, procRating]);
    }
    return seriesData;
  }

  function getSeriesData(chartData) {
    const playerSpan = document.querySelector('.small-link span[style*="color"]');
    const playerColor = playerSpan.style.color;
    return [{
      name: 'RC/hr Since Recursion',
      data: chartData[0],
      yAxis: 0,
    }, {
      name: 'RC/hr Past Minute',
      data: chartData[1],
      color: playerColor,
      yAxis: 0,
    }, {
      name: 'RC',
      data: chartData[2],
      yAxis: 1,
    }, {
      name: 'Level',
      data: chartData[3],
      yAxis: 2,
      tooltip: {
        valueDecimals: 0
      }
    }, {
      name: 'Grid Size',
      data: chartData[4],
      yAxis: 2,
      tooltip: {
        valueDecimals: 0
      }
    }, {
      name: 'Proc Rating',
      data: chartData[5],
      yAxis: 3,
    }, {
      name: 'Recursion event',
      data: chartData[6],
      yAxis: 2,
    }]
  }

  async function logStats(flashMessage) {
    const timestamp = Date.now();
    const tileCount = getTileCount();
    const level = getLevel();
    const dc = getDCCount();
    const players = countPlayersInLevel();
    const dcIncome = getDCIncome(flashMessage);
    const rating = getProcessingRating();
    const gridSize = getGridSize();
    const rc = await getRCCount();

    // push to database
    db.push([timestamp, tileCount, rc, level, dc, players, dcIncome, rating, gridSize]);
    await GM.setValue('nudgeLogs', db);

    if (rc >= 1) {
      // update chart with newest data point
      const timeElapsed = (timestamp - recursionTime) / (1000 * 60 * 60);
      const rcDelta = rc - startingRC;
      const rcPerMin = Math.max(rcDelta / timeElapsed, 0);

      // update chart
      // RC since recursion
      myChart.series[0].addPoint([timestamp, rcPerMin], false, false);
    }

    // RC past minute
    // Find the earliest entry within the past 60 seconds
    let j = db.length - 1;
    while (j > 0 && db[j][0] > timestamp - 60_000) {
      j--;
    }
    const pastTime = db[j][0];
    const pastRC = db[j][2];

    const deltaRC = rc - pastRC;
    const deltaTime = (timestamp - pastTime) / 3600_000; // in hours

    const rcPerHourPastMinute = deltaTime > 0 ? deltaRC / deltaTime : 0;
    if (pastRC !== 0 && deltaRC > 0) {
      myChart.series[1].addPoint([timestamp, rcPerHourPastMinute], false, false);
    }

    // rc
    myChart.series[2].addPoint([timestamp, rc], false, false);
    // grid size
    myChart.series[3].addPoint([timestamp, level], false, false);
    myChart.series[4].addPoint([timestamp, gridSize], false, false);
    myChart.series[5].addPoint([timestamp, rating], true, false);
    scrollChartToEnd(myChart);
  }

  async function exportStats() {
    const logs = await GM.getValue('nudgeLogs', []);
    if (logs.length === 0) {
      console.log('[Stats] No logs to save.');
      return;
    }

    // Wrap values with commas in quotes
    const csvContent = logs.map(row =>
                                row.map(value =>
                                        /,/.test(value) ? `"${value}"` : value
                                       ).join(',')
                               ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dc_player_stats_${new Date().toISOString().replace(/[:.]/g, "_")}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    console.log('[CSV Export] Downloaded CSV with', logs.length, 'rows.');
  }

  async function resetStats() {
    if (confirm('Are you sure you want to clear player stats?')) {
      db = SCHEMA;
      await GM.setValue('nudgeLogs', db);
      alert('Tile logs have been cleared.');
    }
  }

  function getTimestampForSheets() {
    const d = new Date();
    const pad = (n, z = 2) => String(n).padStart(z, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    const milliseconds = pad(d.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  // convert to ISO 8601 format i.e. milliseconds since epoch
  function fixTimestamps(db) {
    for (let i = 1; i < db.length; i++) {
      const ts = db[i][0];

      if (typeof ts === 'string') {
        db[i][0] = new Date(ts.replace(' ', 'T')).getTime();
      }
    }
  }

  function getTileCount() {
    const frame = document.getElementById('tiles-defeated-badge');
    if (!frame) {
      console.log('[Stats] turbo-frame element not found.');
      return;
    }

    // Try strong with class nudge-animation first
    let target = frame.querySelector('strong.nudge-animation');

    // If not found, try strong inside span.tile-progression with style containing 'inline-block'
    if (!target) {
      target = frame.querySelector('span.tile-progression strong[style*="inline-block"]');
    }

    if (!target) {
      console.log('[Stats] Target element not found inside turbo-frame.');
      return;
    }

    let value = target.textContent.trim();
    value = parseInt(value.replace(/[^\d]/g, ""), 10);
    return value;
  }

  async function getRCCount() {
    // Find RC value
    const recursionSpan = document.getElementById('recursion-header');
    if (!recursionSpan) return 0;

    const link = recursionSpan.querySelector('a');
    if (!link) return 0;

    const rcMatch = link.textContent.match(/\[\+([\d.]+)\s*RC\]/);
    if (rcMatch) return parseFloat(rcMatch[1]);

    // fetch recursion potential and then calc rc from there
    // formula is RC = potential^0.7 / 8
    try {
      const response = await fetch('/recursion');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const liElements = Array.from(doc.querySelectorAll('li'));
      const rcLi = liElements.find(li => li.textContent.includes('RC Potential'));
      const value = rcLi.querySelector('span.valuable').textContent;
      const rcPotential = parseFloat(value.replace(/,/g, ''));
      const rc = Math.pow(rcPotential, 0.7) / 8;
      return rc;
    } catch (error) {
      console.error('[Stats] Error fetching recursion page:', error.message);
      return 0;
    }

    return 0;
  }

  function getDCCount() {
    // Find the UPGRADES link with badge
    const upgradesLink = Array.from(document.querySelectorAll('a')).find(a =>
                                                                         a.textContent.includes('UPGRADES'));
    // Parse current DC value from its text
    const match = upgradesLink.textContent.match(/\[DC\]\s*([\d,.]+)/);
    const currentDC = match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    return currentDC;
  }

  // includes the current player
  function countPlayersInLevel() {
    const deptScaling = document.querySelector('.department-scaling');
    const deptOperators = deptScaling ? deptScaling.querySelectorAll('a').length : 0;
    return deptOperators;
  }

  function getDCIncome(flashMessage) {
    // parse flashMessage which has DC income amount
    const match = flashMessage.match(/([\d,.]+)\s*\[DC\]/);
    const amount = parseFloat(match[1].replace(/,/g, ''));
    return amount;
  }

  function getProcessingRating() {
    const rating = Array.from(document.querySelectorAll('.stat-item'))
    .map(item => {
      const label = item.querySelector('.stat-label');
      const value = item.querySelector('.stat-value');
      return label && label.textContent.trim() === 'Processing Rating:' && value
        ? parseFloat(value.textContent.trim())
      : null;
    })
    .filter(Boolean)[0] || null;

    return rating;
  }

  function getLevel() {
    // Find the department-stats element
    const deptStats = document.querySelector('p.department-stats');

    let level = 0; // default if not found

    if (deptStats) {
      const text = deptStats.textContent.trim();

      // Match DC followed by optional + and digits, e.g., DC4A or DC+4
      const match = text.match(/DC\+?(\d+)/i);
      if (match) {
        level = parseInt(match[1], 10);
      }
    }
    return level;
  }

  function getGridSize() {
    const grid = document.getElementById('grid-panel');
    if (!grid) return 0;
    const wrappers = Array.from(grid.querySelectorAll("div[id^='tile_wrapper_']"));
    const gridSize = Math.sqrt(wrappers.length);
    return gridSize;
  }

  function scrollChartToEnd(chart, bufferRatio = 0.01) {
    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();

    const viewSize = extremes.max - extremes.min;
    const dataMax = extremes.dataMax;

    const isAtEnd = Math.abs(extremes.max - dataMax) < viewSize * 0.05; // ~5% tolerance

    if (isAtEnd) {
      const buffer = viewSize * bufferRatio;
      const newMax = dataMax + buffer;
      const newMin = newMax - viewSize;

      xAxis.setExtremes(newMin, newMax);
    }
  }

  function restoreSeriesVisibility(chart) {
    const saved = localStorage.getItem('chartVisibility');
    if (!saved) return;

    const visibility = JSON.parse(saved);
    chart.series.forEach((s, i) => {
      if (visibility[i] === false) {
        s.setVisible(false, false);
      }
    });
    chart.redraw();
  }


  // stylise highcharts font
  function applyFontPatch() {
    if (typeof Highcharts === 'undefined' || !document.body) {
      requestAnimationFrame(applyFontPatch);
      return;
    }

    const bodyStyles = getComputedStyle(document.body);
    const bodyFont = bodyStyles.fontFamily;
    const fontColor = bodyStyles.color;
    const backgroundColor = bodyStyles.backgroundColor;


    Highcharts.setOptions({
      time: {
        useUTC: false
      },
      chart: {
        backgroundColor: 'rgb(17, 17, 17)',
        style: {
          color: fontColor,
          fontFamily: bodyFont
        }
      },
      title: {
        style: {
          color: fontColor
        }
      },
      subtitle: {
        style: {
          color: fontColor
        }
      },
      xAxis: {
        labels: {
          style: {
            color: fontColor
          }
        },
        title: {
          style: {
            color: fontColor
          }
        }
      },
      yAxis: {
        labels: {
          style: {
            color: fontColor
          }
        },
        title: {
          style: {
            color: fontColor
          }
        }
      },
      legend: {
        itemStyle: {
          color: fontColor
        }
      },
      tooltip: {
        backgroundColor: backgroundColor,
        style: {
          color: fontColor
        }
      },
    });
  }
})();