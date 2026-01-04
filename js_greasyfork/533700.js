// ==UserScript==
// @name         Activity Hours Bar Chart
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a bar chart visualization for activity hours
// @author       You
// @match        *://www.flowyer.hu/workhours*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js

// @downloadURL https://update.greasyfork.org/scripts/533700/Activity%20Hours%20Bar%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/533700/Activity%20Hours%20Bar%20Chart.meta.js
// ==/UserScript==

// osszes felirt ora legyen meg
// ugyszam helyett megbizo
// nev a tetejen ha egy van kivalasztva

(function () {
  'use strict';

  // First, add the button to the UI
  function addChartButton() {
    // Target the button container - looking for the "col-auto float-end ms-auto" div in the page header
    const buttonContainer = document.querySelector(
      '.page-header .col-auto.float-end.ms-auto',
    );
    if (!buttonContainer) return;

    // Create the button with similar styling to existing buttons
    const chartButton = document.createElement('a');
    chartButton.href = '#';
    chartButton.className = 'btn add-btn me-3';
    chartButton.innerHTML = '<i class="fa fa-chart-bar"></i> Óra Elemzés';
    chartButton.onclick = function (e) {
      e.preventDefault();
      generateChart();
    };

    // Insert the button before the first child of button container
    buttonContainer.insertBefore(chartButton, buttonContainer.firstChild);
  }

  // Function to parse the workhours table and extract data
  function extractWorkHoursData() {
    const rows = document.querySelectorAll('#workhours tbody tr');
    const data = [];

    rows.forEach((row) => {
      // Get date, client, activity, spent-time, billable-time and case-subject from the row
      const dateCell = row.querySelector('td:nth-child(2)');
      const clientCell = row.querySelector('td:nth-child(3)');
      const activityCell = row.querySelector('td:nth-child(7)');
      const timeSpentCell = row.querySelector('td:nth-child(8)');
      const billableTimeCell = row.querySelector('td:nth-child(9)');
      const caseSubjectCell = row.querySelector('td:nth-child(5)');

      if (dateCell && activityCell && timeSpentCell) {
        // Format date and parse time spent
        const date = dateCell.textContent.trim();
        const client = clientCell ? clientCell.textContent.trim() : '';
        const activity = activityCell.textContent.trim();
        // Replace comma with dot for proper float parsing and handle Hungarian notation
        const timeSpent = parseFloat(
          timeSpentCell.textContent.trim().replace(',', '.'),
        );
        const billableTime = billableTimeCell
          ? parseFloat(billableTimeCell.textContent.trim().replace(',', '.'))
          : 0;
        const caseSubject = caseSubjectCell.textContent.trim();

        data.push({
          date: date,
          client: client,
          activity: activity,
          timeSpent: timeSpent,
          billableTime: billableTime,
          caseSubject: caseSubject,
        });
      }
    });

    return data;
  }

  // Function to prepare the data for Chart.js with stacked bars
  function prepareChartData(data) {
    // Group data by date
    const groupedByDate = {};

    data.forEach((item) => {
      if (!groupedByDate[item.date]) {
        groupedByDate[item.date] = {
          totalTime: 0,
          totalBillableTime: 0,
          activities: [],
        };
      }

      groupedByDate[item.date].totalTime += item.timeSpent;
      groupedByDate[item.date].totalBillableTime += item.billableTime;
      groupedByDate[item.date].activities.push({
        activity: item.activity,
        timeSpent: item.timeSpent,
        billableTime: item.billableTime,
        caseSubject: item.caseSubject,
        client: item.client,
      });
    });

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      const partsA = a.split('.');
      const partsB = b.split('.');
      // Format: YYYY.MM.DD
      const dateA = new Date(partsA[0], partsA[1] - 1, partsA[2]);
      const dateB = new Date(partsB[0], partsB[1] - 1, partsB[2]);
      return dateA - dateB;
    });

    // Prepare datasets for stacked bar chart
    // For more granular breakdown, we'll create datasets based on individual activities
    const datasets = [];

    // Generate a color palette for consistent coloring
    const generateColorPalette = (count) => {
      const palette = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 137.5) % 360; // Use golden ratio to spread colors
        palette.push(`hsl(${hue}, 70%, 60%)`);
      }
      return palette;
    };

    // First, get all unique case subjects for consistent coloring
    const uniqueSubjects = [...new Set(data.map((item) => item.caseSubject))];
    const colorPalette = generateColorPalette(uniqueSubjects.length);
    const subjectColorMap = {};
    uniqueSubjects.forEach((subject, i) => {
      subjectColorMap[subject] = colorPalette[i];
    });

    // For each date, collect individual activity data
    sortedDates.forEach((date, dateIndex) => {
      const activities = groupedByDate[date].activities;

      // First group by client, then by case subject to keep Greskovics entries together
      const clientGroups = {};
      activities.forEach((activity) => {
        const clientKey = activity.client || 'Unknown';
        if (!clientGroups[clientKey]) {
          clientGroups[clientKey] = {};
        }
        if (!clientGroups[clientKey][activity.caseSubject]) {
          clientGroups[clientKey][activity.caseSubject] = [];
        }
        clientGroups[clientKey][activity.caseSubject].push(activity);
      });

      // Sort clients to put Greskovics first, then others alphabetically
      const sortedClients = Object.keys(clientGroups).sort((a, b) => {
        if (a === 'Greskovics Ügyvédi Iroda') return -1;
        if (b === 'Greskovics Ügyvédi Iroda') return 1;
        return a.localeCompare(b);
      });

      // Process each client group
      sortedClients.forEach((client) => {
        const subjectGroups = clientGroups[client];

        // Process each subject group within the client
        Object.keys(subjectGroups)
          .sort()
          .forEach((subject) => {
            const activitiesInSubject = subjectGroups[subject];

            // Add each activity as a separate dataset section
            activitiesInSubject.forEach((activity) => {
              // Check if client is "Greskovics Ügyvédi iroda" and use grey color
              const isGreskovicsClient =
                activity.client === 'Greskovics Ügyvédi Iroda';
              const backgroundColor = isGreskovicsClient
                ? '#808080'
                : subjectColorMap[subject];
              const borderColor = isGreskovicsClient
                ? '#606060'
                : subjectColorMap[subject].replace('60%)', '50%)');

              // Create dataset for this specific activity
              const dataset = {
                label: subject, // Use case subject as label for color grouping
                stack: date, // Stack by date
                data: Array(sortedDates.length).fill(0),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 0,
                // Store details for custom tooltip
                activityDetails: [],
              };

              // Set the data value for this date
              dataset.data[dateIndex] = activity.timeSpent;

              // Store activity details for tooltip
              dataset.activityDetails = {
                activity: activity.activity,
                timeSpent: activity.timeSpent,
                billableTime: activity.billableTime,
                caseSubject: activity.caseSubject,
                client: activity.client,
              };

              datasets.push(dataset);
            });
          });
      });
    });

    // Create formatted labels with month-day and day of week
    const formattedLabels = sortedDates.map((date) => {
      const parts = date.split('.');
      // Format: YYYY.MM.DD -> MM.DD + day of week
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      const monthDay = `${parts[1]}.${parts[2]}`;

      // Get day of week in Hungarian
      const dayNames = [
        'Vasárnap',
        'Hétfő',
        'Kedd',
        'Szerda',
        'Csütörtök',
        'Péntek',
        'Szombat',
      ];
      const dayOfWeek = dayNames[dateObj.getDay()];

      return [monthDay, dayOfWeek];
    });

    // Calculate daily totals for display above bars
    const dailyTotals = sortedDates.map((date) => ({
      totalTime: groupedByDate[date].totalTime,
      totalBillableTime: groupedByDate[date].totalBillableTime,
    }));

    return {
      labels: formattedLabels,
      originalDates: sortedDates, // Keep original dates for reference
      datasets: datasets,
      activities: sortedDates.map((date) => groupedByDate[date].activities),
      subjectColorMap: subjectColorMap,
      dailyTotals: dailyTotals,
    };
  }

  // Function to get the selected colleague name from the table data
  function getSelectedColleagueName() {
    // Get all colleague names from the "Munkatárs" column (column 10, index 9)
    const rows = document.querySelectorAll('#workhours tbody tr');
    const colleagueNames = new Set();

    rows.forEach((row) => {
      const colleagueCell = row.querySelector('td:nth-child(10)'); // Munkatárs column
      if (colleagueCell) {
        const name = colleagueCell.textContent.trim();
        if (name) {
          colleagueNames.add(name);
        }
      }
    });

    // If there's exactly one unique colleague name, return it
    if (colleagueNames.size === 1) {
      return Array.from(colleagueNames)[0];
    }

    // If multiple colleagues or none, return null (showing all colleagues)
    return null;
  }

  // Create and show the chart modal
  function showChartModal(chartData) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalOverlay.style.zIndex = '9999';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.width = '85%';
    modalContent.style.maxWidth = '1200px';
    modalContent.style.maxHeight = '85%';
    modalContent.style.overflow = 'auto';

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.marginBottom = '20px';

    // Get selected colleague name and create title
    const selectedColleague = getSelectedColleagueName();
    const modalTitle = document.createElement('h3');
    if (selectedColleague) {
      modalTitle.textContent = `Napi Óranyilvántartás Elemzés - ${selectedColleague}`;
    } else {
      modalTitle.textContent = 'Napi Óranyilvántartás Elemzés';
    }

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0 10px';
    closeButton.onclick = function () {
      document.body.removeChild(modalOverlay);
    };

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.height = '400px';

    const canvas = document.createElement('canvas');
    canvas.id = 'activityChart';
    chartContainer.appendChild(canvas);

    // Create summary container
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'period-summary';
    summaryContainer.style.marginTop = '20px';
    summaryContainer.style.padding = '15px';
    summaryContainer.style.backgroundColor = '#f8f9fa';
    summaryContainer.style.borderRadius = '5px';
    summaryContainer.style.border = '1px solid #dee2e6';

    // Create activity details container
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'activity-details';
    detailsContainer.style.marginTop = '20px';
    detailsContainer.style.maxHeight = '300px';
    detailsContainer.style.overflow = 'auto';

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(chartContainer);
    modalContent.appendChild(summaryContainer);
    modalContent.appendChild(detailsContainer);
    modalOverlay.appendChild(modalContent);

    document.body.appendChild(modalOverlay);

    // Initialize the chart
    createChart(canvas, chartData, detailsContainer, summaryContainer);
  }

  // Function to create and populate the period summary
  function createPeriodSummary(chartData, summaryContainer) {
    // Calculate total hours across all days
    let totalHours = 0;
    chartData.activities.forEach((dayActivities) => {
      dayActivities.forEach((activity) => {
        totalHours += activity.timeSpent;
      });
    });

    // Calculate average hours per day
    const totalDays = chartData.labels.length;
    const averageHours = totalDays > 0 ? totalHours / totalDays : 0;

    // Create summary content
    summaryContainer.innerHTML = `
      <h4 style="margin: 0 0 10px 0; color: #495057;">Időszak Összesítő</h4>
      <div style="display: flex; gap: 30px; align-items: center;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #007bff;">${totalHours.toFixed(
            2,
          )}</div>
          <div style="font-size: 14px; color: #6c757d;">Összes óra</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #28a745;">${averageHours.toFixed(
            2,
          )}</div>
          <div style="font-size: 14px; color: #6c757d;">Átlag óra/nap</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #6c757d;">${totalDays}</div>
          <div style="font-size: 14px; color: #6c757d;">Napok száma</div>
        </div>
      </div>
    `;
  }

  // Create the Chart.js chart with stacked bars
  function createChart(canvas, chartData, detailsContainer, summaryContainer) {
    const ctx = canvas.getContext('2d');

    // Create the period summary
    createPeriodSummary(chartData, summaryContainer);

    // Create a custom legend element
    const legendContainer = document.createElement('div');
    legendContainer.className = 'chart-legend';
    legendContainer.style.marginTop = '10px';
    legendContainer.style.display = 'flex';
    legendContainer.style.flexWrap = 'wrap';
    legendContainer.style.justifyContent = 'center';

    // Add legend items for each unique case subject
    Object.entries(chartData.subjectColorMap).forEach(([subject, color]) => {
      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.margin = '0 10px 5px 0';

      const colorBox = document.createElement('div');
      colorBox.style.width = '12px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = color;
      colorBox.style.marginRight = '5px';

      const label = document.createElement('span');
      label.textContent =
        subject.length > 30 ? subject.substring(0, 30) + '...' : subject;
      label.style.fontSize = '12px';

      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendContainer.appendChild(legendItem);
    });

    // Insert legend before details container
    canvas.parentNode.parentNode.insertBefore(
      legendContainer,
      detailsContainer,
    );

    // Register custom plugin for displaying totals
    const totalDisplayPlugin = {
      id: 'totalDisplay',
      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;

        chart.data.labels.forEach((label, index) => {
          const dailyTotal = chartData.dailyTotals[index];
          const totalTime = dailyTotal.totalTime.toFixed(1);
          const totalBillable = dailyTotal.totalBillableTime.toFixed(1);
          const displayText = `${totalTime} (${totalBillable})`;

          // Calculate the total height for this column to position text above it
          let columnTotal = 0;
          chart.data.datasets.forEach((dataset) => {
            if (dataset.data[index] > 0) {
              columnTotal += dataset.data[index];
            }
          });

          // Position text above the column
          const x =
            chart.chartArea.left +
            (index + 0.5) * (chart.chartArea.width / chart.data.labels.length);

          // Calculate Y position based on the column total
          const yScale = chart.scales.y;
          const y = yScale.getPixelForValue(columnTotal) - 5;

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#333';
          ctx.font = '14px Arial';
          ctx.fillText(displayText, x, y);
          ctx.restore();
        });
      },
    };

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets,
      },
      plugins: [totalDisplayPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: 'Eltöltött idő (óra)',
            },
          },
          x: {
              stacked: false,
            title: {
              display: true,
              text: 'Dátum',
            },
            offset: true,
            grid: {
              offset: true,
            },
          },
        },
        interaction: {
          mode: 'point',
          intersect: true,
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const index = element.index;
            const originalDate = chartData.originalDates[index];
            const activities = chartData.activities[index];

            // Show all activities for that day
            showActivityDetails(originalDate, activities, detailsContainer);
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              // Custom tooltip to show only the hovered activity
              title: function (tooltipItems) {
                const item = tooltipItems[0];
                return `${chartData.originalDates[item.dataIndex]}`;
              },
              label: function (tooltipItem) {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                const details = dataset.activityDetails;

                if (!details) return '';

                return `${details.caseSubject}: ${details.timeSpent.toFixed(
                  2,
                )} óra`;
              },
              afterLabel: function (tooltipItem) {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                const details = dataset.activityDetails;

                if (!details) return '';

                // Format activity text - break into multiple lines if long
                const activity = details.activity;
                const maxLineLength = 50;

                if (activity.length <= maxLineLength) {
                  return activity;
                }

                // Split long text into multiple lines
                const words = activity.split(' ');
                let lines = [];
                let currentLine = '';

                words.forEach((word) => {
                  if ((currentLine + ' ' + word).length <= maxLineLength) {
                    currentLine += (currentLine ? ' ' : '') + word;
                  } else {
                    lines.push(currentLine);
                    currentLine = word;
                  }
                });

                if (currentLine) {
                  lines.push(currentLine);
                }

                return lines;
              },
            },
          },
          // Disable Chart.js legend, we're using custom legend
          legend: {
            display: false,
          },
        },
        // Make bars wider
        barPercentage: 90,
        categoryPercentage: 0.13,
        alignToPixels: true,
      },
    });

    // Show details for the first date by default
    if (chartData.originalDates.length > 0) {
      showActivityDetails(
        chartData.originalDates[0],
        chartData.activities[0],
        detailsContainer,
      );
    }
  }

  // Show activity details for a selected date
  function showActivityDetails(date, activities, container) {
    container.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = `Aktivitások (${date}) - Összesen: ${activities.length}`;
    container.appendChild(title);

    // Calculate total hours
    const totalHours = activities.reduce((sum, act) => sum + act.timeSpent, 0);

    const totalInfo = document.createElement('p');
    totalInfo.innerHTML = `<strong>Összes eltöltött idő: ${totalHours.toFixed(
      2,
    )} óra</strong>`;
    container.appendChild(totalInfo);

    const table = document.createElement('table');
    table.className = 'table table-striped';
    table.style.width = '100%';
    table.style.tableLayout = 'fixed'; // Fixed layout to control column widths

    const thead = document.createElement('thead');
    thead.innerHTML = `
            <tr>
                <th style="width: 25%">Ügy tárgya</th>
                <th style="width: 65%">Tevékenység</th>
                <th style="width: 10%; text-align: center">Idő (óra)</th>
            </tr>
        `;

    const tbody = document.createElement('tbody');

    // Group activities by case subject
    const groupedActivities = {};

    activities.forEach((activity) => {
      if (!groupedActivities[activity.caseSubject]) {
        groupedActivities[activity.caseSubject] = [];
      }
      groupedActivities[activity.caseSubject].push(activity);
    });

    // Sort case subjects alphabetically
    const sortedSubjects = Object.keys(groupedActivities).sort();

    sortedSubjects.forEach((subject) => {
      const subjectActivities = groupedActivities[subject];

      // Calculate subtotal for this case subject
      const subjectTotal = subjectActivities.reduce(
        (sum, act) => sum + act.timeSpent,
        0,
      );

      // Sort activities by time spent (descending)
      subjectActivities.sort((a, b) => b.timeSpent - a.timeSpent);

      // If there's only one activity for this subject, display in a single row
      if (subjectActivities.length === 1) {
        const activity = subjectActivities[0];
        const row = document.createElement('tr');
        row.style.backgroundColor = '#f0f0f0';

        const subjectCell = document.createElement('td');
        subjectCell.style.fontWeight = 'bold';
        subjectCell.style.wordWrap = 'break-word';
        subjectCell.style.whiteSpace = 'pre-wrap';
        subjectCell.textContent = subject;

        const activityCell = document.createElement('td');
        activityCell.style.wordWrap = 'break-word';
        activityCell.style.whiteSpace = 'pre-wrap';
        activityCell.textContent = activity.activity;

        const timeCell = document.createElement('td');
        timeCell.style.textAlign = 'center';
        timeCell.style.fontWeight = 'bold';
        timeCell.textContent = activity.timeSpent.toFixed(2);

        row.appendChild(subjectCell);
        row.appendChild(activityCell);
        row.appendChild(timeCell);
        tbody.appendChild(row);
      } else {
        // For multiple activities, use a header row and individual activity rows
        // Add a subject header row
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#f0f0f0';

        const headerCell = document.createElement('td');
        headerCell.colSpan = 2;
        headerCell.style.fontWeight = 'bold';
        headerCell.textContent = subject;

        const totalCell = document.createElement('td');
        totalCell.style.textAlign = 'center';
        totalCell.style.fontWeight = 'bold';
        totalCell.textContent = subjectTotal.toFixed(2);

        headerRow.appendChild(headerCell);
        headerRow.appendChild(totalCell);
        tbody.appendChild(headerRow);

        // Add individual activity rows
        subjectActivities.forEach((activity) => {
          const row = document.createElement('tr');

          // Skip the subject cell since we're grouping
          const emptyCell = document.createElement('td');
          emptyCell.textContent = '';

          const activityCell = document.createElement('td');
          activityCell.style.wordWrap = 'break-word';
          activityCell.style.whiteSpace = 'pre-wrap';
          activityCell.textContent = activity.activity;

          const timeCell = document.createElement('td');
          timeCell.style.textAlign = 'center';
          timeCell.textContent = activity.timeSpent.toFixed(2);

          row.appendChild(emptyCell);
          row.appendChild(activityCell);
          row.appendChild(timeCell);

          tbody.appendChild(row);
        });
      }
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    // Add a total row at the end
    const totalRow = document.createElement('tfoot');
    totalRow.innerHTML = `
            <tr>
                <td colspan="2" style="text-align: right"><strong>Összesen:</strong></td>
                <td style="text-align: center"><strong>${totalHours.toFixed(
                  2,
                )}</strong></td>
            </tr>
        `;
    table.appendChild(totalRow);

    container.appendChild(table);
  }

  // Function to ensure all elements are loaded and set pagination to 'Összes'
  function ensureAllElementsLoaded() {
    return new Promise((resolve, reject) => {
      // First, check if the pagination dropdown exists
      const checkPagination = () => {
        const paginationDropdown = document.querySelector(
          '.fixed-table-pagination .btn-group.dropdown.dropup',
        );
        const paginationButton = document.querySelector(
          '.fixed-table-pagination .btn-group.dropdown.dropup button',
        );
        const pageSizeSpan = document.querySelector(
          '.fixed-table-pagination .page-size',
        );

        if (!paginationDropdown || !paginationButton || !pageSizeSpan) {
          return false;
        }

        // Check if 'Összes' option is available
        const dropdownMenu = paginationDropdown.querySelector('.dropdown-menu');
        if (!dropdownMenu) {
          return false;
        }

        const osszesOption = Array.from(
          dropdownMenu.querySelectorAll('a.dropdown-item'),
        ).find((item) => item.textContent.trim() === 'Összes');

        return !!osszesOption;
      };

      // Function to set pagination to 'Összes'
      const setPaginationToOsszes = () => {
        const paginationDropdown = document.querySelector(
          '.fixed-table-pagination .btn-group.dropdown.dropup',
        );
        const dropdownMenu = paginationDropdown.querySelector('.dropdown-menu');
        const osszesOption = Array.from(
          dropdownMenu.querySelectorAll('a.dropdown-item'),
        ).find((item) => item.textContent.trim() === 'Összes');

        if (osszesOption && !osszesOption.classList.contains('active')) {
          console.log('Setting pagination to Összes...');
          osszesOption.click();
          return true;
        }
        return false;
      };

      // Function to wait for table to be fully loaded after pagination change
      const waitForTableLoad = () => {
        return new Promise((tableResolve) => {
          let attempts = 0;
          const maxAttempts = 10; // 10 seconds max wait
          let previousRowCount = 0;
          let stableCount = 0;

          const checkTableLoaded = () => {
            attempts++;
            const tableRows = document.querySelectorAll('#workhours tbody tr');
            const loadingIndicator = document.querySelector(
              '.fixed-table-loading',
            );
            const paginationInfo = document.querySelector('.pagination-info');

            // Check if we have a stable row count (hasn't changed for a few checks)
            if (tableRows.length === previousRowCount && tableRows.length > 0) {
              stableCount++;
            } else {
              stableCount = 0;
              previousRowCount = tableRows.length;
            }

            // Check if loading is complete
            const isLoadingComplete =
              !loadingIndicator ||
              loadingIndicator.style.display === 'none' ||
              !loadingIndicator.offsetParent;

            // Additional check: look for "Összes" in pagination info
            const showingAllRecords =
              paginationInfo &&
              (paginationInfo.textContent.includes('Összes') ||
                !paginationInfo.textContent.includes('/'));

            if (
              isLoadingComplete &&
              tableRows.length > 0 &&
              (stableCount >= 3 || showingAllRecords)
            ) {
              console.log(
                `Table loaded with ${tableRows.length} rows (stable for ${stableCount} checks)`,
              );
              // Add extra delay to ensure DOM is fully updated
              setTimeout(() => tableResolve(), 500);
              return;
            }

            if (attempts >= maxAttempts) {
              console.warn(
                `Table loading timeout after ${attempts} attempts, proceeding with ${tableRows.length} rows...`,
              );
              tableResolve();
              return;
            }

            setTimeout(checkTableLoaded, 10);
          };

          // Start checking after a small initial delay
          setTimeout(checkTableLoaded, 10);
        });
      };

      // Main logic
      let attempts = 0;
      const maxAttempts = 10; // 10 seconds max wait

      const checkAndSetup = async () => {
        attempts++;

        if (checkPagination()) {
          console.log('Pagination elements found');

          // Set pagination to 'Összes' if not already set
          const paginationChanged = setPaginationToOsszes();

          // Always wait for table to be fully loaded, regardless of whether pagination changed
          // This ensures we have all data even if "Összes" was already selected
          console.log('Waiting for table to be fully loaded...');
          await waitForTableLoad();

          // Final check that we have data
          const tableRows = document.querySelectorAll('#workhours tbody tr');
          if (tableRows.length > 0) {
            console.log('All elements loaded and ready');
            resolve();
          } else {
            console.warn('No table rows found, but proceeding anyway');
            resolve();
          }
          return;
        }

        if (attempts >= maxAttempts) {
          console.warn(
            'Timeout waiting for elements to load, proceeding anyway...',
          );
          resolve();
          return;
        }

        setTimeout(checkAndSetup, 100);
      };

      checkAndSetup();
    });
  }

  // Main function to generate the chart
  async function generateChart() {
    try {
      console.log('Starting chart generation...');

      // Ensure all elements are loaded and pagination is set to 'Összes'
      await ensureAllElementsLoaded();

      console.log('Extracting work hours data...');
      const workHoursData = extractWorkHoursData();

      if (workHoursData.length === 0) {
        alert(
          'Nem található óranyilvántartási adat. Kérjük, ellenőrizze, hogy vannak-e adatok a táblázatban.',
        );
        return;
      }

      console.log(`Found ${workHoursData.length} work hour entries`);

      const chartData = prepareChartData(workHoursData);
      showChartModal(chartData);
    } catch (error) {
      console.error('Error generating chart:', error);
      alert('Hiba történt a diagram generálása során. Kérjük, próbálja újra.');
    }
  }

  // Add the button when the page is loaded
  window.addEventListener('load', function () {
    // Wait a bit to ensure the page is fully loaded
    setTimeout(addChartButton, 1000);
  });
})();
