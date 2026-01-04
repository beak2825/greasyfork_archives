// ==UserScript==
// @name         ismyinternetworking.com (EVA Edition)
// @namespace    https://dsc.bio/jamsandwich47
// @version      0.3.3
// @description  ismyinternetworking.com but with cool Evangelion GUI or smth
// @author       Kur0
// @match        https://ismyinternetworking.com/
// @icon         https://www.google.com/s2/favicons?domain=ismyinternetworking.com
// @grant        none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431863/ismyinternetworkingcom%20%28EVA%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431863/ismyinternetworkingcom%20%28EVA%20Edition%29.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const head = document.querySelector("head");

  // Function to load a script and return a Promise that resolves when the script has loaded
  function loadScript(scriptSrc) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.onload = resolve;
      script.onerror = reject;
      head.appendChild(script);
    });
  }

  async function loadScripts() {
    await loadScript("https://cdn.jsdelivr.net/npm/chart.js@^3");
    await loadScript("https://cdn.jsdelivr.net/npm/moment@^2");
    await loadScript("https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@^1");
    console.log("All scripts have loaded");
  }
  loadScripts();

  const canvasWrapper = document.createElement("div");
  const canvas = document.createElement("canvas");
  canvas.id = "liveGraph";
  canvasWrapper.appendChild(canvas);
  document.body.appendChild(canvasWrapper);

  canvasWrapper.style.height = "33vh";
  canvasWrapper.style.width = "26vw";
  canvasWrapper.style.position = "fixed";
  canvasWrapper.style.zIndex = "99999999";
  canvasWrapper.style.top = "0";
  canvasWrapper.style.resize = "both";
  canvasWrapper.style.overflow = "hidden";

  const liveGraph = document.querySelector("#liveGraph");
  liveGraph.style.display = "block";
  liveGraph.style.boxSizing = "border-box";

  liveGraph.style.position = "fixed";
  liveGraph.style.zIndex = "99999999";

  // Draggability stuff
  canvasWrapper.addEventListener("mousedown", dragStart);
  canvasWrapper.addEventListener("mouseup", dragEnd);
  canvasWrapper.addEventListener("mouseout", dragEnd);

  let dragEl;
  const lastPosition = {};

  function dragStart(event) {
    dragEl = canvasWrapper;
    lastPosition.left = event.target.clientX;
    lastPosition.top = event.target.clientY;
    canvasWrapper.addEventListener("mousemove", dragMove);
  }

  function dragMove(event) {
    const dragElRect = dragEl.getBoundingClientRect();
    const newLeft = dragElRect.left + event.clientX - lastPosition.left;
    const newTop = dragElRect.top + event.clientY - lastPosition.top;
    dragEl.style.setProperty("left", `${newLeft}px`);
    dragEl.style.setProperty("top", `${newTop}px`);
    lastPosition.left = event.clientX;
    lastPosition.top = event.clientY;
    window.getSelection().removeAllRanges();
  }

  function dragEnd() {
    canvasWrapper.classList.remove("dragging");
    canvasWrapper.removeEventListener("mousemove", dragMove);
    dragEl = null;
  }

  function ClickConnect() {
    console.log("Clicked on thing");
    document.querySelector("#yeslink").click();

    document.body.style.backgroundColor = "#000000";
  }
  document.body.style.overflow = "hidden";

  var normaldiv = document
    .querySelector("body")
    .appendChild(document.createElement("div"));
  normaldiv.style.position = "fixed";
  normaldiv.style.aspectRatio = "180/133";
  normaldiv.style.height = "100vh";
  normaldiv.style.marginLeft = "auto";
  normaldiv.style.marginRight = "auto";
  normaldiv.style.top = "0";
  normaldiv.style.left = "0";
  normaldiv.style.right = "0";
  normaldiv.style.margin = "auto";
  normaldiv.style.width = "fit-content";
  normaldiv.style.zIndex = "999";

  var ping = normaldiv.appendChild(document.createElement("p"));
  ping.innerHTML = "Loading...";
  ping.style.position = "absolute";
  ping.style.left = "11%";
  ping.style.bottom = "0";
  ping.style.zIndex = "9999";
  ping.style.mixBlendMode = "screen";
  ping.style.color = "#ffde64";
  ping.style.fontSize = "12vh";
  ping.style.margin = "0";

  var normal = normaldiv.appendChild(document.createElement("img"));
  normal.src =
    "https://quiet-sun-6d6e.cantilfrederick.workers.dev/?https://i.imgur.com/kAWK7Jd.gif";
  normal.style.display = "block";
  normal.style.position = "fixed";
  normal.style.top = "0";
  normal.style.height = "100vh";
  normal.style.left = "0";
  normal.style.zIndex = "999";
  normal.style.right = "0";
  normal.style.margin = "auto";

  var warning = document
    .querySelector("body")
    .appendChild(document.createElement("img"));
  warning.src =
    "https://quiet-sun-6d6e.cantilfrederick.workers.dev/?https://i.gifer.com/embedded/download/1uYd.gif";
  warning.style.display = "none";
  //warning.style.opacity='0'
  warning.style.position = "fixed";
  warning.style.top = "0";
  warning.style.width = "100vw";
  warning.style.left = "0";
  warning.style.zIndex = "1000";
  warning.id = "warning";

  var elementToObserve = document.querySelector(
    "#center > div.test-info-wrapper > div:nth-child(4) > div.infobox-panel.infobox-ping.infobox-left > div > div.infobox-content.infobox-content-ping"
  );

  // create a new instance of 'MutationObserver' named 'observer',
  // passing it a callback function
  let chart;

  const plugin = {
    id: "blackBg",
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  window.chart = false;

  var observer = new MutationObserver(function (mutationsList, observer) {
    if (mutationsList[0].addedNodes[0].nodeValue == "N/A") {
      console.log("dead");

      $("#warning").fadeIn();
    } else if (mutationsList[0].removedNodes[0].nodeValue == "N/A") {
      console.log("back");
      console.log(mutationsList[0]);

      $("#warning").fadeOut();
      //   warning.style.opacity='0'
      ping.style.display = "block";
    }

    const pingCount = mutationsList[0].addedNodes[0].nodeValue;
    ping.innerHTML = pingCount;

    if (!window.chart) {
      console.log("Initializing Chart");
      console.log(`window.chart is ${window.chart}`);
      try {
        window.chart = new Chart(canvas, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Live Data",
                data: [],
                backgroundColor: "rgba(255, 171, 0, 0.2)",
                borderColor: "rgba(255, 171, 0, 1)",
                borderWidth: 1,
                pointRadius: 0,
                stepped: "true",
              },
            ],
          },
          plugins: [plugin],
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
        console.log("New chart success");
      } catch (error) {
        if (error.message == "Chart is not defined") {
          console.log("Chart.js not loaded");
        } else {
          console.log(`Chart init error: ${error.message}`);
          const charts = Object.values(Chart.instances);
          charts.forEach((chart) => chart.destroy());
        }
      }
    }

    console.log(`Sending ${window.chart}`);
    updateGraph(pingCount, window.chart);
  });

  // call 'observe' on that MutationObserver instance,
  // passing it the element to observe, and the options object

  observer.observe(elementToObserve, {
    characterData: false,
    childList: true,
    attributes: false,
  });

  setInterval(ClickConnect, 250);

  // Graph stuff -------------------------------------------------------------------------------

  const dataPoints = [];

  // Create a function to update the graph with new data
  function updateGraph(ping, chart) {
    // Add a new data point to the array
    if (ping == "N/A") {
      ping = 0;
    } else {
      ping = parseInt(ping.slice(0, -2));
    }
    console.log(`Graphing ${ping}`);
    console.log(chart);
    let newDataPoint = {};
    try {
      newDataPoint = {
        x: moment(),
        y: ping,
      };
    } catch (error) {
      if (error.message == "moment is not defined") {
        console.log("moment not loaded.");
        return;
      } else {
        throw error;
      }
    }
    console.log(`newDataPoint is...`);
    console.log(newDataPoint);
    dataPoints.push(newDataPoint);
    // Update the chart with new data
    chart.data.labels = Array.from({ length: dataPoints.length }, (_, i) =>
      i.toString()
    );

    chart.data.datasets[0].data = dataPoints;

    function getGradient(chart, ctx, chartArea) {
      let width, height, gradient;
      const chartWidth = chartArea.right - chartArea.left;
      const chartHeight = chartArea.bottom - chartArea.top;
      if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        const yScale = chart.scales["y"];
        const yPos = yScale.getPixelForValue(0);
        gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
        gradient.addColorStop(0.01, "rgba(255, 0, 0, 1)");
        gradient.addColorStop(0.01, "rgba(255, 171, 0, 1)");
        gradient.addColorStop(1, "rgba(255, 171, 0, 1)");
      }

      return gradient;
    }

    if (ping == 0) {
      chart.data.datasets[0].borderColor = "rgba(255, 0, 0, 1)";
    } else {
      chart.data.datasets[0].borderColor = function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }
        return getGradient(chart, ctx, chartArea);
      };
    }

    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "second",
            displayFormats: {
              second: "h:mm:ss a",
            },
          },
          // min: newDataPoint.x.clone().subtract(5, "seconds"),
          min: newDataPoint.x.clone().subtract(1, "minutes"),
          max: newDataPoint.x.clone(),
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(245, 255, 255, 0.25)",
          },
          min: 0,
        },
      },
      plugins: {
        blackBg: {},
      },
    };
    console.log("Datapoints are:");
    console.log(dataPoints);
    try {
      chart.update();
    } catch (error) {
      if (
        error.message ==
        "This method is not implemented: Check that a complete date adapter is provided."
      ) {
        console.log("moment adapter not loaded yet");
      } else {
        throw error;
      }
    }
  }
})();
