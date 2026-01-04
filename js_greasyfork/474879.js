// ==UserScript==
// @name        DSVV ERP ATTENDANCE HIGHLIGHTER - dsvv.ac.in
// @namespace   Violentmonkey Scripts
// @include     https://erp.dsvv.ac.in/StudentAttendance/MyAttendanceReport*
// @require     https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
// @grant       none
// @version     1.0
// @author      sharadcodes
// @description Add some styling to your boring attendance
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474879/DSVV%20ERP%20ATTENDANCE%20HIGHLIGHTER%20-%20dsvvacin.user.js
// @updateURL https://update.greasyfork.org/scripts/474879/DSVV%20ERP%20ATTENDANCE%20HIGHLIGHTER%20-%20dsvvacin.meta.js
// ==/UserScript==

if (
    document.querySelector(
        "#content > div:nth-child(1) > div > div > div:nth-child(1) > span.rlbv"
    ).innerText === "MCA-III-SEM"
) {
    var tables = Array.from(document.querySelectorAll("table")).slice(3);
    tables = tables.filter(
        (table) => !table.parentNode.classList.contains("innerfooter")
    );
    tables.forEach((table) => {
        table.querySelectorAll("tr td:not(.col-1)").forEach((td) => {
            if (
                (td.innerText.split("P").length > 0 ||
                    td.innerText.split("A").length > 0 ||
                    td.innerText.split("T").length > 0 ||
                    td.innerText.split("L").length > 0) &&
                !td.classList.contains("col-1") &&
                td.innerText.length > 0
            ) {
                console.log(td.innerHTML);
                if (td?.innerText?.includes("P")) {
                    td.style.background = "lawngreen";
                } else if (td?.innerText?.includes("A")) {
                    td.style.background = "pink";
                } else if (td?.innerText?.includes("T")) {
                    td.style.background = "orange";
                } else if (td?.innerText?.includes("L")) {
                    td.style.background = "cyan";
                }
            }
        });
    });

    // Get all the elements with class "col-6"
    var fractions = document.querySelectorAll(
        "#content > div:nth-child(1) > table > tbody > tr > td"
    );
    fractions = Array.from(fractions).slice(0, fractions.length - 6);
    generatePercentageAndChart(fractions);

    // Get all the elements with class "col-6"
    fractions = document.querySelectorAll(
        "#content > div:nth-child(2) > table > tbody > tr > td"
    );
    generatePercentageAndChart(fractions);

    fractions = document.querySelectorAll(
        "#content > div:nth-child(3) > table > tbody > tr > td"
    );

    fractions = Array.from(fractions).slice(0, fractions.length - 1);

    generatePercentageAndChart(fractions);
}

// Loop through each element and add a percentage calculation to the corresponding "percentage" cell
function generatePercentageAndChart(fractions) {
    fractions.forEach(function (fraction) {
        // Extract the numerator and denominator from the text of the fraction cell
        var numerator = parseFloat(fraction.textContent.split("/")[0]);
        var denominator = parseFloat(fraction.textContent.split("/")[1]);

        // Calculate the percentage
        var percentage = (numerator / denominator) * 100;

        // Create a new text node with the percentage value
        var percentageNode = document.createTextNode(
            "  Per: " + percentage.toFixed(2) + "%"
        );
        fraction.appendChild(percentageNode);

        // Create a new div element to hold both the pie chart and the percentage text
        var container = document.createElement("div");
        // Create a canvas for the pie chart
        var chartCanvas = document.createElement("canvas");
        chartCanvas.style.maxWidth = "150px";
        chartCanvas.style.width = "150px";
        chartCanvas.style.height = "auto";

        container.appendChild(chartCanvas);
        // Append the container to the fraction element
        fraction.appendChild(container);
        // Create a pie chart inside the chartCanvas
        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: ["Present", "Absent"],
                datasets: [
                    {
                        data: [numerator, denominator - numerator], // Calculate the remaining percentage
                        backgroundColor: ["#0f0", "#f00"],
                    },
                ],
            },
            options: {
                responsive: true, // Set chart to be responsive
                maintainAspectRatio: false, // Disable aspect ratio to fill width
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });
    });
}
