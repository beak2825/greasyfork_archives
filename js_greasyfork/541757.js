// ==UserScript==
// @name         LinuxDo2048
// @namespace    http://tampermonkey.net/
// @version      2025-07-02
// @author       TigerWang
// @description  LinuxDo2048 25w分
// @license      MIT
// @match        https://2048.linux.do/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541757/LinuxDo2048.user.js
// @updateURL https://update.greasyfork.org/scripts/541757/LinuxDo2048.meta.js
// ==/UserScript==

(function () {
  // 标记 AI 是否正在运行
  let aiRunning = false;

  // Worker 内部代码（字符串形式）- 增强版本
  const workerCode = `var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}

// 新增: 最大化棋面价值策略 - 实现"清理与巩固"
function evaluateMaximizeBoardValue(board) {
  let score = 0;
  const tiles = [];
  const positions = [];
  
  // 提取所有非零数值和位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = (board[i] >> (12 - 4 * j)) & 0xf;
      if (tile > 0) {
        const value = 1 << tile;
        tiles.push(value);
        positions.push({i, j, value});
      }
    }
  }
  
  // 计算当前棋面总价值
  const totalValue = tiles.reduce((sum, tile) => sum + tile, 0);
  score += totalValue * 10; // 直接奖励高总分
  
  // 检测游戏阶段
  const count8192 = tiles.filter(x => x === 8192).length;
  const smallTiles = tiles.filter(x => x <= 32);
  const mediumTiles = tiles.filter(x => x >= 128 && x <= 512);
  
  // 动态策略选择
  const emptySpaces = 16 - tiles.length;
  
  if (count8192 >= 2) {
    // 双8192模式：最大化终盘价值，但避免合并
    score += evaluateEndgameValue(tiles, positions);
  } else if (count8192 === 1) {
    // 单8192策略：根据棋盘状况决定
    if (smallTiles.length > 8 && emptySpaces >= 3) {
      // 清理模式：小瓦片过多且有空间时清理
      score += evaluateCleanupPhase(tiles, positions);
    } else if (emptySpaces <= 2) {
      // 危险模式：空间不足时优先保持可玩性
      score += evaluateSurvivalMode(tiles, positions);
    } else {
      // 发展模式：继续向第二个8192努力
      score += evaluateSecond8192Growth(tiles, positions);
    }
  } else {
    // 标准发展模式
    score += evaluateStandardGrowth(tiles, positions);
  }
  
  // 中等瓦片保护奖励 - 平衡保护与发展
  if (count8192 >= 1) {
    // 已有8192时，适度保护中等瓦片
    score += mediumTiles.length * 5000;
    score += tiles.filter(x => x === 256).length * 8000;
    score += tiles.filter(x => x === 512).length * 12000;
  } else {
    // 没有8192时，优先发展大瓦片
    score += mediumTiles.length * 3000;
  }
  
  // 大瓦片发展奖励
  score += tiles.filter(x => x === 1024).length * 25000;
  score += tiles.filter(x => x === 2048).length * 50000;
  
  // 4096动态保护策略
  const tiles4096 = tiles.filter(x => x === 4096);
  if (count8192 === 0) {
    // 没有8192时，4096是发展目标
    score += tiles4096.length * 75000;
  } else if (count8192 === 1 && emptySpaces > 2) {
    // 有1个8192且空间充足时，可以发展第二个
    score += tiles4096.length * 40000;
  } else {
    // 其他情况适度保护
    score += tiles4096.length * 20000;
  }
  
  // 单调性评估
  score += getMonotonicity(board) * 1000;
  
  // 智能平滑性评估
  score += getSmartSmoothness(board, positions) * 500;
  
  // 空格数量与质量
  const emptyCount = 16 - tiles.length;
  score += emptyCount * 4000; // 增加空格权重
  
  // 容错空间评估
  if (emptyCount < 3) {
    score -= 50000; // 惩罚过满的棋盘
  }
  
  return score;
}

// 新增: 清理阶段评估
function evaluateCleanupPhase(tiles, positions) {
  let cleanupScore = 0;
  
  // 奖励小瓦片合并潜力
  const smallGroups = {};
  tiles.forEach(tile => {
    if (tile <= 32) {
      smallGroups[tile] = (smallGroups[tile] || 0) + 1;
    }
  });
  
  // 成对的小瓦片加分
  Object.entries(smallGroups).forEach(([value, count]) => {
    if (count >= 2) {
      cleanupScore += parseInt(value) * count * 100;
    }
  });
  
  // 惩罚过多的2和4
  const count2 = tiles.filter(x => x === 2).length;
  const count4 = tiles.filter(x => x === 4).length;
  if (count2 + count4 > 8) {
    cleanupScore -= (count2 + count4 - 8) * 10000;
  }
  
  return cleanupScore;
}

// 新增: 终盘价值评估
function evaluateEndgameValue(tiles, positions) {
  let endgameScore = 0;
  
  // 奖励保留高价值瓦片
  tiles.forEach(tile => {
    if (tile >= 256) {
      endgameScore += tile * 5; // 中高价值瓦片额外加分
    }
  });
  
  // 8192防合并保护
  const tiles8192Count = tiles.filter(x => x === 8192).length;
  if (tiles8192Count >= 2) {
    const pos8192 = positions.filter(p => p.value === 8192);
    let minSeparation = Infinity;
    
    for (let i = 0; i < pos8192.length - 1; i++) {
      for (let j = i + 1; j < pos8192.length; j++) {
        const distance = Math.abs(pos8192[i].i - pos8192[j].i) + 
                        Math.abs(pos8192[i].j - pos8192[j].j);
        minSeparation = Math.min(minSeparation, distance);
      }
    }
    
    if (minSeparation === 1) {
      endgameScore -= 300000; // 相邻8192惩罚
    } else if (minSeparation >= 3) {
      endgameScore += 100000; // 分离良好奖励
    }
  }
  
  return endgameScore;
}

// 新增: 标准发展评估
function evaluateStandardGrowth(tiles, positions) {
  let growthScore = 0;
  
  // 奖励瓦片升级链
  const upgradePotential = calculateUpgradePotential(tiles);
  growthScore += upgradePotential * 1000;
  
  return growthScore;
}

// 新增: 生存模式评估 - 棋盘满时保持可玩性
function evaluateSurvivalMode(tiles, positions) {
  let survivalScore = 0;
  
  // 优先保持移动可能性
  survivalScore += calculateMovePossibilities(tiles, positions) * 50000;
  
  // 降低对中等瓦片的过度保护
  const mediumTiles = tiles.filter(x => x >= 128 && x <= 512);
  if (mediumTiles.length > 4) {
    survivalScore -= 20000; // 中等瓦片过多时减分
  }
  
  return survivalScore;
}

// 新增: 第二个8192发展模式
function evaluateSecond8192Growth(tiles, positions) {
  let growthScore = 0;
  
  // 奖励4096的存在和发展
  const count4096 = tiles.filter(x => x === 4096).length;
  const count2048 = tiles.filter(x => x === 2048).length;
  const count1024 = tiles.filter(x => x === 1024).length;
  
  // 4096是第二个8192的关键
  growthScore += count4096 * 80000;
  
  // 2048链条发展
  growthScore += count2048 * 30000;
  growthScore += count1024 * 15000;
  
  // 如果有多个4096，优先合并其中一个
  if (count4096 >= 2) {
    growthScore += 100000;
  }
  
  return growthScore;
}

// 新增: 计算移动可能性
function calculateMovePossibilities(tiles, positions) {
  let possibilities = 0;
  
  // 检查相邻相同瓦片（可合并）
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      
      // 相邻且相同值
      if (pos1.value === pos2.value &&
          ((Math.abs(pos1.i - pos2.i) === 1 && pos1.j === pos2.j) ||
           (Math.abs(pos1.j - pos2.j) === 1 && pos1.i === pos2.i))) {
        possibilities += pos1.value; // 大瓦片合并更有价值
      }
    }
  }
  
  return possibilities;
}

// 新增: 计算升级潜力
function calculateUpgradePotential(tiles) {
  const tileCounts = {};
  tiles.forEach(tile => {
    tileCounts[tile] = (tileCounts[tile] || 0) + 1;
  });
  
  let potential = 0;
  Object.entries(tileCounts).forEach(([value, count]) => {
    if (count >= 2) {
      potential += parseInt(value) * (count - 1);
    }
  });
  
  return potential;
}

// 新增: 智能平滑性评估
function getSmartSmoothness(board, positions) {
  let smooth = 0;
  
  // 根据瓦片大小调整平滑性权重
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      
      // 相邻瓦片
      if ((Math.abs(pos1.i - pos2.i) === 1 && pos1.j === pos2.j) ||
          (Math.abs(pos1.j - pos2.j) === 1 && pos1.i === pos2.i)) {
        
        const ratio = Math.max(pos1.value, pos2.value) / Math.min(pos1.value, pos2.value);
        
        // 2倍关系最理想
        if (ratio === 2) {
          smooth += 100;
        } else if (ratio === 4) {
          smooth += 50;
        } else if (ratio > 4) {
          smooth -= (ratio - 4) * 20;
        }
      }
    }
  }
  
  return smooth;
}

// 新增: 排除8192的平滑性计算
function getSmoothnessExclude8192(board, positions) {
  let smooth = 0;
  const pos8192 = positions.filter(p => p.value === 8192);
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const curr = (board[i] >> (12 - 4 * j)) & 0xf;
      const next = (board[i] >> (12 - 4 * (j + 1))) & 0xf;
      
      // 跳过涉及8192的平滑性计算
      const currVal = curr > 0 ? (1 << curr) : 0;
      const nextVal = next > 0 ? (1 << next) : 0;
      
      if (currVal === 8192 || nextVal === 8192) continue;
      
      if (curr > 0 && next > 0) {
        smooth -= Math.abs(curr - next);
      }
    }
  }
  return smooth;
}

// 新增: 检测8192合并风险
function detect8192MergeRisk(board) {
  let riskLevel = 0;
  const positions8192 = [];
  
  // 找到所有8192的位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = (board[i] >> (12 - 4 * j)) & 0xf;
      if ((1 << tile) === 8192) {
        positions8192.push({i, j});
      }
    }
  }
  
  if (positions8192.length < 2) return 0;
  
  // 检查8192之间的关系
  for (let a = 0; a < positions8192.length; a++) {
    for (let b = a + 1; b < positions8192.length; b++) {
      const pos1 = positions8192[a];
      const pos2 = positions8192[b];
      
      // 同行或同列的8192
      if (pos1.i === pos2.i || pos1.j === pos2.j) {
        const distance = Math.abs(pos1.i - pos2.i) + Math.abs(pos1.j - pos2.j);
        
        if (distance === 1) {
          // 直接相邻：极高风险
          riskLevel += 5;
        } else {
          // 同行/列但不相邻：检查中间是否有空格
          let hasEmptyBetween = false;
          
          if (pos1.i === pos2.i) {
            // 同行
            const minJ = Math.min(pos1.j, pos2.j);
            const maxJ = Math.max(pos1.j, pos2.j);
            for (let j = minJ + 1; j < maxJ; j++) {
              const tile = (board[pos1.i] >> (12 - 4 * j)) & 0xf;
              if (tile === 0) {
                hasEmptyBetween = true;
                break;
              }
            }
          } else {
            // 同列
            const minI = Math.min(pos1.i, pos2.i);
            const maxI = Math.max(pos1.i, pos2.i);
            for (let i = minI + 1; i < maxI; i++) {
              const tile = (board[i] >> (12 - 4 * pos1.j)) & 0xf;
              if (tile === 0) {
                hasEmptyBetween = true;
                break;
              }
            }
          }
          
          if (!hasEmptyBetween) {
            // 同行/列且中间无空格：高风险
            riskLevel += 3;
          } else {
            // 同行/列但中间有空格：中风险
            riskLevel += 1;
          }
        }
      }
    }
  }
  
  return riskLevel;
}

// 新增: 计算8192分离度
function calculate8192Separation(board) {
  const positions8192 = [];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = (board[i] >> (12 - 4 * j)) & 0xf;
      if ((1 << tile) === 8192) {
        positions8192.push({i, j});
      }
    }
  }
  
  if (positions8192.length < 2) return 0;
  
  // 计算8192之间的最小距离
  let minDistance = Infinity;
  for (let a = 0; a < positions8192.length; a++) {
    for (let b = a + 1; b < positions8192.length; b++) {
      const pos1 = positions8192[a];
      const pos2 = positions8192[b];
      const distance = Math.abs(pos1.i - pos2.i) + Math.abs(pos1.j - pos2.j);
      minDistance = Math.min(minDistance, distance);
    }
  }
  
  return minDistance; // 距离越远越好
}

// 新增: 单调性计算
function getMonotonicity(board) {
  let mono = 0;
  for (let i = 0; i < 4; i++) {
    let inc = 0, dec = 0;
    for (let j = 0; j < 3; j++) {
      const curr = (board[i] >> (12 - 4 * j)) & 0xf;
      const next = (board[i] >> (12 - 4 * (j + 1))) & 0xf;
      if (curr > next) inc++;
      if (curr < next) dec++;
    }
    mono += Math.max(inc, dec);
  }
  return mono;
}

// 新增: 平滑性计算
function getSmoothness(board) {
  let smooth = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const curr = (board[i] >> (12 - 4 * j)) & 0xf;
      const next = (board[i] >> (12 - 4 * (j + 1))) & 0xf;
      if (curr > 0 && next > 0) {
        smooth -= Math.abs(curr - next);
      }
    }
  }
  return smooth;
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function (status, toThrow) {
    throw toThrow
};

var scriptDirectory = "";
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;
var nodeFS;
var nodePath;

scriptDirectory = self.location.href
if (scriptDirectory.indexOf("blob:") !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
} else {
    scriptDirectory = ""
}
{
    read_ = function shell_read(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText
    }
    readBinary = function readBinary(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(xhr.response)
    }
    readAsync = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
            }
            onerror()
        }
            ;
        xhr.onerror = onerror;
        xhr.send(null)
    }
}
setWindowTitle = function (title) {
    document.title = title
}

var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = null;
if (Module["arguments"])
    arguments_ = Module["arguments"];
if (Module["thisProgram"])
    thisProgram = Module["thisProgram"];
if (Module["quit"])
    quit_ = Module["quit"];
var wasmBinary;
if (Module["wasmBinary"])
    wasmBinary = Module["wasmBinary"];
var noExitRuntime;
if (Module["noExitRuntime"])
    noExitRuntime = Module["noExitRuntime"];
if (typeof WebAssembly !== "object") {
    abort("no native wasm support detected")
}
var wasmMemory;
var wasmTable;
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr))
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
    return str
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}
var WASM_PAGE_SIZE = 65536;
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 134217728;
if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"]
} else {
    wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
        "maximum": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
    })
}
if (wasmMemory) {
    buffer = wasmMemory.buffer
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
            Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}
function initRuntime() {
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__)
}
function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}
function exitRuntime() {
    runtimeExited = true
}
function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
            Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}
function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}
function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    what += "";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e
}
function hasPrefix(str, prefix) {
    return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
    return hasPrefix(filename, dataURIPrefix)
}
var fileURIPrefix = "file://";
function isFileURI(filename) {
    return hasPrefix(filename, fileURIPrefix)
}
var wasmBinaryFile = "data:application/octet-stream;base64,AGFzbQEAAAABUA5gAABgAn9/AX9gAX8AYAABf2ABfgF/YAABfmABfwF+YAJ/fwF+YAN/fn8BfmAFf39/f38BfWAEf35/fQF9YAJ+fwF9YAJ8fwF8YAJ8fAF8Ah0EAWEBYgAAAWEBYwABAWEBZAACAWEBYQIBgBCAEAMTEg0KCAQAAAAAAQsMBgEHBQMBCQQFAXABAQEGCQF/AUHwkeAyCwcVBQFlAQABZgAHAWcAFAFoABMBaQASCoY0EtMPAwh/An4IfEQAAAAAAADwPyEMAkACQAJAIAG9IgpCIIinIgNB/////wdxIgIgCqciBnJFDQAgAL0iC0IgiKchBSALpyIJRUEAIAVBgIDA/wNGGw0AAkACQCAFQf////8HcSIEQYCAwP8HSw0AIARBgIDA/wdGIAlBAEdxDQAgAkGAgMD/B0sNACAGRQ0BIAJBgIDA/wdHDQELIAAgAaAPCwJAAkACfwJAIAVBf0oNAEECIAJB////mQRLDQEaIAJBgIDA/wNJDQAgAkEUdiEHIAJBgICAigRPBEBBACAGQbMIIAdrIgh2IgcgCHQgBkcNAhpBAiAHQQFxawwCCyAGDQMgAkGTCCAHayIGdiIHIAZ0IAJHDQJBAiAHQQFxayEIDAILQQALIQggBg0BCyACQYCAwP8HRgRAIARBgIDAgHxqIAlyRQ0CIARBgIDA/wNPBEAgAUQAAAAAAAAAACADQX9KGw8LRAAAAAAAAAAAIAGaIANBf0obDwsgAkGAgMD/A0YEQCADQX9KBEAgAA8LRAAAAAAAAPA/IACjDwsgA0GAgICABEYEQCAAIACiDwsgBUEASA0AIANBgICA/wNHDQAgAJ8PCyAAmSEMAkAgCQ0AIAVB/////wNxQYCAwP8DR0EAIAQbDQBEAAAAAAAA8D8gDKMgDCADQQBIGyEMIAVBf0oNASAIIARBgIDAgHxqckUEQCAMIAyhIgAgAKMPCyAMmiAMIAhBAUYbDwtEAAAAAAAA8D8hDQJAIAVBf0oNAAJAAkAgCA4CAAECCyAAIAChIgAgAKMPC0QAAAAAAADwvyENCwJ8IAJBgYCAjwRPBEAgAkGBgMCfBE8EQCAEQf//v/8DTQRARAAAAAAAAPB/RAAAAAAAAAAAIANBAEgbDwtEAAAAAAAA8H9EAAAAAAAAAAAgA0EAShsPCyAEQf7/v/8DTQRAIA1EnHUAiDzkN36iRJx1AIg85Dd+oiANRFnz+MIfbqUBokRZ8/jCH26lAaIgA0EASBsPCyAEQYGAwP8DTwRAIA1EnHUAiDzkN36iRJx1AIg85Dd+oiANRFnz+MIfbqUBokRZ8/jCH26lAaIgA0EAShsPCyAMRAAAAAAAAPC/oCIARAAAAGBHFfc/oiIMIABERN9d+AuuVD6iIAAgAKJEAAAAAAAA4D8gACAARAAAAAAAANC/okRVVVVVVVXVP6CioaJE/oIrZUcV97+ioCIPoL1CgICAgHCDvyIAIAyhDAELIAxEAAAAAAAAQEOiIgAgDCAEQYCAwABJIgIbIQwgAL1CIIinIAQgAhsiBEH//z9xIgVBgIDA/wNyIQMgBEEUdUHMd0GBeCACG2ohBEEAIQICQCAFQY+xDkkNACAFQfrsLkkEQEEBIQIMAQsgA0GAgEBqIQMgBEEBaiEECyACQQN0IgVBoAlqKwMAIhEgDL1C/////w+DIAOtQiCGhL8iDyAFQYAJaisDACIOoSIQRAAAAAAAAPA/IA4gD6CjIhKiIgy9QoCAgIBwg78iACAAIACiIhNEAAAAAAAACECgIAwgAKAgEiAQIAAgA0EBdUGAgICAAnIgAkESdGpBgIAgaq1CIIa/IhCioSAAIA8gECAOoaGioaIiD6IgDCAMoiIAIACiIAAgACAAIAAgAETvTkVKKH7KP6JEZdvJk0qGzT+gokQBQR2pYHTRP6CiRE0mj1FVVdU/oKJE/6tv27Zt2z+gokQDMzMzMzPjP6CioCIOoL1CgICAgHCDvyIAoiIQIA8gAKIgDCAOIABEAAAAAAAACMCgIBOhoaKgIgygvUKAgICAcIO/IgBEAAAA4AnH7j+iIg4gBUGQCWorAwAgDCAAIBChoUT9AzrcCcfuP6IgAET1AVsU4C8+vqKgoCIPoKAgBLciDKC9QoCAgIBwg78iACAMoSARoSAOoQshDiAAIApCgICAgHCDvyIRoiIMIA8gDqEgAaIgASARoSAAoqAiAKAiAb0iCqchAgJAIApCIIinIgNBgIDAhAROBEAgA0GAgMD7e2ogAnINAyAARP6CK2VHFZc8oCABIAyhZEEBcw0BDAMLIANBgPj//wdxQYCYw4QESQ0AIANBgOi8+wNqIAJyDQMgACABIAyhZUEBcw0ADAMLQQAhAiANAnwgA0H/////B3EiBEGBgID/A08EfkEAQYCAwAAgBEEUdkGCeGp2IANqIgRB//8/cUGAgMAAckGTCCAEQRR2Qf8PcSIFa3YiAmsgAiADQQBIGyECIAAgDEGAgEAgBUGBeGp1IARxrUIghr+hIgygvQUgCgtCgICAgHCDvyIBRAAAAABDLuY/oiINIAAgASAMoaFE7zn6/kIu5j+iIAFEOWyoDGFcIL6ioCIMoCIAIAAgACAAIACiIgEgASABIAEgAUTQpL5yaTdmPqJE8WvSxUG9u76gokQs3iWvalYRP6CiRJO9vhZswWa/oKJEPlVVVVVVxT+goqEiAaIgAUQAAAAAAAAAwKCjIAwgACANoaEiASAAIAGioKGhRAAAAAAAAPA/oCIAvSIKQiCIpyACQRR0aiIDQf//P0wEQCAAIAIQDQwBCyAKQv////8PgyADrUIghoS/C6IhDAsgDA8LIA1EnHUAiDzkN36iRJx1AIg85Dd+og8LIA1EWfP4wh9upQGiRFnz+MIfbqUBogvyBwQEfwR+Bn0CfAJAIAJBAU4EQCAAKgKIgCAgA15BAXMNAQsgACABQjCIp0ECdGoqAgAgACABQiCIp0H//wNxQQJ0aioCAJIgACABpyICQQ52Qfz/D3FqKgIAkiAAIAJB//8DcUECdGoqAgCSIAAgASABQgyIIAGFQvDhg4CAnjyDIgFCDIYgAYSFIgFCGIggAYVCgP6D+A+DIgpCGIYgCoQgAYUiAUIwiKdBAnRqKgIAIAAgAUIgiKdB//8DcUECdGoqAgCSIAAgAaciAkEOdkH8/w9xaioCAJIgACACQf//A3FBAnRqKgIAkpIPCyAAKAKAgCAhBwJAIAEQBiIFQRhsIgZB2AlqKQMAIAFSDQAgBkHkCWooAgAiBiACSA0AAn8gBUEYbCIFQegJaigCALcgArIgBrKVuxADIhKZRAAAAAAAAOBBYwRAIBKqDAELQYCAgIB4CyEEIAVB4AlqKgIAIQwLIAAgACgCgIAgIARqIgQ2AoCAICAEIAdMBEAgA7siEkSamZmZmZm5P6IgAUJ/hSIKQgKIIAqDIgogCkIBiINCkaLEiJGixIgRg0KRosSIkaLEiBF+QjyIp7IiEbsiE6O2IQ4gEkTNzMzMzMzsP6IgE6O2IQ8gAEGAgBBqIQQgAkF/aiEFQgEhCyABIQoDQCAKQg+DUARAIAAgACgCgIAgQQFqNgKAgCBDAAAAACEDIAQgASALhCIIQQAQBSIJIAhSBEAgACAJIAUgDxAEIgNDAAAAACADQwAAAABeGyEDCyAIIAQgCEEBEAUiCVIEQCAAIAkgBSAPEAQiDCADIAMgDF0bIQMLIAggBCAIQQIQBSIJUgRAIAAgCSAFIA8QBCIMIAMgAyAMXRshAwsgCCAEIAhBAxAFIglSBEAgACAJIAUgDxAEIgwgAyADIAxdGyEDCyAAIAAoAoCAIEEBajYCgIAgQwAAAAAhDCAEIAtCAYYgAYQiCEEAEAUiCSAIUgRAIAAgCSAFIA4QBCIMQwAAAAAgDEMAAAAAXhshDAsgCCAEIAhBARAFIglSBEAgACAJIAUgDhAEIg0gDCAMIA1dGyEMCyAIIAQgCEECEAUiCVIEQCAAIAkgBSAOEAQiDSAMIAwgDV0bIQwLIAggBCAIQQMQBSIJUgR9IAAgCSAFIA4QBCINIAwgDCANXRsFIAwLu0SamZmZmZm5P6IgA7tEzczMzMzM7D+iIBC7oLa7oLYhEAsgCkIEiCEKIAtCBIYiC1BFDQALIAAoAoCAICEEIAEQBkEYbCIAQeQJaiACNgIAIABB2AlqIAE3AwAgAEHoCWogBCAHazYCACAAQeAJaiAQIBGVIgw4AgALIAwL1QQBAX4CQAJAAkACQAJAIAIOBAABAgMECyAAIAEgAUIMiCABhULw4YOAgJ48gyIBQgyGIAGEhSIBQhiIIAGFQoD+g/gPgyIDQhiGIAOEIAGFIgGnIgJBD3ZB/v8HcWozAQBCEIYgACACQf//A3FBAXRqMwEAhCAAIAFCIIinQf//A3FBAXRqMwEAQiCGhCIDIAAgAUIwiKdBAXRqMwEAQjCGhCIBQgyIIAOFQvDhg4CAnjyDIgNCDIYgA4QgAYUiAUIYiCABhUKA/oP4D4MiA0IYhiADhCABhQ8LIABBgIAIaiIAIAGnIgJBD3ZB/v8HcWozAQBCEIYgACACQf//A3FBAXRqMwEAhCAAIAFCIIinQf//A3FBAXRqMwEAQiCGhCAAIAFCMIinQQF0ajMBAEIwhoQPCyAAQYCACGoiACABIAFCDIggAYVC8OGDgICePIMiAUIMhiABhIUiAUIYiCABhUKA/oP4D4MiA0IYhiADhCABhSIBpyICQQ92Qf7/B3FqMwEAQhCGIAAgAkH//wNxQQF0ajMBAIQgACABQiCIp0H//wNxQQF0ajMBAEIghoQiAyAAIAFCMIinQQF0ajMBAEIwhoQiAUIMiCADhULw4YOAgJ48gyIDQgyGIAOEIAGFIgFCGIggAYVCgP6D+A+DIgNCGIYgA4QgAYUPCyAAIAGnIgJBD3ZB/v8HcWozAQBCEIYgACACQf//A3FBAXRqMwEAhCAAIAFCIIinQf//A3FBAXRqMwEAQiCGhCAAIAFCMIinQQF0ajMBAEIwhoQhAQsgAQv/AgEBfyAAQjyIp0ECdEHAB3JB2ImAMGooAgAgAEI4iKdBD3FBAnRBgAdyQdiJgDBqKAIAIABCNIinQQ9xQQJ0QcAGckHYiYAwaigCACAAQjCIp0EPcUECdEGABnJB2ImAMGooAgAgAEIsiKdBD3FBAnRBwAVyQdiJgDBqKAIAIABCKIinQQ9xQQJ0QYAFckHYiYAwaigCACAAQiSIp0EPcUECdEHABHJB2ImAMGooAgAgAEIgiKdBD3FBAnRBgARyQdiJgDBqKAIAIACnIgFBGnZBPHFBwANyQdiJgDBqKAIAIAFBFnZBPHFBgANyQdiJgDBqKAIAIAFBEnZBPHFBwAJyQdiJgDBqKAIAIAFBDnZBPHFBgAJyQdiJgDBqKAIAIAFBCnZBPHFBwAFyQdiJgDBqKAIAIAFBBnZBPHFBgAFyQdiJgDBqKAIAIAFBAnZBPHFBwAByQdiJgDBqKAIAIAFBD3FBAnRB2ImAMGooAgBzc3Nzc3Nzc3Nzc3Nzc3MLBAAQCAupAQEDfyMAQdATayIAJAAgABARpyICNgIIQQEhAQNAIABBCGogAUECdGogAkEediACc0Hlkp7gBmwgAWoiAjYCACABQQFqIgFB8ARHDQALQQAhASAAQQA2AsgTIABCgICAgPD//x83AwADQCABQQJ0QdiJgDBqIABBCGogABALNgIAIAFBAWoiAUGAAkcNAAsQChAJQdiRoDBCgICAgDA3AgAgAEHQE2okAAu/BAEHfyMAQRBrIQEDQCABIARBDHYiADYCDCABIARBD3E2AgAgASAEQQh2IgZBD3EiBTYCCCABIARBBHZBD3E2AgQCfwJAIAAEQEEAIQIgBQ0BQQAhA0ECIQBBAQwCCyAFRQRAQQMhAEEAIQNBACECQQAMAgtBACEDIAFBADYCCCABIAU2AgxBAiEAQQAhAkEBDAELQQEhA0EBIQBBASAFIAEoAgxHDQAaQQAhAyABQQA2AgggASAGQQFqQQ9xNgIMQQIhAEEBIQJBAQshBgJ/IAEoAgQiBQRAAkAgAkEBcyAGcQRAIAUgAEECdCABciIGKAIERg0BC0EAIAMNAhogASAAQQJ0ciAFNgIAQQAhAiABQQA2AgQgAEF/agwCCyAGIAVBAWpBD3E2AgQgAUEANgIEQQEhAgsgAAshAwJAIAEoAgAiAEUEQEEAIQAMAQsCQAJAAkAgA0ECSg0AIAJBAXNFDQAgACADQQJ0IAFqIgIoAgRGDQELIANFDQIgASADQQJ0aiAANgIADAELIAIgAEEBakEPcTYCBAtBACEAIAFBADYCAAsgBEEBdEHYkZAwaiABKAIEQQR0IAByIAEoAghBCHRyIAEoAgxBDHRyIgA7AQAgBEEEdEGAHnEgBEEMdCAEQf//A3EiAkEMdnIgAkEEdkHwAXFyckH//wNxQQF0QdiRmDBqIABBBHRBgB5xIABBDHQgAEH//wNxIgBBDHZyIABBBHZB8AFxcnI7AQAgBEEBaiIEQYCABEcNAAsLuwUDCn8DfQJ8A0AgBUEPcSIEt0QAAAAAAAAMQBADIQ0gBUEEdkEPcSICt0QAAAAAAAAMQBADIA1EAAAAAAAAAACgtrugtiEMIAVBCHZBD3EhAAJ/IAIEQCACIARGIQEgBEUhBiACDAELQQFBAiAEGyEGQQAhASAECyEJIAVBDHYhByAAt0QAAAAAAAAMQBADIAy7oCENAn8gAARAIAFBAWohA0EAIQggACAJRgRAIAAhCSADDAILIANBACABGyEIIAAhCUEAIAEgARsMAQsgBkEBaiEGQQAhCCABCyEDIA22IQwgB7dEAAAAAAAADEAQAyEOAkACQCAHBEAgByAJRg0BQQAhASADQQFIDQIgAyAIakEBaiEIDAILIAZBAWohBiADQQFOBEAgA0EBaiEBDAILQQAhAQwBCyADQQJqIQELIAy7IQ0CfSAEIAJLBEAgBLhEAAAAAAAAEEAQAyACuEQAAAAAAAAQQBADoUQAAAAAAAAAAKC2IQpDAAAAAAwBC0MAAAAAIQogArhEAAAAAAAAEEAQAyAEuEQAAAAAAAAQQBADoUQAAAAAAAAAAKC2CyELIA4gDaAhDQJAIAIgAE0EQCAAuEQAAAAAAAAQQBADIAK4RAAAAAAAABBAEAOhIAu7oLYhCwwBCyACuEQAAAAAAAAQQBADIAC4RAAAAAAAABBAEAOhIAq7oLYhCgsgDbYhDAJAIAAgB00EQCAHuEQAAAAAAAAQQBADIAC4RAAAAAAAABBAEAOhIAu7oLYhCwwBCyAAuEQAAAAAAAAQQBADIAe4RAAAAAAAABBAEAOhIAq7oLYhCgsgBUECdEHYkYAwaiAGskMAAIdDlEMAUENIkiABIAhqskMAAC9ElJIgCyAKIAsgCl0bQwAAPMKUkiAMQwAAMMGUkjgCACAFQQFqIgVBgIAERw0ACwuoAwEFfyABKAIEIAEoAgAiAmsiBAR/IARBAWoiBEUEQCAAIAAoAsATIgFBAnRqIgIgACABQY0DakHwBHBBAnRqKAIAIAAgAUEBakHwBHAiBEECdGooAgAiAUEBcUHf4aLIeWxzIAFB/v///wdxIAIoAgBBgICAgHhxckEBdnMiATYCACAAIAQ2AsATIAFBC3YgAXMiAEEHdEGArbHpeXEgAHMiAEEPdEGAgJj+fnEgAHMiAEESdiAAcw8LQQBBf0EgQSBBHyAEIARnIgJ0Qf////8HcRsgAmsiAiACQQV2IAJBH3FBAEdqIgNua3YgAyACSxshBSAAKALAEyECA0AgACACQQJ0aiIDIAAgAkGNA2pB8ARwQQJ0aigCACAAIAJBAWpB8ARwIgJBAnRqKAIAIgZBAXFB3+GiyHlscyAGQf7///8HcSADKAIAQYCAgIB4cXJBAXZzIgM2AgAgA0ELdiADcyIDQQd0QYCtsel5cSADcyIDQQ90QYCAmP5+cSADcyIDQRJ2IANzIAVxIgMgBE8NAAsgACACNgLAEyABKAIAIANqBSACCwvfAQMEfwF+AX0CQCAAQdiRkDAgACABEAUiBlENAEHYkaAwQQA2AgBB4JGgMEMAAIA/QQFB3JGgMCgCACIBQQF0QQVqdLKVOAIAQdiRgDAgBiABQwAAgD8QBCEHQdiRoDAoAgAiAkEBIAFBA2xBBWp0IgNODQAgAkEBSA0AA0BB2JGgMEEANgIAQeCRoDBDAACAP0EBIAFBAWoiAUEBdEEFanSylTgCAEHYkYAwIAYgAUMAAIA/EAQhB0HYkaAwKAIAIgQgA0EBdCIDTg0BIAQgAkohBSAEIQIgBQ0ACwsgBwuoAQACQCABQYAITgRAIABEAAAAAAAA4H+iIQAgAUH/D0gEQCABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAABAAoiEAIAFBg3BKBEAgAUH+B2ohAQwBCyAARAAAAAAAABAAoiEAIAFBhmggAUGGaEobQfwPaiEBCyAAIAFB/wdqrUI0hr+iCz8CAX8BfiMAQRBrIgEkACABIAApAwBCgJTr3AN+NwMAIAFBCGoiACABKQMANwMAIAApAwAhAiABQRBqJAAgAgs/AgJ/AX4jAEEQayICJAAjAEEQayIDJAAgARAOIQQgA0EQaiQAIAIgBDcDCCAAIAIpAwg3AwAgAkEQaiQAIAALUwIBfwF+IwBBIGsiAiQAIAJBCGogABAPKQMAIQMgAiABKQMANwMAIAIgAyACKQMAfDcDECACQRhqIgAgAikDEDcDACAAKQMAIQMgAkEgaiQAIAMLewICfwF+IwBBMGsiACQAQQEgAEEgahABBEBB5JGgMCgCABoQAAALIAACfyAAQRBqIgEgADQCIDcDACABCwJ/IABBCGoiASAAQSBqQQRyNAIANwMAIAELEBA3AxggAEEoaiIBIAApAxg3AwAgASkDACECIABBMGokACACCwcAQeSRoDALCQBBgAgQAkEACx4AIAOtIAGtQiCGIACtQjCGhCACrUIQhoSEIAQQDAsLywEDAEGACAt0b25tZXNzYWdlPWU9PnBvc3RNZXNzYWdlKE1vZHVsZS5fanNXb3JrKGUuZGF0YS5ib2FyZFswXSxlLmRhdGEuYm9hcmRbMV0sZS5kYXRhLmJvYXJkWzJdLGUuZGF0YS5ib2FyZFszXSxlLmRhdGEuZGlyKSkAQYYJCxrwPwAAAAAAAPg/AAAAAAAAAAAG0M9D6/1MPgBBqwkLKkADuOI/Y2xvY2tfZ2V0dGltZShDTE9DS19NT05PVE9OSUMpIGZhaWxlZA==";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}
function getBinary() {
    try {
        if (wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(wasmBinaryFile)
        } else {
            throw "both async and sync fetching of the wasm failed"
        }
    } catch (err) {
        abort(err)
    }
}
function getBinaryPromise() {
    if (!wasmBinary && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
        return fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }).then(function (response) {
            if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
            }
            return response["arrayBuffer"]()
        }).catch(function () {
            return getBinary()
        })
    }
    return Promise.resolve().then(getBinary)
}
function createWasm() {
    var info = {
        "a": asmLibraryArg
    };
    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmTable = Module["asm"]["e"];
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");
    function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"])
    }
    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function (binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }
    function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
            fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function (response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiatedSource, function (reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(receiveInstantiatedSource)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiatedSource)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    instantiateAsync();
    return {}
}
function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback(Module);
            continue
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                wasmTable.get(func)()
            } else {
                wasmTable.get(func)(callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
function _abort() {
    abort()
}
var _emscripten_get_now = function () {
    return performance.now()
}
var _emscripten_get_now_is_monotonic = true;
function setErrNo(value) {
    HEAP32[___errno_location() >> 2] = value;
    return value
}
function _clock_gettime(clk_id, tp) {
    var now;
    if (clk_id === 0) {
        now = Date.now()
    } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
        now = _emscripten_get_now()
    } else {
        setErrNo(28);
        return -1
    }
    HEAP32[tp >> 2] = now / 1e3 | 0;
    HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
    return 0
}
function _emscripten_run_script(ptr) {
    eval(UTF8ToString(ptr))
}
__ATINIT__.push({
    func: function () {
        ___wasm_call_ctors()
    }
});
var asmLibraryArg = {
    "b": _abort,
    "c": _clock_gettime,
    "d": _emscripten_run_script,
    "a": wasmMemory
};
var asm = createWasm();
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["f"]).apply(null, arguments)
}
    ;
var _jsWork = Module["_jsWork"] = function () {
    return (_jsWork = Module["_jsWork"] = Module["asm"]["g"]).apply(null, arguments)
}
    ;
var _main = Module["_main"] = function () {
    return (_main = Module["_main"] = Module["asm"]["h"]).apply(null, arguments)
}
    ;
var ___errno_location = Module["___errno_location"] = function () {
    return (___errno_location = Module["___errno_location"] = Module["asm"]["i"]).apply(null, arguments)
}
    ;
var calledRun;
function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!calledRun)
        run();
    if (!calledRun)
        dependenciesFulfilled = runCaller
}
    ;
function callMain(args) {
    var entryFunction = Module["_main"];
    var argc = 0;
    var argv = 0;
    try {
        var ret = entryFunction(argc, argv);
        exit(ret, true)
    } catch (e) {
        if (e instanceof ExitStatus) {
            return
        } else if (e == "unwind") {
            noExitRuntime = true;
            return
        } else {
            var toLog = e;
            if (e && typeof e === "object" && e.stack) {
                toLog = [e, e.stack]
            }
            err("exception thrown: " + toLog);
            quit_(1, e)
        }
    } finally {
        calledMain = true
    }
}
function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return
    }
    preRun();
    if (runDependencies > 0)
        return;
    function doRun() {
        if (calledRun)
            return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
            return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"])
            Module["onRuntimeInitialized"]();
        if (shouldRunNow)
            callMain(args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
            setTimeout(function () {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
Module["run"] = run;
function exit(status, implicit) {
    if (implicit && noExitRuntime && status === 0) {
        return
    }
    if (noExitRuntime) { } else {
        EXITSTATUS = status;
        exitRuntime();
        if (Module["onExit"])
            Module["onExit"](status);
        ABORT = true
    }
    quit_(status, new ExitStatus(status))
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"])
    shouldRunNow = false;
noExitRuntime = true;
run();

// 增强的Worker消息处理 - 最大化棋面价值策略
self.onmessage = function(e) {
  const { board, dir, depth = 3, stage = 'middle' } = e.data;
  
  // 根据游戏阶段选择评估策略
  let result;
  
  if (stage === 'cleanup') {
    // 清理阶段：专注清理小瓦片
    result = evaluateMaximizeBoardValue(board);
  } else if (stage === 'survival') {
    // 生存模式：优先保持可玩性
    const baseResult = Module._jsWork(board[0], board[1], board[2], board[3], dir);
    const valueScore = evaluateMaximizeBoardValue(board);
    result = baseResult * 0.7 + valueScore * 0.3; // 优先基础算法
  } else if (stage === 'second8192') {
    // 第二个8192发展模式：平衡发展
    const baseResult = Module._jsWork(board[0], board[1], board[2], board[3], dir);
    const valueScore = evaluateMaximizeBoardValue(board);
    result = baseResult * 0.6 + valueScore * 0.4; // 略偏向基础算法
  } else if (stage === 'double8192' || stage === 'continue') {
    // 续局/终盘模式：最大化棋面价值
    const baseResult = Module._jsWork(board[0], board[1], board[2], board[3], dir);
    const valueScore = evaluateMaximizeBoardValue(board);
    result = baseResult * 0.3 + valueScore * 0.7; // 价值策略占70%权重
  } else if (stage === 'late') {
    // 后期模式：平衡发展与价值
    const baseResult = Module._jsWork(board[0], board[1], board[2], board[3], dir);
    const valueScore = evaluateMaximizeBoardValue(board);
    result = baseResult * 0.5 + valueScore * 0.5; // 各占50%
  } else {
    // 早中期使用原始WASM算法
    result = Module._jsWork(board[0], board[1], board[2], board[3], dir);
  }
  
  self.postMessage(result);
};
`;

  // 创建 Blob 和 URL
  const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(workerBlob);

  // 创建工作线程
  const workers = [
    new Worker(workerUrl),
    new Worker(workerUrl),
    new Worker(workerUrl),
    new Worker(workerUrl)
  ];

  let working = 0;  // 当前正在执行的任务数量
  let startTime, totalMove;  // 记录 AI 启动时间 记录 AI 执行的总步数
  let oldBoard = "";
  let resultArray = [null, null, null, null];

  for (let i = 0; i < 4; ++i) {
    // 每个工作线程在完成计算后会发送一个消息回来，包含当前方向的评估值。
    workers[i].onmessage = ({ data }) => {
      working--;
      resultArray[i] = {
        move: i,
        result: data
      };

      // 当所有方向计算完成后
      if (working == 0) {
        // 执行最佳移动
        resultArray.sort((a, b) => b.result - a.result);
        let bestMove = resultArray[0].move;
        canvasGame.handleMove(["up", "right", "down", "left"][bestMove]);
        // 更新步数
        totalMove++;
        
        // 修改胜利检测：只有游戏结束才停止，忽略胜利状态（继续刷分）
        if (canvasGame.gameOver) {
          stopAI();
        } else if (canvasGame.victory) {
          // 检测到胜利但不停止，继续刷分
          console.log(`🎯 达成8192x2！继续刷分模式，当前分数: ${canvasGame.score || 0}`);
          if (aiRunning) step();
        } else {
          if (aiRunning) step();
        }
      }
    }
  }

  function currentState() {
    const result = new Uint16Array(4);
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        const tile = canvasGame.board[i][j];
        if (tile) result[i] = result[i] | ((Math.log2(tile) & 0xf) << (12 - 4 * j));
      }
    }
    return result;
  }

  async function awaitBoardUpdate() {
    // 等待移动完成
    let count = 0, flag = false;
    while (count < 300) {
      await new Promise(resolve => setTimeout(resolve, 10));
      if (JSON.stringify(canvasGame.board) !== oldBoard) {
        oldBoard = JSON.stringify(canvasGame.board);
        flag = true;
        break;
      }
      count++;
    }
    return flag;
  }

  // 游戏阶段检测 - 支持"清理与巩固"模式
  function getGameStage() {
    const board = canvasGame.board.flat().filter(x => x > 0);
    const maxTile = Math.max(...board);
    const emptySpaces = 16 - board.length;
    const totalScore = board.reduce((sum, tile) => sum + tile, 0);
    
    // 关键瓦片统计
    const count8192 = board.filter(x => x === 8192).length;
    const count4096 = board.filter(x => x === 4096).length;
    const smallTiles = board.filter(x => x <= 32);
    const mediumTiles = board.filter(x => x >= 128 && x <= 512);
    const highValueTiles = board.filter(x => x >= 2048).length;
    
    // 动态策略选择
    if (count8192 === 1) {
      if (smallTiles.length > 8 && emptySpaces >= 3) {
        // 清理模式：小瓦片过多且有空间
        return { stage: 'cleanup', depth: 4, priority: 'cleanup_small_tiles' };
      } else if (emptySpaces <= 2) {
        // 生存模式：空间不足时保持可玩性
        return { stage: 'survival', depth: 5, priority: 'maintain_playability' };
      } else {
        // 发展模式：继续向第二个8192努力
        return { stage: 'second8192', depth: 4, priority: 'reach_second_8192' };
      }
    }
    
    if (count8192 >= 2) {
      // 双8192模式：最大化终盘价值
      return { stage: 'double8192', depth: 6, priority: 'maximize_board_value' };
    } else if (count8192 === 1 && highValueTiles >= 6) {
      // 单8192+大量高价值瓦片：准备终盘
      return { stage: 'continue', depth: 5, priority: 'prepare_endgame' };
    }
    
    // 根据盘面密度和发展程度判断阶段
    const boardDensity = board.length / 16; // 盘面密度 (0-1)
    const avgTileValue = totalScore / board.length; // 平均瓦片值
    
    if (maxTile >= 4096 || avgTileValue > 200) {
      // 后期：冲击8192阶段
      return { 
        stage: 'late', 
        depth: emptySpaces <= 4 ? 5 : 4,
        priority: 'reach_first_8192'
      };
    } else if (maxTile >= 1024 || boardDensity > 0.7) {
      // 中期：稳健发展
      return { 
        stage: 'middle', 
        depth: emptySpaces <= 6 ? 4 : 3,
        priority: 'stable_growth'
      };
    } else {
      // 早期：快速发展
      return { stage: 'early', depth: 2, priority: 'rapid_growth' };
    }
  }

  async function step() {
    if (!await awaitBoardUpdate()) return stopAI();

    const board = currentState();
    const gameInfo = getGameStage();
    
    // 危险局面检测 - 空格过少时需要更谨慎
    const emptySpaces = canvasGame.board.flat().filter(x => x === 0).length;
    const searchDepth = emptySpaces <= 3 ? gameInfo.depth + 1 : gameInfo.depth;
    
    bestResult = 0;
    working = 4;
    bestMove = 0 | 4 * Math.random();
    
    for (let i = 0; i < 4; ++i) {
      workers[i].postMessage({ 
        board, 
        dir: i, 
        depth: searchDepth,
        stage: gameInfo.stage 
      });
    }
  }

  function toggleAI() { }

  function startAI() {
    totalMove = 0;
    startTime = Date.now();
    document.getElementById("ai-start").textContent = "停止AI";
    aiRunning = true;
    step();
    toggleAI = stopAI;
  }

  function stopAI() {
    const endTime = Date.now();
    const board = canvasGame.board.flat().filter(x => x > 0);
    const maxTile = Math.max(...canvasGame.board.flat());
    const score = canvasGame.score || 0;
    const tiles8192 = board.filter(x => x === 8192).length;
    const mediumTiles = board.filter(x => x >= 128 && x <= 512);
    const boardValue = board.reduce((sum, tile) => sum + tile, 0);
    
    console.log(`=== AI性能统计 ===`);
    console.log(`已用时间: ${(endTime - startTime) / 1000} 秒`);
    console.log(`动作数: ${totalMove} 个`);
    console.log(`速度: ${totalMove * 1000 / (endTime - startTime)} 步/秒`);
    console.log(`最大数字: ${maxTile}`);
    console.log(`当前分数: ${score}`);
    console.log(`棋面价值: ${boardValue}`);
    console.log(`总合价值: ${score + boardValue}`);
    console.log(`8192数量: ${tiles8192}`);
    console.log(`中等瓦片: ${mediumTiles.length}个 (价值${mediumTiles.reduce((sum, tile) => sum + tile, 0)})`);
    
    // 25万分成就评估
    const totalValue = score + boardValue;
    if (totalValue >= 250000) {
      console.log(`🏆 恭喜突破25万分！总价值: ${totalValue}`);
    } else if (totalValue >= 200000) {
      console.log(`🎯 接近25万分目标！当前: ${totalValue} (${(totalValue/250000*100).toFixed(1)}%)`);
    }
    
    if (tiles8192 >= 2) {
      console.log(`🎉 已达成8192x2！${mediumTiles.length > 3 ? '成功保留中等瓦片' : '可优化中等瓦片保护'}！`);
    } else if (tiles8192 === 1) {
      console.log(`🎯 已获得一个8192，继续努力！`);
    }
    
    document.getElementById("ai-start").textContent = "启动AI";
    aiRunning = false;
    toggleAI = startAI;
  }

  toggleAI = startAI;

  function initButton() {
    const headerLeft = document.querySelector(".header-left");

    const startBtn = document.createElement("button");
    startBtn.textContent = "启动AI";
    startBtn.id = "ai-start";
    startBtn.addEventListener('click', () => toggleAI());
    headerLeft.appendChild(startBtn);

    const stepBtn = document.createElement("button");
    stepBtn.textContent = "下一步";
    stepBtn.id = "ai-step";
    stepBtn.addEventListener('click', () => step());
    headerLeft.appendChild(stepBtn);

    const infoBtn = document.createElement("button");
    infoBtn.textContent = "游戏信息";
    infoBtn.id = "ai-info";
    infoBtn.addEventListener('click', () => {
      const gameInfo = getGameStage();
      const board = canvasGame.board.flat().filter(x => x > 0);
      const maxTile = Math.max(...board);
      const emptySpaces = canvasGame.board.flat().filter(x => x === 0).length;
      const tiles8192 = board.filter(x => x === 8192).length;
      const smallTiles = board.filter(x => x <= 32);
      const mediumTiles = board.filter(x => x >= 128 && x <= 512);
      const highValueTiles = board.filter(x => x >= 2048).length;
      const totalScore = board.reduce((sum, tile) => sum + tile, 0);
      const avgTileValue = totalScore / board.length;
      const boardDensity = board.length / 16;
      
      console.log(`=== 游戏状态分析 ===`);
      console.log(`游戏阶段: ${gameInfo.stage} (${gameInfo.priority})`);
      console.log(`搜索深度: ${gameInfo.depth}`);
      console.log(`最大数字: ${maxTile}`);
      console.log(`空格数量: ${emptySpaces}`);
      console.log(`8192数量: ${tiles8192}`);
      console.log(`小瓦片(≤32): ${smallTiles.length}`);
      console.log(`中等瓦片(128-512): ${mediumTiles.length}`);
      console.log(`高价值瓦片(≥2048): ${highValueTiles}`);
      console.log(`盘面密度: ${(boardDensity * 100).toFixed(1)}%`);
      console.log(`平均瓦片值: ${avgTileValue.toFixed(1)}`);
      console.log(`棋面总价值: ${totalScore}`);
      console.log(`当前分数: ${canvasGame.score || 0}`);
      
      // 阶段特定信息
      if (gameInfo.stage === 'cleanup') {
        console.log(`🧹 清理模式：专注清理${smallTiles.length}个小瓦片，为终盘腾出空间`);
        console.log(`📊 清理效率: ${((16 - smallTiles.length) / 16 * 100).toFixed(1)}%`);
      } else if (gameInfo.stage === 'survival') {
        console.log(`⚠️ 生存模式：空间不足(${emptySpaces}格)，优先保持可玩性`);
        console.log(`🔄 合并可能性评估中...`);
      } else if (gameInfo.stage === 'second8192') {
        const count4096 = board.filter(x => x === 4096).length;
        console.log(`🎯 第二8192模式：当前4096数量=${count4096}，空间=${emptySpaces}格`);
        console.log(`📈 继续发展大瓦片链条`);
      } else if (gameInfo.stage === 'double8192') {
        console.log(`🎯 终盘模式：保持8192x2状态，最大化棋面价值`);
        console.log(`💎 中等瓦片价值: ${mediumTiles.reduce((sum, tile) => sum + tile, 0)}`);
      } else if (tiles8192 === 1) {
        console.log(`📈 单8192状态，策略将根据棋盘情况动态调整`);
      }
      
      // 25万分潜力评估
      const potentialScore = totalScore + (canvasGame.score || 0);
      if (potentialScore > 200000) {
        console.log(`🏆 25万分潜力：${(potentialScore / 250000 * 100).toFixed(1)}%`);
      }
    });
    headerLeft.appendChild(infoBtn);
  }

  initButton();

})();