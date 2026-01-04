// ==UserScript==
// @name         WME Dashboard Companion
// @author       Tom 'Glodenox' Puttemans
// @namespace    http://www.tomputtemans.com/
// @version      0.1
// @description  Show Waze Belgium Dashboard map data in the WME
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @connect      home.tomputtemans.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/467976/WME%20Dashboard%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/467976/WME%20Dashboard%20Companion.meta.js
// ==/UserScript==

/* global W, I18n, OpenLayers */

const DASHBOARD_URL = "https://home.tomputtemans.com/waze/dashboard/"; // https://www.wazebelgium.be/dashboard/
const SLACK_CLIENT_ID = "3248920668.48195818977";
const SLACK_TEAM_ID = "TCKQCM9QS";
const DASHBOARD_PROJECTION = new OpenLayers.Projection("EPSG:4326");

let mapLayer = null;
let sidepanel = null;
let statusField = null;

async function onWmeReady() {
  // Await and add script to sidebar
  let {tabLabel, tabPane} = W.userscripts.registerSidebarTab("dashboard-companion");

  tabLabel.innerHTML = '<i class="fa fa-cube"></i>';
  tabLabel.title = "Dashboard Companion";
  tabPane.id = "sidepanel-dashboard-companion";

  await W.userscripts.waitForElementConnected(tabPane);

  let title = document.createElement("h4");
  title.textContent = tabLabel.title;
  tabPane.appendChild(title);

  statusField = document.createElement("div");
  statusField.className = "status-field";
  tabPane.appendChild(statusField);

  sidepanel = document.createElement("div");
  tabPane.appendChild(sidepanel);

  let footer = document.createElement("p");
  footer.className = "footer";
  footer.appendChild(document.createTextNode(GM_info.script.name + ': v' + GM_info.script.version));
  tabPane.appendChild(footer);

  updateLoginStatus(statusField);
}

function updateLoginStatus(statusField) {
  statusField.innerHTML = `<p><i class="fa fa-pulse fa-spinner"></i> Retrieving logged-in status...</p>`;
  retrieveData("/api/status").then((status) => {
    console.log('Login status received', status);
    clearStatus();
    // If needed, present log in:
    if (status.logged_in == false) {
      statusField.innerHTML = `<p>In order to manage the dashboard, you need to be logged in. You can go to the <a href="${DASHBOARD_URL}" target="_blank">Dashboard</a> or use the button below to log in via Slack.</p>`;
      let loginButton = document.createElement("wz-button");
      loginButton.textContent = "Sign in with Slack";
      let params = new URLSearchParams({
        response_type: "code",
        scope: "openid,profile",
        team: SLACK_TEAM_ID,
        client_id: SLACK_CLIENT_ID,
        redirect_uri: DASHBOARD_URL + "auth",
        state: "popupLogin"
      });
      loginButton.addEventListener("click", () => {
        let loginWindow = window.open("https://slack.com/openid/connect/authorize?" + params.toString(), "dashboardLogin", "popup");
        let timer = setInterval(() => {
          if (loginWindow.closed) {
            clearInterval(timer);
            updateLoginStatus(statusField);
          }
        }, 1000);
        statusField.innerHTML = '<p><i class="fa fa-pulse fa-spinner"></i> Awaiting log-in (see popup)...</p>';
      });
      statusField.appendChild(loginButton);
    } else {
      onDashboardReady();
    }
  });
}

function onDashboardReady() {
  addLayer();

  statusField.innerHTML = `<p><i class="fa fa-pulse fa-spinner"></i> Retrieving dashboard reports...</p>`;
  retrieveReports();
}

function retrieveReports() {
  let bounds = W.map.getExtent().transform(W.map.getProjectionObject(), DASHBOARD_PROJECTION);
  let params = new URLSearchParams({
    status: "actionable",
    source: -1,
    priority: -1,
    level: -1,
    period: "soon",
    followed: 0,
    bounds: bounds.toBBOX()
  });
  retrieveData('/reports/query?' + params.toString()).then((data) => {
    console.log(data);
    let features = [];
    let featureList = document.createElement("div");
    featureList.className = "feature-list";
    data.reports.forEach(report => {
      let geometry = new OpenLayers.Geometry.Point(report.lon, report.lat);
      geometry.transform(DASHBOARD_PROJECTION, W.map.getProjectionObject());
      features.push(new ReportFeature(geometry));
      let featureItem = document.createElement("div");
      featureItem.innerHTML = `<div class="description">${report.description}</div><div class="source">${report.source}</div>`;
      featureList.appendChild(featureItem);
    });
    mapLayer.addFeatures(features);
    clearStatus();
    sidepanel.textContent = "Reports retrieved: " + data.reports.length;
    sidepanel.appendChild(featureList);
  });
  console.log(mapLayer);
}

function ReportFeature(geometry) {
  let attributes = {
    fillColor: "#bfcdff",
    selectFillColor: "#dffdff",
    strokeColor: "#4881b8",
    selectStrokeColor: "#78a1d8",
    highlightSelectStrokeColor: "#88b1f8",
    repositoryObject: {
      isDeleted: () => false,
      setSelected: (state) => null,
      isNew: () => false,
      getType: () => null,
      getID: () => -1
    }
  };
  let feature = new OpenLayers.Feature.Vector(geometry, attributes);
  feature.model = attributes;
  return feature;
}

function addLayer() {
  mapLayer = new OpenLayers.Layer.Vector("dashboard_companion", {
    styleMap: new OpenLayers.StyleMap({
      'default': new OpenLayers.Style({
        pointRadius: 8,
        strokeColor: '${strokeColor}',
        fillColor: '${fillColor}'
      }),
      'highlight': new OpenLayers.Style({
        pointRadius: 12,
        strokeColor: '${highlightSelectStrokeColor}'
      }),
      'select': new OpenLayers.Style({
        pointRadius: 12,
        strokeColor: '${selectStrokeColor}',
        fillColor: '${selectFillColor}'
      }),
      'highlightselected': new OpenLayers.Style({
        pointRadius: 12,
        strokeColor: '${highlightSelectStrokeColor}',
        fillColor: '${selectFillColor}'
      })
    })
  });
  W.map.addLayer(mapLayer);
  let layerContainer =  W.selectionManager.selectionMediator._rootContainerLayer;
  layerContainer.layers.push(mapLayer);
  layerContainer.collectRoots();

  W.selectionManager.selectionMediator.on({
    "map:selection:featureIn": (e) => {
      if (e.layer == mapLayer) {
        // TODO
      }
    },
    "map:selection:featureOut": (e) => {
      if (e.layer == mapLayer) {
        // TODO
      }
    }
  });
}

function retrieveData(path) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      responseType: 'json',
      url: DASHBOARD_URL + path.replace(/^\/+/g, ''),
      onload: (data) => resolve(data.response),
      onerror: (data) => reject(data),
      ontimeout: (data) => reject(data)
    });
  });
}

function clearStatus() {
  while (statusField.firstChild) {
    statusField.removeChild(statusField.firstChild);
  }
}

function onWmeInitialized() {
  // Add style
  let styleElement = document.createElement('style');
  styleElement.textContent = `
#sidepanel-dashboard-companion .status-field {
  display:flex;
  justify-content: space-around;
  flex-direction: column;
  border: 1px solid #d5d7db;
  padding: 8px;
  border-radius: 6px;
  --wz-button-height: 40px;
}

#sidepanel-dashboard-companion .status-field:empty {
  border: none;
}

#sidepanel-dashboard-companion .status-field p:last-child {
  margin-bottom: 0;
}

#sidepanel-dashboard-companion .status-field wz-button {
  flex-grow: 1;
}

#sidepanel-dashboard-companion .feature-list {
  display: flex;
  flex-direction: column;
}

#sidepanel-dashboard-companion wz-button {
  margin: 8px;
}

#sidepanel-dashboard-companion .footer {
  font-size: 11px;
  margin-top: 4px;
  border-top: 1px solid #d5d7db;
}
`;
  document.head.appendChild(styleElement);

  if (W.userscripts?.state?.isReady) {
    console.log('W is ready and in "wme-ready" state. Proceeding with initialization.');
    onWmeReady();
  } else {
    console.log('W is ready, but not in "wme-ready" state. Adding event listener.');
    document.addEventListener('wme-ready', onWmeReady, { once: true });
  }
}

function bootstrap() {
  if (!W) {
    console.log('W is not available. Adding event listener.');
    document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
  } else {
    onWmeInitialized();
  }
}

bootstrap();
