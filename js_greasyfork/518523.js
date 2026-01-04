// ==UserScript==
// @name         AO3 Statistics tracker
// @description  Track statistics on the stats page and display the stats in charts. Stores the stats locally in the browser's database.
// @author       Ifky_
// @namespace    https://greasyfork.org/en/scripts/518523
// @version      2.0.3
// @history      2.0.3 — Fix certain work stats not being tracked (comments, words)
// @history      2.0.2 — Add "find and search" to delete database rows. Remove "transfer" button.
// @history      2.0.1 — Fix work names being encoded as HTML instead of plain text.
// @history      2.0.0 — Replace local storage with indexed DB. Add button to convert existing local storage to indexed DB.
// @history      1.1.1 — Refactor CSS styles. Add ways to choose graph point size and which stats to be tracked.
// @history      1.1.0 — Add option "week" for cleaning stats. Add error alert for setting local storage item.
// @history      1.0.1 — Import dependency scripts in the proper way. Set CLEAN_DATA default to "day" instead of "hour"
// @history      1.0.0 — Track stats, draw charts, download chart, clean stats, import/export stats, toggle view
// @match        https://archiveofourown.org/users/*/stats*
// @icon         https://archiveofourown.org/images/logo.png
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518523/AO3%20Statistics%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/518523/AO3%20Statistics%20tracker.meta.js
// ==/UserScript==
"use strict";
(function () {
    /** ==================================== **/
    /*  FLAGS MEANT TO BE EDITED: CAPITALIZED */
    /*  Keep in mind that these might be      */
    /*  reset if the script is auto-updated,  */
    /*  so create a backup somewhere safe     */
    /** ==================================== **/
    // Clean data by removing unnecessary points.
    // Options: "hour" / "day" / "week" / "month"
    const CLEAN_DATA = "day";
    // Theme mode for the chart.
    // Options: "light" / "dark"
    const THEME_MODE = "light";
    // Select which stats should be tracked.
    // Options: true / false
    const STATS = {
        "user-subscriptions": true,
        "kudos": true,
        "comment-threads": true, // Total stats
        "comments": true, // Work stats
        "bookmarks": true,
        "subscriptions": true,
        "word-count": true, // Total stats
        "words": true, // Work stats
        "hits": true
    };
    // Whether to include or exclude work stats.
    // Can be a good idea to turn off if you have many works.
    // Options: true / false
    const INCLUDE_WORKS = true;
    // The size of the points on the graph line.
    // Options: any number (0 to hide)
    const POINT_SIZE = 2;
    // The sign used to separate values.
    // Change it to something else if it clashes with a work name.
    // Options: any string (text)
    const DELIMITER = ";";
    const getTheme = (mode) => {
        if (mode === "dark") {
            return {
                text: "#999",
                background: "#222",
                gridLines: "#333",
                userSubscriptions: "#F94144",
                kudos: "#F3722C",
                commentThreads: "#F9C74F",
                bookmarks: "#90BE6D",
                subscriptions: "#43AA8B",
                wordCount: "#6C8EAD",
                hits: "#8552BA",
            };
        }
        else {
            // Default to light mode
            return {
                text: "#777",
                background: "#FFF",
                gridLines: "#DDD",
                userSubscriptions: "#F94144",
                kudos: "#F3722C",
                commentThreads: "#F9C74F",
                bookmarks: "#90BE6D",
                subscriptions: "#43AA8B",
                wordCount: "#577590",
                hits: "#663C91",
            };
        }
    };
    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const trackStats = () => {
        const newTotalStats = getTotalStats();
        storeInDb(newTotalStats);
        if (INCLUDE_WORKS) {
            const newWorkStats = getWorkStats();
            storeInDb(newWorkStats);
        }
        drawChart(chartContainer, canvasTotal, "total");
    };
    const exportStats = async () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        // Headers
        csvContent += "type;workName;statName;date;value\r\n";
        const stats = await getFromDb();
        stats.forEach((stat, index) => {
            const key = getStatKey(stat.type, stat.workName, stat.statName, formatDate(stat.date).yyyyMMdd_hhmm);
            csvContent +=
                [key, stat.value].join(DELIMITER) +
                    (index !== stats.length - 1 ? "\r\n" : "");
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.href = encodedUri;
        link.download = `stats-${formatDate(new Date()).yyyyMMdd}.csv`;
        link.click();
    };
    const importStats = (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
            Array.from(target.files).forEach((file) => {
                csvFileToStatsRow(file)
                    .then((rows) => {
                    storeInDb(rows);
                    alert(`${rows.length} rows imported!`);
                    drawChart(chartContainer, canvasTotal, "total");
                })
                    .catch((error) => {
                    alert(error);
                });
            });
            // Reset input
            target.value = "";
        }
    };
    const csvFileToStatsRow = (file) => {
        return new Promise((resolve, reject) => {
            // Check if the file is of .csv type
            if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
                reject(new Error("The file must be a .csv file."));
            }
            const reader = new FileReader();
            // Handle the file load event
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    const lines = reader.result.split("\r\n");
                    // Validate header
                    const header = lines[0];
                    const [headerType, headerWorkName, headerStatName, headerDate, headerValue,] = header.split(DELIMITER);
                    if (headerType !== "type" ||
                        headerWorkName !== "workName" ||
                        headerStatName !== "statName" ||
                        headerDate !== "date" ||
                        headerValue !== "value") {
                        reject(new Error(`Header(s) could not be inferred: ${header}`));
                    }
                    const rows = [];
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i];
                        const [type, workName, statName, date, value] = line.split(DELIMITER);
                        try {
                            validateStatRow({
                                type,
                                workName,
                                statName,
                                date,
                                value,
                            }, i);
                            const row = {
                                type: type,
                                workName: workName,
                                statName: statName,
                                date: new Date(date),
                                value: Number(value),
                            };
                            rows.push(row);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                    resolve(rows);
                }
                else {
                    reject(new Error("File content could not be read as text."));
                }
            };
            reader.onerror = () => {
                reject(new Error("An error occurred while reading the file."));
            };
            reader.readAsText(file);
        });
    };
    const chartHeight = 250;
    const chartContainer = document.createElement("div");
    chartContainer.classList.add("chart-container");
    const toggleChartContainer = (container, open) => {
        // Open or close
        if (open === true) {
            container.style.height = `${chartHeight}px`;
            return;
        }
        else if (open === false) {
            container.style.height = "0px";
            return;
        }
        // Toggle
        if (container.style.height === "0px") {
            container.style.height = `${chartHeight}px`;
        }
        else {
            container.style.height = "0px";
        }
    };
    let statChart = null;
    let statisticsMetaGroup = null;
    let statisticsIndexGroup = null;
    let canvasTotal = null;
    const observer = new MutationObserver(() => {
        statChart = document.getElementById("stat_chart");
        statisticsMetaGroup = document.querySelector(".statistics.meta.group");
        statisticsIndexGroup = document.querySelector(".statistics.index.group");
        if (statChart && statisticsMetaGroup && statisticsIndexGroup) {
            observer.disconnect(); // Stop observing once the element is found
            statChart.prepend(chartContainer);
            canvasTotal = document.createElement("canvas");
            canvasTotal.id = "tracked-stats-chart";
            chartContainer.append(canvasTotal);
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("stat-button-container", "actions");
            statisticsMetaGroup.append(buttonContainer);
            const downloadChart = async () => {
                // @ts-ignore
                // eslint-disable-next-line
                if (!Chart.getChart("tracked-stats-chart")) {
                    drawChart(chartContainer, canvasTotal, "total");
                    // Sleep to allow chart to be drawn
                    await sleep(500);
                }
                const url = canvasTotal.toDataURL("image/png");
                var a = document.createElement("a");
                a.href = url;
                a.download = `stats-chart-${formatDate(new Date()).yyyyMMdd}.png`;
                a.click();
            };
            // Button to track statistics
            const logButton = document.createElement("button");
            logButton.innerText = "Track";
            logButton.onclick = trackStats;
            buttonContainer.append(logButton);
            // Button to draw chart
            const drawButton = document.createElement("button");
            drawButton.innerText = "Draw Chart";
            drawButton.onclick = () => drawChart(chartContainer, canvasTotal, "total");
            buttonContainer.append(drawButton);
            // Button to download chart
            const downloadButton = document.createElement("button");
            downloadButton.innerText = "Download";
            downloadButton.onclick = downloadChart;
            buttonContainer.append(downloadButton);
            // Button to clean stats
            const cleanButton = document.createElement("button");
            cleanButton.innerText = "Clean Stats";
            cleanButton.onclick = () => cleanStats(CLEAN_DATA);
            buttonContainer.append(cleanButton);
            // Button to export stats
            const exportButton = document.createElement("button");
            exportButton.innerText = "Export";
            exportButton.onclick = exportStats;
            buttonContainer.append(exportButton);
            // Input to import stats
            const importInput = document.createElement("input");
            importInput.id = "import-stats-input";
            importInput.type = "file";
            importInput.accept = ".csv";
            importInput.multiple = true;
            importInput.onchange = importStats;
            buttonContainer.append(importInput);
            // Label to import stats
            const importLabel = document.createElement("label");
            importLabel.htmlFor = "import-stats-input";
            importLabel.innerText = "Import";
            importLabel.classList.add("button");
            buttonContainer.append(importLabel);
            // Toggle to hide/show chart
            const toggleButton = document.createElement("button");
            toggleButton.innerText = "Toggle View";
            toggleButton.onclick = () => toggleChartContainer(chartContainer);
            buttonContainer.append(toggleButton);
            // Open a modal for finding and deleting rows of data
            const findAndDeleteButton = document.createElement("button");
            findAndDeleteButton.innerText = "Find and delete";
            findAndDeleteButton.onclick = () => openFindAndDeleteModal();
            buttonContainer.append(findAndDeleteButton);
            // Buttons for each work
            const workElements = statisticsIndexGroup.querySelectorAll(".index.group>li:not(.group)");
            workElements.forEach((item) => {
                const workName = item.querySelector("dt>a:link").innerText;
                const chartContainer = document.createElement("div");
                chartContainer.classList.add("chart-container");
                item.append(chartContainer);
                const canvasWork = document.createElement("canvas");
                canvasWork.classList.add("stats-chart");
                chartContainer.append(canvasWork);
                const buttonContainer = document.createElement("div");
                buttonContainer.classList.add("stat-button-container", "actions");
                const drawButton = document.createElement("button");
                drawButton.innerText = "Draw";
                drawButton.onclick = () => drawChart(chartContainer, canvasWork, "work", workName);
                buttonContainer.append(drawButton);
                const toggleLabel = document.createElement("button");
                toggleLabel.innerText = "Toggle";
                toggleLabel.onclick = () => toggleChartContainer(chartContainer);
                buttonContainer.append(toggleLabel);
                const dt = item.querySelector("dt");
                dt.append(buttonContainer);
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const drawChart = async (container, canvas, type, workName) => {
        // If chart is hidden, show it
        if (container.offsetHeight == 0) {
            toggleChartContainer(container, true);
            await sleep(1000);
        }
        let storageStats = [];
        await getFromDb().then((response) => {
            storageStats = response.filter((item) => item.type === type);
            if (workName) {
                storageStats = storageStats.filter((item) => item.workName === workName);
            }
        }).catch((e) => {
            alert(`Something went wrong when trying to fetch the data from the database. ${e}`);
        });
        const { datasets } = statRowToDataSet(storageStats, type);
        // Destroy existing chart
        // @ts-ignore
        // eslint-disable-next-line
        const chartStatus = Chart.getChart(canvas.id);
        if (chartStatus) {
            chartStatus.destroy();
        }
        // @ts-ignore
        // eslint-disable-next-line
        new Chart(canvas.getContext("2d"), {
            type: "line",
            data: {
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                pointRadius: POINT_SIZE,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                        },
                        distribution: "linear",
                        grid: {
                            color: getTheme(THEME_MODE).gridLines,
                        },
                        ticks: {
                            color: getTheme(THEME_MODE).text,
                        },
                    },
                    y: {
                        ticks: {
                            precision: 0,
                            color: getTheme(THEME_MODE).text,
                        },
                        grid: {
                            color: getTheme(THEME_MODE).gridLines,
                        },
                    },
                },
                plugins: {
                    customCanvasBackgroundColor: {
                        color: getTheme(THEME_MODE).background,
                    },
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                const date = new Date(context[0].parsed.x);
                                return date.toLocaleString("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false, // Ensure 24-hour clock
                                });
                            },
                        },
                    },
                },
            },
            plugins: [plugin],
        });
    };
    const getStatKey = (type, workName, statName, date) => {
        return `${type};${workName};${statName};${date}`;
    };
    // Element names (arbitrary) and their DOM identifier
    const elementsTotal = new Map([
        [
            "user-subscriptions",
            {
                selector: "dd.user.subscriptions",
                color: getTheme(THEME_MODE).userSubscriptions,
                hidden: true,
            },
        ],
        [
            "kudos",
            {
                selector: "dd.kudos",
                color: getTheme(THEME_MODE).kudos,
                hidden: true,
            },
        ],
        [
            "comment-threads",
            {
                selector: "dd.comment.thread",
                color: getTheme(THEME_MODE).commentThreads,
                hidden: true,
            },
        ],
        [
            "bookmarks",
            {
                selector: "dd.bookmarks",
                color: getTheme(THEME_MODE).bookmarks,
                hidden: true,
            },
        ],
        [
            "subscriptions",
            {
                selector: "dd.subscriptions:not(.user)",
                color: getTheme(THEME_MODE).subscriptions,
                hidden: true,
            },
        ],
        [
            "word-count",
            {
                selector: "dd.words",
                color: getTheme(THEME_MODE).wordCount,
                hidden: true,
            },
        ],
        [
            "hits",
            {
                selector: "dd.hits",
                color: getTheme(THEME_MODE).hits,
                hidden: false,
            },
        ],
    ]);
    const elementsWork = new Map([
        [
            "kudos",
            {
                selector: "dd.kudos",
                color: getTheme(THEME_MODE).kudos,
                hidden: true,
            },
        ],
        [
            "comments",
            {
                selector: "dd.comments",
                color: getTheme(THEME_MODE).commentThreads,
                hidden: true,
            },
        ],
        [
            "bookmarks",
            {
                selector: "dd.bookmarks",
                color: getTheme(THEME_MODE).bookmarks,
                hidden: true,
            },
        ],
        [
            "subscriptions",
            {
                selector: "dd.subscriptions",
                color: getTheme(THEME_MODE).subscriptions,
                hidden: true,
            },
        ],
        [
            "words",
            {
                selector: "span.words",
                color: getTheme(THEME_MODE).wordCount,
                hidden: true,
            },
        ],
        [
            "hits",
            {
                selector: "dd.hits",
                color: getTheme(THEME_MODE).hits,
                hidden: false,
            },
        ],
    ]);
    const getTotalStats = () => {
        const stats = [];
        elementsTotal.forEach((value, key) => {
            if (STATS[key]) {
                const valueString = statisticsMetaGroup.querySelector(value.selector).innerText;
                // Regex to remove any non-digit symbols
                const valueNumber = Number(valueString.replace(/\D/g, ""));
                stats.push({
                    type: "total",
                    workName: "",
                    statName: key,
                    date: new Date(),
                    value: valueNumber,
                });
            }
        });
        return stats;
    };
    const getWorkStats = () => {
        const stats = [];
        const workElements = statisticsIndexGroup.querySelectorAll(".index.group>li:not(.group)");
        workElements.forEach((elem) => {
            const workName = elem.querySelector("dt>a:link").innerText;
            elementsWork.forEach((value, key) => {
                if (STATS[key]) {
                    const valueString = elem.querySelector(value.selector);
                    // Some stats might not exist on a work. Skip them
                    if (valueString) {
                        // Regex to remove any non-digit symbols
                        const valueNumber = Number(valueString.innerText.replace(/\D/g, ""));
                        stats.push({
                            type: "work",
                            workName: workName,
                            statName: key,
                            date: new Date(),
                            value: valueNumber,
                        });
                    }
                }
            });
        });
        return stats;
    };
    const DB_NAME = "ao3-statistics-tracker";
    const STORE_NAME = "user-stats";
    const DB_VERSION = 1;
    let dbPromise = null;
    const getDB = () => {
        if (!dbPromise) {
            dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                };
            });
        }
        return dbPromise;
    };
    const storeInDb = async (stats) => {
        await getDB()
            .then((db) => {
            stats.forEach((stat) => {
                const key = getStatKey(stat.type, stat.workName, stat.statName, formatDate(stat.date).yyyyMMdd_hhmm);
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                store.put(stat.value.toString(), key);
                tx.onerror = (err) => {
                    console.error(`Save failed for: ${stat.statName} ${stat.workName}. ${err}`);
                };
            });
        })
            .catch((err) => {
            console.error("IndexedDB open error:", err);
        });
    };
    const isValidKey = (key) => {
        return key.startsWith("work") || key.startsWith("total");
    };
    const getFromDb = async (asKeyValue = false) => {
        return new Promise((resolve, reject) => {
            const rows = [];
            getDB()
                .then((db) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const keyReq = store.getAllKeys();
                const valueReq = store.getAll();
                valueReq.onsuccess = () => {
                    const keys = keyReq.result;
                    const values = valueReq.result;
                    keys.forEach((key, i) => {
                        if (isValidKey(key)) {
                            if (asKeyValue) {
                                rows.push({
                                    key: key,
                                    value: Number(values[i])
                                });
                            }
                            else {
                                const [type, workName, statName, date] = key.split(DELIMITER);
                                rows.push({
                                    type: type,
                                    workName,
                                    statName,
                                    date: new Date(date),
                                    value: Number(values[i]),
                                });
                            }
                        }
                    });
                    resolve(rows);
                };
                valueReq.onerror = (e) => reject(e);
            })
                .catch((err) => {
                reject(err);
            });
        });
    };
    const deleteFromDb = async (key) => {
        getDB()
            .then((db) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.delete(key);
            tx.onerror = (err) => {
                console.error(`Delete failed. ${err}`);
            };
        })
            .catch((err) => {
            console.error("IndexedDB open error:", err);
        });
    };
    const getStatsFromLocalStorage = () => {
        const rows = [];
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
            if (isValidKey(keys[i])) {
                const [type, workName, statName, date] = keys[i].split(DELIMITER);
                rows.push({
                    type: type,
                    workName,
                    statName,
                    date: new Date(date),
                    value: Number(localStorage.getItem(keys[i])),
                });
            }
        }
        return rows.sort((a, b) => a.date.getTime() - b.date.getTime());
    };
    const kebabToTitleCase = (input) => {
        return input
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };
    const formatDate = (date) => {
        // Helper to pad single digits with leading zero
        const pad = (num) => num.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are 0-indexed
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        // --- ISO Week Calculation ---
        const getISOWeek = (d) => {
            const target = new Date(d);
            target.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
            const weekYear = target.getFullYear();
            // January 4 is always in week 1.
            const firstThursday = new Date(weekYear, 0, 4);
            firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
            const week = 1 +
                Math.round(((target.getTime() - firstThursday.getTime()) / 86400000 - 3) / 7);
            return { week, weekYear };
        };
        const { week, weekYear } = getISOWeek(date);
        return {
            yyyyMMdd_hhmm: `${year}-${month}-${day} ${hours}:${minutes}`,
            yyyyMMdd_hh: `${year}-${month}-${day} ${hours}`,
            yyyyMMdd: `${year}-${month}-${day}`,
            yyyyMM: `${year}-${month}`,
            yyyy_ww: `${weekYear}-W${pad(week)}`,
        };
    };
    const statRowToDataSet = (stats, type) => {
        const dataset = new Map();
        let keys = [];
        switch (type) {
            case "total":
                keys = Array.from(elementsTotal.keys());
                break;
            case "work":
                keys = Array.from(elementsWork.keys());
                break;
        }
        // Find each stat type
        keys.forEach((key) => {
            const list = [];
            // Get the stats for the stat type
            stats.forEach((stat) => {
                if (stat.statName === key) {
                    list.push([stat.date, stat.value]);
                }
            });
            // Convert keys from kebab-case to Title Case
            dataset.set(kebabToTitleCase(key), list);
        });
        return {
            datasets: Array.from(dataset).map((data, index) => {
                const values = data[1].map((entry) => {
                    return {
                        x: formatDate(entry[0]).yyyyMMdd_hhmm,
                        y: entry[1],
                    };
                });
                let backgroundColor = "";
                let hidden = false;
                switch (type) {
                    case "total":
                        backgroundColor = elementsTotal.get(keys[index]).color;
                        hidden = elementsTotal.get(keys[index]).hidden;
                        break;
                    case "work":
                        backgroundColor = elementsWork.get(keys[index]).color;
                        hidden = elementsWork.get(keys[index]).hidden;
                        break;
                }
                return {
                    label: data[0],
                    data: values,
                    borderWidth: 2,
                    // Set border color same as background except with less opacity
                    borderColor: backgroundColor,
                    backgroundColor: backgroundColor,
                    hidden: hidden,
                };
            }),
        };
    };
    const cleanStats = async (mode) => {
        await getDB()
            .then((db) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const keyReq = store.getAllKeys();
            keyReq.onsuccess = () => {
                const keys = keyReq.result.filter((key) => isValidKey(key.toString()));
                const dataPoints = new Map(keys.map((key) => {
                    const [type, workName, statName, date] = key.split(DELIMITER);
                    return [
                        key,
                        {
                            type,
                            workName,
                            statName,
                            date: new Date(date),
                        },
                    ];
                }));
                const toKeep = new Map();
                const toDelete = new Set();
                const findAndSortData = (value, key, shortDate) => {
                    const shortKey = getStatKey(value.type, value.workName, value.statName, shortDate);
                    const storedVal = toKeep.get(shortKey);
                    // If not stored, store it
                    if (!storedVal) {
                        toKeep.set(shortKey, {
                            fullDate: value.date,
                            key,
                        });
                    }
                    else if (value.date > storedVal.fullDate) {
                        // If current date is later than stored date
                        // Move stored item to delete
                        toDelete.add(storedVal.key);
                        // Set new stored item
                        toKeep.set(shortKey, {
                            fullDate: value.date,
                            key,
                        });
                    }
                    else if (value.date < storedVal.fullDate) {
                        // If current date is before stored date
                        // Set it to be deleted
                        toDelete.add(key);
                    }
                };
                if (mode === "hour") {
                    dataPoints.forEach((value, key) => {
                        findAndSortData(value, key, formatDate(value.date).yyyyMMdd_hh);
                    });
                }
                else if (mode === "day") {
                    dataPoints.forEach((value, key) => {
                        findAndSortData(value, key, formatDate(value.date).yyyyMMdd);
                    });
                }
                else if (mode === "week") {
                    dataPoints.forEach((value, key) => {
                        findAndSortData(value, key, formatDate(value.date).yyyy_ww);
                    });
                }
                else if (mode === "month") {
                    dataPoints.forEach((value, key) => {
                        findAndSortData(value, key, formatDate(value.date).yyyyMM);
                    });
                }
                toDelete.forEach((item) => {
                    deleteFromDb(item);
                });
                drawChart(chartContainer, canvasTotal, "total");
            };
        })
            .catch((err) => {
            alert(`Failed to clean stats. ${err}`);
            return [];
        });
    };
    const validateStatRow = (row, index) => {
        if (row.type !== "total" && row.type !== "work") {
            throw new Error(`Type "${row.type}" for row ${index} not recognized.`);
        }
        if (row.type !== "work" && row.workName !== "") {
            throw new Error(`Work name "${row.workName}" was found for row ${index}, but the type is not "work"`);
        }
        else if (row.type === "work" && row.workName === "") {
            throw new Error(`Type of row ${index} is "work", but work name is empty.`);
        }
        if (!Array.from(elementsTotal.keys()).includes(row.statName) &&
            !Array.from(elementsWork.keys()).includes(row.statName)) {
            throw new Error(`Stat name "${row.statName}" for row ${index} not recognized.`);
        }
        if (!new Date(row.date).getDate()) {
            throw new Error(`Date "${row.date}" for row ${index} is invalid.`);
        }
        if (!row.value || Number(row.value) < 0) {
            throw new Error(`Value "${row.value}" for row ${index} is invalid.`);
        }
        return true;
    };
    class FindAndDeleteModal {
        state;
        ui;
        constructor() {
            this.state = {
                currentPage: 0,
                itemsPerPage: 10,
                filteredRows: [],
                allRows: [],
                totalPages: 1
            };
        }
        async open() {
            this.state.allRows = await getFromDb(true);
            this.state.filteredRows = [...this.state.allRows];
            this.calculatePagination();
            this.initializeUI();
            this.renderTable();
            this.updateUI();
        }
        initializeUI() {
            this.ui = {
                modalBg: document.querySelector("#modal-bg"),
                modalWrap: document.querySelector("#modal-wrap"),
                modal: document.querySelector("#modal"),
                modalContent: document.querySelector("#modal>.content"),
                searchInput: null,
                paginationInfo: null,
                deleteAllBtn: null,
                prevBtn: null,
                nextBtn: null,
                tableBody: null,
                form: null
            };
            // Show modal
            this.ui.modalBg.style.display = "block";
            this.ui.modalWrap.style.display = "block";
            this.ui.modal.classList.add("tall");
            // Clear and build content
            this.ui.modalContent.innerHTML = "";
            this.createElements();
        }
        createElements() {
            // Title
            const title = document.createElement("h3");
            title.textContent = "Find and delete data";
            this.ui.modalContent.appendChild(title);
            // Form
            this.ui.form = document.createElement("form");
            this.ui.form.classList.add("search");
            this.ui.form.onsubmit = (e) => e.preventDefault();
            // Search section
            this.createSearchSection();
            // Pagination info
            this.ui.paginationInfo = document.createElement("p");
            this.ui.form.appendChild(this.ui.paginationInfo);
            // Buttons
            this.createButtonSection();
            // Table
            this.createTable();
            this.ui.modalContent.appendChild(this.ui.form);
        }
        createSearchSection() {
            const label = document.createElement("label");
            label.textContent = "Search text";
            label.htmlFor = "stat-search-input";
            this.ui.form.appendChild(label);
            const inputContainer = document.createElement("div");
            inputContainer.classList.add("stat-item-container");
            this.ui.searchInput = document.createElement("input");
            this.ui.searchInput.id = "stat-search-input";
            this.ui.searchInput.type = "text";
            this.ui.searchInput.value = "";
            const searchButton = document.createElement("button");
            searchButton.type = "submit";
            searchButton.textContent = "Search";
            searchButton.onclick = () => this.handleSearch();
            inputContainer.appendChild(this.ui.searchInput);
            inputContainer.appendChild(searchButton);
            this.ui.form.appendChild(inputContainer);
            const searchInfo = document.createElement("p");
            searchInfo.classList.add("footnote");
            searchInfo.textContent = "(Note that the search is case sensitive.)";
            this.ui.form.appendChild(searchInfo);
        }
        createButtonSection() {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("stat-item-container", "actions");
            buttonContainer.style.flexWrap = "wrap";
            this.ui.prevBtn = document.createElement("button");
            this.ui.prevBtn.textContent = "Prev";
            this.ui.prevBtn.onclick = () => this.handlePrevPage();
            this.ui.nextBtn = document.createElement("button");
            this.ui.nextBtn.textContent = "Next";
            this.ui.nextBtn.style.marginRight = "auto";
            this.ui.nextBtn.onclick = () => this.handleNextPage();
            const deleteSelected = document.createElement("button");
            deleteSelected.textContent = "Delete Selected";
            deleteSelected.onclick = () => this.handleDeleteSelected();
            this.ui.deleteAllBtn = document.createElement("button");
            this.ui.deleteAllBtn.onclick = () => this.handleDeleteAll();
            buttonContainer.append(this.ui.prevBtn, this.ui.nextBtn, deleteSelected, this.ui.deleteAllBtn);
            this.ui.form.appendChild(buttonContainer);
        }
        createTable() {
            const table = document.createElement("table");
            const thead = document.createElement("thead");
            thead.style.outline = "1px solid";
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = "<th>Selected</th><th>Key</th><th>Value</th>";
            thead.appendChild(headerRow);
            this.ui.tableBody = document.createElement("tbody");
            table.appendChild(thead);
            table.appendChild(this.ui.tableBody);
            this.ui.form.appendChild(table);
        }
        handleSearch() {
            const searchValue = this.ui.searchInput.value.trim();
            this.state.filteredRows = searchValue
                ? this.state.allRows.filter(row => row.key.includes(searchValue))
                : [...this.state.allRows];
            this.state.currentPage = 0;
            this.calculatePagination();
            this.renderTable();
            this.updateUI();
        }
        handlePrevPage() {
            if (this.state.currentPage > 0) {
                this.state.currentPage--;
                this.renderTable();
                this.updateUI();
            }
        }
        handleNextPage() {
            if (this.state.currentPage < this.state.totalPages - 1) {
                this.state.currentPage++;
                this.renderTable();
                this.updateUI();
            }
        }
        async handleDeleteSelected() {
            const formData = new FormData(this.ui.form);
            const keysToDelete = new Set(formData.keys());
            if (keysToDelete.size === 0)
                return;
            const isConfirmed = confirm(`This will delete ${keysToDelete.size} row(s). Are you sure?`);
            if (!isConfirmed)
                return;
            await this.deleteItems(keysToDelete);
        }
        async handleDeleteAll() {
            if (this.state.filteredRows.length === 0)
                return;
            const isConfirmed = confirm(`This will delete ${this.state.filteredRows.length} row(s). Are you sure?`);
            if (!isConfirmed)
                return;
            const keysToDelete = new Set(this.state.filteredRows.map(item => item.key));
            await this.deleteItems(keysToDelete);
        }
        async deleteItems(keysToDelete) {
            // Delete from database
            const deletePromises = Array.from(keysToDelete).map(key => deleteFromDb(key));
            await Promise.all(deletePromises);
            // Update local state
            this.state.allRows = this.state.allRows.filter(item => !keysToDelete.has(item.key));
            // Re-apply current search
            const searchValue = this.ui.searchInput.value.trim();
            this.state.filteredRows = searchValue
                ? this.state.allRows.filter(row => row.key.includes(searchValue))
                : [...this.state.allRows];
            // Adjust current page if necessary
            this.calculatePagination();
            if (this.state.currentPage >= this.state.totalPages) {
                this.state.currentPage = Math.max(0, this.state.totalPages - 1);
            }
            this.renderTable();
            this.updateUI();
        }
        calculatePagination() {
            this.state.totalPages = Math.max(1, Math.ceil(this.state.filteredRows.length / this.state.itemsPerPage));
        }
        getCurrentPageRows() {
            const startIdx = this.state.itemsPerPage * this.state.currentPage;
            const endIdx = startIdx + this.state.itemsPerPage;
            return this.state.filteredRows.slice(startIdx, endIdx);
        }
        renderTable() {
            const currentRows = this.getCurrentPageRows();
            // Use DocumentFragment for efficient DOM manipulation
            const fragment = document.createDocumentFragment();
            currentRows.forEach(({ key, value }) => {
                const row = document.createElement("tr");
                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = key;
                checkboxCell.appendChild(checkbox);
                const keyCell = document.createElement("td");
                keyCell.textContent = key;
                const valueCell = document.createElement("td");
                valueCell.textContent = String(value);
                row.appendChild(checkboxCell);
                row.appendChild(keyCell);
                row.appendChild(valueCell);
                fragment.appendChild(row);
            });
            // Single DOM update
            this.ui.tableBody.innerHTML = "";
            this.ui.tableBody.appendChild(fragment);
        }
        updateUI() {
            // Update pagination info
            this.ui.paginationInfo.textContent =
                `Search found ${this.state.filteredRows.length} of ${this.state.allRows.length} results. ` +
                    `Displaying page ${this.state.currentPage + 1} of ${this.state.totalPages}. ` +
                    `(Selects do not carry over across pages.)`;
            // Update delete all button
            this.ui.deleteAllBtn.textContent = `Delete All (${this.state.filteredRows.length} rows)`;
            // Update navigation buttons
            this.ui.prevBtn.disabled = this.state.currentPage === 0;
            this.ui.nextBtn.disabled = this.state.currentPage >= this.state.totalPages - 1;
        }
    }
    // Usage function
    const openFindAndDeleteModal = async () => {
        const modal = new FindAndDeleteModal();
        await modal.open();
    };
    const plugin = {
        id: "customCanvasBackgroundColor",
        beforeDraw: (chart, _, options) => {
            const { ctx: context } = chart;
            context.save();
            context.globalCompositeOperation = "destination-over";
            context.fillStyle = options.color || "white";
            context.fillRect(0, 0, chart.width, chart.height);
            context.restore();
        },
    };
    // Styles
    const styleTag = document.createElement("style");
    // Add CSS rules
    styleTag.textContent = `
    .chart-container {
      height: 0px;
      width: 100%;
      margin-block: 1em;
      transition: height 500ms ease-in-out;
      overflow: hidden;
    }

    #tracked-stats-chart,
    .stats-chart {
      display: block;
      width: 100%;
      height: 100%;
      background: #8888;
    }

    .stat-button-container {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 1em;
      padding: 1em 0;
      box-sizing: border-box;
    }

    .stat-button-container button,
    .stat-button-container label {
      cursor: pointer;
    }

    .stat-button-container label {
      margin: 0;
    }

    #import-stats-input {
      position: absolute;
      height: 0;
      width: 0;
      overflow: hidden !important;
      opacity: 0;
      z-index: -100;
    }

    .stat-item-container {
      display: flex;
      gap: .75rem
    }

    #modal .footnote {
      margin-top: .5em;
      opacity: 0.8;
      float: none;
    }

    #modal table {
      margin-top: 2rem;
      outline: 1px solid
    }

    #modal-bg .loading {
      display: none
    }

    #modal-wrap {
      width: 100%;
      position: fixed;
      top: 0 !important;
    }
  `;
    // Append the <style> element to the <head>
    document.head.appendChild(styleTag);
})();