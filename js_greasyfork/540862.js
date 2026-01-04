// ==UserScript==
// @name         Internet Roadtrip - Minimap Teleport Markers
// @description  Replace teleport-like jumps on the neal.fun/internet-roadtrip minimap with portal markers
// @namespace    me.netux.site/user-scripts/internet-roadtrip/minimap-teleport-markers
// @version      0.2.1
// @author       netux
// @license      MIT
// @match        https://neal.fun/*
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Minimap%20Teleport%20Markers%20logo.png
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/540862/Internet%20Roadtrip%20-%20Minimap%20Teleport%20Markers.user.js
// @updateURL https://update.greasyfork.org/scripts/540862/Internet%20Roadtrip%20-%20Minimap%20Teleport%20Markers.meta.js
// ==/UserScript==

/* globals IRF */

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip -', '').trim();
  const MOD_PREFIX = 'mtpm-';

  const PORTAL_ICONS_SOURCE_NAME = `${MOD_PREFIX}portal-icons`;
  const PORTAL_ICONS_LAYER_NAME = `${MOD_PREFIX}portal-icons`;
  // const TELEPORT_LINES_SOURCE_NAME = `${MOD_PREFIX}teleport-lines`;
  const TELEPORT_LINES_LAYER_NAME = `${MOD_PREFIX}teleport-lines`;

  //const PORTAL_ENTRANCE_IMAGE_URL = 'https://cloudy.netux.site/neal_internet_roadtrip/teleport-markers/portal-entrance.svg';
  const PORTAL_ENTRANCE_IMAGE_URL = 'https://cloudy.netux.site/neal_internet_roadtrip/teleport-markers/portal-entrance.png';
  const PORTAL_ENTRANCE_IMAGE_NAME = 'portal-entrance';
  const PORTAL_ENTRANCE_COLOR = 'blue';

  //const PORTAL_EXIT_IMAGE_URL = 'https://cloudy.netux.site/neal_internet_roadtrip/teleport-markers/portal-exit.svg';
  const PORTAL_EXIT_IMAGE_URL = 'https://cloudy.netux.site/neal_internet_roadtrip/teleport-markers/portal-exit.png';
  const PORTAL_EXIT_IMAGE_NAME = 'portal-exit';
  const PORTAL_EXIT_COLOR = 'orange';

  const TELEPORT_LINES_DASH_SEGMENT_1_LENGTH = 10;
  const TELEPORT_LINES_DASH_SEGMENT_2_LENGTH = 10;

  const cssClass = (... names) => names.map((name) => MOD_PREFIX + name).join(' ');
  const cssProp = (name) => `--${MOD_PREFIX}${name}`;

  const RAD_TO_DEG = 180 / Math.PI;
  const DEG_TO_RAD = 1 / RAD_TO_DEG;

  const util = {
    // Yoinked from Chris.
    // Thanks Chris!
    haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // Earth radius in meters
      const phi1 = lat1 * DEG_TO_RAD;
      const phi2 = lat2 * DEG_TO_RAD;
      const deltaPhi = (lat2 - lat1) * DEG_TO_RAD;
      const deltaLambda = (lon2 - lon1) * DEG_TO_RAD;
      const a =
          Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    // Yoinked from Jakub. Thanks Jakub!
    // Helper functions for working with tiles
    // Based on https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
    gcsToTileCoordinates(x, y, z) {
        const n = 2**z
        const lon_deg = x / n * 360.0 - 180.0
        const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)))
        const lat_deg = lat_rad * 180.0 / Math.PI
        return [lat_deg, lon_deg]
    },
    tileToGcsCoordinates([lat, lng], z) {
      const n = 2 ** z;
      const x = n * ((lng + 180) / 360);
      const latRad = lat / 180 * Math.PI;
      const y = n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2;
      return [Math.floor(x), Math.floor(y), Math.floor(z)];
    }
  };

  // Thank you Perplexity.ai!
  class Maplibre2dCanvasLayer {
    type = 'custom';
    renderingMode = '2d';

    variableLocations = {};

    alpha = 1;

    constructor({ id, canvas, rerender }) {
      this.id = id;
      this.canvas = canvas;
      this.rerenderCanvas = rerender;
    }

    onAdd(map, gl) {
      this.gl = gl;
      this.map = map;

      const vertexSource = `
        attribute vec2 a_pos;
        varying vec2 v_texcoord;

        void main() {
          v_texcoord = vec2((a_pos.x + 1.0) / 2.0, 1.0 - (a_pos.y + 1.0) / 2.0);
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `;
      const fragmentSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform float u_alpha;
        varying vec2 v_texcoord;

        void main() {
          vec4 tex_color = texture2D(u_texture, v_texcoord);
          tex_color.a = tex_color.a * u_alpha;
          gl_FragColor = tex_color;
        }
      `;

      this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(this.vertexShader, vertexSource);
      gl.compileShader(this.vertexShader);

      this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(this.fragmentShader, fragmentSource);
      gl.compileShader(this.fragmentShader);

      this.program = gl.createProgram();
      gl.attachShader(this.program, this.vertexShader);
      gl.attachShader(this.program, this.fragmentShader);
      gl.linkProgram(this.program);

      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // Fullscreen quad: (-1, -1) to (+1, +1)
          -1, -1,
          +1, -1,
          -1, +1,
          +1, +1,
        ]),
        gl.STATIC_DRAW
      );

      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      this.variableLocations = {
        a_pos: gl.getAttribLocation(this.program, "a_pos"),
        u_alpha: gl.getUniformLocation(this.program, "u_alpha"),
        u_texture: gl.getUniformLocation(this.program, "u_texture"),
      }
    }

    onRemove() {
      this.gl.deleteShader(this.vertexShader);
      this.gl.deleteShader(this.fragmentShader);
      this.gl.deleteBuffer(this.buffer);
      this.gl.deleteProgram(this.program);
      this.map = null;
    }

    render(gl, _args) {
      const mapContainerEl = this.map.getContainer();
      if (this.canvas.width !== mapContainerEl.clientWidth) {
        this.canvas.width = mapContainerEl.clientWidth;
      }
      if (this.canvas.height !== mapContainerEl.clientHeight) {
        this.canvas.height = mapContainerEl.clientHeight;
      }
      this.rerenderCanvas();

      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.enableVertexAttribArray(this.variableLocations.a_pos);
      gl.vertexAttribPointer(this.variableLocations.a_pos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(this.variableLocations.u_alpha, this.alpha);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.canvas
      );
      gl.uniform1i(this.variableLocations.u_texture, 0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  const settings = {
    teleportMetersThreshold: 5_000,
    portalIcons: {
      layer: {
        show: true,
        opacity: 1,
      },
    },
    teleportLines: {
      layer: {
        show: true,
        opacity: 0.5,
        dashed: false
      },
    }
  };
  for (const key in settings) {
    settings[key] = await GM.getValue(key, settings[key]);
  }

  async function saveSettings() {
    for (const key in settings) {
      await GM.setValue(key, settings[key]);
    }
  }

  const mapVDOM = await IRF.vdom.map;
  const map = mapVDOM.data.map;

  let isMapLoaded = map.loaded();
  const waitForMapToLoad = new Promise((resolve) => {
    map.once('load', () => {
      isMapLoaded = true;
      resolve();
    });
  });

  function updateUiFromSettings() {
    map.setLayoutProperty(PORTAL_ICONS_LAYER_NAME, 'visibility', settings.portalIcons.layer.show ? 'visible' : 'none');
    map.setPaintProperty(PORTAL_ICONS_LAYER_NAME, 'icon-opacity', settings.portalIcons.layer.opacity);

    map.setLayoutProperty(TELEPORT_LINES_LAYER_NAME, 'visibility', settings.teleportLines.layer.show ? 'visible' : 'none');
    map.getLayer(TELEPORT_LINES_LAYER_NAME).implementation.alpha = settings.teleportLines.layer.opacity;
  }

  const portalIconsSourceGeojsonData = {
    type: 'FeatureCollection',
    features: []
  };

  const teleportLinesSourceGeojsonData = {
    type: 'Feature',
    geometry: {
      type: 'MultiLineString',
      coordinates: []
    }
  };

  const teleportLinesSourceCanvasCtx = document.createElement('canvas').getContext('2d');
  function drawTeleportLinesIntoSourceCanvas() {
    function clampCoords(x1, y1, x2, y2, offset = 0) {
      const { width, height } = teleportLinesSourceCanvasCtx.canvas;

      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;

      function clampX() {
        if (x1 < 0) {
          x1 = offset;
          y1 = x1 * m + b;
          return true;
        } else if (x1 > width) {
          x1 = width - offset;
          y1 = x1 * m + b;
          return true;
        }

        return false;
      }
      function clampY() {
        if (y1 < 0) {
          y1 = offset;
          x1 = (y1 - b) / m;
          return true;
        } else if (y1 > height) {
          y1 = height - offset;
          x1 = (y1 - b) / m;
          return true;
        }

        return false;
      }

      if (clampX()) {
        clampY();
      } else if (clampY()) {
        clampX();
      }

      return { x: x1, y: y1 };
    }

    const { width, height } = teleportLinesSourceCanvasCtx.canvas;

    teleportLinesSourceCanvasCtx.reset();

    teleportLinesSourceCanvasCtx.clearRect(
      0, 0,
      width, height
    );

    // const DEBUG__fillGradient = teleportLinesSourceCanvasCtx.createConicGradient(0, width / 2, height / 2);
    // DEBUG__fillGradient.addColorStop(0, 'rgba(100% 0 0 / 50%)');
    // DEBUG__fillGradient.addColorStop(0.25, 'rgba(100% 50% 0 / 50%)');
    // DEBUG__fillGradient.addColorStop(0.5, 'rgba(100% 100% 0 / 50%)');
    // DEBUG__fillGradient.addColorStop(0.75, 'rgba(0 100% 0 / 50%)');
    // DEBUG__fillGradient.addColorStop(1, 'rgba(0 0 100% / 50%)');
    // teleportLinesSourceCanvasCtx.fillStyle = DEBUG__fillGradient;
    // teleportLinesSourceCanvasCtx.fillRect(0, 0, width, height);

    for (const [fromLngLat, toLngLat] of teleportLinesSourceGeojsonData.geometry.coordinates) {
      const fromPx = map.project(fromLngLat);
      const toPx = map.project(toLngLat);

      const gradient = teleportLinesSourceCanvasCtx.createLinearGradient(
        fromPx.x, fromPx.y,
        toPx.x, toPx.y
      );
      gradient.addColorStop(0, PORTAL_ENTRANCE_COLOR);
      gradient.addColorStop(1, PORTAL_EXIT_COLOR);

      const dashSegment1Length = TELEPORT_LINES_DASH_SEGMENT_1_LENGTH;
      const dashSegment2Length = TELEPORT_LINES_DASH_SEGMENT_2_LENGTH;

      const clampOffset = -1 * (dashSegment1Length + dashSegment2Length) / 2;
      const fromPxClamped = clampCoords(fromPx.x, fromPx.y, toPx.x, toPx.y, clampOffset);
      const toPxClamped = clampCoords(toPx.x, toPx.y, fromPx.x, fromPx.y, clampOffset);

      teleportLinesSourceCanvasCtx.strokeStyle = gradient;
      teleportLinesSourceCanvasCtx.lineWidth = 3;
      teleportLinesSourceCanvasCtx.beginPath();
      if (settings.teleportLines.layer.dashed) {
        teleportLinesSourceCanvasCtx.setLineDash([dashSegment1Length, dashSegment2Length]);
        teleportLinesSourceCanvasCtx.dashOffset = Math.abs(Math.sqrt(fromPx.x ** 2 + fromPx.y ** 2) - Math.sqrt(fromPxClamped.x ** 2 + fromPxClamped.y ** 2));
      }
      teleportLinesSourceCanvasCtx.moveTo(
        fromPxClamped.x,
        fromPxClamped.y
      );
      teleportLinesSourceCanvasCtx.lineTo(
        toPxClamped.x,
        toPxClamped.y
      );
      teleportLinesSourceCanvasCtx.stroke();
    }
  }

  waitForMapToLoad.then(() => {
    map.loadImage(PORTAL_ENTRANCE_IMAGE_URL)
      .then((image) => map.addImage(PORTAL_ENTRANCE_IMAGE_NAME, image.data))
      .catch((error) => {
        console.error(`[${MOD_NAME}] Could not load portal entrance image:`, error)
      });
    map.loadImage(PORTAL_EXIT_IMAGE_URL)
      .then((image) => map.addImage(PORTAL_EXIT_IMAGE_NAME, image.data))
      .catch((error) => {
        console.error(`[${MOD_NAME}] Could not load portal exit image:`, error)
      });

    map.addSource(PORTAL_ICONS_SOURCE_NAME, {
      type: 'geojson',
      data: portalIconsSourceGeojsonData
    });
    map.addLayer({
      id: PORTAL_ICONS_LAYER_NAME,
      source: PORTAL_ICONS_SOURCE_NAME,
      type: 'symbol',
      minzoom: 5,
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-rotate': ['get', 'angle'],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          /* map zoom, icon-size */
          5, 0.02,
          18, 0.1,
        ],
        'icon-allow-overlap': true
      }
    });

    map.addLayer(new Maplibre2dCanvasLayer({
      id: TELEPORT_LINES_LAYER_NAME,
      canvas: teleportLinesSourceCanvasCtx.canvas,
      rerender: drawTeleportLinesIntoSourceCanvas
    }));

    updateUiFromSettings();
  });

  //map.on('zoom', () => console.debug(map.getZoom()));

  const isTeleport = ([prevLat, prevLng], [thisLat, thisLng]) =>
    util.haversineDistance(prevLat, prevLng, thisLat, thisLng) > settings.teleportMetersThreshold;

  function addTeleportToMap([prevLat, prevLng], [thisLat, thisLng]) {
    // Add teleport line to its own layer
    teleportLinesSourceGeojsonData.geometry.coordinates.push([
      [prevLng, prevLat],
      [thisLng, thisLat]
    ]);

    // Create portal icons
    const angle = Math.atan2(thisLat - prevLat, thisLng - prevLng) * RAD_TO_DEG;

    portalIconsSourceGeojsonData.features.push({
      type: 'Feature',
      properties: {
        'icon': PORTAL_ENTRANCE_IMAGE_NAME,
        'angle': angle,
        'portal-type': 'entrance'
      },
      geometry: {
        type: 'Point',
        coordinates: [prevLng, prevLat]
      }
    });

    portalIconsSourceGeojsonData.features.push({
      type: 'Feature',
      properties: {
        'icon': PORTAL_EXIT_IMAGE_NAME,
        'angle': -angle % 360,
        'portal-type': 'exit'
      },
      geometry: {
        type: 'Point',
        coordinates: [thisLng, thisLat]
      }
    });
  }

  function updateModLayerSources() {
    map.getSource(PORTAL_ICONS_SOURCE_NAME).setData(portalIconsSourceGeojsonData);
    // map.getSource(TELEPORT_LINES_SOURCE_NAME).setData(teleportLinesSourceGeojsonData);
  }

  let lastOldRouteCoord = null;
  async function resolveTeleportsInOldRoute() {
    const oldRouteLayer = map.getLayer('old-route-layer');
    oldRouteLayer.setPaintProperty('line-gradient', 'red');
    map.moveLayer('old-route-layer', /* before: */ PORTAL_ICONS_LAYER_NAME);

    const oldRouteSource = map.getSource('old-route');
    const oldRouteData = await oldRouteSource.getData();

    const customOldRouteGeojsonData = {
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: []
      }
    };

    function newLineStringArray() {
      const lineStringArray = [];
      customOldRouteGeojsonData.geometry.coordinates.push(lineStringArray);

      return lineStringArray;
    };

    let currentLineStringArray = newLineStringArray();

    for (let i = 0; i < oldRouteData.geometry.coordinates.length; i++) {
      const currentCoords = oldRouteData.geometry.coordinates[i];

      currentLineStringArray.push(currentCoords);

      if (i >= 1) {
        const [prevLng, prevLat] = oldRouteData.geometry.coordinates[i - 1];
        const [thisLng, thisLat] = currentCoords;

        if (isTeleport([prevLat, prevLng], [thisLat, thisLng])) {
          // Remove teleport line from route, and
          // setup new line for the rest of the route.
          currentLineStringArray.pop();
          currentLineStringArray = newLineStringArray();
          currentLineStringArray.push(currentCoords);

          addTeleportToMap([prevLat, prevLng], [thisLat, thisLng]);
        }
      }

      lastOldRouteCoord = currentCoords;
    }

    oldRouteSource.setData(customOldRouteGeojsonData);
    updateModLayerSources();
  }

  async function patchRouteSourceAndLayer() {
    const routeSource = map.getSource('route');

    const customRouteGeojsonData = {
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          []
        ]
      }
    };

    const ogSourceSetData = routeSource.setData;
    routeSource.setData = new Proxy(routeSource.setData, {
      apply(ogSetData, thisArg, args) {
        const [incomingData, ... restArgs] = args;

        const incomingCoordinates = incomingData.geometry.coordinates;

        const prevCoords = incomingCoordinates.length > 1
          ? incomingCoordinates[incomingCoordinates.length - 2]
          : lastOldRouteCoord;
        const currentCoords = incomingCoordinates[incomingCoordinates.length - 1];

        const [prevLng, prevLat] = prevCoords;
        const [thisLng, thisLat] = currentCoords;

        if (isTeleport([prevLat, prevLng], [thisLat, thisLng])) {
          const newCoordinatesArray = [];
          customRouteGeojsonData.geometry.coordinates.push(newCoordinatesArray);

          newCoordinatesArray.push([thisLng, thisLat]);

          addTeleportToMap([prevLat, prevLng], [thisLat, thisLng]);
          updateModLayerSources();
        } else {
          const lastCoordinatesArray = customRouteGeojsonData.geometry.coordinates[customRouteGeojsonData.geometry.coordinates.length - 1];
          lastCoordinatesArray.push([thisLng, thisLat]);
        }

        return ogSetData.apply(thisArg, [customRouteGeojsonData, ... restArgs])
      }
    })
  }

  mapVDOM.state.getInitialData = new Proxy(mapVDOM.state.getInitialData, {
    apply(ogGetInitialData, thisArg, args) {
      const promise = ogGetInitialData.apply(thisArg, args);

      promise.then(() => {
        resolveTeleportsInOldRoute();
        patchRouteSourceAndLayer();
      });

      return promise;
    }
  });

  {
    const tab = IRF.ui.panel.createTabFor(
      {
        ... GM.info,
        script: {
          ... GM.info.script,
          name: MOD_NAME,
          icon: null
        }
      },
      {
        tabName: MOD_NAME,
        style: `
        .${cssClass('tab-content')} {
          & *, *::before, *::after {
            box-sizing: border-box;
          }

          & .${cssClass('field-group')} {
            margin-left: calc(var(${cssProp('field-group-indent')}, 0) * 1rem);
            margin-block: 1rem;
            gap: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & label > small {
              color: lightgray;
              display: block;
            }

            & input:is(:not([type]), [type="text"], [type="number"]) {
              --padding-inline: 0.5rem;

              width: calc(100% - 2 * var(--padding-inline));
              min-height: 1.5rem;
              margin: 0;
              padding-inline: var(--padding-inline);
              color: white;
              background: transparent;
              border: 1px solid #848e95;
              font-size: 100%;
              border-radius: 5rem;
            }

            & .${cssClass('field-group__label-container')},
            & .${cssClass('field-group__input-container')} {
              width: 100%;
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              gap: 1ch;
            }

            & .${cssClass('field-group__input-container')} {
              justify-content: end;
              white-space: nowrap;
            }
          }
        }
        `,
        className: cssClass('tab-content')
      }
    );

    function makeFieldGroup({ id, label, labelSubtext = null, indent = 0 }, renderInput) {
      const fieldGroupEl = document.createElement('div');
      fieldGroupEl.className = cssClass('field-group');
      if (indent > 0) {
        fieldGroupEl.style.setProperty(cssProp('field-group-indent'), indent);
      }

      const labelContainerEl = document.createElement('div');
      labelContainerEl.className = cssClass('field-group__label-container');
      fieldGroupEl.append(labelContainerEl);

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelContainerEl.append(labelEl);

      if (labelSubtext != null) {
        const labelSubtextEl = document.createElement('small');
        labelSubtextEl.textContent = labelSubtext;
        labelEl.append(labelSubtextEl);
      }

      const inputContainerEl = document.createElement('div');
      inputContainerEl.className = cssClass('field-group__input-container');
      fieldGroupEl.append(inputContainerEl);

      const renderInputOutput = renderInput({ id });
      inputContainerEl.append(... (Array.isArray(renderInputOutput) ? renderInputOutput : [renderInputOutput]));

      return fieldGroupEl;
    }

    tab.container.append(
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}teleport-meters-threshold`,
          label: 'Teleport Threshold',
          labelSubtext: 'A reload is required to update the minimap'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'number';
          inputEl.style.width = '15ch';
          inputEl.value = settings.teleportMetersThreshold;

          inputEl.addEventListener('change', async () => {
            let numberValue = Number.parseFloat(inputEl.value);
            if (isNaN(numberValue)) {
              return;
            }
            numberValue = Math.max(0, numberValue);

            settings.teleportMetersThreshold = numberValue;
            await saveSettings();
            updateUiFromSettings();
          });

          return [
            inputEl,
            document.createTextNode(' meters')
          ];
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}portal-icons-show-layer`,
          label: 'Portal Icons'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.className = IRF.ui.panel.styles.toggle;
          inputEl.checked = settings.portalIcons.layer.show;

          inputEl.addEventListener('change', async () => {
            settings.portalIcons.layer.show = inputEl.checked;
            await saveSettings();
            updateUiFromSettings();
          });

          return inputEl;
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}portal-icons-layer-opacity`,
          indent: 1,
          label: 'Opacity'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'range';
          inputEl.className = IRF.ui.panel.styles.slider;
          inputEl.min = 0;
          inputEl.max = 1;
          inputEl.step = 0.05;
          inputEl.value = settings.portalIcons.layer.opacity;

          inputEl.addEventListener('input', async () => {
            let numberValue = Number.parseFloat(inputEl.value);
            if (Number.isNaN(numberValue)) {
              return;
            }
            numberValue = Math.min(Math.max(parseFloat(inputEl.min), numberValue), parseFloat(inputEl.max));

            settings.portalIcons.layer.opacity = numberValue;
            await saveSettings();
            updateUiFromSettings();
          });

          return inputEl;
        }
      ),

      makeFieldGroup(
        {
          id: `${MOD_PREFIX}teleport-lines-show-layer`,
          label: 'Teleport Lines'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.className = IRF.ui.panel.styles.toggle;
          inputEl.checked = settings.teleportLines.layer.show;

          inputEl.addEventListener('change', async () => {
            settings.teleportLines.layer.show = inputEl.checked;
            await saveSettings();
            updateUiFromSettings();
          });

          return inputEl;
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}teleport-lines-layer-opacity`,
          indent: 1,
          label: 'Opacity'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'range';
          inputEl.className = IRF.ui.panel.styles.slider;
          inputEl.min = 0;
          inputEl.max = 1;
          inputEl.step = 0.05;
          inputEl.value = settings.teleportLines.layer.opacity;

          inputEl.addEventListener('input', async () => {
            let numberValue = Number.parseFloat(inputEl.value);
            if (Number.isNaN(numberValue)) {
              return;
            }
            numberValue = Math.min(Math.max(parseFloat(inputEl.min), numberValue), parseFloat(inputEl.max));

            settings.teleportLines.layer.opacity = numberValue;
            await saveSettings();
            updateUiFromSettings();
          });

          return inputEl;
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}teleport-lines-layer-dashed`,
          indent: 1,
          label: 'Dashed'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.className = IRF.ui.panel.styles.toggle;
          inputEl.checked = settings.teleportLines.layer.dashed;

          inputEl.addEventListener('input', async () => {
            settings.teleportLines.layer.dashed = inputEl.checked;
            await saveSettings();
            updateUiFromSettings();
          });

          return inputEl;
        }
      ),
    )
  }

  if (typeof unsafeWindow !== 'undefined') {
    unsafeWindow.mtpm = {
      get map() { return map },
      get portalIconsLayer() { return map.getLayer(PORTAL_ICONS_LAYER_NAME); },
      get teleportLinesLayer() { return map.getLayer(TELEPORT_LINES_LAYER_NAME); },

      debug: {
        mockJumpToCoordsOnMap([lat, lng]) {
          mapVDOM.state.setMarkerPosition(lat, lng);
        }
      }
    };
  }
})();