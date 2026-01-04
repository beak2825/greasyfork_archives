// ==UserScript==
// @name         linux.do activity graph (Manual Build)
// @namespace    http://tampermonkey.net/
// @version      2025-05-17
// @description  linux.do activity graph manually built with native JS/CSS
// @author       You
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539894/linuxdo%20activity%20graph%20%28Manual%20Build%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539894/linuxdo%20activity%20graph%20%28Manual%20Build%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CACHE_PREFIX = 'linuxdo_activity_graph_';
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 6 hours
  const REQUEST_DELAY_MS = 300; // Delay between paginated requests
  const MAX_RETRIES_429 = 3;
  const RETRY_DELAY_429_MS = 5000; // 5 seconds delay on 429

  // --- Styles ---
  // Using the styles from your previous Tampermonkey script, slightly adjusted
/* --- Styles --- */
/* Using the styles from your previous Tampermonkey script, slightly adjusted */
const styles = `
.activity-graph-container {
  margin-bottom: 20px !important;
  background: white !important; /* White background */
  border-radius: 6px !important; /* Rounded corners */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12) !important; /* Subtle shadow */
  padding: 20px !important; /* Padding inside the container */
}

.activity-graph-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.activity-graph-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #333; /* Dark grey text */
}

.activity-graph-legend {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    font-size: 0.9em !important;
    color: #555 !important; /* Medium grey text */
}

.activity-graph-legend span {
    margin-right: 4px !important;
}

.activity-graph-legend-item {
    width: 12px !important;
    height: 12px !important;
    border-radius: 2px !important;
}

.activity-graph-content {
  display: grid !important;
  grid-template-columns: auto 1fr !important; /* Weekday labels on the left, graph on the right */
  gap: 5px !important; /* Adjusted gap between weekday labels and the graph grid */
}

.activity-graph-weekdays {
    display: grid !important;
    grid-template-rows: repeat(7, 1fr) !important;
    gap: 2px !important; /* Match the gap of the graph cells */
    padding-top: 12px !important; /* Align with the first row of cells (adjust based on cell size and gap) */
    font-size: 0.8em !important;
    color: #777 !important; /* Lighter grey text */
    text-align: right !important;
}

.activity-graph-weekdays div:nth-child(2n) { /* Label every other weekday */
    visibility: hidden !important; /* Hide labels for Mon, Wed, Fri, Sun */
}


.activity-graph-grid {
  display: grid !important;
  grid-template-columns: repeat(53, 1fr) !important; /* 53 weeks */
  gap: 2px !important; /* Adjusted gap between columns (weeks) */
}

.activity-graph-week-column {
  display: grid !important;
  grid-template-rows: repeat(7, 1fr) !important; /* 7 days */
  gap: 2px !important; /* Adjusted gap between rows (days) */
}

.activity-day {
  width: 10px !important; /* Fixed size for the cell */
  height: 10px !important; /* Fixed size for the cell */
  border-radius: 2px !important;
  transition: transform 0.2s ease !important;
  box-sizing: border-box !important; /* Include border in element's total width and height */
}

.activity-day:hover {
  transform: scale(1.5) !important;
  z-index: 1 !important;
  border: 1px solid rgba(0,0,0,0.1) !important; /* Subtle border on hover */
}

/* Color classes based on your previous script's logic */
.color-level-0 { background-color: #ebedf0; } /* No activity */
.color-level-1 { background-color: #c6e48b; } /* Lightest green */
.color-level-2 { background-color: #9be9a8; }
.color-level-3 { background-color: #7bc96f; }
.color-level-4 { background-color: #40c463; }
.color-level-5 { background-color: #30a14e; }
.color-level-6 { background-color: #216e39; }
.color-level-7 { background-color: #1b5e2e; }
.color-level-8 { background-color: #154c25; }
.color-level-9 { background-color: #0f3a1c; }
.color-level-10 { background-color: #0a2813; } /* Darkest green */
/* Add more levels if needed, up to 20 as you mentioned before */


.tooltip {
  position: fixed;
  display: none;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  transform: translate(15px, -50%);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-date {
  font-weight: bold;
}

.tooltip-counts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.tooltip-count-item {
  color: #ccc;
}
.tooltip-count-item .action-type-1 { color: #f48fb1; } /* Like - Pinkish */
.tooltip-count-item .action-type-4 { color: #81c784; } /* Topic - Greenish */
.tooltip-count-item .action-type-5 { color: #64b5f6; } /* Post - Bluish */


.tooltip-total {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: bold;
  color: #9be9a8; /* GitHub green */
}

.activity-graph-loading {
  display: flex ;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  font-size: 16px;
  color: #555;
}
.activity-graph-loading .spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: #09f;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

  // Create and inject style element
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)

  // --- Helper Functions (Native JS) ---

  // Simple date formatting (replace moment)
  function formatDate(date, format) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // months are 0-indexed
      const day = ('0' + date.getDate()).slice(-2);
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const weekday = weekdays[date.getDay()];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = months[date.getMonth()];

      switch(format) {
          case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
          case 'YYYY年MM月DD日 dddd': return `${year}年${month}月${day}日 ${weekday}`;
          case 'dddd': return weekday;
          case 'MMMM': return monthName;
          default: return date.toISOString().split('T')[0]; // Default to YYYY-MM-DD
      }
  }

  // Get the start of the year (replace moment().startOf('year'))
  function startOfYear(year) {
      return new Date(year, 0, 1); // Month is 0-indexed
  }

  // Check for leap year (replace moment().isLeapYear())
  function isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // Get day of the week (replace moment().getDay())
  function getDayOfWeek(date) {
      return date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  }

  // Add days to a date (replace moment().add(1, 'days'))
  function addDays(date, days) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
  }

    // Get days in a year
    function getDaysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }


  // --- Loading Indicator ---
  function showLoadingIndicator(message = "Loading activity data...") {
    removeLoadingIndicator();
    const indicator = document.createElement('div');
    indicator.className = 'activity-graph-loading';
    indicator.innerHTML = `<div class="spinner"></div> <span class="loading-text">${message}</span>`;
    return indicator;
  }

  function updateLoadingMessage(indicator, message) {
    if (indicator) {
        const textElement = indicator.querySelector('.loading-text');
        if (textElement) textElement.textContent = message;
    }
  }

  function removeLoadingIndicator() {
    const existingIndicator = document.querySelector('.activity-graph-loading');
    if (existingIndicator) {
      existingIndicator.remove();
    }
  }

  // --- Caching ---
  function getCachedData(username) {
    const cacheKey = `${CACHE_PREFIX}${username}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          console.log('Activity graph: Using cached data for', username);
          return data;
        }
        console.log('Activity graph: Cache expired for', username);
      }
    } catch (e) {
      console.error('Activity graph: Error reading cache', e);
      localStorage.removeItem(cacheKey); // Clear corrupted cache
    }
    return null;
  }

  function setCachedData(username, data) {
    const cacheKey = `${CACHE_PREFIX}${username}`;
    const itemToCache = {
      timestamp: Date.now(),
      data: data
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
      console.log('Activity graph: Data cached for', username);
    } catch (e) {
      console.error('Activity graph: Error setting cache', e);
    }
  }

  // Function to process the data and create activity map
  function processActivityData(data) {
    const activityMap = new Map()

    data.user_actions.forEach(action => {
      const date = new Date(action.created_at);
      // Ensure date is treated as UTC to match API results typically
      const dateString = date.toISOString().split('T')[0];

      if (!activityMap.has(dateString)) {
        activityMap.set(dateString, {
          count: 0,
          actions: new Map()
        })
      }
      const dayData = activityMap.get(dateString)
      dayData.count++

      if (!dayData.actions.has(action.action_type)) {
        dayData.actions.set(action.action_type, 0)
      }
      dayData.actions.set(action.action_type, dayData.actions.get(action.action_type) + 1)
    })
    return activityMap;
  }

  // Function to generate the weeks structure for the grid
  function getWeeksOfYear(year) {
    const startDate = startOfYear(year);
    const daysInYear = getDaysInYear(year);
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDate); // Use a copy

    // Add leading nulls for days before the first day of the year's weekday
    const firstDayOfWeek = getDayOfWeek(currentDate); // 0 for Sunday, 6 for Saturday
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (let i = 0; i < daysInYear; i++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(currentDate)); // Push a copy
      currentDate = addDays(currentDate, 1);
    }

    // Add trailing nulls to fill the last week
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);

    // GitHub style graph typically shows the last 365 days, which might span two years.
    // Let's adjust this function to return the last ~53 weeks ending today.
    // This is a common approach for activity graphs.
    const today = new Date();
    const oneYearAgo = addDays(today, -364); // Roughly one year ago to get 365 days

    const allDays = [];
    let day = new Date(oneYearAgo);
     while (day <= today) {
        allDays.push(new Date(day));
        day = addDays(day, 1);
    }

    const recentWeeks = [];
    let currentRecentWeek = [];
    // Find the first Sunday before or on oneYearAgo
    let startDayForGrid = new Date(oneYearAgo);
    startDayForGrid.setDate(startDayForGrid.getDate() - getDayOfWeek(startDayForGrid)); // Wind back to the most recent Sunday

    let gridCurrentDate = new Date(startDayForGrid);

    // Generate cells for ~53 weeks
    const totalCells = 53 * 7;
    for (let i = 0; i < totalCells; i++) {
        if (currentRecentWeek.length === 7) {
            recentWeeks.push(currentRecentWeek);
            currentRecentWeek = [];
        }
        // Push null for days before the actual start date if needed, or the date
        currentRecentWeek.push(new Date(gridCurrentDate));
        gridCurrentDate = addDays(gridCurrentDate, 1);
    }
    if (currentRecentWeek.length > 0) {
        recentWeeks.push(currentRecentWeek);
    }

     // Adjust if the last week is incomplete (shouldn't happen with 53*7 but good practice)
     while(recentWeeks[recentWeeks.length - 1].length < 7) {
         recentWeeks[recentWeeks.length - 1].push(null);
     }


    return recentWeeks; // Return weeks covering the last ~53 weeks
  }

  // Map activity count to a color class
  function getColorClass(count) {
    if (count === 0) return "color-level-0";
    // Adjust the thresholds based on your data distribution and desired visual steps
    // These thresholds are examples and might need tuning.
    else if (count <= 1) return "color-level-1";
    else if (count <= 3) return "color-level-2";
    else if (count <= 6) return "color-level-3";
    else if (count <= 10) return "color-level-4";
    else if (count <= 15) return "color-level-5";
    else if (count <= 20) return "color-level-6";
    else if (count <= 25) return "color-level-7";
    else if (count <= 30) return "color-level-8";
    else if (count <= 40) return "color-level-9";
    else return "color-level-10"; // Max level
  }


  // Function to create the activity graph DOM elements
  function createActivityGraph(activityMap) {
    const graphContainer = document.createElement('div');
    graphContainer.className = 'activity-graph-container';

    // Header with title and legend
    const header = document.createElement('div');
    header.className = 'activity-graph-header';
    header.innerHTML = `<div class="activity-graph-title">Activity</div>
                        <div class="activity-graph-legend">
                            <span>Less</span>
                            <div class="activity-graph-legend-item color-level-0"></div>
                            <div class="activity-graph-legend-item color-level-1"></div>
                            <div class="activity-graph-legend-item color-level-3"></div>
                            <div class="activity-graph-legend-item color-level-6"></div>
                            <div class="activity-graph-legend-item color-level-10"></div>
                            <span>More</span>
                        </div>`;
    graphContainer.appendChild(header);


    const graphContent = document.createElement('div');
    graphContent.className = 'activity-graph-content';
    graphContainer.appendChild(graphContent);

    // Weekday labels
    const weekdaysLabels = document.createElement('div');
    weekdaysLabels.className = 'activity-graph-weekdays';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Sunday first
    weekdays.forEach(day => {
        const label = document.createElement('div');
        label.textContent = day;
        weekdaysLabels.appendChild(label);
    });
    graphContent.appendChild(weekdaysLabels);


    // Graph grid
    const graphGrid = document.createElement('div');
    graphGrid.className = 'activity-graph-grid';
    graphContent.appendChild(graphGrid);

    // Create tooltip element (append to body for fixed positioning)
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Get the last ~53 weeks based on today
    const today = new Date();
    const year = today.getFullYear(); // Or the year of the earliest data point if needed
    const weeks = getWeeksOfYear(year); // This function now returns last ~53 weeks


    weeks.forEach((week, weekIndex) => {
      const weekColumn = document.createElement('div');
      weekColumn.className = 'activity-graph-week-column';

      week.forEach((dayDate, dayIndex) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'activity-day';

        if (dayDate === null) {
            // Empty cell for padding at the start/end of the year/grid
            // No special class needed, default styles apply
        } else {
            const dateString = formatDate(dayDate, 'YYYY-MM-DD');
            const dayData = activityMap.get(dateString) || { count: 0, actions: new Map() };
            const count = dayData.count;

            dayDiv.classList.add(getColorClass(count));

            // Add hover events for tooltip
            dayDiv.addEventListener('mousemove', (e) => {
              const formattedDate = formatDate(dayDate, 'YYYY年MM月DD日 dddd'); // Use native date formatting

              let tooltipContentHtml = `<div class="tooltip-date">${formattedDate}</div>`;
              if (count > 0) {
                tooltipContentHtml += '<div class="tooltip-counts">';
                const actionTypeNames = { 1: '赞', 4: '话题', 5: '帖子' };
                const sortedActionTypes = [1, 4, 5]; // Desired order

                sortedActionTypes.forEach(type => {
                  const typeCount = dayData.actions.get(type) || 0;
                  if (typeCount > 0) {
                    tooltipContentHtml += `<div class="tooltip-count-item"><span class="action-type-${type}">${actionTypeNames[type] || `Type ${type}`}: ${typeCount}</span></div>`;
                  }
                });
                tooltipContentHtml += '</div>';
                tooltipContentHtml += `<div class="tooltip-total">Total: ${count}</div>`;
              } else {
                tooltipContentHtml += 'No contributions on this day.';
              }

              tooltip.innerHTML = `<div class="tooltip-content">${tooltipContentHtml}</div>`;
              tooltip.style.display = 'block';

              // Position tooltip near cursor, ensuring it's within viewport
              let x = e.clientX + 15;
              let y = e.clientY;

              tooltip.style.left = `${x}px`;
              tooltip.style.top = `${y}px`;

              // Adjust if tooltip goes off-screen
              const tooltipRect = tooltip.getBoundingClientRect();
              if (tooltipRect.right > window.innerWidth) {
                  x = e.clientX - tooltipRect.width - 15;
                  tooltip.style.left = `${x}px`;
              }
              if (tooltipRect.bottom > window.innerHeight) {
                  y = e.clientY - tooltipRect.height;
                  tooltip.style.top = `${y}px`;
              }
               if (tooltipRect.top < 0) {
                  y = e.clientY;
                  tooltip.style.top = `${y}px`;
              }
            });

            dayDiv.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none';
            });
        }

        weekColumn.appendChild(dayDiv);
      });
      graphGrid.appendChild(weekColumn);
    });

    // Add Month Labels (simple version, positioning accurately with pure CSS/JS is tricky)
    // A common simple approach is to add labels above the first cell of each month.
    // This requires iterating through the generated grid dates.
    const monthLabelsContainer = document.createElement('div');
    monthLabelsContainer.className = 'activity-graph-months'; // Need CSS for this
    // For simplicity in this manual build, we'll skip accurate month labels positioned above columns
    // as it adds significant complexity with pure JS/CSS relative to the grid.
    // The GitHub style month labels are tricky to get right without complex calculations or a layout library.
    // Let's omit them for this basic manual build.
    // If needed, you would iterate through 'weeks', find the first day of each month,
    // and calculate its column position to place a label.

    return graphContainer;
  }

  // Function to fetch data with pagination, delay, and 429 handling
  async function fetchAllData(username, loadingIndicator) {
    const cachedData = getCachedData(username);
    if (cachedData) {
      return cachedData;
    }

    const allUserActions = [];
    const limit = 30;
    const maxOffsetsToTry = 400; // Max ~600 actions. Adjust if needed.
    let totalFetched = 0;

    for (let i = 0; i < maxOffsetsToTry; i++) {
      const offset = i * limit;
      let retries = 0;
      let success = false;

      while(retries <= MAX_RETRIES_429 && !success) {
        try {
          if (i > 0 || retries > 0) {
            await new Promise(resolve => setTimeout(resolve, retries > 0 ? RETRY_DELAY_429_MS : REQUEST_DELAY_MS));
          }
          if (loadingIndicator) {
            updateLoadingMessage(loadingIndicator, `Fetching activity data... (page ${i + 1}/${maxOffsetsToTry}${retries > 0 ? `, retry ${retries}` : ''})`);
          }

          const response = await fetch(`https://linux.do/user_actions.json?offset=${offset}&username=${username}&filter=1,4,5`);

          if (response.status === 429) {
            retries++;
            console.warn(`Activity graph: Received 429 (Too Many Requests). Retry ${retries}/${MAX_RETRIES_429} after ${RETRY_DELAY_429_MS}ms.`);
            if (loadingIndicator) updateLoadingMessage(loadingIndicator, `Rate limited by server. Retrying (${retries}/${MAX_RETRIES_429})...`);
            if (retries > MAX_RETRIES_429) {
              throw new Error(`Activity graph: Max retries exceeded for 429 error on page ${i+1}.`);
            }
            continue;
          }

          if (!response.ok) {
            throw new Error(`Activity graph: HTTP error ${response.status} for page ${i+1}`);
          }

          const data = await response.json();
          if (data.user_actions && data.user_actions.length > 0) {
            allUserActions.push(...data.user_actions);
            totalFetched += data.user_actions.length;
          } else {
            console.log('Activity graph: No more actions to fetch.');
            i = maxOffsetsToTry;
          }
          success = true;

        } catch (error) {
          console.error('Activity graph: Error fetching data page', i + 1, error);
          if (retries >= MAX_RETRIES_429 || (error.message && !error.message.includes("429"))) {
            if (loadingIndicator) updateLoadingMessage(loadingIndicator, `Error fetching data. Displaying partial results if any.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            i = maxOffsetsToTry;
            break;
          }
        }
      }
      if (!success && retries > MAX_RETRIES_429) {
          console.warn("Activity graph: Failed to fetch a page after max retries. Proceeding with fetched data.");
          break;
      }
    }

    console.log(`Activity graph: Fetched ${allUserActions.length} actions in total for ${username}.`);
    const resultData = { user_actions: allUserActions };
    setCachedData(username, resultData);
    return resultData;
  }

  // Function to check if URL matches pattern
  function isUserSummaryPage() {
    return window.location.pathname.match(/^\/u\/[^/]+\/summary$/);
  }

  // Function to remove existing graph and tooltip
  function cleanupPreviousGraph() {
    const existingGraphContainer = document.querySelector('.activity-graph-container');
    if (existingGraphContainer) {
      existingGraphContainer.remove();
    }
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    removeLoadingIndicator();
  }

  // Function to wait for the #user-content element
  function waitForUserContent(callback) {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    let userContent = document.querySelector('#user-content');

    if (userContent) {
      callback(userContent);
      return;
    }

    console.log('Activity graph: Waiting for #user-content element...');
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          userContent = document.querySelector('#user-content');
          if (userContent) {
            console.log('Activity graph: #user-content element found.');
            observer.disconnect();
            callback(userContent);
            return;
          }
        }
      }
    });

    observer.observe(targetNode, config);
  }


  // Main function to initialize the graph
  async function init() {
    if (!isUserSummaryPage()) {
      cleanupPreviousGraph();
      return;
    }

    const usernameMatch = window.location.pathname.match(/^\/u\/([^/]+)\/summary$/);
    if (!usernameMatch || !usernameMatch[1]) {
      console.error('Activity graph: Could not extract username from URL.');
      return;
    }
    const username = usernameMatch[1];

    cleanupPreviousGraph();
    const loadingIndicator = showLoadingIndicator(`Loading activity for ${username}...`);

    waitForUserContent(async (userContent) => {
      userContent.prepend(loadingIndicator);

      try {
        const data = await fetchAllData(username, loadingIndicator);
        if (!data || !data.user_actions) {
            throw new Error("No data fetched or data is invalid.");
        }
        const activityMap = processActivityData(data);
        const graphContainer = createActivityGraph(activityMap);

        userContent.prepend(graphContainer);

      } catch (error) {
        console.error('Activity graph: Error creating graph:', error);
        if (loadingIndicator) updateLoadingMessage(loadingIndicator, `Failed to load activity graph: ${error.message}`);
        const spinner = loadingIndicator.querySelector('.spinner');
        if (spinner) spinner.style.display = 'none';
        return;
      } finally {
          if (loadingIndicator && !loadingIndicator.textContent.toLowerCase().includes("failed") && !loadingIndicator.textContent.toLowerCase().includes("error")) {
              removeLoadingIndicator();
          } else if (loadingIndicator) {
               const spinner = loadingIndicator.querySelector('.spinner');
               if (spinner) spinner.style.display = 'none';
          }
      }
    });
  }

  // Initialize the graph on page load and URL changes
  let lastUrl = location.href;
  const urlChangeObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('Activity graph: URL changed, re-initializing.');
      init();
    }
  });

  urlChangeObserver.observe(document, { subtree: true, childList: true });

  init();

})();