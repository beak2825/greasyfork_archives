// ==UserScript==
// @version      1.0
// @author       https://github.com/bababoyy
// @license      GPL-3.0
// ==/UserScript==
onmessage = function (v) {
  var args = v.data;
  var tasks = [];
  for (let yAxis = 0; yAxis < args.image.length; yAxis++) {
    for (let xAxis = 0; xAxis < args.image[yAxis].length; xAxis++) {
      let pixel = args.image[yAxis][xAxis];
      let [x, y] = args.coords;
      x += xAxis;
      y += yAxis;
      var color = pixel.charCodeAt(0) - "0".charCodeAt(0);
      if (color == 64) {
        continue;
      }
      tasks.push({
        x: x,
        y: y,
        color: color,
      });
    }
  }
  postMessage(tasks);
};