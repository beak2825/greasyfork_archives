// ==UserScript==
// @name         IQRPG Toolkit
// @namespace    https://www.iqrpg.com/
// @version      0.0.1
// @description  Assistive script for IQRPG.com that adheres to all rules.
// @author       Syn
// @match        http://iqrpg.com/game.php
// @match        https://iqrpg.com/game.php
// @match        http://www.iqrpg.com/game.php
// @match        https://www.iqrpg.com/game.php
// @match        http://test.iqrpg.com/game.php
// @match        https://test.iqrpg.com/game.php
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/403344-moment-js-v2-25-3/code/Momentjs%20v2253.js?version=805187
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406157/IQRPG%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/406157/IQRPG%20Toolkit.meta.js
// ==/UserScript==

/*
    Based on the awesome "IQRPG+" - aka "Audio Alert" script by Bunjo, Xortrox, euphone, and Karubo. Thank you!
*/

/* globals GM_Config, $ */

var fieldDefs = {
  /*phone: {
    label: GM_config.create("Phone"),
    section: [
      GM_config.create("Notification Methods"),
      "We need this information to be able to send you notifications (if desired).",
    ],
    type: "int",
    default: "5551234567",
  },
  email: {
    label: GM_config.create("Email"),
    type: "text",
    default: "test@example.com",
  },
  discord: {
    label: GM_config.create("Discord"),
    type: "text",
    default: "Tester#1234",
  },*/
  alertNumberAutos: {
    label: GM_config.create("Alert when this many Autos Remain"),
    section: [
      GM_config.create("Notification Settings"),
      "Customize the details of how you're notified about events",
    ],
    type: "int",
    default: 10,
  },
  audioNoWhisperActiveTab: {
    type: "checkbox",
    label: GM_config.create("Whispers - Do Not Notify about if Tab is Active"),
    default: true,
  },
  desktopEnabled: {
    section: [
      GM_config.create("Toggle Desktop Notifications"),
      "Customize whether desktop notifications are shown for certain events.",
    ],
    label: GM_config.create("Enable Desktop Notifications"),
    type: "checkbox",
    default: true,
  },
  desktopAuto: {
    type: "checkbox",
    label: GM_config.create("Low Autos"),
    default: true,
  },
  desktopWhisper: {
    type: "checkbox",
    label: GM_config.create("Whisper Received"),
    default: true,
  },
  desktopDungeon: {
    type: "checkbox",
    label: GM_config.create("Dungeon Completed"),
    default: true,
  },
  desktopBossStart: {
    type: "checkbox",
    label: GM_config.create("Boss Arrives"),
    default: true,
  },
  desktopBossEnd: {
    type: "checkbox",
    label: GM_config.create("Boss Defeated"),
    default: true,
  },
  desktopEventWoodcutting: {
    type: "checkbox",
    label: GM_config.create("Woodcutting Event Started"),
    default: true,
  },
  desktopEventQuarrying: {
    type: "checkbox",
    label: GM_config.create("Quarrying Event Started"),
    default: true,
  },
  desktopEventMining: {
    type: "checkbox",
    label: GM_config.create("Mining Event Started"),
    default: true,
  },
  desktopEventEnd: {
    type: "checkbox",
    label: GM_config.create("Event Ended"),
    default: false,
  },
  desktopWatchtowerStart: {
    type: "checkbox",
    label: GM_config.create("Clan Watchtower Start"),
    default: true,
  },
  desktopWatchtowerEnd: {
    type: "checkbox",
    label: GM_config.create("Clan Watchtower End"),
    default: true,
  },
  audioEnabled: {
    label: GM_config.create("Enable Audio Alerts"),
    section: [
      GM_config.create("Toggle Audio Alerts"),
      "Customize whether sounds play for certain events.",
    ],
    type: "checkbox",
    default: true,
  },
  audioAuto: {
    type: "checkbox",
    label: GM_config.create("Low Autos"),
    default: true,
  },
  audioWhisper: {
    type: "checkbox",
    label: GM_config.create("Whisper Received"),
    default: true,
  },
  audioDungeon: {
    type: "checkbox",
    label: GM_config.create("Dungeon Completed"),
    default: true,
  },
  audioBossStart: {
    type: "checkbox",
    label: GM_config.create("Boss Arrives"),
    default: true,
  },
  audioBossEnd: {
    type: "checkbox",
    label: GM_config.create("Boss Defeated"),
    default: true,
  },
  audioEventWoodcutting: {
    type: "checkbox",
    label: GM_config.create("Woodcutting Event Started"),
    default: true,
  },
  audioEventQuarrying: {
    type: "checkbox",
    label: GM_config.create("Quarrying Event Started"),
    default: true,
  },
  audioEventMining: {
    type: "checkbox",
    label: GM_config.create("Mining Event Started"),
    default: true,
  },
  audioEventEnd: {
    type: "checkbox",
    label: GM_config.create("Event Ended"),
    default: false,
  },
  audioWatchtowerStart: {
    type: "checkbox",
    label: GM_config.create("Clan Watchtower Start"),
    default: true,
  },
  audioWatchtowerEnd: {
    type: "checkbox",
    label: GM_config.create("Clan Watchtower End"),
    default: true,
  },
  audioRepeatInterval: {
    label: GM_config.create("Audio Repeat Interval"),
    section: [
      GM_config.create("Audio Alert Settings"),
      "Customize whether (and how often) sounds play for certain events.",
    ],
    type: "int",
    default: 2,
  },
  audioMaxAlerts: {
    label: GM_config.create("Maximum Number of Audio Alerts"),
    type: "int",
    default: 0,
  },
  audioURLGeneric: {
    label: GM_config.create("Generic Alert Sound"),
    section: [
      GM_config.create("Sounds To Use"),
      "Customize what sounds the script uses (if desired).",
    ],
    type: "text",
    default:
      "https://soundbible.com/mp3/Robot_blip_2-Marianne_Gagnon-299056732.mp3",
  },
  audioURLAuto: {
    label: GM_config.create("Low Autos Sound"),
    type: "text",
    default:
      "https://soundbible.com/mp3/Robot_blip_2-Marianne_Gagnon-299056732.mp3",
  },
  audioURLBossStart: {
    label: GM_config.create("Boss Alert Sound"),
    type: "text",
    default:
      "https://soundbible.com/mp3/Air%20Horn-SoundBible.com-964603082.mp3",
  },
  audioURLBossEnd: {
    label: GM_config.create("Boss Defeated Sound"),
    type: "text",
    default:
      "https://ia801306.us.archive.org/32/items/FF7ACVictoryFanfareRingtoneperfectedMp3/FF7%20AC%20Victory%20Fanfare%20Ringtone%20%28perfected%20mp3%29.mp3",
  },
  audioURLWhisper: {
    label: GM_config.create("New Whisper Sound"),
    type: "text",
    default: "https://soundbible.com/mp3/service-bell_daniel_simion.mp3",
  },
  audioURLWatchtowerStart: {
    label: GM_config.create("Watchtower Alert Sound"),
    type: "text",
    default: "https://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3",
  },
  audioURLWatchtowerEnd: {
    label: GM_config.create("Watchtower Ended Sound"),
    type: "text",
    default:
      "https://ia801306.us.archive.org/32/items/FF7ACVictoryFanfareRingtoneperfectedMp3/FF7%20AC%20Victory%20Fanfare%20Ringtone%20%28perfected%20mp3%29.mp3",
  },
  showLogs: {
    label: GM_config.create("Enable Logging"),
    section: [
      GM_config.create("Developer Settings"),
      "Enable various Development features.",
    ],
    type: "checkbox",
    default: false,
  },
};

function GameState() {
  // call init() if settings were passed to constructor
  if (arguments.length) {
    GameState_Init(this, arguments);
  }
}

// This is the initializer function
function GameState_Init(config, args) {
  // Initialize instance variables
}

GameState.prototype = {
  // Support old method of initalizing
  init: function () {
    GameState_Init(this, arguments);
  },
};

// The IQ constructor
function IQRPG() {
  // call init() if settings were passed to constructor
  IQRPG_Init(this);
}

// This is the initializer function
function IQRPG_Init(iq) {
  // Initialize instance variables
  iq.gs = new GameState();
  iq.ALERT = {
    DESKTOP: {
      name: "desktop",
    },
    SOUND: {
      name: "audio",
    },
    SMS: {
      name: "sms",
    },
    DISCORD: {
      name: "discord",
    },
    EMAIL: {
      name: "email",
    },
  };
  iq.EVENT = {
    AUTO: {
      name: "Auto",
      title: "IQRPG Auto Alert!",
      msg: "You have %s autos remaining!",
      repeat: true,
    },
    BOSS: {
      START: {
        name: "BossStart",
        title: "IQRPG Boss!",
        msg: "New boss has spawned.",
      },
      END: {
        name: "BossEnd",
        title: "IQRPG Boss Alert!",
        msg: "The boss has been defeated!",
      },
    },
    DEFAULT: {
      name: "Generic",
      title: "%s",
      msg: "%s",
    },
    WATCHTOWER: {
      START: {
        name: "WatchtowerStart",
        title: "IQRPG Watchtower!",
        msg: "%s",
        type: "clanGlobal",
      },
      END: {
        name: "WatchtowerEnd",
        title: "IQRPG Watchtower Ended",
        msg: "%s",
      },
    },
    MESSAGE: {
      name: "Whisper",
      title: "IQRPG Whisper!",
      msg: "%s: %s",
    },
    DUNGEON: {
      name: "Dungeon",
      title: "IQRPG Dungeon Alert!",
      msg: "You have completed your dungeon!",
    },
    EVENT: {
      END: {
        name: "EventEnd",
        title: "IQRPG Event Ended",
        msg: "Event has ended.",
      },
      MINING: {
        name: "Mining",
        title: "IQRPG Event!",
        msg: "Mining event has started!",
        type: "mining",
      },
      QUARRYING: {
        name: "Quarrying",
        title: "IQRPG Event Started!",
        msg: "Quarrying event has started!",
        type: "quarrying",
      },
      WOODCUTTING: {
        name: "Woodcutting",
        title: "IQRPG Event!",
        msg: "Woodcutting event has started!",
        type: "woodcutting",
      },
    },
  };
  GM_config.init({
    id: "IQ_Tookit",
    title: "IQ Toolkit",
    fields: fieldDefs,
  });
  GM_config.open();
  //Browser will ask permission for showing notifications
  if (
    iq.isAlertEnabled(iq.ALERT.DESKTOP.name) &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission();
  }

  // Reflect the event names for more efficient performance.
  for (var x in iq.EVENT) {
    var name = String(iq.EVENT[x].name);
    iq.EVENT[name] = iq.EVENT[x];
    if (iq.notNil(iq.EVENT[x].type)) {
      var type = String(iq.EVENT[x].type);
      iq.EVENT[type] = iq.EVENT[x];
    }
  }

  iq.currAutoAudioPlays = 0;
  iq.obsConfig = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true,
  };

  iq.eventLength = 60 * 10 * 1000; // Ten minutes.
}

IQRPG.prototype = {
  // Support old method of initalizing
  init: function () {
    IQRPG_Init(this);
  },

  execute: function () {
    setTimeout(
      function (IQ) {
        IQ.setupObservers();
      },
      500,
      this
    );

    var MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;

    this.myObserver = new MutationObserver(this.mutationHandler);
  },

  handleChildListMutation: function (html) {
    switch (String(html)) {
      case "Dungeon Complete Idle Quest RPG":
        this.alert(this.EVENT.DUNGEON.name, [html]);
        break;
      case "Clan Boss Defeated Idle Quest RPG":
        this.alert(this.EVENT.WATCHTOWER.START.name, [html]);
        break;
      case "All Mobs Defeated Idle Quest RPG":
        this.alert(this.EVENT.WATCHTOWER.END.name, [
          "All mobs have been defeated!",
        ]);
        break;
      case "Boss Defeated Idle Quest RPG":
        this.alert(this.EVENT.BOSS.END.name, ["The boss has been defeated!"]);
        break;
      case "ALERT":
        break;
      default:
        this.stopAlert();
        this.currAutoAudioPlays = 0;
    }
  },

  handleCharacterDataMutation: function (msg) {
    var autosRemaining = parseInt(msg.replace("Autos Remaining: ", ""));
    var autoAlertNumber = this.getSetting("alertNumberAutos");

    if (autosRemaining <= autoAlertNumber && autoAlertNumber) {
      this.alert(this.EVENT.AUTO.name, [autosRemaining]);
    } else {
      this.stopAlert();
      this.currAutoAudioPlays = 0;
    }
  },

  mutationHandler: function (mutationRecords) {
    mutationRecords.forEach(function (mutation) {
      switch (String(mutation.type)) {
        case "childList":
          if (mutation.target.nodeName == "TITLE") {
            IQ.handleChildListMutation(mutation.target.innerHTML);
          }
          break;
        case "characterData":
          IQ.handleCharacterDataMutation(mutation.target.data);
        default:
          break;
      }
    });
  },

  stopAlert: function () {
    this.alerting = false;
    clearInterval(alert);
  },

  setupObservers: function () {
    this.myObserver.observe($("div.action-timer__text")[0], this.obsConfig);
    this.myObserver.observe($("head title")[0], this.obsConfig);
  },

  handleEvent: function (type, timeRemaining) {
    if (this.notNil(this.EVENT[type])) {
      this.alert(this.EVENT[type].name, []);
      setTimeout(
        function (IQ, type) {
          IQ.alert(type.replace("Start", "End"), []);
        },
        timeRemaining * 10,
        this,
        String(this.EVENT[type].name)
      );
    } else {
      this.log("Unsupported Event - " + type);
    }
  },

  handleMessage: function (type, data) {
    switch (type) {
      case "clanGlobal":
        return this.handleClanMessage(data.msg);
      case "pm-from":
        return this.handlePM(data);
      case "eventGlobal":
        return this.handleGlobalMessage(data.msg);
      case "pm-to":
      case "msg":
      case "global":
      case "me":
        break;
      default:
        this.log("Unsupported msg type:" + message.data.type);
        this.log(message);
        break;
    }
  },

  handleGlobalMessage: function (msg) {
    if (msg.startsWith("A rift to the dark realm has opened")) {
      this.alert(this.EVENT.BOSS.START.name, [msg]);
    }
  },

  handleClanMessage: function (msg) {
    if (msg.startsWith("The watchtower")) {
      this.alert(this.EVENT.WATCHTOWER.name, [msg]);
    }
  },

  handlePM: function (data) {
    if (!document.hidden && this.getSetting("audioNoWhisperActiveTab")) {
      this.alert(this.EVENT.WHISPER.name, [data.username, data.msg]);
    }
  },

  eventListener: function (event) {
    const message = JSON.parse(event.data);
    this.log("Event Data:");
    this.log(message);
    switch (message.type) {
      case "event":
        this.handleEvent(message.data.type, message.data.timeRemaining);
        break;
      case "msg":
        this.handleMessage(message.data.type, message.data);
        break;
      case "boss":
        break;
      case "playersOnline":
      case "loadMessages":
      case "addItemsToUser":
      case "notification":
      case "bonus":
        break;
      default:
        this.log(message);
        break;
    }
  },

  alert: function (name, details) {
    for (var x in this.ALERT) {
      this.alertByType(name, this.ALERT[x].name, details);
    }
  },

  alertByType: function (name, type, details) {
    if (!this.isAlertEnabled(type, name)) return;
    switch (String(type)) {
      case this.ALERT.DESKTOP.name:
        this.alertDesktop(name, details);
        break;
      case this.ALERT.SOUND.name:
        this.alertSound(name, details);
        break;
      case this.ALERT.SMS.name:
        this.alertSMS(name, details);
        break;
      case this.ALERT.DISCORD.name:
        this.alertDiscord(name, details);
        break;
      case this.ALERT.EMAIL.name:
        this.alertEmail(name, details);
        break;
      default:
        break;
    }
  },

  alertDesktop: function (name, details) {
    if (!desktopNotificationOnCooldown) {
      desktopNotificationOnCooldown = true;
      var notification;
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
      } else if (Notification.permission === "granted") {
        notification = new Notification(this.EVENT[name].title, {
          body: this.parse(this.EVENT[name].msg, details),
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission()
          .then(function (permission) {
            if (permission === "granted") {
              notification = new Notification(this.EVENT[name].title, {
                body: this.parse(this.EVENT[name].msg, details),
              });
            }
          })
          .then(function () {
            desktopNotificationOnCooldown = false;
          });
      }
      notification.onclick = function () {
        window.focus();
        this.close();
      };
      setTimeout(notification.close.bind(notification), 7000);
    }
  },

  alertSound: function (name, details) {
    var url = this.getSetting(this.ALERT.SOUND.name + "URL" + name);

    if (this.EVENT[name].repeat) {
      this.maxAlerts = this.getSetting("audioMaxAlerts");
      if (
        !this.alerting &&
        (this.currAutoAudioPlays != this.maxAlerts || this.maxAlerts == 0)
      ) {
        this.alerting = true; // we will fire this before the setInterval so it doesn't fire after 2 seconds
        this.currAutoAudioPlays = this.currAutoAudioPlays + 1;
        this.theAlert = setInterval(
          (IQ, url) => {
            if (IQ.currAutoAudioPlays <= IQ.maxAlerts || IQ.maxAlerts == 0) {
              IQ.currAutoAudioPlays = IQ.currAutoAudioPlays + 1;
              IQ.playSound(url);
            } else {
              IQ.stopAlert();
            }
          },
          2000,
          this,
          url
        );
      }
    } else {
      this.playSound(url);
    }
  },

  playSound: function (url) {
    var audio = new Audio(url);
    audio.play();
  },

  alertSMS: function (name, details) {},

  alertDiscord: function (name, details) {},

  alertEmail: function (name, details) {},

  isAlertEnabled: function (type, name) {
    if (this.nil(type)) {
      type = this.ALERT.SOUND.name;
    }

    var globalEnabled = this.getSetting(type + "Enabled") === true;

    //If no name is passed, return the global setting.
    if (this.nil(name)) {
      return globalEnabled;
    }

    //If global type is off, return false.
    if (!globalEnabled) {
      return false;
    }

    //Return whether that specific sound is on.
    return this.getSetting(type + name);
  },

  getSound: function (name) {
    this.getSetting(name);
  },

  getSetting: function (name) {
    return GM_config.get(name);
  },

  parse: function (str, details) {
    var i = 0;
    return str.replace(/%s/g, () => details[i++]);
  },

  nil: function (obj) {
    if (
      typeof obj === "undefined" ||
      obj == null ||
      obj == "null" ||
      obj === false ||
      String(obj).trim() === ""
    ) {
      return true;
    }
    return false;
  },

  notNil: function (obj) {
    return !this.nil(obj);
  },

  log: function (msg) {
    if (this.getSetting("showLogs") === false) return;
    console.log(msg);
  },

  WebSocket: function (url, protocols) {
    const socket = new OldSocket(...arguments);
    socket.addEventListener("message", this.eventListener);
    return socket;
  },
};

const OldSocket = WebSocket;

let alerting = false;
let desktopNotificationOnCooldown = false;

let IQ = new IQRPG();
window.WebSocket = IQ.WebSocket;

$(document).ready(function () {
  IQ.execute();
});