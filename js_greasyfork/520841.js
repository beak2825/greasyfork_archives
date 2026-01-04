// ==UserScript==
// @name         Increase FPS
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Increase FPS in shell shockers
// @author       HRLO77
// @match        *://shellshock.io/*
// @match        https://shellshock.io
// @match        https://shellshock.io/*
// @match        https://shellshock.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520841/Increase%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/520841/Increase%20FPS.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var script = document.createElement('script');
  script.src = 'https://preview.babylonjs.com/babylon.js';
  document.head.appendChild(script);

  script.onload = function() {
    var scene = BABYLON.Engine.LastCreatedScene;
    var options = new BABYLON.SceneOptimizerOptions.HighDegradationAllowed(76);
    if (scene) {
      scene.getEngine().setMaxFPS(Infinity);
      optimizer = new BABYLON.SceneOptimizer(scene, options);
      optimizer.start();
      //scene.getEngine().useGeometryIdsMap = true;
      //scene.getEngine().useMaterialMeshMap = true;
      //scene.getEngine().useClonedMeshMap = true; // all these use require more mem
      scene.getEngine().performancePriority = 'aggressive';
      scene.getEngine().snapshotRendering = true;
    }
  };
})();