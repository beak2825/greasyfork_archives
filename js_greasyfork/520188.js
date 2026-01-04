// ==UserScript==
// @name        VOXploit
// @namespace   http://tampermonkey.net/
// @match       https://voxiom.io/*
// @run-at      document-start
// @grant       none
// @version     1.0.1
// @author      Cloud1
// @description Aimbot, triggerbot, chams, no-recoil for voxiom.io
// @license     GPL
// @require     https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js
// @require     https://unpkg.com/three@0.150.0/build/three.min.js
// @icon        https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @downloadURL https://update.greasyfork.org/scripts/520188/VOXploit.user.js
// @updateURL https://update.greasyfork.org/scripts/520188/VOXploit.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

// avoid detection
const matchDetection = /^function\(\){\w+\['\w+'\]\(\);}$/;
const setIntervalHandler = {
  apply: function(target, thisArg, argumentsList) {
    const callback = argumentsList[0];
    const delay = argumentsList[1];
    if (delay === 1000 && callback && callback.toString().match(matchDetection)) {
      console.log('Blocked detection');
      return null;
    }
    return Reflect.apply(...arguments);
  }
};
window.setInterval = new Proxy(window.setInterval, setIntervalHandler);

// add #lil-gui container
const lilGuiContainer = document.createElement('div');
lilGuiContainer.id = 'lil-gui';
document.body.appendChild(lilGuiContainer);
 
const style = document.createElement('style');
const guiStyle = document.createElement('style');
const GUI = lil.GUI;
const gui = new GUI({ container: lilGuiContainer, title: 'Controls' });
 
let espConfig = {
  heightLine: 1.16,
  sneakHeight: 0.4,
  ennemyDistance: 50,
  maxAngleInRadians: 0.1,
  noRecoil: true,
  showBox: 0,
  showOutline: 0,
  showPlayer: 2,
  showLine: 1,
  wireframe: false,
  allEnnemies: false,
  isSniper: false,
  aimbot: 2,
  triggerBot: 2,
  aimbotIgnoreWall: false,
  mapZoom: 30,
  mapOffsetZ: 0,
  autoClaimAds: false,
  antiAFK: false,
  rainbow: false,
  showAimRadius: false,
  lockAimbotTriggerBot: false,
  aimbotKey: 'b',
  triggerBotKey: 't',
  toggleUIKey: '.',
};

const aimbotFolder = gui.addFolder('Aimbot');
aimbotFolder.add(espConfig, 'aimbot').name(`aimbot (${espConfig.aimbotKey})`).options({Off: 0, LeftClick: 1, RightClick: 2, Always: 3}).listen();
aimbotFolder.add(espConfig, 'triggerBot').name(`triggerBot (${espConfig.triggerBotKey})`).options({Off: 0, LeftClick: 1, RightClick: 2, Always: 3}).listen();
aimbotFolder.add(espConfig, 'noRecoil');
aimbotFolder.add(espConfig, 'allEnnemies');
aimbotFolder.add(espConfig, 'isSniper');
const advancedAimbotFolder = aimbotFolder.addFolder('Advanced');
advancedAimbotFolder.close();
advancedAimbotFolder.add(espConfig, 'aimbotIgnoreWall');
advancedAimbotFolder.add(espConfig, 'showAimRadius');
advancedAimbotFolder.add(espConfig, 'maxAngleInRadians', 0.01, 0.5, 0.01);
advancedAimbotFolder.add(espConfig, 'heightLine', .5, 1.25, 0.01);
advancedAimbotFolder.add(espConfig, 'sneakHeight', 0, 1, 0.01);
 
const chamsFolder = gui.addFolder('Chams');
chamsFolder.close();
chamsFolder.add(espConfig, 'showPlayer').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showLine').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showOutline').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showBox').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'ennemyDistance', 10, 100, 1);
chamsFolder.add(espConfig, 'wireframe');
chamsFolder.add(espConfig, 'rainbow');
chamsFolder.add(espConfig, 'mapZoom', 20, 100, 1);
chamsFolder.add(espConfig, 'mapOffsetZ', -50, 50, 1);
 
const toolsFolder = gui.addFolder('Tools');
toolsFolder.close();
toolsFolder.add(espConfig, 'autoClaimAds');
toolsFolder.add(espConfig, 'antiAFK');
toolsFolder.add(espConfig, 'lockAimbotTriggerBot');
 
// load/save config
const configFolder = gui.addFolder('Config');
configFolder.add(espConfig, 'toggleUIKey').name('Toggle UI key');
configFolder.add(espConfig, 'aimbotKey').name('Aimbot key');
configFolder.add(espConfig, 'triggerBotKey').name('Triggerbot key');
configFolder.close();
const defaultConfig = gui.save();
let config = { configName: 'espConfig' };
configFolder.add(config, 'configName').name('Config name');
configFolder.add({ export: () => {
  const currentConfig = JSON.stringify(gui.save(), null, 2);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(currentConfig));
  element.setAttribute('download', config.configName + '.json');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}}, 'export').name('Export config');
configFolder.add({ import: () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      gui.load(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };
  input.click();
}}, 'import').name('Import config');
configFolder.add({ reset: () => {
  gui.load(defaultConfig);
  localStorage.removeItem('espConfig');
}}, 'reset').name('Reset config');
 
// auto load/save config
const savedConfig = localStorage.getItem('espConfig');
if (savedConfig) {
  console.log('Loaded config', savedConfig);
  gui.load(JSON.parse(savedConfig));
}
gui.onChange(() => {
  localStorage.setItem('espConfig', JSON.stringify(gui.save()));
});
 
// listen for key press
document.addEventListener('keydown', (e) => {
  if (!espConfig.lockAimbotTriggerBot && e.key === espConfig.aimbotKey) {
    espConfig.aimbot = (espConfig.aimbot + 1) % 4;
  }
  if (!espConfig.lockAimbotTriggerBot && e.key === espConfig.triggerBotKey) {
    espConfig.triggerBot = (espConfig.triggerBot + 1) % 4;
  }
  if (e.key === espConfig.toggleUIKey) {
    lilGuiContainer.style.display = lilGuiContainer.style.display === 'none' ? 'block' : 'none';
  }
  if (e.key === 'e') {
    if (espConfig.autoClaimAds) {
      setTimeout(() => {
        claimAds();
      }, 100);
    }
  }
});
 
// no-recoil
let foundRecoil = false;
const arrayPushHandler = {
  apply: function(target, thisArg, argumentsList) {
    if (!foundRecoil && argumentsList.length === 1) {
      const item = argumentsList[0];
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length === 44) {
          for (const key in item) {
            if (item[key] === 0.3) {
              console.log('Recoil key found', key);
              foundRecoil = true;
              Object.defineProperty(Object.prototype, key, {
                get: () => {
                  return espConfig.noRecoil ? 0 : item[key];
                },
                set: (baseRecoil) => {
                  _baseRecoil = baseRecoil;
                }
              });
              break;
            }
          }
        }
      }
    }
    return Reflect.apply(...arguments);
  }
};
Array.prototype.push = new Proxy(Array.prototype.push, arrayPushHandler);
 
// listen for mouse click
let isLeftClick = false;
let isRightClick = false;
document.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    isLeftClick = true;
  }
  if (e.button === 2) {
    if (espConfig.isSniper) {
      setTimeout(() => {
        isRightClick = true;
      }, 400);
    } else {
      isRightClick = true;
    }
  }
});
document.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    isLeftClick = false;
  }
  if (e.button === 2) {
    isRightClick = false;
  }
});
 
// obfuscaed keys
let worldScene = null;
let childrenKey = null;
let worldCamera = null;
let projectionMatrixKey = null;
let matrixWorldKey = null;
let matrixElKey = null;
 
// three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';
let saveViewport = new THREE.Vector4();
let saveScissor = new THREE.Vector4();
let minimapViewport = new THREE.Vector4(20, window.innerHeight - 250 - 20, 250, 250);
const minimapCamera = new THREE.OrthographicCamera(-espConfig.mapZoom, espConfig.mapZoom, espConfig.mapZoom, -espConfig.mapZoom, 0.1, 1000);
minimapCamera.rotation.order = 'YXZ';
minimapCamera.position.set(0, 50, 0);
minimapCamera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer( {
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.id = 'overlayCanvas';
document.body.appendChild(renderer.domElement);
 
 
function setTransform(target, transform, isMatrix = true) {
  const matrix = new THREE.Matrix4().fromArray(isMatrix ? transform : transform[matrixWorldKey][matrixElKey]);
  matrix.decompose(target.position, target.quaternion, target.scale);
}
 
doOnce = (fn) => {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      return fn(...args);
    }
  };
};
 
function checkWorldCamera(object) {
  if (worldCamera && object.uuid === worldCamera.uuid) return;
  let hasProjectionMatrix = false;
  for (const key in object) {
    const element = object[key];
    if (!element) continue;
    if (typeof element == 'object') {
      if (hasProjectionMatrix) continue;
      const valueKey = Object.keys(element)[0];
      const value = element[valueKey];
      if (Array.isArray(value) && value[11] === -1) {
        hasProjectionMatrix = true;
        matrixElKey = valueKey;
        projectionMatrixKey = key;
      }
    } else if (typeof element === 'function') {
      const code = element.toString();
      const match = /verse'\]\(this\['([^']+)'\]\);/.exec(code);
      if (match) {
        matrixWorldKey = match[1];
      }
    }
    if (hasProjectionMatrix && matrixWorldKey) {
      console.log('Found camera', {object}, object);
      worldCamera = object;
      object[projectionMatrixKey] = new Proxy(object[projectionMatrixKey], {
        get: function(target, prop, receiver) {
          setTransform(camera, object, false);
          camera.near = worldCamera.near;
          camera.far = worldCamera.far;
          camera.aspect = worldCamera.aspect;
          camera.fov = worldCamera.fov;
          camera.updateProjectionMatrix();
          worldCamera = object;
          window.worldCamera = object;
          return Reflect.get(...arguments);
        }
      });
      break;
    }
  }
}
 
function checkWorldScene(object) {
  if (worldScene || object instanceof THREE.Scene) return;
  for (const key in object) {
    const element = object[key];
    if (!element) continue;
    if (Array.isArray(element) && element.length === 9) {
      const value = element[0];
      if (value && typeof value === 'object' && value.hasOwnProperty('uuid')) {
        childrenKey = key;
      }
    }
    if (childrenKey) {
      console.log('Found scene', {childrenKey}, object);
      worldScene = object;
      window.worldScene = object;
      renderer.setAnimationLoop(animate);
      break;
    }
  }
}
 
Object.defineProperty( Object.prototype, 'overrideMaterial', {
  get: function() {
    checkWorldScene(this);
    return this._overrideMaterial;
  },
  set: function(value) {
    this._overrideMaterial = value;
  }
});
Object.defineProperty( Object.prototype, 'far', {
  get: function() {
    checkWorldCamera(this);
    return this._far;
  },
  set: function(value) {
    this._far = value;
  }
});
 
function isPlayer(entity) {
  try {
    return entity[childrenKey].length > 2 || !entity[childrenKey][1].geometry;
  } catch {
    return false;
  }
}
 
// claim ads
function claimAds() {
  document.querySelectorAll('svg').forEach(svg => {
    if (svg.getAttribute('data-icon') === 'play-circle') {
      svg.closest('div').click();
      console.log('Claimed ads');
    }
  });
}
 
const context2DFillTextHandler = {
  apply: function(target, thisArg, argumentsList) {
    thisArg.canvas.lastText = argumentsList[0];
    return Reflect.apply(...arguments);
  }
};
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, context2DFillTextHandler);
 
function isEnnemy(entity) {
  for (const child of entity[childrenKey]) {
    try {
      const matImage = child.material.map.image;
      if (matImage instanceof HTMLCanvasElement && matImage.hasOwnProperty('lastText')) {
        entity.playerName = matImage.lastText;
        return false;
      }
    } catch {}
  }
  return true;
}
 
function setFiring(shouldFire) {
  if (setFiring.firing === shouldFire) return;
  setFiring.firing = shouldFire;
  if (shouldFire) {
    if (espConfig.isSniper) { // need improvement
      setTimeout(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { buttons: 3 }));
        setTimeout(() => {
          document.dispatchEvent(new MouseEvent('mouseup', { buttons: 0 }));
        }, 200);
        // setFiring.firing = false;
      }, 300);
    } else {
      document.dispatchEvent(new MouseEvent('mousedown', { buttons: 3 }));
    }
  } else {
    document.dispatchEvent(new MouseEvent('mouseup', { buttons: 0 }));
  }
}
 
const colors = {
  ennemy: new THREE.Color(0xff0000),
  player: new THREE.Color(0x00ff00),
  blue: new THREE.Color(0x0000ff)
};
 
const outlineMats = {
  ennemy: new THREE.LineBasicMaterial({ color: colors.ennemy }),
  player: new THREE.LineBasicMaterial({ color: colors.player })
};
const meshMats = {
  ennemy: new THREE.MeshBasicMaterial({ color: colors.ennemy, transparent: true, opacity: 0.5 }),
  player: new THREE.MeshBasicMaterial({ color: colors.player, transparent: true, opacity: 0.5 })
};
 
const raycaster = new THREE.Raycaster();
const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));
 
 
const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true });
const line = new THREE.LineSegments(lineGeometry, lineMaterial);
line.frustumCulled = false;
scene.add(line);
 
const dummyLookAt = new THREE.PerspectiveCamera();
const color = new THREE.Color();
 
const chunkMaterial = new THREE.MeshNormalMaterial();
 
const boxPlayerGeometry = new THREE.BoxGeometry(.25, 1.25, 0.25);
 
 
// crosshair circle
const crosshairGeometry = new THREE.CircleGeometry(.5, 32);
const crosshairMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
const crosshair = new THREE.LineLoop(crosshairGeometry, crosshairMaterial);
camera.add(crosshair);
scene.add(camera);
 
function calculateValue(maxAngleInRadians) {
  const a = -79.83;
  const b = -30.06;
  const c = -0.90;
  return a * Math.exp(b * maxAngleInRadians) + c;
}
 
function animate(time) {
  const now = Date.now();
  const entities = childrenKey ? worldScene[childrenKey][5][childrenKey] : [];
  const lineOrigin = camera.localToWorld(new THREE.Vector3(0, 0, -10));
  const linePositions = [];
  crosshair.position.z = calculateValue(espConfig.maxAngleInRadians);
  crosshair.visible = espConfig.showAimRadius;
  const colorArray = [];
  const aimbotTarget = { angleDifference: Infinity};
  const chunks = [];
  const gameChunks = childrenKey ? worldScene[childrenKey][4][childrenKey] : [];
  for (const chunk of gameChunks) {
    if (!chunk || !chunk.geometry) continue;
    const chunkPositions = chunk.geometry.attributes.position.array;
    if (!chunkPositions || !chunkPositions.length) continue;
    if (!chunk.myChunk) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(chunkPositions, 3)
      );
      geometry.setIndex(
        new THREE.BufferAttribute(chunk.geometry.index.array, 1)
      );
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      chunk.myChunk = new THREE.Mesh(geometry, chunkMaterial);
      chunk.myChunk.box = new THREE.Box3();
    }
    const myChunk = chunk.myChunk;
    if (chunk.material) chunk.material.wireframe = espConfig.wireframe;
    setTransform(myChunk, chunk, false);
    myChunk.updateMatrixWorld();
    myChunk.box.copy(myChunk.geometry.boundingBox).applyMatrix4(myChunk.matrixWorld);
    chunks.push(myChunk);
  }
 
  chunks.sort((a, b) => {
    const distanceA = a.position.distanceTo(camera.position);
    const distanceB = b.position.distanceTo(camera.position);
    return distanceB - distanceA;
  });
 
  const shouldAimbot = espConfig.aimbot === 3 || (espConfig.aimbot === 1 && isLeftClick) || (espConfig.aimbot === 2 && isRightClick);
 
  entities.forEach(entity => {
    if (!entity || !entity.parent) return;
    if (!entity.myObject3D) {
      entity.myObject3D = new THREE.Object3D();
      entity.myObject3D.frustumCulled = false;
      entity.discovered = now;
      entity.loaded = false;
      entity.logged = false;
      entity.ennemy = null;
      return;
    }
    if (typeof entity.visible === 'boolean' && !entity.visible) {
      entity.myObject3D.visible = false;
      return;
    }
    if (!entity.loaded && now - entity.discovered < 500) return;
    entity.loaded = true;
    if (!entity.logged && isPlayer(entity)) {
      const skinnedMesh = entity[childrenKey][1][childrenKey][3];
      entity.isPlayer = true;
      entity.logged = true;
      entity.ennemy = isEnnemy(entity);
      const playerMesh = new THREE.Mesh(skinnedMesh.geometry, entity.ennemy ? meshMats.ennemy : meshMats.player);
      entity.myObject3D.add(playerMesh);
      entity.myObject3D.playerMesh = playerMesh;
      const playerMiniMap = new THREE.Mesh(skinnedMesh.geometry, entity.ennemy ? meshMats.ennemy : meshMats.player);
      playerMiniMap.visible = false;
      entity.myObject3D.add(playerMiniMap);
      entity.myObject3D.playerMiniMap = playerMiniMap;
      const outline = new THREE.LineSegments(edgesGeometry, entity.ennemy ? outlineMats.ennemy : outlineMats.player);
      outline.scale.set(0.5, 1.25, 0.5);
      outline.frustumCulled = false;
      entity.myObject3D.add(outline);
      entity.myObject3D.outline = outline;
      const boxMesh = new THREE.Mesh(boxPlayerGeometry, entity.ennemy ? meshMats.ennemy : meshMats.player);
      boxMesh.position.y = 0.625;
      entity.myObject3D.add(boxMesh);
      entity.myObject3D.boxMesh = boxMesh;
      const dir = new THREE.Vector3(0, 0, -1);
      const origin = new THREE.Vector3(0, 1, 0);
      const arrowLookingAt = new THREE.ArrowHelper(dir, origin, 1, entity.ennemy ? colors.ennemy : colors.player, 0.5, .4);
      playerMiniMap.add(arrowLookingAt);
      setTransform(entity.myObject3D, entity, false);
      scene.add(entity.myObject3D);
    }
    if (entity.isPlayer) {
      entity.myObject3D.playerMesh.rotation.y = -entity[childrenKey][1].rotation._y;
      entity.myObject3D.playerMiniMap.rotation.y = -entity[childrenKey][1].rotation._y;
      const skinnedMesh = entity[childrenKey][1][childrenKey][3];
      const isSneak = skinnedMesh.skeleton.bones[4].rotation._x > 0.1;
      entity.myObject3D.boxMesh.scale.set(1, isSneak ? .4 : 1, 1);
      entity.myObject3D.outline.scale.set(0.5, isSneak ? .9 : 1.25, 0.5);
      entity.myObject3D.playerMesh.scale.set(1, isSneak ? .7 : 1, 1);
 
      entity.myObject3D.visible = true;
      entity.myObject3D.playerMesh.visible = espConfig.showPlayer === 2 || (espConfig.showPlayer === 1 && !entity.ennemy);
      entity.myObject3D.boxMesh.visible = espConfig.showBox === 2 || (espConfig.showBox === 1 && entity.ennemy);
      entity.myObject3D.outline.visible = espConfig.showOutline === 2 || (espConfig.showOutline === 1 && entity.ennemy);
      setTransform(entity.myObject3D, entity, false);
 
      // aimbot and line
      const pos = entity.myObject3D.position.clone();
      pos.y -= isSneak ? espConfig.sneakHeight : 0;
      // line
      if (espConfig.showLine === 2 || (espConfig.showLine === 1 && entity.ennemy)) {
        if (espConfig.rainbow) {
          color.setHSL(time % 2000 / 2000, 1, 0.5);
        } else if (entity.ennemy) {
          color.lerpColors(colors.ennemy, colors.player, pos.distanceTo(camera.position) / espConfig.ennemyDistance);
          color.a = .8;
        } else {
          color.set(colors.blue);
          color.a = .3;
        }
        linePositions.push(lineOrigin.x, lineOrigin.y, lineOrigin.z);
        pos.y += 1.25;
        linePositions.push(pos.x, pos.y, pos.z);
        pos.y -= 1.25;
        colorArray.push(color.r, color.g, color.b, color.a);
        colorArray.push(color.r, color.g, color.b, color.a);
      }
      pos.y += espConfig.heightLine;
      // aimbot
      if (shouldAimbot && (entity.ennemy || espConfig.allEnnemies)) {
        const distance = pos.distanceTo(camera.position);
        const target = pos.clone();
        const dummy = new THREE.PerspectiveCamera();
        setTransform(dummy, worldCamera, false);
        dummy.lookAt(target);
        const cameraVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const targetVector = new THREE.Vector3(0, 0, -1).applyQuaternion(dummy.quaternion);
        const angleDifference = cameraVector.angleTo(targetVector);
        if (angleDifference < espConfig.maxAngleInRadians && angleDifference < aimbotTarget.angleDifference) {
          const directionV3 = new THREE.Vector3();
          directionV3.subVectors(target, camera.position).normalize();
          raycaster.set(camera.position, directionV3);
          let behindBlock = false;
          if (espConfig.aimbotIgnoreWall) {
            aimbotTarget.angleDifference = angleDifference;
            aimbotTarget.target = target;
          } else {
            for (const chunk of chunks) {
              if (raycaster.ray.intersectsBox(chunk.box)) {
                const hit = raycaster.intersectObject(chunk)[0];
                if (hit && hit.distance < distance) {
                  behindBlock = true;
                  break;
                }
              }
            }
            if (!behindBlock) {
              aimbotTarget.angleDifference = angleDifference;
              aimbotTarget.target = target;
              color.setHSL(time % 2000 / 2000, 1, 0.5);
            }
          }
        }
      }
    }
  });
 
  // aim at target
  if (espConfig.aimbot && shouldAimbot && aimbotTarget.target) {
    setTransform(dummyLookAt, worldCamera, false);
    dummyLookAt.lookAt(aimbotTarget.target);
    worldCamera.rotation.set(
      dummyLookAt.rotation.x,
      dummyLookAt.rotation.y,
      dummyLookAt.rotation.z
    );
  }
  // triggerbot
  const shouldTrigger = espConfig.triggerBot === 3 || (espConfig.triggerBot === 1 && isLeftClick) || (espConfig.triggerBot === 2 && isRightClick);
  if (shouldTrigger) {
    raycaster.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
    let hasHit = false;
    for (const entity of entities) {
      if (!entity.myObject3D.visible) continue;
      if (entity.isPlayer && (entity.ennemy || espConfig.allEnnemies)) {
        const hit = raycaster.intersectObject(entity.myObject3D.playerMesh);
        if (hit.length) {
          hasHit = true;
          const distance = hit[0].distance;
          for (const chunk of chunks) {
            if (raycaster.ray.intersectsBox(chunk.box)) {
              const hitBlock = raycaster.intersectObject(chunk)[0];
              if (hitBlock && hitBlock.distance < distance) {
                hasHit = false;
                break;
              }
            }
          }
          if (hasHit) {
            break;
          }
        }
      }
    }
    setFiring(hasHit);
  } else {
    setFiring(false);
  }
 
  line.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 4));
  line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  line.visible = espConfig.showLine;
 
  renderer.render(scene, camera);
 
  // minimap
  // make entities larger for minimap
  const scale = espConfig.mapZoom / 3;
  entities.forEach(entity => {
    if (entity.isPlayer) {
      entity.myObject3D.playerMesh.visible = false;
      entity.myObject3D.boxMesh.visible = false;
      entity.myObject3D.outline.visible = false;
      entity.myObject3D.playerMiniMap.visible = true;
      entity.myObject3D.playerMiniMap.scale.set(scale, 1, scale);
    }
  });
  if (worldCamera) {
    line.visible = false;
    crosshair.visible = false;
    // update orthographic camera based on espConfig.mapZoom
    minimapCamera.left = -espConfig.mapZoom;
    minimapCamera.right = espConfig.mapZoom;
    minimapCamera.top = espConfig.mapZoom;
    minimapCamera.bottom = -espConfig.mapZoom;
 
    // update position with camera position
    minimapCamera.position.copy(camera.position);
    minimapCamera.position.y += 50;
    minimapCamera.position.z += espConfig.mapOffsetZ;
    minimapCamera.rotation.y = camera.rotation.y;
    minimapCamera.updateProjectionMatrix();
 
    renderer.getViewport(saveViewport);
    renderer.getScissor(saveScissor);
    let saveScissorTest = renderer.getScissorTest();
    renderer.setViewport(minimapViewport);
    renderer.setScissor(minimapViewport);
    renderer.setScissorTest(true);
 
    renderer.render(scene, minimapCamera);
 
    renderer.setViewport(saveViewport);
    renderer.setScissor(saveScissor);
    renderer.setScissorTest(saveScissorTest);
  }
  entities.forEach(entity => {
    if (entity.isPlayer) {
      entity.myObject3D.playerMiniMap.visible = false;
    }
  });
 
  scene.children.forEach(child => {
    if (child.type === 'Object3D') {
      child.visible = false;
    }
  });
}
 
window.addEventListener('resize', () => {
  renderer.setSize( window.innerWidth, window.innerHeight );
});
 
// add style to header
style.innerHTML = `
#overlayCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}
#lil-gui {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 1001;
  transform: translateY(-50%);
}
.lil-gui {
  --background-color: rgba(0, 0, 0, 0.5);
}
`;
guiStyle.innerHTML = `
.lil-gui {
	--title-background-color: #ff0019;
	--number-color: #00ff33;
}
`;
document.head.appendChild(style);
document.head.appendChild(guiStyle);
 
// anti-afk
setInterval(() => {
  if (espConfig.antiAFK) {
    // move left for .5s then right for .5s
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 87}));
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 87}));
      document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 83}));
      setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 83}));
      }, 500);
    }, 500);
  }
}, 5000);
 
 
// wait for load
window.addEventListener('load', () => {
  console.log('Loaded');
  if (espConfig.autoClaimAds) {
    setTimeout(() => {
      claimAds();
    }, 500);
  }
});