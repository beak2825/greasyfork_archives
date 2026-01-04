// ==UserScript==
// @name         洛谷冬日绘板监测
// @namespace    https://github.com/Wallbreaker5th/
// @version      1.0
// @description  监测洛谷冬日绘板特定范围内的 token 数
// @author       破壁人五号
// @match        https://www.luogu.com.cn/paintboard
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437889/%E6%B4%9B%E8%B0%B7%E5%86%AC%E6%97%A5%E7%BB%98%E6%9D%BF%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437889/%E6%B4%9B%E8%B0%B7%E5%86%AC%E6%97%A5%E7%BB%98%E6%9D%BF%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==

class Queue {
  constructor(max_len) {
    this.q = Array(max_len + 1);
    this.head = 0;
    this.tail = 0;
    this.max_len = max_len + 1;
  }
  get front() {
    return this.q[this.head];
  }
  get back() {
    if (this.tail) return this.q[this.tail - 1];
    else return this.q[this.max_len - 1];
  }
  push(v) {
    this.q[this.tail] = v;
    this.tail++;
    if (this.tail >= this.max_len) this.tail = 0;
  }
  pop() {
    this.head++;
    if (this.head >= this.max_len) this.head = 0;
  }
  get size() {
    if (this.tail >= this.head) return this.tail - this.head;
    else return this.tail - this.head + this.max_len;
  }
}

(function () {
  "use strict";

  var waitTime = 30 * 1000;
  var x_min = 0;
  var x_max = 1000;
  var y_min = 0;
  var y_max = 600;
  var q = new Queue(10000);

  var container = document.createElement("div");
  var input_xmin = document.createElement("input");
  input_xmin.type = "number";
  input_xmin.value = x_min;
  input_xmin.min = 0;
  input_xmin.max = x_max;
  input_xmin.onchange = function () {
    x_min = input_xmin.value;
  };

  var input_xmax = document.createElement("input");
  input_xmax.type = "number";
  input_xmax.value = x_max;
  input_xmax.min = 0;
  input_xmax.max = x_max;
  input_xmax.onchange = function () {
    x_max = input_xmax.value;
  };

  var input_ymin = document.createElement("input");
  input_ymin.type = "number";
  input_ymin.value = y_min;
  input_ymin.min = 0;
  input_ymin.max = y_max;
  input_ymin.onchange = function () {
    y_min = input_ymin.value;
  };

  var input_ymax = document.createElement("input");
  input_ymax.type = "number";
  input_ymax.value = y_max;
  input_ymax.min = 0;
  input_ymax.max = y_max;
  input_ymax.onchange = function () {
    y_max = input_ymax.value;
  };

  var button_show_area = document.createElement("button");
  button_show_area.innerText = "突出显示区域";
  button_show_area.onclick = function () {
    initialPaint();
    var canvas=document.getElementById("mycanvas");
    var ctx=canvas.getContext("2d");
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    ctx.fillRect(x_min*5, y_min*5, (x_max - x_min)*5, (y_max - y_min)*5);
  };
  var button_clear_area = document.createElement("button");
  button_clear_area.innerText = "取消突出显示区域";
  button_clear_area.onclick = function () {
    initialPaint();
  };

  var show = document.createElement("p");

  container.appendChild(document.createTextNode("x 坐标范围："));
  container.appendChild(input_xmin);
  container.appendChild(document.createTextNode("~"));
  container.appendChild(input_xmax);
  container.appendChild(document.createTextNode(" y 坐标范围："));
  container.appendChild(input_ymin);
  container.appendChild(document.createTextNode("~"));
  container.appendChild(input_ymax);
  container.appendChild(button_show_area);
  container.appendChild(button_clear_area);
  container.appendChild(show);

  document.getElementsByClassName("am-u-lg-12")[1].appendChild(container);

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.type === "paintboard_update") {
      update(data.y, data.x, colorlist[data.color]);
      var d = new Date();
      if (
        x_min <= data.x &&
        data.x <= x_max &&
        y_min <= data.y &&
        data.y <= y_max
      ) {
        q.push(d.getTime());
      }
      while (q.size >= 1 && d.getTime() - q.front > waitTime) {
        q.pop();
      }
      show.innerHTML =
        "范围内有 " +
        String(q.size) +
        " 个账号。（刚加载完毕或改变监视范围后需要一段时间数字才能稳定；较长时间后数字可能停滞）";
    } else if (data.type === "result") {
      initialPaint();
    }
  };
})();
