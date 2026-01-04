// ==UserScript==
// @name         Google Maps Enhanced (WME + Waze Live Map + OSM + Apple Maps + Mapillary + ArcGis)
// @namespace    https://openai.com/
// @version      1.2
// @description  Widget com links WME, Waze Live Map, OSM, Apple Maps, Mapillary e ArcGIS + ON/OFF + sliders de opacidade para Waze Live Map e OSM
// @match        https://www.google.com/maps/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541960/Google%20Maps%20Enhanced%20%28WME%20%2B%20Waze%20Live%20Map%20%2B%20OSM%20%2B%20Apple%20Maps%20%2B%20Mapillary%20%2B%20ArcGis%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541960/Google%20Maps%20Enhanced%20%28WME%20%2B%20Waze%20Live%20Map%20%2B%20OSM%20%2B%20Apple%20Maps%20%2B%20Mapillary%20%2B%20ArcGis%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------------------------------------
  // FIX: Google Maps removed #scene → new robust detector
  // -----------------------------------------------------
  function waitForMapReady(callback) {
    const check = setInterval(() => {
      const mapCanvas = document.querySelector("canvas");
      const app = document.querySelector("#app-container");
      const widget = document.querySelector(".widget-pane-content-holder");

      if (mapCanvas || app || widget) {
        clearInterval(check);
        callback();
      }
    }, 500);
  }

  waitForMapReady(() => {
    const overlays = {};
    let panelVisible = false;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "🔄 Maps";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.bottom = "102px";
    toggleBtn.style.left = "91px";
    toggleBtn.style.zIndex = "99999";
    toggleBtn.style.padding = "6px 11px";
    toggleBtn.style.background = "#0d47a1";
    toggleBtn.style.color = "white";
    toggleBtn.style.border = "1px solid white";
    toggleBtn.style.borderRadius = "6px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.fontSize = "13px";
    toggleBtn.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
    document.body.appendChild(toggleBtn);

    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "60px";
    panel.style.left = "50%";
    panel.style.transform = "translateX(-50%)";
    panel.style.zIndex = "99998";
    panel.style.background = "rgba(20, 30, 60, 0.95)";
    panel.style.padding = "10px";
    panel.style.borderRadius = "12px";
    panel.style.border = "1px solid white";
    panel.style.display = "none";
    panel.style.flexDirection = "row";
    panel.style.flexWrap = "wrap";
    panel.style.gap = "10px";
    panel.style.fontFamily = "sans-serif";
    document.body.appendChild(panel);

    toggleBtn.onclick = () => {
      panelVisible = !panelVisible;
      panel.style.display = panelVisible ? "flex" : "none";
      Object.values(overlays).forEach(iframe => {
        iframe.style.display = panelVisible ? "block" : "none";
      });
    };

    const layers = [
      {
        name: "WME Editor do Waze",
        icon: "https://pbs.twimg.com/media/D2Bg9htWkAYZaqt.png",
        onClick: (lat, lng, zoomGoogle) => {
          const zoomWME = Math.max(0, zoomGoogle);
          const url = `https://www.waze.com/pt-PT/editor?env=row&lat=${lat}&lon=${lng}&zoomLevel=${zoomWME}`;
          window.open(url, "_blank");
        }
      },
      {
        name: "Waze Live Map",
        icon: "https://cdn-images-1.medium.com/max/1200/1*3kS1iOOTBrvtkecae3u2aA.png",
        onClick: (lat, lng, zoomGoogle) => {
          const zoomWaze = Math.max(1, Math.min(18, Math.round((zoomGoogle - 3) * 0.75)));
          const url = `https://www.waze.com/livemap?lat=${lat}&lon=${lng}&zoom=${zoomWaze}`;
          window.open(url, "_blank");
        }
      },
      {
        name: "OSM",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/2048px-Openstreetmap_logo.svg.png",
        onClick: (lat, lng, zoom) => {
          const url = `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lng}`;
          window.open(url, "_blank");
        }
      },
      {
        name: "Apple Maps",
        icon: "https://th.bing.com/th/id/R.7bbe9deedfa162a68a224e18fbad2dfc?rik=nsbux2xtDIgyUw&pid=ImgRaw&r=0",
        onClick: (lat, lng, zoom) => {
          const url = `https://maps.apple.com/?ll=${lat},${lng}&z=${zoom}`;
          window.open(url, "_blank");
        }
      },
      {
        name: "Mapillary",
        icon: "https://pbs.twimg.com/profile_images/1097399669158825984/aXZ49j3I_400x400.png",
        onClick: (lat, lng, zoom) => {
          const url = `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=${zoom - 1}`;
          window.open(url, "_blank");
        }
      },
      {
        name: "ArcGIS",
        icon: "https://th.bing.com/th/id/OIP.e5Qa0gpEBMxdY1zIgJu5PQHaHa?w=164&h=180&c=7&r=0&o=5&pid=1.7",
        onClick: (lat, lng, zoom) => {
          const url = `https://www.arcgis.com/apps/Viewer/index.html?appid=3801d24f76d246adb134d43a7a222b2c&center=${lng},${lat}&level=${zoom}`;
          window.open(url, "_blank");
        }
      }
    ];

    function getMapPosition() {
      const match = location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d*)z/);
      if (match) {
        const [, lat, lng, zoom] = match;
        return { lat: parseFloat(lat), lng: parseFloat(lng), zoom: parseFloat(zoom) };
      }
      return { lat: 0, lng: 0, zoom: 0 };
    }

    layers.forEach(layer => {
      const container = document.createElement("div");
      container.style.textAlign = "center";
      container.style.width = "80px";

      const img = document.createElement("img");
      img.src = layer.icon;
      img.alt = layer.name;
      img.title = layer.name;
      img.style.width = "60px";
      img.style.height = "60px";
      img.style.borderRadius = "10px";
      img.style.border = "2px solid white";
      img.style.cursor = "pointer";
      img.style.transition = "transform 0.2s ease";

      img.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.1)";
        img.style.border = "2px solid gold";
      });

      img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
        img.style.border = "2px solid white";
      });

      img.addEventListener("click", () => {
        const { lat, lng, zoom } = getMapPosition();

        if (layer.overlay) {
          if (!overlays[layer.name]) {
            const iframe = document.createElement("iframe");
            iframe.src = layer.iframeURL(lat, lng, zoom);
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.zIndex = "9990";
            iframe.style.border = "none";
            iframe.style.pointerEvents = "auto";
            iframe.style.opacity = "1";
            iframe.style.display = panelVisible ? "block" : "none";
            document.body.appendChild(iframe);
            overlays[layer.name] = iframe;

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "×";
            closeBtn.style.position = "fixed";
            closeBtn.style.top = "10px";
            closeBtn.style.right = "10px";
            closeBtn.style.zIndex = "9991";
            closeBtn.style.background = "red";
            closeBtn.style.color = "white";
            closeBtn.style.border = "none";
            closeBtn.style.borderRadius = "50%";
            closeBtn.style.width = "25px";
            closeBtn.style.height = "25px";
            closeBtn.style.cursor = "pointer";
            closeBtn.style.display = "none";
            closeBtn.onclick = () => {
              iframe.style.display = "none";
              closeBtn.style.display = "none";
            };
            document.body.appendChild(closeBtn);

            iframe.onmouseenter = () => closeBtn.style.display = "block";
            iframe.onmouseleave = () => closeBtn.style.display = "none";
          } else {
            const iframe = overlays[layer.name];
            iframe.style.display = iframe.style.display === "none" ? "block" : "none";
          }
        } else if (layer.onClick) {
          layer.onClick(lat, lng, zoom);
        }
      });

      container.appendChild(img);
      panel.appendChild(container);
    });
  });
})();
