// ==UserScript==
// @name         MultiHack KillSwitch, No Chat
// @namespace    Killswitch with No Chat
// @version      12.12.12
// @description  Take Over MooMoo.io
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @author       lsg gamez
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @require      https://update.greasyfork.org/scripts/480301/1283571/CowJS.js
// @grant        none
// @license      https://greasyfork.org/en/users/1222651-logixx
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483518/MultiHack%20KillSwitch%2C%20No%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/483518/MultiHack%20KillSwitch%2C%20No%20Chat.meta.js
// ==/UserScript==
(function () {
  'use strict'


  // Variables
  var teleport = false;
  var stoptrapper = 1;
  var allAnimals = [];
  var Allplayers = [];
  var players = [];
  var items = [];
  var itemInfo = [{ Idistance: 0, health: 0, damage: 0 }];
  var weapons = [];
  var inGame = false;
  var tmpHealth = 100;
  var sTime = 0;
  var sCount = 0;
  var msgpack = window.msgpack;
  var scale = 45;
  var placeOffset = 5;
  var ws;
  var EnemyAngle1 = 0;
  var lastWeaponRangeMultChange = null
  var Boughtscuba = false;
  var BoughtscubaEle;
  var prevHatID = 0;
  var prevTailID = 0;
  var boughtItems = false;
  var boughtItems2 = false;
  var monkeyTail = false;
  var boostHat = false;
  var snowGear = false;
  var myDmg = 0;
  var itemHp = 100;
  var hitCount_ = 16;
  var i = 0;
  var myKills = 0;
  var inTrap = false;

  const { Cow, CowUtils } = window

  var x1 = 0;
  var y1 = 0;

  function saveSettings(HACK, data) {
      console.log(
        'save: ' + HACK.toLowerCase().toString() + ' ' + data.toString()
      )
      localStorage.setItem(
        HACK.toLowerCase().toString(),
        data.toString()
      )
    }

  var settings = {

      ping: { e: localStorage.getItem('ping') || false },
      showsid: {e: localStorage.getItem('showsid') || false },
      percents: { e: localStorage.getItem('percents') || false },
      tracers: { e: localStorage.getItem('tracers') || false },
      animaltracers: { e: localStorage.getItem('animaltracers') || false },
      hp: { e: localStorage.getItem('hp') || false },
      circles_hp: { e: localStorage.getItem('circles_hp') || false },
      inweaponrange: { e: Number(localStorage.getItem('inwprange')) || false },
      whereurlooking: { e: Number(localStorage.getItem('whereurlooking')) || false },
      healthbars: {e: Number(localStorage.getItem('healthbars')) || false },
      hitcounter: { e: Number(localStorage.getItem('hitcounter')) || false },
      hpcolor: 'red',
      weaponrange: { e: Number(localStorage.getItem('weaponrange')) || 1 },
      enabledhacks: { e: localStorage.getItem('enabledhacks') || false },
      coloredstructures: { e: localStorage.getItem('coloredstructures') || false },

      tripleautomill: { e: localStorage.getItem('tripleautomill') || false, k: localStorage.getItem('tripleautomillk') || 'NONE', d: true, n: 'Triple AutoMill' },
      autoboost: { e: localStorage.getItem('autoboost') || false, k: localStorage.getItem('autoboostk') || 'NONE', d: true, n: 'AutoBoost' },
      autoboostspikes: { e: localStorage.getItem('autoboostspikes') || false, k: localStorage.getItem('autoboostspikesk') ||'NONE', d: true, n: 'AutoBoost + Spikes' },
      autotrap: { e: localStorage.getItem('autotrap') || false, k: localStorage.getItem('autotrapk') || 'NONE', d: true, n: 'AutoTrap' },
      autoheal: { e: localStorage.getItem('autoheal') || false, k: localStorage.getItem('autohealk') || 'NONE', cases: ['Default','Fast','Slow'], o: localStorage.getItem('autohealo') || 'Default', d: true, n: 'AutoHeal'},
      autoscuba: { e: localStorage.getItem('autoscuba') || false, k: localStorage.getItem('autoscubak') || 'NONE', d: false },
      autobreak: { e: localStorage.getItem('autobreak') || false, k: localStorage.getItem('autobreakk') || 'NONE', d: true, n: 'AutoBreak' },
      autospeed_hat_acc: { e: localStorage.getItem('autospeed_hat_acc') || false, k: localStorage.getItem('autospeed_hat_acck') || 'NONE', d: true, n: 'AutoSpeed + Hat + Acc' },
      toggleoffspeed_hit_and_on: { e: localStorage.getItem('toggleoffspeed_hit_and_on') || false, k: localStorage.getItem('toggleoffspeed_hit_and_onk') || 'NONE', d: false },
      antibow: { e: localStorage.getItem('antibow') || false, k: localStorage.getItem('antibowk') || 'NONE', d: true, n: 'AntiBow' },
      insta_kill: { e: localStorage.getItem('insta_kill') || false, k: localStorage.getItem('insta_killk') || 'NONE', d: true, n: 'Insta Kill' },
      biomegear: { e: localStorage.getItem('biomegear') || true },
      antianimal: { e: localStorage.getItem('antianimal') || true, n: Number(localStorage.getItem('antianimaln')) || 200 },

      autojoin: { e: localStorage.getItem('autojoin') || false, n: Number(localStorage.getItem('autojoinn')) || 0 },
      autocreate: { e: localStorage.getItem('autocreate') || false, n: localStorage.getItem('autocreaten') || 'Killers' },
      autoleave: {e: localStorage.getItem('autoleave') || false },
      autokick: {e: localStorage.getItem('autokick') || false, n: localStorage.getItem('autokickn') || '' },

      aimbot: { e: localStorage.getItem('aimbot') || false, a: null, d: true, n: 'Aimbot', k: localStorage.getItem('aimbotk') || 'NONE', },
      aaimbot: { e: localStorage.getItem('aaimbot') || false, a: null, d: true, n: 'Animal Aimbot', k: localStorage.getItem('aaimbotk') || 'NONE', },
  
      // afk

      antiplayer: { e: localStorage.getItem('antiplayer') || false },
      autotele: { e: localStorage.getItem('autotele') || false },
      autocircles: {e: localStorage.getItem('autocircles') || false },
      turrets: { e: localStorage.getItem('turrets') || false },

      // ruby

      rubyfarm: { e: localStorage.getItem('rubyfarm') || false, r: localStorage.getItem('rubyfarmr') || 'Turret', h: localStorage.getItem('rubyfarmh') || false, d: true, n: 'RubyFarm' },

      // chat

      chatstats: { e: localStorage.getItem('chatstats') || false },
      chatkill: { e: localStorage.getItem('chatkill') || false },
      chatpoints: { e: localStorage.getItem('chatpoints') || false },
      chatinsta: { e: localStorage.getItem('chatinsta') || false },
      chatset: { e: localStorage.getItem('chatset') || false, n: localStorage.getItem('chatsetn') || 'KillSwitch > All' },
      chataimbot: { e: localStorage.getItem('chataimbot') || false },
      chataaimbot: { e: localStorage.getItem('chataaimbot') || false },
      chatping: { e: localStorage.getItem('chatping') || false },

    };

  const inventory = {
      primary: null,
      secondary: null,
      food: null,
      wall: null,
      spike: null,
      mill: null,
      mine: null,
      boostPad: null,
      trap: null,
      turret: null,
      spawnpad: null,
      teleporter: false,
    };

  const myPlayer = {
      food: null,
      wood: null,
      stone: null,
      points: null,
      kills: null,
      sid: null,
      x: null,
      y: null,
      dir: null,
      buildIndex: null,
      weaponIndex: null,
      weaponVariant: null,
      team: null,
      isLeader: null,
      skinIndex: null,
      tailIndex: null,
      iconIndex: null,
      CAMX: 0,
      CAMY: 0,
    };

  //GUI

  const gui = new guify({
      title: 'KillSwitch',
      align: 'right',
      width: 600,
      opacity: 0.8,
      barMode: 'none',
      theme: {
        colors: {
          panelBackground: 'rgb(0,0,0)',
          componentBackground: 'rgb(10,10,25)',
          componentForeground: 'red',
          textPrimary: 'red',
          textSecondary: 'red',
          textHover: 'rgb(0,0,0)',
        },
        font: {
          fontSize: '20px',
          fontFamily: 'Hammersmith',
        },
      },
    })

    const folders = [
      'Visuals',
      'Misc',
      'Keybinds',
      'Team',
      'Aimbot',
      'AFK',
      'Chat',
    ];

    const visuals = [
      'Ping',
      'ShowSID',
      'Percents',
      'Tracers',
      'AnimalTracers',
      'Hp',
      'EnabledHacks',
      'ColoredStructures',
      'HealthBars',
      'Circles_Hp',
      'InWeaponRange',
      'WhereURLooking',
      'HitCounter',
      'WeaponRange',
    ];

    const misc = [
      'TripleAutoMill',
      'AutoBoost',
      'AutoBoostSpikes',
      'AutoTrap',
      'AutoHeal',
      'AutoScuba',
      'AutoBreak',
      'AutoSpeed_Hat_Acc',
      'ToggleOffSpeed_Hit_And_On',
      'AntiBow',
      'Insta_Kill',
      'BiomeGear',
      'AntiAnimal',
    ];

    const team = [
      'AutoJoin',
      'ID To Join:',
      'AutoCreate',
      'Name To Create:',
      'AutoLeave',
      'AutoKick',
      'Persons ID To Kick:',
    ];

    const aimbotF = [
      'Aimbot',
      'Set Aimbot Key',
      'Aimbot Key:',
      'Animal Aimbot',
      'Set Animal Aimbot Key',
      'Animal Aimbot Key:'
    ];

    const afk = [
      'AntiPlayer',
      'AutoTeleport',
      'Circle Movement',
      'AutoTurret Defense'
    ];

    for (let key in settings) {
      if (localStorage.getItem(key.toLowerCase() === undefined)) {
        localStorage.setItem(key.toLowerCase(), 'false')
      }
      if (localStorage.getItem(key.toLowerCase()) === 'false') {
        settings[key].e = false
      } else
      if (localStorage.getItem(key.toLowerCase()) === 'true') {
        settings[key].e = true
      }
    }

    for(let j0 = 0; j0 < folders.length; j0++) {
      gui.Register({
          type: 'folder',
          label: folders[j0],
          open: !1
        });
    };

    for (let j1 = 0; j1 < visuals.length; j1++) {
      if (visuals[j1].toLowerCase() === 'weaponrange') {
        gui.Register({
          type: 'range',
          label: visuals[j1],
          folder: folders[0],
          object: settings[visuals[j1].toLowerCase()],
          property: 'e',
          step: 1,
          min: 1,
          max: 5,
          onChange: (data) => {
            saveSettings(visuals[j1].toLowerCase(), data);
        }
        });
      } else {
      gui.Register({
        type: 'checkbox',
        label: visuals[j1],
        folder: folders[0],
        object: settings[visuals[j1].toLowerCase()],
        property: 'e',
        onChange: (data) => {
          saveSettings(visuals[j1].toLowerCase(), data);
      }
      });
     };
    };
    for (let j2 = 0; j2 < misc.length; j2++) {
      gui.Register({
        type: 'checkbox',
        label: misc[j2],
        folder: folders[1],
        object: settings[misc[j2].toLowerCase()],
        property: 'e',
        onChange: (data) => {
          saveSettings(misc[j2].toLowerCase(), data);
      }
      });
    };

    const script = {
      setKeybind: function (selection, save) {
        selection.k = 'Press Any Key'
        document.addEventListener('keydown', function set_key(e) {
          if (e.key === 'Escape') {
            selection.k = 'NONE'
            localStorage.setItem(save, selection.k)
            document.removeEventListener('keydown', set_key)
          } else {
            selection.k = e.code
            localStorage.setItem(save, selection.k)
            document.removeEventListener('keydown', set_key)
          }
        })
      },
    };

    gui.Register({
      type: 'checkbox',
      label: 'Stats',
      folder: folders[6],
      object: settings.chatstats,
      property: 'e',
      onChange: () => {
        saveSettings('chatstats', settings.chatstats.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Kills',
      folder: folders[6],
      object: settings.chatkill,
      property: 'e',
      onChange: () => {
        saveSettings('chatkill', settings.chatkill.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Score',
      folder: folders[6],
      object: settings.chatpoints,
      property: 'e',
      onChange: () => {
        saveSettings('chatpoints', settings.chatpoints.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Insta',
      folder: folders[6],
      object: settings.chatinsta,
      property: 'e',
      onChange: () => {
        saveSettings('chatinsta', settings.chatinsta.e);
      }
    });
    gui.Register({
      type: 'text',
      label: 'Set Your Message',
      folder: folders[6],
      object: settings.chatset,
      property: 'n',
      onChange: () => {
        saveSettings('chatsetn', settings.chatset.n);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Say Your Message',
      folder: folders[6],
      object: settings.chatset,
      property: 'e',
      onChange: () => {
        saveSettings('chatset', settings.chatset.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Aimbot Chat',
      folder: folders[6],
      object: settings.chataimbot,
      property: 'e',
      onChange: () => {
        saveSettings('chataimbot', settings.chataimbot.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Animal Aimbot Chat',
      folder: folders[6],
      object: settings.chataaimbot,
      property: 'e',
      onChange: () => {
        saveSettings('chataaimbot', settings.chataaimbot.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'Ping Chat',
      folder: folders[6],
      object: settings.chatping,
      property: 'e',
      onChange: () => {
        saveSettings('chatping', settings.chatping.e);
      }
    });

    gui.Register({
      type: 'checkbox',
      label: afk[0],
      folder: folders[5],
      object: settings.antiplayer,
      property: 'e',
      onChange: () => {
        saveSettings('antiplayer', settings.antiplayer.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: afk[1],
      folder: folders[5],
      object: settings.autotele,
      property: 'e',
      onChange: () => {
        saveSettings('autotele', settings.autotele.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: afk[2],
      folder: folders[5],
      object: settings.autocircles,
      property: 'e',
      onChange: () => {
        saveSettings('autocircles', settings.autocircles.e);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: afk[3],
      folder: folders[5],
      object: settings.turrets,
      property: 'e',
      onChange: () => {
        saveSettings('turrets', settings.turrets.e);
      }
    });

    gui.Register({
      type: 'checkbox',
      label: 'RubyFarming',
      folder: folders[1],
      object: settings.rubyfarm,
      property: 'e',
      onChange: () => {
        saveSettings('rubyfarm', settings.rubyfarm.e);
      }
    });

    gui.Register({
      type: 'select',
      label: 'RubyFarming Item',
      folder: folders[1],
      object: settings.rubyfarm,
      property: 'r',
      options: ['Turret','Mill','Spikes','Spawn Pad','Walls'],
      onChange: () => {
        saveSettings('rubyfarmr', settings.rubyfarm.r);
      }
    });
    gui.Register({
      type: 'checkbox',
      label: 'RubyFarming Hammer',
      folder: folders[1],
      object: settings.rubyfarm,
      property: 'h',
      onChange: () => {
        saveSettings('rubyfarmh', settings.rubyfarm.h);
      }
    });

    gui.Register({
      type: 'range',
      label: misc[12]+' Distance',
      folder: folders[1],
      object: settings['antianimal'],
      property: 'n',
      step: 1,
      min: 1,
      max: 300,
      onChange: (data) => {
        saveSettings('antianimaln', data);
    }
    });
    
    gui.Register({
      type: 'select',
      label: misc[4]+ ' Mode:',
      folder: folders[1],
      options: ['Default', 'Fast', 'Slow'],
      object: settings[misc[4].toLowerCase()],
      property: 'o',
      onChange() {
          saveSettings('autohealo', settings.autoheal.o)
      }
    });

    gui.Register({
      type: 'checkbox',
      label: aimbotF[0],
      folder: folders[4],
      object: settings['aimbot'],
      property: 'e',
      onChange: (data) => {
        saveSettings('aimbot', data);
    }
    });
    gui.Register({
      type: 'button',
      label: aimbotF[1],
      folder: folders[4],
      action: () => {
        script.setKeybind(settings.aimbot, 'aimbotk')
    }
    });
    gui.Register({
      type: 'display',
      label: aimbotF[2],
      folder: folders[4],
      object: settings['aimbot'],
      property: 'k',
    });
    gui.Register({
      type: 'checkbox',
      label: aimbotF[3],
      folder: folders[4],
      object: settings['aaimbot'],
      property: 'e',
      onChange: (data) => {
        saveSettings('aaimbot', data);
    }
    });
    gui.Register({
      type: 'button',
      label: aimbotF[4],
      folder: folders[4],
      action: () => {
        script.setKeybind(settings.aaimbot, 'aaimbotk')
    }
    });
    gui.Register({
      type: 'display',
      label: aimbotF[5],
      folder: folders[4],
      object: settings['aaimbot'],
      property: 'k',
    });

    gui.Register({
      type: 'button',
      label: team[0],
      folder: folders[3],
      action: () => {
        joinTeam(settings.autojoin.n)
      }
    });
    gui.Register({
      type: 'text',
      label: team[1],
      folder: folders[3],
      object: settings.autojoin,
      property: 'n',
      onChange: (data) => {
        saveSettings('autojoinn', data);
      }
    });
    gui.Register({
      type: 'button',
      label: team[2],
      folder: folders[3],
      action: () => {
        createTeam(settings.autocreate.n)
      }
    });
    gui.Register({
      type: 'text',
      label: team[3],
      folder: folders[3],
      object: settings.autocreate,
      property: 'n',
      onChange: (data) => {
        saveSettings('autocreaten', data);
      }
    });
    gui.Register({ // e
      type: 'button',
      label: team[4],
      folder: folders[3],
      action: () => {
        leaveTeam()
      }
    });
    gui.Register({ // e
      type: 'button',
      label: team[5],
      folder: folders[3],
      action: () => {
        kickTeam(settings.autokick.n)
      }
    });
    gui.Register({
      type: 'text',
      label: team[6],
      folder: folders[3],
      object: settings.autokick,
      property: 'n',
      onChange: (data) => {
        saveSettings('autokickn', data);
      }
    });

    gui.Register({
      type: 'button',
      label: 'Set '+misc[0]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.tripleautomill, 'tripleautomillk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[0]+' Key:',
      folder: folders[2],
      object: settings[misc[0].toLowerCase()],
      property: 'k',
    });
    //AutoBoost
    gui.Register({
      type: 'button',
      label: 'Set '+misc[1]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autoboost, 'autoboostk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[1]+' Key:',
      folder: folders[2],
      object: settings[misc[1].toLowerCase()],
      property: 'k',
    });
    //AutoBoostSpikes
    gui.Register({
      type: 'button',
      label: 'Set '+misc[2]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autoboostspikes, 'autoboostspikesk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[2]+' Key:',
      folder: folders[2],
      object: settings[misc[2].toLowerCase()],
      property: 'k',
    });
     //AutoTrap
     gui.Register({
      type: 'button',
      label: 'Set '+misc[3]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autotrap, 'autotrapk')
      }
      });
    gui.Register({
        type: 'display',
        label: misc[3]+' Key:',
        folder: folders[2],
        object: settings[misc[3].toLowerCase()],
        property: 'k',
        });
      //AutoHeal
    gui.Register({
      type: 'button',
      label: 'Set '+misc[4]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autoheal, 'autohealk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[4]+' Key:',
      folder: folders[2],
      object: settings[misc[4].toLowerCase()],
      property: 'k',
    });
    //AutoScuba
    gui.Register({
       type: 'button',
       label: 'Set '+misc[5]+' Key',
       folder: folders[2],
       action: () => {
           script.setKeybind(settings.autoscuba, 'autoscubak')
       }
     });
     gui.Register({
       type: 'display',
       label: misc[5]+' Key:',
       folder: folders[2],
       object: settings[misc[5].toLowerCase()],
       property: 'k',
     });
   //AutoBreak
   gui.Register({
      type: 'button',
      label: 'Set '+misc[6]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autobreak, 'autobreakk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[6]+' Key:',
      folder: folders[2],
      object: settings[misc[6].toLowerCase()],
      property: 'k',
    });
   //AutoSpeed_Hat_Acc
   gui.Register({
      type: 'button',
      label: 'Set '+misc[7]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.autospeed_hat_acc, 'autospeed_hat_acck')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[7]+' Key:',
      folder: folders[2],
      object: settings[misc[7].toLowerCase()],
      property: 'k',
    });
   //ToggleOffSpeed_Hit_And_On
   gui.Register({
      type: 'button',
      label: 'Set '+misc[8]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.toggleoffspeed_hit_and_on, 'toggleoffspeed_hit_and_onk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[8]+' Key:',
      folder: folders[2],
      object: settings[misc[8].toLowerCase()],
      property: 'k',
    });
   //AntiBow
   gui.Register({
      type: 'button',
      label: 'Set '+misc[9]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.antibow, 'antibowk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[9]+' Key:',
      folder: folders[2],
      object: settings[misc[9].toLowerCase()],
      property: 'k',
    });
   //Insta_Kill
   gui.Register({
      type: 'button',
      label: 'Set '+misc[10]+' Key',
      folder: folders[2],
      action: () => {
          script.setKeybind(settings.insta_kill, 'insta_killk')
      }
    });
    gui.Register({
      type: 'display',
      label: misc[10]+' Key:',
      folder: folders[2],
      object: settings[misc[10].toLowerCase()],
      property: 'k',
    });

  const join = message => Array.isArray(message) ? [...message] : [...message];

  // WebSocket setup
  ws = new Promise(function (resolve) {
    let {
      send
    } = WebSocket.prototype;
    WebSocket.prototype.send = function (...x) {
      send.apply(this, x);
      this.send = send;
      this.io = function (...datas) {
        const [packet, ...data] = datas;
        this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))));
      };

      document.addEventListener("keydown", event => {
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoboost.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autoboost.e = true;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoboostspikes.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autoboostspikes.e = true;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autotrap.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autotrap.e = true;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.insta_kill.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.insta_kill.e = true;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autospeed_hat_acc.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autospeed_hat_acc.e = true;
          };
      });

      document.addEventListener("keyup", event => {
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoboost.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autoboost.e = false;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoboostspikes.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autoboostspikes.e = false;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autotrap.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autotrap.e = false;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.insta_kill.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.insta_kill.e = false;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autospeed_hat_acc.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autospeed_hat_acc.e = false;
          };
      });

      document.addEventListener("keydown", event => {
          if ('Key'+event.key.toLocaleUpperCase() === settings.tripleautomill.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.tripleautomill.e = !settings.tripleautomill.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoheal.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
              settings.autoheal.e = !settings.autoheal.e;
            };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autobreak.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autobreak.e = !settings.autobreak.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.antibow.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.antibow.e = !settings.antibow.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.toggleoffspeed_hit_and_on.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.toggleoffspeed_hit_and_on.e = !settings.toggleoffspeed_hit_and_on.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.autoscuba.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.autoscuba.e = !settings.autoscuba.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.aimbot.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.aimbot.e = !settings.aimbot.e;
          };
          if ('Key'+event.key.toLocaleUpperCase() === settings.aaimbot.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
            settings.aaimbot.e = !settings.aaimbot.e;
          };
        });

      this.addEventListener("message", function (e) {
        const [packet, data] = msgpack.decode(new Uint8Array(e.data));
        let sid = data[0];
        let health = data[1];

        var tmpData = msgpack.decode(new Uint8Array(e.data));
        var ms = e;


        let addEventListener = {
          setupGame: "C",
          updateHealth: "O",
          killPlayer: "P",
          updateItems: "V"
          };

              switch (packet) {
                case addEventListener.setupGame:
                  inGame = true;
                  items = [0, 3, 6, 10];
                  weapons = [0];
                  break;
                case addEventListener.updateHealth:
                  if (sid === myPlayer.sid) {
                    if (inGame) {
                      if (health < 100 && health > 0 && settings.autoheal.e) {
                          switch (settings.autoheal.o) {
                            case 'Fast':
                              setTimeout(() => {
                                place(inventory.food);
                              }, 100);
                              break;

                            case 'Slow':
                              setTimeout(() => {
                                place(inventory.food);
                              }, 350);
                            break;

                            default:
                              setTimeout(() => {
                                place(inventory.food);
                              }, 250);
                              break;
                        };
                      };
                    };
                    if (tmpHealth - health < 0) {
                      if (sTime) {
                        let timeHit = Date.now() - sTime;
                        sTime = 0;
                        sCount = timeHit <= 120 ? sCount + 1 : Math.max(0, sCount - 2);
                      }
                    } else {
                      sTime = Date.now();
                    }
                    tmpHealth = health;
                  }
                  break;
                case addEventListener.killPlayer:
                  inGame = false;
                  setTimeout(() => {
                    tmpHealth = 100;
                  }, 100);
                  break;
                case addEventListener.updateItems:
                  if (sid) {
                    if (health) {
                      weapons = sid;
                    } else {
                      items = sid;
                    }
                  }
                  break;
                };

        if ((ms = undefined) || (tmpData = (ms = tmpData.length > 1 ? [tmpData[0], ...join(tmpData[1])] : tmpData)[0]) || ms) {
          if ("C" == tmpData && null === myPlayer.sid && (myPlayer.sid = ms[1]) || "a" == tmpData) {
            for (tmpData = 0; tmpData < ms[1].length / 13; tmpData++) {

              var data2 = ms[1].slice(13 * tmpData, 13 * (tmpData + 1));
              if (data2[0] == myPlayer.sid) {
                  Object.assign(myPlayer, {
                    food: document.getElementById("foodDisplay").innerText,
                    wood: document.getElementById("woodDisplay").innerText,
                    stone: document.getElementById("stoneDisplay").innerText,
                    points: document.getElementById("scoreDisplay").innerText,
                    kills: document.getElementById("killCounter").innerText,
                    sid: data2[0],
                    x: data2[1],
                    y: data2[2],
                    dir: data2[3],
                    buildIndex: data2[4],
                    weaponIndex: data2[5],
                    weaponVariant: data2[6],
                    team: data2[7],
                    isLeader: data2[8],
                    skinIndex: data2[9],
                    tailIndex: data2[10],
                    iconIndex: data2[11]
                  });
                } else {
                const existingAllPlayerIndex = Allplayers.findIndex(Allplayers => Allplayers.sid === data2[0]);
                const existingPlayerIndex = players.findIndex(players => players.sid === data2[0]);

                if (existingPlayerIndex !== -1) {
                // Update existing player information
                players[existingPlayerIndex] = {
                  sid: data2[0],
                  x: data2[1],
                  y: data2[2],
                  dir: data2[3],
                  buildIndex: data2[4],
                  weaponIndex: data2[5],
                  weaponVariant: data2[6],
                  team: data2[7],
                  isLeader: data2[8],
                  skinIndex: data2[9],
                  tailIndex: data2[10],
                  iconIndex: data2[11]
                };
              } else {
                players.push({
                  sid: data2[0],
                  x: data2[1],
                  y: data2[2],
                  dir: data2[3],
                  buildIndex: data2[4],
                  weaponIndex: data2[5],
                  weaponVariant: data2[6],
                  team: data2[7],
                  isLeader: data2[8],
                  skinIndex: data2[9],
                  tailIndex: data2[10],
                  iconIndex: data2[11]
              });
              }

                if (existingAllPlayerIndex !== -1) {
                    // Update existing player information
                    Allplayers[existingAllPlayerIndex] = {
                        sid: data2[0],
                        x: data2[1],
                        y: data2[2],
                        dir: data2[3],
                        buildIndex: data2[4],
                        weaponIndex: data2[5],
                        weaponVariant: data2[6],
                        team: data2[7],
                        isLeader: data2[8],
                        skinIndex: data2[9],
                        tailIndex: data2[10],
                        iconIndex: data2[11]
                    };
                } else {
                    // Add a new player entry to the players array
                    Allplayers.push({
                        sid: data2[0],
                        x: data2[1],
                        y: data2[2],
                        dir: data2[3],
                        buildIndex: data2[4],
                        weaponIndex: data2[5],
                        weaponVariant: data2[6],
                        team: data2[7],
                        isLeader: data2[8],
                        skinIndex: data2[9],
                        tailIndex: data2[10],
                        iconIndex: data2[11]
                    });
                }
            };
                };
              };
            cacheItems();
          };
      });
      resolve(this);
    };
  });

  // Functions
  const sendPacket = function (...datas) {
    const [type, ...data] = datas;
    var binary = msgpack.encode([type, data]);
    ws.then(function (wsInstance) {
      wsInstance.send(new Uint8Array(Array.from(binary)));
    });
  };

  function findPlayerBySID(sid) {
    for (var i = 0; i < Allplayers.length; i++) {
        if (Allplayers[i].sid == sid) {
            return Allplayers[i];
        }
    } return null;
};

function objectAlly(sid) {
  var tmpObj = findPlayerBySID(sid);

  if (myPlayer.sid == sid) {
      return true
  } else if (!tmpObj) {
    return false;
  } else if (tmpObj.team) {
      return tmpObj.team === myPlayer.team ? true : false
  } else {
      return false
  };
};

  function isAlly(sid){

    var tmpObj = findPlayerBySID(sid)
    if (!tmpObj){
        return false
    }
    if (myPlayer.sid == sid){
        return true
    }else if (tmpObj.team){
        return tmpObj.team === myPlayer.team ? true : false
    } else {
        return
    }
};

  const emit = (event, a, b, c, m, r) => ws.then(function (wsInstance){wsInstance.send(Uint8Array.from([...msgpack.encode([event, [a, b, c, m, r]])]))});

  //BUYEQUIP

  const buyEquip = (id) => {
    window.storeBuy(id)
    setTimeout(() => {
      window.storeEquip(id)
    }, 15);
  }

  //TEAM
  const leaveTeam = () => {
    sendPacket("N")
  };

  const kickTeam = (id) => {
    sendPacket("Q", Number(id))
  }

  const createTeam = (name) => {
    sendPacket("L", name.toString().charAt(0).toUpperCase()+name.toString().slice(1));
  }

  const joinTeam = (id) => {
    sendPacket("b", Number(id));
  };

  // PLACE
  const place = (thing, angle) => {
      emit("G", thing, false);
      emit("d", 1, angle);
      emit("d", 0, angle);
      emit("G", myPlayer.weaponIndex, true);
    };

  // SELECT WEAPON
  const selectWeapon = function (index) {
    if (inGame) {
      emit("G", weapons[index], true);""
    }
  };

  const _hit = (ang) => {
    emit("d", 1, ang);
    setTimeout(() => {
      emit("d", 0, ang);
    }, 100);
  }


  // HIT
  const hit = function (ang) {
    if (inGame) {
      emit("d", 1, ang);
      emit("d", 0, ang);
      emit("G", myPlayer.weaponIndex, true);
    }
  };
  // CHAT
  const chat = function (e) {
    if (inGame) {
      emit("6", e)
    }
  };

  const cacheItems = () => {
      for (let c = 0; c < 9; c++) {
        var _document$getElementB;
        if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
          inventory.primary = c;
        }
      }
      for (let s = 9; s < 16; s++) {
        var _document$getElementB2;
        if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
          inventory.secondary = s;
        }
      }
      for (let P = 16; P < 19; P++) {
        var _document$getElementB3;
        if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
          inventory.food = P - 16;
        }
      }
      for (let f = 19; f < 22; f++) {
        var _document$getElementB4;
        if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
          inventory.wall = f - 16;
        }
      }
      for (let _ = 22; _ < 26; _++) {
        var _document$getElementB5;
        if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
          inventory.spike = _ - 16;
        }
      }
      for (let u = 26; u < 29; u++) {
        var _document$getElementB6;
        if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
          inventory.mill = u - 16;
        }
      }
      for (let I = 29; I < 31; I++) {
        var _document$getElementB7;
        if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
          inventory.mine = I - 16;
        }
      }
      for (let p = 31; p < 33; p++) {
        var _document$getElementB8;
        if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
          inventory.boostPad = p - 16;
        }
      }
      for (let x = 31; x < 33; x++) {
        var _document$getElementB9;
        if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
          inventory.trap = x - 16;
        }
      }
      for (let g = 33; g < 35; g++) {
        var _document$getElementB10;
        if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
          inventory.turret = g - 16;
        }
      }
      for (let y = 36; y < 39; y++) {
        var _document$getElementB10;
        if (((_document$getElementB10 = document.getElementById(`actionBarItem${y}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && y !== 36) {
          inventory.teleporter = y - 16;
        }
      }
      inventory.spawnpad = 36;
    };

    window.addEventListener('DOMContentLoaded', () => {

      var connecting = document.getElementById('loadingText');
      var diedMsg = document.getElementById('diedText');
      var gameLogo = document.getElementById('gameName');

      connecting.textContent = 'Switching On KillSwitch';
      diedMsg.textContent = 'You Died, Go MOD!';
      gameLogo.textContent = 'KillSwitch';
      gameLogo.style.color = 'black';

      lastWeaponRangeMultChange = Date.now()
      resetPlayers()
    });

    function resetPlayers() {
      allAnimals = [];
      players = [];
      setTimeout(() => {
        resetPlayers()
      }, 1000);
    };

    window.setInterval(() => {
      if (!inGame) return;
      if (settings.chatstats.e) { chat(`Health: ${Math.floor(tmpHealth)} / 100 hp`) };
        setTimeout(() => {
        if (settings.chatping.e) { chat(`Ping: ${window.pingTime}ms`) };
        setTimeout(() => {
        if (settings.chatkill.e && myPlayer.kills > myKills) { chat(`Kill You | Kills: ${myPlayer.kills}`) };
        setTimeout(() => {
        if (settings.chatpoints.e) { chat(`Score: ${myPlayer.points}`) };
        setTimeout(() => {
        if (settings.chatset.e) { chat(`${settings.chatset.n}`) };
        myKills = myPlayer.kills;
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 500)

    function drawCircleBar(color, width, scale, endAngle) {
      const { context } = Cow.renderer

      context.strokeStyle = color
      context.lineWidth = width
      context.lineCap = "round"
      context.beginPath()
      context.arc(0, 0, scale, 0, endAngle)
      context.stroke()
      context.closePath()
  };

  function drawCircle(x, y, color, radius, lineWidth) {
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth
    ctx.stroke();
  };

  function weaponRanges(weaponID) {
    switch (weaponID) {
        case 0:
          return 65;
        break;
        case 1:
          return 70;
        break;
        case 2:
          return 75;
        break;
        case 3:
          return 110;
        break;
        case 4:
          return 118;
        break;
        case 5:
          return 142;
        break;
        case 6:
          return 110;
        break;
        case 7:
          return 65;
        break;
        case 8:
          return 70;
        break;
        case 9:
          return 200;
        break;
        case 10:
          return 75;
        break;
        case 11:
          return 0;
        break;
        case 12:
          return 200;
        break;
        case 13:
          return 200;
        break;
        case 14:
          return 0;
        break;
        case 15:
          return 200;
        break;

      default:
        return 0;
        break;
    };
  };

  function dist2dSQRT(e, o) {
    return e && o
      ? Math.sqrt((e.x - o.x) ** 2 + (e.y - o.y) ** 2)
      : null
  };

  window.setInterval(() => {
    teleport = true;
  }, 5000)


  window.setInterval(() => {

    if (!inGame) return;

    if (settings.antiplayer.e && inGame && !inTrap) {
      for (let t = 0; t < players.length; t++) {
        let nearestEnemyAngle = Math.atan2(players[t].y - myPlayer.y, players[t].x - myPlayer.x);
        let nearestEnemyDistance = dist2dSQRT(myPlayer, players[t])
        // console.log(nearestEnemyDistance)
        if (nearestEnemyDistance - 115 <= 200 && nearestEnemyAngle) {
            place(inventory.spike, nearestEnemyAngle);
          };
       };
    };
    if (settings.autocircles.e && inGame) {
      // emit(0, "X", 1000, 1000, -.25, 100, .0016, 1 , 1, 1);
    }

    if (settings.autotele.e && inGame) {
      // all 4 angles
      const tele = inventory.teleporter;
      const spike = inventory.spike;
      place(tele, -Math.PI / 2);
      place(spike, Math.PI);
      place(spike, -Math.PI);
      place(spike, Math.PI / 2);
    };

    if (settings.turrets.e && inGame) {
      const turret = inventory.turret;
      place(turret, -Math.PI / 2);
      place(turret, Math.PI);
      place(turret, -Math.PI);
      place(turret, Math.PI / 2);
    };

    if (settings.aimbot.e && inGame && !inTrap) {
      for (let t = 0; t < players.length; t++) {
        let nearestEnemyAngle = Math.atan2(players[t].y - myPlayer.y, players[t].x - myPlayer.x);
        let nearestEnemyDistance = dist2dSQRT(myPlayer, players[t])
        // console.log(nearestEnemyDistance)
        if (nearestEnemyDistance - 115 <= weaponRanges(inventory.primary) && nearestEnemyAngle) {
          if (settings.chataimbot.e) { chat(`AimBot... Distance: ${Math.round(nearestEnemyDistance-115)}`); };
            selectWeapon(0);
            hit(nearestEnemyAngle);
          };
       };
    };

    if (settings.antianimal.e && inGame && !inTrap) {
      for (let t = 0; t < allAnimals.length; t++) {
        let nearestEnemyAngle = Math.atan2(allAnimals[t].y - myPlayer.y, allAnimals[t].x - myPlayer.x);
        let nearestEnemyDistance = dist2dSQRT(myPlayer, allAnimals[t])
        if (nearestEnemyDistance <= Number(settings.antianimal.n) && nearestEnemyAngle) {
            place(inventory.spike, nearestEnemyAngle);
          };
       };
    };

    if (settings.aaimbot.e && inGame && !inTrap) {
      for (let t = 0; t < allAnimals.length; t++) {
        let nearestEnemyAngle = Math.atan2(allAnimals[t].y - myPlayer.y, allAnimals[t].x - myPlayer.x);
        let nearestEnemyDistance = dist2dSQRT(myPlayer, allAnimals[t])
        // console.log(nearestEnemyDistance)
        if (nearestEnemyDistance - 115 <= weaponRanges(inventory.primary) && nearestEnemyAngle) {
          if (settings.chataaimbot.e) { chat(`Animal Aimbot... Distance: ${Math.round(nearestEnemyDistance-115)}`); };
            selectWeapon(0);
            hit(nearestEnemyAngle);
          };
       };
    };

    if (settings.rubyfarm.e && inGame) {
    function getInvItem() {
      switch (settings.rubyfarm.r) {
        case 'Turret':
           return inventory.turret
          break;
          case 'Mill':
           return inventory.mill
          break;
          case 'Spikes':
            return inventory.spike
          break;
          case 'Spawn Pad':
            return inventory.spawnpad
          break;
          case 'Walls':
            return inventory.wall
          break;
      
        default:
          return inventory.turret
          break;
        };
      };

      const item = getInvItem();

      itemInfo = [{ name: settings.rubyfarm.r, health: itemHp, yourDmg: myDmg, hitCount: hitCount_, started: itemInfo.started }];

      const angle = 1;

      if (itemInfo.itemHp <= 10 || hitCount_ < 2 || !itemInfo.started) {
        place(item, angle - Math.PI / 4);
        place(item, angle + Math.PI / 4);
      };

      settings.rubyfarm.h ? myPlayer.weaponIndex === 10 ? '' : selectWeapon(1) : selectWeapon(0);

      _hit(angle);
    };

    if (settings.insta_kill.e && inGame) {
      for (let i = 0; i < players.length; i++) {
        buyEquip(53) // turret
        var nearestEnemyAngle = Math.atan2(players[i].y - myPlayer.y, players[i].x - myPlayer.x);
        let nearestEnemyDistance = dist2dSQRT(myPlayer, players[i]);
        const weaponRangePrimary = weaponRanges(inventory.primary);
        if (nearestEnemyDistance - 110 > weaponRangePrimary) return
        if (settings.chatinsta.e) { chat(`Insta Kill Loser`) };
        function instakill() {
          setTimeout(()=>{
              emit("G", inventory.primary, 1);
              settings.insta_kill.e = true;
              settings.insta_kill.fastmode = true;
              buyEquip(7, 0);
              setTimeout(()=> {
                  _hit(nearestEnemyAngle)
                  setTimeout(()=>{
                    buyEquip(20, 0);
                      emit("G", inventory.secondary, 1);
                      buyEquip(53, 0);
                      setTimeout(()=>{
                          settings.insta_kill.fastmode ? buyEquip(20, 0) : buyEquip(55, 0);
                          setTimeout(()=>{
                            buyEquip(11, 1);
                              settings.insta_kill.e = false;
                              _hit(nearestEnemyAngle)
                          }, 80);
                      }, 102);
                  },100);
              }, 15);
          }, 70);
        };
          instakill();
        // if (weaponRangeSecondary === 200) {
        //   // console.log('selecting')
        //   selectWeapon(1); // select secondary
        //   setTimeout(() => {
        //   buyEquip(7); // bull helmet
        //   hit(nearestEnemyAngle); // fire
        //   setTimeout(() => {
        //   buyEquip(20); // samurai
        //   setTimeout(() => {
        //     if (inventory.primary !== 8) {
        //       buyEquip(55); // bloddthirster
        //       selectWeapon(0); // select primary
        //       nearestEnemyAngle = Math.atan2(players[i].y - myPlayer.y, players[i].x - myPlayer.x);
        //       hit(nearestEnemyAngle); // hit the enemy
        //       hit(nearestEnemyAngle); // hit the enemy
        //       setTimeout(() => {
        //         selectWeapon(0)
        //         storeEquip(0)
        //       }, 20);
        //     } else {
        //       buyEquip(53); // turret
        //       nearestEnemyAngle = Math.atan2(players[i].y - myPlayer.y, players[i].x - myPlayer.x);
        //       place(inventory.spike, nearestEnemyAngle - Math.PI / 2);
        //       place(inventory.spike, nearestEnemyAngle + Math.PI);
        //       place(inventory.spike, nearestEnemyAngle + Math.PI / 2);
        //       setTimeout(() => {
        //         selectWeapon(0)
        //         storeEquip(0)
        //         }, 20);
        //       };
        //     }, 20);
        //   }, 75);
        // }, 20);
        // } else {
        //   if (inventory.primary !== 8) {
        //     buyEquip(55); // bloddthirster
        //     selectWeapon(0); // select primary
        //     hit(nearestEnemyAngle); // hit the enemy
        //     hit(nearestEnemyAngle); // hit the enemy
        //   } else {
        //     buyEquip(53); // turret
        //     place(inventory.spike, nearestEnemyAngle - Math.PI / 2);
        //     place(inventory.spike, nearestEnemyAngle);
        //     place(inventory.spike, nearestEnemyAngle + Math.PI / 2);
        //     };
        //   };
      };
    };

    if (settings.antibow.e && inGame) {
      for (let t = 0; t < players.length; t++) {
      let nearestEnemyAngle = Math.atan2(players[t].y - myPlayer.y, players[t].x - myPlayer.x);
      let nearestEnemyAngleOpp = Math.atan2(myPlayer.y - players[t].y, myPlayer.x - players[t].x);
      // console.log(nearestEnemyAngleOpp, players[t].dir, nearestEnemyAngleOpp===players[t].dir?true:false)
      if (nearestEnemyAngle &&
        (players[t].weaponIndex === 9 || players[t].weaponIndex === 12 || players[t].weaponIndex === 13 || players[t].weaponIndex === 15)
         && EnemyAngle1 !== nearestEnemyAngle && nearestEnemyAngleOpp >= players[t].dir - .25 && nearestEnemyAngleOpp <= players[t].dir + .25) {
          chat('AntiBow...')
          place(inventory.mill, nearestEnemyAngle);
          selectWeapon(0);
          EnemyAngle1 = nearestEnemyAngle;
        };
      };
    };
    if (y1 !== myPlayer.y || x1 !== myPlayer.x) {
      if (Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x) < (scale + placeOffset) * 2) {

        const millCost = {
          wood: (inventory.mill === 10 ? 50 : (inventory.mill === 11 ? 60 : (inventory.mill === 12 ? 100 : 50))),
          stone: (inventory.mill === 10 ? 10 : (inventory.mill === 11 ? 20 : (inventory.mill === 12 ? 50 : 10))),
        };

        if (settings.tripleautomill.e && myPlayer.wood >= millCost.wood && myPlayer.stone >= millCost.stone && inGame) {
          let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
          place(inventory.mill, angle + Math.PI / 2.5);
          place(inventory.mill, angle);
          place(inventory.mill, angle - Math.PI / 2.5);
        };
    // AUTO BOOST PAD :D

    const boostCost = {
      wood: 5,
      stone: 20,
    };

    if (settings.autoboost.e && myPlayer.wood >= boostCost.wood && myPlayer.stone >= boostCost.stone && inGame) {
      let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
      place(inventory.boostPad, angle + Math.PI);
    };

    // AUTO BOOST SPIKES :D

    const spikeCost = {
      wood: (inventory.spike === 6 ? 20 : (inventory.spike === 7 ? 30 : (inventory.spike === 8 ? 35 : (inventory.spike === 9 ? 30 : 20)))),
          stone: (inventory.spike === 6 ? 5 : (inventory.spike === 7 ? 10 : (inventory.spike === 8 ? 15 : (inventory.spike === 9 ? 20 : 5)))),
    }

    if (settings.autoboostspikes.e && myPlayer.wood >= boostCost.wood+spikeCost.wood && myPlayer.stone >= boostCost.stone+spikeCost.stone && inGame) {
      let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
      place(inventory.spike, angle + Math.PI / 2);
      place(inventory.boostPad, angle + Math.PI);
      place(inventory.spike, angle - Math.PI / 2);
    };

    // AUTO TRAP :D

    const trapCost = {
      wood: 30,
          stone: 30,
    }

    if (settings.autotrap.e && myPlayer.wood >= trapCost.wood && myPlayer.stone >= trapCost.stone && inGame) {
          let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
            place(inventory.trap, angle + Math.PI / 2.5);
            place(inventory.trap, angle + Math.PI);
            place(inventory.trap, angle - Math.PI / 2.5);
    };

       // AUTO SCUBA :D

       if (Boughtscuba === true) {} else {
         BoughtscubaEle = document.getElementById('storeDisplay21');
       };

       if (Boughtscuba !== true && Number(myPlayer.points) >= 2500 && settings.autoscuba.e) { console.log(`BUY ${myPlayer.points}`); storeBuy(31); storeEquip(31); Boughtscuba = true; BoughtscubaEle = true; };
       if (BoughtscubaEle !== true && BoughtscubaEle !== null) {
       if (BoughtscubaEle.innerText.includes('Equip') && Boughtscuba !== false) { Boughtscuba = true; BoughtscubaEle = true; };
       };

       var inWater = false;

       var inSnow = false;

       if (Number(myPlayer.y) >= ((14400 / 2) - 375) && Number(myPlayer.y) <= ((14400 / 2) + 375)) {
         inWater = true;
       };

       const snowY = window.config.snowBiomeTop

       if (myPlayer.y <= snowY) {
        inSnow = true;
      };

       if (settings.autospeed_hat_acc.e || inWater || inSnow) {
          if (!snowGear && Number(myPlayer.points) >= 600) {
            storeBuy(15);
            snowGear = true;
          };

          if (inSnow && snowGear && inGame && settings.biomegear.e) {
            storeEquip(15);
          };
        if (inWater && settings.autoscuba.e && inGame && Boughtscuba) {
          storeEquip(31);
        };
        if (!boughtItems && settings.autospeed_hat_acc.e && Number(myPlayer.points) >= 6000) {
          storeBuy(12, 0);
          boughtItems = true;
        } else
        if (!boughtItems2 && settings.autospeed_hat_acc.e && Number(myPlayer.points) >= 2000) {
          storeBuy(11, 1);
          boughtItems2 = true;
        };
        if (settings.autospeed_hat_acc.e && inGame && boughtItems && boughtItems2) {
          if (boughtItems && !boostHat && monkeyTail) {
            storeEquip(12, 0);
            boostHat = true;
           } else
           if (boughtItems2 && !monkeyTail) {
            storeEquip(11, 1);
            monkeyTail = true;
           };
        }
        } else {
          if (!settings.autospeed_hat_acc.e && inGame) {
            if (monkeyTail && boughtItems2 && !boostHat) {
              storeEquip(prevTailID, 1);
              monkeyTail = false;
             } else
             if (boostHat && boughtItems) {
              storeEquip(prevHatID, 0);
              boostHat = false;
             };
           };
        if (prevHatID !== Number(myPlayer.skinIndex) && myPlayer.skinIndex !== 31 && myPlayer.skinIndex !== 12 && myPlayer.skinIndex !== 15) {
          prevHatID = Number(myPlayer.skinIndex);
        };
        if (prevTailID !== Number(myPlayer.tailIndex) && myPlayer.tailIndex !== 11) {
          prevTailID = Number(myPlayer.tailIndex);
        };
        i === 0 ? (
          storeEquip(prevHatID, i),
          i = 1
        ) : (
          storeEquip(prevTailID, i),
          i = 0
        );
        };
        x1 = myPlayer.x;
        y1 = myPlayer.y
      };
    };
  }, 50);

    Cow.addRender("building-health-bars", () => {
      if (!Cow.player?.alive) return;

      const { context } = Cow.renderer
      const weaponRange = (Cow.player.weapon.range + Cow.player.scale / 2) * parseFloat(settings.weaponrange.e)

      if ((Date.now() - lastWeaponRangeMultChange) <= 1500) {
          const color = settings.coloredstructures.e?objectAlly(object.owner.sid) ? 'lime':'red':'blue';

          context.save()
          context.fillStyle = color
          context.strokeStyle = color
          context.globalAlpha = .3
          context.lineWidth = 4

          context.translate(Cow.player.renderX, Cow.player.renderY)
          context.beginPath()
          context.arc(0, 0, weaponRange, 0, Math.PI * 2)
          context.fill()
          context.globalAlpha = .7
          context.stroke()
          context.closePath()
          context.restore()
      } else {
          lastWeaponRangeMultChange = null
      };

      if (settings.enabledhacks.e) {
        (function () {
          const ctx = document.getElementById('gameCanvas').getContext('2d');
          let _ = 100;
          let __ = 60;
          for (let hack in settings) {
            if (settings[hack].e && settings[hack].d) {
              if (settings[hack].n === 'Triple AutoMill' || settings[hack].n === 'Animal Aimbot') __ = 75;
              if (settings[hack].n === 'AutoBoost + Spikes') __ = 100;
              if (settings[hack].n === 'AutoSpeed + Hat + Acc') __ = 125;
              ctx.save();
              ctx.beginPath();
              ctx.lineWidth = 7;
              ctx.fillStyle = 'red';
              ctx.strokeStyle = 'black';
              ctx.font = '22px Hammersmith, sans-serif';
              ctx.strokeText(
                settings[hack].n,
                __,
                _
              );
              ctx.fillText(
                settings[hack].n,
                __,
                _
              );
              ctx.restore();
              _ += 30;
            };
          };
        })();
      };

      if (settings.showsid.e && inGame) {
        (function () {
          const ctx = document.getElementById('gameCanvas').getContext('2d');

          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = 7;
          ctx.fillStyle = 'lime';
          ctx.strokeStyle = 'black';
          ctx.font = '22px Hammersmith, sans-serif';
          ctx.strokeText(myPlayer.sid, Cow.player.renderX, Cow.player.renderY);
          ctx.fillText(myPlayer.sid, Cow.player.renderX, Cow.player.renderY);
          ctx.restore();

          for (let t = 0; t < players.length; t++) {

            const offsetX = window.config.maxScreenWidth/2-Cow.player.renderX;
            const offsetY = window.config.maxScreenHeight/2-Cow.player.renderY;

            const endX = Math.round(window.config.maxScreenWidth/2 - myPlayer.x + players[t].x - offsetX*2);
            const endY = Math.round(window.config.maxScreenHeight/2 - myPlayer.y + players[t].y - offsetY*2);

            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 7;
            ctx.fillStyle = isAlly(players[t].sid) ? 'lime' : 'red';
            ctx.strokeStyle = 'black';
            ctx.font = '22px Hammersmith, sans-serif';
            ctx.strokeText(players[t].sid, endX, endY);
            ctx.fillText(players[t].sid, endX, endY);
            ctx.restore();

          }
        })();
      };

      if (settings.tracers.e && inGame) {
        (function () {
          const ctx = document.getElementById('gameCanvas').getContext('2d');

          for (let t = 0; t < players.length; t++) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.moveTo(Cow.player.renderX, Cow.player.renderY);

            const offsetX = window.config.maxScreenWidth/2-Cow.player.renderX
            const offsetY = window.config.maxScreenHeight/2-Cow.player.renderY

            const endX = Math.round(window.config.maxScreenWidth/2 - myPlayer.x + players[t].x - offsetX*2);
            const endY = Math.round(window.config.maxScreenHeight/2 - myPlayer.y + players[t].y - offsetY*2);

            ctx.lineWidth = 5
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = isAlly(players[t].sid) ? 'lime' : 'red';
            ctx.stroke();

            drawCircle(endX, endY, isAlly(players[t].sid) ? 'lime' : 'red', 45, 5);

            ctx.restore();
          }
        })();
      };

      if (settings.ping.e) {
        const ping = document.getElementById('pingDisplay');
        ping.style.display = 'block';
        ping.style.fontSize = '22px';
      } else {
        const ping = document.getElementById('pingDisplay');
        ping.style.display = 'none';
      };

      if (settings.hp.e && inGame) {
          const ctx = document.getElementById('gameCanvas').getContext('2d');
          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = 7;
          ctx.fillStyle = 'lime';
          ctx.strokeStyle = 'black';
          ctx.font = '22px Hammersmith, sans-serif';
          ctx.strokeText(Math.round(tmpHealth*2)+'hp',Cow.player.renderX,Cow.player.renderY+100);
          ctx.fillText(Math.round(tmpHealth*2)+'hp',Cow.player.renderX,Cow.player.renderY+100);
          ctx.restore();
      };

      if (settings.percents.e && inGame) {
        const ctx = document.getElementById('gameCanvas').getContext('2d');
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.fillStyle = 'lime';
        ctx.strokeStyle = 'black';
        ctx.font = '22px Hammersmith, sans-serif';
        ctx.strokeText(Math.round(tmpHealth)+'%',Cow.player.renderX,Cow.player.renderY+125);
        ctx.fillText(Math.round(tmpHealth)+'%',Cow.player.renderX,Cow.player.renderY+125);
        ctx.restore();
    };

    Cow.animalsManager.eachVisible((animal) => {

          const existingPlayerIndex = allAnimals.findIndex(allAnimals => allAnimals.sid === animal.sid);

                if (existingPlayerIndex !== -1) {
                // Update existing player information
                allAnimals[existingPlayerIndex] = {
                  sid: animal.sid,
                  fullhp: animal.maxHealth,
                  hp: animal.health,
                  name: animal.name,
                  x: animal.x,
                  y: animal.y,
                  x1: animal.x1,
                  y1: animal.y1,
                  x2: animal.x2,
                  y2: animal.y2,
                };
              } else {
                allAnimals.push({
                  sid: animal.sid,
                  fullhp: animal.maxHealth,
                  hp: animal.health,
                  name: animal.name,
                  x: animal.x,
                  y: animal.y,
                  x1: animal.x1,
                  y1: animal.y1,
                  x2: animal.x2,
                  y2: animal.y2,
              });
              }

      if (settings.animaltracers.e && inGame) {
        (function () {
          const ctx = document.getElementById('gameCanvas').getContext('2d');

          for (let t = 0; t < allAnimals.length; t++) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.moveTo(Cow.player.renderX, Cow.player.renderY);

            const endX = Math.round(Cow.player.renderX - myPlayer.x + allAnimals[t].x);
            const endY = Math.round(Cow.player.renderY - myPlayer.y + allAnimals[t].y);

            ctx.lineWidth = 5
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'blue';
            ctx.stroke();

            drawCircle(endX, endY, 'blue', 45, 5);

            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 7;
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'black';
            ctx.font = '25px Hammersmith, sans-serif';
            ctx.strokeText(allAnimals[t].hp,endX,endY);
            ctx.fillText(allAnimals[t].hp,endX,endY);
            ctx.restore();

          };
        })();
      };
    });

    function getRubyName(name) {
      switch (name) {
        case 'turret':
          return 'Turret'
        break;
        case 'windmill':
          return 'Mill'
        break;
        case 'faster windmill':
          return 'Mill'
        break;
        case 'power mill':
          return 'Mill'
        break;
        case 'spawn pad':
          return 'Spawn Pad'
        break;
        case 'spikes':
          return 'Spikes'
        break;
        case 'greater spikes':
          return 'Spikes'
        break;
        case 'poison spikes':
          return 'Spikes'
        break;
        case 'spinning spikes':
          return 'Spikes'
        break;
        case 'wood wall':
          return 'Walls'
        break;
        case 'stone wall':
          return 'Walls'
        break;
        case 'castle wall':
          return 'Walls'
        break;

        default:
          return 'None'
        break;
      };
    };

      Cow.objectsManager.eachVisible((object) => {
          if (!object.isItem) return

          const distance = CowUtils.getDistance(Cow.player, object) - object.scale
          const angle = CowUtils.getDirection(object, Cow.player)

          if (settings.rubyfarm.e && inGame && objectAlly(object.owner.sid)) {
            const damage = Cow.player.weapon.dmg * Cow.items.variants[Cow.player.weaponVariant].val;
            const damageAmount = damage * (Cow.player.weapon.sDmg || 1) * (Cow.player.skin?.id === 40 ? 3.3 : 1);
            myDmg = damageAmount;
            if (getRubyName(object.name) === settings.rubyfarm.r && distance < 150) {
              hitCount_ = Math.ceil(object.health / damageAmount);
              itemHp = object.health;
              itemInfo.started = true;
            };
          } else {
            itemInfo.started = false;
          };

          inTrap = false;

          if (object.name === 'pit trap') {
            if (distance < 50 && object.owner.sid !== myPlayer.sid && !(objectAlly(object.owner.sid))) {
              inTrap = true;
              // console.log(object.health)
              if (settings.autobreak.e && inGame) {
                const damage = Cow.player.weapon.dmg * Cow.items.variants[Cow.player.weaponVariant].val;
                const damageAmount = damage * (Cow.player.weapon.sDmg || 1) * (Cow.player.skin?.id === 40 ? 3.3 : 1);
                    chat('AutoBreaking...')
                    var index = 0;
                    let angle = Math.atan2(object.y - myPlayer.y, object.x - myPlayer.x);
                    if (inventory.primary === 8 && inventory.secondary !== 10) {
                      chat("KillSwitch MOD can't help you.");
                    };
                    index = inventory.secondary === 10 ? 1 : 0;
                    if (!stoptrapper) {
                      stoptrapper = true
                      selectWeapon(index);
                    };
                    if (Math.ceil(object.health / damageAmount) < 2) {
                      stoptrapper = false;
                    };

                    _hit(angle);

                    setTimeout(() => {
                      if (settings.autoheal.e && tmpHealth < 100) { place(inventory.food, angle) };
                    }, 10);
              };
            };
          };

          if (settings.inweaponrange.e && distance > weaponRange) return
          if (settings.whereurlooking.e && CowUtils.getAngleDist(angle, Cow.player.lookAngle) > Cow.config.gatherAngle) return

          if (settings.hitcounter.e) {
              const damage = Cow.player.weapon.dmg * Cow.items.variants[Cow.player.weaponVariant].val
              const damageAmount = damage * (Cow.player.weapon.sDmg || 1) * (Cow.player.skin?.id === 40 ? 3.3 : 1)
              const hits = Math.ceil(object.health / damageAmount)
              const offsetY = settings.circles_hp.e ? 2 : 22

              context.save()
              context.font = `18px Hammersmith, sans-serif`
              context.fillStyle = "#fff"
              context.textBaseline = "middle"
              context.textAlign = "center"
              context.lineWidth = 8
              context.lineJoin = "round"

              context.translate(object.renderX, object.renderY)
              context.strokeText(hits, 0, offsetY)
              context.fillText(hits, 0, offsetY)
              context.restore()
          };

          if (settings.circles_hp.e) {
              const endAngle = ((object.health / object.maxHealth) * 360) * (Math.PI / 180)
              const width = 14
              const scale = 22

              context.save()
              context.translate(object.renderX, object.renderY)
              context.rotate(object.dir ?? object.dir2)
              drawCircleBar("#3d3f42", width, scale, endAngle)
              drawCircleBar(settings.coloredstructures.e?objectAlly(object.owner.sid) ? 'lime':'red':'blue', width / 2.5, scale, endAngle)
              context.restore()

              return
          };

          if (settings.healthbars.e || settings.circles_hp.e) {

          const { healthBarWidth, healthBarPad } = window.config
          const width = healthBarWidth / 2 - healthBarPad / 2
          const height = 17
          const radius = 8

          context.save()
          context.translate(object.renderX, object.renderY)

          context.fillStyle = "#3d3f42"
          context.roundRect(-width - healthBarPad, -height / 2, 2 * width + 2 * healthBarPad, height, radius)
          context.fill()

          context.fillStyle = settings.coloredstructures.e?objectAlly(object.owner.sid) ? 'lime':'red':'blue'
          context.roundRect(-width, -height / 2 + healthBarPad, 2 * width * (object.health / object.maxHealth), height - 2 * healthBarPad, radius - 1)
          context.fill()
          context.restore()
          };
      });
  });
})();

const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",
 
    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}
 
let originalSend = WebSocket.prototype.send;
 
WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));
 
        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }
 
        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});