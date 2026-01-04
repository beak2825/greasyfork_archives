// ==UserScript==
// @name        WME UT LV Layers
// @namespace   http://ursus.id.lv
// @version     1.0.0
// @description WME UrSuS Tools: LV Layers
// @author      UrSuS
// @match       https://*.waze.com/*editor*
// @license     MIT
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNjMuOTk5OTk2bW0iCiAgIGhlaWdodD0iNjQuMDAwMDE1bW0iCiAgIHZpZXdCb3g9IjAgMCA2My45OTk5OTYgNjQuMDAwMDE1IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc1IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjIgKGRjMmFlZGFmMDMsIDIwMjItMDUtMTUpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ3bWUga2FkYXN0cnMuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxLjAzMzA4MjIiCiAgICAgaW5rc2NhcGU6Y3g9IjY3Ljc1ODQwMSIKICAgICBpbmtzY2FwZTpjeT0iNzU3LjQ0MjEzIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA1IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSI+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIzMi4wMDAwMDMsMzIuMDAwMDA3IgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTgzMCIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIzMi4wMDAwMDEsMzIuMDAwMDA5IgogICAgICAgb3JpZW50YXRpb249IjAsLTEiCiAgICAgICBpZD0iZ3VpZGU4MzIiCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogIDwvc29kaXBvZGk6bmFtZWR2aWV3PgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01NC40MzczMywtMTczLjI3MjY1KSI+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2EwMmMyYztzdHJva2Utd2lkdGg6MjYuNDU4MyIKICAgICAgIGlkPSJyZWN0ODE4IgogICAgICAgd2lkdGg9IjY0IgogICAgICAgaGVpZ2h0PSI2NCIKICAgICAgIHg9IjU0LjQzNzMzMiIKICAgICAgIHk9IjE3My4yNzI2NiIgLz4KICAgIDxnCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLjE5MzY3MDgsMCwwLDEuMTkzNjcwOCw1Ni42Mzc5MTgsMTc1LjM4OTExKSIKICAgICAgIGlkPSJnODI0Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSAyNy41LDIuNjc0IGMgLTYuMTgxLDAgLTExLjk0NCwyLjc3NyAtMTUuODMzLDcuNzA4IEMgOC45NTgsMTMuODU0IDcuNSwxOC4xNiA3LjUsMjIuNTM1IHYgMy42OCBDIDcuNSwyNy44MTIgNi44NzUsMjkuMzQgNS44MzMsMzAuNDUxIDUsMzEuMjg1IDMuOTU4LDMxLjkxIDIuODQ3LDMyLjE4OCBjIDAuNDE3LDEuMDQxIDEuMzg5LDIuNjM4IDMuMTI1LDQuMzc1IDEuNDU5LDEuNTI3IDMuMTk1LDIuNzc3IDUuMDcsMy42OCB2IC0wLjA2OSBjIDEuMTgsLTEuODA2IDMuMTI1LC0yLjg0OCA1LjI3NywtMi44NDggMC40MTcsMCAwLjc2NCwwLjA3IDEuMTgxLDAuMTM5IDIuNSwwLjQ4NiA0LjQ0NCwyLjQzMSA0LjkzMSw0Ljg2MSBoIDUuMTM4IGMgNS4zNDgsMCAxMC40MTcsLTIuMjIyIDE0LjA5OCwtNS44MzMgNS42OTQsLTUuNjk0IDcuNDMsLTE0LjIzNiA0LjMwNSwtMjEuNTk3IEMgNDIuODQ3LDcuNDY1IDM1LjYyNSwyLjY3NCAyNy41LDIuNjc0IFoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNhMDJjMmMiCiAgICAgICAgIGlkPSJwYXRoODIwIiAvPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDI3LjUsMC4xNzQgQyAyMC42MjUsMC4xNzQgMTQuMTY3LDMuMjI5IDkuNzkyLDguNzE1IDYuNjY3LDEyLjY3NCA1LDE3LjUzNSA1LDIyLjYwNCB2IDMuNjExIGMgMCwxLjg3NSAtMS4zMTksMy42MTEgLTMuODg5LDMuNzUgLTAuNjI1LDAgLTEuMTExLDAuNDg2IC0xLjE4LDEuMTExIC0wLjA3LDEuNjY3IDEuNzM2LDQuNzkyIDQuMjM2LDcuMjkyIDEuNzM2LDEuNzM2IDMuNzUsMy4xMjUgNS45MDIsNC4yMzYgLTAuNjk0LDMuODIgMi4yOTIsNy4yOTIgNi4xODEsNy4yOTIgaCAwLjA2OSBjIDIuOTg3LDAgNS40ODcsLTIuMDgzIDYuMTEyLC00LjkzMSBoIDUuMjA4IGMgMC41NTUsMi44NDggMy4wNTUsNC45MzEgNi4xMTEsNC45MzEgMC42OTQsMCAxLjQ1OCwtMC4xMzkgMi4xNTMsLTAuMzQ3IDEuNzM2LC0wLjU1NiAzLjA1NSwtMS44NzUgMy42OCwtMy42MTIgMC41NTYsLTEuNTk3IDAuNDg2LC0zLjE5NCAwLC00LjUxMyAxLjM4OSwtMC45MDMgMi42MzksLTEuODc1IDMuODIsLTMuMDU2IEMgNDcuNjM5LDM0LjIwMSA1MCwyOC41MDcgNTAsMjIuNjA0IDUwLDE2LjYzMiA0Ny42MzksMTEuMDc2IDQzLjQwMyw2Ljg0IDM5LjE2NywyLjQ2NSAzMy40NzIsMC4xNzQgMjcuNSwwLjE3NCBaIG0gMCwyLjUgYyA4LjA1NiwwIDE1LjM0Nyw0Ljg2MSAxOC40NzIsMTIuMjkxIDMuMTI1LDcuNDMxIDEuMzg5LDE1Ljk3MiAtNC4zMDUsMjEuNTk4IC0zLjY4MSwzLjY4IC04Ljc1LDUuODMzIC0xNC4wOTgsNS44MzMgSCAyMi40MzEgQyAyMS45NDQsMzkuODk2IDIwLDM4LjAyMSAxNy41LDM3LjUzNSBjIC0wLjQxNywtMC4wNyAtMC43NjQsLTAuMTM5IC0xLjE4MSwtMC4xMzkgLTIuMDgzLDAgLTQuMDk3LDEuMDQyIC01LjI3NywyLjg0NyB2IDAuMDcgQyA5LjE2NywzOS4zNCA3LjUsMzguMDkgNS45NzIsMzYuNjMyIDQuMjM2LDM0Ljg5NiAzLjI2NCwzMy4yMjkgMi44NDcsMzIuMjU3IDQuMDI4LDMxLjk3OSA1LDMxLjM1NCA1LjgzMywzMC41MjEgNi44NzUsMjkuMzQgNy41LDI3Ljg4MiA3LjUsMjYuMjg1IHYgLTMuNjgxIGMgMCwtNC4zNzUgMS40NTgsLTguNjggNC4xNjcsLTEyLjE1MyBDIDE1LjU1Niw1LjM4MiAyMS4zMTksMi42NzQgMjcuNSwyLjY3NCBaIgogICAgICAgICBpZD0icGF0aDgyMiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgLz4KICAgIDwvZz4KICAgIDxnCiAgICAgICBhcmlhLWxhYmVsPSJVVCIKICAgICAgIGlkPSJ0ZXh0ODI4IgogICAgICAgc3R5bGU9ImZvbnQtc2l6ZTozMC42NzMycHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTpXYXplOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246V2F6ZTtsZXR0ZXItc3BhY2luZzowcHg7d29yZC1zcGFjaW5nOjBweDtmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMTE1MDI0Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSA4OC4zMTk3NzQsMjA4LjEyNTI2IHEgMCwyLjc5MTI2IC0xLjI1NzYwMiw0LjYwMDk4IC0xLjI1NzYwMSwxLjc3OTA1IC0zLjI4MjAzMiwyLjYzNzkgLTIuMDI0NDMxLDAuODU4ODUgLTQuMzU1NTk1LDAuODU4ODUgLTIuMzAwNDksMCAtNC4zMjQ5MjEsLTAuODU4ODUgLTIuMDI0NDMxLC0wLjg1ODg1IC0zLjI4MjAzMiwtMi42Mzc5IC0xLjI1NzYwMiwtMS43NzkwNCAtMS4yNTc2MDIsLTQuNTcwMyB2IC0xMy4xODk0OCBxIDAsLTAuMjQ1MzggMC4xODQwNCwtMC40Mjk0MiAwLjE4NDAzOSwtMC4yMTQ3MiAwLjQ2MDA5OCwtMC4yMTQ3MiBoIDIuNzkxMjYxIHEgMC4yNzYwNTksMCAwLjQ2MDA5OCwwLjIxNDcyIDAuMjE0NzEyLDAuMTg0MDQgMC4yMTQ3MTIsMC40Mjk0MiB2IDEyLjkxMzQyIHEgMCwyLjE0NzEyIDEuMjU3NjAyLDMuMzc0MDUgMS4yNTc2MDEsMS4yMjY5MyAzLjQ5Njc0NCwxLjIyNjkzIDIuMjY5ODE3LDAgMy41Mjc0MTksLTEuMjI2OTMgMS4yNTc2MDEsLTEuMjI2OTMgMS4yNTc2MDEsLTMuMzc0MDUgdiAtMTIuOTEzNDIgcSAwLC0wLjI0NTM4IDAuMTg0MDM5LC0wLjQyOTQyIDAuMjE0NzEyLC0wLjIxNDcyIDAuNDkwNzcxLC0wLjIxNDcyIGggMi43OTEyNjEgcSAwLjI0NTM4NiwwIDAuNDI5NDI1LDAuMjE0NzIgMC4yMTQ3MTMsMC4xODQwNCAwLjIxNDcxMywwLjQyOTQyIHoiCiAgICAgICAgIGlkPSJwYXRoODc4IiAvPgogICAgICA8cGF0aAogICAgICAgICBkPSJtIDkwLjQzNjIxNSwxOTcuNDUwOTkgdiAtMi40NTM4NiBxIDAsLTAuMjc2MDUgMC4xODQwNCwtMC40NjAwOSAwLjE4NDAzOSwtMC4yMTQ3MiAwLjQ2MDA5OCwtMC4yMTQ3MiBoIDE2Ljk5Mjk1NyBxIDAuMjc2MDUsMCAwLjQ2MDA5LDAuMjE0NzIgMC4xODQwNCwwLjE4NDA0IDAuMTg0MDQsMC40NjAwOSB2IDIuNDUzODYgcSAwLDAuMjc2MDYgLTAuMTg0MDQsMC40NjAxIC0wLjE4NDA0LDAuMTg0MDQgLTAuNDYwMDksMC4xODQwNCBoIC02LjM4MDAzIHYgMTcuMDIzNjIgcSAwLDAuMjc2MDYgLTAuMjE0NzEsMC40OTA3NyAtMC4xODQwNCwwLjE4NDA0IC0wLjQ2MDEsMC4xODQwNCBoIC0yLjkxMzk1NCBxIC0wLjI3NjA1OSwwIC0wLjQ2MDA5OCwtMC4xODQwNCAtMC4xODQwNCwtMC4yMTQ3MSAtMC4xODQwNCwtMC40OTA3NyB2IC0xNy4wMjM2MiBoIC02LjM4MDAyNSBxIC0wLjI3NjA1OSwwIC0wLjQ2MDA5OCwtMC4xODQwNCAtMC4xODQwNCwtMC4xODQwNCAtMC4xODQwNCwtMC40NjAxIHoiCiAgICAgICAgIGlkPSJwYXRoODgwIiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==
// @exclude     https://www.waze.com/user/editor*
// @require		https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js
// @connect     balticmaps.eu
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536070/WME%20UT%20LV%20Layers.user.js
// @updateURL https://update.greasyfork.org/scripts/536070/WME%20UT%20LV%20Layers.meta.js
// ==/UserScript==

/* globals proj4 */
(function (proj4) {
  "use strict";

  GM_info.script.name;
  GM_info.script.version;
  let wmeSDK;
  let _settings = {};
  let webLocationTilesContainerId;
  let currentOverlay = "";
  let currentOpacity = 100;
  let sBalticMapsKey = "";
  const _SETTINGS_STORAGE_NAME = "WME_LV_TOOLS";
  const defaultSettings = {
    LeftOffset: "400px",
    TopOffset: "100px",
    HideToolbar: false,
  };
  function cbLayerChange(oEvent) {
    if (oEvent.target instanceof HTMLInputElement) {
      const sSetting = oEvent.target.getAttribute("boundSetting");
      if (sSetting) {
        _settings[sSetting] = oEvent.target.checked;
      }
      const sLayerId = oEvent.target.getAttribute("layerId");
      if (sLayerId) {
        CheckUnCheckCustomWMSLayer(oEvent.target.checked, sLayerId);
      }
      saveSettingsToStorage();
    }
  }
  const aLayersElementsConfig = [
    {
      id: "lvm-kadastrs",
      url: "https://lvmgeoserver.lvm.lv/geoserver/ows?FORMAT=image/png&TRANSPARENT=TRUE&VERSION=1.3.0&SERVICE=WMS&REQUEST=GetMap&LAYERS=publicwfs:kkparcel&STYLES=&CRS=EPSG:4326&WIDTH=256&HEIGHT=256&BBOX={bbox}&STYLES=&request=GetMap",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowKadastrsLayer",
            title: "Kadastrs",
            checked: _settings.showKadastrsLayer,
            boundSetting: "showKadastrsLayer",
            layerId: "lvm-kadastrs",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowKadastrsLayer",
            textContent: "Kadastrs",
          },
        },
      ],
    },
    {
      id: "lvm-kadastrs-houses",
      url: "https://lvmgeoserver.lvm.lv/geoserver/ows?FORMAT=image/png&TRANSPARENT=TRUE&VERSION=1.3.0&SERVICE=WMS&REQUEST=GetMap&LAYERS=publicwfs:kkbuilding&STYLES=&CRS=EPSG:4326&WIDTH=256&HEIGHT=256&BBOX={bbox}",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowKadastrsHousesLayer",
            title: "Kadastrs Houses",
            checked: _settings.showKadastrsHousesLayer,
            boundSetting: "showKadastrsHousesLayer",
            layerId: "lvm-kadastrs-houses",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowKadastrsHousesLayer",
            textContent: "Kadastrs Houses",
          },
        },
      ],
    },
    {
      id: "new-bing",
      url: "https://ecn.t3.tiles.virtualearth.net/tiles/a{quadDigits}.jpeg?g={latestBingImageVersion}&n=z",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowNewBingLayer",
            title: "New Bing",
            checked: _settings.showNewBingLayer,
            boundSetting: "showNewBingLayer",
            layerId: "new-bing",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowNewBingLayer",
            textContent: "New Bing",
          },
        },
      ],
    },
    {
      id: "lvm-roads",
      url: "https://lvmgeoproxy01.lvm.lv/A05F8B5E0EB84CAEB9499496474E3093/LVMLV/LITEvLVMbaseData/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&LAYERS=show%3A19%2C20&BBOX={bbox3857}&BBOXSR=3857&DPI=350",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowLVMRoadsLayer",
            title: "LVM Roads",
            checked: _settings.showLVMRoadsLayer,
            boundSetting: "showLVMRoadsLayer",
            layerId: "lvm-roads",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowLVMRoadsLayer",
            textContent: "LVM Roads",
          },
        },
      ],
    },
    {
      id: "balticmaps",
      url: "https://wms3.kartes.lv/PIER/wgs/15/{zoom}/{x}/{y}.png",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowBalticMapsLayer",
            title: "Baltic Maps",
            checked: _settings.showBalticMapsLayer,
            boundSetting: "showBalticMapsLayer",
            layerId: "balticmaps",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowBalticMapsLayer",
            textContent: "Baltic Maps",
          },
        },
      ],
    },
    {
      id: "balticmaps-orto8",
      url: "https://wmsbm4.kartes.lv/{balticMapsKey}/wgs/orto_full/?SERVICE=WMS&VERSION=1.0.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=0&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi%3A96&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&STYLES=&BBOX={bbox3857}",
      elements: [
        {
          type: "input",
          attributes: {
            type: "checkbox",
            id: "cbShowBalticMapsOrto8Layer",
            title: "Baltic Maps Ortofoto 8th cycle (2022-2024)",
            checked: _settings.showBalticMapsOrto8Layer,
            boundSetting: "showBalticMapsLayer",
            layerId: "balticmaps-orto8",
          },
          events: {
            change: cbLayerChange,
          },
          triggerChangeEvent: false,
        },
        {
          type: "label",
          attributes: {
            for: "cbShowBalticMapsOrto8Layer",
            textContent: "Baltic Maps Ortofoto 8th cycle",
          },
        },
      ],
    },
  ];
  unsafeWindow.SDK_INITIALIZED.then(initScript);
  function makeGetRequest(sURL) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: sURL,
        onload: (response) => resolve(response.responseText),
        onerror: (error) => reject(error),
      });
    });
  }
  function initScript() {
    if (!unsafeWindow.getWmeSdk) {
      throw new Error("SDK not available");
    }
    wmeSDK = unsafeWindow.getWmeSdk({
      scriptId: "wmeUTLayers",
      scriptName: "UrSuS Tools: Layers",
    });
    const sStorageItem = localStorage.getItem(_SETTINGS_STORAGE_NAME);
    if (sStorageItem) {
      const loadedSettings = JSON.parse(sStorageItem);
      _settings = { ...defaultSettings, ...loadedSettings };
    }
    webLocationTilesContainerId =
      "#" + W.map.getLayerByUniqueName("satellite_imagery").id;
    void fetchBalticMapKey();
    void initScriptTab();
  }
  async function saveSettingsToStorage() {
    if (localStorage) {
      _settings.lastSaved = Date.now();
      localStorage.setItem(_SETTINGS_STORAGE_NAME, JSON.stringify(_settings));
    }
  }
  async function fetchBalticMapKey() {
    const sURL = "https://balticmaps.eu/backend/public/v1/key";
    const sKeyResponseJSON = await makeGetRequest(sURL);
    const mBalticMapsKey = JSON.parse(sKeyResponseJSON);
    sBalticMapsKey = mBalticMapsKey.key;
  }
  async function initScriptTab() {
    const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
    tabLabel.innerText = "WME UT Layers";
    tabLabel.title = "WME UT Layers";
    const description = document.createElement("p");
    description.style.fontWeight = "bold";
    description.textContent = "WME UT Layers";
    tabPane.appendChild(description);
    let buttonContainer = createElem("div", {
      class: "controls-container",
    });
    generateDomElements(aLayersElementsConfig, buttonContainer);
    tabPane.appendChild(buttonContainer);
  }
  function generateDomElements(aLayersConfig, oDOMContainer) {
    aLayersConfig.forEach((mLayerConfig) => {
      mLayerConfig.elements.forEach((item) => {
        const $HTMLElement = createElem(
          item.type,
          item.attributes,
          item.events || []
        );
        oDOMContainer.appendChild($HTMLElement);
        if (item.triggerChangeEvent) {
          $HTMLElement.dispatchEvent(new Event("change"));
        }
      });
      console.log(
        `Elements for '${mLayerConfig.id}' created. URL: ${mLayerConfig.url}`
      );
      const br = createElem("br");
      oDOMContainer.append(br);
    });
  }
  function createElem(type, attrs = {}, eventListener = {}) {
    const element = document.createElement(type);
    for (const [key, value] of Object.entries(attrs)) {
      if (key in element) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    }
    for (const [eventType, handler] of Object.entries(eventListener)) {
      if (handler) {
        element.addEventListener(eventType, handler);
      }
    }
    return element;
  }
  function CheckUnCheckCustomWMSLayer(checked, sLayerName) {
    checked ? setWMSLayer(sLayerName) : unsetWMSLayer();
  }
  function setWMSLayer(sLayerName) {
    setDefaultImages();
    currentOverlay = sLayerName;
    setImages();
    wmeSDK.Events.on({
      eventName: "wme-map-move-end",
      eventHandler: setImages,
    });
  }
  function unsetWMSLayer() {
    setDefaultImages();
    wmeSDK.Events.off({
      eventName: "wme-map-move-end",
      eventHandler: setImages,
    });
  }
  function setDefaultImages() {
    var innerTilesContainer = $(webLocationTilesContainerId);
    $(".overlayUrSuS", innerTilesContainer).remove();
  }
  function setImages() {
    setImagesWaze();
  }
  function setImagesWaze() {
    var innerTilesContainer = $(webLocationTilesContainerId);
    innerTilesContainer.children("img.overlayUrSuS").each(function () {
      var default_url = $(this).attr("data-default_url");
      var original = innerTilesContainer.find(
        'img.olTileImage[src="' + default_url + '"]'
      );
      if (original.length == 0) {
        $(this).remove();
      }
    });
    innerTilesContainer.children("img.olTileImage").each(function () {
      var content = $(this);
      var coords = getCoordinatesWaze(content);
      if (undefined != coords) {
        var duplicate = innerTilesContainer.find(
          'img.overlayUrSuS[data-coords="' + coords + '"]'
        );
        if (duplicate.length == 0) {
          duplicate = $(
            '<img src="" draggable="false" style="width: 256px; height: 256px; position: absolute; border: 0px; padding: 0px; margin: 0px; -webkit-user-select: none;">'
          );
          duplicate.css("opacity", currentOpacity / 100);
          duplicate.addClass("overlayUrSuS");
        }
        if (!duplicate.is(content.next())) {
          const sUrl = content.attr("src");
          if (sUrl) {
            duplicate.attr("data-default_url", sUrl);
          }
          duplicate.attr("data-coords", coords);
          duplicate.css("top", content.css("top"));
          duplicate.css("left", content.css("left"));
          duplicate.insertAfter(content);
          replaceImage(duplicate);
        }
      }
    });
  }
  function replaceImage(element) {
    var quadLetters = element.data("coords");
    if (!quadLetters) return;
    element.attr("src", getUrl(quadLetters));
  }
  function getUrl(quadLetters) {
    const sLatestBingImageVersion = "14801";
    const mLayerConfig = aLayersElementsConfig.find(
      (config) => config.id === currentOverlay
    );
    if (!mLayerConfig) {
      console.error(
        `Overlay configuration with id '${currentOverlay}' not found.`
      );
      return null;
    }
    const mQuadDigits = QuadLettersToQuadDigits(quadLetters);
    const mTiles = QuadDigitsToTileXYZ(mQuadDigits);
    const mBBox = TileBounds(mTiles.x, mTiles.y, mTiles.z);
    QuadLettersToQuadDigits(quadLetters);
    let sUrl = mLayerConfig.url;
    const sBBox = `${mBBox.p2.y},${mBBox.p1.x},${mBBox.p1.y},${mBBox.p2.x}`;
    const sBBox3857 = getBBox3857(mBBox);
    if (sUrl.includes("{bbox}")) {
      sUrl = sUrl.replace("{bbox}", sBBox);
    } else if (sUrl.includes("{bbox3857}")) {
      sUrl = sUrl.replace("{bbox3857}", sBBox3857);
    } else if (sUrl.includes("{quadDigits}")) {
      sUrl = sUrl.replace("{quadDigits}", mQuadDigits);
    } else {
      sUrl = sUrl.replace("{x}", mTiles.x.toString());
      sUrl = sUrl.replace("{y}", mTiles.y.toString());
      sUrl = sUrl.replace("{zoom}", mTiles.z.toString());
    }
    if (sUrl.includes("{latestBingImageVersion}")) {
      sUrl = sUrl.replace("{latestBingImageVersion}", sLatestBingImageVersion);
    }
    if (sUrl.includes("{balticMapsKey}")) {
      sUrl = sUrl.replace("{balticMapsKey}", sBalticMapsKey);
    }
    return sUrl;
  }
  function TileBounds(tx, ty, zoom) {
    var p = Math.pow(2, zoom);
    return {
      p1: {
        x: (tx * 360) / p - 180,
        y:
          90 -
          (360 * Math.atan(Math.exp(-(0.5 - ty / p) * 2 * Math.PI))) / Math.PI,
      },
      p2: {
        x: ((tx + 1) * 360) / p - 180,
        y:
          90 -
          (360 * Math.atan(Math.exp(-(0.5 - (ty + 1) / p) * 2 * Math.PI))) /
            Math.PI,
      },
    };
  }
  function getBBox3857(mBBox) {
    const aConvertedCoordinates = [
      ...proj4("EPSG:4326", "EPSG:900913", [mBBox.p1.x, mBBox.p2.y]),
      ...proj4("EPSG:4326", "EPSG:900913", [mBBox.p2.x, mBBox.p1.y]),
    ];
    const string = aConvertedCoordinates.join();
    return string;
  }
  function QuadDigitsToTileXYZ(quadKey) {
    let x = 0;
    let y = 0;
    let z = quadKey.length;
    for (var i = z; i > 0; i--) {
      var digit = quadKey[z - i];
      var mask = 1 << (i - 1);
      if (digit == "0") {
        continue;
      } else if (digit == "1") {
        x |= mask;
      } else if (digit == "2") {
        y |= mask;
      } else if (digit == "3") {
        x |= mask;
        y |= mask;
      }
    }
    return {
      x: x,
      y: y,
      z: z,
    };
  }
  function QuadLettersToQuadDigits(quadKey) {
    var quadDigits = "";
    for (var i = 1; i < quadKey.length; i++) {
      switch (quadKey[i]) {
        case "q":
          quadDigits += "0";
          break;
        case "r":
          quadDigits += "1";
          break;
        case "t":
          quadDigits += "2";
          break;
        case "s":
          quadDigits += "3";
          break;
      }
    }
    return quadDigits;
  }
  function getCoordinatesWaze(img) {
    var satelliteTileUrl = img.attr("src");
    var coords;
    if (!satelliteTileUrl) {
      return;
    }
    var pattern = new RegExp("\\/\\/www\\.googleapis\\.com\\/tile\\/v1", "g");
    if (pattern.test(satelliteTileUrl)) {
      const RegExp =
        /\/\/www\.googleapis\.com\/tile\/v1\/tiles\/(\d+)\/(\d+)\/(\d+)/g;
      const match = RegExp.exec(satelliteTileUrl);
      if (match) {
        coords = QuadDigitsToQuadLetters(
          TileXYZToQuadDigits(match[2], match[3], parseFloat(match[1]))
        );
      }
    }
    return coords;
  }
  function QuadDigitsToQuadLetters(quadKey) {
    var quadLetters = "t";
    for (var i = 0; i < quadKey.length; i++) {
      switch (quadKey[i]) {
        case "0":
          quadLetters += "q";
          break;
        case "1":
          quadLetters += "r";
          break;
        case "2":
          quadLetters += "t";
          break;
        case "3":
          quadLetters += "s";
          break;
      }
    }
    return quadLetters;
  }
  function TileXYZToQuadDigits(tileX, tileY, zoom) {
    var quadKey = "";
    for (var i = zoom; i > 0; i--) {
      var digit = 0;
      var mask = 1 << (i - 1);
      if ((tileX & mask) != 0) {
        digit++;
      }
      if ((tileY & mask) != 0) {
        digit++;
        digit++;
      }
      quadKey = quadKey.concat(digit.toString());
    }
    return quadKey;
  }
})(proj4);
