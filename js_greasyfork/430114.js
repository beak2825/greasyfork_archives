// ==UserScript==
// @name         Gather Town Capture
// @namespace    https://www.moontai0724.tw
// @version      0.2
// @description  Capture screen without UI on gather.town in just a press.
// @author       moontai0724
// @match        https://gather.town/*
// @icon         https://www.google.com/s2/favicons?domain=gather.town
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/430114/Gather%20Town%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/430114/Gather%20Town%20Capture.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const elementsId = [
    "canvas",
    "canvas-entities",
    "canvas-players",
    "canvas-foreground",
    "canvas-private-areas",
    "canvas-names",
  ];

  const settings = {
    scale: undefined,
    cellNumber: {
      height: undefined,
      width: undefined,
    },
  };

  const originalSize = {
    canvasHeight: undefined,
    canvasWidth: undefined,
    containerHeight: undefined,
    containerWidth: undefined,
  };

  function download(changeSize = false) {
    setVariables();
    if (changeSize) changeCanvasSize();
    const canvas = document.createElement("canvas");
    const { height, width } = document.getElementById("canvas");
    canvas.height = height;
    canvas.width = width;

    const sources = document.getElementsByTagName("canvas");
    setTimeout(
      () =>
        Promise.all(
          Array.from(sources).map((element) => {
            return new Promise(function (resolve, reject) {
              const image = new Image();
              image.src = element.toDataURL();
              image.addEventListener("load", (onImageLoadEvent) => {
                const imageData = onImageLoadEvent.target;
                const context = canvas.getContext("2d");
                context.drawImage(imageData, 0, 0);
                resolve();
              });
            });
          })
        ).then(() => {
          const link = document.createElement("a");
          link.download = `${document.title.slice(0, -9)} - ${getTime()}.png`;
          link.href = canvas.toDataURL();
          link.click();
          if (changeSize) recoverCanvasSize();
        }),
      1000
    );
  }

  function setVariables() {
    settings.scale = localStorage.manualCanvasZoom;
    settings.cellNumber.height = gameSpace.maps[gameSpace.mapId].dimensions[0];
    settings.cellNumber.width = gameSpace.maps[gameSpace.mapId].dimensions[1];
    const canvas = document.getElementById("canvas");
    originalSize.canvasHeight = canvas.height;
    originalSize.canvasWidth = canvas.width;
    originalSize.containerHeight = canvas.style.height;
    originalSize.containerWidth = canvas.style.width;
  }

  function getTime() {
    const time = new Date();
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const date = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    const millisecond = time.getMilliseconds();
    return `${year}-${month}-${date}_${hour}-${minute}-${second}.${millisecond}`;
  }

  function recoverCanvasSize() {
    elementsId.forEach((elementId) => {
      const element = document.getElementById(elementId);
      element.width = originalSize.canvasWidth;
      element.height = originalSize.canvasHeight;
      element.style.width = originalSize.containerWidth;
      element.style.height = originalSize.containerHeight;
    });
  }

  function changeCanvasSize() {
    elementsId.forEach((elementId) => {
      const element = document.getElementById(elementId);
      const height = settings.cellNumber.height * settings.scale * 32;
      const canvasRatio = element.width / element.height;
      element.width = height * canvasRatio;
      element.height = height;
      const containerRatio =
        parseInt(element.style.width) / parseInt(element.style.height);
      element.style.width = height * containerRatio;
      element.style.height = height;
    });
  }

  document.addEventListener("keydown", function (keydownEvent) {
    if (!keydownEvent.shiftKey) return;
    if (!(keydownEvent.code === "KeyF" || keydownEvent.code === "KeyP")) return;

    download(keydownEvent.code === "KeyF");
  });
})();
