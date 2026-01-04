// ==UserScript==
// @name         下書きくん。v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  きっとスマホでもＩＰＡＤでも使える。
// @author       虚言癖とAI
// @match        https://pictsense.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536568/%E4%B8%8B%E6%9B%B8%E3%81%8D%E3%81%8F%E3%82%93%E3%80%82v30.user.js
// @updateURL https://update.greasyfork.org/scripts/536568/%E4%B8%8B%E6%9B%B8%E3%81%8D%E3%81%8F%E3%82%93%E3%80%82v30.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.top !== window.self) return;

  setTimeout(() => {
    if (document.getElementById("myOverlay") || document.getElementById("overlayUI")) return; // 二重起動を防止してるらしい

    // キャンバスを作ってる.レイヤー的な
    const overlay = document.createElement("canvas");
    overlay.id = "myOverlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "9999",
      backgroundColor: "transparent",
      pointerEvents: "none",
      cursor: "crosshair",
    });
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    document.body.appendChild(overlay);

    const ctx = overlay.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 初期値だよ
    let isDrawing = false;
    let lastX = 0, lastY = 0;
    let isErasing = false;
    let isOverlayActive = false;
    let isFaded = false;
    let currentColor = "#000000";
    let brushSize = 1;

    function updateStrokeStyle() {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = isErasing ? "#000000" : currentColor;
    }

    function scalePos(x, y) {
      // ズーム倍率を考慮
      const scale = window.visualViewport ? window.visualViewport.scale : 1;
      return {
        x: x * scale,
        y: y * scale,
      };
    }

    function startDrawing(x, y) {
      // よくわからん
      const scaled = scalePos(x, y);
      isDrawing = true;
      [lastX, lastY] = [scaled.x, scaled.y];
    }

    function drawLine(x, y) {
      if (!isDrawing) return;
      const scaled = scalePos(x, y);

      if (isErasing) {
        // 消しゴムは透明で塗る.四角だったけどマルにしてみた
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(scaled.x, scaled.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // こっちが普通のペン.何気にだるい
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(scaled.x, scaled.y);
        ctx.stroke();
      }
      [lastX, lastY] = [scaled.x, scaled.y];
    }

    function stopDrawing() {
      isDrawing = false;
    }


    overlay.addEventListener("mousedown", e => {
      if (!isOverlayActive) return;
      startDrawing(e.clientX, e.clientY);
    });
    overlay.addEventListener("mousemove", e => {
      if (!isOverlayActive) return;
      drawLine(e.clientX, e.clientY);
    });
    overlay.addEventListener("mouseup", stopDrawing);
    overlay.addEventListener("mouseout", stopDrawing);

    // タッチで動くほうです.二本指以上で触ると動かなくしますよ
    overlay.addEventListener("touchstart", e => {
      if (!isOverlayActive || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      startDrawing(touch.clientX, touch.clientY);
    }, { passive: false });

    overlay.addEventListener("touchmove", e => {
      if (!isOverlayActive || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      drawLine(touch.clientX, touch.clientY);
    }, { passive: false });

    overlay.addEventListener("touchend", stopDrawing, { passive: false });
    overlay.addEventListener("touchcancel", stopDrawing, { passive: false });

    // ウィンドウのサイズが変わった時.描いてたものを残すための処理だよ.あってんのかな
    window.addEventListener("resize", () => {
      const imageData = ctx.getImageData(0, 0, overlay.width, overlay.height);
      overlay.width = window.innerWidth;
      overlay.height = window.innerHeight;
      ctx.putImageData(imageData, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      updateStrokeStyle();
    });

    // UIを作ってるよ.
    const picker = document.createElement("div");
    picker.id = "overlayUI";
    Object.assign(picker.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      left: "auto",
      zIndex: "10000",
      backgroundColor: "#222",
      padding: "12px",
      borderRadius: "8px",
      color: "#fff",
      fontFamily: "Arial,sans-serif",
      userSelect: "none",
      boxShadow: "0 0 10px #000",
      width: "170px",
      touchAction: "none" // Safariでは効かないかもしれないけど、Chromeではスクロール防止になるよ.
    });
    picker.innerHTML = `
      <div id="dragHandle" style="font-weight:bold; margin-bottom:8px; cursor: grab;">↓色変更↓</div>
      <input type="color" id="colorInput" value="#000000" style="width: 100%; height: 40px; border-radius: 5px; border:none; margin-bottom:10px;" />
      <button id="eraserBtn" style="width: 100%; margin-bottom: 8px; background: #3b5998; color: #fff;">消しゴム OFF</button>
      <button id="overlayBtn" style="width: 100%; margin-bottom: 8px; background: #4a6fa5; color: #fff;">下書き操作 OFF</button>
      <label id="sizeLabel" style="display:block; margin-top:8px; text-align:center;">サイズ: 1</label>
      <input type="range" id="sizeSlider" min="1" max="50" value="1" style="width: 100%; margin-top:4px;" />
      <button id="fadeBtn" style="margin-top: 8px; width: 100%; background: #5b8fc9; color: #fff;">線を薄く表示</button>
      <button id="clearBtn" style="margin-top: 8px; width: 100%; background:#cc4444; color: #fff;">全消し</button>
    `;
    document.body.appendChild(picker);

    // UIの機能とか
    const $ = id => document.getElementById(id);
    $("colorInput").oninput = e => {
      currentColor = e.target.value;
      if (!isErasing) updateStrokeStyle();
    };
    $("eraserBtn").onclick = () => {
      isErasing = !isErasing;
      $("eraserBtn").textContent = isErasing ? "消しゴム ON" : "消しゴム OFF";
      updateStrokeStyle();
    };
    $("overlayBtn").onclick = () => {
      isOverlayActive = !isOverlayActive;
      overlay.style.pointerEvents = isOverlayActive ? "auto" : "none";
      $("overlayBtn").textContent = isOverlayActive ? "下書き操作 ON" : "下書き操作 OFF";
    };
    $("sizeSlider").oninput = e => {
      brushSize = +e.target.value;
      $("sizeLabel").textContent = `サイズ: ${brushSize}`;
      updateStrokeStyle();
    };
    $("fadeBtn").onclick = () => {
      isFaded = !isFaded;
      overlay.style.opacity = isFaded ? "0.2" : "1.0";
      $("fadeBtn").textContent = isFaded ? "線を元に戻す" : "線を薄く表示";
    };
    $("clearBtn").onclick = () => {
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    };

    // UIパネルをドラッグ移動できるようにしてるよ.たぶん
    const dragHandle = $("dragHandle");
    let dragging = false, dragOffsetX = 0, dragOffsetY = 0;

    const startDrag = e => {
      const point = e.touches ? e.touches[0] : e;
      dragging = true;
      const rect = picker.getBoundingClientRect();
      dragOffsetX = point.clientX - rect.left;
      dragOffsetY = point.clientY - rect.top;
      picker.style.cursor = "grabbing";
      document.body.style.overflow = "hidden";//これがあるとサファリでもいいらしいAIに聞いた.
    };
    const onDrag = e => {
      if (!dragging) return;
      const point = e.touches ? e.touches[0] : e;
      picker.style.left = `${point.clientX - dragOffsetX}px`;
      picker.style.bottom = "auto";
      picker.style.top = `${point.clientY - dragOffsetY}px`;
    };
    const endDrag = () => {
      dragging = false;
      picker.style.cursor = "grab";
      document.body.style.overflow = "";
    };

    // マウスとタッチ両方でドラッグできるようにしてるよ.偉いね
    dragHandle.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);

    dragHandle.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("touchend", endDrag, { passive: false });
  }, 1000);
})();
