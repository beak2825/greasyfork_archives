// ==UserScript==
// @name         破解同济统一验证选字验证码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  暴力破解同济统一验证选字验证码
// @license      MIT
// @author       You
// @match        https://ids.tongji.edu.cn:8443/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/density-clustering@1.3.0/lib/DBSCAN.js
// @downloadURL https://update.greasyfork.org/scripts/475023/%E7%A0%B4%E8%A7%A3%E5%90%8C%E6%B5%8E%E7%BB%9F%E4%B8%80%E9%AA%8C%E8%AF%81%E9%80%89%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/475023/%E7%A0%B4%E8%A7%A3%E5%90%8C%E6%B5%8E%E7%BB%9F%E4%B8%80%E9%AA%8C%E8%AF%81%E9%80%89%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

const img = document.getElementsByClassName("back-img")[0];

const main = () => {
  ("use strict");
  // const canvas = document.createElement('canvas');
  if (img.getAttribute("src") == "") {
    return;
  }
  window.img = img;
  let canvas = document.getElementById("canvas-display");
  if (!canvas) {
    img.parentElement.parentElement.insertAdjacentHTML(
      "afterend",
      '<canvas id="canvas-display"></canvas>'
    );
    // img.parentElement.parentElement.height == '405px';
    canvas = document.getElementById("canvas-display");
  }
  const context = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  console.assert(
    img.naturalWidth == 310 && img.naturalHeight == 155,
    "Image shape must be 310x155"
  );
  context.drawImage(img, 0, 0);
  const image_data = context.getImageData(
    0,
    0,
    img.naturalWidth,
    img.naturalHeight
  );
  const data = image_data.data;
  window.data = data;

  const points = Array();
  for (let y = 0; y < 155; y++) {
    for (let x = 0; x < 310; x++) {
      const index = 4 * (y * 310 + x);
      const color = data.slice(index, index + 3);
      if (color.every((c) => c == 0)) {
        points.push(Array(x, y));
        data[index] = 100;
      } else {
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
      }
    }
  }

  console.log(points);
  context.putImageData(image_data, 0, 0);

  const dbscan = new DBSCAN();
  const clusters = dbscan.run(points, 10, 10);
  console.log(clusters);
  console.assert(clusters.length == 4, "Must be 4 characters");

  const centers = Array();
  for (let c of clusters) {
    let sum_x = 0,
      sum_y = 0;
    for (let i of c) {
      const p = points.at(i);
      const x = p[0],
        y = p[1];
      sum_x += x;
      sum_y += y;
    }
    centers.push(Array(sum_x / c.length, sum_y / c.length));
    console.log(sum_x / c.length, sum_y / c.length);
  }

  centers.sort((a, b) => a[0] > b[0]);
  window.centers = centers;
  // TODO: choose other characters
  for (let c of [-3, -2, -1]) {
    const [x, y] = centers.at(c);
    const evt = new MouseEvent("click", {
      clientX:
        (img.width / img.naturalWidth) * x +
        ($(img).offset().left - $(window).scrollLeft()),
      clientY:
        (img.height / img.naturalHeight) * y +
        ($(img).offset().top - $(window).scrollTop()),
    });
    img.dispatchEvent(evt);
  }
  // img.addEventListener("load", main);
};

if (img.complete) {
  main();
}
img.addEventListener("load", main);
const submit_button = document.getElementById("reg");
submit_button.addEventListener("click", main);
submit_button.dispatchEvent(MouseEvent("click"));

// document
//   .getElementsByClassName("icon-refresh")[0]
//   .addEventListener("click", main);
