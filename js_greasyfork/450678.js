// ==UserScript==
// @name         Idle Pixel Fixed
// @namespace    com.kape142.idlepixelfixed
// @version      1.0.8
// @description  Extension to improve the experience of Idle Pixel
// @author       kape142
// @match        https://idle-pixel.com/login/play/*
// @grant        none
// @require      https://unpkg.com/react@17/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@17/umd/react-dom.production.min.js
// @require      https://unpkg.com/@reduxjs/toolkit@1.8.5/dist/redux-toolkit.umd.min.js
// @require      https://unpkg.com/react-redux@8.0.2/dist/react-redux.js

// @downloadURL https://update.greasyfork.org/scripts/450678/Idle%20Pixel%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/450678/Idle%20Pixel%20Fixed.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(require("@reduxjs/toolkit"), require("react-redux"), require("react"), require("react-dom")) : typeof define === "function" && define.amd ? define(["@reduxjs/toolkit", "react-redux", "react", "react-dom"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.RTK, global.ReactRedux, global.React, global.ReactDOM));
})(this, function(toolkit, reactRedux, React$1, ReactDOM) {
  "use strict";
  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { "default": e };
  }
  var React__default = /* @__PURE__ */ _interopDefaultLegacy(React$1);
  var ReactDOM__default = /* @__PURE__ */ _interopDefaultLegacy(ReactDOM);
  const initialState$6 = {
    isOpen: false
  };
  const activityLogSlice = toolkit.createSlice({
    name: "Activity Log",
    initialState: initialState$6,
    reducers: {
      openActivityLog(state) {
        state.isOpen = true;
      },
      closeActivityLog(state) {
        state.isOpen = false;
      }
    }
  });
  const { openActivityLog, closeActivityLog } = activityLogSlice.actions;
  const selectActivityLogIsOpen = (state) => state.activityLog.isOpen;
  var activityLogReducer = activityLogSlice.reducer;
  const useIPFDispatch = reactRedux.useDispatch;
  const useIPFSelector = reactRedux.useSelector;
  const IPFMenuBar = ({}) => {
    const dispatch = useIPFDispatch();
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", {
      className: "center"
    }, /* @__PURE__ */ React.createElement("span", {
      className: "color-grey"
    }, "Idle Pixel Fixed"), /* @__PURE__ */ React.createElement("div", {
      className: "App"
    }, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("button", {
      type: "button",
      onClick: () => dispatch(openActivityLog())
    }, "Activity Log")))));
  };
  const timeSince = (timestamp) => {
    const parsedTimestamp = new Date(timestamp);
    const now = new Date();
    const secs = (now.getTime() - parsedTimestamp.getTime()) / 1e3;
    if (secs < 60)
      return `${Math.floor(secs)}s`;
    const mins = (now.getTime() - parsedTimestamp.getTime()) / 6e4;
    if (mins < 60)
      return `${Math.floor(mins)}m`;
    const hours = (now.getTime() - parsedTimestamp.getTime()) / 36e5;
    if (hours < 24)
      return `${Math.floor(hours)}h`;
    const days = (now.getTime() - parsedTimestamp.getTime()) / 864e5;
    if (days < 365)
      return `${Math.floor(days)}d`;
    const years = (now.getTime() - parsedTimestamp.getTime()) / 31536e6;
    return `${Math.floor(years)}y`;
  };
  const formatMinutes = (minutes) => {
    let text = "";
    if (minutes > 60) {
      text += `${Math.floor(minutes / 60)} hours`;
    }
    if (minutes % 60 !== 0) {
      if (text.length > 0) {
        text += ", ";
      }
      text += `${minutes % 60} min`;
    }
    return text;
  };
  const formatDate = (timestamp) => new Date(timestamp).toLocaleString();
  const LootEntry = ({ content, timestamp }) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        borderBottom: "1px solid #fff",
        margin: "1em",
        padding: "1em",
        width: "100%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        fontSize: "1.6em"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        visibility: "hidden",
        width: "5em"
      }
    }, "padding"), /* @__PURE__ */ React.createElement("div", null, "Loot"), /* @__PURE__ */ React.createElement("div", {
      title: formatDate(timestamp),
      style: {
        width: "5em"
      }
    }, timeSince(timestamp))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
      }
    }, content.items.map((item) => /* @__PURE__ */ React.createElement("div", {
      style: {
        backgroundColor: item.background,
        border: "1px solid black",
        padding: "1em 2em",
        minWidth: "15me",
        margin: "1em",
        borderRadius: "10px"
      }
    }, /* @__PURE__ */ React.createElement("img", {
      style: {
        width: "5em",
        height: "5em",
        marginRight: "1.6em"
      },
      src: get_image(item.image),
      alt: `${item.label}-image`
    }), /* @__PURE__ */ React.createElement("span", {
      style: {
        fontSize: "1.6em",
        color: "#000",
        textShadow: "none"
      }
    }, item.label)))));
  };
  var ActivityLogItemType = /* @__PURE__ */ ((ActivityLogItemType2) => {
    ActivityLogItemType2["LOOT"] = "LOOT";
    ActivityLogItemType2["COOK"] = "COOK";
    return ActivityLogItemType2;
  })(ActivityLogItemType || {});
  const initialActivitLogSettings = {
    blockDialogues: true,
    showInOverview: false
  };
  const removeEmpty = (it) => it !== void 0 && it !== null;
  const toggleInArray = (array, item) => {
    const i = array.indexOf(item);
    return i === -1 ? array.concat(item) : array.slice(0, i).concat(array.slice(i + 1));
  };
  const classNames = (classes, ...classList) => [
    Object.keys(classes).reduce((acc, cur) => `${acc}${classes[cur] ? ` ${cur}` : ""}`, "").trim()
  ].concat(classList.filter(removeEmpty)).join(" ");
  const IPimg = (_a) => {
    var _b = _a, {
      name,
      size,
      ext,
      className,
      style
    } = _b, rest = __objRest(_b, [
      "name",
      "size",
      "ext",
      "className",
      "style"
    ]);
    return /* @__PURE__ */ React.createElement("img", __spreadValues({
      src: ext ? get_image(`images/${name}.${ext}`) : get_image(`images/${name}.png`),
      alt: name,
      className: classNames({ [`w${size}`]: !!size }, className),
      style: __spreadValues({ objectFit: "cover" }, style)
    }, rest));
  };
  const CookEntry = ({ content, timestamp }) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        borderBottom: "1px solid grey",
        margin: "1em",
        padding: "1em",
        width: "100%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        fontSize: "1.6em"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        width: "5em",
        visibility: "hidden"
      }
    }, "padding"), /* @__PURE__ */ React.createElement("div", null, "Cooking"), /* @__PURE__ */ React.createElement("div", {
      title: formatDate(timestamp),
      style: {
        width: "5em",
        color: "gray"
      }
    }, timeSince(timestamp))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "1.6em"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: Cooking.getOven(),
      size: 50
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(IPimg, {
      name: content.name,
      size: 30
    }), content.cooked, " Cooked.", /* @__PURE__ */ React.createElement("span", {
      className: "color-grey"
    }, "(", content.cookedXp, " xp)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(IPimg, {
      name: content.name.replace("cooked", "raw"),
      size: 30,
      className: "grayscale"
    }), content.burnt, " Burnt.", /* @__PURE__ */ React.createElement("span", {
      className: "color-grey"
    }, "(", content.burntXp, " xp)"))));
  };
  const ActivityLogEntry = ({ item }) => {
    switch (item.type) {
      case ActivityLogItemType.LOOT:
        return /* @__PURE__ */ React.createElement(LootEntry, {
          content: item.content,
          timestamp: item.timestamp
        });
      case ActivityLogItemType.COOK:
        return /* @__PURE__ */ React.createElement(CookEntry, {
          content: item.content,
          timestamp: item.timestamp
        });
      default:
        return null;
    }
  };
  const initialState$5 = {
    subscribers: []
  };
  const removeSubscriber$1 = (state, subscriber) => {
    state.subscribers = state.subscribers.filter((sub) => !(sub.id === subscriber.id && sub.key === subscriber.key));
    return state;
  };
  const localStorageSlice = toolkit.createSlice({
    name: "Local Storage",
    initialState: initialState$5,
    reducers: {
      subscribeToLocalStorage(state, action) {
        state = removeSubscriber$1(state, action.payload);
        state.subscribers.push(action.payload);
      },
      unsubscribeFromLocalStorage(state, action) {
        state = removeSubscriber$1(state, action.payload);
      }
    }
  });
  const { subscribeToLocalStorage, unsubscribeFromLocalStorage } = localStorageSlice.actions;
  const selectLocalStorageSubscribers = (state) => state.localStorage.subscribers;
  var localStorageReducer = localStorageSlice.reducer;
  const useLocalStorage = (key, initialValue, id2) => {
    const [value, setValue] = React$1.useState(() => {
      const prevSaved = window.localStorage.getItem(`${var_username}.${key}`);
      return prevSaved ? JSON.parse(prevSaved) : initialValue;
    });
    const dispatch = useIPFDispatch();
    const subscribers = useIPFSelector(selectLocalStorageSubscribers);
    React$1.useEffect(() => {
      dispatch(subscribeToLocalStorage({
        setValue,
        key,
        id: id2
      }));
      return () => {
        dispatch(unsubscribeFromLocalStorage({ key, id: id2 }));
      };
    }, [key, setValue, id2]);
    React$1.useEffect(() => {
      window.localStorage.setItem(`${var_username}.${key}`, JSON.stringify(value));
      subscribers.filter((sub) => sub.key === key).forEach((sub) => {
        sub.setValue(value);
      });
    }, [key, value]);
    return [value, setValue];
  };
  const initialState$4 = {
    consumers: []
  };
  const removeConsumer = (state, consumerId) => {
    state.consumers = state.consumers.filter((consumer) => !(consumer.id === consumerId));
    return state;
  };
  const websocketSlice = toolkit.createSlice({
    name: "Websocket",
    initialState: initialState$4,
    reducers: {
      addWebsocketConsumer(state, action) {
        removeConsumer(state, action.payload.id);
        state.consumers.push(action.payload);
      },
      removeWebsocketConsumer(state, action) {
        removeConsumer(state, action.payload);
      }
    }
  });
  const { addWebsocketConsumer, removeWebsocketConsumer } = websocketSlice.actions;
  const selectWebsocketConsumers = (state) => state.websocket.consumers;
  var websocketReducer = websocketSlice.reducer;
  const useWebsocket = (onMessage, priority, id2) => {
    const oldOnMessage = React$1.useRef(websocket.connected_socket.onmessage);
    const dispatch = useIPFDispatch();
    const consumers = useIPFSelector(selectWebsocketConsumers);
    const functions = React$1.useMemo(() => {
      var _a;
      return consumers.concat([
        {
          onMessage: (_a = oldOnMessage.current) != null ? _a : trivialOnMessage,
          priority: 0,
          id: "smitty"
        }
      ]).sort((a, b) => b.priority - a.priority).map((consumer) => consumer.onMessage);
    }, [consumers]);
    React$1.useEffect(() => {
      dispatch(addWebsocketConsumer({
        onMessage,
        priority,
        id: id2
      }));
      return () => {
        dispatch(removeWebsocketConsumer(id2));
      };
    }, [onMessage, priority, id2]);
    React$1.useEffect(() => {
      websocket.connected_socket.onmessage = (ev) => {
        functions.reduce((acc, cur) => cur(acc), ev);
      };
    }, [consumers]);
  };
  const trivialOnMessage = (ev) => ev;
  const observeWebSocketMessage = (type, observe) => (ev) => {
    const { type: foundType, data } = websocketMessageSplit(ev.data);
    if (type === foundType) {
      observe(data);
    }
    return ev;
  };
  const consumeWebSocketMessage = (type, consume) => (ev) => {
    const { type: foundType, data } = websocketMessageSplit(ev.data);
    if (type === foundType) {
      consume(data);
      return Object.assign({}, ev, { data: "" });
    }
    return ev;
  };
  const replaceWebSocketMessage = (type, replace) => (ev) => {
    const { type: foundType, data } = websocketMessageSplit(ev.data);
    if (type === foundType) {
      const newData = replace(data);
      return Object.assign({}, ev, { data: newData });
    }
    return ev;
  };
  const websocketMessageSplit = (message) => {
    const split = message.split("=");
    return { type: split[0], data: split[1] };
  };
  const sendMessage = (type, ...values) => websocket.connected_socket.send(`${type}=${values.join("~")}`);
  const reduceToRecord = (list, mappers) => list.reduce((acc, cur, j) => {
    const i = Math.floor(j / mappers.length);
    if (!acc[i])
      acc[i] = {};
    mappers.forEach((mapper, index) => {
      if (j % mappers.length === index) {
        Object.assign(acc[i], mapper(cur));
      }
    });
    return acc;
  }, []).map((t) => t);
  const id$e = "useActivityLogWebSocketListener";
  const useActivityLogWebSocketListener = () => {
    const [settings] = useLocalStorage("activity-log-settings", initialActivitLogSettings, id$e);
    const [list, setList] = useLocalStorage("activity-log", [], id$e);
    const addItem = (item) => setList((list2) => [item].concat(list2).slice(0, 200));
    const onMessageFactory = React$1.useMemo(() => settings.blockDialogues ? consumeWebSocketMessage : observeWebSocketMessage, [settings.blockDialogues]);
    const onLootMessage = React$1.useMemo(() => onMessageFactory("OPEN_LOOT_DIALOGUE", (data) => {
      addItem(lootDialogueParser(data));
    }), [onMessageFactory]);
    useWebsocket(onLootMessage, 1e3, "useActivityLogWebSocketListener-Loot");
    const onCookedMessage = React$1.useMemo(() => onMessageFactory("COOKING_RESULTS", (data) => {
      addItem(cookDialogueParser(data));
    }), [onMessageFactory]);
    useWebsocket(onCookedMessage, 1e3, "useActivityLogWebSocketListener-Cook");
    return list;
  };
  const cookDialogueParser = (data) => {
    const dataArray = data.split("~");
    return {
      type: ActivityLogItemType.COOK,
      timestamp: new Date(),
      content: {
        name: dataArray[0],
        cooked: Number(dataArray[1]),
        cookedXp: Number(dataArray[2]),
        burnt: Number(dataArray[3]),
        burntXp: Number(dataArray[4])
      }
    };
  };
  const lootDialogueParser = (data) => {
    const dataArray = data.split("~");
    return {
      type: ActivityLogItemType.LOOT,
      timestamp: new Date(),
      content: {
        extraData: dataArray[0],
        items: reduceToRecord(dataArray.slice(1), [
          (value) => ({ image: value }),
          (value) => ({ label: value }),
          (value) => ({ background: value })
        ])
      }
    };
  };
  const initialState$3 = {
    subscribers: []
  };
  const removeSubscriber = (state, subscriber) => {
    state.subscribers = state.subscribers.filter((sub) => !(sub.id === subscriber.id && sub.key === subscriber.key));
    return state;
  };
  const keyboardSlice = toolkit.createSlice({
    name: "Keyboard",
    initialState: initialState$3,
    reducers: {
      subscribeToKeyboardEvent(state, action) {
        state = removeSubscriber(state, action.payload);
        state.subscribers.push(action.payload);
      },
      unsubscribeFromKeyboardEvent(state, action) {
        state = removeSubscriber(state, action.payload);
      }
    }
  });
  const { subscribeToKeyboardEvent, unsubscribeFromKeyboardEvent } = keyboardSlice.actions;
  var keyboardReducer = keyboardSlice.reducer;
  const ActivityLogSetting = ({ text, value, onClick }) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "20vw",
        border: "1px solid grey",
        borderRadius: "10px",
        padding: "10px"
      }
    }, /* @__PURE__ */ React.createElement("span", null, text), /* @__PURE__ */ React.createElement(IPimg, {
      name: value ? "gold" : "stone",
      onClick: () => {
        onClick();
      }
    }));
  };
  const keysOf = (record) => Object.keys(record).filter((key) => record.hasOwnProperty(key)).map((record2) => record2);
  const settingTexts = {
    blockDialogues: "Block loot pop-ups",
    showInOverview: "Show activity log in Overview"
  };
  const id$d = "ActivityLogSettingsWindow";
  const ActivityLogSettingsWindow = ({ open, setOpen }) => {
    const [settings, setSettings] = useLocalStorage("activity-log-settings", initialActivitLogSettings, id$d);
    const toggleSetting = (name) => {
      setSettings((oldValue) => __spreadProps(__spreadValues({}, oldValue), { [name]: !oldValue[name] }));
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, open && /* @__PURE__ */ React.createElement("div", {
      onClick: (event) => {
        event.stopPropagation();
        setOpen(false);
      },
      style: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      onClick: (event) => event.stopPropagation(),
      style: {
        position: "absolute",
        top: "15vh",
        left: "30vw",
        width: "40vw",
        height: "30vh",
        textAlign: "center",
        border: "1px solid grey",
        backgroundColor: "#e5fbff",
        borderRadius: "20px",
        padding: "20px",
        zIndex: 1e4
      }
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", {
      className: "color-grey"
    }, "Settings"), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
      }
    }, keysOf(initialActivitLogSettings).map((key) => /* @__PURE__ */ React.createElement(ActivityLogSetting, {
      text: settingTexts[key],
      value: settings[key],
      onClick: () => toggleSetting(key)
    }))), /* @__PURE__ */ React.createElement("button", {
      type: "button",
      onClick: () => setOpen(false),
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#e01e1e",
        borderRadius: "5px",
        width: "50px"
      }
    }, "X")))));
  };
  const id$c = "ActivityLog";
  const ActivityLog = ({}) => {
    const list = useActivityLogWebSocketListener();
    const open = useIPFSelector(selectActivityLogIsOpen);
    const [settingsOpen, setSettingsOpen] = React$1.useState(false);
    const dispatch = useIPFDispatch();
    React$1.useEffect(() => {
      dispatch(subscribeToKeyboardEvent({
        key: "Tab",
        onKeyDown: (event) => {
          event.preventDefault();
          if (open) {
            setSettingsOpen(false);
            dispatch(closeActivityLog());
          } else {
            dispatch(openActivityLog());
          }
        },
        id: id$c
      }));
      return () => {
        dispatch(unsubscribeFromKeyboardEvent({ key: "Tab", id: id$c }));
      };
    }, [open, dispatch, setSettingsOpen]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, open && /* @__PURE__ */ React.createElement("div", {
      onClick: () => dispatch(closeActivityLog()),
      style: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      onClick: (event) => {
        setSettingsOpen(false);
        event.stopPropagation();
      },
      style: {
        position: "absolute",
        top: "10vh",
        left: "25vw",
        width: "50vw",
        height: "85vh",
        textAlign: "center",
        border: "1px solid grey",
        backgroundColor: "#e5fbff",
        borderRadius: "20px",
        padding: "20px",
        zIndex: 1e4
      }
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", {
      className: "color-grey"
    }, "Activity log"), /* @__PURE__ */ React.createElement("button", {
      title: "Open settings",
      type: "button",
      onClick: (event) => {
        setSettingsOpen(!settingsOpen);
        event.stopPropagation();
      },
      style: {
        position: "absolute",
        top: "10px",
        right: "70px",
        backgroundColor: "grey",
        borderRadius: "5px",
        width: "50px"
      }
    }, "\u2699"), /* @__PURE__ */ React.createElement("button", {
      type: "button",
      onClick: () => dispatch(closeActivityLog()),
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#e01e1e",
        borderRadius: "5px",
        width: "50px"
      }
    }, "X")), /* @__PURE__ */ React.createElement("div", {
      style: {
        height: "calc(85vh - 120px)",
        overflowY: "auto",
        overflowX: "hidden",
        fontSize: "10px"
      }
    }, list.map((item) => /* @__PURE__ */ React.createElement(ActivityLogEntry, {
      item
    }))))), /* @__PURE__ */ React.createElement(ActivityLogSettingsWindow, {
      open: settingsOpen,
      setOpen: setSettingsOpen
    }));
  };
  const ID_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const makeId = (length) => {
    let text = "";
    for (let i = 0; i < length; i++) {
      text += ID_SYMBOLS.charAt(Math.floor(Math.random() * ID_SYMBOLS.length));
    }
    return text;
  };
  const pluralMarker = (amount) => amount > 1 ? "s" : "";
  const initialState$2 = {
    isOpen: false
  };
  const overviewSlice = toolkit.createSlice({
    name: "Overview",
    initialState: initialState$2,
    reducers: {
      openOverview(state) {
        state.isOpen = true;
      },
      closeOverview(state) {
        state.isOpen = false;
      }
    }
  });
  const { openOverview, closeOverview } = overviewSlice.actions;
  const selectOverviewIsOpen = (state) => state.overview.isOpen;
  var overviewReducer = overviewSlice.reducer;
  const initialState$1 = {
    observers: []
  };
  const removeObserver = (state, observerId) => {
    state.observers = state.observers.filter((observer) => !(observer.id === observerId));
    return state;
  };
  const setItemsSlice = toolkit.createSlice({
    name: "Set items",
    initialState: initialState$1,
    reducers: {
      addSetItemsObserver(state, action) {
        removeObserver(state, action.payload.id);
        state.observers.push(action.payload);
      },
      removeSetItemsObserver(state, action) {
        removeObserver(state, action.payload);
      }
    }
  });
  const { addSetItemsObserver, removeSetItemsObserver } = setItemsSlice.actions;
  const selectSetItemsObservers = (state) => state.setItems.observers;
  var setItemsReducer = setItemsSlice.reducer;
  const initialState = {
    ctrlKey: false,
    shiftKey: false
  };
  const modifierKeySlice = toolkit.createSlice({
    name: "Modifier key",
    initialState,
    reducers: {
      ctrlKeyDown(state) {
        state.ctrlKey = true;
      },
      ctrlKeyUp(state) {
        state.ctrlKey = false;
      },
      shiftKeyDown(state) {
        state.shiftKey = true;
      },
      shiftKeyUp(state) {
        state.shiftKey = false;
      },
      resetModifierKeys(state) {
        state.ctrlKey = false;
        state.shiftKey = false;
      }
    }
  });
  const { ctrlKeyDown, ctrlKeyUp, shiftKeyDown, shiftKeyUp, resetModifierKeys } = modifierKeySlice.actions;
  const selectModifierKeys = (state) => state.modifierKey;
  var modiferKeyReducer = modifierKeySlice.reducer;
  const store = toolkit.configureStore({
    reducer: {
      activityLog: activityLogReducer,
      localStorage: localStorageReducer,
      websocket: websocketReducer,
      overview: overviewReducer,
      setItems: setItemsReducer,
      keyboard: keyboardReducer,
      modifierKey: modiferKeyReducer
    }
  });
  const hideElementById = (id2) => {
    const el = document.getElementById(id2);
    if (el && el.style) {
      el.style.display = "none";
    }
  };
  const showElementById = (id2) => {
    const el = document.getElementById(id2);
    if (el && el.style) {
      el.style.display = "";
    }
  };
  const updateTextContentById = (id2, textContent) => {
    const el = document.getElementById(id2);
    if (el) {
      el.textContent = textContent;
    }
  };
  const updateTimer = (selector, time) => {
    const id2 = `notification-${selector}`;
    const element = document.getElementById(id2);
    if (element) {
      const displays = element.getElementsByTagName("item-display");
      if (displays[0]) {
        displays[0].textContent = format_time(time);
      }
      showElementById(id2);
    }
  };
  const appendReact = (component, id2, insertBeforeId) => {
    const parent = document.getElementById(id2);
    if (!parent)
      return;
    const reactRoot = document.createElement("div");
    const reactRootId = `${id2}-react-child-${makeId(8)}`;
    reactRoot.id = reactRootId;
    if (insertBeforeId) {
      const insertBeforeElement = document.getElementById(insertBeforeId);
      if (insertBeforeElement) {
        parent.insertBefore(reactRoot, insertBeforeElement);
      } else {
        console.warn(`trying to insert before id ${insertBeforeId} but no element with that id was found`);
      }
    } else {
      parent.appendChild(reactRoot);
    }
    ReactDOM__default["default"].render(/* @__PURE__ */ React__default["default"].createElement(React__default["default"].StrictMode, null, /* @__PURE__ */ React__default["default"].createElement(reactRedux.Provider, {
      store
    }, component)), document.getElementById(reactRootId));
  };
  const waitFor = (check, func) => {
    const wrapperFunc = () => {
      if (check()) {
        func();
      } else {
        setTimeout(wrapperFunc, 1e3);
      }
    };
    wrapperFunc();
  };
  const OverviewButton = ({}) => {
    const dispatch = useIPFDispatch();
    return /* @__PURE__ */ React.createElement("div", {
      className: "hover game-menu-bar-left-table-btn",
      role: "button",
      onClick: () => {
        hideElementById(Globals.currentPanel);
        Globals.currentPanel = "";
        dispatch(openOverview());
      },
      style: { padding: "5px 0" }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      style: {
        margin: "5px"
      },
      name: "community_center_1",
      size: 30
    }), /* @__PURE__ */ React.createElement("span", {
      style: { color: "silver" }
    }, "OVERVIEW"));
  };
  const useNumberItemObserver = (item, id2, specialCase = (_) => false) => {
    const [value, setValue] = useItemObserver(item, id2, (value2) => specialCase(Number(value2)));
    return [
      Number(value),
      (newValue) => {
        Items.set(item, newValue.toString());
        setValue(newValue.toString());
      }
    ];
  };
  const useItemObserver = (item, id2, specialCase = (_) => false) => {
    const [value, setValue] = React$1.useState(Items.getItem(item).toString());
    const trueValue = React$1.useRef(Items.getItem(item).toString());
    const itemId = `${id2}-${item}`;
    const [forceTrueValueTimeout, setForceTrueValueTimeout] = React$1.useState(null);
    const setTrueValue = React$1.useCallback((newValue) => {
      const override = specialCase(newValue);
      if (override) {
        setValue(newValue);
      } else if (value === trueValue.current) {
        setValue(newValue);
      } else {
        if (!forceTrueValueTimeout) {
          setForceTrueValueTimeout(setTimeout(() => {
            setValue(trueValue.current);
            setForceTrueValueTimeout(null);
          }, 3e3));
        }
      }
      trueValue.current = newValue;
    }, [
      setValue,
      forceTrueValueTimeout,
      setForceTrueValueTimeout,
      value,
      trueValue
    ]);
    const dispatch = useIPFDispatch();
    React$1.useEffect(() => {
      dispatch(addSetItemsObserver({
        onChange: setTrueValue,
        item,
        id: itemId
      }));
      return () => {
        dispatch(removeSetItemsObserver(itemId));
      };
    }, [setTrueValue, item, id2]);
    return [value, setValue];
  };
  const useSetItemsObserver = () => {
    const observers = useIPFSelector(selectSetItemsObservers);
    const onMessage = React$1.useMemo(() => observeWebSocketMessage("SET_ITEMS", (dataString) => {
      const data = reduceToRecord(dataString.split("~"), [
        (value) => ({ name: value }),
        (value) => ({ value })
      ]);
      observers.forEach((observer) => {
        data.forEach((d) => {
          if (d.name === observer.item) {
            observer.onChange(d.value);
          }
        });
      });
    }), [observers]);
    useWebsocket(onMessage, 10, "setItems");
  };
  const getData = (potionName) => ({
    getTime: () => Brewing.get_potion_timer(potionName),
    ingredients: reduceToRecord(Brewing.get_ingredients(potionName), [
      (value) => ({ item: value }),
      (value) => ({ amount: Number(value) })
    ])
  });
  const POTIONS = {
    stardust_potion: __spreadValues({
      level: 1
    }, getData("stardust_potion")),
    energy_potion: __spreadValues({
      level: 3
    }, getData("energy_potion")),
    anti_disease_potion: __spreadValues({
      level: 5
    }, getData("anti_disease_potion")),
    tree_speed_potion: __spreadValues({
      level: 8
    }, getData("tree_speed_potion")),
    smelting_upgrade_potion: __spreadValues({
      level: 10
    }, getData("smelting_upgrade_potion")),
    great_stardust_potion: __spreadValues({
      level: 13
    }, getData("great_stardust_potion")),
    farming_speed_potion: __spreadValues({
      level: 15
    }, getData("farming_speed_potion")),
    rare_monster_potion: __spreadValues({
      level: 20
    }, getData("rare_monster_potion")),
    super_stardust_potion: __spreadValues({
      level: 25
    }, getData("super_stardust_potion")),
    gathering_unique_potion: __spreadValues({
      level: 27
    }, getData("gathering_unique_potion")),
    heat_potion: __spreadValues({
      level: 30
    }, getData("heat_potion")),
    bone_potion: __spreadValues({
      level: 35
    }, getData("bone_potion")),
    promethium_potion: __spreadValues({
      level: 40
    }, getData("promethium_potion")),
    super_rare_monster_potion: __spreadValues({
      level: 45
    }, getData("super_rare_monster_potion")),
    ultra_stardust_potion: __spreadValues({
      level: 50
    }, getData("ultra_stardust_potion")),
    rocket_potion: __spreadValues({
      level: 55
    }, getData("rocket_potion")),
    titanium_potion: __spreadValues({
      level: 60
    }, getData("titanium_potion"))
  };
  const useTooltip = ([regular, shift, ctrl], { width } = {}) => {
    const { ctrlKey, shiftKey } = useIPFSelector(selectModifierKeys);
    const [visible, setVisible] = React$1.useState(false);
    const [target, setTarget] = React$1.useState(null);
    const onMouseOver = (event) => {
      setTarget(event.target);
      setVisible(true);
    };
    const onMouseOut = () => {
      setVisible(false);
      setTarget(null);
    };
    return [
      { onMouseOver, onMouseOut },
      () => /* @__PURE__ */ React.createElement(React.Fragment, null, visible && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {
          width: width ? width + "px" : "200px",
          position: "absolute",
          bottom: "112%",
          left: "50%",
          marginLeft: width ? "-" + width / 2 + "px" : "-100px",
          border: "1px solid rgba(0, 0, 0, 0.95)",
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          padding: "10px",
          color: "white",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }, shiftKey && shift ? shift : ctrlKey && ctrl ? ctrl : regular, ctrl || shift ? /* @__PURE__ */ React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-evenly",
          gap: "30px"
        }
      }, /* @__PURE__ */ React.createElement("span", {
        style: {
          color: !ctrlKey && !shiftKey ? "#1a9d1a" : "#dddddd"
        }
      }, "[none]"), shift && /* @__PURE__ */ React.createElement("span", {
        style: { color: shiftKey ? "#1a9d1a" : "#dddddd" }
      }, "[shift]"), ctrl && /* @__PURE__ */ React.createElement("span", {
        style: {
          color: !shiftKey && ctrlKey ? "#1a9d1a" : "#dddddd"
        }
      }, "[ctrl]")) : null, /* @__PURE__ */ React.createElement("span", {
        style: {
          position: "absolute",
          top: "100%",
          left: "50%",
          marginLeft: "-7px",
          borderWidth: "7px",
          borderStyle: "solid",
          borderColor: "rgba(0, 0, 0, 0.95) transparent transparent transparent",
          zIndex: 100,
          pointerEvents: "none"
        }
      }, " ")))),
      () => {
        setVisible(false);
        setTarget(null);
      }
    ];
  };
  const formatNumber = (amount) => amount < 1e3 ? `${amount}` : amount < 1e6 ? `${(amount / 1e3).toFixed(5 - Math.floor(Math.log10(amount)))}k` : `${(amount / 1e6).toFixed(8 - Math.floor(Math.log10(amount)))}m`;
  const isNumber = (number) => typeof number === "number";
  const LabeledIPimg = (_c) => {
    var _d = _c, {
      name,
      label,
      size,
      style,
      width
    } = _d, rest = __objRest(_d, [
      "name",
      "label",
      "size",
      "style",
      "width"
    ]);
    const appliedWidth = width ? width : (size != null ? size : 0) + 20;
    return /* @__PURE__ */ React__default["default"].createElement("div", __spreadValues({
      style: __spreadValues({
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        width: `${appliedWidth}px`,
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%"
      }, style)
    }, rest), /* @__PURE__ */ React__default["default"].createElement(IPimg, {
      name,
      size
    }), /* @__PURE__ */ React__default["default"].createElement("span", null, isNumber(label) ? formatNumber(label) : label));
  };
  const BrewingTooltip = ({
    potion,
    amount,
    maxAmount,
    ingredients,
    brewingIngredients,
    level,
    brewingLevel
  }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }
    }, amount > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", null, "Brew ", amount, " ", Items.get_pretty_item_name(potion), " (max ", maxAmount, ")") : /* @__PURE__ */ React__default["default"].createElement("div", null, "Can't Brew ", Items.get_pretty_item_name(potion)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-evenly",
        gap: "10px"
      }
    }, ingredients.map((ingredient) => /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: ingredient.item,
      size: 30,
      style: {
        color: ingredient.amount <= brewingIngredients[ingredient.item].value ? void 0 : "red"
      },
      label: `${Math.max(amount, 1) * ingredient.amount}/${brewingIngredients[ingredient.item].value}`
    }))), level > brewingLevel ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { color: "red" }
    }, "Required brewing level ", brewingLevel, "/", level) : null);
  };
  const PotionDisplay = ({
    potionName,
    toggle,
    view,
    favorite,
    brewingLevel,
    brewingIngredients
  }) => {
    const [amount, setAmount] = useNumberItemObserver(potionName, "PotionDisplay");
    const [timer, setTimer] = useNumberItemObserver(`${potionName}_timer`, "PotionDisplay");
    const hasPotionStacker = Number(Items.getItem("donor_potion_stacker_timestamp")) === 1;
    const hasEasyAchievement = Achievements.has_completed_set("brewing", "medium");
    const maxPotions = 1 + (hasPotionStacker ? 1 : 0) + (hasEasyAchievement ? 1 : 0);
    const { getTime, ingredients, level } = POTIONS[potionName];
    const potionTimer = getTime();
    const getMakeable = () => brewingLevel >= level ? ingredients.reduce((acc, cur) => Math.min(Math.floor(Number(Items.getItem(cur.item)) / cur.amount), acc), Number.MAX_SAFE_INTEGER) : 0;
    const isDrinkable = amount > 0 && (timer < potionTimer * (maxPotions - 1) || timer === 0);
    const onDrinkClick = () => {
      if (isDrinkable) {
        setTimer(timer + potionTimer);
        updateTimer(`potion-${potionName}_timer`, timer + potionTimer);
        setTimeout(() => {
          updateTimer(`potion-${potionName}_timer`, timer + potionTimer - 1);
        }, 1e3);
        sendMessage("DRINK", potionName);
      }
    };
    const onBrewClick = (event) => {
      const makeable = getMakeable();
      let making = 1;
      if (makeable > 0) {
        if (event.shiftKey) {
          making = makeable;
        } else if (event.ctrlKey) {
          making = Math.min(5, makeable);
        }
        setAmount(amount + making);
        sendMessage("BREW", potionName, making);
      }
    };
    const [drinkProps, DrinkToolTip] = useTooltip([/* @__PURE__ */ React__default["default"].createElement("span", {
      style: { textAlign: "center" }
    }, "Drink ", Items.get_pretty_item_name(potionName))]);
    const tooltipProps = {
      potion: potionName,
      maxAmount: getMakeable(),
      ingredients,
      brewingIngredients,
      brewingLevel,
      level
    };
    const [brewProps, BrewToolTip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement(BrewingTooltip, __spreadValues({
        amount: Math.min(1, getMakeable())
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(BrewingTooltip, __spreadValues({
        amount: getMakeable()
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(BrewingTooltip, __spreadValues({
        amount: Math.min(5, getMakeable())
      }, tooltipProps))
    ], {
      width: 400
    });
    const [viewProps, ViewToolTip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { textAlign: "center" }
      }, favorite ? "Hide" : "Show", " ", Items.get_pretty_item_name(potionName))
    ]);
    const imgProps = view === BrewingView.DRINK ? drinkProps : view === BrewingView.BREW ? brewProps : viewProps;
    const onClick = view === BrewingView.DRINK ? onDrinkClick : view === BrewingView.BREW ? onBrewClick : toggle;
    return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        width: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70px",
        opacity: favorite ? 1 : 0.5
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, {
      role: "button",
      name: "stardust",
      onClick: toggle,
      style: {
        visibility: view === BrewingView.FAVORITE ? "visible" : "hidden"
      },
      size: 20
    }), /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: potionName,
      size: 30,
      onClick,
      role: "button",
      style: view === BrewingView.BREW && getMakeable() === 0 || view === BrewingView.DRINK && !isDrinkable ? {
        opacity: 0.5,
        cursor: "default"
      } : void 0
    }, imgProps)), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: {
        height: "20px"
      }
    }, amount), view === BrewingView.BREW && /* @__PURE__ */ React__default["default"].createElement("span", {
      style: {
        fontSize: "25px",
        fontWeight: "500",
        position: "absolute",
        margin: "0 0 40px 25px",
        height: "30px"
      }
    }, "+"), isDrinkable && /* @__PURE__ */ React__default["default"].createElement(DrinkToolTip, null), /* @__PURE__ */ React__default["default"].createElement(BrewToolTip, null), /* @__PURE__ */ React__default["default"].createElement(ViewToolTip, null)));
  };
  const id$b = "OverviewBox";
  const OverviewBox = (_e) => {
    var _f = _e, { width, height, children } = _f, style = __objRest(_f, ["width", "height", "children"]);
    const [uiMenuBackgroundColor] = useItemObserver("ui_menu_background_color", id$b);
    return /* @__PURE__ */ React.createElement("div", {
      style: __spreadValues({
        display: "flex",
        height: isNumber(height) ? `${height}px` : height,
        minHeight: `250px`,
        width: `${width}px`,
        gap: "5px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        color: "#fff",
        textShadow: "1px 1px #000, 0px 0px 3px #000",
        backgroundColor: uiMenuBackgroundColor && uiMenuBackgroundColor.charAt(0) === "#" ? uiMenuBackgroundColor + "aa" : "#004c4eaa",
        padding: "10px",
        boxSizing: "content-box"
      }, style)
    }, children);
  };
  const useBrewingIngredientsObserver = (id2) => {
    const hookId = `useBrewingIngredientsObserver-${id2}`;
    const [dottedGreenLeaf, setDottedGreenLeaf] = useNumberItemObserver(`dotted_green_leaf`, hookId);
    const [redMushroom, setRedMushroom] = useNumberItemObserver(`red_mushroom`, hookId);
    const [greenLeaf, setGreenLeaf] = useNumberItemObserver(`green_leaf`, hookId);
    const [limeLeaf, setLimeLeaf] = useNumberItemObserver(`lime_leaf`, hookId);
    const [strangeLeaf, setStrangeLeaf] = useNumberItemObserver(`strange_leaf`, hookId);
    const [goldLeaf, setGoldLeaf] = useNumberItemObserver(`gold_leaf`, hookId);
    const [bones, setBones] = useNumberItemObserver(`bones`, hookId);
    const [promethium, setPromethium] = useNumberItemObserver(`promethium`, hookId);
    const [rocketFuel, setRocketFuel] = useNumberItemObserver(`rocket_fuel`, hookId);
    const [moonstone, setMoonstone] = useNumberItemObserver(`moonstone`, hookId);
    const [titanium, setTitanium] = useNumberItemObserver(`titanium`, hookId);
    return {
      dotted_green_leaf: {
        value: dottedGreenLeaf,
        setValue: setDottedGreenLeaf
      },
      red_mushroom: {
        value: redMushroom,
        setValue: setRedMushroom
      },
      green_leaf: {
        value: greenLeaf,
        setValue: setGreenLeaf
      },
      lime_leaf: {
        value: limeLeaf,
        setValue: setLimeLeaf
      },
      strange_leaf: {
        value: strangeLeaf,
        setValue: setStrangeLeaf
      },
      gold_leaf: {
        value: goldLeaf,
        setValue: setGoldLeaf
      },
      bones: {
        value: bones,
        setValue: setBones
      },
      promethium: {
        value: promethium,
        setValue: setPromethium
      },
      rocket_fuel: {
        value: rocketFuel,
        setValue: setRocketFuel
      },
      moonstone: {
        value: moonstone,
        setValue: setMoonstone
      },
      titanium: {
        value: titanium,
        setValue: setTitanium
      }
    };
  };
  var BrewingView = /* @__PURE__ */ ((BrewingView2) => {
    BrewingView2["DRINK"] = "DRINK";
    BrewingView2["BREW"] = "BREW";
    BrewingView2["FAVORITE"] = "FAVORITE";
    return BrewingView2;
  })(BrewingView || {});
  const id$a = "BrewingOverview";
  const BrewingOverview = ({}) => {
    const [view, setView] = React$1.useState("DRINK");
    const potions = Object.keys(POTIONS);
    const brewingIngredients = useBrewingIngredientsObserver(id$a);
    const [favorites, setFavorites] = useLocalStorage("brewing-favorites", potions.slice(0, 15), id$a);
    const [brewingXp] = useNumberItemObserver("brewing_xp", id$a);
    const toggle = (potionName) => () => {
      setFavorites((favs) => {
        favs = toggleInArray(favs, potionName);
        return potions.filter((potion) => favs.includes(potion));
      });
    };
    const viewSelectorStyle = (selectorView) => ({
      opacity: view === selectorView ? 0.3 : 1
    });
    const blockPopup = React$1.useMemo(() => replaceWebSocketMessage("OPEN_DIALOGUE", (data) => {
      if (data.split("~")[0] === "INGREDIENTS USED") {
        return "";
      }
      return data;
    }), []);
    useWebsocket(blockPopup, 1, id$a);
    const [drinkProps, DrinkToolTip] = useTooltip([/* @__PURE__ */ React.createElement("span", {
      style: { textAlign: "center" }
    }, "Drink potions")]);
    const [brewProps, BrewToolTip] = useTooltip([/* @__PURE__ */ React.createElement("span", {
      style: { textAlign: "center" }
    }, "Brew potions")]);
    const [viewProps, ViewToolTip] = useTooltip([/* @__PURE__ */ React.createElement("span", {
      style: { textAlign: "center" }
    }, "Hide/show potions")]);
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: "auto",
      width: 300,
      flexDirection: "row",
      alignItems: "stretch"
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        width: `100%`,
        flexDirection: "row"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "30px",
        flexShrink: 0,
        justifyContent: "space-evenly",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: "brewing",
      onClick: () => setView("DRINK"),
      size: 30,
      style: viewSelectorStyle("DRINK")
    }, drinkProps)), /* @__PURE__ */ React.createElement(DrinkToolTip, null)), /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: "brewing_kit",
      onClick: () => setView("BREW"),
      size: 30,
      style: viewSelectorStyle("BREW")
    }, brewProps)), /* @__PURE__ */ React.createElement(BrewToolTip, null)), /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: "view",
      onClick: () => setView("FAVORITE"),
      size: 30,
      style: viewSelectorStyle("FAVORITE")
    }, viewProps)), /* @__PURE__ */ React.createElement(ViewToolTip, null))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start"
      }
    }, (view === "FAVORITE" ? potions : favorites).map((potion) => /* @__PURE__ */ React.createElement(PotionDisplay, {
      brewingLevel: get_level(brewingXp),
      key: potion,
      potionName: potion,
      toggle: toggle(potion),
      view,
      favorite: favorites.includes(potion),
      brewingIngredients
    })))));
  };
  const WoodcuttingPatch = ({ type, stage, timer, shiny, plotClick }) => {
    const [patchProps, PatchTooltip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { textAlign: "center" }
      }, shiny ? "Shiny " : "", Items.get_pretty_item_name(type))
    ], {
      width: 150
    });
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: `url(${get_image("images/background_grass.png")}`,
        borderRadius: "20px",
        height: "120px",
        width: "100px",
        cursor: stage === 4 ? "pointer" : "default"
      },
      onClick: () => {
        plotClick();
        hideTooltip();
      }
    }, !["none", "0"].includes(type) ? /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, shiny ? /* @__PURE__ */ React__default["default"].createElement("img", {
      src: get_image(`images/shiny.gif`),
      alt: "shiny",
      style: {
        objectFit: "cover",
        position: "absolute",
        height: "100px",
        width: "100px"
      }
    }) : null, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: `woodcutting_${type}_${stage}`,
      size: 100
    }, patchProps)), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: {
        color: "white"
      }
    }, stage === 4 ? "READY" : format_time(timer)), /* @__PURE__ */ React__default["default"].createElement(PatchTooltip, null)) : null);
  };
  const useTreePatchesObserver = (id2) => {
    const hookId = `useTreePatchesObserver-${id2}`;
    const [stage1, setStage1] = useNumberItemObserver(`tree_stage_1`, hookId);
    const [stage2, setStage2] = useNumberItemObserver(`tree_stage_2`, hookId);
    const [stage3, setStage3] = useNumberItemObserver(`tree_stage_3`, hookId);
    const [stage4, setStage4] = useNumberItemObserver(`tree_stage_4`, hookId);
    const [stage5, setStage5] = useNumberItemObserver(`tree_stage_5`, hookId);
    const [type1, setType1] = useItemObserver(`tree_1`, hookId);
    const [type2, setType2] = useItemObserver(`tree_2`, hookId);
    const [type3, setType3] = useItemObserver(`tree_3`, hookId);
    const [type4, setType4] = useItemObserver(`tree_4`, hookId);
    const [type5, setType5] = useItemObserver(`tree_5`, hookId);
    const [timer1, setTimer1] = useNumberItemObserver(`tree_timer_1`, hookId);
    const [timer2, setTimer2] = useNumberItemObserver(`tree_timer_2`, hookId);
    const [timer3, setTimer3] = useNumberItemObserver(`tree_timer_3`, hookId);
    const [timer4, setTimer4] = useNumberItemObserver(`tree_timer_4`, hookId);
    const [timer5, setTimer5] = useNumberItemObserver(`tree_timer_5`, hookId);
    const [shiny1, setShiny1] = useNumberItemObserver(`tree_shiny_1`, hookId);
    const [shiny2, setShiny2] = useNumberItemObserver(`tree_shiny_2`, hookId);
    const [shiny3, setShiny3] = useNumberItemObserver(`tree_shiny_3`, hookId);
    const [shiny4, setShiny4] = useNumberItemObserver(`tree_shiny_4`, hookId);
    const [shiny5, setShiny5] = useNumberItemObserver(`tree_shiny_5`, hookId);
    return [
      {
        stage: stage1,
        setStage: setStage1,
        type: type1,
        setType: setType1,
        timer: timer1,
        setTimer: setTimer1,
        shiny: shiny1,
        setShiny: setShiny1
      },
      {
        stage: stage2,
        setStage: setStage2,
        type: type2,
        setType: setType2,
        timer: timer2,
        setTimer: setTimer2,
        shiny: shiny2,
        setShiny: setShiny2
      },
      {
        stage: stage3,
        setStage: setStage3,
        type: type3,
        setType: setType3,
        timer: timer3,
        setTimer: setTimer3,
        shiny: shiny3,
        setShiny: setShiny3
      },
      {
        stage: stage4,
        setStage: setStage4,
        type: type4,
        setType: setType4,
        timer: timer4,
        setTimer: setTimer4,
        shiny: shiny4,
        setShiny: setShiny4
      },
      {
        stage: stage5,
        setStage: setStage5,
        type: type5,
        setType: setType5,
        timer: timer5,
        setTimer: setTimer5,
        shiny: shiny5,
        setShiny: setShiny5
      }
    ];
  };
  const LogTooltip = ({ text, postText, log, amount, logHeat }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, text, " ", amount, " ", Items.get_pretty_item_name(log)), /* @__PURE__ */ React__default["default"].createElement("div", null, postText), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", justifyContent: "space-evenly" }
    }, /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "heat",
      size: 20,
      label: logHeat * amount
    })));
  };
  const id$9 = "LogDisplay";
  const LogDisplay = ({ log, logHeat }) => {
    const [amount, setAmount] = useNumberItemObserver(log, id$9);
    const onLogClick = (event) => {
      hideTooltip();
      if (event.shiftKey) {
        setAmount(0);
        sendMessage("ADD_HEAT", log, amount);
      } else if (event.ctrlKey) {
        let making = Math.floor(amount / 2);
        setAmount(amount - making);
        sendMessage("ADD_HEAT", log, making);
      } else {
        Modals.open_input_dialogue_with_value(log, "Add Heat", "<span class='font-large'>Add heat to your oven.</span><br /><br /><span class='color-grey'>Gain <img src='https://d1xsc8x7nc5q8t.cloudfront.net/images/heat.png' /> " + Cooking.getHeatPerLog(log) + " heat per log.</span><br /><br />", amount, "ADD_HEAT");
      }
    };
    const logTooltipProps = {
      log,
      logHeat
    };
    const [logProps, LogTooltips, hideTooltip] = useTooltip([
      /* @__PURE__ */ React.createElement(LogTooltip, __spreadValues({
        text: "Use",
        postText: "(with confirmation)",
        amount
      }, logTooltipProps)),
      /* @__PURE__ */ React.createElement(LogTooltip, __spreadValues({
        text: "Add",
        postText: "(no confirmation)",
        amount
      }, logTooltipProps)),
      /* @__PURE__ */ React.createElement(LogTooltip, __spreadValues({
        text: "Add",
        amount: Math.floor(amount / 2),
        postText: "(no confirmation)"
      }, logTooltipProps))
    ], {
      width: 250
    });
    return amount > 0 ? /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      name: log,
      size: 30,
      onClick: onLogClick,
      role: "button"
    }, logProps)), /* @__PURE__ */ React.createElement("span", null, amount), /* @__PURE__ */ React.createElement(LogTooltips, null)) : null;
  };
  const id$8 = "WoodcuttingOverview";
  const WoodcuttingOverview = () => {
    const patches = 3 + Math.sign(Number(Items.getItem("donor_tree_patches_timestamp"))) * 2;
    const logs = keysOf(Cooking.LOG_HEAT_MAP);
    const patchData = useTreePatchesObserver(id$8);
    const finishedPatches = patchData.reduce((acc, cur) => acc + (cur.stage === 4 ? 1 : 0), 0);
    const plotClick = (index) => {
      const { stage, setType, setStage } = patchData[index];
      if (stage === 4) {
        if (finishedPatches === 1) {
          hideElementById("notification-woodcutting");
        }
        Woodcutting.clicksPlot(index + 1);
        setType("none");
        setStage(0);
      }
    };
    const [heat] = useNumberItemObserver("heat", id$8);
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: 250,
      width: 550,
      justifyContent: "space-evenly"
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        marginTop: "5px",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: "heat",
      size: 20,
      title: "Heat"
    }), /* @__PURE__ */ React.createElement("span", null, heat)), logs.map((log) => /* @__PURE__ */ React.createElement(LogDisplay, {
      log,
      logHeat: Cooking.getHeatPerLog(log)
    }))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        gap: "10px"
      }
    }, Array(patches).fill(null).map((v, i) => /* @__PURE__ */ React.createElement(WoodcuttingPatch, __spreadProps(__spreadValues({}, patchData[i]), {
      plotClick: () => plotClick(i),
      key: i + 1
    })))));
  };
  const OreTooltip = ({
    ore,
    amount,
    oilPerBar,
    charcoalPerBar,
    lavaPerBar
  }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, "Smelt ", amount, " ", Items.get_pretty_item_name(ore)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", justifyContent: "space-evenly" }
    }, oilPerBar > 0 && /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "oil",
      size: 30,
      label: oilPerBar * amount
    }), charcoalPerBar > 0 && /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "charcoal",
      size: 30,
      label: charcoalPerBar * amount
    }), lavaPerBar > 0 && /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "lava",
      size: 30,
      label: lavaPerBar * amount
    })));
  };
  const OreDisplay = ({
    ore,
    disabled,
    setSmelting,
    oil,
    setOil,
    charcoal,
    setCharcoal,
    lava,
    setLava
  }) => {
    const furnaceCapacity = Number(Furnace.getFurnaceCapacity());
    const [amount, setAmount] = useNumberItemObserver(ore, `OreDisplay-${ore}`);
    const oilPerBar = Crafting.getOilPerBar(ore);
    const charcoalPerBar = Crafting.getCharcoalPerBar(ore);
    const lavaPerBar = Crafting.getLavaPerBar(ore);
    const getSmeltable = () => {
      const maxAmountOil = Math.floor(Math.min(oil / oilPerBar || Infinity, amount));
      const maxAmountCharcoal = Math.floor(Math.min(charcoal / charcoalPerBar || Infinity, amount));
      const maxAmountLava = Math.floor(Math.min(lava / lavaPerBar || Infinity, amount));
      const maxAmount = Math.min(maxAmountOil, maxAmountCharcoal, maxAmountLava);
      return Math.min(furnaceCapacity, maxAmount);
    };
    const onClick = (event) => {
      let making = getSmeltable();
      if (event.ctrlKey) {
        making = Math.min(5, making);
      } else if (event.shiftKey) {
        making = Math.floor(making / 2);
      }
      if (making > 0) {
        setSmelting({
          type: ore,
          amountAt: 0,
          amountSet: making
        });
        if (amount === making) {
          hideTooltip();
        }
        setAmount(amount - making);
        setOil(oil - making * oilPerBar);
        setCharcoal(charcoal - making * charcoalPerBar);
        setLava(lava - making * lavaPerBar);
        updateTextContentById("notification-furnace-label", `0/${making}`);
        showElementById("notification-furnace");
        sendMessage("SMELT", ore, making);
      }
    };
    const tooltipProps = {
      ore,
      oilPerBar,
      charcoalPerBar,
      lavaPerBar
    };
    const [oreProps, OreToolTips, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement(OreTooltip, __spreadValues({
        amount: getSmeltable()
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(OreTooltip, __spreadValues({
        amount: Math.max(Math.floor(getSmeltable() / 2), 1)
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(OreTooltip, __spreadValues({
        amount: Math.min(getSmeltable(), 5)
      }, tooltipProps))
    ], {
      width: 300
    });
    const unselectable = disabled || amount === 0 || oil < oilPerBar || charcoal < charcoalPerBar || lava < lavaPerBar;
    const formattedAmount = formatNumber(amount);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      role: "button",
      name: ore,
      size: 30,
      style: unselectable ? {
        opacity: 0.5,
        cursor: "default"
      } : void 0,
      onClick: unselectable ? void 0 : onClick
    }, oreProps)), /* @__PURE__ */ React__default["default"].createElement("span", null, formattedAmount), !unselectable && /* @__PURE__ */ React__default["default"].createElement(OreToolTips, null));
  };
  const BarDisplay = ({ bar }) => {
    const [amount, setAmount] = useNumberItemObserver(bar, "BarDisplay");
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: bar,
      size: 30
    }), /* @__PURE__ */ React.createElement("span", null, amount));
  };
  const ORES = ["copper", "iron", "silver", "gold", "promethium", "titanium"];
  const BARS = [
    "bronze_bar",
    "iron_bar",
    "silver_bar",
    "gold_bar",
    "promethium_bar",
    "titanium_bar"
  ];
  const oreToBar = (ore) => ore === "copper" ? "bronze_bar" : `${ore}_bar`;
  const id$7 = "CraftingOverview";
  const CraftingOverview = () => {
    const furnace = Furnace.getFurnace();
    const [oreType, setOreType] = useItemObserver("furnace_ore_type", id$7);
    const [oreAmountAt, setOreAmountAt] = useNumberItemObserver("furnace_ore_amount_at", id$7);
    const [oreAmountSet, setOreAmountSet] = useNumberItemObserver("furnace_ore_amount_set", id$7);
    const [oil, setOil] = useNumberItemObserver("oil", id$7);
    const [charcoal, setCharcoal] = useNumberItemObserver("charcoal", id$7);
    const [lava, setLava] = useNumberItemObserver("lava", id$7);
    const setSmelting = (smelting) => {
      setOreType(smelting.type);
      setOreAmountAt(smelting.amountAt);
      setOreAmountSet(smelting.amountSet);
    };
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: 250,
      width: 420
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px"
      }
    }, BARS.map((bar) => /* @__PURE__ */ React.createElement(BarDisplay, {
      bar,
      key: bar
    }))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        width: "100px",
        justifyContent: "flex-end",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: "oil",
      size: 30
    }), /* @__PURE__ */ React.createElement("span", null, formatNumber(oil))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        alignItems: "center",
        width: "150px"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: furnace,
      size: 50,
      ext: oreType !== "none" ? "gif" : "png"
    }), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "5px"
      }
    }, oreType !== "none" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IPimg, {
      name: oreToBar(oreType),
      size: 20,
      style: {}
    }), /* @__PURE__ */ React.createElement("span", null, `${oreAmountAt}/${oreAmountSet}`)) : /* @__PURE__ */ React.createElement("span", null, "Not smelting"))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        width: "100px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        width: "50px",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: "charcoal",
      size: 30
    }), /* @__PURE__ */ React.createElement("span", null, charcoal)), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        width: "50px",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, {
      name: "lava",
      size: 30
    }), /* @__PURE__ */ React.createElement("span", null, lava)))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px"
      }
    }, ORES.map((ore) => /* @__PURE__ */ React.createElement(OreDisplay, {
      ore,
      disabled: oreType !== "none",
      setSmelting,
      oil,
      setOil,
      charcoal,
      setCharcoal,
      lava,
      setLava,
      key: ore
    }))));
  };
  const MachineDisplay = ({
    machine,
    changeOilOut,
    level,
    items,
    miningLevel
  }) => {
    const oilUse = Ores.getOilCost(machine);
    const [machineProps, MachineTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          alignItems: "center"
        }
      }, /* @__PURE__ */ React__default["default"].createElement("span", null, Items.get_pretty_item_name(machine)), /* @__PURE__ */ React__default["default"].createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-evenly",
          gap: "10px"
        }
      }, items.map((item) => /* @__PURE__ */ React__default["default"].createElement(IPimg, {
        name: item,
        size: 30
      }))))
    ], {
      width: 230
    });
    const [amount] = useNumberItemObserver(machine, "MachineDisplay");
    const [amountOn, setAmountOn] = useNumberItemObserver(`${machine}_on`, "MachineDisplay");
    const onIncrease = () => {
      if (miningLevel >= level && amountOn < amount) {
        sendMessage("MACHINERY", machine, "increase");
        setAmountOn(amountOn + 1);
        changeOilOut(oilUse);
      }
    };
    const onDecrease = () => {
      if (amountOn > 0) {
        sendMessage("MACHINERY", machine, "decrease");
        setAmountOn(amountOn - 1);
        changeOilOut(-oilUse);
      }
    };
    return amount > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: machine,
      size: 50,
      className: amountOn > 0 ? "shake" : ""
    }, machineProps)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        gap: "5px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, {
      name: "oil",
      size: 20
    }), /* @__PURE__ */ React__default["default"].createElement("span", null, `${oilUse * amountOn} (${oilUse})`)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        gap: "5px",
        width: "max-content"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      role: "button",
      style: {
        fontWeight: "500",
        userSelect: "none",
        visibility: amountOn > 0 ? "visible" : "hidden"
      },
      onClick: onDecrease
    }, "<"), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: { margin: "0 10px" }
    }, `${amountOn} / ${amount}`), /* @__PURE__ */ React__default["default"].createElement("span", {
      role: "button",
      style: {
        fontWeight: "500",
        userSelect: "none",
        visibility: miningLevel >= level && amountOn < amount ? "visible" : "hidden"
      },
      onClick: onIncrease
    }, ">")))), /* @__PURE__ */ React__default["default"].createElement(MachineTooltip, null)) : null;
  };
  const Tooltip = ({ text, postText }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        textAlign: "center"
      }
    }, text), /* @__PURE__ */ React__default["default"].createElement("div", null, postText));
  };
  const PrismDisplay = ({ prism }) => {
    const [amount, setAmount] = useNumberItemObserver(prism + "_stardust_prism", `PrismDisplay-${prism}`);
    const onPrismClick = (event) => {
      hideTooltip();
      if (event.shiftKey) {
        setAmount(amount - (amount - 1));
        sendMessage("SMASH_STARDUST_PRISM", prism + "_stardust_prism", amount - 1);
      } else {
        setAmount(0);
        sendMessage("SMASH_STARDUST_PRISM", prism + "_stardust_prism", amount);
      }
    };
    const [prismProps, PrismToolTip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Smash ${amount} ${Items.get_pretty_item_name(prism)} Prism${pluralMarker(amount)}`
      }),
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Smash ${amount - 1} ${Items.get_pretty_item_name(prism)} Prism${pluralMarker(amount)}`
      })
    ]);
    return amount > 0 ? /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: prism + "_stardust_prism",
      size: 30,
      onClick: onPrismClick
    }, prismProps)), /* @__PURE__ */ React.createElement("span", null, amount), /* @__PURE__ */ React.createElement(PrismToolTip, null)) : null;
  };
  const GeodeDisplay = ({ geode }) => {
    const [amount, setAmount] = useNumberItemObserver(geode + "_geode", `GeodeDisplay-${geode}`);
    const onGeodeClick = (event) => {
      hideTooltip();
      if (event.shiftKey) {
        setAmount(amount - (amount - 1));
        sendMessage("CRACK_GEODE", geode + "_geode", amount - 1);
      } else {
        setAmount(0);
        sendMessage("CRACK_GEODE", geode + "_geode", amount);
      }
    };
    const [geodeProps, GeodeToolTip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Crack ${amount} ${Items.get_pretty_item_name(geode)} Geode${pluralMarker(amount)}`
      }),
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Crack ${amount - 1} ${Items.get_pretty_item_name(geode)} Geode${pluralMarker(amount)}`
      })
    ]);
    return amount > 0 ? /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: geode + "_geode",
      size: 30,
      onClick: onGeodeClick
    }, geodeProps)), /* @__PURE__ */ React.createElement("span", null, amount), /* @__PURE__ */ React.createElement(GeodeToolTip, null)) : null;
  };
  const MineralDisplay = ({ mineral }) => {
    const [amount, setAmount] = useNumberItemObserver(mineral, `MineralDisplay-${mineral}`);
    const onMineralClick = (event) => {
      hideTooltip();
      if (event.shiftKey) {
        setAmount(0);
        sendMessage("MINERAL_XP", mineral, amount);
      } else if (event.ctrlKey) {
        Modals.open_custom_crafting(mineral);
      } else {
        Modals.clicks_mineral(mineral);
      }
    };
    const [mineralProps, MineralToolTip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Use ${amount} ${Items.get_pretty_item_name(mineral)}${pluralMarker(amount)}`,
        postText: "(with confirmation)"
      }),
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Convert ${amount} ${Items.get_pretty_item_name(mineral)}${pluralMarker(amount)} into ${Ores.MINERALS_XP_MAP[mineral] * amount} mining xp`,
        postText: "(no confirmation)"
      }),
      /* @__PURE__ */ React.createElement(Tooltip, {
        text: `Craft rings with ${amount} ${Items.get_pretty_item_name(mineral)}${pluralMarker(amount)}`,
        postText: "(with confirmation)"
      })
    ], {
      width: 260
    });
    return amount > 0 ? /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      role: "button",
      name: mineral,
      size: 30,
      onClick: onMineralClick
    }, mineralProps)), /* @__PURE__ */ React.createElement("span", null, amount), /* @__PURE__ */ React.createElement(MineralToolTip, null)) : null;
  };
  const MACHINES = {
    drill: {
      level: 1,
      items: ["stone", "copper", "iron", "silver"]
    },
    crusher: {
      level: 10,
      items: ["stone", "copper", "iron", "silver", "gold"]
    },
    giant_drill: {
      level: 25,
      items: ["silver", "gold", "promethium"]
    },
    excavator: {
      level: 60,
      items: ["gold", "promethium", "titanium"]
    }
  };
  const RocketTooltip = ({ fuel }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, "Start Rocket"), /* @__PURE__ */ React__default["default"].createElement("div", null, "Available fuel"), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", justifyContent: "space-evenly" }
    }, /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "rocket_fuel",
      size: 20,
      label: fuel
    })));
  };
  const id$6 = "RocketDisplay";
  const RocketDisplay = ({}) => {
    const [rocket] = useNumberItemObserver("rocket", id$6);
    const [rocketStatus] = useItemObserver("rocket_status", id$6);
    const [rocketKm] = useNumberItemObserver("rocket_km", id$6);
    const [rocketDistanceRequired] = useNumberItemObserver("rocket_distance_required", id$6);
    const [rocketFuel] = useNumberItemObserver("rocket_fuel", id$6);
    const onRocketClick = (event) => {
      Modals.clicks_rocket();
    };
    const [rocketProps, RocketToolTip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React.createElement(RocketTooltip, {
        fuel: rocketFuel
      })
    ]);
    return rocket > 0 ? /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      name: rocketKm > 0 && rocketKm < rocketDistanceRequired ? "rocket" : "rocket_idle",
      ext: rocketKm > 0 && rocketKm < rocketDistanceRequired ? "gif" : "png",
      size: 30,
      onClick: onRocketClick,
      className: rocketKm > 0 && rocketKm < rocketDistanceRequired ? "shake" : "",
      role: "button"
    }, rocketProps)), /* @__PURE__ */ React.createElement("span", null, rocketStatus && rocketStatus === "none" ? "Idle" : Items.get_pretty_item_name(rocketStatus)), /* @__PURE__ */ React.createElement(RocketToolTip, null)) : null;
  };
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"];
  const GEODES = ["grey", "blue", "green", "red", "cyan", "ancient"];
  const MINERALS = keysOf(Ores.MINERALS_XP_MAP);
  const id$5 = "MiningOverview";
  const MiningOverview = () => {
    const [oilIn] = useNumberItemObserver("oil_in", id$5);
    const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id$5);
    const [miningXp] = useNumberItemObserver("mining_xp", id$5);
    const miningLevel = get_level(miningXp);
    const changeOilOut = (change) => setOilOut(oilOut + change);
    const [moonstone] = useNumberItemObserver("moonstone", id$5);
    const onMoonstoneClick = () => {
      Modals.open_custom_crafting("moonstone");
    };
    const [moonstoneProps, MoonstoneToolTip] = useTooltip([
      /* @__PURE__ */ React.createElement("span", {
        style: { textAlign: "center" }
      }, "Use ", moonstone, " Moonstone", pluralMarker(moonstone))
    ]);
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: "auto",
      width: 420
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        justifyContent: "space-evenly"
      }
    }, /* @__PURE__ */ React.createElement(LabeledIPimg, {
      name: "oil",
      label: `${oilIn > oilOut ? "+" : ""}${oilIn - oilOut}`,
      size: 30,
      style: {
        justifyContent: "center",
        color: oilIn >= oilOut ? "#fff" : "#ff0000",
        filter: oilIn >= oilOut ? "" : "invert(16%) sepia(91%) saturate(5761%) hue-rotate(357deg) brightness(96%) contrast(116%)"
      }
    }), /* @__PURE__ */ React.createElement(RocketDisplay, null)), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around"
      }
    }, Object.keys(MACHINES).map((machine) => /* @__PURE__ */ React.createElement(MachineDisplay, __spreadProps(__spreadValues({
      machine,
      changeOilOut
    }, MACHINES[machine]), {
      miningLevel,
      key: machine
    })))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center"
      }
    }, STARDUST_PRISMS.map((prism) => /* @__PURE__ */ React.createElement(PrismDisplay, {
      prism
    })), GEODES.map((geode) => /* @__PURE__ */ React.createElement(GeodeDisplay, {
      geode
    })), MINERALS.map((mineral) => /* @__PURE__ */ React.createElement(MineralDisplay, {
      mineral
    })), moonstone > 0 && /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(IPimg, __spreadValues({
      name: "moonstone",
      size: 30,
      onClick: onMoonstoneClick,
      title: "Moonstone",
      role: "button"
    }, moonstoneProps)), /* @__PURE__ */ React.createElement("span", null, moonstone), /* @__PURE__ */ React.createElement(MoonstoneToolTip, null))));
  };
  const getDeathImage = (seed) => seed.includes("leaf") ? "farming_dead_leaf" : seed.includes("tree") ? "farming_dead_tree" : "farming_dead_mushroom";
  const FarmingPatch = ({
    seed,
    stage,
    timer,
    shiny,
    death,
    plotClick
  }) => {
    const [patchProps, PatchTooltip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { textAlign: "center" }
      }, shiny ? "Shiny " : "", death ? "Dead " : "", Items.get_pretty_item_name(seed))
    ]);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: `url(${get_image("images/background_grass.png")}`,
        borderRadius: "20px",
        height: "120px",
        width: "100px",
        cursor: stage === 4 ? "pointer" : "default"
      },
      onClick: () => {
        plotClick();
        hideTooltip();
      }
    }, !["none", "0"].includes(seed) ? /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { height: "100px", width: "100px" }
    }, shiny ? /* @__PURE__ */ React__default["default"].createElement("img", {
      src: get_image(`images/shiny.gif`),
      alt: "shiny",
      style: {
        objectFit: "cover",
        position: "absolute",
        height: "100px",
        width: "100px"
      }
    }) : null, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: death ? getDeathImage(seed) : `farming_${seed}_${stage}`,
      size: 100,
      style: { zIndex: 1, position: "absolute", objectFit: "unset" }
    }, patchProps)), /* @__PURE__ */ React__default["default"].createElement(IPimg, {
      name: `farming_none`,
      size: 100,
      style: { position: "absolute", objectFit: "unset" }
    })), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: {
        color: "white"
      }
    }, stage === 4 ? "READY" : timer > 0 ? format_time(timer) : ""), /* @__PURE__ */ React__default["default"].createElement(PatchTooltip, null)) : null);
  };
  const id$4 = "SeedDisplay";
  const SeedDisplay = ({
    seed,
    seedClick,
    nextPlot,
    farmingLevel,
    level,
    stopsDying,
    bonemeal,
    bonemealCost,
    setBonemeal,
    time
  }) => {
    const [amount, setAmount] = useNumberItemObserver(seed, id$4);
    const canPlant = nextPlot > 0 && amount > 0 && bonemeal >= bonemealCost && farmingLevel >= level;
    const onClick = () => {
      if (canPlant) {
        seedClick();
        if (amount === 1) {
          hideTooltip();
        }
        setAmount(amount - 1);
        setBonemeal(bonemeal - bonemealCost);
      }
    };
    const [seedProps, SeedTooltip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }
      }, /* @__PURE__ */ React__default["default"].createElement("span", null, canPlant ? "Plant" : "Can't Plant", " ", Items.get_pretty_item_name(seed)), /* @__PURE__ */ React__default["default"].createElement("span", null, "Time: ", formatMinutes(time)), /* @__PURE__ */ React__default["default"].createElement("span", null, "Level:", " ", /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { color: farmingLevel < level ? "red" : "unset" }
      }, level)), stopsDying > 0 && /* @__PURE__ */ React__default["default"].createElement("span", null, "Stops Dying:", " ", /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { color: farmingLevel < stopsDying ? "yellow" : "unset" }
      }, stopsDying)), bonemealCost > 0 && /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
        size: 30,
        name: "bonemeal",
        label: bonemealCost,
        style: { color: bonemeal < bonemealCost ? "red" : "unset" }
      }))
    ], {
      width: 250
    });
    return amount > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: seed,
      size: 30,
      onClick,
      role: "button",
      style: {
        cursor: canPlant ? "pointer" : "default",
        opacity: canPlant ? 1 : 0.5
      }
    }, seedProps)), /* @__PURE__ */ React__default["default"].createElement("span", null, amount), nextPlot > 0 && /* @__PURE__ */ React__default["default"].createElement(SeedTooltip, null)) : null;
  };
  const stageOverride = (value) => value === 4;
  const timerOverride = (value) => value === 1;
  const useFarmPatchesObserver = (id2) => {
    const hookId = `useFarmPatchesObserver-${id2}`;
    const [stage1, setStage1] = useNumberItemObserver(`farm_stage_1`, hookId, stageOverride);
    const [stage2, setStage2] = useNumberItemObserver(`farm_stage_2`, hookId, stageOverride);
    const [stage3, setStage3] = useNumberItemObserver(`farm_stage_3`, hookId, stageOverride);
    const [stage4, setStage4] = useNumberItemObserver(`farm_stage_4`, hookId, stageOverride);
    const [stage5, setStage5] = useNumberItemObserver(`farm_stage_5`, hookId, stageOverride);
    const [seed1, setSeed1] = useItemObserver(`farm_1`, hookId);
    const [seed2, setSeed2] = useItemObserver(`farm_2`, hookId);
    const [seed3, setSeed3] = useItemObserver(`farm_3`, hookId);
    const [seed4, setSeed4] = useItemObserver(`farm_4`, hookId);
    const [seed5, setSeed5] = useItemObserver(`farm_5`, hookId);
    const [timer1, setTimer1] = useNumberItemObserver(`farm_timer_1`, hookId, timerOverride);
    const [timer2, setTimer2] = useNumberItemObserver(`farm_timer_2`, hookId, timerOverride);
    const [timer3, setTimer3] = useNumberItemObserver(`farm_timer_3`, hookId, timerOverride);
    const [timer4, setTimer4] = useNumberItemObserver(`farm_timer_4`, hookId, timerOverride);
    const [timer5, setTimer5] = useNumberItemObserver(`farm_timer_5`, hookId, timerOverride);
    const [shiny1, setShiny1] = useNumberItemObserver(`farm_shiny_1`, hookId);
    const [shiny2, setShiny2] = useNumberItemObserver(`farm_shiny_2`, hookId);
    const [shiny3, setShiny3] = useNumberItemObserver(`farm_shiny_3`, hookId);
    const [shiny4, setShiny4] = useNumberItemObserver(`farm_shiny_4`, hookId);
    const [shiny5, setShiny5] = useNumberItemObserver(`farm_shiny_5`, hookId);
    const [death1, setDeath1] = useNumberItemObserver(`farm_death_1`, hookId);
    const [death2, setDeath2] = useNumberItemObserver(`farm_death_2`, hookId);
    const [death3, setDeath3] = useNumberItemObserver(`farm_death_3`, hookId);
    const [death4, setDeath4] = useNumberItemObserver(`farm_death_4`, hookId);
    const [death5, setDeath5] = useNumberItemObserver(`farm_death_5`, hookId);
    return [
      {
        stage: stage1,
        setStage: setStage1,
        seed: seed1,
        setSeed: setSeed1,
        timer: timer1,
        setTimer: setTimer1,
        shiny: shiny1,
        setShiny: setShiny1,
        death: death1,
        setDeath: setDeath1
      },
      {
        stage: stage2,
        setStage: setStage2,
        seed: seed2,
        setSeed: setSeed2,
        timer: timer2,
        setTimer: setTimer2,
        shiny: shiny2,
        setShiny: setShiny2,
        death: death2,
        setDeath: setDeath2
      },
      {
        stage: stage3,
        setStage: setStage3,
        seed: seed3,
        setSeed: setSeed3,
        timer: timer3,
        setTimer: setTimer3,
        shiny: shiny3,
        setShiny: setShiny3,
        death: death3,
        setDeath: setDeath3
      },
      {
        stage: stage4,
        setStage: setStage4,
        seed: seed4,
        setSeed: setSeed4,
        timer: timer4,
        setTimer: setTimer4,
        shiny: shiny4,
        setShiny: setShiny4,
        death: death4,
        setDeath: setDeath4
      },
      {
        stage: stage5,
        setStage: setStage5,
        seed: seed5,
        setSeed: setSeed5,
        timer: timer5,
        setTimer: setTimer5,
        shiny: shiny5,
        setShiny: setShiny5,
        death: death5,
        setDeath: setDeath5
      }
    ];
  };
  const SEEDS = {
    dotted_green_leaf_seeds: {
      level: 1,
      stopsDying: 15,
      time: 15,
      bonemealCost: 0
    },
    green_leaf_seeds: {
      level: 10,
      stopsDying: 25,
      time: 30,
      bonemealCost: 0
    },
    lime_leaf_seeds: {
      level: 25,
      stopsDying: 40,
      time: 60,
      bonemealCost: 1
    },
    gold_leaf_seeds: {
      level: 50,
      stopsDying: 60,
      time: 2 * 60,
      bonemealCost: 5
    },
    crystal_leaf_seeds: {
      level: 70,
      stopsDying: 80,
      time: 5 * 60,
      bonemealCost: 25
    },
    red_mushroom_seeds: {
      level: 1,
      stopsDying: 0,
      time: 5,
      bonemealCost: 0
    },
    eggplant_seeds: {
      level: 1,
      stopsDying: 0,
      time: 5,
      bonemealCost: 0
    },
    stardust_seeds: {
      level: 8,
      stopsDying: 0,
      time: 20,
      bonemealCost: 0
    },
    tree_seeds: {
      level: 10,
      stopsDying: 25,
      time: 5 * 60,
      bonemealCost: 10
    },
    oak_tree_seeds: {
      level: 25,
      stopsDying: 40,
      time: 4 * 60,
      bonemealCost: 25
    },
    willow_tree_seeds: {
      level: 37,
      stopsDying: 55,
      time: 8 * 60,
      bonemealCost: 50
    },
    maple_tree_seeds: {
      level: 50,
      stopsDying: 65,
      time: 12 * 60,
      bonemealCost: 120
    },
    stardust_tree_seeds: {
      level: 65,
      stopsDying: 80,
      time: 15 * 60,
      bonemealCost: 150
    },
    pine_tree_seeds: {
      level: 70,
      stopsDying: 85,
      time: 17 * 60,
      bonemealCost: 180
    },
    redwood_tree_seeds: {
      level: 80,
      stopsDying: 92,
      time: 22 * 60,
      bonemealCost: 300
    },
    apple_tree_seeds: {
      level: 50,
      stopsDying: 55,
      time: 8 * 60,
      bonemealCost: 50
    },
    banana_tree_seeds: {
      level: 57,
      stopsDying: 62,
      time: 11 * 60,
      bonemealCost: 70
    },
    orange_tree_seeds: {
      level: 66,
      stopsDying: 70,
      time: 15 * 60,
      bonemealCost: 120
    },
    palm_tree_seeds: {
      level: 82,
      stopsDying: 90,
      time: 19 * 60,
      bonemealCost: 200
    }
  };
  const BONES = {
    bones: {
      bonemeal: 1
    },
    big_bones: {
      bonemeal: 2
    },
    ice_bones: {
      bonemeal: 3
    },
    ashes: {
      bonemeal: 2
    },
    blood_bones: {
      bonemeal: 4
    }
  };
  const BoneTooltip = ({ bone, amount, bonemealValue }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, "Add ", amount, " ", Items.get_pretty_item_name(bone)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", justifyContent: "space-evenly" }
    }, /* @__PURE__ */ React__default["default"].createElement(LabeledIPimg, {
      name: "bonemeal",
      size: 30,
      label: bonemealValue * amount
    })));
  };
  const id$3 = "BoneDisplay";
  const BoneDisplay = ({ bone, bonemealValue, bonemeal, setBonemeal }) => {
    const [amount, setAmount] = useNumberItemObserver(bone, id$3);
    const onClick = (event) => {
      let adding = amount;
      if (event.ctrlKey) {
        adding = Math.min(5, adding);
      } else if (event.shiftKey) {
        adding = Math.floor(adding / 2);
      }
      if (adding > 0) {
        if (adding === amount) {
          hideTooltip();
        }
        setAmount(amount - adding);
        setBonemeal(bonemeal + adding * bonemealValue);
        sendMessage("ADD_BONEMEAL", bone, adding);
      }
    };
    const tooltipProps = {
      bone,
      bonemealValue
    };
    const [boneProps, BoneTooltips, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement(BoneTooltip, __spreadValues({
        amount
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(BoneTooltip, __spreadValues({
        amount: Math.max(Math.floor(amount / 2), 1)
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(BoneTooltip, __spreadValues({
        amount: Math.min(amount, 5)
      }, tooltipProps))
    ], {
      width: 250
    });
    return amount > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: bone,
      size: 30,
      onClick,
      title: Items.get_pretty_item_name(bone),
      role: "button"
    }, boneProps)), /* @__PURE__ */ React__default["default"].createElement("span", null, amount), /* @__PURE__ */ React__default["default"].createElement(BoneTooltips, null)) : null;
  };
  const id$2 = "FarmingOverview";
  const FarmingOverview = () => {
    const seeds = Object.keys(SEEDS);
    const bones = keysOf(BONES);
    const [bonemeal, setBonemeal] = useNumberItemObserver("bonemeal", id$2);
    const [farmingXp] = useNumberItemObserver("farming_xp", id$2);
    const patches = 3 + Math.sign(Number(Items.getItem("donor_farm_patches_timestamp"))) * 2;
    const patchData = useFarmPatchesObserver(id$2);
    const nextPlot = patchData.map((patch) => patch.stage).findIndex((value, index) => value === 0 && index < patches) + 1;
    const finishedPatches = patchData.reduce((acc, cur) => acc + (cur.stage === 4 ? 1 : 0), 0);
    const seedClick = (seed) => {
      sendMessage("PLANT", seed, nextPlot);
      patchData[nextPlot - 1].setSeed(seed);
      patchData[nextPlot - 1].setStage(1);
      patchData[nextPlot - 1].setTimer(SEEDS[seed].time * 60);
    };
    const plotClick = (index) => {
      const { stage, setStage, setSeed, death } = patchData[index];
      if (stage === 4 || death === 1) {
        if (finishedPatches === 1) {
          hideElementById("notification-farming");
        }
        sendMessage("CLICKS_PLOT", index + 1);
        setSeed("none");
        setStage(0);
      }
    };
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: "auto",
      width: 550,
      justifyContent: "space-between"
    }, /* @__PURE__ */ React.createElement("div", {
      style: { display: "flex" }
    }, /* @__PURE__ */ React.createElement(LabeledIPimg, {
      name: "bonemeal_bin",
      label: bonemeal,
      size: 50,
      style: { justifyContent: "center" }
    }), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        width: "100px"
      }
    }, bones.map((bone) => /* @__PURE__ */ React.createElement(BoneDisplay, {
      bone,
      bonemealValue: BONES[bone].bonemeal,
      bonemeal,
      setBonemeal,
      key: bone
    }))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        minHeight: "120px",
        width: "400px"
      }
    }, seeds.map((seed) => /* @__PURE__ */ React.createElement(SeedDisplay, __spreadProps(__spreadValues({
      seed,
      seedClick: () => seedClick(seed),
      nextPlot,
      bonemeal
    }, SEEDS[seed]), {
      setBonemeal,
      farmingLevel: get_level(farmingXp),
      key: seed
    }))))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        gap: "10px"
      }
    }, Array(patches).fill(null).map((v, i) => /* @__PURE__ */ React.createElement(FarmingPatch, __spreadProps(__spreadValues({}, patchData[i]), {
      plotClick: () => plotClick(i),
      key: i + 1
    })))));
  };
  const GatheringBagTooltip = ({ area, amount }) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, "Open ", amount, " ", Items.get_pretty_item_name(area), " Bags"));
  };
  const GatheringBagDisplay = ({ area }) => {
    const itemName = `gathering_loot_bag_${area}`;
    const [amount, setAmount] = useNumberItemObserver(itemName, `GatheringBagDisplay-${area}`);
    const onClick = (event) => {
      let making = amount;
      if (event.ctrlKey) {
        making = Math.min(5, making);
      } else if (event.shiftKey) {
        making = Math.floor(making / 2);
      }
      if (making > 0) {
        if (making === amount) {
          hideTooltip();
        }
        setAmount(amount - making);
        sendMessage("OPEN_GATHERING_LOOT", area, making);
      }
    };
    const unselectable = amount <= 0;
    const formattedAmount = amount < 1e3 ? `${amount}` : amount < 1e6 ? `${(amount / 1e3).toFixed(5 - Math.floor(Math.log10(amount)))}k` : `${(amount / 1e6).toFixed(8 - Math.floor(Math.log10(amount)))}m`;
    const tooltipProps = {
      area,
      maxAmount: amount
    };
    const [bagProps, BagToolTip, hideTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement(GatheringBagTooltip, __spreadValues({
        amount
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(GatheringBagTooltip, __spreadValues({
        amount: Math.max(Math.floor(amount / 2), 1)
      }, tooltipProps)),
      /* @__PURE__ */ React__default["default"].createElement(GatheringBagTooltip, __spreadValues({
        amount: Math.min(5, amount)
      }, tooltipProps))
    ], {
      width: 350
    });
    return amount > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      role: "button",
      name: itemName,
      size: 30,
      style: unselectable ? {
        opacity: 0.5,
        cursor: "default"
      } : void 0,
      onClick: unselectable ? void 0 : onClick
    }, bagProps)), /* @__PURE__ */ React__default["default"].createElement("span", null, formattedAmount), /* @__PURE__ */ React__default["default"].createElement(BagToolTip, null)) : null;
  };
  const GatheringAreaDisplay = ({
    image,
    name,
    items,
    getUnlocked,
    isSelectedArea,
    selectArea
  }) => {
    const [areaProps, AreaTooltip] = useTooltip([
      /* @__PURE__ */ React__default["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "16px"
        }
      }, /* @__PURE__ */ React__default["default"].createElement("span", null, Items.get_pretty_item_name(name)), /* @__PURE__ */ React__default["default"].createElement("span", {
        style: { fontSize: "12px" }
      }, "Items: ", items))
    ], {
      width: 250
    });
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "93px",
        height: "90px",
        justifyContent: "space-between",
        visibility: getUnlocked() ? "visible" : "hidden"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(IPimg, __spreadValues({
      name: `gathering_${image}`,
      size: 50,
      style: {
        boxSizing: "content-box",
        border: `3px solid ${isSelectedArea ? "green" : "transparent"}`,
        padding: "2px",
        borderRadius: "5px"
      },
      role: "button",
      onClick: selectArea
    }, areaProps)), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        height: "25px",
        display: "flex",
        alignItems: "center"
      }
    }, name), /* @__PURE__ */ React__default["default"].createElement(AreaTooltip, null));
  };
  const getUnlockedFactory = (...skills) => () => !!Number(Items.getItem("gathering_unlocked")) && skills.map((skill) => !!Number(Items.getItem(`${skill}_unlocked`))).reduce((acc, cur) => acc && cur, true);
  const AREAS = {
    mines: {
      image: "mine",
      name: "Desert mines",
      items: "Stone, Rocket Fuel",
      getUnlocked: getUnlockedFactory()
    },
    fields: {
      image: "field",
      name: "Forever fields",
      items: "Bones, Seeds",
      getUnlocked: getUnlockedFactory("farming")
    },
    forest: {
      image: "forest",
      name: "Friendly forest",
      items: "Big Bones, Leaves, Wood",
      getUnlocked: getUnlockedFactory("woodcutting")
    },
    fishing_pond: {
      image: "fishing_pond",
      name: "Quiet pond",
      items: "Seaweed, Bait",
      getUnlocked: getUnlockedFactory("fishing")
    },
    kitchen: {
      image: "kitchen",
      name: "Dirty kitchen",
      items: "Maggots, Eggs, Chocolate, Flour",
      getUnlocked: getUnlockedFactory("cooking")
    },
    gem_mine: {
      image: "gem_mine",
      name: "Gem mine",
      items: "Stone, Gem Fragments",
      getUnlocked: getUnlockedFactory("crafting", "farming", "brewing", "woodcutting", "cooking", "fishing", "melee")
    }
  };
  const id$1 = "GatheringOverview";
  const GatheringOverview = () => {
    const areas = keysOf(AREAS);
    const [currentGatheringArea, setCurrentGatheringArea] = useItemObserver("current_gathering_area", id$1);
    const selectArea = (area) => {
      setCurrentGatheringArea(area);
      sendMessage("GATHERING", area);
    };
    return /* @__PURE__ */ React.createElement(OverviewBox, {
      height: 250,
      width: 300,
      justifyContent: "space-between"
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "space-between",
        fontSize: "12px"
      }
    }, areas.map((area) => /* @__PURE__ */ React.createElement(GatheringAreaDisplay, __spreadProps(__spreadValues({
      selectArea: () => selectArea(area),
      area
    }, AREAS[area]), {
      isSelectedArea: area === currentGatheringArea
    })))), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        justifyContent: "space-evenly"
      }
    }, areas.map((area) => /* @__PURE__ */ React.createElement(GatheringBagDisplay, {
      area,
      key: area
    }))));
  };
  const id = "OverviewPanel";
  const OverviewPanel = () => {
    const dispatch = useIPFDispatch();
    const overviewIsOpen = useIPFSelector(selectOverviewIsOpen);
    useSetItemsObserver();
    const [settings] = useLocalStorage("activity-log-settings", initialActivitLogSettings, id);
    const oldSwitchPanels = React$1.useRef(switch_panels);
    React$1.useEffect(() => {
      switch_panels = (id2) => {
        dispatch(closeOverview());
        oldSwitchPanels.current(id2);
      };
    }, []);
    const [list] = useLocalStorage("activity-log", [], id);
    React$1.useEffect(() => {
      dispatch(subscribeToKeyboardEvent({
        key: "Control",
        onKeyDown: () => {
          dispatch(ctrlKeyDown());
        },
        onKeyUp: () => dispatch(ctrlKeyUp()),
        id: `${id}-ctrl`
      }));
      dispatch(subscribeToKeyboardEvent({
        key: "Shift",
        onKeyDown: () => dispatch(shiftKeyDown()),
        onKeyUp: () => dispatch(shiftKeyUp()),
        id: `${id}-shift`
      }));
    }, []);
    return overviewIsOpen ? /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        gap: "15px",
        justifyContent: "space-around"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: settings.showInOverview ? "75%" : "100%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        rowGap: "15px",
        justifyContent: "space-around",
        flexWrap: "wrap"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(WoodcuttingOverview, null), /* @__PURE__ */ React.createElement(FarmingOverview, null)), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        width: "50%%"
      }
    }, /* @__PURE__ */ React.createElement(BrewingOverview, null), /* @__PURE__ */ React.createElement(GatheringOverview, null)), /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        width: "50%%"
      }
    }, /* @__PURE__ */ React.createElement(CraftingOverview, null), /* @__PURE__ */ React.createElement(MiningOverview, null)))), settings.showInOverview && /* @__PURE__ */ React.createElement(OverviewBox, {
      height: 800,
      width: 400,
      gap: "15px",
      fontSize: "8px",
      overflowY: "auto",
      overflowX: "hidden",
      justifyContent: "flex-start",
      border: "unset"
    }, list.slice(0, 25).map((item) => /* @__PURE__ */ React.createElement(ActivityLogEntry, {
      item
    })))) : null;
  };
  const init = () => {
    appendReact(/* @__PURE__ */ React.createElement(IPFMenuBar, null), "menu-bar-buttons");
    appendReact(/* @__PURE__ */ React.createElement(ActivityLog, null), "content");
    appendReact(/* @__PURE__ */ React.createElement(OverviewButton, null), "game-menu-bar-skills", "left-panel-item_panel-keyitems");
    appendReact(/* @__PURE__ */ React.createElement(OverviewPanel, null), "panels", "panel-keyitems");
    window.onblur = () => {
      store.dispatch(resetModifierKeys());
    };
    document.body.onkeydown = (ev) => {
      if (!ev.repeat) {
        store.getState().keyboard.subscribers.forEach((sub) => {
          if (ev.key === sub.key && sub.onKeyDown) {
            sub.onKeyDown(ev);
          }
        });
      }
    };
    document.body.onkeyup = (ev) => {
      if (!ev.repeat) {
        store.getState().keyboard.subscribers.forEach((sub) => {
          if (ev.key === sub.key && sub.onKeyUp) {
            sub.onKeyUp(ev);
          }
        });
      }
    };
  };
  waitFor(() => {
    try {
      var_username == null ? void 0 : var_username.toLowerCase();
    } catch (e) {
      return false;
    }
    return true;
  }, init);
});
