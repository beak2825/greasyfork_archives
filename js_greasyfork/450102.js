// ==UserScript==
// @name         Global Debugger
// @namespace    https://greasyfork.org/en/scripts/450102-global-debugger
// @version      1.0.1
// @description  Shows an FPS / Ping / Speed counter wherever you go!
// @author       HYDROFLAME521
// @match        *://*/*
// @license      CDDL-1.0
// @icon         https://c.tenor.com/je-huTL1vwgAAAAi/loading-buffering.gif
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js
// @downloadURL https://update.greasyfork.org/scripts/450102/Global%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/450102/Global%20Debugger.meta.js
// ==/UserScript==
'use strict';
(function(window, e) {
  if ("object" === typeof exports && "undefined" !== typeof module) {
    module.exports = e();
  } else {
    if ("function" === typeof define && define.amd) {
      define(e);
    } else {
      window.Stats = e();
    }
  }
})(this, function() {
  var init = function() {
    function addPanel(panel) {
      container.appendChild(panel.dom);
      return panel;
    }
    function showPanel(id) {
      var i = 0;
      for (; i < container.children.length; i++) {
        container.children[i].style.display = i === id ? "block" : "none";
      }
      p = id;
    }
    var p = 0;
    var container = document.createElement("div");
    container.style.cssText = "position:fixed;bottom:0;right:0;cursor:pointer;opacity:0.9;z-index:10000";
    container.addEventListener("click", function(event) {
      event.preventDefault();
      showPanel(++p % container.children.length);
    }, false);
    var beginTime = (performance || Date).now();
    var prevTime = beginTime;
    var value = 0;
    var fpsPanel = addPanel(new init.Panel("FPS", "#0ff", "#002"));
    var msPanel = addPanel(new init.Panel("PING", "#0f0", "#020"));
    if (self.performance && self.performance.memory) {
      var memPanel = addPanel(new init.Panel("MB", "#f08", "#201"));
    }
    showPanel(0);
    return {
      REVISION : 16,
      dom : container,
      addPanel : addPanel,
      showPanel : showPanel,
      begin : function() {
        beginTime = (performance || Date).now();
      },
      end : function() {
        value++;
        var time = (performance || Date).now();
        msPanel.update(time - beginTime, 200);
        if (time > prevTime + 1E3 && (fpsPanel.update(1E3 * value / (time - prevTime), 100), prevTime = time, value = 0, memPanel)) {
          var m = performance.memory;
          memPanel.update(m.usedJSHeapSize / 1048576, m.jsHeapSizeLimit / 1048576);
        }
        return time;
      },
      update : function() {
        beginTime = this.end();
      },
      domElement : container,
      setMode : showPanel
    };
  };
  init.Panel = function(label, container, position) {
    var t = Infinity;
    var val = 0;
    var round = Math.round;
    var r = round(window.devicePixelRatio || 1);
    var w = 80 * r;
    var h = 48 * r;
    var right = 3 * r;
    var padding = 2 * r;
    var x = 3 * r;
    var y = 15 * r;
    var width = 74 * r;
    var height = 30 * r;
    var elem = document.createElement("canvas");
    elem.width = w;
    elem.height = h;
    elem.style.cssText = "width:200px;height:120px";
    var context = elem.getContext("2d");
    context.font = "bold " + 11 * r + "px Helvetica,Arial,sans-serif";
    context.textBaseline = "top";
    context.fillStyle = position;
    context.fillRect(0, 0, w, h);
    context.fillStyle = container;
    context.fillText(label, right, padding);
    context.fillRect(x, y, width, height);
    context.fillStyle = position;
    context.globalAlpha = .9;
    context.fillRect(x, y, width, height);
    return {
      dom : elem,
      update : function(i, radius) {
        t = Math.min(t, i);
        val = Math.max(val, i);
        context.fillStyle = position;
        context.globalAlpha = 1;
        context.fillRect(0, 0, w, y);
        context.fillStyle = container;
        context.fillText(round(i) + " " + label + " (" + round(t) + "-" + round(val) + ")", right, padding);
        context.drawImage(elem, x + r, y, width - r, height, x, y, width - r, height);
        context.fillRect(x + width - r, y, r, height);
        context.fillStyle = position;
        context.globalAlpha = .9;
        context.fillRect(x + width - r, y, r, round((1 - i / radius) * height));
      }
    };
  };
  return init;
});

(function() {
  'use strict';

  const stats = new Stats();
  const statsParentNode = document.body;

  statsParentNode.appendChild(stats.dom);


  requestAnimationFrame(function loop() {
    stats.update();
    requestAnimationFrame(loop);
  });
})();