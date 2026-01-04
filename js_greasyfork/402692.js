// ==UserScript==
// @name        TradingView-free watchlist unlimited color flags
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @require     https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js
// @resource    pickrCSS https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css

// @namespace   TradingViewWatchlistColorFlags
// @description you can specify any color for any flag in TradingView (free version)
// @author      kboudy
// @include     https://tradingview.com/*
// @include     https://www.tradingview.com/*
// @version     2.5
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/402692/TradingView-free%20watchlist%20unlimited%20color%20flags.user.js
// @updateURL https://update.greasyfork.org/scripts/402692/TradingView-free%20watchlist%20unlimited%20color%20flags.meta.js
// ==/UserScript==

const symbolsWithClicks = {};
var newCSS = GM_getResourceText("pickrCSS");
GM_addStyle(newCSS);

const addPickr = (anchorEl, symbol) => {
  const currentColor = getFillColor(anchorEl);
  const pickrDiv = document.createElement("div");
  pickrDiv.innerHTML = `<div class="entry">
  <div>
<div class="pickr"></div>
</div>
</div>`;

  pickrDiv.style.position = "relative";
  pickrDiv.style.top = "-60px";
  pickrDiv.style.left = "-240px";
  //ckrDiv.style.width = "500px";
  //pickrDiv.style.height = "500px";
  //pickrDiv.style.backgroundColor = "red";
  anchorEl.appendChild(pickrDiv);

  const pickr = Pickr.create({
    el: ".pickr",
    theme: "classic", // or 'monolith', or 'nano'
    default: currentColor,
    defaultRepresentation: "HEX",

    components: {
      // Main components
      preview: false,
      opacity: false,
      hue: true,
      // Input / output Options
      interaction: {
        hex: false,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        input: true,
        clear: true,
        save: true,
      },
    },
  });

  pickr
    .on("init", (instance) => {})
    .on("hide", (instance) => {})
    .on("show", (color, instance) => {})
    .on("save", (color, instance) => {
      if (color) {
        pickr.destroyAndRemove();
        let tvc = {};
        const tvcStr = GM_getValue("tradingViewColors");
        if (tvcStr) {
          tvc = JSON.parse(tvcStr);
        }
        const hexColor = color.toHEXA().join("").toUpperCase();
        tvc[symbol] = `#${hexColor}`;

        const tvcStringified = JSON.stringify(tvc);
        GM_setValue("tradingViewColors", tvcStringified);
        console.log(tvcStringified);
        const flagSvg = $(anchorEl).find("div").first().find(`[fill]`);
        $(flagSvg).css({ fill: hexColor });
      }
    })
    .on("clear", (instance) => {
      pickr.destroyAndRemove();
    })
    .on("change", (color, instance) => {})
    .on("cancel", (instance) => {});

  pickr.show();
};

const rgbToHex = (rgb) => {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const getFillColor = (row) => {
  const flagSvg = $(row).find("div").first().find(`[fill]`);
  let color = $(flagSvg).css("fill");
  if (color.startsWith("rgb")) {
    const numStr = color.split("(")[1].split(")")[0];
    const r = rgbToHex(parseInt(numStr.split(",")[0]));
    const g = rgbToHex(parseInt(numStr.split(",")[1]));
    const b = rgbToHex(parseInt(numStr.split(",")[2]));
    color = `#${r}${g}${b}`.toUpperCase();
  }
  return color;
};

(() => {
  //GM_setValue("tradingViewColors", `{"ETHUSD":"#FFA500","BTCUSD":"#FFA500","AMGN":"#800080","SMH":"#800080","HYG":"#800080","CL1!":"#808080","STNG":"#808080","TNK":"#808080","SLV":"#ffff00","XAGUSD":"#FFFF00","GLD":"#ffff00","XAUUSD":"#ffff00","DXY":"#008000","UUP":"#008000","SPY":"#0000ff","ES1!":"#0000ff","NQ1!":"#0000ff","AAPL":"#6EF436"}`);

  const setupFlagClicks = (interval) => {
    const container = $("div[class^='listContainer-']");

    let tvc = {};
    const tvcStr = GM_getValue("tradingViewColors");
    if (tvcStr) {
      tvc = JSON.parse(tvcStr);
    }

    if (container.children().length > 0) {
      const symbolRows = $(container.children()[0]).children().toArray();
      for (const sr of symbolRows) {
        if (!sr.innerText) {
          continue;
        }
        const symbolText = sr.innerText.split("\n")[0];
        if (!symbolText) {
          continue;
        }
        const flagSvg = $(sr).find("div").first().find(`[fill]`);
        if (!symbolsWithClicks[symbolText]) {
          symbolsWithClicks[symbolText] = true;
          flagSvg[0].addEventListener("click", (e) => {
            if (e.ctrlKey) {
              addPickr(sr, symbolText);
              e.stopPropagation();
              return false;
            }
          });
        }

        const flagColor = tvc[symbolText];
        if (flagColor) {
          $(flagSvg).css({ fill: flagColor });
        }
      }

      // then color the chart symbol's flag
      if (document.title)
      {
          const chartSymbol = document.title.split(' ')[0];
          const activeChartFlag = $("div[class^='uiMarker-']")[0];
          const activeChartFlagSvg = $(activeChartFlag).find("path").first();
          const activeFlagColor = tvc[chartSymbol];
        if (activeFlagColor) {
            //debugger;
          $(activeChartFlagSvg).css({ fill: activeFlagColor });
        }
      }

      if (interval) {
        clearInterval(interval);

        // change the interval to a slower loop, checking for new flags
        setInterval(() => {
          setupFlagClicks();
        }, 500);
      }
    }
  };

  const initialInterval = setInterval(() => {
    setupFlagClicks(initialInterval);
  }, 10);
})();
