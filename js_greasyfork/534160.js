// ==UserScript==
// @name         parkrun Wilson index display
// @description  The "Wilson index" in parkrun is the highest consecutive event number completed, starting from #1. This script calculates and displays a parkrunner's Wilson index on their results page.
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/parkrunner/*/all/
// @match        *://www.parkrun.co.at/parkrunner/*/all/
// @match        *://www.parkrun.co.nl/parkrunner/*/all/
// @match        *://www.parkrun.co.nz/parkrunner/*/all/
// @match        *://www.parkrun.co.za/parkrunner/*/all/
// @match        *://www.parkrun.com.au/parkrunner/*/all/
// @match        *://www.parkrun.com.de/parkrunner/*/all/
// @match        *://www.parkrun.dk/parkrunner/*/all/
// @match        *://www.parkrun.fi/parkrunner/*/all/
// @match        *://www.parkrun.fr/parkrunner/*/all/
// @match        *://www.parkrun.ie/parkrunner/*/all/
// @match        *://www.parkrun.it/parkrunner/*/all/
// @match        *://www.parkrun.jp/parkrunner/*/all/
// @match        *://www.parkrun.lt/parkrunner/*/all/
// @match        *://www.parkrun.my/parkrunner/*/all/
// @match        *://www.parkrun.no/parkrunner/*/all/
// @match        *://www.parkrun.org.uk/parkrunner/*/all/
// @match        *://www.parkrun.pl/parkrunner/*/all/
// @match        *://www.parkrun.se/parkrunner/*/all/
// @match        *://www.parkrun.sg/parkrunner/*/all/
// @match        *://www.parkrun.us/parkrunner/*/all/
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.64
// @downloadURL https://update.greasyfork.org/scripts/534160/parkrun%20Wilson%20index%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/534160/parkrun%20Wilson%20index%20display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Finds the last results table with a specified number of columns
   * @param {Document} document - The document object to search in
   * @param {number} [columnCount=7] - Required number of columns
   * @returns {HTMLTableElement|null} The matching table or null if not found
   */
  function findResultsTable(document, columnCount = 7) {
    const tables = document.querySelectorAll('[id="results"]');
    let matchingTable = null;
    for (const table of tables) {
      const firstRow = table.querySelector('tr');

      if (firstRow) {
        const columns = firstRow.querySelectorAll('th, td').length;
        if (columns === columnCount) {
          matchingTable = table;
          break;
        }
      }
    }

    return matchingTable;
  }

  function extractEventDetails(table) {
    const rows = Array.from(table.querySelectorAll('tbody > tr'));
    return rows.reverse().map((row) => {
      const eventName = row.querySelector('td:nth-child(1)').textContent.trim();
      const eventDate = row.querySelector('td:nth-child(2)').textContent.trim();
      const eventNumber = row.querySelector('td:nth-child(3)').textContent.trim();
      return {
        eventName,
        eventDate,
        eventNumber: parseInt(eventNumber, 10),
      };
    });
  }

  /**
   * Calculates the Wilson index, which represents the highest consecutive number of parkrun events
   * completed starting from 1. It iterates through the sorted event numbers and increments the index
   * as long as the next event number matches the expected value.
   *
   * @param {Array} events - An array of event objects containing event numbers.
   * @returns {number} The calculated Wilson index.
   */
  function calculateWilsonIndex(events) {
    let wilsonIndex = 0;

    const eventNumbers = events.map((e) => e.eventNumber).sort((a, b) => a - b);

    for (const eventNumber of eventNumbers) {
      if (eventNumber >= wilsonIndex + 2) {
        break;
      } else if (eventNumber === wilsonIndex + 1) {
        wilsonIndex++;
      }
    }
    return wilsonIndex;
  }

  function calculateWilsonIndexOverTime(events) {
    const wilsonIndices = [];

    for (let i = 0; i < events.length; i++) {
      const subset = events.slice(0, i + 1);
      const parkruns = i + 1;
      const event = `${events[i].eventName} # ${events[i].eventNumber} on ${events[i].eventDate}`;
      const wilsonIndex = calculateWilsonIndex(subset);
      wilsonIndices.push({ parkruns, event, wilsonIndex });
    }

    return wilsonIndices;
  }

  function getResponsiveConfig() {
    const mobileConfig = {
      isMobile: true,
      spacing: {
        small: '10px',
        medium: '15px',
      },
      container: {
        padding: '10px',
        marginTop: '10px',
      },
      typography: {
        wilsonIndex: '1.2em',
        input: '16px',
        button: '16px',
      },
      chart: {
        height: '250px',
        fonts: {
          title: 14,
          axisTitle: 12,
          axisTicks: 10,
          legend: 11,
          tooltipTitle: 12,
          tooltipBody: 11,
        },
      },
      form: {
        marginBottom: '10px',
        input: {
          width: 'calc(100% - 20px)',
          maxWidth: '300px',
          padding: '8px',
          marginRight: '0',
        },
        button: {
          padding: '8px 15px',
          width: 'calc(100% - 20px)',
          maxWidth: '300px',
        },
        layout: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        },
      },
    };

    const desktopConfig = {
      isMobile: false,
      spacing: {
        small: '20px',
        medium: '20px',
      },
      container: {
        padding: '20px',
        marginTop: '20px',
      },
      typography: {
        wilsonIndex: '1.5em',
        input: 'inherit',
        button: 'inherit',
      },
      chart: {
        height: '300px',
        fonts: {
          title: 16,
          axisTitle: 14,
          axisTicks: 12,
          legend: 12,
          tooltipTitle: 14,
          tooltipBody: 12,
        },
      },
      form: {
        marginBottom: '20px',
        input: {
          width: '300px',
          maxWidth: '300px',
          padding: '5px',
          marginRight: '10px',
        },
        button: {
          padding: '5px 10px',
          width: 'auto',
          maxWidth: 'none',
        },
        layout: {
          display: 'block',
          flexDirection: 'row',
          gap: '0',
          alignItems: 'flex-start',
        },
      },
    };

    const isMobile = window.innerWidth < 768;
    return isMobile ? mobileConfig : desktopConfig;
  }

  function createWilsonGraph(indices, container, athleteInfo) {
    const responsive = getResponsiveConfig();
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.maxWidth = '100%';
    chartContainer.style.height = responsive.chart.height;
    chartContainer.style.position = 'relative';
    chartContainer.style.boxSizing = 'border-box';
    chartContainer.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);

    const ctx = canvas.getContext('2d');
    // eslint-disable-next-line no-undef
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: indices.map((i) => i.parkruns),
        datasets: [
          {
            label: athleteInfo,
            data: indices.map((i) => ({
              x: i.parkruns,
              y: i.wilsonIndex,
              event: i.event,
            })),
            borderColor: getDatasetColor(0),
            backgroundColor: '#2b223d',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Wilson Index',
              font: {
                size: responsive.chart.fonts.axisTitle,
              },
            },
            ticks: {
              font: {
                size: responsive.chart.fonts.axisTicks,
              },
            },
            suggestedMax: Math.ceil(Math.max(...indices.map((i) => i.wilsonIndex)) * 1.1), // Add 10% padding
          },
          x: {
            title: {
              display: true,
              text: 'parkruns',
              font: {
                size: responsive.chart.fonts.axisTitle,
              },
            },
            ticks: {
              font: {
                size: responsive.chart.fonts.axisTicks,
              },
            },
            min: 0,
            suggestedMax: Math.ceil(indices.length * 1.1), // Initial padding
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Wilson Index Progress',
            font: {
              size: responsive.chart.fonts.title,
            },
          },
          legend: {
            labels: {
              font: {
                size: responsive.chart.fonts.legend,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const point = context.raw;
                return [`Wilson Index: ${point.y}`, `Event: ${point.event}`];
              },
            },
            titleFont: {
              size: responsive.chart.fonts.tooltipTitle,
            },
            bodyFont: {
              size: responsive.chart.fonts.tooltipBody,
            },
          },
        },
      },
    });

    return chart;
  }

  /**
   * Fetches text content from a URI with caching support
   * @param {string} uri - The URI to fetch from
   * @param {string} cacheKey - The key to use for caching
   * @param {number} [cacheTtlMs=3600000] - Cache TTL in milliseconds (default: 1 hour)
   * @returns {Promise<string>} - The fetched text content
   */
  async function fetchWithCache(uri, cacheKey, cacheTtlMs = 60 * 60 * 1000) {
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < cacheTtlMs;
      if (isFresh) {
        return data;
      }
    }
    return fetch(uri)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((text) => {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: text,
            timestamp: Date.now(),
          })
        );
        return text;
      })
      .catch((error) => {
        console.error(`Error fetching ${uri}:`, error);
        if (cached) {
          console.warn('Using stale cached data after fetch failure');
          return JSON.parse(cached).data;
        }
        throw error;
      });
  }

  async function fetchFriendResults(athleteId) {
    const cacheKey = `parkrunner_${athleteId}_all`;
    const uri = `${window.location.origin}/parkrunner/${athleteId}/all/`;
    const text = await fetchWithCache(uri, cacheKey);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const table = findResultsTable(doc);
    if (!table) {
      console.error('Friend results table not found');
      return null;
    }
    const h2Element = doc.querySelector('h2');
    if (!h2Element) {
      console.error('Friend H2 element not found');
      return null;
    }
    const friendInfo = extractAthleteInfo(h2Element);
    if (!friendInfo) {
      console.error('Could not extract friend athlete info');
      return null;
    }
    const friendEvents = extractEventDetails(table);
    const friendIndices = calculateWilsonIndexOverTime(friendEvents);
    return { friendIndices, friendInfo };
  }

  function createComparisonUI(container, onCompare) {
    const responsive = getResponsiveConfig();
    const form = document.createElement('form');
    form.style.marginBottom = responsive.form.marginBottom;
    form.style.textAlign = 'center';
    form.style.display = responsive.form.layout.display;
    form.style.flexDirection = responsive.form.layout.flexDirection;
    form.style.gap = responsive.form.layout.gap;
    form.style.alignItems = responsive.form.layout.alignItems;

    const input = document.createElement('input');
    input.style.width = responsive.form.input.width;
    input.style.maxWidth = responsive.form.input.maxWidth;
    input.type = 'text';
    input.placeholder = "Enter friend's athlete ID (e.g. A507)";
    input.style.padding = responsive.form.input.padding;
    input.style.marginRight = responsive.form.input.marginRight;
    input.style.borderRadius = '3px';
    input.style.border = '1px solid #ffa300';
    input.style.backgroundColor = '#2b223d';
    input.style.color = '#ffa300';
    input.style.fontSize = responsive.typography.input;

    const button = document.createElement('button');
    button.textContent = 'Compare';
    button.style.padding = responsive.form.button.padding;
    button.style.width = responsive.form.button.width;
    button.style.maxWidth = responsive.form.button.maxWidth;
    button.style.backgroundColor = '#ffa300';
    button.style.color = '#2b223d';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.fontSize = responsive.typography.button;
    button.style.fontWeight = 'bold';

    form.appendChild(input);
    form.appendChild(button);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const athleteId = input.value.trim().replace(/^[aA]/, '');
      if (!athleteId) return;

      button.disabled = true;
      button.textContent = 'Loading...';

      try {
        const { friendIndices, friendInfo } = await fetchFriendResults(athleteId);
        onCompare(friendIndices, friendInfo);
      } catch (error) {
        console.error("Failed to fetch friend's results:", error);
        alert("Failed to fetch friend's results. Please check the ID and try again.");
      } finally {
        button.disabled = false;
        button.textContent = 'Compare';
      }
    });

    container.insertBefore(form, container.firstChild);
  }

  function updateChart(chart, friendIndices, friendInfo) {
    const datasetIndex = chart.data.datasets.length;
    const friendDataset = {
      label: friendInfo,
      data: friendIndices.map((i) => ({
        x: i.parkruns,
        y: i.wilsonIndex,
        event: i.event,
      })),
      borderColor: getDatasetColor(datasetIndex),
      backgroundColor: '#2b223d',
    };

    chart.data.datasets.push(friendDataset);
    chart.update();

    const maxParkruns = Math.max(
      ...chart.data.datasets.flatMap((dataset) => dataset.data.map((d) => d.x))
    );
    const maxWilsonIndex = Math.max(
      ...chart.data.datasets.flatMap((dataset) => dataset.data.map((d) => d.y))
    );

    chart.options.scales.x.suggestedMax = Math.ceil(maxParkruns * 1.1);
    chart.options.scales.y.suggestedMax = Math.ceil(maxWilsonIndex * 1.1);

    chart.update();
  }

  function extractAthleteInfo(h2Element) {
    return h2Element.textContent.trim();
  }

  function getDatasetColor(index) {
    const colors = [
      '#FFA300',
      '#90EE90',
      '#FF69B4',
      '#4169E1',
      '#FFD700',
      '#9370DB',
      '#20B2AA',
      '#FF6347',
      '#DDA0DD',
      '#00CED1',
    ];
    return colors[index % colors.length];
  }

  function displayWilsonIndex() {
    const table = findResultsTable(document);
    if (!table) {
      console.error('Results table not found');
      return;
    }

    const h2Element = document.querySelector('h2');
    if (!h2Element) {
      console.error('H2 element not found');
      return;
    }

    const athleteInfo = extractAthleteInfo(h2Element);
    if (!athleteInfo) {
      console.error('Could not extract athlete info');
      return;
    }

    const eventDetails = extractEventDetails(table);
    const wilsonIndex = calculateWilsonIndex(eventDetails);
    const wilsonIndices = calculateWilsonIndexOverTime(eventDetails);

    if (h2Element) {
      const responsive = getResponsiveConfig();
      const container = document.createElement('div');
      container.id = 'w-index-display';
      container.style.width = '100%';
      container.style.maxWidth = '800px';
      container.style.margin = `${responsive.container.marginTop} auto`;
      container.style.backgroundColor = '#2b223d';
      container.style.padding = responsive.container.padding;
      container.style.borderRadius = '5px';

      const wilsonElement = document.createElement('div');
      wilsonElement.textContent = `Wilson index: ${wilsonIndex}`;
      wilsonElement.style.fontSize = responsive.typography.wilsonIndex;
      wilsonElement.style.color = '#ffa300';
      wilsonElement.style.fontWeight = 'bold';
      wilsonElement.style.marginBottom = responsive.spacing.small;
      wilsonElement.style.textAlign = 'center';
      container.appendChild(wilsonElement);

      const chartInstance = createWilsonGraph(wilsonIndices, container, athleteInfo);

      createComparisonUI(container, async (friendIndices, friendInfo) => {
        updateChart(chartInstance, friendIndices, friendInfo);
      });

      h2Element.parentNode.insertBefore(container, h2Element.nextSibling);
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateWilsonIndex,
      calculateWilsonIndexOverTime,
      extractEventDetails,
      findResultsTable,
    };
  } else {
    displayWilsonIndex();
  }
})();
