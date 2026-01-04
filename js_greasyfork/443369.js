// ==UserScript==
// @name         hifini音乐播放管理
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       zs
// @description  在HiFiNi网站自动播放歌曲，可以自定义播放列表
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hifini.com
// @match        https://www.hifini.com/*
// @match        https://hifini.com/*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.11/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/antd@5.19.1/dist/antd.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443369/hifini%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/443369/hifini%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .ant-list{display:flex;flex-direction:column;max-height:500px;overflow:hidden}.ant-spin-nested-loading{flex:1;overflow-y:scroll}.zs-play-list-item{word-wrap:none;word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.zs-play-list-item-active{color:#1677ff}.ant-list-item-action{margin-inline-start:8px!important} ");

(function (require$$0, require$$0$1, antd) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var createRoot;
  var m = require$$0$1;
  {
    createRoot = client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const _unsafeWindow = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
  function App() {
    const [musicList, setMusicList, getMusicList] = useStateWithClosure(getList());
    const [songSheetList, setSongSheetList, getSongSheetList] = useLocalStorage("hifini_song_sheet_list", []);
    const [curIndex, setCurIndex, getCurIndex] = useStateWithClosure(-1);
    const [orderType, setOrderType] = useLocalStorage("hifini_play_list2_order_type", "order");
    const [sheetValue, setSheetValue] = require$$0.useState("");
    const [sheetMusicValue, setSheetMusicValue] = require$$0.useState([]);
    const [isInSheet, setIsInSheet] = require$$0.useState(false);
    const [curSheetName, setCurSheetName, getCurSheetName] = useStateWithClosure("");
    const [curSheetMusic, setCurSheetMusic] = require$$0.useState([]);
    const [curPlaySheet, setCurPlaySheet, getCurPlaySheet] = useLocalStorage("hifini_save_play_sheet_name", "");
    const [saveSheetMusic, setSaveSheetMusic, getSaveSheetMusic] = useLocalStorage("hifini_save_play_sheet_list", []);
    const [visible, setVisible] = require$$0.useState(false);
    const [addSheetVisible, setAddSheetVisible] = require$$0.useState(false);
    const [messageApi, contextHolder] = antd.message.useMessage();
    const realSheetCurIndex = require$$0.useMemo(() => {
      let index = -1;
      const result = saveSheetMusic;
      if (location.pathname !== "/") {
        index = result.findIndex((i) => (i.href || "").includes(location.pathname));
      }
      if (curSheetName !== curPlaySheet) {
        index = -1;
      }
      return index;
    }, [curSheetName, curPlaySheet, saveSheetMusic]);
    function useStateWithClosure(initialValue) {
      const [state, setState] = require$$0.useState(initialValue);
      const stateRef = require$$0.useRef(state);
      require$$0.useEffect(() => {
        stateRef.current = state;
      }, [state]);
      const updateState = (newState) => {
        if (typeof newState === "function") {
          setState((prevState) => {
            const updatedState = newState(prevState);
            stateRef.current = updatedState;
            return updatedState;
          });
        } else {
          setState(newState);
          stateRef.current = newState;
        }
      };
      const getState = () => {
        return stateRef.current;
      };
      return [state, updateState, getState];
    }
    function useLocalStorage(key, initialValue) {
      const [storedValue, setStoredValue] = require$$0.useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });
      const setValue = require$$0.useCallback((value) => {
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      }, [key, storedValue]);
      const getValue = require$$0.useCallback(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      }, [key, initialValue]);
      return [storedValue, setValue, getValue];
    }
    function getList() {
      const result = [];
      try {
        result.push(...JSON.parse(localStorage.getItem("hifini_play_list")));
      } catch (err) {
        return result;
      }
      return result;
    }
    function addSongSheet() {
      try {
        if (!sheetValue) {
          antd.message.error("歌单名称不能为空");
          return;
        }
        const sheetList = songSheetList;
        if (sheetList.find((i) => i.name === sheetValue)) {
          antd.message.error("歌单已存在");
          return;
        }
        sheetList.push({ name: sheetValue, children: sheetMusicValue });
        setSongSheetList(sheetList);
        setSheetValue("");
        setSheetMusicValue([]);
        setAddSheetVisible(false);
        insertOperatorBtn(true);
        antd.message.success("添加歌单成功");
      } catch (err) {
        antd.message.error("添加歌单失败");
      }
    }
    function addItemPlayList(data = {}) {
      const result = getList() || [];
      if (result.find((i) => i.href === data.href)) {
        messageApi.open({
          type: "warning",
          content: "播放列表已存在"
        });
        return;
      }
      result.push(data);
      setMusicList(result);
      messageApi.open({
        type: "success",
        content: "添加成功"
      });
      localStorage.setItem("hifini_play_list", JSON.stringify(result));
    }
    function setListAll(data = []) {
      setMusicList(data);
      localStorage.setItem("hifini_play_list", JSON.stringify(data));
    }
    function getNodeByClassName(node, name) {
      for (let i = 0; i < node.length; i++) {
        if (node[i].className.split(" ").includes(name)) {
          return node[i];
        }
      }
    }
    function setInsertAddList() {
      try {
        let ulEle = Array.from(document.querySelector(".card-body").children[0].children).filter((i) => i.tagName === "LI");
        if (location.href.indexOf("search") !== -1) {
          ulEle = Array.from(document.querySelector(".search .card-body").children[0].children).filter((i) => i.tagName === "LI");
        }
        ulEle.forEach((it) => {
          const mediaEle = getNodeByClassName(it.children, "media-body");
          const subjectEle = getNodeByClassName(mediaEle.children, "subject");
          if (subjectEle.children[0].innerText.includes("mp3") || subjectEle.children[0].innerText.includes("MP3")) {
            subjectEle.setAttribute("data-href", subjectEle.children[0].href);
            subjectEle.setAttribute("data-name", subjectEle.children[0].innerText);
            createRoot(subjectEle).render(
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: { __html: subjectEle.innerHTML } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  antd.Button,
                  {
                    style: { marginLeft: 8 },
                    type: "primary",
                    size: "small",
                    onClick: () => {
                      console.log("_unsafeWindow:", _unsafeWindow);
                      const href = subjectEle.dataset.href;
                      const name = subjectEle.dataset.name;
                      addItemPlayList({ href, name });
                    },
                    children: "添加到播放列表"
                  }
                )
              ] })
            );
          }
        });
      } catch (error) {
        console.log("插入'添加到播放列表'按钮失败:", error);
        alert("插入'添加到播放列表'按钮失败");
      }
    }
    function handleStartPlay() {
      const sheetList = getSaveSheetMusic();
      const realMusicList = sheetList.length ? sheetList : getMusicList();
      if (!realMusicList.length) {
        return;
      }
      const realIndex = sheetList.length ? getSheetCurIndex() : getCurIndex();
      console.log("realIndex:", realIndex);
      if (orderType === "order") {
        if (realIndex === realMusicList.length - 1) {
          setCurIndex(0);
          location.href = realMusicList[0].href;
        } else if (realIndex < 0) {
          setCurIndex(0);
          location.href = realMusicList[0].href;
        } else {
          setCurIndex(realIndex + 1);
          location.href = realMusicList[realIndex + 1].href;
        }
      } else {
        const randomIndex = Math.floor(Math.random() * realMusicList.length);
        console.log("随机到索引:", randomIndex);
        setCurIndex(randomIndex);
        location.href = realMusicList[randomIndex].href;
      }
    }
    function getSheetCurIndex() {
      let index = -1;
      const result = getSaveSheetMusic();
      if (location.pathname !== "/") {
        index = result.findIndex((i) => (i.href || "").includes(location.pathname));
      }
      return index;
    }
    function insertOperatorBtn(flag) {
      var _a;
      try {
        if (flag) {
          const ele2 = document.querySelector(".zs-play-list-item-operator");
          ele2.parentElement.removeChild(ele2);
        }
        const ele = document.querySelector("#player4 .aplayer-music");
        if (ele.innerHTML.includes("zs-play-list-item-operator")) return;
        createRoot(ele).render(
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: { __html: ele.innerHTML } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "zs-play-list-item-operator", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  type: "primary",
                  size: "small",
                  onClick: () => {
                    window.open(ap4.audio.src, "_blank");
                  },
                  children: "下载"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  style: { marginLeft: 8 },
                  type: "primary",
                  size: "small",
                  onClick: () => handleStartPlay(),
                  children: "下一首"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  style: { marginLeft: 8 },
                  type: "primary",
                  size: "small",
                  onClick: () => {
                    const href = location.href;
                    const name = document.querySelector(".media-body h4").innerText;
                    addItemPlayList({ href, name });
                  },
                  children: "添加到播放列表"
                }
              ),
              ((_a = getSongSheetList()) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Dropdown,
                {
                  menu: {
                    items: getSongSheetList().map((it) => {
                      return { key: it.name, label: `【${it.name}】` };
                    }),
                    onClick: ({ key }) => {
                      const href = location.href;
                      const name = document.querySelector(".media-body h4").innerText;
                      handleAddSongToSheet(key, { href, name });
                    }
                  },
                  placement: "bottomLeft",
                  arrow: true,
                  trigger: ["click"],
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    antd.Button,
                    {
                      style: { marginLeft: 8 },
                      type: "primary",
                      size: "small",
                      children: "添加到歌单"
                    }
                  )
                }
              ) : null
            ] })
          ] })
        );
      } catch (err) {
        console.log("insertOperatorBtn error:", err || err.message);
      }
    }
    async function handleAutoPlay() {
      console.log("handleAutoPlay", _unsafeWindow);
      try {
        while (!_unsafeWindow.ap4) {
          console.log("window.ap4 is not available, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
        insertOperatorBtn();
        _unsafeWindow.ap4.audio.play().catch((err) => {
          console.log("handleAutoPlay error:", err || err.message);
          if (err && err.code === 9 && err.name === "NotSupportedError") {
            antd.notification.open({
              message: "温馨提示",
              type: "warning",
              description: "该歌曲未能加载，因为找不到支持的源。即将播放下一首！！",
              onClose: () => {
                handleStartPlay();
              }
            });
          } else if (err && err.name === "NotAllowedError") {
            antd.notification.open({
              message: "温馨提示",
              type: "warning",
              description: `由于浏览器策略不同，可能不允许脚本驱动媒体播放，可以手动点击播放音乐按钮，次数多了浏览器会记住你的选择，则脚本驱动媒体播放不会再失败。
        您也可以手动开启浏览器对声音的设置，将该网站设置为允许播放声音。`
            });
          }
        });
        _unsafeWindow.ap4.audio.addEventListener("ended", function() {
          console.log("监听到播放结束");
          _unsafeWindow.ap4.audio.pause();
          handleStartPlay();
        }, false);
      } catch (err) {
        console.log("handleAutoPlay error:", err || err.message);
        handleAutoPlay();
      }
    }
    function handleAddSongSheet() {
      setAddSheetVisible(true);
    }
    function handleDelSheetMusic(item, index) {
      const realList = getSongSheetList();
      const sheetItem = realList.find((i) => i.name === curSheetName);
      sheetItem.children = sheetItem.children.filter((i) => i.value !== item.href);
      if (curSheetName === curPlaySheet) {
        setSaveSheetMusic((pre) => {
          return pre.filter((i) => i.name !== item.name);
        });
      }
      setCurSheetMusic((pre) => {
        return pre.filter((i) => i.name !== item.name);
      });
      console.log("realList:", realList);
      setSongSheetList(realList);
    }
    function renderListItem(item, index) {
      if (curSheetName) {
        return renderListItemInside(item, index);
      }
      return renderListItemOutside(item);
    }
    function renderListItemInside(item, index) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.List.Item,
        {
          actions: [/* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              onClick: (e) => {
                e.stopPropagation();
                handleDelSheetMusic(item);
              },
              size: "small",
              type: "link",
              danger: true,
              children: "删除"
            }
          )],
          styles: {
            padding: "0px 10px"
          },
          onClick: () => {
            setCurPlaySheet(curSheetName);
            setSaveSheetMusic(curSheetMusic);
            location.href = item.href;
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: realSheetCurIndex === index ? "zs-play-list-item zs-play-list-item-active" : "zs-play-list-item", children: item.name })
        }
      );
    }
    function renderListItemOutside(item, index) {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.List.Item,
        {
          actions: [/* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              onClick: (e) => {
                var _a2, _b;
                e.stopPropagation();
                const href = (_b = (_a2 = item == null ? void 0 : item.children) == null ? void 0 : _a2[0]) == null ? void 0 : _b.value;
                if (href) {
                  location.href = href;
                  setCurPlaySheet(item.name);
                  setSaveSheetMusic((item.children || []).map((it) => {
                    return {
                      name: it.label,
                      href: it.value
                    };
                  }));
                } else {
                  antd.message.error("歌单内歌曲为空");
                }
              },
              size: "small",
              type: "link",
              children: "播放"
            }
          ), /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              onClick: (e) => {
                e.stopPropagation();
                if (item.name === curPlaySheet) {
                  setCurPlaySheet("");
                  setSaveSheetMusic([]);
                }
                setSongSheetList(songSheetList.filter((i) => i.name !== item.name));
                setTimeout(() => {
                  insertOperatorBtn(true);
                }, 100);
              },
              size: "small",
              type: "link",
              danger: true,
              children: "删除"
            }
          )],
          styles: {
            padding: "0px 10px"
          },
          onClick: () => {
            setCurSheetName(item.name);
            setCurSheetMusic((item.children || []).map((it) => {
              return {
                name: it.label,
                href: it.value
              };
            }));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: curPlaySheet === item.name ? "zs-play-list-item zs-play-list-item-active" : "zs-play-list-item", children: [
            item.name,
            "（",
            ((_a = item == null ? void 0 : item.children) == null ? void 0 : _a.length) || 0,
            "）"
          ] })
        }
      );
    }
    function handleAddSongToSheet(sheetName, data = {}) {
      const realList = getSongSheetList();
      const sheetItem = realList.find((i) => i.name === sheetName);
      if (sheetItem.children.find((i) => i.value === data.href)) {
        antd.message.error("歌单已存在该歌曲");
        return;
      }
      sheetItem.children.push({
        label: data.name,
        value: data.href
      });
      if (getCurSheetName() === sheetName) {
        setCurSheetMusic((pre) => {
          const result = pre.concat([data]);
          return result;
        });
      }
      if (getCurPlaySheet() === sheetName) {
        setSaveSheetMusic((pre) => {
          const result = pre.concat([data]);
          return result;
        });
      }
      console.log("realList:", realList);
      setSongSheetList(realList);
      antd.message.success("添加歌曲成功");
    }
    function handleExportAll() {
      exportToJsonFile({
        list: getMusicList(),
        sheetList: getSongSheetList()
      });
    }
    function handleImport() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.click();
      input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
          const contents = e.target.result;
          try {
            const data = JSON.parse(contents);
            console.log("Imported Data:", data);
            if (data.list) {
              localStorage.setItem("hifini_play_list", JSON.stringify(data.list));
            }
            if (data.sheetList) {
              setSongSheetList(data.sheetList);
            }
            antd.message.success("导入完成，即将刷新页面！");
            setTimeout(() => {
              location.reload();
            }, 1e3);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file);
      };
    }
    function exportToJsonFile(data) {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hifini导出.json";
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 0);
    }
    function useFirstUpdate(fn, inputs) {
      const countRef = require$$0.useRef(0);
      require$$0.useEffect(() => {
        if (!countRef.current) {
          countRef.current++;
          fn();
        }
      }, inputs);
    }
    useFirstUpdate(() => {
      const ele = document.querySelector("#player4");
      if (ele) {
        console.log("到达了播放页面");
        handleAutoPlay();
      }
    }, []);
    require$$0.useEffect(() => {
      if (!saveSheetMusic.length) {
        const result = getList();
        if (location.pathname !== "/") {
          const index = result.findIndex((i) => (i.href || "").includes(location.pathname));
          setCurIndex(index);
        }
      } else {
        setCurIndex(-1);
      }
    }, [musicList, saveSheetMusic]);
    useFirstUpdate(() => {
      setInsertAddList();
    }, []);
    require$$0.useEffect(() => {
      if (curPlaySheet) {
        setIsInSheet(true);
        setCurSheetName(curPlaySheet);
        setCurSheetMusic(saveSheetMusic);
      }
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "App", children: [
      contextHolder,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Modal,
        {
          title: isInSheet ? "歌单管理" : "播放列表",
          open: visible,
          footer: null,
          width: 640,
          maskClosable: false,
          onCancel: () => setVisible(false),
          children: isInSheet ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.List,
            {
              style: { border: "1px solid #f5f5f5" },
              itemLayout: "horizontal",
              size: "small",
              dataSource: curSheetName ? curSheetMusic : songSheetList,
              locale: {
                emptyText: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  antd.Empty,
                  {
                    description: curSheetName ? "暂无歌曲，请先添加歌曲到歌单" : "暂无歌单，请先新建",
                    image: antd.Empty.PRESENTED_IMAGE_SIMPLE
                  }
                ) })
              },
              renderItem: renderListItem,
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 16px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handleAddSongSheet(), type: "primary", size: "small", children: "新建歌单" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => {
                  setCurSheetName("");
                  setIsInSheet(false);
                }, style: { marginLeft: 8 }, size: "small", children: "返回播放列表" }),
                curSheetName ? /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setCurSheetName(""), style: { marginLeft: 8 }, size: "small", children: "返回歌单列表" }) : null,
                curPlaySheet ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "inline-flex", marginLeft: 16, color: "#666" }, children: [
                  "当前播放歌单：",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#333", fontWeight: 500 }, children: curPlaySheet })
                ] }) : null
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.List,
            {
              style: { border: "1px solid #f5f5f5" },
              itemLayout: "horizontal",
              size: "small",
              dataSource: musicList,
              locale: {
                emptyText: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  antd.Empty,
                  {
                    description: "暂无播放列表数据，请先添加",
                    image: antd.Empty.PRESENTED_IMAGE_SIMPLE
                  }
                ) })
              },
              renderItem: (item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.List.Item,
                {
                  actions: [/* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: (e) => {
                    e.stopPropagation();
                    setListAll(musicList.filter((i) => i.href !== item.href));
                  }, size: "small", type: "link", danger: true, children: "删除" })],
                  styles: {
                    padding: "0px 10px"
                  },
                  onClick: () => {
                    location.href = item.href;
                    setCurPlaySheet("");
                    setSaveSheetMusic([]);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: curIndex === index ? "zs-play-list-item zs-play-list-item-active" : "zs-play-list-item", children: item.name })
                }
              ),
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 16px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => {
                  setCurPlaySheet("");
                  setSaveSheetMusic([]);
                  handleStartPlay();
                }, type: "primary", size: "small", children: "开始播放" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setOrderType(orderType === "order" ? "random" : "order"), style: { marginLeft: 8 }, size: "small", children: orderType === "order" ? "随机播放" : "顺序播放" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setListAll([]), style: { marginLeft: 8 }, size: "small", children: "清空列表" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setIsInSheet(true), style: { marginLeft: 8 }, size: "small", children: "歌单管理" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handleExportAll(), style: { marginLeft: 8 }, size: "small", children: "导出全部" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handleImport(), style: { marginLeft: 8 }, size: "small", children: "导入" })
              ] })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        antd.Modal,
        {
          title: "新建歌单",
          open: addSheetVisible,
          width: 340,
          maskClosable: false,
          onOk: () => {
            addSongSheet();
          },
          okText: "确定",
          cancelText: "取消",
          centered: true,
          onClose: () => setAddSheetVisible(false),
          onCancel: () => setAddSheetVisible(false),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Input,
              {
                allowClear: true,
                maxLength: 20,
                style: { width: "100%" },
                placeholder: "请输入歌单名称",
                value: sheetValue,
                onChange: (e) => setSheetValue(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Select,
              {
                mode: "multiple",
                allowClear: true,
                style: { width: "100%", marginTop: 16 },
                placeholder: "可从播放列表选择歌曲到歌单",
                value: sheetMusicValue,
                onChange: (v) => setSheetMusicValue(v),
                labelInValue: true,
                optionFilterProp: "name",
                fieldNames: { label: "name", value: "href" },
                options: musicList
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.FloatButton,
        {
          shape: "circle",
          type: "primary",
          style: { left: "100px", bottom: "100px" },
          onClick: () => setVisible(true),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "https://cdn.jsdelivr.net/gh/Zgrowth/image@master/20240704/music.4uat39g1wl.webp"
            }
          )
        }
      )
    ] });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})(React, ReactDOM, antd);