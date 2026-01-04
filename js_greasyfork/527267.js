// ==UserScript==
// @name            GOG - Price Charts
// @namespace       https://github.com/idkicarus/
// @homepageURL     https://github.com/idkicarus/GOG-price-charts
// @supportURL      https://github.com/idkicarus/GOG-price-charts/issues
// @match           https://www.gog.com/*/game/*
// @description     Fetches price history from GOGDB.org to generate price charts for games on GOG
// @version         1.0
// @grant           GM.xmlHttpRequest
// @require         https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js
// @require         https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527267/GOG%20-%20Price%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/527267/GOG%20-%20Price%20Charts.meta.js
// ==/UserScript==

/* global Chart */

(function() {

    const DEBUG_MODE = false; // Enable debug mode for logging errors and status messages during script execution.
    const CACHE_KEY_PREFIX = "gogdb_price_"; // Define a prefix for cache keys used to store API responses. This helps uniquely identify data for specific products.
    const CACHE_LENGTH = 1000 * 60 * 60 * 24; // 24 hours in milliseconds (1,000 ms per second, 60 s per minute, 60 mins per hour, 24 hrs per day)

    /**
     * Injects static styles into the document for elements used by the script.
     * This ensures that the custom UI elements have consistent styling.
     */
    function addStaticStyles() {
        // Define a block of CSS styles to be applied to the page.
        const staticStyles = `
            .gog_ph_shadow { box-shadow: 0 1px 5px rgba(0,0,0,.15); }
            .gog_ph_whitebg { background-color: #e1e1e1; }
            #gog_ph_div { max-height: 300px; overflow: hidden; margin-bottom: 20px; width: 100%; height: 300px; }
            #gog_ph_chart_canvas {
                max-height: 200px;
                visibility: hidden;
                width: 100%;
            }
            #gog_ph_placeholder {
                height: 200px;
                background-color: #e1e1e1;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
            }
        `;

        // Create a <style> element to hold the CSS styles.
        const styleTag = document.createElement('style');
        styleTag.textContent = staticStyles;
        document.head.appendChild(styleTag);

        // Create a container div for the price history chart and related elements.
        const gog_ph_div = document.createElement("div");
        gog_ph_div.setAttribute("id", "gog_ph_div");
        gog_ph_div.innerHTML = `
            <div class="title">
                <div class="title__underline-text">Price history</div>
                <div class="title__additional-options"></div>
            </div>
            <div id="gog_ph_placeholder" class="gog_ph_whitebg gog_ph_shadow">Loading price history...</div>
            <canvas id="gog_ph_chart_canvas" class="gog_ph_whitebg gog_ph_shadow"></canvas>
            <p style="margin-top: 10px;">
                <span id="gog_ph_lowest_price"></span>
                <span id="gog_ph_data_source"></span>
            </p>
        `;

        // Append the container div to the body of the document.
        document.body.appendChild(gog_ph_div);
    }

    /**
     * Moves the placeholder to a specific location in the DOM once the target is available.
     * This ensures the price history UI is displayed in the appropriate section of the page.
     */
    function relocatePlaceholder() {
        const placeholderDiv = document.getElementById("gog_ph_div");

        // Use a MutationObserver to monitor DOM changes and relocate the placeholder when possible.
        const observer = new MutationObserver(() => {
            const targetElement = document.querySelector("div.layout-container:nth-child(9)");
            if (targetElement && placeholderDiv) {
                targetElement.prepend(placeholderDiv);
                observer.disconnect(); // Stop observing once the placeholder is relocated.
            }
        });

        // Check the document's readiness state and start observing accordingly.
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            });
        } else {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Waits for the product data to be loaded, then triggers the provided callback.
     * The product data is required to fetch the price history for a specific game.
     * @param {Function} callback - Function to call with the product ID once available.
     */
    function waitForProductData(callback) {
        let pollingInterval;

        // Start polling for product data once the window has loaded.
        window.addEventListener("load", () => {
            pollingInterval = setInterval(() => {
                try {
                    // Check if the productcardData object is available and contains the product ID.
                    if (unsafeWindow.productcardData?.cardProductId) {
                        clearInterval(pollingInterval); // Stop polling once the data is available.
                        callback(unsafeWindow.productcardData.cardProductId);
                    }
                } catch (error) {
                    if (DEBUG_MODE) console.error("Error accessing productcardData:", error);
                    clearInterval(pollingInterval);
                }
            }, 100); // Poll every 100ms.
        });

        // Set a timeout to stop polling if the data is not loaded within 10 seconds.
        setTimeout(() => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                if (DEBUG_MODE) console.warn("Timeout: Unable to load product data.");
            }
        }, 10000);
    }

    /**
     * Fetches price history data from the GOGDB API for a given product.
     * @param {string} cacheKey - Key to cache the API response.
     * @param {string} productId - Product ID to fetch data for.
     */
    function fetchPriceData(cacheKey, productId) {
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

        // Check if cached data is available and not expired (e.g., 24 hours).
        if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_LENGTH) {
            if (DEBUG_MODE) console.log("Using cached data:", JSON.parse(cachedData));
            processPriceData(JSON.parse(cachedData), productId);
            return;
        }

        // Fetch data from the API if no valid cache is found.
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.gogdb.org/data/products/${productId}/prices.json`,
            onload: function(response) {
                if (response.status === 200) {
                    const jsonData = JSON.parse(response.responseText);
                    if (DEBUG_MODE) console.log("Fetched price data:", jsonData);

                    // Cache the response and timestamp.
                    localStorage.setItem(cacheKey, response.responseText);
                    localStorage.setItem(`${cacheKey}_timestamp`, Date.now());

                    processPriceData(jsonData, productId);
                } else {
                    document.getElementById("gog_ph_placeholder").textContent =
                        response.status === 404 ?
                        "No historical price data available." :
                        "Failed to load price history.";
                }
            },
            onerror: function() {
                document.getElementById("gog_ph_placeholder").textContent =
                    "Failed to load price history.";
            },
        });
    }


    /**
     * Processes the price history data and updates the UI with a chart and additional information.
     * @param {Object} jsonData - Raw price data fetched from the API.
     * @param {string} productId - Product ID associated with the data.
     */
    function processPriceData(jsonData, productId) {
        // Parse the price history data into labels (dates), prices, and key metrics.
        const {
            labels,
            prices,
            lowestPrice,
            highestBasePrice
        } = parsePriceHistory(jsonData);

        if (DEBUG_MODE) {
            console.log("Processed labels:", labels);
            console.log("Processed prices:", prices);
        }

        // Check if there is valid data to display.
        if (labels.length > 0 && prices.length > 0) {
            // Create the price history chart using Chart.js.
            createChart(labels, prices, highestBasePrice);
            document.getElementById("gog_ph_placeholder").remove();

            // Update the lowest price and data source information in the UI.
            const lowestPriceElement = document.getElementById("gog_ph_lowest_price");
            const dataSourceElement = document.getElementById("gog_ph_data_source");

            if (lowestPrice > 0 && lowestPrice < highestBasePrice) {
                // Display the lowest price if it is valid and less than the highest base price.
                lowestPriceElement.textContent = `Historical low: $${lowestPrice.toFixed(2)}.`;
                dataSourceElement.innerHTML = ` (Data retrieved from <a id="gog_ph_gogdb_link" class="un" href="https://www.gogdb.org/product/${productId}" target="_blank"><u>GOG Database</u></a>.)`;
            } else {
                lowestPriceElement.textContent = "";
                dataSourceElement.innerHTML = `Data retrieved from <a id="gog_ph_gogdb_link" class="un" href="https://www.gogdb.org/product/${productId}" target="_blank"><u>GOG Database</u></a>.`;
            }
        } else {
            // Display a message if no price history data is available.
            document.getElementById("gog_ph_placeholder").textContent =
                "No historical price data available.";
        }
    }

    /**
	 * Parses the price history data into labels, prices, and key metrics.
	 * @param {Object} jsonData - Raw price data from the API.
	 * @returns {Object} Parsed data including labels, prices, lowest price, and highest base price.
	 */
	function parsePriceHistory(jsonData) {
		const history = jsonData?.US?.USD || []; // Extract the price history for USD or default to an empty array.
		const labels = []; // Array to store dates for the x-axis of the chart.
		const prices = []; // Array to store prices for the y-axis of the chart.
		let lowestPrice = Infinity; // Initialize the lowest price to a very high value.
		let highestBasePrice = 0; // Initialize the highest base price to zero.

    // Handle the edge case where there is only one entry in the price history by creating a second data point at the current date.
    if (history.length === 1) {
        const singleEntry = history[0];
        const originalDate = new Date(singleEntry.date);
        labels.push(originalDate);

        const currentDate = new Date();
        labels.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));

		// Create constants for price_base and price_final converted to decimals
        const singlePriceBase = singleEntry.price_base / 100;
        const singlePriceFinal = singleEntry.price_final / 100;

		// Determine the lowest price between price_base and price_final, then store it. Handles games with launch/pre-launch discounts.
		//Probably better than defaulting to price_final for all games with a single price entry.
        lowestPrice = Math.min(singlePriceBase, singlePriceFinal);
        highestBasePrice = singlePriceBase;

        prices.push(lowestPrice, lowestPrice); // Display the lower entry in the chart

        return {
            labels,
            prices,
            lowestPrice,
            highestBasePrice
        };
    }

        // Process each entry in the price history.
        history.forEach(entry => {
            const date = new Date(entry.date); // Convert the entry date string to a Date object.
            const price = entry.price_final ? entry.price_final / 100 : null; // Convert the final price to a number if available.

            if (price && price > 0) {
                labels.push(date); // Add the date to the labels array.
                prices.push(price); // Add the price to the prices array.
                lowestPrice = Math.min(lowestPrice, price); // Update the lowest price if the current price is lower.
                highestBasePrice = Math.max(highestBasePrice, entry.price_base / 100 || 0); // Update the highest base price.
            }
        });

        return {
            labels,
            prices,
            lowestPrice: lowestPrice === Infinity ? 0 : lowestPrice, // Handle the case where no valid prices are found.
            highestBasePrice,
        };
    }

    /**
     * Creates a chart using Chart.js with multiple data points.
     * @param {Array} labels - Array of dates for the x-axis.
     * @param {Array} prices - Array of prices for the y-axis.
     * @param {number} highestBasePrice - Highest base price for scaling.
     */
    function createChart(labels, prices, highestBasePrice) {
        if (labels.length === 2) {
            // Handle the case where there are only two data points.
            createChartSingleEntry(labels, prices);
        } else {
            // Handle the case with multiple data points.
            createChartMultipleEntries(labels, prices);
        }
    }

    /**
     * Creates a chart for multiple price entries.
     * @param {Array} labels - Array of dates for the x-axis.
     * @param {Array} prices - Array of prices for the y-axis.
     */
    function createChartMultipleEntries(labels, prices) {
        const ctx = document.getElementById("gog_ph_chart_canvas").getContext("2d"); // Get the 2D rendering context for the canvas.

        new Chart(ctx, {
            type: "line", // Specify the chart type as a line chart.
            data: {
                labels, // Use the provided labels for the x-axis.
                datasets: [{
                    label: "Price", // Label for the dataset.
                    borderColor: "rgb(241, 142, 0)", // Set the line color.
                    backgroundColor: "rgba(241, 142, 0, 0.5)", // Set the fill color.
                    data: prices, // Use the provided prices for the y-axis.
                    stepped: true, // Use stepped lines to indicate discrete changes.
                    fill: false, // Disable filling under the line.
                }],
            },
            options: {
                scales: {
                    x: {
                        type: "time", // Use a time scale for the x-axis.
                        time: {
                            tooltipFormat: "MMM d, yyyy", // Format for tooltips (i.e., short month, day, 4-digit year).
                            displayFormats: {
                                month: "MMM yyyy", // Format for month labels (i.e., short month, 4-digit year).
                            },
                        },
                        ticks: {
                            autoSkip: true, // Automatically skip ticks to avoid overcrowding.
                            maxTicksLimit: Math.floor(labels.length / 3), // Limit the number of ticks based on the data length.
                        },
                    },
                    y: {
                        beginAtZero: true, // Start the y-axis at zero.
                        ticks: {
                            callback: value => `$${value.toFixed(2)}`, // Format the y-axis values as currency.
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false, // Disable the legend for simplicity.
                    },
                },
                maintainAspectRatio: false, // Allow the chart to resize dynamically.
            },
        });

        document.getElementById("gog_ph_chart_canvas").style.visibility = "visible"; // Make the chart visible after rendering.
    }

    /**
     * Creates a chart for a single price entry.
     * @param {Array} labels - Array of two dates for the x-axis.
     * @param {Array} prices - Array of two prices for the y-axis.
     */
    function createChartSingleEntry(labels, prices) {
        const ctx = document.getElementById("gog_ph_chart_canvas").getContext("2d"); // Get the 2D rendering context for the canvas.

        new Chart(ctx, {
            type: "line", // Specify the chart type as a line chart.
            data: {
                labels, // Use the provided labels for the x-axis.
                datasets: [{
                    label: "Price", // Label for the dataset.
                    borderColor: "rgb(241, 142, 0)", // Set the line color.
                    backgroundColor: "rgba(241, 142, 0, 0.5)", // Set the fill color.
                    data: prices, // Use the provided prices for the y-axis.
                    stepped: true, // Use stepped lines to indicate discrete changes.
                    fill: false, // Disable filling under the line.
                }],
            },
            options: {
                scales: {
                    x: {
                        type: "category", // Use a category scale for the x-axis.
                        ticks: {
                            autoSkip: false, // Do not skip ticks.
                            callback: function(value, index) {
                                return labels[index].toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                }); // Format x-axis labels as short month and year.
                            },
                        },
                    },
                    y: {
                        beginAtZero: true, // Start the y-axis at zero.
                        ticks: {
                            callback: value => `$${value.toFixed(2)}`, // Format the y-axis values as currency.
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false, // Disable the legend for simplicity.
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const index = context[0].dataIndex;
                                // Format the tooltip title to display the date as "Month Day, Year"
                                return labels[index].toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                });
                            },
                        },
                    },
                },
                maintainAspectRatio: false, // Allow the chart to dynamically resize without distorting the aspect ratio.
            },
        });

        // Make the chart visible once rendering is complete.
        document.getElementById("gog_ph_chart_canvas").style.visibility = "visible";
    }

    // Add the necessary static styles to the page.
    addStaticStyles();
    // Relocate the placeholder element to its correct position on the page.
    relocatePlaceholder();
    // Wait for the product data to load and then fetch the price history data for the product.
    waitForProductData(productId => {
        fetchPriceData(`${CACHE_KEY_PREFIX}${productId}`, productId);
    });
})();