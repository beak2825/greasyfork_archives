// ==UserScript==
// @name         哔哩哔哩（B站）弹幕查找和密度展示
// @name:en      Bilibili Danmaku Find and Highlight
// @name:zh-cn   哔哩哔哩（B站）弹幕查找和密度展示
// @description  1.搜索弹幕关键词，在进度条上高亮展示；2.显示弹幕密度曲线
// @description:en 1.Search keyword of danmaku and highlight them in progress bar; 2.Display danmaku density curve
// @description:zh-cn 1.搜索弹幕关键词，在进度条上高亮展示；2.显示弹幕密度曲线
// @namespace    bilibiliDmkHighlight
// @version      1.1.1
// @author       chocovon
// @match        https://www.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.2/dist/protobuf.min.js
// @require      https://fastly.jsdelivr.net/npm/protobufjs@6.10.2/dist/protobuf.min.js
// @require      https://gcore.jsdelivr.net/npm/protobufjs@6.10.2/dist/protobuf.min.js
// @downloadURL https://update.greasyfork.org/scripts/450268/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E5%BC%B9%E5%B9%95%E6%9F%A5%E6%89%BE%E5%92%8C%E5%AF%86%E5%BA%A6%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450268/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E5%BC%B9%E5%B9%95%E6%9F%A5%E6%89%BE%E5%92%8C%E5%AF%86%E5%BA%A6%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
  // src/util.js
  function findElement(classArr) {
    let ret = null;
    if (typeof classArr === "string") {
      classArr = [classArr];
    }
    classArr.forEach((c) => {
      let e = document.getElementsByClassName(c);
      if (e.length) {
        ret = e[0];
      }
    });
    return ret;
  }
  function createElement(tag, id) {
    let ret = document.createElement(tag);
    if (id) {
      ret.id = id;
    }
    return ret;
  }
  function addStyle(style) {
    const s = document.createElement("style");
    s.textContent = style;
    document.head.append(s);
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  async function sleep(ms, state = null) {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(state), ms);
    });
  }
  var DEBUG = false;
  function printLog(msg) {
    if (DEBUG) {
      console.log(msg);
    }
  }

  // src/ptb.js
  protobuf.loadFromString = (name, protoStr2) => {
    const Root = protobuf.Root;
    const fetchFunc = Root.prototype.fetch;
    Root.prototype.fetch = (_, cb) => cb(null, protoStr2);
    const root = new Root().load(name);
    Root.prototype.fetch = fetchFunc;
    return root;
  };

  // src/dmk_fetch.js
  var cid = null;
  var sniffCid = function(xhr) {
    xhr._url?.split("&").forEach((param) => {
      if (param.startsWith("cid=")) {
        let newCid = param.slice(4);
        if (cid !== newCid) {
          cid = newCid;
        }
      }
    });
  };
  hijackAjax(sniffCid);
  function hijackAjax(process) {
    if (typeof process != "function") {
      process = function(e) {
        printLog(e);
      };
    }
    addEventListener("hijack_ajax", function(event) {
      process(event.detail);
    }, false);
    function injection() {
      var open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener("load", function() {
          dispatchEvent(new CustomEvent("hijack_ajax", { detail: this }));
        }, false);
        this._url = url;
        open.apply(this, arguments);
      };
    }
    setTimeout("(" + injection.toString() + ")()", 0);
  }
  var protoStr = `
    syntax = "proto3";
    
    package dm;
    
    message dmList{
        repeated dmItem list=1;
    }
    message dmItem{
        int64 id = 1;
        int32 progress = 2;
        int32 mode = 3;
        int32 fontsize = 4;
        uint32 color = 5;
        string midHash = 6;
        string content = 7;
        int64 ctime = 8;
        int32 weight = 9;
        string action = 10;
        int32 pool = 11;
        string idStr = 12;
    }`;
  async function fetchDmkSegs(cid2) {
    let dmkSegs = [];
    await collectAllDmk(1);
    return dmkSegs;
    async function collectAllDmk(page) {
      try {
        let res = await fetch(
          `https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=${cid2}&segment_index=${page}`,
          {
            credentials: "include"
          }
        );
        let arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          let data = new Uint8Array(arrayBuffer);
          let root = await protobuf.loadFromString("dm", protoStr);
          let dmList = root.lookupType("dm.dmList").decode(data);
          dmkSegs.push(dmList.list);
          console.log("" + cid2 + " dmk seg: " + page);
          console.log(dmList.list.length);
          await collectAllDmk(page + 1);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  function peekCid() {
    return cid;
  }

  // src/dmk_handle.js
  function handleDmkSegs(segs) {
    let wholeDmkList = [];
    for (let i = 0; i < segs.length; i++) {
      let segDmkList = segs[i].map((dmItem) => {
        return {
          time: dmItem.progress / 1e3,
          text: dmItem.content.replace(/\s+/g, "")
        };
      });
      let SEG_MAX_DMK_NUM = 2e3;
      let SEG_INTERVAL = 6;
      if (i < segs.length - 1) {
        if (segDmkList.length > SEG_MAX_DMK_NUM) {
          shuffleArray(segDmkList);
          segDmkList = segDmkList.slice(0, SEG_MAX_DMK_NUM);
        }
      } else {
        if (segDmkList.length > 1) {
          segDmkList = segDmkList.sort((a, b) => {
            return a.time - b.time;
          });
          let interval = segDmkList[segDmkList.length - 1].time - segDmkList[0].time;
          let max_num = SEG_MAX_DMK_NUM * interval / 60 / SEG_INTERVAL;
          if (segDmkList.length > max_num) {
            shuffleArray(segDmkList);
            segDmkList = segDmkList.slice(0, max_num);
          }
        }
      }
      let scoredList = calcHotScore(segDmkList);
      wholeDmkList.push(...scoredList);
    }
    return wholeDmkList;
  }
  function calcHotScore(dmkList2) {
    dmkList2 = dmkList2.sort((a, b) => {
      return a.time - b.time;
    });
    let hotRadius = 1.5;
    for (let i = 0; i < dmkList2.length; i++) {
      let j = 1;
      let d = dmkList2[i];
      d.hotScore = 0;
      let curTime = d.time;
      while (i - j >= 0) {
        if (curTime - dmkList2[i - j].time < hotRadius) {
          d.hotScore++;
          j++;
        } else {
          break;
        }
      }
      j = 1;
      while (i + j < dmkList2.length) {
        if (dmkList2[i + j].time - curTime < hotRadius) {
          d.hotScore++;
          j++;
        } else {
          break;
        }
      }
    }
    return dmkList2;
  }
  function genDmkMap(dmkList2) {
    let dmkMap2 = {};
    dmkList2.forEach((d) => {
      let coords = dmkMap2[d.text];
      if (coords) {
        coords.push(d.time);
      } else {
        dmkMap2[d.text] = [d.time];
      }
    });
    return dmkMap2;
  }

  // src/style/ui_style.js
  var uiStyle = `
#hotScoreCurveDiv {
    width: 100%;
    height: 500%;
    position: absolute;
    bottom: 100%;
    pointer-events: none;
}
`;

  // src/ui.js
  addStyle(uiStyle);
  var KEY_JUMP_NEXT = "Period";
  var HOT_COLOR = "#FF00FF";
  var HINT_COLOR = "#FFFF00";
  var DMK_SEARCH_INPUT = "dmkSearchInput";
  var DMK_PROGRESS_DIV = "dmkProgressDiv";
  var HOT_DMK_CHECKBOX = "hotDmkCheckbox";
  var HOT_SCORE_CURVE_DIV = "hotScoreCurveDiv";
  function initUI(ver, dmkList2, dmkMap2) {
    let times = findElement(ver.timeClass).textContent.split(":");
    let totalSecs = parseInt(times[0]) * 60 + parseInt(times[1]);
    let maxHotScore = Math.max(...dmkList2.map((d) => d.hotScore > 0 ? d.hotScore : 0));
    maxHotScore = Math.max(maxHotScore, 10);
    if (times.length === 3) {
      totalSecs = parseInt(times[0]) * 3600 + parseInt(times[1]) * 60 + parseInt(times[2]);
    }
    let timeLine = [];
    let hotDmkCheckboxDiv = createElement("div");
    let hotDmkCheckbox = createElement("input", HOT_DMK_CHECKBOX);
    hotDmkCheckbox.title = "\u663E\u793A\u5F39\u5E55\u5BC6\u5EA6";
    hotDmkCheckbox.type = "checkbox";
    let hotChecked = localStorage.getItem(HOT_DMK_CHECKBOX);
    if (!hotChecked) {
      hotDmkCheckbox.checked = true;
    } else {
      hotDmkCheckbox.checked = hotChecked === "true";
    }
    hotDmkCheckbox.addEventListener("change", () => {
      curveDiv.style.display = hotDmkCheckbox.checked ? "block" : "none";
      localStorage.setItem(HOT_DMK_CHECKBOX, hotDmkCheckbox.checked);
    });
    hotDmkCheckbox.style.webkitAppearance = "auto";
    hotDmkCheckboxDiv.appendChild(hotDmkCheckbox);
    findElement(ver.controlLeftClass).appendChild(hotDmkCheckboxDiv);
    let searchDiv = createElement("div");
    let searchInput = createElement("input", DMK_SEARCH_INPUT);
    searchDiv.title = '\u641C\u7D22\u5F39\u5E55\u5173\u952E\u8BCD\uFF0C"/"\u5206\u9694';
    searchDiv.className = ver.searchDivClass;
    searchDiv.style.width = "70%";
    searchInput.className = ver.searchInputClass;
    searchInput.style.display = "block";
    searchInput.oninput = search;
    searchDiv.appendChild(searchInput);
    findElement(ver.controlLeftClass).appendChild(searchDiv);
    let dmkProgressDiv = createElement("div", DMK_PROGRESS_DIV);
    dmkProgressDiv.style.width = "100%";
    dmkProgressDiv.style.height = "100%";
    dmkProgressDiv.style.position = "absolute";
    dmkProgressDiv.style.top = "18%";
    let hintProgressDiv = createElement("div");
    dmkProgressDiv.appendChild(hintProgressDiv);
    findElement(ver.progressBarClass).appendChild(dmkProgressDiv);
    let curveDiv = createElement("div", HOT_SCORE_CURVE_DIV);
    curveDiv.style.display = hotDmkCheckbox.checked ? "block" : "none";
    dmkProgressDiv.appendChild(curveDiv);
    curveDiv.appendChild(createHotCurveCanvas(dmkList2, totalSecs, maxHotScore));
    let JUMP_BUF_TIME = 3;
    document.addEventListener("keydown", (e) => {
      if (e.code === KEY_JUMP_NEXT) {
        let now = player.getCurrentTime();
        for (let i = 0; i < timeLine.length; i++) {
          if (now < timeLine[i] - JUMP_BUF_TIME) {
            player.seek(timeLine[i] - JUMP_BUF_TIME);
            break;
          }
        }
      }
    });
    let saved = localStorage.getItem(DMK_SEARCH_INPUT);
    if (saved) {
      searchInput.value = saved;
    }
    search();
    return {
      destroy: function() {
        searchDiv.parentNode?.removeChild(searchDiv);
        dmkProgressDiv.parentNode?.removeChild(dmkProgressDiv);
        hotDmkCheckboxDiv.parentNode?.removeChild(hotDmkCheckboxDiv);
      }
    };
    function createHotCurveCanvas(dmkList3, totalSecs2, maxHotScore2) {
      let canvas = createElement("canvas");
      let width = screen.width;
      let height = screen.height * 0.12;
      canvas.width = width;
      canvas.height = height;
      canvas.style.height = "100%";
      canvas.style.width = "100%";
      let ctx = canvas.getContext("2d");
      ctx.strokeStyle = HOT_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, height);
      dmkList3.forEach((d) => {
        let x = Math.floor(width * d.time / totalSecs2);
        let y = Math.floor(height - height * d.hotScore / maxHotScore2);
        ctx.lineTo(x, y);
      });
      ctx.stroke();
      return canvas;
    }
    function search() {
      hintProgressDiv.innerHTML = "";
      timeLine = [];
      let query = document.getElementById(DMK_SEARCH_INPUT).value;
      if (query) {
        let qs = query.split("/");
        for (let d in dmkMap2) {
          if (Object.prototype.hasOwnProperty.call(dmkMap2, d)) {
            for (let i = 0; i < qs.length; i++) {
              if (qs[i] && d.includes(qs[i])) {
                let times2 = dmkMap2[d];
                for (let j = 0; j < times2.length; j++) {
                  let t = times2[j];
                  hintProgressDiv.appendChild(genHintDiv(t, d));
                  timeLine.push(t);
                }
                break;
              }
            }
          }
        }
      }
      localStorage.setItem(DMK_SEARCH_INPUT, query);
      timeLine = timeLine.sort((a, b) => {
        return a - b;
      });
      function genHintDiv(time, text, isHot) {
        let hint = createElement("div");
        hint.style.width = "2px";
        hint.style.height = "10px";
        hint.style.background = isHot ? HOT_COLOR : HINT_COLOR;
        hint.style.position = "absolute";
        hint.style.opacity = "0.66";
        hint.style.marginLeft = (time / totalSecs * 100).toString() + "%";
        hint.title = text;
        return hint;
      }
    }
  }
  var v1 = {
    controlLeftClass: "bilibili-player-video-control-bottom-left",
    progressBarClass: "bilibili-player-video-progress",
    timeClass: "bilibili-player-video-time-total",
    searchDivClass: "bilibili-player-video-time",
    searchInputClass: "bilibili-player-video-time-seek"
  };
  var v2 = {
    controlLeftClass: "bpx-player-control-bottom-left",
    progressBarClass: "bpx-player-progress-wrap",
    timeClass: "bpx-player-ctrl-time-duration",
    searchDivClass: "bpx-player-ctrl-btn bpx-player-ctrl-time",
    searchInputClass: "bpx-player-ctrl-time-seek"
  };
  var v3 = {
    controlLeftClass: "squirtle-controller-wrap-left",
    progressBarClass: "squirtle-progress-wrap",
    timeClass: "squirtle-video-time-total",
    searchDivClass: "squirtle-time-wrap squirtle-block-wrap",
    searchInputClass: "squirtle-video-time-seek"
  };
  var VERSIONS = [v1, v2, v3];
  function checkVersion() {
    let ret = null;
    VERSIONS.forEach((v) => {
      if (findElement(v.timeClass) && findElement(v.controlLeftClass) && findElement(v.progressBarClass) && findElement(v.searchDivClass) && findElement(v.searchInputClass)) {
        ret = v;
      }
    });
    return ret;
  }

  // src/main.js
  var curUrl = "";
  var curCid = "";
  var dmkList = [];
  var dmkMap = {};
  var UI = null;
  dmkRefreshLoop();
  async function dmkRefreshLoop() {
    while (true) {
      let cid2 = peekCid();
      if (cid2) {
        if (curUrl !== location.href && curCid !== cid2) {
          if (UI) {
            UI.destroy();
            UI = null;
          }
          curUrl = location.href;
          curCid = cid2;
          let dmkSegs = await fetchDmkSegs(cid2);
          dmkList = handleDmkSegs(dmkSegs);
          console.log(dmkList);
          dmkMap = genDmkMap(dmkList);
          while (true) {
            if (UI) {
              UI.destroy();
              UI = null;
            }
            let ver = checkVersion();
            printLog(ver);
            if (ver) {
              try {
                UI = initUI(ver, dmkList, dmkMap);
                printLog("ui loaded");
                break;
              } catch (e) {
                console.error(e);
              }
            }
            await sleep(1e3);
          }
        }
      }
      await sleep(100);
    }
  }
})();
