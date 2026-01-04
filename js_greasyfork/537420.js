// ==UserScript==
// @name         OMC Difficult Pies
// @namespace    https://ruku.tellpro.net
// @version      2025-07-23
// @description  OMCにdifficulty-piesが表示されます
// @author       ruku
// @match        https://onlinemathcontest.com/problems
// @icon         https://onlinemathcontest.com/assets/images/logo/OnlineMathContestLogo.JPG
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537420/OMC%20Difficult%20Pies.user.js
// @updateURL https://update.greasyfork.org/scripts/537420/OMC%20Difficult%20Pies.meta.js
// ==/UserScript==

const diffToColor = (diff) => {
    if(diff === null) {
        return "others";
    }
    if(diff < 399) {
        return "gray";
    }
    if(diff < 799) {
        return "brown";
    }
    if(diff < 1199) {
        return "green";
    }
    if(diff < 1599) {
        return "skyblue";
    }
    if(diff < 1999) {
        return "blue";
    }
    if(diff < 2399) {
        return "yellow";
    }
    if(diff < 2799) {
        return "orange";
    }
    return "red";
}

(async () => {
    const chartJS = document.createElement("script");
    chartJS.src = "https://cdn.jsdelivr.net/npm/chart.js@3.0.0/dist/chart.min.js";
    chartJS.onload = () => {
        // Create container div with grid layout
        const containerDiv = document.createElement("div");
        containerDiv.style.display = "grid";
        containerDiv.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        containerDiv.style.gap = "20px";
        containerDiv.style.margin = "20px";

        const paperCard = document.getElementsByTagName("paper-card")[0];
        if (paperCard) {
            paperCard.insertBefore(containerDiv, paperCard.firstChild);
        }

        const colors = ["gray", "brown", "green", "skyblue", "blue", "yellow", "orange", "red", "others"];
        const colorLabels = ["Gray", "Brown", "Green", "Skyblue", "Blue", "Yellow", "Orange", "Red", "Others"];
        const colorConfigs = colors.map((color, index) => ({
            label: colorLabels[index],
            backgroundColor: `rgba(${getColorRGBA(color)}, 0.5)`,
            borderColor: `rgba(${getColorRGBA(color)})`
        }));

        const charts = {};

        // Create a pie chart for each color
        colors.forEach((color, index) => {
            const chartContainer = document.createElement("div");
            chartContainer.style.width = "200px";
            chartContainer.style.height = "200px";

            const canvas = document.createElement("canvas");
            canvas.id = `pieChart-${color}`;
            chartContainer.appendChild(canvas);
            containerDiv.appendChild(chartContainer);

            const ctx = canvas.getContext("2d");
            const data = {
                labels: ["CA", "Non-CA"],
                datasets: [{
                    label: `${colorLabels[index]} Problems`,
                    data: [0, 0], // Placeholder for data
                    backgroundColor: [
                        colorConfigs[index].backgroundColor,
                        "rgba(211, 211, 211, 0.5)" // Light gray for Non-CA
                    ],
                    borderColor: [
                        colorConfigs[index].borderColor,
                        "rgba(211, 211, 211)" // Light gray for Non-CA
                    ],
                    borderWidth: 1
                }]
            };
            const config = {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: `${colorLabels[index]} Problems`
                        }
                    }
                }
            };
            charts[color] = new Chart(ctx, config);
        });

        // Fetch the problem data and update the charts
        (async () => {
            const CAList = await (await fetch("https://onlinemathcontest.com/api/problems/ca_list")).json();
            const problems = {};
            colors.forEach(color => problems[color] = new Set());

            const contestTypes = ["B", "R", "E", "S", "O", "V"];
            for (const contestType of contestTypes) {
                const response = await fetch(`https://onlinemathcontest.com/api/problems/list?type=${contestType}`);
                const data = await response.json();
                for (const contest of data.contests) {
                    for (const task of contest.tasks) {
                        if (task === null) continue;
                        const diff = task.diff;
                        const color = diffToColor(diff);
                        problems[color].add(Number(task.id));
                    }
                }
            }

            // Update each chart with CA and Non-CA data
            for (const color of colors) {
                const problemSet = problems[color];
                const solved = new Set();
                for (const ca of CAList) {
                    if (problemSet.has(ca)) {
                        solved.add(ca);
                    }
                }
                const solvedCount = solved.size;
                const unsolvedCount = problemSet.size - solvedCount;

                charts[color].data.datasets[0].data = [solvedCount, unsolvedCount];
                charts[color].update();
            }
        })();
    };
    document.head.appendChild(chartJS);

    function getColorRGBA(color) {
        switch (color) {
            case "gray": return "128, 128, 128";
            case "brown": return "165, 42, 42";
            case "green": return "34, 139, 34";
            case "skyblue": return "135, 206, 235";
            case "blue": return "70, 130, 180";
            case "yellow": return "255, 255, 0";
            case "orange": return "255, 165, 0";
            case "red": return "255, 0, 0";
            default: return "0, 0, 0";
        }
    }
})();

