// ==UserScript==
// @name Google Maps and Waze Integration
// @namespace https://greasyfork.org/ja/scripts/538075-google-maps-and-waze-integration
// @version 3.0.0
// @description Select text to open in Google Maps, and from Google Maps, open Waze Editor or Live Map with enhanced zoom. Includes draggable buttons with position memory.
// @author 碧いうさぎ
// @match *://*/*
// @match https://www.google.com/maps/*
// @match https://www.google.com/maps/place/*
// @match https://maps.google.com/*
// @icon https://pngimg.com/uploads/waze/waze_PNG21.png
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/538075/Google%20Maps%20and%20Waze%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/538075/Google%20Maps%20and%20Waze%20Integration.meta.js
// ==/UserScript==

(function() {
 'use strict';

 // Google Mapsの縮尺（メートル）またはズームレベルをWazeのズームレベルに変換（拡大）
 function convertZoom(googleZoom, isMeter = false) {
 let baseZoom;
 if (isMeter) {
 const meters = parseFloat(googleZoom);
 if (meters <= 50) baseZoom = 19;
 else if (meters <= 100) baseZoom = 18;
 else if (meters <= 200) baseZoom = 17;
 else if (meters <= 500) baseZoom = 16;
 else if (meters <= 1000) baseZoom = 15;
 else if (meters <= 2000) baseZoom = 14;
 else if (meters <= 5000) baseZoom = 13;
 else if (meters <= 10000) baseZoom = 12;
 else if (meters <= 20000) baseZoom = 11;
 else baseZoom = 10;
 } else {
 const googleZoomLevel = parseFloat(googleZoom);
 if (googleZoomLevel >= 20) baseZoom = 19;
 else if (googleZoomLevel >= 18) baseZoom = 18;
 else if (googleZoomLevel >= 16) baseZoom = 17;
 else if (googleZoomLevel >= 14) baseZoom = 16;
 else if (googleZoomLevel >= 12) baseZoom = 15;
 else if (googleZoomLevel >= 10) baseZoom = 14;
 else if (googleZoomLevel >= 8) baseZoom = 13;
 else if (googleZoomLevel >= 6) baseZoom = 12;
 else if (googleZoomLevel >= 4) baseZoom = 11;
 else baseZoom = 10;
 }
 return Math.min(baseZoom + 2, 19);
 }

 // URLから座標とズームレベルを抽出
 function extractCoordinatesAndZoom() {
 const url = window.location.href;
 console.log('現在のURL:', url);
 const pinRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
 const viewRegex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d*[mz])/;
 let lat, lon, zoom;

 const pinMatch = url.match(pinRegex);
 const viewMatch = url.match(viewRegex);

 console.log('pinMatch:', pinMatch);
 console.log('viewMatch:', viewMatch);

 if (pinMatch) {
 lat = pinMatch[1];
 lon = pinMatch[2];
 zoom = 19;
 } else if (viewMatch) {
 lat = viewMatch[1];
 lon = viewMatch[2];
 const zoomValue = viewMatch[3];
 const isMeter = zoomValue.endsWith('m');
 zoom = convertZoom(zoomValue.replace(/[mz]/, ''), isMeter);
 } else {
 console.error('座標を抽出できませんでした:', url);
 alert('座標を抽出できませんでした。以下のURLを開発者に共有してください:\n' + url);
 return null;
 }

 console.log('抽出された座標:', { lat, lon, zoom });
 return { lat, lon, zoom };
 }

 // Wazeエディターを開く
 function openWazeEditor() {
 const coords = extractCoordinatesAndZoom();
 if (coords) {
 const wazeUrl = `https://waze.com/ja/editor?env=row&lat=${coords.lat}&lon=${coords.lon}&zoomLevel=${coords.zoom}`;
 console.log('WazeエディターURL:', wazeUrl);
 window.location.href = wazeUrl;
 }
 }

 // Wazeライブマップを開く
 function openWazeLiveMap() {
 const coords = extractCoordinatesAndZoom();
 if (coords) {
 const wazeUrl = `https://www.waze.com/ja/livemap?lat=${coords.lat}&lon=${coords.lon}&zoom=${coords.zoom}`;
 console.log('WazeライブマップURL:', wazeUrl);
 window.location.href = wazeUrl;
 }
 }

 // 選択したテキストをGoogleマップで開く
 function openInGoogleMaps() {
 let selectedText = window.getSelection().toString().trim();
 if (selectedText) {
 let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedText)}`;
 window.open(mapsUrl, '_blank');
 } else {
 alert('住所またはテキストを選択してください！');
 }
 }

 // ボタンを作成（ドラッグバー付き）
 function createWazeButtons() {
 const container = document.createElement('div');
 container.style.position = 'fixed';
 container.style.zIndex = '9999';
 container.style.cursor = 'move';

 const savedTop = localStorage.getItem('wazeButtonTop') || '10px';
 const savedLeft = localStorage.getItem('wazeButtonLeft') || '10px';
 container.style.top = savedTop;
 container.style.left = savedLeft;

 const dragBar = document.createElement('div');
 dragBar.style.width = '5px';
 dragBar.style.height = '100%';
 dragBar.style.backgroundColor = '#ccc';
 dragBar.style.position = 'absolute';
 dragBar.style.left = '0';
 dragBar.style.top = '0';
 dragBar.style.cursor = 'move';

 const editorButton = document.createElement('button');
 editorButton.textContent = 'Wazeエディターを開く';
 editorButton.style.padding = '5px 10px';
 editorButton.style.backgroundColor = '#007bff';
 editorButton.style.color = 'white';
 editorButton.style.border = 'none';
 editorButton.style.borderRadius = '5px';
 editorButton.style.marginLeft = '5px';
 editorButton.style.marginRight = '5px';
 editorButton.onclick = openWazeEditor;

 const liveMapButton = document.createElement('button');
 liveMapButton.textContent = 'Wazeライブマップを開く';
 liveMapButton.style.padding = '5px 10px';
 liveMapButton.style.backgroundColor = '#28a745';
 liveMapButton.style.color = 'white';
 liveMapButton.style.border = 'none';
 liveMapButton.style.borderRadius = '5px';
 liveMapButton.onclick = openWazeLiveMap;

 container.appendChild(dragBar);
 container.appendChild(editorButton);
 container.appendChild(liveMapButton);
 document.body.appendChild(container);
 console.log('Wazeボタンを作成しました');

 let isDragging = false;
 let currentX = parseInt(savedLeft, 10) || 10;
 let currentY = parseInt(savedTop, 10) || 10;
 let initialX, initialY;

 dragBar.addEventListener('mousedown', (e) => {
 initialX = e.clientX - currentX;
 initialY = e.clientY - currentY;
 isDragging = true;
 console.log('ドラッグ開始');
 });

 document.addEventListener('mousemove', (e) => {
 if (isDragging) { 
 e.preventDefault();
 currentX = e.clientX - initialX;
 currentY = e.clientY - initialY;
 container.style.left = `${currentX}px`;
 container.style.top = `${currentY}px`;
 }
 });

 document.addEventListener('mouseup', () => {
 if (isDragging) {
 isDragging = false;
 localStorage.setItem('wazeButtonTop', container.style.top);
 localStorage.setItem('wazeButtonLeft', container.style.left);
 console.log('ドラッグ終了、位置保存:', container.style.top, container.style.left);
 }
 });
 }

 // ページがGoogle Mapsかどうかを確認
 function isGoogleMapsPage() {
 const url = window.location.href;
 return (
 url.startsWith('https://www.google.com/maps') ||
 url.startsWith('https://maps.google.com')
 );
 }

 // 選択テキストをGoogleマップで開く（キーボードショートカット）
 document.addEventListener('keydown', function(event) {
 if (event.ctrlKey && event.key === 'm') {
 console.log('Ctrl + M が押されました');
 openInGoogleMaps();
 }
 });

 // 右クリックメニューでGoogleマップを開く
 document.addEventListener('contextmenu', function(event) {
 setTimeout(() => {
 let selectedText = window.getSelection().toString().trim();
 if (selectedText) {
 if (confirm(`"${selectedText}" をGoogleマップで開きますか？`)) {
 let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedText)}`;
 window.open(mapsUrl, '_blank');
 }
 }
 }, 100);
 });

 // ページ読み込み後にGoogle MapsページでのみWazeボタンを作成
 window.addEventListener('load', function() {
 if (isGoogleMapsPage()) {
 setTimeout(createWazeButtons, 2000);
 }
 });
})();