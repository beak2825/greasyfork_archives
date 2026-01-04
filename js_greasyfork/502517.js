// ==UserScript==
// @name        [루시퍼홍] 이제 분임루트는 아실로
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     2.06
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 2024. 8. 3. 오후 22:17:18
// @downloadURL https://update.greasyfork.org/scripts/502517/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%9D%B4%EC%A0%9C%20%EB%B6%84%EC%9E%84%EB%A3%A8%ED%8A%B8%EB%8A%94%20%EC%95%84%EC%8B%A4%EB%A1%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/502517/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%9D%B4%EC%A0%9C%20%EB%B6%84%EC%9E%84%EB%A3%A8%ED%8A%B8%EB%8A%94%20%EC%95%84%EC%8B%A4%EB%A1%9C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11123440';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  // 한국 시간을 가져오는 함수
  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
    const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
    return koreanTime;
  }

  // 날짜를 24시간 형식으로 포맷하는 함수
  function formatDateTo24Hour(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 최신 버전을 가져오기 위해 메타 파일을 가져옴
  fetch(`${updateUrl}?_=${Date.now()}`)
    .then(response => response.text())
    .then(meta => {
      const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

      if (latestVersionMatch) {
        const latestVersion = latestVersionMatch[1];
        console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

        if (currentVersion !== latestVersion) {
          if (!shouldDismissPopup()) {
            showUpdatePopup(latestVersion);
          }
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch the latest version information:', error);
    });

  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;

    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }

  function dismissPopup() {
    const koreanTime = getKoreanTime();
    const formattedTime = formatDateTo24Hour(koreanTime);
    localStorage.setItem(popupDismissKey, formattedTime);
  }

  function showUpdatePopup(latestVersion) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '10000';

    const message = document.createElement('p');
    message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
    popup.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = () => {
      window.open(cafeUrl, '_blank');
      document.body.removeChild(popup);
    };
    popup.appendChild(confirmButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.onclick = () => {
      dismissPopup();
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }
})();

// HTML 요소 동적으로 생성
var distanceItem = document.createElement('div');
distanceItem.id = 'distanceItem';
distanceItem.className = 'map_item map_measure_distance';

var distanceLink = document.createElement('a');
distanceLink.href = 'javascript:initMapAndMeasurement("distance")';
distanceLink.className = 'map_btn distance_btn';
distanceLink.innerText = '거리 재기';

distanceItem.appendChild(distanceLink);
document.querySelector('.map_btn_left').appendChild(distanceItem);

var areaItem = document.createElement('div');
areaItem.id = 'areaItem';
areaItem.className = 'map_item map_measure_area';

var areaLink = document.createElement('a');
areaLink.href = 'javascript:initMapAndMeasurement("area")';
areaLink.className = 'map_btn area_btn';
areaLink.innerText = '면적 재기';

areaItem.appendChild(areaLink);
document.querySelector('.map_btn_left').appendChild(areaItem);

var markerItem = document.createElement('div');
markerItem.id = 'markerItem';
markerItem.className = 'map_item map_add_marker';

var markerLink = document.createElement('a');
markerLink.href = 'javascript:initaddMarkerMode()';
markerLink.className = 'map_btn marker_btn';
markerLink.innerText = '마커 추가';

markerItem.appendChild(markerLink);
document.querySelector('.map_btn_left').appendChild(markerItem);



var resetButton = document.createElement('a');
resetButton.href = 'javascript:resetShapes()';
resetButton.className = 'map_btn reset_btn';
resetButton.innerText = '리셋';

markerItem.appendChild(resetButton);
document.querySelector('.map_btn_left').appendChild(resetButton);


var measure;

// 로컬스토리지의 savedShapes를 초기화하는 함수
function resetShapes() {
  // 확인창을 띄워 사용자에게 정말 초기화할지 묻습니다.
  if (confirm('리셋된 데이터는 복구되지 않습니다. 리셋하시겠습니까?')) {
    // 로컬스토리지에서 savedShapes를 삭제
    localStorage.removeItem('savedShapes');

    // 화면에 그려진 모든 폴리곤과 마커를 지우기 위해 기존 함수 호출
    clearAllPolygonsFromMap();

    // measure._shapes 배열도 비워줍니다.
    if (measure && measure._shapes) {
      measure._shapes = [];
    }

    alert('모든 데이터가 삭제되었습니다.');
  }
}



// 마커 수정 후 로컬스토리지에 업데이트하는 함수
function updateMarkerInLocalStorage(marker) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  // 수정된 마커의 위치와 텍스트 정보를 업데이트
  savedShapes.forEach(shape => {
    shape.markers.forEach(savedMarker => {
      // 좌표 비교 시 marker.position.lat() 및 marker.position.lng() 사용
      if (savedMarker.position.lat === marker.position.lat() &&
        savedMarker.position.lng === marker.position.lng()) {
        savedMarker.label = marker.getElement().querySelector('span').innerHTML;
      }
    });
  });

  localStorage.setItem('savedShapes', JSON.stringify(savedShapes));
}

function saveMarkerToLocalStorage(marker) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  const markerData = {
    position: {
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
    },
    label: marker.getElement().querySelector('span').innerHTML || '클릭하여 수정'
  };

  // 저장된 마커와 동일한 위치의 마커가 있는지 확인 후 추가
  const isDuplicate = savedShapes.some(shape =>
    shape.markers && shape.markers.some(savedMarker =>
      savedMarker.position.lat === markerData.position.lat &&
      savedMarker.position.lng === markerData.position.lng
    )
  );

  if (!isDuplicate) {
    // 마커가 존재하지 않으면 새로운 shape를 추가
    savedShapes.push({
      markers: [markerData]
    });
  } else {
    // 동일한 마커가 이미 존재할 경우 마커만 추가
    savedShapes.forEach(shape => {
      if (shape.markers) {
        shape.markers.push(markerData);
      }
    });
  }

  // 로컬스토리지에 저장
  localStorage.setItem('savedShapes', JSON.stringify(savedShapes));

  clearAllPolygonsFromMap(); // 화면에서만 폴리곤 지우기
  reloadPolygons();          // 로컬 스토리지에서 폴리곤 다시 로드하기
  measure._updatePathElements();
}



// 신규 폴리곤의 색상 변경 시 로컬스토리지에 업데이트하는 함수
function updateNewPolygonColorInLocalStorage(polygon, newColor) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  // 신규로 생성된 폴리곤을 로컬스토리지에서 찾아 색상을 업데이트
  savedShapes.forEach(shape => {
    if (shape.polygon) {
      const polygonMatches = shape.polygonId === generatePolygonId(polygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      })));

      if (polygonMatches) {
        shape.fillColor = newColor;
      }
    }
  });

  localStorage.setItem('savedShapes', JSON.stringify(savedShapes));
}


// 폴리곤 색상을 변경하고 로컬스토리지에 저장하는 함수
function updatePolygonColorInLocalStorage(polygon, newColor) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  // 변경된 폴리곤을 로컬스토리지에서 찾아 색상을 업데이트
  savedShapes.forEach(shape => {
    if (shape.polygon) {
      const polygonMatches = JSON.stringify(shape.polygon) === JSON.stringify(polygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      })));

      if (polygonMatches) {
        shape.fillColor = newColor;
      }
    }
  });

  localStorage.setItem('savedShapes', JSON.stringify(savedShapes));
}
function loadShapesFromLocalStorage() {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  savedShapes.forEach(data => {
     if (data.polyline) {
      // 경로 데이터를 확인하고 올바르게 변환
      const polylinePath = data.polyline.map(coord => {
        if (coord.lat && coord.lng) {
          return new naver.maps.LatLng(coord.lat, coord.lng);
        } else {
          console.error("잘못된 좌표 데이터:", coord);
          return null;
        }
      }).filter(Boolean); // 좌표 변환 실패 시 null 제거

      if (polylinePath.length > 0) {
        const polyline = new naver.maps.Polyline({
          map: map,
          path: polylinePath,
          strokeColor: '#f00', // 기본 색상 설정
          strokeWeight: 3.33,
          strokeOpacity: 0.8,
        });

        const shapeObj = { polyline: polyline, markers: [] };

        // 마커 데이터 로드 및 추가
        data.markers.forEach(markerData => {
          const marker = createMarker(markerData, shapeObj);
          shapeObj.markers.push(marker);
        });

        measure._shapes.push(shapeObj);
      } else {
        console.error("폴리라인의 경로가 비어 있습니다.");
      }
    } else if (data.polygon) {
      const polygon = new naver.maps.Polygon({
        map: map,
        paths: data.polygon.map(coord => new naver.maps.LatLng(coord.lat, coord.lng)),
        strokeColor: '#00f',
        strokeWeight: 3.33,
        strokeOpacity: 0.8,
        fillColor: data.fillColor || '#00f',
        fillOpacity: 0.3,
        clickable: true // 폴리곤이 클릭 가능하도록 설정
      });

      const shapeObj = { polygon: polygon, markers: [] };

      // **이벤트 리스너 추가 코드**
      naver.maps.Event.addListener(polygon, 'click', function (e) {
        //console.log("폴리곤 클릭됨"); // 클릭 이벤트 테스트 로그
        showColorPanel(polygon, e); // 색상표 표시 함수 호출
      });

      const uniqueMarkers = [];
      const markerPositions = new Set();

      data.markers.forEach(markerData => {
        const positionKey = `${markerData.position.lat}-${markerData.position.lng}`;

        if (!markerPositions.has(positionKey)) {
          markerPositions.add(positionKey);
          const marker = createMarker(markerData, shapeObj);
          uniqueMarkers.push(marker);
        }
      });

      shapeObj.markers = uniqueMarkers;
      measure._shapes.push(shapeObj);
    }else if (data.markers) {
      data.markers.forEach(markerData => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(markerData.position.lat, markerData.position.lng),
          map: map,
          icon: {
            content: `<div class="custom-modal" style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;position:relative;">
                        <span style="font-size: 12px; font-weight: bold; color: #f00;">${markerData.label}</span>
                        <button class="delete-marker" style="position:absolute; right:0; top:0; width: 20px; height: 20px; background-color:red; color:white; border:none; font-size: 12px; cursor:pointer; display:none;">X</button>
                      </div>`
          }
        });

        const markerElement = $(marker.getElement());

        // 마우스 오버 시 삭제 버튼 표시
        markerElement.hover(
          function () { markerElement.find('.delete-marker').show(); },
          function () { markerElement.find('.delete-marker').hide(); }
        );

        // 삭제 버튼 클릭 시 마커 삭제
        markerElement.find('.delete-marker').on('click', function (e) {
          e.stopPropagation();
          marker.setMap(null); // 지도에서 마커 제거
          removeMarkerFromLocalStorage(marker); // 로컬스토리지에서 마커 데이터 삭제
        });

        // 마커 클릭 시 텍스트 수정 기능
        markerElement.on('click', function () {
          const span = markerElement.find('span');
          if (span.length === 0) return;

          const currentText = span.html().replace(/<br>/g, '\n');
          const textarea = $('<textarea class="custom-selection">' + currentText + '</textarea>');
          textarea.css({
            'font-size': '12px',
            'font-weight': 'bold',
            'color': '#f00',
            'text-align': 'center',
            'width': '200px',
            'height': '100px',
            'overflow': 'auto',
            'box-sizing': 'border-box',
            'background-color': '#fff',
            'position': 'relative'
          });

          span.replaceWith(textarea);
          textarea.focus();

          textarea.on('keydown', function (e) {
            if (e.key === 'Enter' && !e.altKey) {
              e.preventDefault();
              const newText = $(this).val().trim().replace(/\n/g, '<br>');
              const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');
              newSpan.css({
                'font-size': '12px',
                'font-weight': 'bold',
                'color': '#f00',
                'background-color': '#fff',
                'display': 'inline-block',
                'text-align': 'center'
              });

              $(this).replaceWith(newSpan);
              markerElement.find('.delete-marker').hide();
              updateMarkerInLocalStorage(marker); // 로컬스토리지에 업데이트
            }
          });

          textarea.on('blur', function () {
            const newText = $(this).val().trim().replace(/\n/g, '<br>');
            const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');
            newSpan.css({
              'font-size': '12px',
              'font-weight': 'bold',
              'color': '#f00',
              'background-color': '#fff',
              'display': 'inline-block',
              'text-align': 'center'
            });

            $(this).replaceWith(newSpan);
            markerElement.find('.delete-marker').hide();
            updateMarkerInLocalStorage(marker); // 로컬스토리지에 업데이트
          });
        });

        measure._shapes.push({ marker: marker });
      });
    }
  });
  ensureMeasureInitialized();
}


// 로컬스토리지에서 마커 데이터 삭제 함수
function removeMarkerFromLocalStorage(marker) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];
  const updatedShapes = savedShapes.map(shape => {
    if (shape.markers) {
      shape.markers = shape.markers.filter(savedMarker => {
        return savedMarker.position.lat !== marker.getPosition().lat() ||
               savedMarker.position.lng !== marker.getPosition().lng();
      });
    }
    return shape;
  }).filter(shape => shape.markers && shape.markers.length > 0);

  localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
}

function showColorPanel(polygon, event) {
  console.log("showColorPanel 호출됨", event); // 이벤트 로그 확인

  // 현재 모드가 'marker'일 때는 색상창을 표시하지 않음
  if (measure && (measure._mode === 'marker' || measure._mode === 'area')) {
    console.log("마커 모드에서는 색상창을 표시하지 않습니다.");
    return; // 마커 모드일 때는 아무 동작도 하지 않음
  }

  // colorDiv가 존재하지 않거나, DOM에 추가되지 않은 경우 초기화
  if (!colorDiv || !document.body.contains(colorDiv)) {
    console.log("initColorPanel 호출");
    initColorPanel();
  }

  // 이벤트 객체에서 좌표 가져오기
  const clientX = event.clientX !== undefined ? event.clientX : (event.pointerEvent ? event.pointerEvent.clientX : 0);
  const clientY = event.clientY !== undefined ? event.clientY : (event.pointerEvent ? event.pointerEvent.clientY : 0);

  // clientX와 clientY 값이 정상적으로 존재하는지 로그로 확인
  //console.log("clientX:", clientX, "clientY:", clientY);

  // 색상표의 위치 및 스타일 설정
  $(colorDiv).css({
    top: `${clientY}px`, // y 좌표
    left: `${clientX}px`, // x 좌표
    display: 'block' // 색상표 보이도록 설정
    //zIndex: 10000 // 다른 요소보다 위에 표시되도록 설정
  });

  // colorDiv 스타일 확인을 위한 로그 추가
  //console.log('colorDiv style:', $(colorDiv).attr('style'));

  // 색상 선택 이벤트 처리
  $(colorDiv).off('click').on('click', '.small-square', function (e) {
    e.stopPropagation(); // 이벤트 전파 방지
    const selectedColor = $(this).css('backgroundColor'); // 선택된 색상의 배경색 가져오기
    polygon.setOptions({
      fillColor: selectedColor
    });
    updatePolygonColorInLocalStorage(polygon, rgbToHex(selectedColor)); // 색상 변경 후 로컬스토리지에 저장
    closeDiv(); // 패널을 닫음
  });

  // 패널 외부를 클릭할 경우 패널을 닫기 위한 이벤트 설정
  $(document).one('click', function () {
    closeDiv(); // 패널 숨기기
  });
}

function createMarker(markerData, shapeObj) {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(markerData.position.lat, markerData.position.lng),
    map: map,
    icon: {
      content: `<div class="custom-modal" style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;position:relative;">
                  <span style="font-size: 14px; font-weight: bold; color: #f00;">${markerData.label}</span>
                  <button class="delete-marker" style="position:absolute; right:0; top:0; width: 20px; height: 20px; background-color:red; color:white; border:none; font-size: 12px; cursor:pointer; display:none;">X</button>
                </div>`
    }
  });

  const markerElement = $(marker.getElement());

  // 마우스 오버 시 삭제 버튼 표시
  markerElement.hover(
    function () { markerElement.find('.delete-marker').show(); },
    function () { markerElement.find('.delete-marker').hide(); }
  );

  // 삭제 버튼 클릭 시 처리
  markerElement.find('.delete-marker').on('click', function (e) {
  e.stopPropagation();

  // 현재 마커의 인덱스를 정확히 계산
  const markerIndex = shapeObj.markers.findIndex(m =>
    m.getPosition().lat() === marker.getPosition().lat() &&
    m.getPosition().lng() === marker.getPosition().lng()
  );

  const isStartMarker = markerIndex === 0; // 출발 마커
  const isEndMarker = markerIndex === shapeObj.markers.length - 1; // 도착 마커

  if (isStartMarker || isEndMarker) {
    // 출발 또는 도착 마커인 경우
    const confirmMessage = shapeObj.polyline
      ? '거래재기가 삭제됩니다. 삭제하시겠습니까?'
      : '면적재기가 삭제됩니다. 삭제하시겠습니까?';
    if (!confirm(confirmMessage)) return;

    _removeShape(shapeObj); // 전체 삭제
    _removeShapeFromLocalStorage(shapeObj);
  } else {
    // 중간 마커인 경우 해당 마커만 삭제
    marker.setMap(null);
    shapeObj.markers.splice(markerIndex, 1); // 해당 마커 삭제

    // 로컬 스토리지 업데이트
    const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];
    savedShapes.forEach(savedShape => {
      if (savedShape.polyline && JSON.stringify(savedShape.polyline) === JSON.stringify(shapeObj.polyline.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      })))) {
        // 마커 배열에서 해당 마커만 제거
        savedShape.markers = savedShape.markers.filter((savedMarker, idx) => idx !== markerIndex);
      }
    });

    localStorage.setItem('savedShapes', JSON.stringify(savedShapes));
  }
});


  // 마커 클릭 시 텍스트 수정 기능
  markerElement.on('click', function () {
    const span = markerElement.find('span');
    if (span.length === 0) return;

    const currentText = span.html().replace(/<br>/g, '\n');
    const textarea = $('<textarea class="custom-selection">' + currentText + '</textarea>');
    textarea.css({
      'font-size': '12px',
      'font-weight': 'bold',
      'color': '#f00',
      'text-align': 'center',
      'width': '200px',
      'height': '100px',
      'overflow': 'auto',
      'box-sizing': 'border-box',
      'background-color': '#fff',
      'position': 'relative'
    });

    span.replaceWith(textarea);
    textarea.focus();

    textarea.on('keydown', function (e) {
      if (e.key === 'Enter' && !e.altKey) {
        e.preventDefault();
        const newText = $(this).val().trim().replace(/\n/g, '<br>');
        const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');
        newSpan.css({
          'font-size': '12px',
          'font-weight': 'bold',
          'color': '#f00',
          'background-color': '#fff',
          'display': 'inline-block',
          'text-align': 'center'
        });

        $(this).replaceWith(newSpan);
        markerElement.find('.delete-marker').hide();
        updateMarkerInLocalStorage(marker); // 로컬스토리지에 업데이트
      }
    });

    textarea.on('blur', function () {
      const newText = $(this).val().trim().replace(/\n/g, '<br>');
      const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');
      newSpan.css({
        'font-size': '12px',
        'font-weight': 'bold',
        'color': '#f00',
        'background-color': '#fff',
        'display': 'inline-block',
        'text-align': 'center'
      });

      $(this).replaceWith(newSpan);
      markerElement.find('.delete-marker').hide();
      updateMarkerInLocalStorage(marker); // 로컬스토리지에 업데이트
    });
  });

  return marker;
}





// 로컬스토리지에서 shapeObj를 업데이트하는 함수
function _updateShapeInLocalStorage(shapeObj) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  const updatedShapes = savedShapes.map(savedShape => {
    if (
      savedShape.polyline &&
      JSON.stringify(savedShape.polyline) === JSON.stringify(shapeObj.polyline.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      })))
    ) {
      // 동일한 폴리라인에 대해 마커 배열 업데이트
      savedShape.markers = shapeObj.markers.map(marker => ({
        position: {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        },
        label: marker.getElement().querySelector('span').innerHTML
      }));
    }
    return savedShape;
  });

  localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
}



// shapeObj와 관련된 모든 폴리라인과 마커를 지도와 로컬스토리지에서 삭제
function _removeShape(shapeObj) {
  // 폴리라인 삭제
  if (shapeObj.polyline) {
    shapeObj.polyline.setMap(null);
  }

  // 폴리곤 삭제
  if (shapeObj.polygon) {
    shapeObj.polygon.setMap(null);
  }

  // 마커 삭제
  if (shapeObj.markers && Array.isArray(shapeObj.markers)) {
    shapeObj.markers.forEach(marker => marker.setMap(null));
  }

  // measure._shapes 배열에서 해당 shapeObj 제거
  if (shapeObj.polygon) {
    const polygonId = generatePolygonId(shapeObj.polygon.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    })));

    measure._shapes = measure._shapes.filter(shape => {
      if (shape.polygon) {
        const currentPolygonId = generatePolygonId(shape.polygon.getPath().getArray().map(coord => ({
          lat: coord.lat(),
          lng: coord.lng()
        })));
        return currentPolygonId !== polygonId;
      }
      return true;
    });
  } else if (shapeObj.polyline) {
    const polylineData = shapeObj.polyline.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    }));

    measure._shapes = measure._shapes.filter(shape => {
      if (shape.polyline) {
        const currentPolylineData = shape.polyline.getPath().getArray().map(coord => ({
          lat: coord.lat(),
          lng: coord.lng()
        }));
        return JSON.stringify(currentPolylineData) !== JSON.stringify(polylineData);
      }
      return true;
    });
  }

  // 로컬 스토리지에서도 shapeObj 제거
  _removeShapeFromLocalStorage(shapeObj);

  //console.log("삭제 후 measure._shapes 배열 상태:", measure._shapes);
}

// 로컬스토리지에서 shapeObj 제거하는 함수 수정
function _removeShapeFromLocalStorage(shapeObj) {
  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  // 폴리라인일 경우
  if (shapeObj.polyline) {
    const polylineData = shapeObj.polyline.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    }));

    const updatedShapes = savedShapes.filter(savedShape => {
      const polylineMatches = JSON.stringify(savedShape.polyline) !== JSON.stringify(polylineData);
      return polylineMatches;
    });

    localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
  }

  // 폴리곤일 경우
  if (shapeObj.polygon) {
    const polygonData = shapeObj.polygon.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    }));

    const polygonId = generatePolygonId(polygonData);

    const updatedShapes = savedShapes.filter(savedShape => savedShape.polygonId !== polygonId);

    localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
  }
}


// 폴리곤의 고유 ID를 생성하는 함수
function generatePolygonId(coords) {
  // 각 좌표의 lat, lng을 문자열로 결합하여 해시 생성 (간단한 방식 사용)
  return coords.map(coord => `${coord.lat},${coord.lng}`).join('-');
}
// 로컬스토리지에서 폴리곤을 저장하는 함수 수정
// 로컬스토리지에서 폴리곤을 저장하는 함수 수정
// 신규 폴리곤 생성 시 로컬스토리지에 저장하는 함수 수정
function clearAllPolygonsFromMap() {
  // measure 객체와 _shapes 배열이 존재하는지 확인 후 폴리곤, 폴리라인 및 마커를 지우는 함수
  if (measure && measure._shapes) {
    measure._shapes.forEach(shapeObj => {
      // 폴리곤 삭제
      if (shapeObj.polygon) {
        shapeObj.polygon.setMap(null); // 화면에서 폴리곤 삭제
      }

      // 폴리라인 삭제
      if (shapeObj.polyline) {
        shapeObj.polyline.setMap(null); // 화면에서 폴리라인 삭제
      }

      // 마커 삭제 (폴리곤과 관련된 마커뿐만 아니라 독립적인 마커도 포함)
      if (shapeObj.markers) {
        shapeObj.markers.forEach(marker => marker.setMap(null)); // 화면에서 마커 삭제
      }

      // 마커가 shapeObj에 직접 포함된 경우 삭제
      if (shapeObj.marker) {
        shapeObj.marker.setMap(null); // 화면에서 마커 삭제
      }
    });
    // _shapes 배열은 초기화하지 않고 유지
  }
}



function reloadPolygons() {
  // 로컬 스토리지에서 데이터를 다시 불러와 폴리곤을 그리는 함수 호출
  loadShapesFromLocalStorage();
}

function saveShapesToLocalStorage() {
  let savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  measure._shapes.forEach(shapeObj => {
    if (shapeObj.polyline && shapeObj.polyline.getPath) {
      const polylineData = shapeObj.polyline.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      }));

      const markersData = shapeObj.markers.map(marker => ({
        position: {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        },
        label: marker.getElement().querySelector('span').innerHTML
      }));

      const isDuplicate = savedShapes.some(savedShape =>
        JSON.stringify(savedShape.polyline) === JSON.stringify(polylineData)
      );

      if (!isDuplicate) {
        savedShapes.push({
          polyline: polylineData,
          markers: markersData
        });
      }
    } else if (shapeObj.polygon && shapeObj.polygon.getPath) {
      const polygonData = shapeObj.polygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      }));

      const polygonId = generatePolygonId(polygonData);

      const polygonMarkersData = shapeObj.markers.map(marker => ({
        position: {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        },
        label: marker.getElement().querySelector('span').innerHTML
      }));

      const existingPolygonIndex = savedShapes.findIndex(savedShape => savedShape.polygonId === polygonId);

      if (existingPolygonIndex === -1) {
        savedShapes.push({
          polygonId: polygonId,
          polygon: polygonData,
          fillColor: shapeObj.polygon.getOptions().fillColor || '#00f', // 기본 색상 설정
          markers: polygonMarkersData
        });
      } else {
        savedShapes[existingPolygonIndex].polygon = polygonData;
        savedShapes[existingPolygonIndex].markers = polygonMarkersData;
        savedShapes[existingPolygonIndex].fillColor = shapeObj.polygon.getOptions().fillColor || '#00f'; // 색상 업데이트
      }
    }
  });

  localStorage.setItem('savedShapes', JSON.stringify(savedShapes));

  clearAllPolygonsFromMap(); // 화면에서만 폴리곤 지우기
  reloadPolygons();          // 로컬 스토리지에서 폴리곤 다시 로드하기
}




// 폴리곤의 고유 ID를 생성하는 함수
function generatePolygonId(coords) {
  // 각 좌표의 lat, lng을 문자열로 결합하여 해시 생성 (간단한 방식 사용)
  return coords.map(coord => `${coord.lat},${coord.lng}`).join('-');
}




function ensureMeasureInitialized() {
  if (!measure) {
    measure = new Measure({
      distance: $('.distance_btn'),
      area: $('.area_btn'),
      marker: $('.marker_btn')
    });
    measure.setMap(map);
  }
}

window.resetShapes = resetShapes;

window.initMapAndMeasurement = function (mode) {
  ensureMeasureInitialized();
  measure.startMode(mode);
}

window.initaddMarkerMode = function () {
  ensureMeasureInitialized();
  measure.addMarkerMode();
}

var Measure = function (buttons) {
  this.$btnDistance = buttons.distance;
  this.$btnArea = buttons.area;
  this.$btnMarker = buttons.marker;
  this._mode = null;
  this._shapes = [];
  this._lastClickedPositions = [];
  this._bindDOMEvents();
  this._bindGlobalEvents();
};

$.extend(Measure.prototype, {
  constructor: Measure,

  setMap: function (map) {
    if (this.map) {
      this._unbindMap(this.map);
    }
    this.map = map;
    if (map) {
      this._bindMap(map);
    }
  },

  startMode: function (mode) {
    if (!mode) return;
    this._lastClickedPositions = [];
    this._mode = mode;
    if (mode === 'distance') {
      this._startDistance();
    } else if (mode === 'area') {
      this._startArea();
    } else if (mode === 'marker') {
      this._startMarker();
    }
    $(document).off('keydown.measure').on('keydown.measure', function (e) {
      if (e.key === 'Backspace' && this._mode) {
        this._revertToPreviousClick();
      } else if (e.key === 'Escape' && this._mode) {
        this._finishMode();
      }
    }.bind(this));
  },

  _startDistance: function () {
    var map = this.map;
    this._distanceListeners = [
      naver.maps.Event.addListener(map, 'click', this._onClickDistance.bind(this)),
      naver.maps.Event.addListener(map, 'rightclick', this._finishMode.bind(this))
    ];
    map.setCursor("crosshair");
    this.$btnDistance.addClass('active');
    this.$btnArea.removeClass('active');
    this.$btnMarker.removeClass('active');
    this.$btnDistance.css('background-color', '#2237F3');
    this.$btnDistance.css('color', 'white');
    this.$btnArea.css('background-color', '');
    this.$btnArea.css('color', '');
    this.$btnMarker.css('background-color', '');
    this.$btnMarker.css('color', '');
  },

  _startArea: function () {
    var map = this.map;
    this._areaListeners = [
      naver.maps.Event.addListener(map, 'click', this._onClickArea.bind(this)),
      naver.maps.Event.addListener(map, 'rightclick', this._finishMode.bind(this))
    ];
    map.setCursor("crosshair");
    this.$btnArea.addClass('active');
    this.$btnDistance.removeClass('active');
    this.$btnMarker.removeClass('active');
    this.$btnArea.css('background-color', '#1C22F3');
    this.$btnArea.css('color', 'white');
    this.$btnDistance.css('background-color', '');
    this.$btnDistance.css('color', '');
    this.$btnMarker.css('background-color', '');
    this.$btnMarker.css('color', '');
  },

  _startMarker: function () {
    var map = this.map;
    this._markerListeners = [
      naver.maps.Event.addListener(map, 'click', this._onClickMarker.bind(this)),
      naver.maps.Event.addListener(map, 'rightclick', this._finishMode.bind(this))
    ];
    map.setCursor("crosshair");
    this.$btnMarker.addClass('active');
    this.$btnDistance.removeClass('active');
    this.$btnArea.removeClass('active');
    this.$btnMarker.css('background-color', '#1C22F3');
    this.$btnMarker.css('color', 'white');
    this.$btnDistance.css('background-color', '');
    this.$btnDistance.css('color', '');
    this.$btnArea.css('background-color', '');
    this.$btnArea.css('color', '');

    this.$btnDistance.off('click');
    this.$btnArea.off('click');
    this.$btnDistance.on('click', this.cancelMarkerMode.bind(this));
    this.$btnArea.on('click', this.cancelMarkerMode.bind(this));
  },

  // Distance measurement completion logic
  _finishDistance: function () {
    naver.maps.Event.removeListener(this._distanceListeners);
    delete this._distanceListeners;
    $(document).off('mousemove.measure');

    if (this._guideline) {
      this._guideline.setMap(null);
      delete this._guideline;
    }

    if (this._polyline) {
      const path = this._polyline.getPath();
      let totalDistance = 0;
      let cumulativeDistance = 0;
      const shapeObj = { polyline: this._polyline, markers: [] };

      // 총 거리를 먼저 계산하여 totalDistance에 설정
      for (let i = 1; i < path.getLength(); i++) {
        const previousCoord = path.getAt(i - 1);
        const currentCoord = path.getAt(i);
        totalDistance += this._calculateDistance(previousCoord, currentCoord);
      }

      if (path.getLength() > 1) {
        // 시작점 마커 추가, 이미 추가된 마커 확인 방지
       const startMarker = this._addMilestone(
          path.getAt(0),
          '출발',
          {
            'font-size': '2px !important', // 중요도 우선 설정
            'font-weight': 'bold',
            'color': '#f00',
            'background-color': '#fff',
            'border': '1px solid #000'
          },
          shapeObj
        );


        // Check to avoid adding duplicate markers
        if (!shapeObj.markers.some(m => m.getPosition().equals(startMarker.getPosition()))) {
          shapeObj.markers.push(startMarker);
        }

        // 중간 구간에 표시 마커 추가
        path.forEach((coord, index) => {
          if (index > 0) {
            const previousCoord = path.getAt(index - 1);
            const segmentDistance = this._calculateDistance(previousCoord, coord);
            cumulativeDistance += segmentDistance;

            const remainingDistance = totalDistance - cumulativeDistance;
            const isLast = index === path.getLength() - 1;
            if (!isLast) {
              const label = `${this._fromMetersToText(cumulativeDistance)} / ${this._fromMetersToText(remainingDistance)}`;
              const distanceMarker = this._addMilestone(
                coord,
                label,
                { 'font-size': '12px', 'font-weight': 'bold', 'color': '#f00', 'background-color': '#fff', 'border': '1px solid #000' },
                shapeObj
              );

              // Avoid adding duplicate markers
              if (!shapeObj.markers.some(m => m.getPosition().equals(distanceMarker.getPosition()))) {
                shapeObj.markers.push(distanceMarker);
              }
            }
          }
        });

        // 마지막 도착 지점 마커 추가
        const travelTime = this._calculateTime(totalDistance, 4);
        const endLabel = `도착 / ${this._fromMetersToText(totalDistance)}<br>${travelTime}<br>(시속4km 기준)`;
        const endMarker = this._addMilestone(
          path.getAt(path.getLength() - 1),
          endLabel,
          { 'font-size': '12px', 'font-weight': 'bold', 'color': '#f00', 'background-color': '#fff', 'border': '1px solid #000' },
          shapeObj
        );

        // Check for duplicate markers
        if (!shapeObj.markers.some(m => m.getPosition().equals(endMarker.getPosition()))) {
          shapeObj.markers.push(endMarker);
        }

        // 최종적으로 저장을 위해 measure._shapes에 추가
        this._shapes.push(shapeObj);
        saveShapesToLocalStorage();

        delete this._polyline;
      } else {
        this._polyline.setMap(null);
        delete this._polyline;
      }
    }

    this._clearButtonStyles();
    this.map.setCursor('auto');
    delete this._lastDistance;
    this._mode = null;
    this._lastClickedPositions = [];
  },

  // 시속을 바탕으로 예상 소요 시간을 계산하는 함수 (속도: km/h)
  _calculateTime: function (distance, speedKmH) {
    const speedMs = speedKmH * 1000 / 3600; // 시속을 초속으로 변환
    const timeInSeconds = distance / speedMs; // 시간(초) 계산
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    let timeString = '';
    if (hours > 0) timeString += `${hours}시간 `;
    if (minutes > 0) timeString += `${minutes}분 `;
    // timeString += `${seconds}초`;

    return timeString;
  },

  // 두 좌표 간의 거리를 계산하는 함수 (Haversine formula 사용)
  _calculateDistance: function (coord1, coord2) {
    const R = 6371000; // 지구 반지름 (미터)
    const lat1 = coord1.y * Math.PI / 180;
    const lat2 = coord2.y * Math.PI / 180;
    const deltaLat = (coord2.y - coord1.y) * Math.PI / 180;
    const deltaLng = (coord2.x - coord1.x) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 두 좌표 간의 거리 반환
  },

  // 면적 측정 완료 시 shapeObj에 polygon을 추가하고, markers 배열이 초기화되도록 수정
 _finishArea: function () {
    naver.maps.Event.removeListener(this._areaListeners);
    delete this._areaListeners;
    $(document).off('mousemove.measure');

    if (this._guideline) {
        this._guideline.setMap(null);
        delete this._guideline;
    }

    // 폴리곤 객체가 올바르게 초기화되었는지 확인
    if (this._polygon && this._polygon.getPath) {
        const path = this._polygon.getPath();
        const shapeObj = { polygon: this._polygon, markers: [] }; // shapeObj 초기화

        if (path.getLength() > 1) {
            const area = this._polygon.getAreaSize ? this._polygon.getAreaSize() : 0; // getAreaSize 호출 전 확인
            delete this._polygon;
            const areaMarker = this._addMilestone(
                path.getAt(path.getLength() - 1),
                `${this._fromMetersToText(area)}²`,
                { 'font-size': '12px', 'font-weight': 'bold', 'color': '#f00', 'background-color': '#fff', 'border': '1px solid #000' },
                shapeObj
            );
            shapeObj.markers.push(areaMarker);
            this._shapes.push(shapeObj);

            // 폴리곤 그리기가 끝난 후 초기 색상 저장
            updatePolygonColorInLocalStorage(shapeObj.polygon, shapeObj.polygon.getOptions().fillColor || '#00f');

            // 로컬스토리지에 저장
            saveShapesToLocalStorage();
        } else {
            this._polygon.setMap(null);
            delete this._polygon;
        }
    } else {
        console.warn("Polygon is not initialized properly or getAreaSize is not available.");
    }

    this._clearButtonStyles();
    map.setCursor('auto');
    delete this._lastArea;
    this._mode = null;
    this._lastClickedPositions = [];
},



  _finishMarker: function () {
    naver.maps.Event.removeListener(this._markerListeners);
    delete this._markerListeners;
    $(document).off('mousemove.measure');
    map.setCursor('auto');
    this._clearButtonStyles();
    this._mode = null;
  },

  _finishMode: function () {
    if (this._mode === 'distance') {
      this._finishDistance();
    } else if (this._mode === 'area') {
      this._finishArea();
    } else if (this._mode === 'marker') {
      this._finishMarker();
    }
  },

  cancelMode: function () {
    this._clearButtonStyles();
    this.map.setCursor('auto');
    if (this._guideline) {
      this._guideline.setMap(null);
      delete this._guideline;
    }
    delete this._mode;
    $(document).off('mousemove.measure').off('keydown.measure');
    if (this._distanceListeners) {
      naver.maps.Event.removeListener(this._distanceListeners);
      delete this._distanceListeners;
    }
    if (this._areaListeners) {
      naver.maps.Event.removeListener(this._areaListeners);
      delete this._areaListeners;
    }
    if (this._markerListeners) {
      naver.maps.Event.removeListener(this._markerListeners);
      delete this._markerListeners;
    }
    this._lastClickedPositions = [];
  },

  _fromMetersToText: function (meters) {
    meters = meters || 0;
    var km = 1000, text = meters;
    if (meters >= km) {
      text = parseFloat((meters / km).toFixed(1)) + 'km';
    } else {
      text = parseFloat(meters.toFixed(1)) + 'm';
    }
    return text;
  },
  _addMilestone: function (coord, text, css, shapeObj) {
    // 마커의 HTML 콘텐츠 생성
    const content = `
        <div class="custom-modal" style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;position:relative;">
            <span>${text}</span>
            <button class="delete-marker" style="position:absolute; right:0; top:0; background-color:red; color:white; border:none; cursor:pointer; width:15px; height:15px; display:none;">X</button>
        </div>`;

    // 마커 생성
    const ms = new naver.maps.Marker({
      position: coord,
      icon: { content: content, anchor: new naver.maps.Point(10, 10) },
      map: this.map
    });

    const msElement = $(ms.getElement());
    if (css) msElement.css(css);

    // 마커 클릭 시 텍스트 수정 기능
    msElement.on('click', function () {
      const span = msElement.find('span');
      if (span.length === 0) return;

      // 기존 텍스트를 textarea로 변경하여 수정 가능하도록
      const currentText = span.html().replace(/<br>/g, '\n');
      const textarea = $('<textarea class="custom-selection">' + currentText + '</textarea>');
      textarea.css({
        'font-size': '12px',
        'font-weight': 'bold',
        'color': '#f00',
        //'border': '1px solid #000',
        'text-align': 'center',
        'width': '200px',
        'height': '100px',
        'overflow': 'auto',
        'box-sizing': 'border-box',
        'background-color': '#fff',
        'position': 'relative'
      });

      // 기존 span을 textarea로 교체
      span.replaceWith(textarea);
      textarea.focus();

      // Enter를 누르면 변경된 텍스트를 반영
      textarea.on('keydown', function (e) {
        if (e.key === 'Enter' && !e.altKey) {
          //console.log("엔터");
          // e.preventDefault();
          const newText = $(this).val().trim().replace(/\n/g, '<br>');
          const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');

          // 스타일이 유지되도록 CSS를 다시 적용
          newSpan.css({
            'font-size': '12px',
            'font-weight': 'bold',
            'color': '#f00',
            'background-color': '#fff',
            //'border': '1px solid #000',
            'display': 'inline-block',
            'text-align': 'center'
          });

          $(this).replaceWith(newSpan);
          msElement.find('.delete-marker').hide(); // 수정 완료 시 삭제 버튼 숨김
          updateMarkerInLocalStorage(ms); // 로컬스토리지에 업데이트
        } else if (e.key === 'Enter' && e.altKey) {
          // e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          const text = $(this).val();
          $(this).val(text.substring(0, start) + '\n' + text.substring(end));
          this.selectionStart = this.selectionEnd = start + 1;
        }
      });

      // textarea에서 포커스를 잃으면 수정 사항을 span으로 되돌림
      textarea.on('blur', function () {
        const newText = $(this).val().trim().replace(/\n/g, '<br>');
        const newSpan = $('<span>' + (newText || '클릭하여 수정') + '</span>');

        // 스타일이 유지되도록 CSS를 다시 적용
        newSpan.css({
          'font-size': '12px',
          'font-weight': 'bold',
          'color': '#f00',
          'background-color': '#fff',
          //'border': '1px solid #000',
          'display': 'inline-block',
          'text-align': 'center'
        });

        $(this).replaceWith(newSpan);
        msElement.find('.delete-marker').hide(); // 포커스가 빠지면 삭제 버튼 숨김
        updateMarkerInLocalStorage(ms); // 로컬스토리지에 업데이트
      });

    });

    // 마우스 오버 시 삭제 버튼 표시
    msElement.hover(
      function () { $(this).find('.delete-marker').show(); },
      function () { $(this).find('.delete-marker').hide(); }
    );

    // 삭제 버튼 클릭 시 마커와 연관된 모든 폴리라인과 마커 삭제
    msElement.find('.delete-marker').on('click', function (e) {
      //console.log('Delete button clicked'); // 삭제 버튼 클릭 확인 로그
      console.log("진입1")
      e.stopPropagation();

      this._removeShape(shapeObj);
      this._removeShapeFromLocalStorage(shapeObj); // 로컬스토리지에서 삭제
    }.bind(this)); // bind(this)를 올바르게 사용

    // shapeObj에 markers 배열이 없을 경우 초기화
    if (!shapeObj.markers) {
      shapeObj.markers = [];
    }
    shapeObj.markers.push(ms);

    return ms;
  },

  // shapeObj와 관련된 모든 폴리라인과 마커를 지도와 로컬스토리지에서 삭제
  _removeShape: function (shapeObj) {
  // 폴리라인 삭제 (거리재기)
  if (shapeObj.polyline) {
    shapeObj.polyline.setMap(null);
  }

  // 폴리곤 삭제 (면적재기)
  if (shapeObj.polygon) {
    shapeObj.polygon.setMap(null);
  }

  // 마커 삭제
  if (shapeObj.markers && Array.isArray(shapeObj.markers)) {
    shapeObj.markers.forEach(marker => marker.setMap(null));
  }

  // measure._shapes에서 해당 shapeObj 제거
  this._shapes = this._shapes.filter(shape => shape !== shapeObj);
},

// 삭제 버튼에 이벤트 리스너 추가
deleteMarkerHandler: function (shapeObj, msElement) {
  msElement.find('.delete-marker').on('click', function (e) {
     console.log("진입2")
    e.stopPropagation();

    // shapeObj와 연관된 모든 폴리라인과 마커를 삭제
    this._removeShape(shapeObj);
    this._removeShapeFromLocalStorage(shapeObj); // 로컬스토리지에서 삭제
  }.bind(this)); // this 바인딩을 추가하여 _removeShape와 _removeShapeFromLocalStorage가 올바른 객체 참조를 사용하도록 설정
},


  // 로컬스토리지에서 shapeObj 제거
  _removeShapeFromLocalStorage(shapeObj) {
  // Check if the shapeObj is related to distance measurement (polyline) before removing
  if (!shapeObj.polyline) return; // Skip removal if it's not a polyline (distance measurement)

  const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];

  // 현재 shapeObj와 동일한 데이터를 찾아서 제거
  const filteredShapes = savedShapes.filter(savedShape => {
    const polylineMatches = JSON.stringify(savedShape.polyline) === JSON.stringify(shapeObj.polyline.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    })));

    const markersMatch = savedShape.markers.every((marker, index) => {
      const currentMarker = shapeObj.markers[index];
      return currentMarker &&
        marker.position.lat === currentMarker.getPosition().lat() &&
        marker.position.lng === currentMarker.getPosition().lng() &&
        marker.label === currentMarker.getElement().querySelector('span').innerHTML;
    });

    return !(polylineMatches && markersMatch);
  });

  // 업데이트된 데이터를 로컬스토리지에 저장
  localStorage.setItem('savedShapes', JSON.stringify(filteredShapes));
},
  _clearMilestones: function () {
    // 기존 마일스톤을 제거하지 않음
  },

  _addDeleteButton: function (shape, color) {
    var path = shape.getPath();
    var lastCoord = path.getAt(path.getLength() - 1);
    var deleteButton = new naver.maps.Marker({
      position: lastCoord,
      icon: {
        content: '<button style="background-color: ' + (color || '#f00') + '; color: #fff; border: none; padding: 5px; cursor: pointer;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>',
        anchor: new naver.maps.Point(0, 0)
      },
      map: this.map
    });

    naver.maps.Event.addListener(deleteButton, 'click', function () {
      shape.setMap(null);
      deleteButton.setMap(null);
      this._shapes = this._shapes.filter(function (shapeObj) {
        if (shapeObj.polyline === shape || shapeObj.polygon === shape) {
          shapeObj.markers.forEach(function (marker) {
            marker.setMap(null);
          });
          return false;
        }
        return true;
      });
    }.bind(this));
    return deleteButton;
  },

  _onClickDistance: function (e) {
    var map = this.map, coord = e.coord;
    if (!this._polyline) {
      this._guideline = new naver.maps.Polyline({
        strokeColor: '#f00',
        strokeWeight: 3.33,
        strokeStyle: [4, 4],
        strokeOpacity: 0.6,
        path: [coord],
        map: map
      });
      $(document).on('mousemove.measure', this._onMouseMoveDistance.bind(this));
      this._distanceListeners.push(naver.maps.Event.addListener(map, 'rightclick', this._finishMode.bind(this)));
      this._polyline = new naver.maps.Polyline({
        strokeColor: '#f00',
        strokeWeight: 3.33,
        strokeOpacity: 0.8,
        path: [coord],
        map: map
      });
      this._lastDistance = this._polyline.getDistance();
      this._lastClickedPositions.push(coord);
    } else {
      this._guideline.setPath([e.coord]);
      this._polyline.getPath().push(coord);
      var distance = this._polyline.getDistance();
      this._lastDistance = distance;
      this._lastClickedPositions.push(coord);
    }
  },

  _onClickArea: function (e) {
    var map = this.map, coord = e.coord;
    if (!this._polygon) {
      this._guideline = new naver.maps.Polyline({
        strokeColor: '#00f',
        strokeWeight: 3.33,
        strokeStyle: [4, 4],
        strokeOpacity: 0.6,
        path: [coord],
        map: map
      });
      $(document).on('mousemove.measure', this._onMouseMoveArea.bind(this));
      this._areaListeners.push(naver.maps.Event.addListener(map, 'rightclick', this._finishMode.bind(this)));
      this._polygon = new naver.maps.Polygon({
        strokeColor: '#00f',
        strokeWeight: 3.33,
        strokeOpacity: 0.8,
        fillColor: '#00f',
        fillOpacity: 0.3,
        paths: [coord],
        map: map
      });
      this._lastArea = this._polygon.getAreaSize();
      this._lastClickedPositions.push(coord);
    } else {
      this._guideline.setPath([e.coord]);
      this._polygon.getPath().push(coord);
      var area = this._polygon.getAreaSize();
      this._lastArea = area;
      this._lastClickedPositions.push(coord);
    }
  },

  _onClickMarker: function (e) {
    var map = this.map, coord = e.coord;
    var text = '클릭하여 수정';
    var ms = this._addMilestone(coord, text, {
      'font-size': '12px',
      'font-weight': 'bold',
      'color': '#f00',
      'background-color': '#fff',
      'border': '1px solid #000'
    }, {});
    this._shapes.push({ marker: ms });
    saveMarkerToLocalStorage(ms);

    this._finishMode(); // 마커가 생성되면 모드를 종료
  },

  _onMouseMoveDistance: function (e) {
    var map = this.map,
      proj = this.map.getProjection(),
      coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY)),
      path = this._guideline.getPath();
    if (path.getLength() === 2) {
      path.pop();
    }
    path.push(coord);
  },

  _onMouseMoveArea: function (e) {
    var map = this.map,
      proj = this.map.getProjection(),
      coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY)),
      path = this._guideline.getPath();
    if (path.getLength() === 2) {
      path.pop();
    }
    path.push(coord);
  },

  _bindMap: function (map) { },

  _unbindMap: function () {
    this.unbindAll();
  },

  _bindDOMEvents: function () {
    this.$btnDistance.on('click.measure', this._onClickButton.bind(this, 'distance'));
    this.$btnArea.on('click.measure', this._onClickButton.bind(this, 'area'));
    this.$btnMarker.on('click.measure', this._onClickButton.bind(this, 'marker'));
  },

  _bindGlobalEvents: function () {
    $(document).on('keydown.measure', function (e) {
      if (e.key === 'Backspace' && this._mode) {
        this._revertToPreviousClick();
      } else if (e.key === 'Escape' && this._mode) {
        this._finishMode();
      }
    }.bind(this));
    $(document).on('contextmenu.measure', function (e) {
      if (this._mode && !this._polyline && !this._polygon) {
        e.preventDefault();
        this.cancelMode();
      }
    }.bind(this));
  },

  _onClickButton: function (newMode, e) {
    e.preventDefault();
    var btn = $(e.target), map = this.map, mode = this._mode;
    if (btn.hasClass('control-on')) {
      btn.removeClass('control-on');
    } else {
      btn.addClass('control-on');
    }
    this._clearMode(mode);
    if (mode === newMode) {
      this._mode = null;
      return;
    }
    this._mode = newMode;
    this.startMode(newMode);
  },

  _clearMode: function (mode) {
    if (!mode) return;
    if (mode === 'distance') {
      if (this._polyline) {
        this._polyline.setMap(null);
        delete this._polyline;
      }
      this._finishDistance();
    } else if (mode === 'area') {
      if (this._polygon) {
        this._polygon.setMap(null);
        delete this._polygon;
      }
      this._finishArea();
    } else if (mode === 'marker') {
      this._finishMarker();
    }
  },

  _clearButtonStyles: function () {
    this.$btnDistance.removeClass('control-on active').blur();
    this.$btnArea.removeClass('control-on active').blur();
    this.$btnMarker.removeClass('control-on active').blur();
    this.$btnDistance.css('background-color', '');
    this.$btnDistance.css('color', '');
    this.$btnArea.css('background-color', '');
    this.$btnArea.css('color', '');
    this.$btnMarker.css('background-color', '');
    this.$btnMarker.css('color', '');

    var distanceBtn = document.querySelector('.map_measure_distance .map_btn');
    var areaBtn = document.querySelector('.map_measure_area .map_btn');
    var markerBtn = document.querySelector('.map_add_marker .map_btn');
    distanceBtn.style.backgroundColor = '';
    distanceBtn.style.color = '';
    areaBtn.style.backgroundColor = '';
    areaBtn.style.color = '';
    markerBtn.style.backgroundColor = '';
    markerBtn.style.color = '';
  },

  addMarkerMode: function () {
    this.startMode('marker');
  },

  cancelMarkerMode: function () {
    if (this._markerListeners) {
      this._markerListeners.forEach(listener => naver.maps.Event.removeListener(listener));
      delete this._markerListeners;
    }
    this._clearButtonStyles();
    this._mode = null;
    this.map.setCursor('auto');
  },

  _revertToPreviousClick: function () {
    if (this._lastClickedPositions.length <= 1) {
      return;
    }
    var previousCoord = this._lastClickedPositions.pop();
    if (this._mode === 'distance' && this._polyline) {
      var path = this._polyline.getPath();
      path.pop();
      if (path.getLength() > 0) {
        var newLastCoord = path.getAt(path.getLength() - 1);
        this._guideline.setPath([newLastCoord]);
      } else {
        this._guideline.setPath([]);
      }
    } else if (this._mode === 'area' && this._polygon) {
      var path = this._polygon.getPath();
      path.pop();
      if (path.getLength() > 0) {
        var newLastCoord = path.getAt(path.getLength() - 1);
        this._guideline.setPath([newLastCoord]);
      } else {
        this._guideline.setPath([]);
      }
    }
  },

  _updatePathElements: function () {
    pathElements.forEach(function (pathElement) {
      if (pathElement._colorChangeListener) {
        pathElement.removeEventListener('click', pathElement._colorChangeListener);
      }
    });

    pathElements = Array.from(document.querySelectorAll('path')).filter(pathElement => {
      const fillColor = window.getComputedStyle(pathElement).fill;
      return fillColor !== 'rgb(75, 234, 236)';
    });

    pathElements.forEach(function (pathElement) {
      pathElement.style.pointerEvents = 'visiblePainted';
      pathElement._colorChangeListener = function (event) {
        event.stopPropagation();
        const fillColor = window.getComputedStyle(pathElement).fill;
        //console.log("measure._mode : "+measure._mode)
        if (measure._mode === 'marker') {
          const coord = map.getProjection().fromPageXYToCoord(new naver.maps.Point(event.pageX, event.pageY));
          measure._onClickMarker({ coord: coord });
        } else if (measure._mode === 'distance') {
          //console.log("1225");
          //e.stopPropagation(); // 이벤트 전파 중단하여 폴리곤에서의 기본 동작을 막음

          // 클릭 좌표를 가져와 거리재기 모드의 클릭 이벤트를 직접 실행
          const coord = map.getProjection().fromPageXYToCoord(new naver.maps.Point(event.pageX, event.pageY));
         // console.log("e.coord : "+e.coord)
          measure._onClickDistance({ coord: coord }); // 거리재기 모드의 클릭 이벤트 호출
        } else if (fillColor !== 'none' && fillColor !== 'rgba(0, 0, 0, 0)') {
          colorChange(pathElement, event);
        }
      };
      pathElement.addEventListener('click', pathElement._colorChangeListener);
    });

    //console.log('Updated path elements:', pathElements);
  }
});

// CSS 스타일 추가
const style = document.createElement('style');
style.innerHTML = `
    .custom-modal textarea::selection {
        background: #b3d4fc;
        color: #000000;
    }
`;
document.head.appendChild(style);

let colorInput;
let colorDiv;
let pathElements = [];

window.addEventListener('load', function () {
  initColorPanel();

  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    ensureMeasureInitialized(); // Ensure measure is initialized before using it
    measure._updatePathElements();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      ensureMeasureInitialized(); // Ensure measure is initialized before using it
      measure._updatePathElements();
    }
  });

  ensureMeasureInitialized(); // Ensure measure is initialized before using it

  loadShapesFromLocalStorage();
  measure._updatePathElements();
});

function colorChange(pathElement, event) {
  // 현재 모드가 'distance'일 때는 색상창을 표시하지 않음
  if (measure._mode === 'distance') {
    return; // 아무 동작도 하지 않음
  }
  showPanel(pathElement, event);
}


function rgbToHex(rgb) {
  const rgbArray = rgb.match(/\d+/g);
  const hex = "#" + ((1 << 24) + (parseInt(rgbArray[0]) << 16) + (parseInt(rgbArray[1]) << 8) + parseInt(rgbArray[2])).toString(16).slice(1);
  return hex;
}

function closeDiv() {
  if (colorInput) {
    colorInput.style.display = 'none';
  }
  if (colorDiv) {
    colorDiv.style.display = 'none';
  }
}

function showPanel(pathElement, event) {
  //console.log("showPanel 호출")

  if (measure && (measure._mode === 'marker' || measure._mode === 'area')) {
    console.log("마커 모드 또는 면적재기 모드에서는 색상창을 표시하지 않습니다.");
    return; // 해당 모드일 때는 아무 동작도 하지 않음
  }

  colorInput.style.left = `${event.clientX}px`;
  colorInput.style.top = `${event.clientY}px`;
  colorInput.style.display = 'block';
  colorDiv.style.left = `${event.clientX}px`;
  colorDiv.style.top = `${event.clientY + 30}px`;
  colorDiv.style.display = 'block';
  colorInput.value = "";

  document.querySelectorAll('.small-square').forEach(function (square) {
    square.removeEventListener('click', square._clickHandler);
    square._clickHandler = function (event) {
      smallSquareClickHandler(event, pathElement);
    };
    square.addEventListener('click', square._clickHandler);
  });

  colorInput.removeEventListener('input', colorInput._inputHandler);
  colorInput._inputHandler = function (event) {
    colorInputHandler(event, pathElement);
  };
  colorInput.addEventListener('input', colorInput._inputHandler);
}
function smallSquareClickHandler(event, pathElement) {
  const backgroundColor = rgbToHex(event.target.style.backgroundColor);
  pathElement.style.fill = backgroundColor;
  pathElement.style.stroke = backgroundColor;
  pathElement.style.fillOpacity = "0.3";

  // 클릭한 폴리곤을 로컬스토리지에서 찾아 색상을 업데이트
  //if (pathElement.tagName === 'POLYGON') {
  //  updatePolygonColorFromLocalStorage(pathElement, backgroundColor);
  //}

  closeDiv();
}

function colorInputHandler(event, pathElement) {
  const enteredColor = event.target.value;
  pathElement.style.fill = enteredColor;
  pathElement.style.stroke = enteredColor;
  pathElement.style.fillOpacity = "0.3";

  // 클릭한 폴리곤을 로컬스토리지에서 찾아 색상을 업데이트

}



function initColorPanel() {
  colorInput = document.createElement('input');
  colorInput.type = 'text';
  colorInput.className = 'color-input';
  colorInput.style.position = 'absolute';
  colorInput.style.display = 'none';
  colorInput.style.border = '1px solid black';
  colorInput.placeholder = '색상값 입력 #000000';
  document.body.appendChild(colorInput);

  colorDiv = document.createElement('div');
  colorDiv.className = 'color-div';
  colorDiv.style.position = 'absolute';
  colorDiv.style.display = 'none';
  document.body.appendChild(colorDiv);

  const colors = ['#000000', '#454648', '#474C4F', '#FF0000', '#FF6600', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#000099', '#7030A0', '#CC3399', '#FF66CC'];

  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 7; k++) {
      const smallSquare = document.createElement('div');
      smallSquare.className = 'small-square';
      smallSquare.style.width = '70px';
      smallSquare.style.height = '70px';
      smallSquare.style.backgroundColor = colors[j * 7 + k];
      smallSquare.style.float = 'left';
      smallSquare.style.border = '2px solid black';
      smallSquare.style.boxSizing = 'border-box';
      colorDiv.appendChild(smallSquare);
    }
    const breakLine = document.createElement('br');
    colorDiv.appendChild(breakLine);
  }
}

document.addEventListener('click', function (event) {
  const colorInput = document.querySelector('.color-input');
  const colorDiv = document.querySelector('.color-div');
  if (colorInput && colorDiv) {
    const inputRect = colorInput.getBoundingClientRect();
    const divRect = colorDiv.getBoundingClientRect();

    if (!event.target.closest('path') &&
      !(event.clientX >= inputRect.left && event.clientX <= inputRect.right && event.clientY >= inputRect.top && event.clientY <= inputRect.bottom) &&
      !(event.clientX >= divRect.left && event.clientX <= divRect.right)) {
      closeDiv();
    }
  }
}, true);
