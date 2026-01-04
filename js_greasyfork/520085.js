// ==UserScript==
// @name         Nitro Type Post Race Analysis
// @version      3.0
// @description  Post Race Analysis
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/501960/1418069/findReact.js
// @license      MIT
// ==/UserScript==

(function () {
  const raceData = {};
  let chartInstance = null;

  const loadChartJS = () => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.head.appendChild(script);
  };

  loadChartJS();

const generateColorFromID = (id, index) => {
    const primaryColors = [
        "hsl(0, 70%, 50%)",
        "hsl(120, 70%, 50%)",
        "hsl(240, 70%, 50%)",
        "hsl(60, 70%, 50%)",
        "hsl(300, 70%, 50%)",
    ];
    return primaryColors[index % primaryColors.length];
};

const ensureDrawerContainer = () => {
    let drawerContainer = document.getElementById("drawerContainer");
    if (!drawerContainer) {
        drawerContainer = document.createElement("div");
        drawerContainer.id = "drawerContainer";
        drawerContainer.style.position = "fixed";
        drawerContainer.style.left = "0";
        drawerContainer.style.bottom = "-50%";
        drawerContainer.style.width = "100%";
        drawerContainer.style.height = "50%";
        drawerContainer.style.backgroundColor = "#1E1E2F";
        drawerContainer.style.color = "#FFFFFF";
        drawerContainer.style.boxShadow = "0 -5px 15px rgba(0, 0, 0, 0.8)";
        drawerContainer.style.transition = "bottom 0.4s ease-in-out";
        drawerContainer.style.zIndex = "1000";
        drawerContainer.style.fontFamily = "Arial, sans-serif";
        drawerContainer.style.display = "flex";
        drawerContainer.style.flexDirection = "column";

        drawerContainer.innerHTML = `
            <div style="background-color: #2E2E4F;">
                <button id="closeDrawer" style="position: absolute; right: 10px; top: 10px; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div id="lessonContainer" style="padding: 10px; color: #FFFFFF; background-color: #2E2E4F; font-family: Arial, sans-serif; border: 1px solid #444; border-radius: 5px; overflow-y: auto; max-height: 20%;"></div>
            <div style="flex-grow: 1;">
                <canvas id="speedChart" style="background: #1e1e2f; display: block; width: 100%; height: 100%;"></canvas>
            </div>
        `;
        document.body.appendChild(drawerContainer);

        const closeDrawer = document.getElementById("closeDrawer");
        closeDrawer.addEventListener("click", () => {
            drawerContainer.style.bottom = "-50%";
        });

        const toggleButton = document.createElement("div");
        toggleButton.id = "toggleDrawer";
        toggleButton.style.position = "fixed";
        toggleButton.style.bottom = "20px";
        toggleButton.style.right = "20px";
        toggleButton.style.width = "50px";
        toggleButton.style.height = "50px";
        toggleButton.style.backgroundColor = "#2E2E4F";
        toggleButton.style.color = "#FFFFFF";
        toggleButton.style.borderRadius = "50%";
        toggleButton.style.display = "flex";
        toggleButton.style.alignItems = "center";
        toggleButton.style.justifyContent = "center";
        toggleButton.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.zIndex = "1001";
        toggleButton.innerText = "+";
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener("click", () => {
            if (drawerContainer.style.bottom === "0px") {
                drawerContainer.style.bottom = "-50%";
            } else {
                drawerContainer.style.bottom = "0";
            }
        });

        document.addEventListener("click", (event) => {
            if (
                !drawerContainer.contains(event.target) &&
                event.target !== toggleButton &&
                drawerContainer.style.bottom === "0px"
            ) {
                drawerContainer.style.bottom = "-50%";
            }
        });

        drawerContainer.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }
};

const adjustCanvasSize = () => {
    const canvas = document.getElementById("speedChart");
    const container = document.getElementById("drawerContainer");
    const headerHeight = 50;
    const lessonHeight = document.getElementById("lessonContainer").offsetHeight;

    const height = container.offsetHeight - headerHeight - lessonHeight;
    canvas.style.height = `${height}px`;
    canvas.style.width = "100%";
};

  const trackPlayerProgress = (player, baseTime) => {
    const { progress, profile } = player;

    if (!progress || progress.left || progress.disqualified) {
      return;
    }

    const typedCharacters = progress.typed || 0;
    const startStamp = progress.startStamp - baseTime;
    const currentStamp = Date.now() - baseTime;

    if (!raceData[player.userID]) {
      raceData[player.userID] = {
        name: profile?.displayName || `Player ${player.userID}`,
        data: [],
        finished: false,
        finishTime: null,
      };
    }

    if (raceData[player.userID].finished) {
      return;
    }

    const raceTimeMs = progress.completeStamp
      ? progress.completeStamp - startStamp
      : currentStamp - startStamp;

    if (progress.completeStamp && !raceData[player.userID].finished) {
      raceData[player.userID].finished = true;
      raceData[player.userID].finishTime = raceTimeMs;
    }

    const wpm = typedCharacters / 5 / (raceTimeMs / 60000);
    const currentTime = (raceTimeMs / 1000).toFixed(2);
    const lastDataPoint = raceData[player.userID].data.at(-1);

    if (!lastDataPoint || lastDataPoint.time !== currentTime) {
      raceData[player.userID].data.push({
        time: currentTime,
        wpm: parseFloat(wpm.toFixed(2)),
      });
    }
  };

  const cleanData = () => {
    Object.keys(raceData).forEach((playerId) => {
      const player = raceData[playerId];
      if (!player.finished) return;

      const finalPoint = player.data.at(-1);
      if (finalPoint && parseFloat(finalPoint.wpm) === 0) {
        player.data.pop();
      }

      player.data = player.data.filter(
        (point) => parseFloat(point.time) < 10000
      );
    });
  };

const displayChart = (lessonText) => {
    cleanData();
    ensureDrawerContainer();

    const drawerContainer = document.getElementById("drawerContainer");
    drawerContainer.style.bottom = "0";

    const lessonContainer = document.getElementById("lessonContainer");
    lessonContainer.innerHTML = lessonText
        .split(" ")
        .map((word, index) => `<span id="word-${index}">${word}</span>`)
        .join(" ");

    adjustCanvasSize();

    const ctx = document.getElementById("speedChart").getContext("2d");
    if (chartInstance) {
        chartInstance.destroy();
    }

    const datasets = Object.values(raceData).map((player) => ({
        label: player.name,
        data: player.data.map((point) => point.wpm),
        borderColor: generateColorFromID(player.name || player.userID),
        borderWidth: 3,
        fill: false,
        tension: 0.4,
    }));

    const labels = Object.values(raceData)[0]?.data.map((point) => point.time) || [];

    if (labels.length === 0 || datasets.length === 0) {
        console.error("No data to plot. Check race data collection.");
        return;
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0,
            },
            plugins: {
                title: {
                    display: true,
                    text: "Race Performance (WPM)",
                    color: "#FFFFFF",
                    font: {
                        size: 18,
                    },
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        color: "#FFFFFF",
                        font: {
                            size: 12,
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const time = tooltipItem.label;
                            const wordIndex = Math.floor(
                                (time / labels[labels.length - 1]) *
                                    lessonText.split(" ").length
                            );
                            document
                                .querySelectorAll("#lessonContainer span")
                                .forEach((el) => (el.style.backgroundColor = ""));
                            const highlightWord = document.getElementById(`word-${wordIndex}`);
                            if (highlightWord) {
                                highlightWord.style.backgroundColor = "#1a60ba";
                            }
                            return tooltipItem.raw;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: { display: true, text: "Time (s)", color: "#FFFFFF" },
                    ticks: { color: "#FFFFFF" },
                },
                y: {
                    title: { display: true, text: "Words Per Minute (WPM)", color: "#FFFFFF" },
                    ticks: { color: "#FFFFFF" },
                    beginAtZero: true,
                },
            },
        },
    });
};

  const observeRace = () => {
    const raceContainer = document.getElementById("raceContainer");
    const reactObj = raceContainer ? findReact(raceContainer) : null;

    if (!reactObj) {
      console.error("React object not found.");
      return;
    }

    const server = reactObj.server;
    const baseTime = Date.now() - performance.now();

    let lessonText = "";

    server.on("status", (e) => {
        if (e.lesson) {
            lessonText = e.lesson;
        }
    });

    server.on("update", (e) => {
      const racers = reactObj.state.racers;
      racers.forEach((player) => {
        trackPlayerProgress(player, baseTime);
      });

      if (reactObj.state.raceStatus === "finished") {
         displayChart(lessonText);
      }
    });
  };

  observeRace();
})();
