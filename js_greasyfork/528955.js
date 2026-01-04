// ==UserScript==
// @name        Googleマップ→Wazeエディター３（縮尺拡大・ドラッグ対応）
// @namespace   https://example.com/
// @version     2.9.4
// @description Googleマップの座標と縮尺を取得し、Wazeエディターでより拡大して表示。ボタンはドラッグで移動可能で位置を記憶。
// @match       https://www.google.com/maps/*
// @match       https://www.google.com/maps/place/*
// @match       https://maps.google.com/*
// @icon        https://pngimg.com/uploads/waze/waze_PNG21.png
// @author      碧いうさぎ
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/528955/Google%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%EF%BC%93%EF%BC%88%E7%B8%AE%E5%B0%BA%E6%8B%A1%E5%A4%A7%E3%83%BB%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E5%AF%BE%E5%BF%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528955/Google%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%EF%BC%93%EF%BC%88%E7%B8%AE%E5%B0%BA%E6%8B%A1%E5%A4%A7%E3%83%BB%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E5%AF%BE%E5%BF%9C%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Google Mapsの縮尺（メートル）またはズームレベルをWazeのズームレベルに変換（拡大）
  function convertZoom(googleZoom, isMeter = false) {
    let baseZoom;
    if (isMeter) {
      const meters = parseFloat(googleZoom);
      // メートルからWazeのzoomLevelへの変換
      if (meters <= 50) baseZoom = 19;
      else if (meters <= 100) baseZoom = 18;
      else if (meters <= 200) baseZoom = 17;
      else if (meters <= 500) baseZoom = 16;
      else if (meters <= 1000) baseZoom = 15;
      else if (meters <= 2000) baseZoom = 14;
      else if (meters <= 5000) baseZoom = 13;
      else if (meters <= 10000) baseZoom = 12;
      else if (meters <= 20000) baseZoom = 11;
      else if (meters <= 50000) baseZoom = 10;
      else baseZoom = 9;
    } else {
      // z単位の場合
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
    // Wazeで2段階拡大（最大19）
    return Math.min(baseZoom + 2, 19);
  }

  // URLから座標とズームレベルを抽出
  function extractCoordinatesAndZoom() {
    const url = window.location.href;
    console.log('現在のURL:', url); // デバッグ用
    const pinRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/; // ピンの場合
    const viewRegex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d*[mz])/; // ビュー（zまたはm）
    let lat, lon, zoom;

    const pinMatch = url.match(pinRegex);
    const viewMatch = url.match(viewRegex);

    console.log('pinMatch:', pinMatch); // デバッグ用
    console.log('viewMatch:', viewMatch); // デバッグ用

    if (pinMatch) {
      lat = pinMatch[1];
      lon = pinMatch[2];
      zoom = 19; // ピンのデフォルトズーム（最大詳細）
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

    console.log('抽出された座標:', { lat, lon, zoom }); // デバッグ用
    return { lat, lon, zoom };
  }

  // Wazeエディターを開く
  function openWazeEditor() {
    const coords = extractCoordinatesAndZoom();
    if (coords) {
      const wazeUrl = `https://waze.com/ja/editor?env=row&lat=${coords.lat}&lon=${coords.lon}&zoomLevel=${coords.zoom}`;
      console.log('Waze URL:', wazeUrl); // デバッグ用
      window.location.href = wazeUrl;
    }
  }

  // ボタンを作成（ドラッグバー付き）
  function createButton() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    container.style.cursor = 'move';

    // 保存された位置を復元
    const savedTop = localStorage.getItem('wazeButtonTop') || '10px';
    const savedLeft = localStorage.getItem('wazeButtonLeft') || '10px';
    container.style.top = savedTop;
    container.style.left = savedLeft;

    // ドラッグバーの作成
    const dragBar = document.createElement('div');
    dragBar.style.width = '5px';
    dragBar.style.height = '100%';
    dragBar.style.backgroundColor = '#ccc';
    dragBar.style.position = 'absolute';
    dragBar.style.left = '0';
    dragBar.style.top = '0';
    dragBar.style.cursor = 'move';

    // ボタンの作成
    const button = document.createElement('button');
    button.textContent = 'Wazeエディターを開く';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.marginLeft = '5px';

    button.onclick = () => {
      console.log('ボタンがクリックされました'); // デバッグ用
      openWazeEditor();
    };

    container.appendChild(dragBar);
    container.appendChild(button);
    document.body.appendChild(container);
    console.log('ボタンを作成しました'); // デバッグ用

    // ドラッグ機能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    dragBar.addEventListener('mousedown', (e) => {
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
      console.log('ドラッグ開始'); // デバッグ用
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
        console.log('ドラッグ終了、位置保存:', container.style.top, container.style.left); // デバッグ用
      }
    });

    currentX = parseInt(savedLeft, 10) || 10;
    currentY = parseInt(savedTop, 10) || 10;
  }

  // ページ読み込み後にボタンを作成
  window.addEventListener('load', function() {
    setTimeout(createButton, 2000); // 2秒待機
  });
})();