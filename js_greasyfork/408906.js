// ==UserScript==
// @name         IxaTraining
// @description  戦国IXA用ツール 一括兵士訓練
// @version      24.2.0.2
// @namespace    hoge
// @author       nameless
// @include      https://*.sengokuixa.jp/*
// @exclude      https://sengokuixa.jp/*
// @exclude      http://h.sengokuixa.jp/*
// @exclude      https://m.sengokuixa.jp/*
// @exclude      https://*.sengokuixa.jp/world/*
// @exclude      https://*.sengokuixa.jp/false/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408906/IxaTraining.user.js
// @updateURL https://update.greasyfork.org/scripts/408906/IxaTraining.meta.js
// ==/UserScript==

// https://github.com/metameta/sengokuixa-meta
// meta【一括兵士訓練】上記を参考にしました

(function () {

// IxaTraining
  function IxaTraining($) {
    console.debug('Load... IxaTraining');
    'use strict';

    // ■ プロトタイプ {
    var XRWstext = function (xhr) {
      return xhr.setRequestHeader('X-Requested-With', 'statusText');
    };

    // 位階効果の市場レート補正値
    var executive_market_rate = 0;

    // . String.prototype
    $.extend(String.prototype, {

      // .. toInt
      toInt: function () {
        return parseInt(this.replace(/,/g, ''), 10);
      },

      // .. toFloat
      toFloat: function () {
        return parseFloat(this.replace(/,/g, ''));
      },

      // .. repeat
      repeat: function (num) {
        var str = this,
          result = '';
        for (; num > 0; num >>>= 1, str += str) {
          if (num & 1) {
            result += str;
          }
        }
        return result;
      },

      // .. getTime - yyyy-mm-dd hh:mi:ss
      getTime: function () {
        if (!/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(this)) {
          throw new Error('Invalid string');
        }
        var date = this.replace(/-/g, '/');
        return ~~(new Date(date).getTime() / 1000);
      },

      // ..String 'hh:mm:ss' --> Number ss
      toSecond: function () {
        var array = this.match(/\d+/g).map(function (v, i) {
          return v * (i === 0 ? 3600 : i === 1 ? 60 : 1);
        });
        return array.reduce(function (a, b) {
          return a + b;
        });
      }
    });

    // . Number.prototype
    $.extend(Number.prototype, {

      // .. toInt
      toInt: function () {
        return this;
      },

      // .. toFloat
      toFloat: function () {
        return this;
      },

      // .. toRound
      toRound: function (decimal) {
        decimal = (decimal === undefined) ? 0 : decimal;
        var num = Math.pow(10, decimal);
        return Math.round(this * num) / num;
      },

      // .. toFloor
      toFloor: function (decimal) {
        decimal = (decimal === undefined) ? 0 : decimal;
        var num = Math.pow(10, decimal);
        return Math.floor(this * num) / num;
      },

      // .. toFormatNumber - 9,999,999
      toFormatNumber: function (decimal, replaceNaN) {
        decimal = (decimal === undefined) ? 0 : decimal;
        if (isNaN(this)) {
          return replaceNaN || '';
        }
        var num = this.toFloor(decimal),
          result = num.toString();
        while (result != (result = result.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
        if (decimal > 0 && num % 1 === 0) {
          result += '.' + '0'.repeat(decimal);
        }
        return result;
      },

      // .. toFormatDate - 0000/00/00 00:00:00
      toFormatDate: function (format) {
        var date = new Date(this * 1000);
        return date.toFormatDate(format);
      },

      // .. toFormatTime - 00:00:00
      toFormatTime: function (format) {
        format = format || 'hh:mi:ss';
        var h, m, s;
        if (this <= 0) {
          h = m = s = 0;
        } else {
          h = Math.floor(this / 3600);
          m = Math.floor((this - (h * 3600)) / 60);
          s = Math.floor(this - (h * 3600) - (m * 60));
        }
        if (h >= 100) {
          format = format.replace('hh', h);
        } else {
          format = format.replace('hh', ('00' + h).substr(-2));
        }
        format = format.replace('mi', ('00' + m).substr(-2));
        format = format.replace('ss', ('00' + s).substr(-2));
        return format;
      }
    });

    // . Date.prototype
    $.extend(Date.prototype, {

      // .. toFormatDate - 0000/00/00 00:00:00
      toFormatDate: function (format) {
        format = format || 'yyyy/mm/dd hh:mi:ss';
        format = format.replace('yyyy', this.getFullYear());
        format = format.replace('mm', this.getMonth() + 1);
        format = format.replace('dd', this.getDate());
        format = format.replace('hh', ('00' + this.getHours()).substr(-2));
        format = format.replace('mi', ('00' + this.getMinutes()).substr(-2));
        format = format.replace('ss', ('00' + this.getSeconds()).substr(-2));
        return format;
      }
    });

    // } プロトタイプ

    // . Array.prototype
    $.extend(Array.prototype, {

      // .. unique
      unique: function () {
        var result = [],
          temp = {};
        for (var i = 0, len = this.length; i < len; i++) {
          if (!temp[this[i]]) {
            temp[this[i]] = true;
            result.push(this[i]);
          }
        }
        return result;
      },

      // .. reduce
      reduce: function reduce(accumulator) {
        if (!this) {
          throw new TypeError("Object is null or undefined");
        }
        var i = 0,
          l = this.length >> 0,
          curr;
        if (typeof (accumulator) !== 'function') {

          // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
          throw new TypeError("First argument is not callable");
        }

        if (arguments.length < 2) {
          if (l === 0) {
            throw new TypeError("Array length is 0 and no second argument");
          }
          curr = this[0];
          i = 1; // start accumulating at the second element
        } else {
          curr = arguments[1];
        }

        while (i < l) {
          if (i in this) {
            curr = accumulator.call(undefined, curr, this[i], i, this);
          }
          ++i;
        }
        return curr;
      }
    });

    // JSON Plugin
    var toJSON = function (o) { var type = typeof (o); if (o === null) { return 'null'; } if (type == 'undefined') { return undefined; } if (type == 'number' || type == 'boolean') { return o + ''; } if (type == 'string') { return quoteString(o); } if (type == 'object') { if (o.constructor === Date) { var month = o.getUTCMonth() + 1; if (month < 10) { month = '0' + month; } var day = o.getUTCDate(); if (day < 10) { day = '0' + day; } var year = o.getUTCFullYear(); var hours = o.getUTCHours(); if (hours < 10) { hours = '0' + hours; } var minutes = o.getUTCMinutes(); if (minutes < 10) { minutes = '0' + minutes; } var seconds = o.getUTCSeconds(); if (seconds < 10) { seconds = '0' + seconds; } var milli = o.getUTCMilliseconds(); if (milli < 100) { milli = '0' + milli; } if (milli < 10) { milli = '0' + milli; } return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"'; } if (o.constructor === Array) { var ret = []; for (var i = 0, len = o.length; i < len; i++) { ret.push(toJSON(o[i]) || 'null'); } return '[' + ret.join(',') + ']'; } var pairs = []; for (var k in o) { var name; type = typeof k; if (type == "number") { name = '"' + k + '"'; } else if (type == "string") { name = quoteString(k); } else { continue; } if (typeof o[k] == "function") { continue; } var val = toJSON(o[k]); pairs.push(name + ":" + val); } return '{' + pairs.join(', ') + '}'; } }, quoteString = function (s) { var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g; var _meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }; if (s.match(_escapeable)) { return '"' + s.replace(_escapeable, function (a) { var c = _meta[a]; if (typeof c === 'string') { return c; } c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16); }) + '"'; } return '"' + s + '"'; };

    // 通常・影城主のフラグ
    var ownerMode = (function () {
      return document.body.className.indexOf("current_owner_sub") >= 0 ? '1' : '0';
    })();

    // ■ metaStorage {
    // ixa内ではArrayがJSON.stringify()で正しく文字列化されないのでtoJSON()で文字列化
    var metaStorage = (function () {
      var storageList = {},
        storagePrefix = ownerMode == '1' ? 'zs_IM.' : 'IM.',
        eventListener = {},
        propNames = 'expires'.split(' ');

      function metaStorage(name) {
        var storageName = storagePrefix + name,
          storage, storageArea;
        storageArea = metaStorage.keys[storageName];
        if (!storageArea) {
          throw new Error('「' + storageName + '」このストレージ名は存在しません。');
        }
        storage = storageList[storageName];
        if (storage === undefined) {
          storage = new Storage(storageArea, storageName);
          loadData(storage);
          storageList[storageName] = storage;
        }
        return storage;
      }

      $.extend(metaStorage, {
        keys: {},
        registerStorageName: function (storageName) {
          storageName = storagePrefix + storageName;
          metaStorage.keys[storageName] = 'local';
        },
        registerSessionName: function (storageName) {
          storageName = storagePrefix + storageName;
          metaStorage.keys[storageName] = 'session';
        },
        clearAll: function () {
          $.each(metaStorage.keys, function (key, value) {
            localStorage.removeItem(key);
          });
          storageList = {};
        },
        import: function (string) {
          var importData = JSON.parse(string),
            keys = metaStorage.keys;
          this.clearAll();
          $.each(importData, function (key, value) {
            if (keys[key]) {
              localStorage.setItem(key, importData[key]);
            }
          });
        },
        export: function () {
          var exportData = {};
          $.each(metaStorage.keys, function (key, value) {
            var stringData = localStorage.getItem(key);
            if (stringData) {
              exportData[value] = stringData;
            }
          });

          // return JSON.stringify(exportData);
          return toJSON(exportData);
        },
        change: function (name, callback) {
          var storageName = storagePrefix + name;
          $(eventListener).on(storageName, callback);
        }
      });

      function Storage(storageArea, storageName) {
        this.storageArea = storageArea;
        this.storageName = storageName;
        this.data = {};
        return this;
      }

      $.extend(Storage.prototype, {
        clear: function () {
          this.data = {};
          clearData(this);
        },
        get: function (key) {
          return this.data[key];
        },
        set: function (key, value) {
          this.data[key] = value;
          saveData(this);
        },
        remove: function (key) {
          delete this.data[key];
          saveData(this);
        },
        begin: function () {
          this.transaction = true;
          this.tranData = $.extend({}, this.data);
        },
        commit: function () {
          var trans = this.transaction;
          delete this.transaction;
          delete this.tranData;
          if (trans) {
            saveData(this);
          }
        },
        rollback: function () {
          delete this.transaction;
          this.data = this.tranData;
          delete this.tranData;
        },
        toJSON: function () {
          return toJSON(this.data);
        }
      });

      function loadData(obj) {
        obj.data = load(obj.storageArea, obj.storageName);
      }

      function saveData(obj) {
        if (obj.transaction) {
          return;
        }
        save(obj.storageArea, obj.storageName, obj.data);
      }

      function clearData(obj) {
        var storageArea;
        if (obj.transaction) {
          return;
        }
        if (obj.storageArea == 'local') {
          storageArea = localStorage;
        } else if (obj.storageArea == 'session') {
          storageArea = sessionStorage;
        }
        storageArea.removeItem(obj.storageName);
      }

      function load(storageArea, storageName) {
        var parseData = {},
          stringData, storage;
        if (storageArea == 'local') {
          storage = localStorage;
        } else if (storageArea == 'session') {
          storage = sessionStorage;
        }
        stringData = storage.getItem(storageName);
        if (stringData) {
          try {
            parseData = JSON.parse(stringData);
          } catch (e) { }
        }
        return parseData;
      }

      function save(storageArea, storageName, data) {

        // var stringData = JSON.stringify(data),
        var stringData = toJSON(data),
          storage;
        if (storageArea == 'local') {
          storage = localStorage;
        } else if (storageArea == 'session') {
          storage = sessionStorage;
        }
        if ($.isEmptyObject(data)) {
          storage.removeItem(storageName);
        } else {
          storage.setItem(storageName, stringData);
        }
      }

      $(window).on('storage', function (event) {
        var storageName = event.originalEvent.key,
          storage;
        if (!metaStorage.keys[storageName]) {
          return;
        }
        storage = storageList[storageName];
        if (storage !== undefined) {
          loadData(storage);
        }
        $(eventListener).trigger(storageName, event);
      });

      return metaStorage;
    })();

    'ENVIRONMENT VILLAGE FACILITY TRAINING'.split(' ').forEach(function (value) {
      metaStorage.registerStorageName(value);
    });

    // } metaStorage

    // 通常・影城主 Storageデータの選択
    var selectFacilitys = function () {
      if (ownerMode == '1') {
        return localStorage.zs_ixamoko_facilitys ? JSON.parse(localStorage.zs_ixamoko_facilitys) : metaStorage('FACILITY').data;
      } else {
        return localStorage.ixamoko_facilitys ? JSON.parse(localStorage.ixamoko_facilitys) : metaStorage('FACILITY').data;
      }
    };

    // ■ Env {
    var Env = (function () {
      var ixamoko_login_data = localStorage.ixamoko_login_data,
        login_data = ixamoko_login_data ? JSON.parse(ixamoko_login_data) : {};
      var storage = metaStorage('ENVIRONMENT'),
        $server = $('#server_time'),
        $war = $('.situationWorldTable'),
        world = (location.hostname.slice(0, 4).match(/[ -~]+/) || [])[0],
        start = (document.cookie.match(new RegExp('im_st=(\\d+)')) || [])[1] || login_data.time,
        login = false,
        season, newseason, chapter, war, server_time, local_time, timeDiff, endtime;

      // storageから取得
      endtime = storage.get('endtime');
      season = storage.get('season');
      chapter = storage.get('chapter');
      if ($server.length === 0) {
        timeDiff = 0;
      } else {

        // 鯖との時差取得
        server_time = new Date($server.text().replace(/-/g, '/')).getTime();
        local_time = new Date().getTime();
        timeDiff = (server_time - local_time);
      }
      if (world && start) {
        login = true;

        // moko設定から取得
        newseason = login_data.season;
        chapter = login_data.chapter;

        // 鯖との時差も含めてタイムアウト時間を設定（カウントダウンで鯖時間を使用する為）
        endtime = start.toInt() + (3 * 60 * 60) + Math.floor(timeDiff / 1000);
        newseason = newseason.toInt();
        chapter = chapter.toInt();
        storage.begin();
        storage.set('endtime', endtime);
        storage.set('season', newseason);
        storage.set('chapter', chapter);
        storage.commit();
        document.cookie = world + '_st=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
        document.cookie = world + '_s=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
        document.cookie = world + '_c=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
        if (newseason !== season) {

          // 期が変わった場合
          'VILLAGE FACILITY FACILITY TRAINING'.split(' ').forEach(function (value) {
            metaStorage(value).clear();
          });
          season = newseason;
        }
      }
      if ($war.find('IMG[src$="icon_warnow_new.png"]').length > 0) {
        war = 2;
      } else if ($war.find('IMG[src$="icon_warnow.png"]').length > 0) {
        war = 1;
      } else {
        war = 0;
      }
      if (login && war === 0) {
        // metaStorage('USER_FALL').clear();
        // metaStorage('USER_INFO').clear();
      }
      return {

        // . loginProcess
        loginProcess: login,

        // . world - 鯖
        world: world,

        // . season - 期
        season: season,

        // . chapter - 章
        chapter: chapter,

        // . war - 合戦 0:無し 1:通常合戦 2:新合戦
        war: war,

        // . timeDiff - 鯖との時差
        timeDiff: timeDiff,

        // . path - アクセスパス
        path: location.pathname.match(/[^\/]+(?=(\/|\.))/g) || [],

        // . externalFilePath - 外部ファイルへのパス
        externalFilePath: (function () {
          var href = $('LINK[type="image/x-icon"][href^="https://cache"]').attr('href') || '';
          href = href.match(/^.+(?=\/)/) || '';
          return href;
        })(),

        // . loginState - ログイン状態
        loginState: (function () {
          var path = location.pathname;
          if ($('#lordName').length == 1) {
            return 1;
          }
          if (path == '/world/select_world.php') {
            return 0;
          }
          if (path == '/user/first_login.php') {
            return 0;
          }
          if (path == '/false/login_sessionout.php') {
            return -1;
          }
          if (path == '/maintenance/') {
            return -1;
          }
          return -1;
        })(),

        // . endtime - タイムアウト期限
        endtime: endtime,

        // . ajax - 一部のajax通信の判定に使用
        ajax: false
      };
    })();

    // } Env

    // ■ BaseList {
    var BaseList = (function () {

      // . base
      function base(country) {
        var list = [],
          colors = MiniMap.colors.type1;
        $('#imi_basename .imc_basename LI > *:first-child').each(function () {
          var name = $(this).text().trim(),
            village = Util.getVillageByName(name);
          if (!village) {
            return;
          }
          if (village.country != country) {
            return;
          }
          if (colors[village.type]) {
            list.push({
              type: 0,
              id: village.id,
              name: name,
              x: village.x,
              y: village.y,
              color: colors[village.type]
            });
          }
        });
        return list;
      }

      // . home
      function home() {
        var list = [];
        $('.sideBoxInner.basename LI > *:first-child').each(function () {
          var name = $(this).text().trim(),
            village = Util.getVillageByName(name);
          if (!village) {
            return;
          }
          list.push({
            type: 0,
            id: village.id,
            name: name,
            x: village.x,
            y: village.y,
            color: '#0f0'
          });
        });
        return list;
      }

      // . away
      function away() {
        var list = [];
        $('#imi_basename .imc_basename.imc_away LI > *:first-child').each(function () {
          var name = $(this).text().trim(),
            village = Util.getVillageByName(name);
          if (!village) {
            return;
          }
          list.push({
            type: 0,
            id: village.id,
            name: name,
            x: village.x,
            y: village.y,
            color: '#0f0'
          });
        });
        return list;
      }

      // . return
      return {
        all: function (country) {
          var list = [];
          list = $.merge(list, base(country));
          return list;
        },
        home: home,
        home_away: function () {
          var list = [];
          list = $.merge(list, home());
          list = $.merge(list, away());
          return list;
        }
      };
    })();

    // BaseList }

    // ■ Soldier {
    var Soldier = (function () {
      var data_14s = {

        // 槍
        '足軽': { type: 321, training: [82], order: 1 },
        '長槍足軽': { type: 322, training: [97], order: 2 },
        '武士': { type: 323, training: [112], order: 3 },

        // 弓
        '弓足軽': { type: 325, training: [87], order: 1 },
        '長弓兵': { type: 326, training: [102], order: 2 },
        '弓騎馬': { type: 327, training: [117], order: 3 },

        // 馬
        '騎馬兵': { type: 329, training: [92], order: 1 },
        '精鋭騎馬': { type: 330, training: [107], order: 2 },
        '赤備え': { type: 331, training: [122], order: 3 },

        // 器
        '破城鎚': { type: 333, training: [95], order: 1 },
        '攻城櫓': { type: 334, training: [109], order: 2 },
        '穴太衆': { type: 346, training: [200], order: 3 },
        '大筒兵': { type: 335, training: [195], order: 4 },
        '鉄砲足軽': { type: 336, training: [170], order: 5 },
        '騎馬鉄砲': { type: 337, training: [190], order: 6 },
        '焙烙火矢': { type: 345, training: [180], order: 7 }
      };
      var data_15s = {

        // 槍
        '足軽': { type: 321, training: [82], order: 1 },
        '長槍足軽': { type: 322, training: [97], order: 2 },
        '武士': { type: 323, training: [112], order: 3 },

        // 弓
        '弓足軽': { type: 325, training: [87], order: 1 },
        '長弓兵': { type: 326, training: [102], order: 2 },
        '弓騎馬': { type: 327, training: [117], order: 3 },

        // 馬
        '騎馬兵': { type: 329, training: [92], order: 1 },
        '精鋭騎馬': { type: 330, training: [107], order: 2 },
        '赤備え': { type: 331, training: [122], order: 3 },

        // 器
        '破城鎚': { type: 333, training: [95], order: 1 },
        '攻城櫓': { type: 334, training: [105], order: 2 },
        '穴太衆': { type: 346, training: [120], order: 3 },
        '大筒兵': { type: 335, training: [180], order: 4 },
        '鉄砲足軽': { type: 336, training: [170], order: 5 },
        '騎馬鉄砲': { type: 337, training: [190], order: 6 },
        '焙烙火矢': { type: 345, training: [180], order: 7 }
      };

      var data;
      if (Env.chapter >= 15) {
        data = data_15s;
      } else {
        data = data_14s;
      }

      function crArray(arr) {
        for (var i = 1; i < 15; i++) {
          arr[i] = 0;
        }
        return arr;
      }

      for (var key in data) {
        data[key].training = crArray(data[key].training);
      }

      function Soldier() {
        return $.extend({}, data);
      }

      $.extend(Soldier, {
        nameKeys: {},
        typeKeys: {},
        dataKeys: {},

        // . getByName
        getByName: function (name) {
          name = (name == '鉄砲騎馬') ? '騎馬鉄砲' : name;
          return data[name];
        },

        // . getByType
        getByType: function (type) {
          var name = Soldier.typeKeys[type];
          return this.getByName(name);
        },

        // . getType
        getType: function (name) {
          return Soldier.nameKeys[name] || null;
        }
      });

      $.each(data, function (key, value) {
        value.name = key;
        if (value.type) {
          Soldier.nameKeys[key] = value.type;
          Soldier.typeKeys[value.type] = key;
          Soldier.dataKeys[key] = value;
        }
      });
      return Soldier;
    })();

    // Soldier }

    // ■ Util {
    var Util = {

      // . getLocalTime
      getLocalTime: function () {
        return ~~(new Date().getTime() / 1000);
      },

      // . getServerTime
      getServerTime: function () {
        return ~~((new Date().getTime() + Env.timeDiff) / 1000);
      },

      // . getVillageByName
      getVillageByName: function (name) {
        var list, i, len;
        list = metaStorage('VILLAGE').get('list') || [];
        for (i = 0, len = list.length; i < len; i++) {
          if (list[i].name != name) {
            continue;
          }
          return list[i];
        }

        // キャッシュで見つからない場合は最新情報取得
        list = Util.getVillageList();
        for (i = 0, len = list.length; i < len; i++) {
          if (list[i].name != name) {
            continue;
          }
          return list[i];
        }
        return null;
      },

      // . getVillageById
      getVillageById: function (id) {
        var list, i, len;
        list = metaStorage('VILLAGE').get('list') || [];
        for (i = 0, len = list.length; i < len; i++) {
          if (list[i].id != id) {
            continue;
          }
          return list[i];
        }

        // キャッシュで見つからない場合は最新情報取得
        list = Util.getVillageList();
        for (i = 0, len = list.length; i < len; i++) {
          if (list[i].id != id) {
            continue;
          }
          return list[i];
        }
        return null;
      },

      // . getVillageList
      getVillageList: function () {
        var list = [];
        var $li = $('#sideboxBottom').find('div.my_capital li, div.my_country li');
        $li.each(function (index, el) {
          list.push({
            id: $(this).data('village_id'),
            name: $(this).children().not(".sidebox_badge_icon").eq(0).text(),
            x: $(this).data('village_x'),
            y: $(this).data('village_y'),
            country: $(this).data('village_c')
          });
        });
        metaStorage('VILLAGE').set('list', list);
        return list;
      },

      // getCaptalVid
      getCapital: function(){
        const vid = $('#sideboxBottom').find('div.my_capital').find('li:first').attr('data-village_id');
        return Util.getVillageById(vid);
      },

      // . getVillageCurrent
      getVillageCurrent: function () {
        var name = $('.sideBoxInner.basename .on > SPAN').text();
        return Util.getVillageByName(name);
      },

      // . getVillageChangeUrl
      getVillageChangeUrl: function (village_id, returnUrl) {
        return '/village_change.php?village_id=' + village_id + '&from=menu&page=' + encodeURIComponent(returnUrl);
      },

      // . getPoolSoldiers
      getPoolSoldiers: function () {
        var data = {};
        var setlist_html = $.ajax({
          type: 'post',
          url: '/facility/set_unit_list.php',
          async: false,
          beforeSend: XRWstext
        }).responseText;

        var type_training_soldier = 0;
        if($(setlist_html).find('#unit_count_347').length > 0){
          type_training_soldier += $(setlist_html).find('#unit_count_347').text().toInt();
        }
        if($(setlist_html).find('#unit_count_348').length > 0){
          type_training_soldier += $(setlist_html).find('#unit_count_348').text().toInt();
        }
        if($(setlist_html).find('#unit_count_349').length > 0){
          type_training_soldier += $(setlist_html).find('#unit_count_349').text().toInt();
        }

        var html = $.ajax({
          type: 'get',
          url: '/facility/unit_list.php',
          async: false,
          beforeSend: XRWstext
        }).responseText;

        var $html = $(html),
          $table, $cell, text;
        text = $html.find('.ig_solder_commentarea').text().split('/')[1].trim();
        data.capacity = text.toInt();
        data.soldier = $html.find('#all_pool_unit_cnt').text().toInt() - type_training_soldier;
        data.pool = {};
        data.training = [];
        $table = $html.find('.ig_fight_dotbox');
        $table.first().find('TH').each(function () {
          var $this = $(this),
            type = Soldier.getType($this.text()),
            pool = $this.next().text().toInt();
          data.pool[type] = pool;
        });
        var $training_table = $html.find('h3:contains("訓練中の兵士")').closest('div.ig_fight_statusarea').find('.ig_fight_dotbox');
        $training_table.find('.table_fightlist2').each(function () {
          var $tr = $(this).find('TR'),
            name = $tr.first().find('A').text(),
            village = Util.getVillageByName(name);
          $tr.slice(1).each(function () {
            var $td = $(this).find('TD'),
              type = Soldier.getType($td.eq(1).find('IMG').attr('alt')),
              num = $td.eq(2).text().toInt(),
              finish = $td.eq(4).text().getTime();
            data.training.push({
              id: village.id,
              type: type,
              num: num,
              finish: finish
            });
          });
        });
        return data;
      },

      // . getConsumption
      getConsumption: function (materials, number) {
        var modRate = 1,
          idx;
        if (number >= 5) {
          idx = Math.floor(number / 10);
          if (idx > 10) {
            idx = 10;
          }
          modRate = [0.98, 0.96, 0.94, 0.94, 0.94, 0.92, 0.92, 0.92, 0.92, 0.92, 0.90][idx];
        }
        return materials.map(function (value) {
          return (value * modRate).toRound(0) * number;
        });
      },

      // . getFacility
      getFacility: function (name) {
        var data = selectFacilitys();
        var list = [];
        (function () {
          var facility_list, village, facility;
          for (var vid in data) {
            facility_list = data[vid];
            village = Util.getVillageById(vid);
            if (!village) {
              continue;
            }
            if (facility_list[name] && facility_list[name].lv >= 1) {
              facility = $.extend({
                id: vid,
                name: village.name
              }, facility_list[name]);
              list.push(facility);
            }
          }
        })();
        return list;
      },

      // . getMarket
      getMarket: function () {
        var rates = [0, 0.40, 0.43, 0.46, 0.49, 0.52, 0.55, 0.60, 0.65, 0.70, 0.75],
          list = Util.getFacility('市');
        if (list.length === 0) {
          return null;
        }
        list.sort(function (a, b) {
          return (b.lv > a.lv);
        });
        list[0].rate = rates[list[0].lv] + executive_market_rate;
        return list[0];
      },

      // . getResource
      getResource: function () {
        return [
          $('#wood').text().toInt(),
          $('#stone').text().toInt(),
          $('#iron').text().toInt(),
          $('#rice').text().toInt()
        ];
      },

      // . checkExchange
      checkExchange: function (resource, requirements, rate) {
        var shortage = 0,
          surplus = 0;
        if (isNaN(rate)) {
          rate = (Util.getMarket() || {
            rate: 0
          }).rate;
        }
        for (var i = 0, len = resource.length; i < len; i++) {
          if (resource[i] >= requirements[i]) {
            surplus += resource[i] - requirements[i];
          } else {
            shortage += requirements[i] - resource[i];
          }
        }
        return (shortage === 0) ? 2 : (surplus * rate >= shortage) ? 1 : 0;
      },

      // . getExchangePlan
      getExchangePlan: function (resource, requirements, rate, type) {
        var surplus = [],
          shortage = [],
          totalSurplus, totalShortage;
        '木 綿 鉄 糧'.split(' ').forEach(function (type, idx) {
          var value = resource[idx] - requirements[idx];
          if (value > 0) {
            surplus.push({
              type: type,
              value: value
            });
          } else if (value < 0) {
            shortage.push({
              type: type,
              value: -value
            });
          }
        });
        totalSurplus = surplus.reduce(function (prev, curr) {
          return prev += curr.value;
        }, 0);
        totalShortage = shortage.reduce(function (prev, curr) {
          return prev += curr.value;
        }, 0);
        totalShortage = Math.ceil(totalShortage / rate);
        if (totalSurplus < totalShortage) {
          return [];
        }
        if (type == 'A') {
          var modify = surplus.sort(function (a, b) {
            return (b.value > a.value);
          })
            .reduce(function (prev, curr, idx) {
              if (curr.value > prev.avg) {
                prev.value = prev.value + curr.value;
                prev.avg = Math.floor((prev.value - totalShortage) / (idx + 1));
              }
              return prev;
            }, {
              value: 0,
              avg: 0
            });
          totalSurplus = 0;
          surplus = surplus.map(function (elem) {
            elem.value -= modify.avg;
            if (elem.value < 0) {
              elem.value = 0;
            }
            totalSurplus += elem.value;
            return elem;
          });
        }
        surplus = surplus.map(function (elem) {
          elem.ratio = elem.value / totalSurplus;
          return elem;
        });
        var plans = [];
        shortage.forEach(function (short) {
          surplus.forEach(function (plus) {
            var value = Math.ceil(short.value * plus.ratio),
              fixed;
            if (value === 0) {
              return;
            }
            fixed = Math.floor((value - 1) / rate) + 1;
            value = Math.floor(value / rate);
            if (Math.ceil(value * rate) == Math.ceil(fixed * rate)) {
              value = fixed;
            }
            if (value < 10) {
              value = 10;
            }
            plans.push({
              from: plus.type,
              to: short.type,
              value: value,
              receive: Math.ceil(value * rate)
            });
          });
        });
        return plans;
      },

      // . getValidSoldiers
      getValidSoldiers: function (facility) {
        var url = Util.getVillageChangeUrl(facility.id, '/facility/facility.php?x=' + facility.x + '&y=' + facility.y),
          soldiers = [];
        var html = $.ajax({
          type: 'get',
          url: url,
          async: false,
          beforeSend: XRWstext
        }).responseText;
        var $html = $(html),
          idx = 0;
        if ($html.find('DIV[id^="TrainingBlock"]').length) {
          idx = 1;
        }
        $html.find('.ig_tilesection_innermid').each(function () {
          var $this = $(this),
            name, materials, soldata, $div, str;
          $div = $this.closest('DIV[id^="TrainingBlock"]');
          str = $div.find('DIV.ig_decksection_top').text();
          if (str == '高速訓練' || str == '上位訓練') {
            return;
          }
          if ($this.find('H3').length === 0) {
            return;
          }
          if (($this.find('H3:contains("施設")').length > 0)) {
            return;
          }
          name = $this.find('H3').text().match(/\[(.*)\]/)[1];
          materials = [
            $this.find('.icon_wood').text().match(/(\d+)/)[1].toInt(),
            $this.find('.icon_cotton').text().match(/(\d+)/)[1].toInt(),
            $this.find('.icon_iron').text().match(/(\d+)/)[1].toInt(),
            $this.find('.icon_food').text().match(/(\d+)/)[1].toInt()
          ];
          soldata = Soldier.getByName(name);
          var image = $this.find('.ig_tilesection_iconarea IMG').attr('src');
          soldiers.push({
            type: soldata.type,
            name: name,
            materials: materials,
            training: soldata.training,
            image: image,
            order: soldata.order
          });
        });

        return soldiers.reverse();
      },

      // . getMaxTraining
      getMaxTraining: function (resource, requirements, rate, max, min) {
        var c, materials, check, result = min;
        while (min <= max) {
          c = Math.floor((max + min) / 2);
          materials = Util.getConsumption(requirements, c);
          check = Util.checkExchange(resource, materials, rate);
          if (check === 0) {
            max = c - 1;
          } else {
            result = c;
            min = c + 1;
          }
        }
        return result;
      },

      // . divide
      divide: function (list, soldata, solnum) {
        var facilities = [],
          maxidx = 0,
          total = 0,
          soltotal = 0;
        (function () {
          var facility;
          for (var i = 0, len = list.length; i < len; i++) {
            facility = $.extend({
              type: soldata.type
            }, list[i]);
            facility.rate = soldata.training[0] / soldata.training[facility.lv - 1];
            total += facility.rate;
            facilities.push(facility);
          }
        })();
        if (facilities.length == 1) {

          // 施設が１つの場合、分配しない
          facilities[0].solnum = solnum;
        } else {
          (function () {
            var facility;
            for (var i = 0, len = facilities.length; i < len; i++) {
              facility = facilities[i];
              facility.rate = facility.rate / total;
              facility.solnum = Math.floor(solnum * facility.rate);
              soltotal += facility.solnum;
              if (facility.lv > facilities[maxidx].lv) {
                maxidx = i;
              }
            }
          })();
          if (soltotal != solnum) {

            // 小数点以下を切り捨てているので、不足分はLVが一番高い施設で調整
            facilities[maxidx].solnum += (solnum - soltotal);
          }
        }
        (function () {
          var facility;
          for (var i = 0, len = facilities.length; i < len; i++) {
            facility = facilities[i];
            facility.materials = Util.getConsumption(soldata.materials, facility.solnum);
            facility.trainingtime = facility.solnum * soldata.training[facility.lv - 1];
          }
        })();
        return facilities;
      },

      // . divide2
      divide2: function (list, soldata, time) {
        var facilities = [],
          total = 0;
        (function () {
          var facility;
          for (var i = 0, len = list.length; i < len; i++) {
            facility = $.extend({
              type: soldata.type
            }, list[i]);
            facility.solnum = Math.floor(time / soldata.training[facility.lv - 1]);
            facility.trainingtime = facility.solnum * soldata.training[facility.lv - 1];
            facility.materials = Util.getConsumption(soldata.materials, facility.solnum);
            total += facility.solnum;
            facilities.push(facility);
          }
        })();
        facilities.totalnum = total;
        return facilities;
      },

      // . wait
      wait: function (ms) {
        var dfd = $.Deferred();
        window.setTimeout(function () {
          dfd.resolve();
        }, ms);
        return dfd;
      }
    };

    // Util }

    // ■ Display {
    var Display = (function () {
      var $sysmessage;
      function Dialog(options) {
        var $overlay = $('<div id="imi_overlay"><div class="imc_overlay" /><div id="imi_dialog_container" /></div>'),
          $container = $overlay.find('#imi_dialog_container'),
          self = this,
          $body, $footer;
        options = $.extend({
          width: 500,
          height: 200,
          top: '25%'
        }, options);
        $overlay.appendTo('BODY');
        if (options.title) {
          $container.append('<div class="imc_dialog_header">' + options.title + '</div>');
        }
        $body = $('<div class="imc_dialog_body" />');
        $container.append($body);
        if (options.content) {
          $body.append(options.content);
        }
        if (options.buttons) {
          $footer = $('<div class="imc_dialog_footer" />');
          $.each(options.buttons, function (key, callback) {
            $footer.append($('<button/>').text(key).click(function () {
              if (!$(this).attr('disabled')) {
                callback.call(self);
              }
            }));
          });
          $container.append($footer);
          this.buttons = $footer.find('BUTTON');
        }
        $container.css('top', options.top);
        $container.css('width', options.width);
        $body.css('height', options.height);
        this.append = function () {
          $body.append(arguments[0]);
        };
        this.message = function (text) {
          var $div = $('<div class="imc_message">' + text + '</div>');
          $body.append($div);
          $body.scrollTop($body[0].scrollHeight);
          return this;
        };
        this.close = function () {
          $overlay.remove();
        };
        return this;
      }

      function show(msg, sound, timeout, cssClass) {
        if (!$sysmessage) {
          $sysmessage = $('<div class="imc_dialog" />').appendTo(document.body);
        }
        var $span = $('<span/>').addClass('imc_dialog_content').addClass(cssClass).html(msg).appendTo(document.body);
        $span.width($span.outerWidth()).css('display', 'block').appendTo($sysmessage);
        timeout = timeout || 3000;
        window.setTimeout(function () {
          remove($span);
        }, timeout);
        if (sound && Data.sounds.info) {
          var audio = new Audio(Data.sounds.info);
          audio.volume = 0.6;
          audio.play();
        }
      }

      function remove($span) {
        $span.remove();
        if ($sysmessage.children().length === 0) {
          $sysmessage.remove();
          $sysmessage = null;
        }
      }

      // . return
      return {
        info: function (msg, sound, timeout) {
          show(msg, sound, timeout, 'imc_infomation');
        },
        alert: function (msg, sound, timeout) {
          sound = (sound === undefined) ? true : sound;
          show(msg, sound, timeout, 'imc_alert');
        },
        dialog: function (options) {
          return new Dialog(options);
        }
      };
    })();

    $.extend(Display, {

      // . dialogExchange
      dialogExchange: function (resource, requirements, currentVillage) {
        var market = Util.getMarket(),
          dfd = $.Deferred(),
          check, village, html, $html, dialog, plans;
        if (!market) {
          return dfd.reject();
        }
        village = Util.getVillageById(market.id);
        check = Util.checkExchange(resource, requirements, market.rate);
        console.log(market.rate);
        html = '' +
          '<div id="imi_exchange_dialog">' +
          '<table class="imc_table">' +
          '<tr>' +
          '<th width="50">市拠点</th><td width="150">' + village.name + '</td>' +
          '<th width="50">LV</th><td width="30">' + market.lv + '</td>' +
          '<th width="50">相場</th><td width="70">' + ((market.rate - executive_market_rate) * 100).toRound(0) + '% + ' + (executive_market_rate * 100).toRound(0) + '%</td>' +
          '</tr>' +
          '</table>' +
          '<br />' +
          '<table id="imi_ex_table" class="imc_table">' +
          '<tr><th></th>' +
          '<th><img src="' + Env.externalFilePath + '/img/common/ico_wood.gif' + '"></th>' +
          '<th><img src="' + Env.externalFilePath + '/img/common/ico_wool.gif' + '"></th>' +
          '<th><img src="' + Env.externalFilePath + '/img/common/ico_ingot.gif' + '"></th>' +
          '<th><img src="' + Env.externalFilePath + '/img/common/ico_grain.gif' + '"></th>' +
          '</tr>' +
          '<tr><th>現在資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr><th>必要資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr class="imc_sign"><th>過不足</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr class="imc_sign"><th>取引資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td colspan="5" style="padding: 1px;"></td></tr>' +
          '<tr><th>取引後資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr><th>必要資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td colspan="5" style="padding: 1px;"></td></tr>' +
          '<tr><th>消費後資源量</th><td></td><td></td><td></td><td></td></tr>' +
          '</table>' +
          '<br />' +
          '<table id="imi_ex_type" class="imc_table">' +
          '<tr><th rowspan="2" class="h100">変換タイプ</th><td class="imc_selected" data-type="A">タイプＡ</td><td>消費後資源量が平均的になるように取引資源量を決定</td></tr>' +
          '<tr><td data-type="B">タイプＢ</td><td>余剰資源量の割合に応じて取引資源量を決定</td></tr>' +
          '</table>' +
          '<br />' +
          '<div id="imi_exchange_message" />' +
          '</div>';

        $html = $(html)
          .on('metaupdate', function () {
            var $tr = $('#imi_ex_table').find('TR'),
              type = $(this).find('#imi_ex_type .imc_selected').data('type'),
              warehouse = $('#wood_max').text().toInt(),
              ex = [0, 0, 0, 0],
              button = true;
            plans = Util.getExchangePlan(resource, requirements, market.rate, type);
            plans.forEach(function (elem) {
              var idxTable = {
                '木': 0,
                '綿': 1,
                '鉄': 2,
                '糧': 3
              };
              ex[idxTable[elem.from]] -= elem.value;
              ex[idxTable[elem.to]] += elem.receive;
            });
            if (plans.length === 0 && check === 2) {
              $('#imi_exchange_message').text('取引の必要はありません');
              dialog.buttons.eq(0).text('処理続行');
            } else if (plans.length === 0 && check === 0) {
              $('#imi_exchange_message').text('資源が不足しています');
              button = false;
            }

            // 現在資源量
            $tr.eq(1).find('TD').each(function (idx) {
              $(this).text(resource[idx]);
            });

            // 必要資源量
            $tr.eq(2).find('TD').each(function (idx) {
              $(this).text(requirements[idx]);
            });

            // 過不足
            $tr.eq(3).find('TD').each(function (idx) {
              var $this = $(this),
                result = resource[idx] - requirements[idx];
              $this.text(result).removeClass('imc_surplus imc_shortage');
              if (result > 0) {
                $this.addClass('imc_surplus');
              }
              if (result < 0) {
                $this.addClass('imc_shortage');
              }
            });

            // 取引資源量
            $tr.eq(4).find('TD').each(function (idx) {
              var $this = $(this),
                result = ex[idx];
              $this.text(result).removeClass('imc_surplus imc_shortage');
              if (result > 0) {
                $this.addClass('imc_surplus');
              }
              if (result < 0) {
                $this.addClass('imc_shortage');
              }
            });

            // 取引後資源量
            $tr.eq(6).find('TD').each(function (idx) {
              var $this = $(this),
                result = resource[idx] + ex[idx];
              $this.text(result).removeClass('imc_over');
              if (result > warehouse) {
                $this.addClass('imc_over');
                $('#imi_exchange_message').text('取引後の資源量が蔵容量を超えています');
                button = false;
              }
            });

            // 必要資源量
            $tr.eq(7).find('TD').each(function (idx) {
              $(this).text(requirements[idx]);
            });

            // 消費後資源量
            $tr.eq(9).find('TD').each(function (idx) {
              var $this = $(this),
                result = resource[idx] + ex[idx] - requirements[idx];
              $this.text(result).removeClass('imc_surplus imc_shortage');
              if (result >= 0) {
                $this.addClass('imc_surplus');
              } else {
                $this.addClass('imc_shortage');
              }
            });
            dialog.buttons.eq(0).attr('disabled', !button);
          })
          .on('click', '#imi_ex_type TD', function () {
            $('#imi_ex_type').find('.imc_selected').removeClass('imc_selected');
            $(this).closest('TR').find('TD').first().addClass('imc_selected');
            $html.trigger('metaupdate');
          });

        dialog = Display.dialog({
          title: '市取引',
          width: 500,
          height: 340,
          top: 50,
          content: $html,
          buttons: {
            '取引を実行し処理続行': function () {
              var self = this,
                materialid = {
                  '木': 101,
                  '綿': 102,
                  '鉄': 103,
                  '糧': 104
                },
                ol;
              if (plans.length === 0 && check === 2) {
                dfd.resolve();
                self.close();
                return;
              }
              ol = Display.dialog();
              $.Deferred().resolve().then(function () {
                ol.message('取引開始...');
                var href = Util.getVillageChangeUrl(market.id, '/facility/facility.php?x=' + market.x + '&y=' + market.y);
                return $.ajax({
                  type: 'get',
                  url: href,
                  beforeSend: XRWstext
                });
              })
                .then(function (html) {
                  if ($(html).find('#market_form').length === 0) {
                    Display.alert('市情報が見つかりませんでした。');
                    return $.Deferred().reject();
                  }
                })
                .then(function sendQuery() {
                  if (plans.length === 0) {
                    return;
                  }
                  var plan = plans.shift();
                  ol.message('【' + plan.from + '】' + plan.value + ' を【' + plan.to + '】' + plan.receive + 'と取引中...');
                  $.ajax({
                    type: 'post',
                    url: '/facility/facility.php',
                    data: {
                      x: market.x,
                      y: market.y,
                      village_id: market.id,
                      tf_id: materialid[plan.from],
                      tc: plan.value,
                      tt_id: materialid[plan.to],
                      st: 1,
                      change_btn: true
                    },
                    beforeSend: XRWstext
                  })
                    .then(function () {
                      return Util.wait(100);
                    })
                    .then(sendQuery);
                })
                .then(function () {
                  ol.message('取引終了');
                  if (!currentVillage) {
                    return;
                  }
                  if (market.id == currentVillage.id) {
                    return;
                  }
                  var href = Util.getVillageChangeUrl(currentVillage.id, '/user/');
                  return $.ajax({
                    type: 'get',
                    url: href,
                    beforeSend: XRWstext
                  });
                })
                .then(function () {
                  return Util.wait(1000);
                })
                .done(dfd.resolve).fail(dfd.reject).always(ol.close).always(self.close);
            },
            'キャンセル': function () {
              this.close();
              dfd.reject();
            }
          }
        });
        $html.trigger('metaupdate');
        return dfd;
      },

      // . getLocaleDate
      getLocaleDate: function () {
        return new Date().toLocaleDateString();
      },

      // . toTrainingTime
      toTrainingTime: function () {
        var obj = metaStorage('TRAINING').get('time');
        for (var key in obj.value) {
          Soldier.dataKeys[key].training = obj.value[key];
        }
      },

      // 位階効果による取引レートを抽出
      getExecutive: function(){
        return new Promise(resolve => {
          $.ajax({
            type: "GET",
            url: "/user/",
            beforeSend: XRWstext
          }).then(function(html){
            // 位階効果が有効かどうか
            is_active = $(html).find('.time').text().indexOf('金購入で位階有効') === -1;
            if(is_active){
              $(html).find("#current_bonus_texts li").each(function(index, element){
                if($(element).text().indexOf("市での取引相場") !== -1){
                  let rate = $(element).text().replace("・市での取引相場+", "").replace("%", "");
                  resolve(parseInt(rate) / 100);
                  return;
                }
              });
            } else {
              resolve(0);
            }
          });
        })
      },

      // . preDialogTraining
      preDialogTraining: async function () {
        var ol = Display.dialog();
        var obj = {};
        '足軽兵舎 弓兵舎 厩舎 兵器鍛冶'.split(' ').forEach(function (key) {
          var flist = Util.getFacility(key);
          if (flist.length) {
            obj[key] = flist.concat(Util.getFacility('支城'));
          }
        });
        if (!Object.keys(obj).length) {
          ol.message('訓練可能な施設は見つかりませんでした。');
          Util.wait(1000).then(ol.close);
          return false;
        }

        executive_market_rate = await Display.getExecutive();

        // 占い結果で毎日訓練時間が変わるので日付が違う場合のみ更新
        var data = metaStorage('TRAINING').get('time') || { update: null, value: {} };
        if (data.update != Display.getLocaleDate()) {
          return Display.getTrainingTime(0, 0, obj, ol, data);
        } else {
          Display.toTrainingTime();
          ol.message('総合情報取得中...');
          return setTimeout(Display.dialogTraining, 100, ol);
        }
      },

      // . getTrainingTime
      getTrainingTime: function (key_idx, arr_idx, obj, ol, data) {
        if (Object.keys(obj).length == key_idx) {
          data.update = Display.getLocaleDate();
          metaStorage('TRAINING').set('time', data);
          Display.toTrainingTime();
          ol.message('総合情報取得中...');
          return setTimeout(Display.dialogTraining, 100, ol);
        }
        var key = Object.keys(obj)[key_idx];
        if (arr_idx === 0) {
          ol.message('「' + key + '」の訓練時間を取得中...');
        }
        var facility = obj[key][arr_idx];
        var url = Util.getVillageChangeUrl(facility.id, '/facility/facility.php?x=' + facility.x + '&y=' + facility.y);
        $.ajax({
          type: 'get',
          url: url,
          beforeSend: XRWstext
        })
          .then(function (html) {
            $(html).find('.ig_tilesection_innermid').each(function () {
              var $this = $(this),
                name, materials, soldata, $div, str;
              $div = $this.closest('DIV[id^="TrainingBlock"]');
              str = $div.find('DIV.ig_decksection_top').text();
              if (str == '高速訓練' || str == '上位訓練') {
                return;
              }
              if ($this.find('H3').length === 0) {
                return;
              }
              if (($this.find('H3:contains("施設")').length > 0)) {
                return;
              }
              name = $this.find('H3').text().match(/\[(.*)\]/)[1];

              // 訓練時間を取得
              var $tr = $this.find('FORM[name="createUnitForm"]').closest('TR');
              if (!data.value[name]) {
                data.value[name] = Soldier.dataKeys[name].training;
              }
              for ( let i = 0; i < obj[key].length; i++ ) {
                data.value[name][obj[key][i].lv - 1] = $tr.find('span.vid_' + obj[key][i].id).text().toSecond();
              }
            });
            key_idx++;
            return Display.getTrainingTime(key_idx, arr_idx, obj, ol, data);
          });
      },

      // . dialogTraining
      dialogTraining: function (ol) {
        var current = Util.getVillageCurrent(); // 選択中拠点obj

        // 所領以外の拠点選択中の場合データが取得できないので改めて取得する
        if (!current) {
          var $li = $('#sideboxBottom li.on');
          current = {
            id: $li.data('village_id'),
            name: $li.children('span').text(),
            x: $li.data('village_x'),
            y: $li.data('village_y'),
            country: $li.data('village_c')
          };
        }
        var data = selectFacilitys();
        var pooldata = Util.getPoolSoldiers(),
          facilities = {},
          fcount = 0,
          vcount = 0,
          dialog, $html, $table, $tr, $button;
        '足軽兵舎 弓兵舎 厩舎 兵器鍛冶'.split(' ').forEach(function (key) {
          var facility, flist, slist, tlist, counts;
          flist = Util.getFacility(key);
          if (flist.length === 0) {
            return;
          }
          flist = Util.getFacility(key).concat(Util.getFacility('支城'));
          slist = Util.getValidSoldiers(flist[0]);
          if (slist.length === 0) {
            return;
          }
          slist.sort(function (a, b) {
            return (a.order < b.order);
          });
          facility = {
            list: flist,
            soldiers: slist,
            total: 0,
            count: 0,
            finish: 0
          };

          tlist = pooldata.training.filter(function (elem) {
            return slist.some(function (sol) {
              return sol.type == elem.type;
            });
          });
          tlist.forEach(function (elem) {
            if (!facility[elem.type]) {
              facility[elem.type] = 0;
            }
            facility[elem.type] += elem.num;
            facility.total += elem.num;
            if (elem.finish > facility.finish) {
              facility.finish = elem.finish;
            }
          });
          counts = tlist.length > 0 ? tlist.reduce(function (prev, curr) {
            if (!prev[curr.id]) {
              prev[curr.id] = 0;
            }
            prev[curr.id]++;
            return prev;
          }, {
              0: 0
            }) : {
              0: 0
            };
          facility.count = Math.max.apply(null, $.map(counts, function (value) {
            return value;
          }));
          facilities[key] = facility;
          fcount++;
        });

        if (fcount === 0) {
          ol.message('訓練可能な施設は見つかりませんでした。');
          Util.wait(1000).then(ol.close);
          return;
        }

        $html = $('<div><table class="imc_table" style="width: 100%;" /></div>').attr('id', 'imi_training_dialog');
        $table = $html.find('TABLE');
        $tr = $('<tr><th width="150">施設</th></tr>');
        $.each(facilities, function (key, elem) {
          $tr.append('<th width="150" colspan="3">' + key + '</th>');
        });
        $table.append($tr);
        $tr = $('<tr><td width="150">訓練数 ／ 登録数</td></tr>');
        $.each(facilities, function (key, elem) {
          if (elem.count == 10) {
            $tr.append('<td width="150" colspan="3">' + elem.total + ' ／ <span style="color: #c03;">' + elem.count + '</span></td>');
          } else {
            $tr.append('<td width="150" colspan="3">' + elem.total + ' ／ ' + elem.count + '</td>');
          }
        });
        $table.append($tr);

        $tr = $('<tr><td>兵種</td></tr>');
        $.each(facilities, function (key, elem) {
          var html = '' +
            '<td colspan="3">' +
            '<img style="width: 100px; height: 100px;" /><br/>' +
            '<select style="width: 100px;" class="imc_soltype" fname="' + key + '">' +
            elem.soldiers.map(function (soldier) {
              var soldata = Soldier.getByName(soldier.name);
              return '<option value="' + soldata.type + '" src="' + soldier.image + '">' + soldier.name + '</option>';
            }).join('') +
            '</select>' +
            '</td>';
          $tr.append(html);
        });
        $table.append($tr);

        $tr = $('<tr><td>入力方法 ／ 分割</td></tr>');
        $.each(facilities, function (key, elem) {
          var html = '' +
            '<td colspan="3">' +
            '<span class="imc_input_type imc_solnum"><span>人数</span>' +
            '<ul class="imc_pulldown">' +
            '<li class="imc_solnum">人数</li>' +
            '<li class="imc_solfinish">時刻</li>' +
            '<li class="imc_soltime">時間</li>' +
            '<li class="imc_solinput">入力</li>' +
            '</ul>' +
            '</span>' +
            '<select style="width: 65px;" class="imc_input" fname="' + key + '"><option value="0">0</option></select>' +
            '<input type="text" style="width: 63px; display: none;" class="imc_input_val" fname="' + key + '" />' +
            '／' +
            '<select class="imc_create_count" fname="' + key + '">';

          if (elem.count == 10) {
            html += '<option value="0">0</option>';
          }
          for (var i = 1, len = 10 - elem.count; i <= len; i++) {
            html += '<option value="' + i + '">' + i + '</option>';
          }

          html += '</select>' +
            '</td>';

          $tr.append(html);
        });

        $table.append($tr);
        $table.append('<tr><th>施設 [<a href="javascript:void(0);" id="imc-resetData">リセット</a>]</th>' + '<th>Lv</th><th>人数</th><th>時間</th>'.repeat(fcount) + '</tr>');

        // 各拠点
        $.each(data, function (key, elem) {
          var village = Util.getVillageById(key);
          $tr = $('<tr />');
          $tr.append('<td>' + village.name + '</td>');
          $.each(facilities, function (key, elem) {
            var facility = elem.list.filter(function (value) {
              return value.id == village.id;
            });
            if (facility.length === 0) {
              $tr.append('<td colspan="3">-</td>');
            } else {
              facility = facility[0];
              $tr.append('<td width="20" />', $('<td width="45" />').addClass('imc_plan').attr({
                fname: key,
                vid: facility.id
              }), '<td/>');
            }
          });
          $table.append($tr);
          vcount++;
        });

        $tr = $('<tr><th>人数計</th></tr>');
        $.each(facilities, function (key, elem) {
          $tr.append('<th></th><td class="imc_total" fname="' + key + '"></td><th></th>');
        });
        $table.append($tr);

        $html.append(
          '<br />' +
          '<table class="imc_table imc_result" style="float: left;">' +
          '<tr>' +
          '<th width="100">陣屋</th>' +
          '<td colspan="2">' + pooldata.soldier + ' / ' + pooldata.capacity + '</td>' +
          '<th>訓練可能残</th>' +
          '<td><span class="imc_training_num"></td>' +
          '</tr>' +
          '<tr>' +
          '<td width="100">現在資源</td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_wood.gif' + '"> <span class="imc_resource" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_wool.gif' + '"> <span class="imc_resource" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_ingot.gif' + '"> <span class="imc_resource" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_grain.gif' + '"> <span class="imc_resource" /></td>' +
          '</tr>' +
          '<tr>' +
          '<td width="100">必要資源</td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_wood.gif' + '"> <span class="imc_total_material" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_wool.gif' + '"> <span class="imc_total_material" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_ingot.gif' + '"> <span class="imc_total_material" /></td>' +
          '<td style="text-align: left;"><img src="' + Env.externalFilePath + '/img/common/ico_grain.gif' + '"> <span class="imc_total_material" /></td>' +
          '</tr>' +
          '</table>' +
          '<div id="imi_training_message"></div>' +
          '</div>' +
          '');

        $html.on('click', '#imc-resetData', function (e) {
          if (!confirm('データをリセットしてよろしいですか？')) {
            return;
          }
          var storage = metaStorage('TRAINING').remove('time');
          $('#imi_overlay').remove();
        });

        $html.on('click', '.imc_input_type LI', function () {
          var $this = $(this),
            type = $this.attr('class'),
            $td = $this.closest('TD'),
            $intype = $td.find('.imc_input_type');
          $intype.removeClass('imc_solnum imc_solfinish imc_soltime imc_solinput').addClass(type);
          $intype.find('SPAN').text($this.text());
          $td.find('.imc_input').attr('disabled', false).trigger('metaupdate');
          if ($this.hasClass('imc_solinput')) {
            $td.find('.imc_input').hide();
            $td.find('.imc_input_val').show();
          } else {
            $td.find('.imc_input').show();
            $td.find('.imc_input_val').hide();
          }
        })
          .on('change', '.imc_soltype', function () {
            var $this = $(this),
              fname = $this.attr('fname'),
              image = $this.find('OPTION:selected').attr('src');
            $this.prevAll('IMG').attr('src', image);
            $html.find('.imc_input[fname="' + fname + '"]').trigger('metaupdate');
          })
          .on('metaupdate', '.imc_input', function () {
            var $this = $(this),
              fname = $this.attr('fname'),
              type = $html.find('.imc_soltype[fname="' + fname + '"]').val(),
              $intype = $this.parent().find('.imc_input_type'),
              resource = Util.getResource(),
              market = Util.getMarket(),
              materials;
            materials = facilities[fname].soldiers.filter(function (elem) {
              return (elem.type == type);
            })[0].materials;
            var rate = (market) ? market.rate : 0,
              freecapa = pooldata.capacity - pooldata.soldier,
              maxnum = Util.getMaxTraining(resource, materials, 0, freecapa, 0),
              overnum = Util.getMaxTraining(resource, materials, rate, freecapa, maxnum),
              flist = facilities[fname].list,
              color, options, soldata, val, step, basetime, starttime, disabled;
            color = '#390';
            options = [];
            soldata = facilities[fname].soldiers.filter(function (elem) {
              return (elem.type == type);
            })[0];
            if ($intype.hasClass('imc_solnum')) {

              // 人数
              val = 0;
              step = 100;
              options.push('<option value="0">0</option>');
              (function () {
                var result;
                while (val < overnum) {
                  val += step;
                  if (val == maxnum) {
                    maxnum = Number.MAX_VALUE;
                  }
                  if (val > maxnum && maxnum != overnum) {
                    options.push('<option value="' + maxnum + '" style="color: ' + color + '">' + maxnum + '</option>');
                    maxnum = Number.MAX_VALUE;
                  }
                  if (val > overnum) {
                    val = overnum;
                  }
                  if (val >= 1000) {
                    step = 500;
                  }
                  result = Util.checkExchange(resource, Util.getConsumption(materials, val));
                  if (result === 0) {
                    break;
                  }
                  if (result === 1) {
                    color = '#c30';
                  }
                  options.push('<option value="' + val + '" style="color: ' + color + '">' + val + '</option>');
                }
              })();
            } else if ($intype.hasClass('imc_solfinish')) {

              // 時刻
              basetime = facilities[fname].finish;
              basetime = (basetime) ? basetime : Util.getServerTime() + 60;
              starttime = Math.floor(basetime / 900) * 900 + 900;
              options.push('<option value="0">-</option>');
              (function () {
                var i, val, num, result;
                for (i = 0; i <= 1440; i += 15) {
                  val = starttime + (i * 60);
                  num = Util.divide2(flist, soldata, val - basetime).totalnum;
                  result = Util.checkExchange(resource, Util.getConsumption(materials, num));
                  if (num === 0) {
                    continue;
                  }
                  if (num > freecapa) {
                    break;
                  }
                  if (result === 0) {
                    break;
                  }
                  if (result === 1) {
                    color = '#c30';
                  }
                  options.push('<option value="' + (val - basetime) + '" style="color: ' + color + '">' + val.toFormatDate('hh:mi') + '</option>');
                }
              })();
            } else if ($intype.hasClass('imc_soltime')) {

              // 時間
              options.push('<option value="0">00h00m</option>');
              (function () {
                var val, num, result;
                for (var i = 15; i <= 1440; i += 15) {
                  val = i * 60;
                  num = Util.divide2(flist, soldata, val).totalnum;
                  result = Util.checkExchange(resource, Util.getConsumption(materials, num));
                  if (num === 0) {
                    continue;
                  }
                  if (num > freecapa) {
                    break;
                  }
                  if (result === 0) {
                    break;
                  }
                  if (result === 1) {
                    color = '#c30';
                  }
                  options.push('<option value="' + val + '" style="color: ' + color + '">' + val.toFormatTime('hhhmim') + '</option>');
                }
              })();
            }
            $this.empty().append(options.join(''));

            // 手入力の場合options.length == 0になる
            if (options.length === 0) {
              disabled = (overnum === 0 || facilities[fname].count == 10);
              $html.find('.imc_input_val').filter('[fname="' + fname + '"]').val(0).trigger('change').attr('disabled', disabled);
            } else {
              disabled = (options.length == 1 || facilities[fname].count == 10);
              $html.find('.imc_input').filter('[fname="' + fname + '"]').trigger('change').attr('disabled', disabled);
            }
            $html.find('.imc_create_count').filter('[fname="' + fname + '"]').attr('disabled', disabled);
          })
          .on('change', '.imc_input', function () {
            var $this = $(this);
            $this.parent().find('.imc_input_val').val($this.val()).trigger('change');
          })
          .on('change', '.imc_input_val', function () {
            var $this = $(this),
              num = $this.val().toInt(),
              fname = $this.attr('fname'),
              type = $html.find('.imc_soltype[fname="' + fname + '"]').val(),
              count = $html.find('.imc_create_count[fname="' + fname + '"]').val(),
              $intype = $this.parent().find('.imc_input_type'),
              soldata, list, total;
            if (isNaN(num)) {
              num = 0;
              $this.val(0);
            } else {
              $this.val(num);
            }
            soldata = facilities[fname].soldiers.filter(function (elem) {
              return (elem.type == type);
            })[0];
            if ($intype.is('.imc_solnum, .imc_solinput')) {
              list = Util.divide(facilities[fname].list, soldata, num);
            } else {
              list = Util.divide2(facilities[fname].list, soldata, num);
            }
            total = 0;
            list.forEach(function (elem) {
              elem.create_count = count;
              total += elem.solnum;
              $html.find('TD[fname="' + fname + '"][vid="' + elem.id + '"]').data('plan', elem).trigger('metaupdate');
            });
            $html.find('TD.imc_total[fname="' + fname + '"]').text(total);
            $this.parent().removeAttr('style');
            if (num > 0) {
              $this.parent().css('background-color', '#77692F');
            }
            $html.find('.imc_result').trigger('metaupdate');
          })
          .on('change', '.imc_create_count', function () {
            $(this).parent().find('.imc_input_val').trigger('change');
          })
          .on('metaupdate', '.imc_plan', function () {
            var $this = $(this),
              plan = $(this).data('plan');
            $this.prev().text(plan.lv);
            $this.text(plan.solnum);
            $this.next().text(plan.trainingtime.toFormatTime());
          })
          .on('metaupdate', '.imc_result', function () {
            var $this = $(this),
              execute = true,
              resource, materials, solnum, trainingnum, check;
            resource = Util.getResource();
            materials = $html.find('.imc_plan').map(function () {
              return [($(this).data('plan') || {
                materials: [0, 0, 0, 0]
              }).materials];
            }).get().reduce(function (prev, curr) {
              for (var i = 0, len = prev.length; i < len; i++) {
                prev[i] += curr[i];
              }
              return prev;
            }, [0, 0, 0, 0]);
            solnum = $html.find('.imc_plan').map(function () {
              return [($(this).data('plan') || {
                solnum: 0
              }).solnum];
            }).get().reduce(function (prev, curr) {
              return prev + curr;
            }, 0);
            trainingnum = pooldata.capacity - solnum - pooldata.soldier;
            $this.find('.imc_training_num').text(trainingnum);
            if (trainingnum < 0) {
              $this.find('.imc_training_num').parent().css({
                backgroundColor: 'firebrick'
              });
            } else {
              $this.find('.imc_training_num').parent().css({
                backgroundColor: '#77692F'
              });
            }

            // 資源
            $this.find('.imc_resource').each(function (idx) {
              $(this).text(resource[idx]);
            });
            $this.find('.imc_total_material').each(function (idx) {
              var $this = $(this);
              $this.text(materials[idx]).removeClass('imc_surplus imc_shortage');
              if (materials[idx] > resource[idx]) {
                $this.addClass('imc_shortage');
              } else {
                $this.addClass('imc_surplus');
              }
            });
            check = Util.checkExchange(resource, materials);
            if (solnum === 0) {
              execute = false;
              $('#imi_training_message').text('');
            } else if (trainingnum < 0) {
              $('#imi_training_message').text('陣屋の容量を超えています');
              execute = false;
            } else if (check === 0) {
              $('#imi_training_message').text('資源が不足しています');
              execute = false;
            } else if (check === 1) {
              $('#imi_training_message').text('取引可能です');
              $button.text('取引後に訓練開始');
            } else {
              $('#imi_training_message').text('取引の必要はありません');
              $button.text('訓練開始');
            }
            $button.attr('disabled', !execute);
          });

        dialog = Display.dialog({
          title: '一括兵士訓練',
          width: 930,
          height: 482,
          top: 50,
          content: $html,
          buttons: {
            '訓練開始': function () {
              var self = this,
                ol, total, plans, workid;
                const facility = {};
                const capital = Util.getCapital();

              total = $html.find('.imc_total_material').map(function () {
                return $(this).text().toInt();
              }).get();
              $.Deferred().resolve().then(function () {
                var resource = Util.getResource();
                var result = Util.checkExchange(resource, total);
                if (result === 0) {
                  return $.Deferred().reject();
                } else if (result == 1) {
                  return Display.dialogExchange(resource, total);
                } else {
                  if (!window.confirm('訓練を開始してよろしいですか？')) {
                    return $.Deferred().reject();
                  }
                }
              })
                .then(function () {
                  ol = Display.dialog();
                  ol.message('一括訓練登録処理開始...');
                  plans = $html.find('.imc_plan').map(function () {
                    var plan = $(this).data('plan');
                    return (plan.solnum > 0) ? plan : null;
                  }).get();
                  plans.sort(function(a, b) { return a.type - b.type; });
                  for ( let i = 0; i < plans.length; i++ ) {
                    if ( plans[i].id == capital.id ) {
                        if ( ! facility[plans[i].type] ) {
                            facility[plans[i].type] = {'x': 0, 'y': 0};
                        }
                        facility[plans[i].type]['x'] = plans[i].x;
                        facility[plans[i].type]['y'] = plans[i].y;
                    }
                  }
                })
                .then(function sendQuery() {
                  var plan = plans.shift();
                  if (!plan) {
                    return;
                  }
                  return $.Deferred().resolve().then(function () {
                    if (workid == capital.id) {
                      return;
                    }
                    workid = capital.id;
                    var href = Util.getVillageChangeUrl(capital.id, '/user/');
                    return $.ajax({
                      type: 'get',
                      url: href,
                      beforeSend: XRWstext
                    });
                  })
                    .then(function () {
                        var href = '/facility/facility.php?x=' + facility[plan.type].x + '&y=' + facility[plan.type].y,
                        data = {
                          unit_id: plan.type,
                          x: facility[plan.type].x,
                          y: facility[plan.type].y,
                          create_village: plan.id,
                          count: plan.solnum,
                          create_count: plan.create_count,
                          btnSend: true
                        };
                      var village = Util.getVillageById(plan.id);
                      var soldata = Soldier.getByType(plan.type);
                      ol.message('「' + village.name + '」にて【' + soldata.name + '】を登録中...');
                      return $.ajax({
                        type: 'post',
                        url: href,
                        data: data,
                        beforeSend: XRWstext
                      });
                    })
                    .then(sendQuery);
                })
                .then(function () {
                  ol.message('一括訓練処理終了').message('ページを更新します...');
                  var href = Util.getVillageChangeUrl(current.id, '/facility/unit_list.php');
                  exPage.move(href);
                });
            },
            '閉じる': function () {
              this.close();
            }
          }
        });

        $button = dialog.buttons.eq(0).attr('disabled', true);
        $html.find('.imc_soltype').trigger('change');
        var href = Util.getVillageChangeUrl(current.id, '/user/');
        $.ajax({
          type: 'get',
          url: href,
          beforeSend: XRWstext
        })
          .then(ol.close);
      }
    });

    // Display }

    // ■ exPage {
    var exPage = function () {
      var path = arguments[0],
        key = '/' + path.join('/'),
        actionList = exPage.actionList,
        extentionList = exPage.extentionList,
        action;
      if (Env.loginState == -1) {
        return new exPage.noaction();
      } else if (Env.loginState === 0) {
        return new exPage.noaction();
      } else {
        action = new exPage.pageaction();
      }
      if (actionList[key]) {
        $.extend(action, actionList[key]);
      }
      if (extentionList[key]) {
        action.callbacks = extentionList[key];
      }
      return action;
    };

    // . exPage
    $.extend(exPage, {

      // .. actionList
      actionList: {},

      // .. extentionList
      extentionList: {},

      // .. registerAction
      registerAction: function () {
        var args = Array.prototype.slice.call(arguments),
          obj = args.pop(),
          key = '/' + args.join('/'),
          list = this.actionList;
        if (list[key]) {
          $.extend(list[key], obj);
        } else {
          list[key] = obj;
        }
      },

      // .. move
      move: function (url) {
        window.setTimeout(function () {
          location.href = url;
        }, 1000);
      },

      // .. action
      action: function () { },

      // .. pageaction
      pageaction: function () { },

      // .. noaction
      noaction: function () { }
    });

    // . exPage.noaction.prototype
    $.extend(exPage.noaction.prototype, {

      // .. execute
      execute: function () { }
    });

    //. exPage.pageaction.prototype
    $.extend(exPage.pageaction.prototype, {

      // .. execute
      execute: function () {
        this.main();
        if (this.callbacks) {
          this.callbacks.fire();
        }
      },
      //.. main
      main: function () { }
    });

    // ■ /village
    exPage.registerAction('village', {

      // . main
      main: function () {
        var moko_facilitys = ownerMode == '1' ? localStorage.zs_ixamoko_facilitys : localStorage.ixamoko_facilitys;
        moko_facilitys ? null : this.getFacilityList();
      },

      // . getFacilityList
      getFacilityList: function () {
        var storage = metaStorage('FACILITY'),
          basename = $('#basepointTop .basename').text(),
          village = Util.getVillageByName(basename),
          data, list = {};
        $('#mapOverlayMap').find('AREA[alt^="市"]').each(addList).end()
          .find('AREA[alt^="足軽兵舎"]').each(addList).end()
          .find('AREA[alt^="弓兵舎"]').each(addList).end()
          .find('AREA[alt^="厩舎"]').each(addList).end()
          .find('AREA[alt^="兵器鍛冶"]').each(addList).end();
        storage.begin();
        data = storage.data;
        data[village.id] = list;

        // 表示拠点選択にある拠点だけで登録
        var baselist = BaseList.home(),
          newdata = {};
        $.each(baselist, function () {
          if (data[this.id] !== undefined) {
            newdata[this.id] = data[this.id];
          }
        });
        storage.data = newdata;
        storage.commit();

        function addList(index, elm) {
          var $this = $(elm),
            alt = $this.attr('alt'),
            href = $this.attr('href'),
            array = alt.match(/(.+) LV.(\d+)/),
            name, lv, x, y;

          if (!array) {
            return;
          }

          alt = array[0];
          name = array[1];
          lv = array[2];
          array = href.match(/x=(\d+)&y=(\d+)/);
          href = array[0];
          x = array[1];
          y = array[2];
          list[name] = {
            x: x.toInt(),
            y: y.toInt(),
            lv: lv.toInt()
          };
        }
      }
    });

    // ■ 実行
    exPage(Env.path).execute();

    // exPage }

    // 一括兵士訓練のリンク埋め込み
    (function () {
      var str = ownerMode == '1' ? '　影城主' : '';
      $('<div><li><a href="javascript:void(0);">【一括兵士訓練】' + str + '</a></li></div>')
        .css('font-color', 'white').on('click', 'a', Display.preDialogTraining)
        .prependTo('li.gMenu01 > ul');
    })();
  }

  // load
  // function IxaTrainingCss(){
  window.addEventListener('DOMContentLoaded', function () {

    // console.debug(document.readyState);
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = '' +

      /* テーブルスタイル */
      '.imc_table { border-collapse: collapse; border: solid 1px dimGray; color: white; }' +
      '.imc_table TH { padding: 4px 6px; text-align: center; vertical-align: middle; border-bottom: dotted 1px dimGray; border-left: solid 1px dimGray; background:  linear-gradient(to bottom, #949494 0%,#797979 100%); text-shadow: black 1px 1px 3px, black -1px -1px 3px; }' +
      '.imc_table TD { padding: 4px 5px; text-align: center; vertical-align: middle; border-bottom: solid 1px dimGray; border-left: solid 1px dimGray; background-color: black; }' +
      '.imc_table.td_right TD { text-align: right; }' +
      '.imc_table TD img { vertical-align: text-top; }' +
      '.imc_table TH.h100 { background-size: 100% 100%; }' +
      '#imi_ex_type .imc_selected { background-color: #77692f; }' +

      /* overlay用 z-index: 2000 */
      '#imi_overlay { position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 2000; }' +
      '#imi_overlay .imc_overlay { position: absolute; width: 100%; height: 100%; background-color: #000; opacity: 0.75; }' +

      /* ダイアログメッセージ用 */
      '#imi_dialog_container { position: relative; margin: auto; width: 500px; height: auto; background-color: rgba(0, 0, 0, 0.6); color: white; border: 4px solid #77692f; overflow: hidden; }' +
      '#imi_dialog_container .imc_dialog_header { padding: 8px; color: white; }' +
      '#imi_dialog_container .imc_dialog_body { margin: 8px 0px 8px 8px; padding-right: 8px; font-size: 12px; height: 200px; overflow: auto; }' +
      '#imi_dialog_container .imc_dialog_footer { margin: 5px; padding: 5px 10px; border-top: solid 1px dimgray; text-align: right; }' +
      '#imi_dialog_container .imc_message { margin: 4px; }' +
      '#imi_dialog_container BUTTON { margin-left: 8px; padding: 5px; min-width: 60px; border: solid 1px dimgray; border-radius: 3px; cursor: pointer; color: #000; background: -moz-linear-gradient(top, #fff, #ccc); background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ccc)); }' +
      '#imi_dialog_container BUTTON:hover { background: -moz-linear-gradient(bottom, #fff, #ccc); background: -webkit-gradient(linear, left bottom, left top, from(#fff), to(#ccc)); }' +
      '#imi_dialog_container BUTTON:active { border-style: inset; }' +
      '#imi_dialog_container BUTTON:disabled { color: #666; border-style: solid; background: none; background-color: #ccc; cursor: default; }' +

      /* 一括兵士訓練ダイアログ用 */
      '#imi_training_dialog .imc_surplus { color: limegreen; }' +
      '#imi_training_message { width: 350px; float: left; text-align: center; padding: 10px; font-size: 14px; color: red; }' +
      '#imi_training_dialog .imc_input_type { position: relative; display: inline-block; margin-right: 2px; padding: 2px 3px; cursor: pointer; -moz-user-select: none; background-color: #505050; color: white; border-radius: 3px; }' +
      '#imi_training_dialog .imc_input_type .imc_pulldown { position: absolute; margin-left: -4px; z-index: 2000; text-align: left; display: none; }' +
      '#imi_training_dialog .imc_input_type:hover .imc_pulldown { display: block; background-color: black; border: solid 1px white; }' +
      '#imi_training_dialog .imc_input_type .imc_pulldown LI { width: 30px; height: 20px; text-align: center; line-height: 20px; }' +
      '#imi_training_dialog .imc_input_type .imc_pulldown LI:hover { background-color: dimGray; }' +
      '#imi_training_dialog .imc_input_val { ime-mode: disabled; }' +

      '';
//    return (style);
//  }
    document.head.appendChild(style);

    //document.head.appendChild(IxaTrainingCss());
    var scriptMeta = document.createElement('script');
    scriptMeta.setAttribute('type', 'text/javascript');
    scriptMeta.textContent = '(' + IxaTraining.toString() + ')(j213$);';
    //document.body.appendChild(scriptMeta);
    document.head.appendChild(scriptMeta);
  });

})();
