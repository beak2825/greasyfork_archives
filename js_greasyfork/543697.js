// ==UserScript==
// @name         labels panel
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  labels panel from catliife
// @author       me
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543697/labels%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/543697/labels%20panel.meta.js
// ==/UserScript==

// Создаем контейнер для интерфейса
var mapUI = document.createElement('div');
mapUI.style.position = 'fixed';
mapUI.style.top = '10px';
mapUI.style.right = '80px';
mapUI.style.zIndex = '9999';
mapUI.style.background = 'rgba(0,0,0,0.7)';
mapUI.style.padding = '10px';
mapUI.style.borderRadius = '5px';
mapUI.style.color = 'white';
mapUI.style.fontFamily = 'Arial';
mapUI.style.width = '300px';
mapUI.style.display = 'none';

// Кнопка для показа/скрытия панели
var toggleBtn = document.createElement('button');
toggleBtn.textContent = 'Метки';
toggleBtn.style.position = 'fixed';
toggleBtn.style.top = '10px';
toggleBtn.style.right = '80px';
toggleBtn.style.zIndex = '9998';
toggleBtn.style.padding = '5px 10px';
toggleBtn.style.background = '#3498db';
toggleBtn.style.border = 'none';
toggleBtn.style.borderRadius = '3px';
toggleBtn.style.cursor = 'pointer';

toggleBtn.onclick = function() {
  mapUI.style.display = mapUI.style.display === 'none' ? 'block' : 'none';
};

document.body.appendChild(toggleBtn);

// Заголовок и кнопка закрытия
var header = document.createElement('div');
header.style.display = 'flex';
header.style.justifyContent = 'space-between';
header.style.alignItems = 'center';
header.style.marginBottom = '15px';

var title = document.createElement('h3');
title.textContent = 'Панель меток';
title.style.margin = '0';

var closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.style.background = 'transparent';
closeBtn.style.border = 'none';
closeBtn.style.color = 'white';
closeBtn.style.fontSize = '20px';
closeBtn.style.cursor = 'pointer';
closeBtn.style.padding = '0 5px';

closeBtn.onclick = function() {
  mapUI.style.display = 'none';
};

header.appendChild(title);
header.appendChild(closeBtn);
mapUI.appendChild(header);

// Секция для ввода названия
var nameSection = document.createElement('div');
nameSection.style.marginBottom = '10px';

var nameLabel = document.createElement('label');
nameLabel.textContent = 'Название локации:';
nameLabel.style.display = 'block';
nameLabel.style.marginBottom = '5px';

var nameInput = document.createElement('input');
nameInput.type = 'text';
nameInput.id = 'wcNameInput';
nameInput.placeholder = 'Введите название';
nameInput.style.width = '100%';
nameInput.style.padding = '5px';

nameSection.appendChild(nameLabel);
nameSection.appendChild(nameInput);
mapUI.appendChild(nameSection);

// Секция для ввода локации
var locSection = document.createElement('div');
locSection.style.marginBottom = '15px';

var locLabel = document.createElement('label');
locLabel.textContent = 'ID локации:';
locLabel.style.display = 'block';
locLabel.style.marginBottom = '5px';

var locInput = document.createElement('input');
locInput.type = 'text';
locInput.id = 'wcLocationInput';
locInput.placeholder = 'Введите ID';
locInput.style.width = '100%';
locInput.style.padding = '5px';

locSection.appendChild(locLabel);
locSection.appendChild(locInput);
mapUI.appendChild(locSection);

// Кнопки для меток
var btnContainer = document.createElement('div');
btnContainer.style.display = 'flex';
btnContainer.style.flexWrap = 'wrap';
btnContainer.style.gap = '5px';
btnContainer.style.marginBottom = '10px';

var btnResource = createButton('Ресурсы', '#2ecc71');
var btnDanger = createButton('Опасность', '#e74c3c');
var btnCustom = createButton('Своя метка', '#9b59b6');
var btnDelete = createButton('Удалить', '#e74c3c');

btnContainer.appendChild(btnResource);
btnContainer.appendChild(btnDanger);
btnContainer.appendChild(btnCustom);
btnContainer.appendChild(btnDelete);
mapUI.appendChild(btnContainer);// Кнопка для просмотра всех меток
var btnShowAll = createButton('Все метки', '#f39c12');
btnShowAll.style.marginTop = '10px';
mapUI.appendChild(btnShowAll);

// Блок для отображения информации
var infoDiv = document.createElement('div');
infoDiv.id = 'wcMarkerInfo';
infoDiv.style.marginTop = '15px';
infoDiv.style.padding = '10px';
infoDiv.style.background = 'rgba(255,255,255,0.1)';
infoDiv.style.borderRadius = '5px';
mapUI.appendChild(infoDiv);// Добавляем контейнер в документ
document.body.appendChild(mapUI);

// Функция создания кнопки
function createButton(text, color) {
  var btn = document.createElement('button');
  btn.textContent = text;
  btn.style.background = color;
  btn.style.border = 'none';
  btn.style.padding = '5px 10px';
  btn.style.borderRadius = '3px';
  btn.style.cursor = 'pointer';
  btn.style.flex = '1 1 auto';
  return btn;
}

// Загружаем сохраненные метки
var savedMarkers = loadMarkers();

// Функция загрузки меток
function loadMarkers() {
  try {
    var savedData = localStorage.getItem('wcMarkers');
    return savedData ? JSON.parse(savedData) : {};
  } catch (e) {
    console.error('Ошибка загрузки меток:', e);
    return {};
  }
}

// Функция сохранения меток
function saveMarkers() {
  try {
    localStorage.setItem('wcMarkers', JSON.stringify(savedMarkers));
    return true;
  } catch (e) {
    console.error('Ошибка сохранения меток:', e);
    return false;
  }
}

// Функция для добавления метки
function addMarker(type, color) {
  var locId = document.getElementById('wcLocationInput').value.trim();
  var name = document.getElementById('wcNameInput').value.trim();

  if (!locId) return alert('Введите ID локации!');
  if (!name) return alert('Введите название локации!');

  var details = prompt('Описание для метки "' + type + '":', type);
  if (details === null) return;

  if (type === 'Своя метка') {
    color = prompt('Цвет метки (HEX, например #ff0000):', color);
    if (color === null) return;
  }

  savedMarkers[locId] = {
    type: type,
    color: color,
    name: name,
    text: details,
    date: new Date().toLocaleString()
  };

  if (!saveMarkers()) {
    return alert('Ошибка сохранения! Возможно, закончилось место.');
  }

  alert('✅ Метка добавлена на локацию ' + locId + '!');
}

// Функция для удаления метки
function deleteMarker() {
  var locId = document.getElementById('wcLocationInput').value.trim();
  if (!locId) return alert('Введите ID локации!');

  if (!savedMarkers[locId]) return alert('Метка не найдена!');

  if (confirm('Удалить метку для локации ' + locId + '?')) {
    delete savedMarkers[locId];
    if (saveMarkers()) {
      alert('Метка удалена!');
    } else {
      alert('Ошибка при удалении!');
    }
  }
}

// Обработчики для кнопок
btnResource.onclick = function() { addMarker('Ресурсы', '#2ecc71'); };
btnDanger.onclick = function() { addMarker('Опасность', '#e74c3c'); };
btnCustom.onclick = function() { addMarker('Своя метка', '#9b59b6'); };
btnDelete.onclick = deleteMarker;

// Функция для показа всех меток
btnShowAll.onclick = showAllMarkers;

// Переменная для хранения текущего окна меток
var currentMarkersWindow = null;

function showAllMarkers() {
  // Закрываем предыдущее окно, если оно есть
  if (currentMarkersWindow) {
    document.body.removeChild(currentMarkersWindow);
  }

  currentMarkersWindow = document.createElement('div');
  currentMarkersWindow.style.position = 'fixed';
  currentMarkersWindow.style.top = '50%';
  currentMarkersWindow.style.left = '50%';
  currentMarkersWindow.style.transform = 'translate(-50%, -50%)';
  currentMarkersWindow.style.background = 'rgba(0,0,0,0.9)';
  currentMarkersWindow.style.padding = '20px';
  currentMarkersWindow.style.borderRadius = '5px';
  currentMarkersWindow.style.zIndex = '10000';
  currentMarkersWindow.style.width = '80%';
  currentMarkersWindow.style.maxWidth = '600px';
  currentMarkersWindow.style.maxHeight = '80vh';
  currentMarkersWindow.style.overflow = 'hidden';
  currentMarkersWindow.style.color = 'white';
  currentMarkersWindow.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';// Заголовок
  var header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';header.style.marginBottom = '15px';

  var title = document.createElement('h3');
  title.textContent = 'Все метки (' + Object.keys(savedMarkers).length + ')';
  title.style.margin = '0';

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.padding = '0 5px';

  closeBtn.onclick = function() {
    document.body.removeChild(currentMarkersWindow);
    currentMarkersWindow = null;
  };

  header.appendChild(title);
  header.appendChild(closeBtn);
  currentMarkersWindow.appendChild(header);

  // Контейнер для списка меток
  var markersContainer = document.createElement('div');
  markersContainer.style.maxHeight = 'calc(80vh - 100px)';
  markersContainer.style.overflowY = 'auto';
  markersContainer.style.paddingRight = '10px';

  // Добавляем прокрутку колесиком мыши
  markersContainer.addEventListener('wheel', function(e) {
    this.scrollTop += e.deltaY;
  });

  if (Object.keys(savedMarkers).length === 0) {
    var emptyMsg = document.createElement('div');
    emptyMsg.textContent = 'Нет сохраненных меток';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '20px';
    emptyMsg.style.color = '#aaa';
    markersContainer.appendChild(emptyMsg);
  } else {
    // Сортируем метки по дате (новые сверху)
    var sortedMarkers = Object.entries(savedMarkers).sort((a, b) => {
      return new Date(b[1].date) - new Date(a[1].date);
    });

    sortedMarkers.forEach(([locId, marker]) => {
      var markerElement = createMarkerElement(locId, marker);
      markersContainer.appendChild(markerElement);
    });
  }

  currentMarkersWindow.appendChild(markersContainer);
  document.body.appendChild(currentMarkersWindow);
}

// Функция создания элемента метки
function createMarkerElement(locId, marker) {
  var markerDiv = document.createElement('div');
  markerDiv.style.marginBottom = '15px';
  markerDiv.style.padding = '10px';
  markerDiv.style.background = 'rgba(255,255,255,0.1)';
  markerDiv.style.borderRadius = '5px';
  markerDiv.style.borderLeft = '4px solid ' + marker.color;
  markerDiv.style.position = 'relative';

  var locSpan = document.createElement('div');
  locSpan.textContent = 'ID: ' + locId;
  locSpan.style.fontWeight = 'bold';

  var nameSpan = document.createElement('div');
  nameSpan.textContent = 'Название: ' + marker.name;
  nameSpan.style.marginTop = '5px';

  var typeSpan = document.createElement('div');
  typeSpan.textContent = 'Тип: ' + marker.type;
  typeSpan.style.marginTop = '5px';

  var textSpan = document.createElement('div');
  textSpan.textContent = 'Описание: ' + marker.text;
  textSpan.style.marginTop = '5px';
  textSpan.style.fontStyle = 'italic';

  var dateSpan = document.createElement('div');
  dateSpan.textContent = 'Дата: ' + marker.date;
  dateSpan.style.marginTop = '5px';
  dateSpan.style.fontSize = '0.8em';
  dateSpan.style.color = '#ccc';

  // Кнопка удаления
  var deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.top = '10px';
  deleteBtn.style.right = '10px';
  deleteBtn.style.background = '#e74c3c';
  deleteBtn.style.border = 'none';
  deleteBtn.style.padding = '3px 8px';
  deleteBtn.style.borderRadius = '3px';
  deleteBtn.style.cursor = 'pointer';

  deleteBtn.onclick = function() {
    if (confirm('Удалить метку для локации ' + locId + '?')) {
      delete savedMarkers[locId];
      if (saveMarkers()) {
        markerDiv.style.opacity = '0.5';
        markerDiv.style.transition = 'opacity 0.3s';
        setTimeout(function() {markerDiv.remove();
          updateMarkersCount();
        }, 300);
      }
    }
  };markerDiv.appendChild(locSpan);
  markerDiv.appendChild(nameSpan);
  markerDiv.appendChild(typeSpan);
  markerDiv.appendChild(textSpan);
  markerDiv.appendChild(dateSpan);
  markerDiv.appendChild(deleteBtn);

  return markerDiv;
}

// Обновление счетчика меток
function updateMarkersCount() {
  if (!currentMarkersWindow) return;

  var title = currentMarkersWindow.querySelector('h3');
  if (title) {
    title.textContent = 'Все метки (' + Object.keys(savedMarkers).length + ')';
  }
}