// ==UserScript==
// @name         Speedport JSON Parser
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @author       sfortis
// @description  Parse and display VDSL information fom Speedport Plus COSMOTE modems.
// @match        http://192.168.1.1/data/Status.json
// @grant        GM_addStyle
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.2.0/chart.umd.js
// @downloadURL https://update.greasyfork.org/scripts/467219/Speedport%20JSON%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/467219/Speedport%20JSON%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles to hide the JSON input and output
    GM_addStyle(`
        pre:first-child {
            display: none !important;
        }

        body > pre {
            visibility: hidden !important;
        }

        #dsl-info-container {
            display: block !important;
        }

        #dsl-info-container h3 {
            font-weight: bold;
        }

        #dsl-info-container p {
            margin: 5px 0;
        }

        .dsl-info-title {
            font-weight: bold;
        }

        .chart-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
        }

        .chart {
            width: 30%;
            height: 200px;
        }

        .chart-legend {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        .chart-legend span {
            display: flex;
            align-items: center;
        }

        .chart-legend span::before {
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 5px;
        }

        .chart-labels {
            font-size: 12px;
            line-height: 1;
        }
    `);

    // Clear the screen
    document.body.innerHTML = '';

    // Fetch the JSON data
    fetch("http://192.168.1.1/data/Status.json")
        .then(response => response.json())
        .then(data => {
            // Find the DSL variables
            const dslMaxDownstream = data.find(item => item.varid === "dsl_max_downstream");
            const dslMaxUpstream = data.find(item => item.varid === "dsl_max_upstream");
            const firmwareVersion = data.find(item => item.varid === "firmware_version");
            const uptime = data.find(item => item.varid === "uptime");
            const dslSyncTime = data.find(item => item.varid === "dsl_sync_time");
            const dslDownstream = data.find(item => item.varid === "dsl_downstream");
            const dslUpstream = data.find(item => item.varid === "dsl_upstream");
            const dslCRCerrors = data.find(item => item.varid === "dsl_crc_errors");
            const dslFECerrors = data.find(item => item.varid === "dsl_fec_errors");
            const snr = data.find(item => item.varid === "dsl_snr");
            const attn = data.find(item => item.varid === "dsl_atnu");

            // Create HTML elements to display the DSL information
            const container = document.createElement("div");
            container.id = "dsl-info-container";
            container.style.margin = "10px";
            container.style.padding = "10px";

            const title = document.createElement("h3");
            title.textContent = "Speedport VDSL Information";

            const infoTable = document.createElement("table");
            infoTable.classList.add("info-table");

            const tableBody = document.createElement("tbody");

            const addRow = (label, value) => {
                const row = document.createElement("tr");

                const labelCell = document.createElement("td");
                labelCell.textContent = label;
                labelCell.style.fontWeight = "bold";

                const valueCell = document.createElement("td");
                valueCell.textContent = value;

                row.appendChild(labelCell);
                row.appendChild(valueCell);
                tableBody.appendChild(row);
            };

            addRow("Firmware Version:", firmwareVersion ? firmwareVersion.varvalue : "N/A");
            addRow("Uptime:", uptime ? uptime.varvalue : "N/A");
            addRow("DSL Sync Time:", dslSyncTime ? dslSyncTime.varvalue : "N/A");
            addRow("DSL Downstream:", dslDownstream ? dslDownstream.varvalue + " Mbps" : "N/A");
            addRow("DSL Upstream:", dslUpstream ? dslUpstream.varvalue + " Mbps" : "N/A");
            addRow("DSL Max Downstream:", dslMaxDownstream ? dslMaxDownstream.varvalue + " Mbps" : "N/A");
            addRow("DSL Max Upstream:", dslMaxUpstream ? dslMaxUpstream.varvalue + " Mbps" : "N/A");
            addRow("DSL CRC Errors:", dslCRCerrors ? dslCRCerrors.varvalue : "N/A");
            addRow("DSL FEC Errors:", dslFECerrors ? dslFECerrors.varvalue : "N/A");
            addRow("Signal-to-Noise Ratio:", snr ? snr.varvalue : "N/A");
            addRow("Attenuation:", attn ? attn.varvalue : "N/A");

            infoTable.appendChild(tableBody);

            const chartContainer = document.createElement("div");
            chartContainer.classList.add("chart-container");

            const createPieChart = (title, values, containerId) => {
                const chartWrapper = document.createElement("div");
                chartWrapper.classList.add("chart");

                const chartCanvas = document.createElement("canvas");
                chartCanvas.id = containerId;
                chartWrapper.appendChild(chartCanvas);

                const legend = document.createElement("div");
                legend.classList.add("chart-legend");

                values.forEach((value, index) => {
                    const legendItem = document.createElement("span");
                    legendItem.innerHTML = `<span style="background-color: ${value.color}"></span> ${value.label}: ${value.value} Mbps`;
                    legend.appendChild(legendItem);
                });

                chartWrapper.appendChild(legend);
                chartContainer.appendChild(chartWrapper);

                const ctx = chartCanvas.getContext("2d");
                new Chart(ctx, {
                    type: "pie",
                    data: {
                        datasets: [{
                            data: values.map(item => item.value),
                            backgroundColor: values.map(item => item.color),
                            borderWidth: 1
                        }],
                        labels: values.map(item => item.label)
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true
                        },
                        tooltips: {
                            callbacks: {
                                label: (tooltipItem, data) => {
                                    const dataset = data.datasets[tooltipItem.datasetIndex];
                                    const value = dataset.data[tooltipItem.index];
                                    return `${data.labels[tooltipItem.index]}: ${value} Mbps`;
                                }
                            }
                        },
                    }
                });
            };

            const downstreamValues = [
                {
                    value: dslDownstream ? parseInt(dslDownstream.varvalue) : 0,
                    color: "rgba(54, 162, 235, 0.6)",
                    label: "VDSL Downstream"
                },
                {
                    value: dslMaxDownstream ? parseInt(dslMaxDownstream.varvalue) : 0,
                    color: "rgba(255, 99, 132, 0.6)",
                    label: "VDSL Max Downstream"
                }
            ];
            createPieChart("VDSL Downstream", downstreamValues, "downstream-chart");

            const upstreamValues = [
                {
                    value: dslUpstream ? parseInt(dslUpstream.varvalue) : 0,
                    color: "rgba(75, 192, 192, 0.6)",
                    label: "VDSL Upstream"
                },
                {
                    value: dslMaxUpstream ? parseInt(dslMaxUpstream.varvalue) : 0,
                    color: "rgba(153, 102, 255, 0.6)",
                    label: "VDSL Max Upstream"
                }
            ];
            createPieChart("VDSL Upstream", upstreamValues, "upstream-chart");

            // Append the HTML elements to the page
            container.appendChild(title);
            container.appendChild(infoTable);
            container.appendChild(chartContainer);
            document.body.appendChild(container);
        })
        .catch(error => {
            console.error("An error occurred while fetching or parsing the JSON data:", error);
        });
})();
