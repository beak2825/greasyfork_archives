// ==UserScript==
// @name         WME 2gis Layer
// @namespace    https://greasyfork.org/scripts/387401-wme-2gis-layer
// @version      0.2.2
// @description  2gis layer in waze editor
// @author       ixxvivxxi, madnut-ua
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387401/WME%202gis%20Layer.user.js
// @updateURL https://update.greasyfork.org/scripts/387401/WME%202gis%20Layer.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */

function bootstrap(attempts) {
  attempts = attempts || 1;

  if (
    W &&
    W.map &&
    document.getElementById("layer-switcher-item_satellite_imagery")
  ) {
    init();
  } else if (attempts < 1000)
    setTimeout(function() {
      bootstrap(attempts++);
    }, 200);
}

bootstrap();

function init() {
  const tilesLang = localStorage.getItem("2gisTilesLang") || "ru";

  const w2gis = new OpenLayers.Layer.XYZ(
    "w2gis",
    "https://tile2.maps.2gis.com/tiles?",
    {
      uniqueName: "w2gis",
      getURL: function(bounds) {
        const res = this.map.getResolution();
        const x = Math.round(
          (bounds.left - this.maxExtent.left) / (res * this.tileSize.w)
        );
        const y = Math.round(
          (this.maxExtent.top - bounds.top) / (res * this.tileSize.h)
        );
        const z = this.map.getZoom();
        let ts = "&ts=online_sd";
        if (this.tilesLang !== "ru") {
          ts = `&ts=online_sd_${tilesLang}`;
        }
        return `${this.url}x=${x}&y=${y}&z=${z}&v=1.5${ts}`;
      },
      displayOutsideMaxExtent: true,
      tilesLang
    }
  );
  W.map.addLayer(w2gis);

  const list = document.querySelector(".collapsible-GROUP_DISPLAY");
  let liElem = document.createElement("li");
  liElem.innerHTML = `<wz-checkbox class="hydrated" id="layer-switcher-item-w2gis">2GIS</wz-checkbox>
  <div style="display: inline-block; width: 80px; margin-left: 10px;">
     <select id="w2gis-lang-selector" class="form-control" style="border: 1px solid;height: 24px;padding: 0px 12px 0px 12px;position: relative;top: -5px;"></select>
  </div>`;

  list.append(liElem);

  const langs = ["ru", "uk"];
  const select = document.getElementById("w2gis-lang-selector");

  langs.forEach(lang => {
    let option = document.createElement("option");
    option.value = lang;
    option.innerHTML = lang;
    if (tilesLang === lang) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener("change", function(e) {
    const tilesLang = e.target.value;
    localStorage.setItem("2gisTilesLang", tilesLang);
    w2gis.tilesLang = tilesLang;
    w2gis.redraw();
  });

  document
    .getElementById("layer-switcher-item-w2gis")
    .addEventListener("click", function(e) {
      W.map.getLayerByUniqueName(w2gis.uniqueName).setVisibility(e.target.checked);
      if (e.target.checked) {
        W.layerSwitcherController.setTogglerState(
          "ITEM_SATELLITE_IMAGERY",
          false
        );
      }
    });

  const googleLayerId = W.map.layers[0].id;

  W.map.events.register("changelayer", this, function(map) {
    if (map.layer.type && map.layer.visibility) {
      document.getElementById("layer-switcher-item-w2gis").checked = false;
      W.map.getLayerByUniqueName(w2gis.uniqueName).setVisibility(false);
    }
  });

  W.map.events.register("moveend", W.map, function() {
    if (w2gis.visibility) {
      w2gis.redraw();
    }
  });
}
