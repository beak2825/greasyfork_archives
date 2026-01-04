// ==UserScript==
// @name         Work Clock-Out Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Calculate when to clock out based on clock-in times and lunch break requirements
// @author       You
// @match        https://abacus.casale.ch/portal/myabacus/proj_inandout*
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536089/Work%20Clock-Out%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/536089/Work%20Clock-Out%20Calculator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add CSS for better UI
  GM_addStyle(`
        #clock-calculator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #f8f9fa;
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            width: 400px;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        .calculator-header {
            background-color: #4CAF50;
            color: white;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .calculator-header h3 {
            margin: 0;
            font-size: 16px;
        }
        .calculator-body {
            padding: 15px;
        }
        .current-time {
            background-color: #e8f5e9;
            padding: 8px 15px;
            font-size: 15px;
            border-bottom: 1px solid #c8e6c9;
            text-align: center;
            font-weight: bold;
        }
        .info-section {
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.5;
        }
        .info-section .label {
            color: #666;
            display: inline-block;
            width: 150px;
        }
        .info-section .value {
            font-weight: bold;
            color: #333;
        }
        .flex-hours-section {
            background-color: #e3f2fd;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
            border-left: 4px solid #1976d2;
        }
        .flex-hours-header {
            font-weight: bold;
            margin-bottom: 8px;
            color: #1976d2;
            border-bottom: 1px solid #bbdefb;
            padding-bottom: 5px;
        }
        .result-section {
            background-color: #f1f8e9;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        #clock-out-time {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
            text-align: center;
        }
        #time-remaining {
            color: #0066cc;
            margin-bottom: 5px;
            font-size: 15px;
            text-align: center;
        }
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 12px 0;
        }
        .calculator-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
            transition: background-color 0.2s;
        }
        .calculator-btn:hover {
            background-color: #388E3C;
        }
        .calculator-footer {
            display: flex;
            justify-content: space-between;
        }
        #close-calculator {
            background-color: #f44336;
        }
        #close-calculator:hover {
            background-color: #d32f2f;
        }
        .warning {
            color: #e65100;
            font-weight: bold;
        }
        .highlight {
            color: #2E7D32;
            font-weight: bold;
        }
        .smart-working-container {
            display: flex;
            align-items: center;
        }
        .smart-working-container input {
            margin-right: 5px;
        }
        .smart-working-container label {
            font-size: 13px;
            white-space: nowrap;
        }
        .help-text {
            font-size: 12px;
            font-style: italic;
            color: #555;
            margin-top: 2px;
            margin-left: 150px; 
        }
    `);

  // Create the UI for the calculator
  function createUI() {
    // Check if the calculator already exists
    if (document.getElementById('clock-calculator')) {
      return; // Do not create multiple instances
    }

    const container = document.createElement('div');
    container.id = 'clock-calculator';

    // Get the saved smart working state
    const isSmartWorking = GM_getValue('smartWorking', false);

    container.innerHTML = `
            <div class="calculator-header">
                <h3>Clock-Out Calculator v${GM_info.script.version}</h3>
                <div class="smart-working-container">
                    <input type="checkbox" id="smart-working" ${
                      isSmartWorking ? 'checked' : ''
                    }>
                    <label for="smart-working">Smart Working</label>
                </div>
            </div>
            <div class="current-time" id="current-time">Current Time: Loading...</div>
            <div class="calculator-body">
                <div class="info-section" id="clock-info">Loading clock data...</div>
                <div id="flex-hours-container"></div>
                <div class="divider"></div>
                <div class="result-section">
                    <div id="clock-out-time"></div>
                    <div id="time-remaining"></div>
                </div>
                <div class="calculator-footer">
                    <button id="refresh-clock-data" class="calculator-btn">Refresh Data</button>
                    <button id="close-calculator" class="calculator-btn">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(container);

    // Add event listeners to buttons
    document
      .getElementById('refresh-clock-data')
      .addEventListener('click', calculateClockOutTime);
    document
      .getElementById('close-calculator')
      .addEventListener('click', function () {
        document.getElementById('clock-calculator').style.display = 'none';
        document.getElementById('show-clock-calculator').style.display =
          'block'; // Show the toggle button again
      });

    // Add event listener to smart working checkbox
    document
      .getElementById('smart-working')
      .addEventListener('change', function () {
        GM_setValue('smartWorking', this.checked);
        calculateClockOutTime();
      });

    // Initial calculation
    calculateClockOutTime();

    // Set up auto-refresh timer (every minute)
    setInterval(calculateClockOutTime, 60000);
  }

  // Parse time string in 24h format to Date object
  function parseTime(timeStr) {
    if (!timeStr) return null;

    const now = new Date();
    const [hours, minutes] = timeStr.trim().split(':').map(Number);

    const timeDate = new Date(now);
    timeDate.setHours(hours, minutes, 0, 0);

    return timeDate;
  }

  // Format Date object to HH:MM string
  function formatTime(date) {
    if (!date) return 'N/A';
    return date.toTimeString().substring(0, 5);
  }

  // Calculate time difference in minutes
  function getMinutesDifference(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    return Math.round((endTime - startTime) / (1000 * 60));
  }

  // Main function to calculate clock out time
  function calculateClockOutTime() {
    // Get clock times from the page - USING THE EXACT IDs PROVIDED
    const firstClockInEl =
      document.getElementById('id_from_1') ??
      document.getElementById('id_history_from_1');
    const secondClockInEl =
      document.getElementById('id_to_1') ??
      document.getElementById('id_history_to_1');
    const thirdClockInEl =
      document.getElementById('id_from_2') ??
      document.getElementById('id_history_from_2');

    // Get flexible working hours balance
    const flexElements = Array.from(
      document.querySelectorAll('vaadin-horizontal-layout > div')
    );
    const flexTextElement = flexElements.find((el) =>
      el.textContent.includes('Flexible working hours')
    );
    const balanceElement = flexTextElement?.nextElementSibling;

    // Get current difference
    const diffTextElement = flexElements.find(
      (el) => el.textContent.trim() === 'Difference'
    );
    const diffValueElement = diffTextElement?.nextElementSibling;

    // Parse the flexible hours balance
    let flexibleHoursBalance = null;
    if (balanceElement) {
      const balanceText = balanceElement.textContent.trim();
      flexibleHoursBalance = parseFloat(balanceText);
    }

    // Parse the current time difference
    let timeDifference = null;
    if (diffValueElement) {
      const diffText = diffValueElement.textContent.trim();
      // Remove the 'h' and parse as float
      timeDifference = parseFloat(diffText.replace(' h', ''));
    }

    // Calculate projected balance if clocking out now
    let projectedBalance = null;
    let realTimeDifference = null;
    let previousDayBalance = null;

    // For testing purposes - uncomment to simulate specific time
    //const currentTime = new Date(2025, 4, 16, 19); // 7:00 PM on May 16, 2025
    const currentTime = new Date();

    // Get values from elements, only if they exist and have values
    let firstClockIn =
      firstClockInEl && firstClockInEl.value ? firstClockInEl.value : null;
    let secondClockIn =
      secondClockInEl && secondClockInEl.value ? secondClockInEl.value : null;
    let thirdClockIn =
      thirdClockInEl && thirdClockInEl.value ? thirdClockInEl.value : null;

    // Parse time strings to Date objects
    let firstClockInTime = parseTime(firstClockIn);
    const secondClockInTime = parseTime(secondClockIn);
    const thirdClockInTime = parseTime(thirdClockIn);

    // Calculate real-time difference based on current state of clocks
    if (timeDifference !== null && flexibleHoursBalance !== null) {
      // The current balance already includes the official difference deducted
      // Calculate what the previous day's balance was (before today's difference was applied)
      previousDayBalance = flexibleHoursBalance - timeDifference;

      // Start with the UI displayed difference
      realTimeDifference = timeDifference;

      // Calculate additional time worked since last clock (since UI difference doesn't update in real-time)
      if (firstClockInTime && secondClockInTime && thirdClockInTime) {
        // After lunch break, calculate additional time since 3rd clock
        const additionalMinutesSinceLastClock = getMinutesDifference(
          thirdClockInTime,
          currentTime
        );

        // Convert minutes to hours (decimal)
        const additionalHours = additionalMinutesSinceLastClock / 60;

        // Add this time to the displayed difference
        realTimeDifference += additionalHours;
      } else if (firstClockInTime && secondClockInTime) {
        // On lunch break, difference already accounts for morning work
        // No adjustment needed as user isn't actively working during lunch
      } else if (firstClockInTime) {
        // Only first clock-in, calculate time since first clock-in
        const minutesWorkedSoFar = getMinutesDifference(
          firstClockInTime,
          currentTime
        );

        // Standard workday in hours
        const standardHours = 8;

        // Convert minutes to hours and calculate difference from standard day
        const hoursWorkedSoFar = minutesWorkedSoFar / 60;

        // If it's a fresh day with just first clock, difference is (worked so far - standard workday)
        // We're assuming that the displayed difference is 0 at this point
        realTimeDifference = hoursWorkedSoFar - standardHours;
      }

      // Calculate projected balance when clocking out now
      // Current balance already has the official difference applied, so we need to:
      // 1. Add the additional time (real time diff - official diff)
      const additionalTime = realTimeDifference - timeDifference;
      projectedBalance = flexibleHoursBalance + additionalTime;
    }

    // Get the clock info element
    const clockInfoEl = document.getElementById('clock-info');
    const clockOutTimeEl = document.getElementById('clock-out-time');
    const timeRemainingEl = document.getElementById('time-remaining');
    const currentTimeEl = document.getElementById('current-time');
    const flexHoursContainer = document.getElementById('flex-hours-container');

    // If calculator elements don't exist in DOM, show error
    if (
      !clockInfoEl ||
      !clockOutTimeEl ||
      !timeRemainingEl ||
      !currentTimeEl ||
      !flexHoursContainer
    ) {
      console.error('Clock calculator elements not found in DOM');
      return;
    }

    // Check if smart working is enabled
    const isSmartWorking =
      document.getElementById('smart-working')?.checked ||
      GM_getValue('smartWorking', false);

    // Update current time display
    currentTimeEl.innerHTML = `Current Time: <span class="highlight">${formatTime(
      currentTime
    )}</span>`;

    // Apply constraints to first clock in time based on Smart Working setting
    let originalFirstClockIn = null;
    if (firstClockInTime) {
      const minStartHour = isSmartWorking ? 7 : 8;
      const minStartTime = new Date(firstClockInTime);
      minStartTime.setHours(minStartHour, 0, 0, 0);

      if (firstClockInTime < minStartTime) {
        originalFirstClockIn = formatTime(firstClockInTime);
        firstClockInTime = minStartTime;
        firstClockIn = formatTime(firstClockInTime);
      }
    }

    let clockOutTime;
    let totalWorkMinutes = 480; // Default to 8 hours (480 minutes)
    let lunchBreakMinutes = 0;
    let minimumLunchBreak = 45; // default to 45 minutes
    let infoText = '';
    let flexHoursText = '';

    // Handle case where no clock times are found
    if (!firstClockInTime) {
      clockInfoEl.innerHTML =
        "No clock-in times found. Please ensure you're on the correct timesheet page.";
      clockOutTimeEl.innerHTML = '';
      timeRemainingEl.innerHTML = '';
      flexHoursContainer.innerHTML = '';
      return;
    }

    // Calculate if this will be a 9+ hour day
    let willWorkNineOrMore = false;
    let totalProjectedMinutes = 0;

    // Display Mode information first
    infoText += `<div><span class="label">Mode:</span> <span class="value">${
      isSmartWorking ? 'Smart Working (WFH)' : 'Office'
    }</span></div>`;
    infoText += `<div><span class="label">Min Start Time:</span> <span class="value">${
      isSmartWorking ? '07:00' : '08:00'
    }</span></div>`;

    // Build the flexible hours section separately
    if (flexibleHoursBalance !== null && !isNaN(flexibleHoursBalance)) {
      flexHoursText = '<div class="flex-hours-section">';
      flexHoursText +=
        '<div class="flex-hours-header">Flexible Hours Balance (Only for current day)</div>';

      const balanceClass = flexibleHoursBalance >= 0 ? 'highlight' : 'warning';
      flexHoursText += `<div><span class="label">Current Balance:</span> <span class="value ${balanceClass}">${flexibleHoursBalance.toFixed(
        2
      )} h</span></div>`;

      if (timeDifference !== null && !isNaN(timeDifference)) {
        const diffClass = timeDifference >= 0 ? 'highlight' : 'warning';
        flexHoursText += `<div><span class="label">Official Difference:</span> <span class="value ${diffClass}">${timeDifference.toFixed(
          2
        )} h</span></div>`;

        // Display previous day's balance for clarity
        if (previousDayBalance !== null) {
          const prevBalanceClass =
            previousDayBalance >= 0 ? 'highlight' : 'warning';
          flexHoursText += `<div><span class="label">Yesterday's Balance:</span> <span class="value ${prevBalanceClass}">${previousDayBalance.toFixed(
            2
          )} h</span></div>`;
        }

        // If we have a real-time calculated difference that's different from the official one
        if (
          realTimeDifference !== null &&
          Math.abs(realTimeDifference - timeDifference) > 0.01
        ) {
          const realDiffClass =
            realTimeDifference >= 0 ? 'highlight' : 'warning';
          flexHoursText += `<div><span class="label">Real-time Difference:</span> <span class="value ${realDiffClass}">${realTimeDifference.toFixed(
            2
          )} h</span></div>`;

          // Remove the time beyond official display as requested
        }

        // Calculate projected balance when clocking out now
        if (projectedBalance !== null) {
          const projClass = projectedBalance >= 0 ? 'highlight' : 'warning';
          flexHoursText += `<div><span class="label">Balance If Clock Out Now:</span> <span class="value ${projClass}">${projectedBalance.toFixed(
            2
          )} h</span></div>`;
        }
      }

      flexHoursText += '</div>';

      // Update the flex hours container
      flexHoursContainer.innerHTML = flexHoursText;
    } else {
      flexHoursContainer.innerHTML = '';
    }

    // Display the first clock-in time
    infoText += `<div><span class="label">First Clock In:</span> <span class="value">${formatTime(
      firstClockInTime
    )}`;
    if (originalFirstClockIn) {
      infoText += ` <span class="warning">(Adjusted from ${originalFirstClockIn})</span>`;
    }
    infoText += `</span></div>`;

    // Calculate based on available clock times
    if (firstClockInTime && secondClockInTime && thirdClockInTime) {
      // We have all three clock times, so lunch break is from second to third
      infoText += `<div><span class="label">Lunch Start:</span> <span class="value">${formatTime(
        secondClockInTime
      )}</span></div>`;
      infoText += `<div><span class="label">Lunch End:</span> <span class="value">${formatTime(
        thirdClockInTime
      )}</span></div>`;

      // Calculate actual lunch break taken
      lunchBreakMinutes = getMinutesDifference(
        secondClockInTime,
        thirdClockInTime
      );
      infoText += `<div><span class="label">Actual Lunch:</span> <span class="value">${lunchBreakMinutes} min</span></div>`;

      // Calculate total elapsed time for the day (from first clock in to current time, minus lunch)
      const totalElapsedMinutes =
        getMinutesDifference(firstClockInTime, currentTime) - lunchBreakMinutes;

      // For projected work, use the larger of standard day or elapsed time
      totalProjectedMinutes = Math.max(totalElapsedMinutes, totalWorkMinutes);

      // Check if this is going to be a 9+ hour workday
      willWorkNineOrMore = totalProjectedMinutes >= 540;

      // Calculate morning work minutes (for clock-out calculation)
      const morningWorkMinutes = getMinutesDifference(
        firstClockInTime,
        secondClockInTime
      );

      // Calculate clock-out time
      clockOutTime = new Date(thirdClockInTime);
      clockOutTime.setMinutes(
        clockOutTime.getMinutes() + (totalWorkMinutes - morningWorkMinutes)
      );
    } else if (firstClockInTime && secondClockInTime) {
      // We have first and second clock times, assume second is lunch start and user hasn't returned yet
      infoText += `<div><span class="label">Lunch Start:</span> <span class="value">${formatTime(
        secondClockInTime
      )}</span></div>`;
      infoText += `<div><span class="label">Lunch End:</span> <span class="value">Not yet clocked</span></div>`;

      // Calculate work minutes before lunch
      const morningWorkMinutes = getMinutesDifference(
        firstClockInTime,
        secondClockInTime
      );

      // Calculate current lunch duration
      lunchBreakMinutes = getMinutesDifference(secondClockInTime, currentTime);

      // Calculate total elapsed time from first clock in to current time
      const totalElapsedWithLunch = getMinutesDifference(
        firstClockInTime,
        currentTime
      );

      // For projected time, assume they'll work the standard day length after lunch
      totalProjectedMinutes = Math.max(
        totalElapsedWithLunch,
        totalWorkMinutes + lunchBreakMinutes
      );
      willWorkNineOrMore = totalProjectedMinutes >= 540;

      // Calculate potential clock-out time if user returned from lunch now
      const potentialReturnTime = new Date();

      // Calculate clock-out time assuming user returns now
      clockOutTime = new Date(potentialReturnTime);
      clockOutTime.setMinutes(
        clockOutTime.getMinutes() + (totalWorkMinutes - morningWorkMinutes)
      );

      infoText += `<div><span class="label">Current Lunch:</span> <span class="value">${lunchBreakMinutes} min</span></div>`;
    } else if (firstClockInTime) {
      // We only have first clock in, no lunch break yet
      infoText += `<div><span class="label">Lunch Start:</span> <span class="value">Not yet clocked</span></div>`;
      infoText += `<div><span class="label">Lunch End:</span> <span class="value">Not yet clocked</span></div>`;

      // Calculate total elapsed time from first clock in to current time
      const totalElapsedMinutes = getMinutesDifference(
        firstClockInTime,
        currentTime
      );

      // For projected time, use the larger of elapsed time or standard day
      totalProjectedMinutes = Math.max(totalElapsedMinutes, totalWorkMinutes);
      willWorkNineOrMore = totalProjectedMinutes >= 540;

      // Calculate earliest possible clock-out time (assuming minimum lunch break)
      clockOutTime = new Date(firstClockInTime);
      clockOutTime.setMinutes(
        clockOutTime.getMinutes() + totalWorkMinutes + minimumLunchBreak
      );
    }

    // Set minimum lunch break requirement based on projected work hours
    if (willWorkNineOrMore) {
      minimumLunchBreak = 60;
    }

    // Display projected work hours
    const projectedHours = Math.floor(totalProjectedMinutes / 60);
    const projectedMins = totalProjectedMinutes % 60;
    infoText += `<div><span class="label">Projected Hours:</span> <span class="value">${projectedHours}h ${projectedMins}m`;
    if (willWorkNineOrMore) {
      infoText += ` <span class="warning">(9+ hour day)</span>`;
    }
    infoText += `</span></div>`;

    // Display lunch requirements
    infoText += `<div><span class="label">Required Lunch:</span> <span class="value">${minimumLunchBreak} min</span></div>`;

    // Check if we need to adjust clock-out time due to lunch break requirements
    if (firstClockInTime && secondClockInTime && thirdClockInTime) {
      // If the actual lunch break was shorter than required, adjust clock-out time
      if (lunchBreakMinutes < minimumLunchBreak) {
        const additionalMinutes = minimumLunchBreak - lunchBreakMinutes;
        clockOutTime.setMinutes(clockOutTime.getMinutes() + additionalMinutes);
        infoText += `<div class="warning">Short lunch! Adding ${additionalMinutes} min to total time.</div>`;
      }
    } else if (firstClockInTime && secondClockInTime) {
      // If current lunch break is shorter than required, adjust clock-out time
      if (lunchBreakMinutes < minimumLunchBreak) {
        const additionalMinutes = minimumLunchBreak - lunchBreakMinutes;
        clockOutTime.setMinutes(clockOutTime.getMinutes() + additionalMinutes);
        infoText += `<div class="warning">If you clock in now, lunch break (${lunchBreakMinutes} min) is shorter than required.</div>`;
      }
    }

    // Display clock-out time
    clockInfoEl.innerHTML = infoText;
    clockOutTimeEl.innerHTML = `Recommended Clock Out: <span style="font-size: 18px; color: #2E7D32;">${formatTime(
      clockOutTime
    )}</span>`;

    // Calculate and display time remaining
    let workMinutesRemaining = 0;

    if (firstClockInTime && secondClockInTime && thirdClockInTime) {
      // Already had lunch, just calculate remaining from current time to clock out
      const workedSoFar =
        getMinutesDifference(firstClockInTime, secondClockInTime) +
        getMinutesDifference(thirdClockInTime, currentTime);
      workMinutesRemaining = totalWorkMinutes - workedSoFar;
    } else if (firstClockInTime && secondClockInTime) {
      // On lunch break, calculate work remaining after lunch
      const workedSoFar = getMinutesDifference(
        firstClockInTime,
        secondClockInTime
      );
      workMinutesRemaining = totalWorkMinutes - workedSoFar;
    } else if (firstClockInTime) {
      // No lunch break yet, calculate remaining based on work so far
      const workedSoFar = getMinutesDifference(firstClockInTime, currentTime);
      workMinutesRemaining = totalWorkMinutes - workedSoFar;
    }

    // Make sure we don't show negative time
    workMinutesRemaining = Math.max(0, workMinutesRemaining);

    if (workMinutesRemaining > 0) {
      const hoursRemaining = Math.floor(workMinutesRemaining / 60);
      const minsRemaining = workMinutesRemaining % 60;
      let timeRemainingText = 'Work time remaining: ';

      if (hoursRemaining > 0) {
        timeRemainingText += `${hoursRemaining} hr `;
      }
      if (minsRemaining > 0 || hoursRemaining === 0) {
        timeRemainingText += `${minsRemaining} min`;
      }

      timeRemainingEl.innerHTML = timeRemainingText;
    } else {
      timeRemainingEl.innerHTML =
        '<span style="color: #2E7D32; font-weight: bold;">You can clock out now!</span>';
    }
  }

  // Create a floating button to toggle the calculator
  function createToggleButton() {
    const button = document.createElement('button');
    button.id = 'show-clock-calculator';
    button.textContent = 'Calculate Clock-Out';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 9998;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-weight: bold;
      transition: background-color 0.2s, transform 0.1s;
    `;

    document.body.appendChild(button);

    button.addEventListener('mouseover', function () {
      this.style.backgroundColor = '#388E3C';
    });

    button.addEventListener('mouseout', function () {
      this.style.backgroundColor = '#4CAF50';
    });

    button.addEventListener('mousedown', function () {
      this.style.transform = 'scale(0.97)';
    });

    button.addEventListener('mouseup', function () {
      this.style.transform = 'scale(1)';
    });

    button.addEventListener('click', function () {
      // Check if calculator exists
      let calculator = document.getElementById('clock-calculator');

      if (calculator) {
        // Toggle visibility
        calculator.style.display =
          calculator.style.display === 'none' ? 'block' : 'none';
      } else {
        // Create the calculator
        createUI();
      }

      // Hide the toggle button
      this.style.display = 'none';
    });
  }

  // Initialize after a slight delay to ensure page loads
  setTimeout(function () {
    createToggleButton();
  }, 1500);
})();
