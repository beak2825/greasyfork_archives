// ==UserScript==
// @name        Internet Roadtrip Map History
// @namespace   zptr.cc
// @author      zeroptr
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.1.1
// @license     MIT
// @description Shows more history on the Internet Roadtrip minimap (such as past honks)
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @grant       unsafeWindow
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/537881/Internet%20Roadtrip%20Map%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/537881/Internet%20Roadtrip%20Map%20History.meta.js
// ==/UserScript==

(async() => {
  const lib = await IRF.modules.maplibre;
  const map = (await IRF.vdom.map).data.map;

  const data = {
    type: "FeatureCollection",
    features: []
  };

  async function loadPastMarkers() {
    const req = await fetch(
      "https://roadtrip.zptr.cc/data/honks"
    );
    
    const markers = await req.json();
    markers.sort((a, b) => a.ts - b.ts);

    for (const marker of markers) {
      addMarker(marker.ts, marker.lat, marker.lon, marker.count || 1, marker.players);
    }
  }

  function addMarker(time, lat, lon, count=1, players=0) {
    data.features.push({
      type: "Feature",
      properties: { count, time, players },
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      }
    });
  }

  async function initEvents() {
    const container = await IRF.vdom.container;
    const fn = container.state.changeStop;
    container.state.changeStop = function (_, e) {
      if (e == -2) {
        const { lat, lng } = container.data.currentCoords;
        addMarker(Math.floor(Date.now() / 1000), lat, lng, 1, container.data.totalUsers);
        map.getSource("honks").setData(data);
      }

      fn.apply(this, arguments);
    };
  }

  initEvents();
  await loadPastMarkers();

  const img = await map.loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVWSURBVHgB7VrrdfJGEB3n5L/lCqxUAB0YV2CoAFKBSQWQCsAViFTg4wogFWBXIKUBCyrYzBWz35GJdrVaPT4Uc8+ZIx7Sal57Z7RaoiuuuOI744Z6AqVUyIew4K/Dzc3NO3niV+oPVu/v7+PD4ZB9CYKAhsMhPk5YvB3QG3AGxGywwkfIfr/nn9SSvgOQ/mma/jB+sVjA+FfyAMZiGVGfwAqPt9ttZvzz8zOMj4UTqo4TyrUz6hNY4fVyuVRhGKrPz8/U0/iAZY9MyjvgF+oHBnEcE2cB3d3d/cmsn1B1RC8vL8O3tzfqHThiKaaAL+nxdavX19dsCm02G9X6FADJ4CYiY5YheQLXqhP25AG+boGKwWWz0AGN9gEwlg8R1+uAJftN12v+L+GvG5a/KqYwnIfzJ1QRMD5JkuVkMiHdP7QGEBPPUzUajX6Uq7yghsP7QkKRK5HxeRtP0ptCHxBnXo/WpgAUnU6nhcbnBQqJEjGUdBh3RBWBa4qMp5YdkBbdkCyOgJJVssFRjxClMt81UtsOOO/Uqgjqu29jU6QHxprNZv+5D6amVJJUNd0JYkDdqfnIfD7XDc6YPKGNx1h6XDA/2mbhHViPNjKgpoH6jEiSpwNISFKmxJQqQrq8WOtwFu21arv3R40uYn/Mc1EkMy6KImXjiRwvVHIC7r9arbqJdsHNs/JHZsJZ6vNQKXDueDy2OkGMGDneP5JGqZtoFyhgLH9iSHB2Pjq7GNEiy3QQThiW3HvRabQLFAhN9ZYMDtDXlTkBTG6rDuoSnusRfcxrMhgh8zk0XJs9ntqcICVyS5cIiYC1+REOmFvGCMoyQUh0RZcGzD9b9EnKUVkE9XQw8QhqeRVS7ARaaZfWVyI4KhlvCNIzjYeqIXzQPdEVwSX6VCELZMwZOEM/t58LFjTUJawCV4k+VcgCGXuNhobsUyGkn4kq0aevWRA7jJ2RoqlRQp9fpyqo00oVmqUn8oEL85M9C+YO9xgh0qapIKV1RI7IGZ2tK8r1M/JBWd23CZwm7WopkdmmQhmnSBZ9MVovqeNv7/WAsq7PRaSxiRzuBSNS0/KaiVPUaQE2+xPAYuh6vc5epmCs3GrUjKoC0a/7yIu0dk1hKGlaY3DsL4aSCc+SDVvJwOoOULLGRjWMP1M+dpwKW1MW+DZHkl3V+glbp+YjSEuX9lZZVppkOq2pbSCF9FuVpiQ3FUqXwExZgDFcSdUbPk2Pq+CZXwwIS3QYm7JAyNCvprugCeKziTQ2+xIdsopQ1BfI9RG1ASW9ObVkvBbp8VcluqyLAqF7C2oaOvVNDNyk5PjAtm5gJEPboos3kPpg6jLlm5KyhVCZBoXtceNvelTJY2lbUrYQaiJj4YFmymGXqV8ktoVQUzmUayJqAm2zfkUnTHN6haZK4Lrg4mL8uAvWd5HcGyU4AmVibwpMXQfkd4gEu92OLgFJktDj4yN2loQQfG9Lt4veKottNnqrjQmyXfaDPNGXbXJGPDw84OC1gQrotQOYK4g5AB//Jk/02gG80oNdaBvPjZMZOucAbJvTggjieHt7ix2g2f/39/dfzj8ej4Rdoh8fHxkfYLsbruHXacRNUMKn/EE10LgDtGEgJxiGo94rqA2n076/Q+54lKP+L49blt9YBnTaMxjIuTuW3zn6tTYA1nKAnoMwDpHDkX/ThoG+j3I86GNdhZuGswMQORgLGQwGOqIJnSIB4/7Bsc58/BkwOkCnLb+lyQxmw3UUwbg7Ohl7UdH0wRcHwGjuxenp6SmLNH/fkRjMxu7o/wx12tmdyvr5TF3Kq+iuIE9c38voK6644tvjX5iDcFFA2WFzAAAAAElFTkSuQmCC");
  map.addImage("honk-image", img.data);

  map.addSource("honks", {
    type: "geojson",
    data,
    cluster: true,
    clusterMaxZoom: 8,
    clusterRadius: 5,
    clusterMinPoints: 10,
    clusterProperties: {
      "sum": ["+", ["get", "count"]]
    }
  });

  map.addLayer({
    id: "points",
    type: "symbol",
    source: "honks",
    filter: [">", ["zoom"], 5],
    layout: {
      "icon-image": "honk-image",
      "icon-size": 0.5
    },
  });

  let openedPopup;
  map.on("mouseenter", "points", (e) => {
    const { count, time, players } = e.features[0].properties;
    const date = new Date(time * 1000);

    if (openedPopup) {
      openedPopup.remove();
    }

    openedPopup = new lib.Popup()
      .setLngLat(e.features[0].geometry.coordinates.slice())
      .setHTML(`${date.toLocaleString()}<br>${count} honk${count == 1 ? "" : "s"} | ${players} players`)
      .addTo(map);
  });

  map.on("mouseleave", "points", () => {
    if (openedPopup) {
      openedPopup.remove();
      openedPopup = null;
    }
  });

  setTimeout(() => {
    map.moveLayer("points");
  }, 1000);
})();
