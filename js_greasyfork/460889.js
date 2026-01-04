// ==UserScript==
// @name         CalderInspector
// @namespace    fvs
// @version      0.0.1
// @description  FVS-Calder-Inspector
// @author       Cmen
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.1.4/dist/tweakpane.min.js
// @match        http://*/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460889/CalderInspector.user.js
// @updateURL https://update.greasyfork.org/scripts/460889/CalderInspector.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var statsExports = {};
var stats = {
  get exports(){ return statsExports; },
  set exports(v){ statsExports = v; },
};

(function (module, exports) {
	(function (global, factory) {
	  (module.exports = factory())
	    ;
	})(commonjsGlobal, function () {

	  /**
	   * @author mrdoob / http://mrdoob.com/
	   */

	  var Stats = function () {
	    var mode = 0;

	    var container = document.createElement("div");
	    container.style.cssText =
	      "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
	    container.addEventListener(
	      "click",
	      function (event) {
	        event.preventDefault();
	        showPanel(++mode % container.children.length);
	      },
	      false
	    );

	    //

	    function addPanel(panel) {
	      container.appendChild(panel.dom);
	      return panel;
	    }

	    function showPanel(id) {
	      for (var i = 0; i < container.children.length; i++) {
	        container.children[i].style.display = i === id ? "block" : "none";
	      }

	      mode = id;
	    }

	    //

	    var beginTime = (performance || Date).now(),
	      prevTime = beginTime,
	      frames = 0;

	    var fpsPanel = addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
	    var msPanel = addPanel(new Stats.Panel("MS", "#0f0", "#020"));

	    if (self.performance && self.performance.memory) {
	      var memPanel = addPanel(new Stats.Panel("MB", "#f08", "#201"));
	    }

	    showPanel(0);

	    return {
	      REVISION: 16,

	      dom: container,

	      addPanel: addPanel,
	      showPanel: showPanel,

	      begin: function () {
	        beginTime = (performance || Date).now();
	      },

	      end: function () {
	        frames++;

	        var time = (performance || Date).now();

	        msPanel.update(time - beginTime, 200);

	        if (time >= prevTime + 1000) {
	          fpsPanel.update((frames * 1000) / (time - prevTime), 100);

	          prevTime = time;
	          frames = 0;

	          if (memPanel) {
	            var memory = performance.memory;
	            memPanel.update(
	              memory.usedJSHeapSize / 1048576,
	              memory.jsHeapSizeLimit / 1048576
	            );
	          }
	        }

	        return time;
	      },

	      update: function () {
	        beginTime = this.end();
	      },

	      // Backwards Compatibility

	      domElement: container,
	      setMode: showPanel,
	    };
	  };

	  Stats.Panel = function (name, fg, bg) {
	    var min = Infinity,
	      max = 0,
	      round = Math.round;
	    var PR = round(window.devicePixelRatio || 1);

	    var WIDTH = 80 * PR,
	      HEIGHT = 48 * PR,
	      TEXT_X = 3 * PR,
	      TEXT_Y = 2 * PR,
	      GRAPH_X = 3 * PR,
	      GRAPH_Y = 15 * PR,
	      GRAPH_WIDTH = 74 * PR,
	      GRAPH_HEIGHT = 30 * PR;

	    var canvas = document.createElement("canvas");
	    canvas.width = WIDTH;
	    canvas.height = HEIGHT;
	    canvas.style.cssText = "width:80px;height:48px";

	    var context = canvas.getContext("2d");
	    context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif";
	    context.textBaseline = "top";

	    context.fillStyle = bg;
	    context.fillRect(0, 0, WIDTH, HEIGHT);

	    context.fillStyle = fg;
	    context.fillText(name, TEXT_X, TEXT_Y);
	    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

	    context.fillStyle = bg;
	    context.globalAlpha = 0.9;
	    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

	    return {
	      dom: canvas,

	      update: function (value, maxValue) {
	        min = Math.min(min, value);
	        max = Math.max(max, value);

	        context.fillStyle = bg;
	        context.globalAlpha = 1;
	        context.fillRect(0, 0, WIDTH, GRAPH_Y);
	        context.fillStyle = fg;
	        context.fillText(
	          round(value) +
	            " " +
	            name +
	            " (" +
	            round(min) +
	            "-" +
	            round(max) +
	            ")",
	          TEXT_X,
	          TEXT_Y
	        );

	        context.drawImage(
	          canvas,
	          GRAPH_X + PR,
	          GRAPH_Y,
	          GRAPH_WIDTH - PR,
	          GRAPH_HEIGHT,
	          GRAPH_X,
	          GRAPH_Y,
	          GRAPH_WIDTH - PR,
	          GRAPH_HEIGHT
	        );

	        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

	        context.fillStyle = bg;
	        context.globalAlpha = 0.9;
	        context.fillRect(
	          GRAPH_X + GRAPH_WIDTH - PR,
	          GRAPH_Y,
	          PR,
	          round((1 - value / maxValue) * GRAPH_HEIGHT)
	        );
	      },
	    };
	  };

	  return Stats;
	});
} (stats));

// import { Pane } from "tweakpane";

const { Pane } = window.Tweakpane;

class CalderPerformanceInspector {
  state = {
    showFPS: false,
    recordCalderCity: true,
    recordCalderCustom: true,
    showDashboard: true,
  };

  appStoreInfo = {};

  instanceMap = new WeakMap();
  instances = [];
  fileSizeTemp = {};

  get CalderResourceUrl() {
    return Calder?.ResourceBaseURL || CalderCustom?.ResourceBaseURL;
  }

  constructor() {
    const container = (this.container = document.body.appendChild(
      document.createElement("div")
    ));
    container.style.cssText =
      "position: fixed; top: 20px; right: 20px; z-index: 9999;";

    this.pane = new Pane({
      container,
      title: "三维性能检测",
    });

    this.pane
      .addInput(this.state, "showFPS", {
        label: "显示帧率",
      })
      .on("change", this.showFPS.bind(this));

    this.pane
      .addInput(this.state, "showDashboard", {
        label: "显示数据看板",
      })
      .on("change", this.showDashboard.bind(this));
  }

  showDashboard() {
    this._initDashboardEle();
    this.dashboardEle.style.display = this.state.showDashboard
      ? "block"
      : "none";
  }

  showFPS() {
    if (this.stats == null) {
      const stats = (this.stats = new statsExports());
      document.body.appendChild(this.stats.dom);

      (function animate() {
        stats.begin();
        stats.end();
        requestAnimationFrame(animate);
      })();
    }
    this.stats.dom.style.display = this.state.showFPS ? "block" : "none";
  }

  mountCalderInstance(instance) {
    this.calderInstance = instance;
    this.instanceMap.set(instance, {});
    this.instances.push(instance);
    this.setupInstanceListener(instance);

    const CalderCtr =
      typeof Calder !== "undefined" ? Calder : CalderCustom;

    this.ResourceBaseURL = CalderCtr.ResourceBaseURL;
  }

  mountCalderApp(appStore) {
    if (this.calderAppStore === appStore) return;
    this.calderAppStore = appStore;
    this.setupAppListener();

    this.ResourceBaseURL = (window.calderApp || window.calderCustomApp).ResourceBaseURL;
  }

  setupAppListener() {
    const { eventCenter } = this.calderAppStore;
    this._attachCalderEventListeners(eventCenter, this.appStoreInfo, () => {
      this.logAppInfo();
    });
  }

  setupInstanceListener(instance) {
    const instanceInfo = this.instanceMap.get(instance);

    this._attachCalderEventListeners(instance, instanceInfo, () => {
      this.logInstanceInfo();
    });
  }

  _attachCalderEventListeners(emitter, info, callback) {
    emitter.on("sceneUpdateStart", () => {
      info.startTime = Date.now();
       setTimeout(() => {
           emitter.once("sceneUpdateEnd", () => {
               info.endTime = Date.now();
               callback();
           });
       }, 100);
    });

    emitter.on("modelUpdateStart", () => {
      info.modelUpdateStartTime = Date.now();
    });
    emitter.on("modelUpdateEnd", () => {
      info.modelUpdateEndTime = Date.now();
    });

    emitter.on("modelLoadStart", () => {
      info.modelLoadStartTime = Date.now();
    });
    emitter.on("modelLoadEnd", () => {
      info.modelLoadEndTime = Date.now();
    });
  }

  _initDashboardEle() {
    if (this.dashboardEle == null) {
      this.dashboardEle = this.container.appendChild(
        document.createElement("div")
      );
      this.dashboardEle.style.cssText =
        "background: rgba(0, 0, 0, .8); color: #fff;margin-top: 4px; border-radius: 4px;padding: 8px;";
    }
  }

  async logAppInfo() {
    this._initDashboardEle();
    this.dashboardEle.innerHTML = "";

    const { scene } = this.calderAppStore.render;
    const { calderModel } = this.calderAppStore;
    const info = this.appStoreInfo;

    info.isCalderCity = calderModel.$modelType === "calder/CalderModel";

    const meshes = info.isCalderCity
      ? calderModel.customMeshModels
      : calderModel.nodes.filter((n) => !!n.url);

    info.size = await this._getAddMeshesTotalSize(meshes);
    info.totalMeshCount = scene.meshes.length.toString();
    info.userAddMeshCount = meshes.length;
    info.activeMeshCount = scene.getActiveMeshes().length;
    info.activeFaceCount = scene.getActiveIndices() / 3;

    if (info.isCalderCity) {
      Object.assign(info, this._getSceneGeoMeshesInfo(scene));
      info.geojsonSize = await this._getGeojsonSize(this.calderAppStore.calderModel.geojsonId);
    }

    this._showDetailInfos(info);
  }

  logInstanceInfo() {
    this._initDashboardEle();
    this.dashboardEle.innerHTML = "";
    this.instances.forEach(async (instance) => {
      const info = this.instanceMap.get(instance);

      info.isCalderCity =
        typeof Calder !== "undefined" && instance instanceof Calder;

      const { scene } = instance.view.render;

      const options = instance.getOptions();

      const meshes = info.isCalderCity
        ? options.customMeshModels
        : options.nodes.filter((n) => !!n.url);

      info.size = await this._getAddMeshesTotalSize(meshes);
      info.totalMeshCount = scene.meshes.length.toString();
      info.userAddMeshCount = meshes.length;
      info.activeMeshCount = scene.getActiveMeshes().length;
      info.activeFaceCount = scene.getActiveIndices() / 3;

      if (info.isCalderCity) {
        Object.assign(info, this._getSceneGeoMeshesInfo(scene));
        info.geojsonSize = await this._getGeojsonSize(options.geo.geojsonId);
      }

      this._showDetailInfos(info);
    });
  }

  async _getAddMeshesTotalSize(meshes) {
    const urlSet = new Set();
    meshes.forEach((mesh) => urlSet.add(mesh.url));
    await Promise.all(
      Array.from(urlSet).map(async (url) => {
        await this.checkAndRecordFileSize(url);
      })
    );

    let size = 0;
    meshes.forEach((mesh) => {
      size += this.fileSizeTemp[mesh.url];
    });
    return size;
  }

  async _getGeojsonSize(geojsonId) {
    const url = `/geo/${geojsonId}.geojson`;
    await this.checkAndRecordFileSize(url);

    return this.fileSizeTemp[url];

  }

  _getSceneGeoMeshesInfo(scene) {
    const buildingMeshCount = scene
      .getNodeByID("buildingGroup")
      .getChildMeshes(false).length;
    const roadMeshCount = scene
      .getNodeByID("roadGroup")
      .getChildMeshes(false).length;

    return {
      buildingMeshCount,
      roadMeshCount,
    };
  }

  _showDetailInfos(info) {
    const getInfoHtml = info.isCalderCity
      ? `
      <div>GeoJSON大小(MB): <span>${info.geojsonSize.toFixed(2)}</span></div>
      <div>建筑数量: <span>${info.buildingMeshCount}</span></div>
      <div>道路数量: <span>${info.roadMeshCount}</span></div>
    `
      : "";

    this.dashboardEle.innerHTML += `
    <style>
      .fvs-inspector-wrapper > div {
        border-bottom: 1px solid #6c6c6c;
      }
      .fvs-inspector-wrapper span{
        float: right;
      }
    </style>
    <div class="fvs-inspector-wrapper">
      <h3 style="color: #fff; border-bottom: 1px solid #ccc;">
        ${info.isCalderCity ? "三维城市" : "自定义模型组件"}
      </h3>
      <div>更新总耗时(ms): <span>${info.endTime - info.startTime}</span></div>
      <div>自定义模型更新总耗时(ms): <span>${info.modelUpdateEndTime - info.modelUpdateStartTime}</span></div>
      <div>自定义模型加载总耗时(ms): <span>${info.modelLoadEndTime - info.modelLoadStartTime}</span></div>
      <div>场景内导入模型总大小(MB): <span>${info.size.toFixed(2)}</span></div>
      <div>场景总模型数: <span>${info.totalMeshCount}</span></div>
      <div>用户添加模型数(根模型): <span>${info.userAddMeshCount}</span></div>
      <div>活动Mesh数: <span>${info.activeMeshCount}</span> </div>
      <div>活动面数: <span>${info.activeFaceCount}</span></div>
      ${getInfoHtml}
    </div>
  `;
  }

  /**
   * 检查是否记录模型尺寸, 没有的话重新加载记录.
   * @param {*} url
   * @returns
   */
  async checkAndRecordFileSize(url) {
    if (this.fileSizeTemp[url]) return;
    const fullUrl = this.ResourceBaseURL + url;

    const name = url.split("/").pop();

    const res = await fetch(fullUrl);
    const blob = await res.blob();
    const file = new File([blob], name);
    const size = file.size / 1024 / 1024;
    this.fileSizeTemp[url] = size;
    return size;
  }
}

const url = location.href;
if (url.indexOf("calder") >= 0 || url.indexOf("fvs") >= 0) {
  const inspector = new CalderPerformanceInspector();
  window.__CALDER_INSPECTOR = inspector;
}

})();