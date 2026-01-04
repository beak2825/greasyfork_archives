// ==UserScript==
// @name         Abstandshalter
// @namespace    leeSalami.lss
// @version      0.12
// @description  Visualisiert vor dem Setzen eines Gebäudes, falls es zu nah an anderen Gebäuden stehen würde. Die jeweiligen Gebäudetypen müssen auf der Karte eingeblendet sein.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/515974/Abstandshalter.user.js
// @updateURL https://update.greasyfork.org/scripts/515974/Abstandshalter.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const BUILDINGS_WITHOUT_LIMIT = [1, 3, 4, 7, 8, 10, 14, 22, 23, 27];
  const BUILDING_RADIUS = 1000;
  const CALCULATION_RADIUS = 7500;
  const BUILDING_LIMIT = 12;

  let draggableCircle;
  let blockingCircles = [];
  let buildingTypeId;
  let iconUrl;
  let buildingCountElement;
  let buildButtonsDisabled = false;

  const observerStart = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#new_building') || !mutation.addedNodes.length) {
        return;
      }

      observerStart.disconnect();
      observeBuilding(observerEnd);
      initMarker();
    });
  });

  const observerEnd = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#build_new_building') || !mutation.addedNodes.length) {
        return;
      }

      observerEnd.disconnect();
      observeBuilding(observerStart);
    });
  });

  setCss();
  observeBuilding(observerStart);

  function pointsInCircle(circleLatLng, layers, distance) {
    const pointsInCircle = [];

    for (let i = 0, n = layers.length; i < n; i++) {
      const distanceToCircle = layers[i].getLatLng().distanceTo(circleLatLng);

      if (distanceToCircle <= distance) {
        pointsInCircle.push(layers[i]);
      }
    }

    return pointsInCircle;
  }

  function removeCircles() {
    draggableCircle?.remove();

    for (let i = 0, n = blockingCircles.length; i < n; i++) {
      blockingCircles[i]?.remove();
    }

    blockingCircles = [];
  }

  function getCloseBuildingCount(latLngNewMarker) {
    if (buildingTypeId === null || BUILDINGS_WITHOUT_LIMIT.includes(buildingTypeId)) {
      removeCircles();
      removeMarkerStyles();

      return;
    }

    const markersOfBuildingType = [];
    const buildingIds = [];

    map.eachLayer((layer) => {
      if (Object.hasOwn(layer, '_icon') && layer._icon.src.endsWith(iconUrl) && !buildingIds.includes(layer.building_id)) {
        markersOfBuildingType.push(layer)
        buildingIds.push(layer.building_id)
      }
    });

    const markers = pointsInCircle(latLngNewMarker, markersOfBuildingType, CALCULATION_RADIUS);
    const closeMarkerCount = pointsInCircle(latLngNewMarker, markersOfBuildingType, BUILDING_RADIUS).length;
    const badMarkerIds = [];
    let closeMarkerCountOfMarkers = 0;

    removeCircles();
    removeMarkerStyles();

    for (let i = 0, n = markers.length; i < n; i++) {
      const markerLatLng = markers[i].getLatLng();
      const markerCountOfMarker = pointsInCircle(markerLatLng, markersOfBuildingType, BUILDING_RADIUS).length;
      const isCloseToDraggableMarker = markerLatLng.distanceTo(latLngNewMarker) <= BUILDING_RADIUS;
      const markerId = markers[i]._leaflet_id;

      if (isCloseToDraggableMarker && markerCountOfMarker > closeMarkerCountOfMarkers) {
        closeMarkerCountOfMarkers = markerCountOfMarker;
      }

      if (markerCountOfMarker >= BUILDING_LIMIT && !badMarkerIds.includes(markerId)) {
        blockingCircles.push(L.circle(markerLatLng, BUILDING_RADIUS).setStyle({color: '#000', stroke: false, fillOpacity: 1, className: 'building-distance-circle'}).addTo(map));
        badMarkerIds.push(markerId);
      }

      if (markerCountOfMarker > BUILDING_LIMIT) {
        markers[i]._icon.classList.add('error-marker-0');
      } else if (markerCountOfMarker === BUILDING_LIMIT) {
        markers[i]._icon.classList.add('error-marker-1');
      } else if (markerCountOfMarker === BUILDING_LIMIT - 1) {
        markers[i]._icon.classList.add('error-marker-2');
      }
    }

    let color = '#00a219'
    enableBuildButton();

    if (closeMarkerCount >= BUILDING_LIMIT || closeMarkerCountOfMarkers >= BUILDING_LIMIT) {
      color = '#c9302c'
      disableBuildButton();
    } else if (closeMarkerCount === BUILDING_LIMIT - 1 || closeMarkerCountOfMarkers >= BUILDING_LIMIT - 1) {
      color = '#ffb300';
    }

    buildingCountElement.value = closeMarkerCount
    draggableCircle = L.circle(latLngNewMarker, BUILDING_RADIUS).setStyle({color: color, stroke: false, fillOpacity: 1, className: 'building-distance-circle'}).addTo(map);
  }

  function getDraggableMarker() {
    let marker = null;

    map.eachLayer((layer) => {
      if (layer.options.draggable) {
        marker = layer;
      }
    });

    return marker;
  }

  function createOutputField() {
    const wrapper = document.createElement('div');

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('input-group', 'string', 'readonly');
    wrapper.append(inputWrapper);

    const inputAddon = document.createElement('div');
    inputAddon.classList.add('input-group-addon');
    inputWrapper.append(inputAddon);

    const label = document.createElement('label');
    label.classList.add('string', 'optional');
    label.setAttribute('for', 'building_count');
    label.textContent = 'Nahe Gebäude';
    inputAddon.append(label);

    const input = document.createElement('input');
    input.id = 'building_count';
    input.readOnly = true;
    input.classList.add('string', 'optional', 'readonly', 'form-control');
    inputWrapper.append(input);

    document.querySelector('.building_build_costs').insertAdjacentElement('beforebegin', wrapper);
  }

  function initMarker() {
    const marker = getDraggableMarker();

    if (marker === null) {
      return;
    }

    createOutputField();
    buildingCountElement = document.getElementById('building_count');
    buildingTypeId = null;
    iconUrl = '';

    document.getElementById('building_building_type').addEventListener('change', (e) => {
      removeCircles();
      removeMarkerStyles();
      buildingCountElement.value = '';

      if (e.currentTarget.value !== '') {
        buildingTypeId = parseInt(e.currentTarget.value);
        iconUrl = OTHER_BUILDING_ICONS[buildingTypeId].replace('_other.png', '.png');
      } else {
        buildingTypeId = null;
        iconUrl = '';
      }

      getCloseBuildingCount(marker.getLatLng());
    });

    document.getElementById('building_back_button').addEventListener('click', () => {
      removeCircles();
      removeMarkerStyles();
    });

    document.querySelectorAll('.building_build_costs_active > div > input').forEach((element) => {
      element.addEventListener('click', () => {
        removeCircles();
        removeMarkerStyles();
        getCloseBuildingCount(marker.getLatLng());
      });
    });

    marker.on({
      'mousedown': () => {
        map.on('mousemove', () => {
          getCloseBuildingCount(marker.getLatLng())
        });
      }
    });

    marker.on({
      'dragend': () => {
        getCloseBuildingCount(marker.getLatLng());
      }
    });

    marker.on({
      'click': () => {
        getCloseBuildingCount(marker.getLatLng());
      }
    });

    map.on('mouseup', () => {
      map.removeEventListener('mousemove');
    });
  }

  function disableBuildButton() {
    document.querySelectorAll('.building_build_costs_active > div > input').forEach((element) => {
      buildButtonsDisabled = true;
      element.disabled = true;
    })
  }

  function enableBuildButton() {
    document.querySelectorAll('.building_build_costs_active > div > input').forEach((element) => {
      buildButtonsDisabled = false;
      element.disabled = false;
    })
  }

  function removeMarkerStyles() {
    const styledMarkers = document.querySelectorAll('.error-marker-0, .error-marker-1, .error-marker-2');

    for (let i = 0, n = styledMarkers.length; i < n; i++) {
      styledMarkers[i].classList.remove('error-marker-0', 'error-marker-1', 'error-marker-2');
    }
  }

  function observeBuilding(observer) {
    observer.observe(document.getElementById('buildings'), {
      childList: true,
    });
  }

  function setCss() {
    const style = document.createElement('style');
    style.innerHTML = `
      .error-marker-0,
      .error-marker-1,
      .error-marker-2 {
        height: 40px !important;
        margin-top: -40px !important;
        border-top-width: 3px;
        border-top-style: solid;
      }

      .error-marker-2 {
        border-top-color: #ffb300;
      }

      .error-marker-1 {
        border-top-color: #c9302c;
      }

      .error-marker-0 {
        border-top-color: #c700ff;
      }

      g:has(.building-distance-circle) {
        opacity: 0.4;
      }
    `;
    document.head.appendChild(style);
  }
})();
