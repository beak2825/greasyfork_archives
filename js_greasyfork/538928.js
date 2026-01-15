// ==UserScript==
// @name        Kb+ - cuberealm.io
// @namespace   https://github.com/Thibb1
// @match       https://cuberealm.io/*
// @match       https://www.cuberealm.io/*
// @run-at      document-start
// @grant       none
// @version     1.2.6
// @author      Thibb1
// @description Cuberealm extender Kb+, adds helpful features like Zoom and friend/enemy list
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/538928/Kb%2B%20-%20cuberealmio.user.js
// @updateURL https://update.greasyfork.org/scripts/538928/Kb%2B%20-%20cuberealmio.meta.js
// ==/UserScript==

let loaded = false;
console.log("Kb+ started, waiting to load...");

let player = null;

Object.defineProperties(Object.prototype, {
  "_eventEmitter": {
    get() { return this.__eventEmitter },
    set(v) {
      if (!loaded) {
        loaded = true;
        console.log("Kb+ loaded");
      }
      this.__eventEmitter = v;
      window.__eventEmitter = v;
      this.__eventEmitter.emit = new Proxy(this.__eventEmitter.emit, {
        apply(target, thisArg, args) {
          try {
            const type = Number(args[0]);
            switch (type) {
              case Event.Tick:
                break;
              case Events.InitPlayer:
                if (!settings.welcomeText) break;
                sendMessage("Kb+ loaded <3 Made by Thibb1", Colors.MAGENTA);
                sendMessage(
                  Colors.ORANGE.convert() + "Send '" +
                  Colors.CYAN.convert() + settings.commandPrefix + "help" +
                  Colors.ORANGE.convert() + "' in chat to see available commands"
                );
                sendMessage(
                  Colors.ORANGE.convert() + "Press '" +
                  Colors.CYAN.convert() + settings.zoomKey +
                  Colors.ORANGE.convert() + "' to zoom"
                );
                break;
              case Events.Message:
                args[2] = handleMessage(args[2]);
                if (args[2] == "") args[0] = Events.Disable;
                break;
              case Events.SendMessage:
                const send = args[1];
                if (settings.keepHistory) saveHistory(send);
                if (send.startsWith(settings.commandPrefix)) {
                  handleCommand(send.slice(settings.commandPrefix.length));
                  args[0] = Events.Disable;
                }
                break;
              case Events.TabValues:
                handleTabValues(args[1]);
                break;
              default:
                if (settings.debug) console.log(`Event ${type} emitted with args:`, args.slice(1));
                break;
            }
          } catch (error) {
            console.error('Error in event emitter:', error);
          } finally {
            return target.apply(thisArg, args);
          }
        }
      });
    }
  },
  "autoClearStencil": {
    get() { return _autoClearStencil; },
    set(value) {
      _autoClearStencil = value;
      if (this.domElement.id === 'canvas') {
        setTimeout(() => {
            this.render = new Proxy(this.render, {
              apply(target, thisArg, args) {
                try {
                  if (!loaded) return;
                  if (args[1].children.length !== 1 || args[1].children[0].type !== 'AudioListener') return;
                  if (!player && args[0].children.length > 0) {
                    const childrens = args[0].children[0].children;
                    if (childrens.length > 7) {
                      player = childrens[6].children[0];
                    }
                  }
                } catch {} finally {
                  return target.apply(thisArg, args);
                }
              }
            });
        }, 100);
      }
    }
  }
});

const Events = {
  Tick: 0,
  JoinRoom: 1,
  InitPlayer: 2,
  Disconnect: 4,
  Keyboard: 9,
  ChunkData: 10,
  // 11 load/unload chunk ?
  UnlockMouse: 15,
  LockMouse: 16,
  // 20 remove player/entity?
  ChangeSlot: 24,
  HoldingItem: 32,
  Message: 33,
  SendMessage: 34,
  TabValues: 44,
  Disable: 99999
}

const MessageFrom = {
  Server: 0,
  Player: 1
}

const defaultSettings = {
  version: "1.2.2",
  commandPrefix: '?',
  zoomKey: 'x',
  welcomeText: true,
  keepHistory: true,
  disableTips: true,
  disableCantBreak: true,
  disableChunkInChat: true,
  disableAds: true,
  disableJoinMessages: false,
  showCoords: true,
  debug: false,
  gameVersion: 23
}

let settings = defaultSettings;

const coordsDiv = document.createElement('div');
coordsDiv.id = 'coords-display';
coordsDiv.style.cssText = `position: absolute;bottom: 10px;right: 10px;color: white;font-size: 16px;font-family: monospace;z-index: 9999;background-color: rgba(0, 0, 0, 0.5);padding: 5px;border-radius: 5px;cursor: pointer;`;
document.body.appendChild(coordsDiv);
coordsDiv.addEventListener('click', () => {
  if (player && settings.showCoords) {
    const x = player.position.x.toFixed(2);
    const y = player.position.y.toFixed(2);
    const z = player.position.z.toFixed(2);
    const coordsText = `X: ${x}, Y: ${y}, Z: ${z}`;
    navigator.clipboard.writeText(coordsText);
    sendMessage("Copied coordinates to clipboard!", Colors.GREEN);
  }
});


function updateCoordsDisplay() {
  if (player && settings.showCoords) {
    const x = player.position.x.toFixed(2);
    const y = player.position.y.toFixed(2);
    const z = player.position.z.toFixed(2);
    coordsDiv.innerText = `X: ${x}\nY: ${y}\nZ: ${z}`;
    coordsDiv.style.display = 'block';
  } else {
    coordsDiv.style.display = 'none';
  }
}

setInterval(updateCoordsDisplay, 100);

const createColor = (code) => ({
  code,
  convert() { return "∁" + this.code.slice(1); }
});

const Colors = {
  DARK_RED: createColor("#c43535"),
  RED: createColor("#ff5050"),
  PINK: createColor("#ff89e9"),
  BROWN: createColor("#de660f"),
  ORANGE: createColor("#ffa540"),
  GOLD: createColor("#ffd700"),
  YELLOW: createColor("#ffff40"),
  DARK_GREEN: createColor("#40aa40"),
  GREEN: createColor("#40ff40"),
  DARK_CYAN: createColor("#40a5a5"),
  CYAN: createColor("#40ffff"),
  DARK_BLUE: createColor("#1b7dff"),
  BLUE: createColor("#6ab4ff"),
  DARK_PURPLE: createColor("#c04eff"),
  PURPLE: createColor("#c28fff"),
  MAGENTA: createColor("#ff40ff"),
  WHITE: createColor("#ffffff"),
  GRAY: createColor("#a9a9a9"),
  DARK_GRAY: createColor("#808080"),
  BLACK: createColor("#565656")
}
Colors.ENEMY = Colors.RED;
Colors.FRIEND = Colors.GREEN;
const Modes = ["survival", "creative", "peaceful", "custom"];

function getData(key, defaultValue = {}) {
  const raw = localStorage.getItem(key);
  if (raw) {
    const data = JSON.parse(raw);
    if (data.version && data.version !== defaultValue.version) {
      const mergedSettings = { ...defaultValue, ...data };
      mergedSettings.version = defaultValue.version;
      setData(key, mergedSettings);
      return mergedSettings;
    }
    return data;
  }
  return defaultValue;
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

settings = getData('Kb+', defaultSettings);
const tabList = [];

function saveSettings() {
  setData('Kb+', settings);
}

const friends = getData('Kb+_friends', []);
const enemies = getData('Kb+_enemies', []);
const marked = getData('Kb+_marked', {});

const history = getData("Kb+_hst", []);
let historyIndex = -1;
const MAX_HISTORY = 50;

function saveHistory(message) {
  history.push(message);
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  setData('Kb+_hst', history);
  historyIndex = history.length - 1;
}

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
  apply(target, thisArg, args) {
    try {
      const text = args[0];
      if (friends.includes(text)) {
        thisArg.fillStyle = Colors.GREEN.code;
      } else if (enemies.includes(text)) {
        thisArg.fillStyle = Colors.RED.code;
      } else if (marked[text]) {
        thisArg.fillStyle = Colors[marked[text]].code;
      }
    } catch (error) {
      console.error('Error in fillText proxy:', error);
    } finally {
      return target.apply(thisArg, args);
    }
  }
});

Object.defineProperty(Object.prototype, "generalFOV", {
  get() { return this._generalFOV; },
  set(v) {
    this._generalFOV = v;
    window.__cbSettings = this;
    setTimeout(() => {
      for (const key of Object.keys(this)) {
        if (typeof this[key] === 'function' && this[key].toString().includes('generalFOV')) {
          this.setGeneralFOV = this[key];
          break;
        }
      }
    }, 0)
  }
});

if (settings.disableAds) {
  // needs refining
  Object.defineProperty(Object.prototype, "adplayer", {
    get() {
      if (window.adsLoadedPromiseResolve) window.adsLoadedPromiseResolve();
      return null;
    },
    set(v) {}
  });
  Object.defineProperty(Object.prototype, "requestAds", {
    get() {
      if (window.adsLoadedPromiseResolve) window.adsLoadedPromiseResolve();
      return () => {};
    },
    set(v) {}
  });
}

let previousFOV = 100;
let zoomOn = false;
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === settings.zoomKey.toLowerCase() && window.__cbSettings && !zoomOn) {
    zoomOn = true;
    const CBsettings = JSON.parse(localStorage.getItem("settings"));
    previousFOV = CBsettings.state._generalFOV ?? CBsettings.state.generalFOV ?? previousFOV;
    window.__cbSettings?.setGeneralFOV(40);
  }
});
document.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() === settings.zoomKey.toLowerCase() && window.__cbSettings && zoomOn) {
    zoomOn = false;
    window.__cbSettings?.setGeneralFOV(previousFOV);
  }
});

function sendMessage(message, color, from = MessageFrom.Server) {
  const text = (color ? color.convert() : "") + message;
  window.__eventEmitter.emit(Events.Message, from, text);
}

function sendChatMessage(message) {
  window.__eventEmitter.emit(Events.SendMessage, message);
}

const commands = {
  "help": {
    description: "[command] - Shows help menu or details about a command"
  },
  "friends": {
    description: "- Prints your friend list"
  },
  "addfriend": {
    description: "[name] - Add a friend to your friend list"
  },
  "delfriend": {
    description: "[name] - Remove a friend from your friend list"
  },
  "enemies": {
    description: "- Prints your enemy list"
  },
  "addenemy": {
    description: "[name] - Add an enemy to your enemy list"
  },
  "delenemy": {
    description: "[name] - Remove an enemy from your enemy list"
  },
  "addmark": {
    description: "[color] [name] - Mark a player with a specific color",
  },
  "delmark": {
    description: "[name] - Remove a mark from a player"
  },
  "marks":{
    description: "- Prints your marked player list"
  },
  "toggle": {
    description: "[setting] - Toggle a setting on or off",
    settings: ["welcomeText", "keepHistory", "disableTips", "disableCantBreak", "disableChunkInChat", "disableAds", "disableJoinMessages", "showCoords", "debug"]
  },
  "toggles": {
    description: "- List available toggle settings"
  },
  "reset": {
    description: "[home] - Reset an existing home to your current location"
  },
  "join": {
    description: "[type] [region] - Join a specific region (e.g., 'join survival eu-1' or 'join custom ws://<ip-address>:<port>')"
  },
  "leave": {
    description: "- Leave the current game"
  }
}

function handleCommand(cmd) {
  const parts = cmd.split(" ").filter(Boolean);
  const partsLen = parts.length;
  if (partsLen === 0) {
    sendMessage("Please enter a command.", Colors.RED);
    return;
  }
  switch (parts[0]) {
    case "help":
    case "?":
      if (partsLen == 2) {
        const command = parts[1];
        if (commands[command]) {
          sendMessage(`${settings.commandPrefix}${command} ${commands[command].description}`, Colors.ORANGE);
          if (commands[command].settings) {
            sendMessage("Available settings: " + commands[command].settings.join(", "), Colors.ORANGE);
          }
        } else {
          sendMessage("Command not found: " + command, Colors.RED);
        }
        break;
      }
      printHelpMenu();
      break;
    case "friends":
      sendMessage("Friends: " + friends.join(", "), Colors.BLUE);
      break;
    case "addfriend":
      if (partsLen == 2) {
        addFriend(parts[1]);
      } else {
        sendMessage("Invalid usage: " + settings.commandPrefix + "addfriend <name>", Colors.RED);
      }
      break;
    case "delfriend":
      if (partsLen == 2) {
        delFriend(parts[1]);
      } else {
        sendMessage("Invalid usage: " + settings.commandPrefix + "delfriend <name>", Colors.RED);
      }
      break;
    case "enemies":
      sendMessage("Enemies: " + enemies.join(", "), Colors.BLUE);
      break;
    case "addenemy":
      if (partsLen == 2) {
        addEnemy(parts[1]);
      } else {
        sendMessage("Invalid usage: " + settings.commandPrefix + "addenemy <name>", Colors.RED);
      }
      break;
    case "delenemy":
      if (partsLen == 2) {
        delEnemy(parts[1]);
      } else {
        sendMessage("Invalid usage: " + settings.commandPrefix + "delenemy <name>", Colors.RED);
      }
      break;
    case "marks":
      let markedPlayers = Colors.BLUE.convert() + "Marked players:";
      for (const name in marked) {
        markedPlayers += ` ${Colors[marked[name]].convert()}${name}`;
      }
      sendMessage(markedPlayers, Colors.BLUE);
      break;
    case "addmark":
      if (partsLen >= 3) {
        const color = parts[1].toUpperCase();
        const name = parts.slice(2).join(" ");
        addMark(color, name);
      } else {
        sendMessage("[Help] " + settings.commandPrefix + "addmark <color> <name>", Colors.RED);
        sendMessage("Available colors: " + Object.keys(Colors).map(color => Colors[color].convert() + color).join(", "), Colors.RED);
      }
      break;
    case "delmark":
      if (partsLen == 2){
        const name = parts[1];
        delMark(name);
      } else {
        sendMessage("[Help] " + settings.commandPrefix + "delmark <name>", Colors.RED);
      }
      break;
    case "toggle":
      if (partsLen == 2) {
        const setting = parts[1];
        if (commands.toggle.settings.includes(setting)) {
          settings[setting] = !settings[setting];
          saveSettings();
          sendMessage(`Toggled ${setting} to ${settings[setting]}`, Colors.GREEN);
        } else {
          sendMessage("Unknown setting: " + setting, Colors.RED);
        }
      } else {
        sendMessage("[Help] " + settings.commandPrefix + "toggle <setting>", Colors.RED);
      }
      break;
    case "toggles":
      sendMessage("Available toggles: " + commands.toggle.settings.join(", "), Colors.YELLOW);
      break;
    case "join":
      if (partsLen == 3) {
        const mode = parts[1];
        const region = parts[2];
        joinGame(mode, region);
      } else {
        sendMessage("[Help] " + settings.commandPrefix + "join <mode> <region>")
      }
      break;
    case "leave":
      sendMessage("Leaving game...", Colors.YELLOW);
      leave();
      break;
    case "reset":
      if (partsLen == 2) {
        const home = parts[1];
        sendChatMessage("/delhome " + home);
        sendChatMessage("/sethome " + home);
      } else {
        sendMessage("[Help] " + settings.commandPrefix + "reset <name>", Colors.RED);
      }
      break;
    default:
      sendMessage("Unknown command: " + parts[0], Colors.RED);
      break;
  }
}

function leave() {
  __eventEmitter.emit(Events.Disconnect);
}

function joinGame(mode, region) {
  if (!Modes.includes(mode)) {
    sendMessage("Invalid mode: " + mode + ". Available modes: " + Modes.join(", "), Colors.RED);
    return;
  }
  if (mode == "custom") {
    sendMessage(`Attempting to join ${region}...`, Colors.YELLOW);
    const secure = region.startsWith("wss://") ? true : false;
    region = region.slice(secure ? 6 : 5); // ws or wss
    const parts = region.split(":");
    const hostname = parts[0];
    const port = parts[1];
    leave();
    setTimeout(() => {__eventEmitter.emit(Events.JoinRoom, hostname, port, secure, "battle", "custom");}, 1000);
    return;
  }
  sendMessage(`Attempting to join ${mode}-${region}...`, Colors.YELLOW);
  fetch("https://cuberealm.io/v1/matchmake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mode: mode, room: `${mode}-${region}`, version: String(settings.gameVersion) })
  }).then(response => response.json()).then(data => {
    if (settings.debug) console.log("Matchmake response:", data);
    if (data.hostname && data.port) {
      leave();
      __eventEmitter.emit(Events.JoinRoom, data.hostname, data.port, data.isSecure, mode, data.room);
    } else {
      sendMessage(`Failed to join ${mode}-${region}. ${data.message || ''}`, Colors.RED);
    }
  }).catch(error => {
    console.error("Matchmake error:", error);
    sendMessage(`Error joining ${mode}-${region}: ${error.message}`, Colors.RED);
  });
}

function printHelpMenu() {
  const commandPrefix = settings.commandPrefix;
  sendMessage("=".repeat(20) + "Help Menu" + "=".repeat(20), Colors.CYAN);
  sendMessage(commandPrefix + "help [<command>] - Help menu or details on a command", Colors.ORANGE);
  const friendsHelp = ["friends", "addfriend [name]", "delfriend [name]"].map(cmd => commandPrefix + cmd).join(" ");
  sendMessage(friendsHelp + " - Manage friends", Colors.ORANGE);
  const enemiesHelp = ["enemies", "addenemy [name]", "delenemy [name]"].map(cmd => commandPrefix + cmd).join(" ");
  sendMessage(enemiesHelp + " - Manage enemies", Colors.ORANGE);
  const markHelp = ["marks", "addmark [color] [name]", "delmark [name]"].map(cmd => commandPrefix + cmd).join(" ");
  sendMessage(markHelp + " - Manage marked players", Colors.ORANGE);
  const toggleHelp = ["toggle [setting]", "toggles"].map(cmd => commandPrefix + cmd).join(" ");
  sendMessage(toggleHelp + " - Manage Kb+ toggles", Colors.ORANGE);
  sendMessage(commandPrefix + "join <mode> <region> - Join a specific region", Colors.ORANGE);
  sendMessage(commandPrefix + "reset <home> - Reset a home to your current location", Colors.ORANGE);
  sendMessage(commandPrefix + "leave - Leave the current game", Colors.ORANGE);
  sendMessage("=".repeat(49), Colors.CYAN);
}

function checkList(list, name) {
  if (!list.includes(name)) {
    const matchingPlayers = list.filter(player => player.startsWith(name));
    if (matchingPlayers.length > 0) {
      return matchingPlayers[0];
    }
    sendMessage("Player not found: " + name, Colors.RED);
    return "";
  }
  return name;
}

function addFriend(name) {
  name = checkList(tabList, name);
  if (name === "") return;
  if (!friends.includes(name)) {
    friends.push(name);
    if (enemies.includes(name)) delEnemy(name);
    if (marked[name]) delMark(name);
    setData("Kb+_friends", friends);
    sendMessage(`Added ${name} to friends list`, Colors.GREEN);
  } else {
    sendMessage(`${name} is already in your friends list`, Colors.YELLOW);
  }
}

function delFriend(name) {
  name = checkList(friends, name);
  if (name === "") return;
  const index = friends.indexOf(name);
  if (index > -1) {
    friends.splice(index, 1);
    setData("Kb+_friends", friends);
    sendMessage(`Removed ${name} from friends list`, Colors.GREEN);
  } else {
    sendMessage(`${name} is not in your friends list`, Colors.YELLOW);
  }
}

function addEnemy(name) {
  name = checkList(tabList, name);
  if (name === "") return;
  if (!enemies.includes(name)) {
    enemies.push(name);
    if (friends.includes(name)) delFriend(name);
    if (marked[name]) delMark(name);
    setData("Kb+_enemies", enemies);
    sendMessage(`Added ${name} to enemies list`, Colors.GREEN);
  } else {
    sendMessage(`${name} is already in your enemies list`, Colors.YELLOW);
  }
}

function delEnemy(name) {
  name = checkList(enemies, name);
  if (name === "") return;
  const index = enemies.indexOf(name);
  if (index > -1) {
    enemies.splice(index, 1);
    setData("Kb+_enemies", friends);
    sendMessage(`Removed ${name} from enemies list`, Colors.GREEN);
  } else {
    sendMessage(`${name} is not in your enemies list`, Colors.YELLOW);
  }
}

function addMark(color, name) {
  if (Colors[color]) {
    const playerName = checkList(tabList, name);
    if (playerName === "") return;
    if (friends.includes(name)) delFriend(name);
    if (enemies.includes(name)) delEnemy(name);
    marked[playerName] = color;
    setData("Kb+_marked", marked);
    sendMessage(`Marked ${playerName} with color ${Colors[color].convert()}${color}`, Colors.GREEN);
  } else {
    sendMessage("Invalid color: " + color + ". Available colors: " + Object.keys(Colors).map(color => Colors[color].convert() + color).join(", "), Colors.RED);
  }
}

function delMark(name) {
  if (marked[name]) {
    delete marked[name];
    setData("Kb+_marked", marked);
    sendMessage(`Removed mark from ${name}`, Colors.GREEN);
  } else {
    sendMessage(`${name} is not marked`, Colors.YELLOW);
  }
}

function handleMessage(message) {
  if (message.startsWith("∁6ab4ff[∁ffd700Tip")) {
    if (settings.disableTips) return "";
  }
  if (message.startsWith(Colors.RED.convert())) {
    const error = message.slice(7);
    if (error.startsWith("You can't build") && settings.disableCantBreak) return "";
  }
  if (message.startsWith(Colors.GREEN.convert())) {
    const success = message.slice(7);
    if (success.startsWith("Entering") && settings.disableChunkInChat) return "";
    if (success.startsWith("Leaving") && settings.disableChunkInChat) return "";
  }
  if (message.startsWith(Colors.GOLD.convert())) {
    const parts = message.slice(7).split(" ");
    const name = parts[0];
    const text = " " + Colors.GOLD.convert() + parts.slice(1).join(" ");
    if (friends.includes(name)) {
      return Colors.GREEN.convert() + name + text;
    } else if (enemies.includes(name)) {
      return Colors.RED.convert() + name + text;
    } else if (marked[name]) {
      return Colors[marked[name]].convert() + name + text;
    } else if (settings.disableJoinMessages) {
      return "";
    }
    return message;
  }
  if (!message.includes("∁") && message.includes(":")) {
    const parts = message.split(":");
    const name = parts[0];
    const text = parts.slice(1).join(":");
    if (friends.includes(name)) {
      return Colors.GREEN.convert() + name + Colors.WHITE.convert() + ":" + text;
    } else if (enemies.includes(name)) {
      return Colors.RED.convert() + name + Colors.WHITE.convert() + ":" + text;
    } else if (marked[name]) {
      return Colors[marked[name]].convert() + name + Colors.WHITE.convert() + ":" + text;
    }
  }
  return message;
}

function setInputValue(input, newValue) {
  // You need to use this to update react state or it wont register the change
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value').set;
  nativeInputValueSetter.call(input, newValue);
  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
}

function handleKeydownInput(event, input) {
  if (event.key === 'Tab' && input.value.startsWith(settings.commandPrefix)) {
    event.preventDefault();
    const currentValue = input.value;
    const commandPrefix = settings.commandPrefix;
    const command = currentValue.slice(commandPrefix.length);

    const autocomplete = (baseCommand, list, commandPrefix = settings.commandPrefix) => {
      if (!currentValue.startsWith(commandPrefix + baseCommand + " ")) return;
      const settingVar = currentValue.slice(commandPrefix.length + baseCommand.length + 1).toLowerCase();
      const matchs = list.filter(el => el.toLowerCase().startsWith(settingVar));
      if (matchs.length > 0) {
        setInputValue(input, commandPrefix + baseCommand + " " + matchs[0]);
      }
    };

    const availableCommands = Object.keys(commands);
    const matchingCommands = availableCommands.filter(cmd => cmd.startsWith(command));

    if (matchingCommands.length > 0) {
      setInputValue(input, commandPrefix + matchingCommands[0]);
    } else {
      autocomplete("help", Object.keys(commands));
      autocomplete("addfriend", tabList);
      autocomplete("delfriend", friends);
      autocomplete("addenemy", tabList);
      autocomplete("delenemy", enemies);
      autocomplete("toggle", commands.toggle.settings);
      const joinParts = currentValue.slice(commandPrefix.length + "join ".length).split(" ");
      if (joinParts.length === 1) autocomplete("join", Modes);
      autocomplete("delmark", Object.keys(marked));
      const markParts = currentValue.slice(commandPrefix.length + "addmark ".length).split(" ");
      if (markParts.length === 1) {
        autocomplete("addmark", Object.keys(Colors));
      } else if (markParts.length === 2) {
        autocomplete("addmark " + markParts[0], tabList);
      }
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (historyIndex >= 0) {
      setInputValue(input, history[historyIndex]);
      historyIndex = Math.max(historyIndex - 1, 0);
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      setInputValue(input, history[historyIndex]);
    } else {
      setInputValue(input, "");
      historyIndex = history.length - 1;
    }
  }
}

function findStringInObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      return obj[key];
    } else if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        if (typeof item === 'object') {
          const result = findStringInObject(item);
          if (result) return result;
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result = findStringInObject(obj[key]);
      if (result) return result;
    }
  }
  return null;
}


function handleTabValues(object) {
  const playerName = findStringInObject(object);
  if (playerName) {
    if (!tabList.includes(playerName)) {
      tabList.push(playerName);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (settings.disableAds) window.adSDKType = '';
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode.tagName === 'INPUT' && addedNode.getAttribute('maxlength') === '100') {
            historyIndex = history.length - 1;
            addedNode.addEventListener('keydown', (event) => handleKeydownInput(event, addedNode));
          }
          if (!addedNode.querySelectorAll) return;
          addedNode.querySelectorAll('span').forEach(span => {
            const player = span.innerText;
            if (friends.includes(player)) {
              span.style.color = Colors.GREEN.code;
            } else if (enemies.includes(player)) {
              span.style.color = Colors.RED.code;
            } else if (marked[player]) {
              span.style.color = Colors[marked[player]].code;
            }
          });
        });
      }
    });
  });
  try {
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      const appUI = document.querySelector('#app > div > div');
      observer.observe(appUI, { childList: true, subtree: true });
    }, 10000)
  } catch (error) {
    console.error("Couldn't hook input / document body, features like tab autocomplete and name coloring won't work. Try reloading the page.");
  }
});
