// ==UserScript==
// @name              无剑Mud辅修
// @description       无剑Mud辅修，由在线版移植而来，順便《略改》
// @namespace         http://tampermonkey.net/
// @version           1.1.71
// @author            燕飞，东方鸣，懒人
// @match             http://*.xxmud.cn/*
// @match             http://*.guaji321.cn/*
// @match             http://lib10.cn/*
// @match             http://orchin.cn/*
// @match             http://*.yytou.cn/*
// @match             http://*.yytou.com/*
// @match             http://118.178.84.7/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @connect           update.greasyfork.org
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// ==/UserScript==

"use strict";

if (document.domain == "orchin.cn") {
  var params = new URLSearchParams(location.href.split("?")[1]);
  var host = params.get("ws_host");
  params["delete"]("ws_host");
  location.replace("http://" + host + "?" + params.toString());
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() { };
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e2) {
          throw _e2;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e3) {
      didErr = true;
      err = _e3;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

// 取消屏蔽
var KEYWORD_PATTERNS = g_gmain.KEYWORD_PATTERNS;
g_gmain.KEYWORD_PATTERNS = [];
function __(c, w) {
  return c;
}
unsafeWindow.init = function () {
  PLU.YFUI = YFUI;
  PLU.UTIL = UTIL;
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://update.greasyfork.org/scripts/486271/%E6%97%A0%E5%89%91Mud%E8%BE%85%E4%BF%AE%E6%95%B0%E6%8D%AE.js?t=".concat(Date.now()),
    nocache: true,
    onload: function onload(res) {
      eval(res.responseText);
      PLU.YFD = unsafeWindow.YFD;
      var waitGameSI = setInterval(function () {
        if (unsafeWindow.g_obj_map && g_obj_map.get("msg_attrs")) {
          clearInterval(waitGameSI);
          PLU.init();
        }
      }, 500);
    }
  });
};
// 本地化
function _(c, t) {
  return navigator.language == "zh-CN" || !t ? c : t;
}

//=================================================================================
// UTIL模块
//=================================================================================
unsafeWindow.PLU = {
  //version: GM_info.script.version + "(24.02.02)",
  accId: null,
  nickName: null,
  battleData: null,
  MPFZ: {},
  TODO: [],
  //待办列表
  STO: {},
  SIT: {},
  ONOFF: {},
  STATUS: {
    inBattle: 0,
    isBusy: 0
  },
  CACHE: {
    autoDZ: 1,
    autoHYC: 1,
    auto9H: 1,
    autoLX: 1,
    autoBF: 1,
    autoB6: 1,
    autoB5F: 1,
    autoDY: 0,
    autoCaicha: 0,
    develop: 0,
    puzzleTimeOut: 60
  },
  FLK: null,
  TMP: {
    autotask: false,
    iBatchAskModel: 0
  },
  logHtml: "",
  signInMaps: null,
  //================================================================================================
  init: function init() {
    this.accId = UTIL.getAccId();
    this.developerMode =
      //专属
      UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer || ["3909055(1)","3091591(8)","6740379(1)","6768697(1)","4521232(1)", "4020484(1)", "4512928(1)", "2904280(8)", "8432667(1)", "8432616(1)"].includes(this.accId);
    this.PersonalMode =
      //个人
      UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer || ["3070884(1)", "4512928(1)", "6768697(1)", "3028780(1)", "7525192(1)", "6740379(1)", "3028233(1)", "6740205(1)", "2904280(8)", "3091591(8)", "3613445(1)", "3093761(8)", "3091552(8)", "3091552(8)", "3107986(8)", "4020484(1)", " "].includes(this.accId);
    if (this.developerMode) {
      this.GM_info = GM_info;
      UTIL.addSysListener("developer", function (b, type, subtype, msg) {
        if (type && type == "attrs_changed") return;
        if (type && type == "channel" && subtype == "rumor") return;
        console.log(b);
      });
    }
    this.initMenu();
    this.initTickTime();
    this.initStorage();
    this.initHistory();
    this.initSocketMsgEvent();
    this.initVersion();
    addEventListener("keydown", function (key) {
      if (key.altKey || key.ctrlKey || key.metaKey || key.shiftKey) return; // 不考虑组合键
      if (document.activeElement && document.activeElement.tagName == "INPUT") return;
      switch (key.keyCode) {
        case 81:
          // q
          clickButton("nw");
          break;
        case 87:
          // w
          clickButton("n");
          break;
        case 69:
          // e
          clickButton("ne");
          break;
        case 65:
          // a
          clickButton("w");
          break;
        case 83:
          // s
          clickButton("s");
          break;
        case 68:
          // d
          clickButton("e");
          break;
        case 90:
          // z
          clickButton("sw");
          break;
        case 67:
          // c
          clickButton("se");
          break;
        case 66:
          // B
          clickButton("items");
          break;
        case 75:
          // k
          clickButton("skills");
          break;
        case 86:
          // v
          clickButton("vip");
          break;
      }
    });
  },
  //================================================================================================
  initVersion() {
    this.nickName = g_obj_map.get("msg_attrs").get("name");
    YFUI.writeToOut(
      `<span style='color:yellow;'>
            +===========================+
                 脚本名称：无剑Mud辅修    版本：${this.version}
                 脚本开发：燕飞,东方鸣,懒人
                 当前角色：${this.nickName}${this.developerMode ? "（已开启开发者模式）" : ""}${unsafeWindow.customMode ? "（已开启自定义模式）" : ""}
                 角色 ID：${this.accId}
         +===========================+</span>`
    );
    var playerName = this.removeColorCode(this.nickName); //窗口标题
    document.title = playerName;
    YFUI.writeToOut("<span style='color:#FFF;'>监听设定:</span>");
    var autosets = "";
    if (PLU.getCache("autoDZ") == 1) autosets += "连续打坐, ";
    if (PLU.getCache("autoHYC") == 1) autosets += "连续睡床, ";
    if (PLU.getCache("auto9H") == 1) autosets += "持续九花, ";
    if (PLU.getCache("autoDY") == 1) autosets += "持续钓鱼, ";
    if (PLU.getCache("autoCaicha") == 1) autosets += "持续采茶, ";
    if (PLU.getCache("autoLX") == 1) autosets += "连续练习, ";
    if (PLU.getCache("autoBF") == 1) autosets += "加入帮四, ";
    if (PLU.getCache("autoB6") == 1) autosets += "加入帮六, ";
    if (PLU.getCache("autoB5F") == 1) autosets += "帮五跟杀, ";
    //if (PLU.getCache("listenPuzzle") == 1) autosets += "暴击谜题, ";
    YFUI.writeToOut("<span style='color:#CFF;'>" + autosets + "</span>");
    if (PLU.getCache("autoTP") == 1) {
      YFUI.writeToOut("<span style='color:#CFF;'>自动突破: <span style='color:#FF9;'>" + PLU.getCache("autoTP_keys") + "</span></span>");
    }
    if (PLU.getCache("listenQL") == 1) {
      YFUI.writeToOut("<span style='color:#CFF;'>自动青龙: <span style='color:#FF9;'>" + PLU.getCache("listenQL_keys") + "</span></span>");
    }
    if (PLU.getCache("listenKFQL") == 1) {
      YFUI.writeToOut("<span style='color:#CFF;'>跨服青龙: <span style='color:#FF9;'>" + PLU.getCache("listenKFQL_keys") + "</span></span>");
    }
    if (PLU.getCache("listenTF") == 1) {
      YFUI.writeToOut("<span style='color:#CFF;'>自动逃犯: <span style='color:#FF9;'>" + PLU.getCache("listenTF_keys") + "</span></span>");
    }
    if (!g_gmain.is_fighting) {
      PLU.getSkillsList(function (allSkills, tupoSkills) {
        var _g_obj_map$get;
        if (tupoSkills.length > 0) {
          YFUI.writeToOut("<span style='color:white;'>突破中技能:</span>");
          var topos = "";
          tupoSkills.forEach(function (sk, i) {
            topos += "<span style='color:#CCF;min-width:100px;display:inline-block;'>" + (i + 1) + " : " + sk.name + "</span>";
          });
          YFUI.writeToOut("<span style='color:#CCF;'> " + topos + "</span>");
          YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
        } else {
          YFUI.writeToOut("<span style='color:white;'>突破中技能: 无</span>");
          YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
        }
        var lxSkill = ((_g_obj_map$get = g_obj_map.get("msg_attrs")) === null || _g_obj_map$get === void 0 ? void 0 : _g_obj_map$get.get("practice_skill")) || 0;
        if (lxSkill) {
          var sk = allSkills.find(function (s) {
            return s.key == lxSkill;
          });
          if (sk) {
            YFUI.writeToOut("<span style='color:white;'>练习中技能: <span style='color:#F0F;'>" + sk.name + "</span> (" + sk.level + ")</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
        } else {
          YFUI.writeToOut("<span style='color:white;'>练习中技能: 无</span>");
          YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
        }
      });
    }
  },
  removeColorCode: function removeColorCode(name) {
    //去除角色名的彩色代码
    return name.replace(/\[[0-9;]*[mG]/g, "");
  },
  //================================================================================================
  initSocketMsgEvent: function initSocketMsgEvent() {
    if (!gSocketMsg) {
      console.log("%c%s", "background:#C33;color:#FFF;", " ERROR:Not found gSocketMsg!! ");
      return;
    }
    gSocketMsg.YFBackupDispatchMsg = gSocketMsg.dispatchMessage;
    gSocketMsg.dispatchMessage = function (b) {
      gSocketMsg.YFBackupDispatchMsg(b);
      var type = b.get("type");
      var subtype = b.get("subtype");
      var msg = b.get("msg");
      UTIL.sysDispatchMsg(b, type, subtype, msg);
    };
    gSocketMsg.change_skill_button = function (m, is_del) {
      var m_vs_info = g_obj_map.get("msg_vs_info"),
        m2 = g_obj_map.get("msg_attrs");
      if (!m_vs_info || !m2) return 0;
      if (is_del) {
        g_obj_map.remove("skill_button" + is_del);
        return 1;
      }
      var id = this.get_combat_user_id();
      if (id != m.get("uid")) return 0;
      var pos = parseInt(m.get("pos"));
      if (pos <= 0 || pos > this._skill_btn_cnt) return 0;
      g_obj_map.put("skill_button" + pos, m);
      this.refresh_skill_button();
    };
    PLU.initListeners();
    if (unsafeWindow.clickButton) {
      var proxy_clickButton = unsafeWindow.clickButton;
      unsafeWindow.clickButton = function () {
        var args = arguments;
        if (PLU.developerMode) {
          console.log(args);
        }
        // 指令录制
        if (PLU.TMP.cmds && !g_gmain.is_fighting && ["attrs", "none", "jh", "fb", "prev_combat", "home_prompt", "jhselect", "fbselect", "send_chat"].indexOf(args[0]) < 0 && args[0].indexOf("look_npc ") && !args[0].match(/^(jh|fb)go /) && args[0].indexOf("go_chat")) {
          if (args[0].indexOf("go southeast.") == 0 || args[0].indexOf("go southwest.") == 0 || args[0].indexOf("go northeast.") == 0 || args[0].indexOf("go northwest.") == 0) PLU.TMP.cmds.push(args[0][3] + args[0][8]); else if (args[0].indexOf("go east.") == 0 || args[0].indexOf("go west.") == 0 || args[0].indexOf("go south.") == 0 || args[0].indexOf("go north.") == 0) PLU.TMP.cmds.push(args[0][3]); else PLU.TMP.cmds.push(args[0]);
        }
        if (args[0].indexOf("ask ") == 0) {
          UTIL.addSysListener("ask", function (b, type, subtype, msg) {
            if (type == "jh" && subtype == "info" || UTIL.inHome()) {
              UTIL.delSysListener("ask");
            }
            if (type != "main_msg" || msg.indexOf("嗯，相遇即是缘，你是练武奇才，我送点东西给你吧。") == -1) return;
            proxy_clickButton(args[0]);
            UTIL.delSysListener("ask");
          });
          setTimeout(function () {
            UTIL.delSysListener("ask");
          }, 500);
          proxy_clickButton(args[0]);
        }
        // 解除聊天屏蔽，对非脚本玩家可用
        else if (PLU.developerMode && args[0].indexOf("chat ") == 0) {
          var msg = args[0].substring(5);
          var _iterator = _createForOfIteratorHelper(KEYWORD_PATTERNS),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var PATTERN = _step.value;
              msg = msg.replace(PATTERN, function (s) {
                return Array.from(s).join("\f");
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          proxy_clickButton("chat " + msg);
        }
        // 解除四海商店限制
        else if ((args[0].indexOf("reclaim recl ") == 0 || args[0].indexOf("reclaim buy ") == 0) && !args[0].match(" page ")) {
          var cmd = args[0].match(/^reclaim (recl|buy) (\d+) (go )?(.+)$/);
          if (cmd[1]) {
            var n = Number(cmd[2]);
            switch (cmd[1]) {
              case "recl":
                for (; n > 50000; n -= 50000) {
                  proxy_clickButton("reclaim recl 50000 go ".concat(cmd[4]), 1);
                }
                proxy_clickButton("reclaim recl ".concat(n, " go ").concat(cmd[4]), 1);
                break;
              case "buy":
                for (; n > 50000; n -= 50000) {
                  proxy_clickButton("reclaim buy 50000 go ".concat(cmd[4]), 1);
                }
                proxy_clickButton("reclaim buy ".concat(n, " go ").concat(cmd[4]), 1);
                break;
            }
          }
        } else {
          proxy_clickButton.apply(void 0, _toConsumableArray(args));
        }
        if (PLU.TMP.leaderTeamSync) {
          PLU.commandTeam(args);
        }
      };
    }
  },
  //================================================================================================
  initMenu: function initMenu() {
    YFUI.init();
    YFUI.addBtn({
      id: "ro",
      text: "▲隐",
      style: {
        width: "30px",
        opacity: ".6",
        background: "#333",
        color: "#FFF",
        border: "1px solid #CCC",
        borderRadius: "8px 0 0 0"
      },
      onclick: function onclick($btn) {
        $("#pluginMenus").toggle();
        $("#pluginMenus").is(":hidden") ? $btn.text("▼显") : $btn.text("▲隐");
        $(".menu").hide();
      }
    });
    YFUI.addBtnGroup({
      id: "pluginMenus"
    });
    //Paths
    var PathsArray = [];
    PathsArray.push({
      id: "bt_home",
      groupId: "pluginMenus",
      text: "首页",
      style: {
        background: "#FFFF99",
        padding: "5px 2px",
        width: "40px"
      },
      onclick: function onclick(e) {
        $(".menu").hide();
        PLU.STATUS.isBusy = false;
        clickButton("home", 1);
      }
    });
    var citysArray = PLU.YFD.cityList.map(function (c, i) {
      return {
        id: "bt_jh_" + (i + 1),
        text: c,
        extend: "jh " + (i + 1)
      };
    });
    PathsArray.push({
      id: "bt_citys",
      text: "地图",
      style: {
        background: "#FFE",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "240px",
        "margin-top": "-25px"
      },
      children: citysArray
    });
    var qlArray = PLU.YFD.qlList.map(function (p, i) {
      return {
        id: "bt_ql_" + (i + 1),
        text: p.n,
        extend: {
          func: function func() {
            return PLU.execActions(PLU.minPath(PLU.queryRoomPath(), p.v));
          }
        },
        style: {
          "background-color": "#CFF"
        }
      };
    });
    if (PLU.developerMode) qlArray.push({
      id: "bt_ql_xunluo",
      text: "巡逻",
      extend: {
        func: PLU.qlxl
      },
      style: {
        "background-color": "#CFF"
      }
    });
    PathsArray.push({
      id: "bt_qls",
      text: "青龙",
      style: {
        background: "#DFF",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "160px",
        "margin-top": "-50px"
      },
      children: qlArray
    });
    var mjArray = PLU.YFD.mjList.map(function (p, i) {
      return {
        id: "bt_mj_" + (i + 1),
        text: p.n,
        extend: p.v,
        style: {
          "background-color": "#EFD"
        }
      };
    });
    PathsArray.push({
      id: "bt_mjs",
      text: "秘境",
      style: {
        background: "#EFD",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "160px",
        "margin-top": "-75px"
      },
      children: mjArray
    });
    PLU.autoChushi = function () {
      var family = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
      var master = PLU.YFD.masterList.slice(0, 32).find(function (e) {
        return e["in"] == family;
      });
      if (master == undefined) return;
      var npc = PLU.queryNpc("^" + master.npc.slice(-1)[0] + "$", true);
      if (!npc.length) return;
      var way = npc[0].way;
      //PLU.ONOFF["bt_kg_teamSync"] = 0;
      PLU.execActions(way, function () {
        var npc = UTIL.findRoomNpcReg("^" + master.npc.slice(-1)[0] + "$");
        if (!npc) return;
        var key = npc.key;
        PLU.execActions("apprentice " + key, function () {
          PLU.autoFight({
            targetKey: key,
            fightKind: "fight",
            autoSkill: "multi",
            onEnd: function onEnd() {
              PLU.execActions("chushi " + key, function () {
                if (family == "铁雪山庄") PLU.execActions("chushi resort_master");
              });
            },
            onFail: function onFail() {
              PLU.autoFight({
                targetKey: key,
                fightKind: "chushi",
                autoSkill: "multi",
                onEnd: function onEnd() {
                  PLU.execActions("chushi " + key);
                }
              });
            }
          });
        });
      });
    };
    var masterArray = PLU.YFD.masterList.map(function (p, i) {
      if (i == 32) return {
        id: "bt_master_33",
        text: p.n,
        extend: p.v,
        style: {
          "background-color": "#FBB",
          width: "88px",
          padding: "5px 2px"
        }
      };
      var colr = i < 10 ? "#FCF" : i < 20 ? "#CFF" : "#FFC";
      return {
        id: "bt_master_" + (i + 1),
        text: p.n,
        children: function () {
          if (!PLU.developerMode) return [];
          return [{
            id: "bt_master_" + (i + 1) + "_0",
            text: "拜入" + p.n,
            extend: {
              func: function func() {
                return send_prompt(" 是否确定要加入" + p["in"] + "\n\n\n\n", "home apprentice " + p["in"], "确定", 0);
              }
            },
            style: {
              "background-color": colr
            }
          }];
        }().concat(p.npc.map(function (name, j) {
          return {
            id: "bt_master_" + (i + 1) + "_" + (j + 1),
            text: name.split("@").slice(-1)[0],
            extend: PLU.queryNpc(name + "道", true)[0].way,
            style: {
              "background-color": colr
            }
          };
        })),
        style: {
          "background-color": colr,
          width: "40px",
          padding: "5px 2px"
        },
        menuStyle: function () {
          if (i & 1) return {
            right: "101px",
            width: "160px"
          };
          return {
            width: "160px"
          };
        }()
      };
    });
    PathsArray.push({
      id: "bt_masters",
      text: "师门",
      style: {
        background: "#FCF",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "96px",
        "margin-top": "-125px"
      },
      children: masterArray
    });
    var dailyArray = PLU.YFD.dailyList.map(function (p, i) {
      var colr = i < 2 ? "#DDFFDD" : i < 8 ? "#FFC" : i < 22 ? "#FCF" : "#CFF";
      return {
        id: "bt_daily_" + (i + 1),
        text: p.n,
        extend: p.v,
        style: {
          "background-color": colr
        }
      };
    });
    PathsArray.push({
      id: "bt_daily",
      text: "日常",
      style: {
        background: "#FED",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "160px",
        "margin-top": "-125px"
      },
      children: dailyArray
    });
    var usualArray = PLU.YFD.usualList.map(function (p, i) {
      var sty = p.style || {
        "background-color": "#CDF"
      };
      return {
        id: "bt_usual_" + (i + 1),
        text: p.n,
        extend: p.v,
        style: sty
      };
    });
    PathsArray.push({
      id: "bt_usual",
      text: "常用",
      style: {
        background: "#CDF",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        width: "160px",
        "margin-top": "-210px"
      },
      children: usualArray
    });
    var cts = [],
      libCity = PLU.YFD.mapsLib.Npc.filter(function (e) {
        if (!cts.includes(e.jh)) {
          cts.push(e.jh);
          return true;
        }
        return false;
      }).map(function (e) {
        return e.jh;
      });
    var queryJHMenu = libCity.map(function (c, i) {
      return {
        id: "bt_queryjh_" + (i + 1),
        text: c,
        style: {
          width: "50px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: "12px"
        },
        extend: {
          func: PLU.queryJHMenu,
          param: c
        }
      };
    });
    var queryArray = [{
      id: "bt_queryJHList",
      text: "章节",
      children: queryJHMenu,
      style: {
        width: "40px",
        "background-color": "#9ED"
      },
      menuStyle: {
        width: "180px",
        "margin-top": "-180px"
      }
    }, {
      id: "bt_queryHistory",
      text: "历史",
      style: {
        width: "40px",
        "background-color": "#FDD"
      },
      extend: {
        func: PLU.toQueryHistory
      }
    }, {
      id: "bt_queryNpc",
      text: "寻人",
      style: {
        width: "40px",
        "background-color": "#FDD"
      },
      extend: {
        func: PLU.toQueryNpc
      }
    }, {
      id: "bt_pathNpc",
      text: "扫图",
      style: {
        width: "40px",
        "background-color": "#FE9"
      },
      extend: {
        func: PLU.toPathNpc
      }
    }, ];
    PathsArray.push({
      id: "bt_query",
      text: "查找",
      style: {
        background: "#9ED",
        width: "40px",
        padding: "5px 2px"
      },
      menuStyle: {
        "margin-top": "-30px"
      },
      children: queryArray
    });
    YFUI.addMenu({
      id: "m_paths",
      groupId: "pluginMenus",
      text: "导航",
      style: {
        background: "#CCFFFF",
        width: "40px",
        padding: "5px 2px"
      },
      multiCol: true,
      menuStyle: {
        width: "80px",
        "margin-top": "-25px"
      },
      children: PathsArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend) {
          $(".menu").hide();
          if ($btn.$extend.func) {
            if ($btn.$extend.param) $btn.$extend.func($btn, $btn.$extend.param); else $btn.$extend.func($btn);
            return;
          }
          PLU.execActions($btn.$extend, function () {
            if ($btn.text() == "去哈日") PLU.goHaRi();
            if ($btn.text() == "杭界山") PLU.goHJS();
          });
          // clickButton($btn.$extend)
        }
      }
    });
    //auto do something
    var somethingArray = [];
    somethingArray.push({
      id: "bt_autoTeach",
      text: "传授技能",
      extend: {
        func: PLU.toAutoTeach
      },
      style: {
        background: "#BFF"
      }
    });
    somethingArray.push({
      id: "bt_autoUpgrade",
      text: "升级游侠",
      extend: {
        func: PLU.toAutoUpgrade
      },
      style: {
        background: "#BFF"
      }
    });
    somethingArray.push({
      id: "hr_null2",
      text: "",
      style: {
        display: "none"
      },
      boxStyle: {
        display: "block",
        height: "5px"
      }
    });
    somethingArray.push({
      id: "bt_autoLearn",
      text: "一键学习",
      extend: {
        func: PLU.toAutoLearn
      },
      style: {
        background: "#FBF"
      }
    });
    somethingArray.push({
      id: "bt_autoChuaiMo",
      text: "自动揣摩",
      extend: {
        func: PLU.toAutoChuaiMo
      },
      style: {
        background: "#FBF"
      }
    });
    somethingArray.push({
      id: "hr_null2",
      text: "",
      style: {
        display: "none"
      },
      boxStyle: {
        display: "block",
        height: "5px"
      }
    });
    somethingArray.push({
      id: "bt_loopScript",
      text: "循环执行",
      extend: {
        func: PLU.toLoopScript
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_loopKillByN",
      text: "计数击杀",
      extend: {
        func: PLU.toLoopKillByN
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_waitCDKill",
      text: "倒计时杀",
      extend: {
        func: PLU.toWaitCDKill
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_loopKillName",
      text: "名字连杀",
      extend: {
        func: PLU.toLoopKillName
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_loopClick",
      text: "自动点击",
      extend: {
        func: PLU.toLoopClick
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_loopSlowClick",
      text: "慢速点击",
      extend: {
        func: PLU.toLoopSlowClick
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_autoLianXi",
      text: "自动练习",
      extend: {
        func: PLU.toAutoLianXi
      },
      style: {
        background: "#FBF"
      }
    });
    somethingArray.push({
      id: "bt_record",
      text: "指令录制",
      extend: {
        func: PLU.toRecord
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "hr_null2",
      text: "",
      style: {
        display: "none"
      },
      boxStyle: {
        display: "block",
        height: "5px"
      }
    });
    somethingArray.push({
      id: "bt_sellLaji",
      text: "批量出售",
      extend: {
        func: PLU.toSellLaji
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_splitItem",
      text: "批量分解",
      extend: {
        func: PLU.toSplitItem
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_putStore",
      text: "批量入库",
      extend: {
        func: PLU.toPutStore
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_autoUse",
      text: "批量使用",
      extend: {
        func: PLU.toAutoUse
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_combineGem",
      text: "合成宝石",
      extend: {
        func: PLU.openCombineGem
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_autoMasterGem",
      text: "一键合天神",
      extend: {
        func: PLU.autoMasterGem
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "hr_null2",
      text: "",
      style: {
        display: "none"
      },
      boxStyle: {
        display: "block",
        height: "5px"
      }
    });
    somethingArray.push({
      id: "bt_autoXTL1",
      text: "刷琅嬛玉洞",
      extend: {
        func: PLU.autoXTL1
      },
      style: {
        background: "#FED"
      }
    });
    somethingArray.push({
      id: "bt_autoXTL2",
      text: "刷山崖",
      extend: {
        func: PLU.autoXTL2
      },
      style: {
        background: "#FED"
      }
    });
    somethingArray.push({//小龙人
        id: "bt_kg_finddragon",
        text: "找龙人",
        extend: {
          func: PLU.toFindDragon
        },
        style: {
          background: "#EBC"
        }
    });
    somethingArray.push({
      id: "bt_autoERG",
      text: "刷恶人谷",
      extend: {
        func: PLU.autoERG
      },
      style: {
        background: "#FED"
      }
    });

    if (PLU.developerMode) somethingArray.push({
      id: "bt_searchBangQS",
      text: "扫暴击",
      extend: {
        func: PLU.scanPuzzle
      },
      style: {
        background: "#BBF"
      }
    });

    somethingArray.push({
      id: "hr_null2",
      text: "",
      style: {
        display: "none"
      },
      boxStyle: {
        display: "block",
        height: "5px"
      }
    });
    somethingArray.push({
      id: "bt_autoGetKey",
      text: "自动捡物品",
      extend: {
        func: PLU.toAutoGetKey
      },
      style: {
        background: "#EBC"
      }
    });
    somethingArray.push({
      id: "bt_autoMoke",
      text: "一键摹刻",
      extend: {
        func: PLU.toAutoMoke
      },
      style: {
        background: "#EFD"
      }
    });
    somethingArray.push({
      id: "bt_autoKillZYY",
      text: "刷祝玉妍",
      extend: {
        func: PLU.toAutoKillZYY
      },
      style: {
        background: "#FBF"
      }
    });
    somethingArray.push({
      id: "bt_autoJHYL",
      text: "九花原料",
      extend: {
        func: PLU.buyJHYL
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_loopReadBase",
      text: "读技能书",
      extend: {
        func: PLU.toLoopReadBase
      },
      style: {
        background: "#FBB"
      }
    });
    somethingArray.push({
      id: "bt_checkYouxia",
      text: "技能检查",
      extend: {
        func: PLU.checkYouxia
      },
      style: {
        background: "#DEF"
      }
    });
    somethingArray.push({
      id: "bt_searchFamilyQS",
      text: "搜师门任务",
      extend: {
        func: PLU.toSearchFamilyQS
      },
      style: {
        background: "#BBF"
      }
    });
    somethingArray.push({
      id: "bt_searchBangQS",
      text: "搜帮派任务",
      extend: {
        func: PLU.toSearchBangQS
      },
      style: {
        background: "#BBF"
      }
    });
    somethingArray.push({
      id: "bt_autoFB11",
      text: "自动本11",
      extend: {
        func: PLU.autoFB11
      },
      style: {
        background: "#FC9"
      }
    });
    somethingArray.push({
      id: "bt_autoFB10",
      text: "自动本10",
      extend: {
        func: PLU.autoFB10
      },
      style: {
        background: "#FED"
      }
    });
    somethingArray.push({
      id: "bt_autoaskTianmd",
      text: "讨天命",
      extend: {
        func: PLU.askTianmd
      },
      style: {
        background: "#55ffff"
      }
    });
    somethingArray.push({
      id: "bt_autoyoumhy",
      text: "幽冥后院",
      extend: {
        func: PLU.autoyoumhy
      },
      style: {
        background: "#FED"
      }
    });
    YFUI.addMenu({
      id: "m_autoDoSomething",
      groupId: "pluginMenus",
      text: "自动",
      style: {
        width: "40px"
      },
      multiCol: true,
      menuStyle: {
        width: "160px",
        "margin-top": "-61px"
      },
      children: somethingArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend) {
          $(".menu").hide();
          $btn.$extend.func($btn);
        }
      }
    });
    //listens
    var listensArray = [];
    listensArray.push({
      id: "bt_autoBF",
      text: "自动帮四",
      extend: {
        key: "autoBF"
      },
      style: {
        background: "#EDC"
      }
    });
    listensArray.push({
      id: "bt_autoB6",
      text: "自动帮六",
      extend: {
        key: "autoB6"
      },
      style: {
        background: "#ECD"
      }
    });
    listensArray.push({
      id: "bt_autoB5F",
      text: "帮五跟杀",
      extend: {
        key: "autoB5F"
      },
      style: {
        background: "#CEF"
      }
    });
    listensArray.push({
      id: "bt_autoTP",
      text: "持续突破",
      extend: {
        key: "autoTP"
      },
      style: {
        background: "#BEF"
      }
    });
    listensArray.push({
      id: "bt_autoHYC",
      text: "持续睡床",
      extend: {
        key: "autoHYC"
      },
      style: {
        background: "#CEC"
      }
    });
    listensArray.push({
      id: "bt_autoDZ",
      text: "持续打坐",
      extend: {
        key: "autoDZ"
      },
      style: {
        background: "#CEC"
      }
    });
    listensArray.push({
      id: "bt_autoLX",
      text: "持续练习",
      extend: {
        key: "autoLX"
      },
      style: {
        background: "#CEC"
      }
    });
    listensArray.push({
      id: "bt_autoConnect",
      text: "自动重连",
      extend: {
        key: "autoConnect"
      },
      style: {
        background: "#FED"
      }
    });
    listensArray.push({
      id: "bt_autoDY",
      text: "持续钓鱼",
      extend: {
        key: "autoDY"
      },
      style: {
        background: "#BEF"
      }
    });
    
    listensArray.push({
      id: "bt_auto9H",
      text: "持续九花",
      extend: {
        key: "auto9H"
      },
      style: {
        background: "#BEF"
      }
    });
    listensArray.push({
      id: "bt_autoCaicha",
      text: "持续采茶",
      extend: {
        key: "autoCaicha"
      },
      style: {
        background: "#BEF"
      }
    });
    listensArray.push({
      id: "bt_autoQuitTeam",
      text: "进塔离队",
      extend: {
        key: "autoQuitTeam"
      },
      style: {
        background: "#EEF"
      }
    });
    listensArray.push({
      id: "bt_autoSignIn",
      text: "定时签到",
      extend: {
        key: "autoSignIn"
      },
      style: {
        background: "#BEF"
      }
    });
    
    listensArray.push({
      id: "hr_listen",
      text: "",
      style: {
        width: "160px",
        opacity: 0
      },
      boxStyle: {
        "font-size": 0
      }
    });
    listensArray.push({
      id: "bt_listenQL",
      text: "本服青龙",
      extend: {
        key: "listenQL"
      }
    });
    listensArray.push({
      id: "bt_listenKFQL",
      text: "广场青龙",
      extend: {
        key: "listenKFQL"
      }
    });
    listensArray.push({
      id: "bt_listenYX",
      text: "游侠",
      extend: {
        key: "listenYX"
      }
    });
    listensArray.push({
      id: "bt_listenTF",
      text: "夜魔逃犯",
      extend: {
        key: "listenTF"
      }
    });
    /*
    listensArray.push({
      id: "bt_listenPuzzle",
      text: "暴击谜题",
      extend: {
        key: "listenPuzzle"
      }
    });
    */
    listensArray.push({
      id: "bt_showMPFZ",
      text: "纷争显示",
      extend: {
        func: PLU.showMPFZ
      },
      style: {
        background: "#EEEEFF"
      }
    });
    listensArray.push({
      id: "bt_listenChat",
      text: "闲聊",
      extend: {
        key: "listenChat"
      }
    });
    YFUI.addMenu({
      id: "m_listens",
      groupId: "pluginMenus",
      text: "监听",
      style: {
        background: "#DDFFDD",
        width: "40px"
      },
      multiCol: true,
      menuStyle: {
        width: "160px",
        "margin-top": "-25px"
      },
      children: listensArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend) PLU.setListen($btn, $btn.$extend.key);
      }
    });
    //fightset
    var fightSetsArray = [];
    fightSetsArray.push({
      id: "bt_enableSkills",
      text: "技 能 组",
      style: {
        background: "#FBE"
      },
      menuStyle: {
        "margin-top": "-25px"
      },
      children: [{
        id: "bt_enableSkill1",
        text: "技能组1",
        extend: {
          key: "enable1"
        }
      }, {
        id: "bt_enableSkill2",
        text: "技能组2",
        extend: {
          key: "enable2"
        }
      }, {
        id: "bt_enableSkill3",
        text: "技能组3",
        extend: {
          key: "enable3"
        }
      }]
    });
    fightSetsArray.push({
      id: "bt_wearEquip",
      text: "装备切换",
      style: {
        background: "#FEB"
      },
      children: [{
        id: "bt_wearEquip1",
        text: "装备组1",
        extend: {
          key: "equip1"
        },
        canSet: true
      }, {
        id: "bt_wearEquip2",
        text: "装备组2",
        extend: {
          key: "equip2"
        },
        canSet: true
      }, {
        id: "bt_zbjianshen",
        text: "剑神套",
        extend: {
          key: "zbjianshentao"
        },
        style: {
          background: "#FEB"
        },
      }, {
        id: "bt_zbchuidiao",
        text: "垂钓套",
        extend: {
          key: "zbchuidiaotao"
        },
        style: {
          background: "#FBE"
        },
      }, {
        id: "bt_zbxianzhe",
        text: "贤者套",
        extend: {
          key: "zbxianzhetao"
        },
        style: {
          background: "#CCF"
        },
      }]
    });
    fightSetsArray.push({
      id: "bt_followKill",
      text: "跟杀设置",
      extend: {
        key: "followKill"
      },
      style: {
        background: "#FCC"
      }
    });
    fightSetsArray.push({
      id: "bt_autoCure",
      text: "血蓝设置",
      extend: {
        key: "autoCure"
      },
      style: {
        background: "#CCF"
      }
    });
    fightSetsArray.push({
      id: "bt_autoPerform",
      text: "技能设置",
      extend: {
        key: "autoPerform"
      },
      style: {
        background: "#CFC"
      }
    });
    YFUI.addMenu({
      id: "m_fightsets",
      groupId: "pluginMenus",
      text: "战斗",
      style: {
        background: "#FFDDDD",
        width: "40px"
      },
      //multiCol: true,
      menuStyle: {
        width: "80px",
        "margin-top": "-50px"
      },
      children: fightSetsArray,
      onclick: function onclick($btn, $box, BtnMode) {
        if ($btn.$extend) {
          if ($btn.$extend.key && PLU.getCache($btn.$extend.key) == 0) $(".menu").hide();
          if ($btn.$extend.key.match("enable")) return PLU.setSkillGroup($btn.$extend.key.substr(-1));
          if ($btn.$extend.key.match("equip")) {
            var equipKey = "equip_" + $btn.$extend.key.substr(-1) + "_keys";
            var equipsStr = PLU.getCache(equipKey);
            $(".menu").hide();
            if (equipsStr && BtnMode != "setting") {
              return PLU.wearEquip(equipsStr);
            }
            return PLU.setWearEquip($btn.$extend.key.substr(-1));
          }
          if ($btn.$extend.key == "zbjianshentao") return PLU.zbjianshen($btn, $btn.$extend.key);
          if ($btn.$extend.key == "zbchuidiaotao") return PLU.zbchuidiao($btn, $btn.$extend.key);
          if ($btn.$extend.key == "zbxianzhetao") return PLU.zbxianzhe($btn, $btn.$extend.key);
          if ($btn.$extend.key == "followKill") return PLU.setFightSets($btn, $btn.$extend.key);
          if ($btn.$extend.key == "autoCure") return PLU.setAutoCure($btn, $btn.$extend.key);
          if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
          if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
        }
      }
    });
    // puzzle
    var puzzleArray = [];
    if (PLU.developerMode) puzzleArray.push({
      id: "bt_puzzle_key",
      text: "通告设置",
      extend: {
        key: ""
      }
    });
    puzzleArray.push({
      id: "bt_puzzle_Key",
      text: "密码设置",
      extend: {
        func: PLU.puzzleKey
      }
    });
    if (PLU.developerMode) puzzleArray.push({
      id: "bt_puzzle_key",
      text: "进度设置",
      extend: {
        func: PLU.key
      }
    });
    puzzleArray.push({
      id: "bt_puzzle_key",
      text: "超时设置",
      extend: {
        func: PLU.puzzleTimeOut
      }
    });
    /*
    if (PLU.developerMode) YFUI.addMenu({
      id: "m_puzzle",
      groupId: "pluginMenus",
      text: "谜题",
      style: {
        background: "#CCC",
        width: "40px"
      },
      menuStyle: {
        "margin-top": "-75px"
      },
      children: puzzleArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend) {
          $(".menu").hide();
          $btn.$extend.func($btn);
        }
      }
    });
    */
    //Sign
    var signArray = [];
    signArray.push({
      id: "bt_answerQues",
      text: "自动答题",
      extend: {
        func: PLU.answerQues
      },
      style: {
        background: "#DEF"
      },
    });
    signArray.push({
      id: "bt_autoAskQixia",
      text: "自动问奇侠",
      extend: {
        func: PLU.toAutoAskQixia
      }
    });
    signArray.push({
      id: "bt_autoVisitQixia",
      text: "亲近奇侠",
      style: {
        background: "#CFC"
      },
      extend: {
        func: PLU.toAutoVisitQixia
      }
    });
    signArray.push({
      id: "hr_dlus",
      text: "",
      style: {
        width: "240px",
        opacity: 0
      }
    });
    signArray.push({
      id: "bt_ricrw",
      text: "日常周常",
      extend: {
        key: "ricrw"
      },
      style: {
        background: "#FBE"
      }
    });
    signArray.push({
      id: "bt_sign",
      text: "一键签到",
      extend: {
        key: "signIn"
      },
      style: {
        background: "#CCFFFF"
      }
    });
    YFUI.addMenu({
      id: "m_signs",
      groupId: "pluginMenus",
      text: "签到",
      style: {
        background: "#DDFFFF",
        width: "40px"
      },
      menuStyle: {
        "margin-top": "-92px"
      },
      children: signArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend) {
          if ($btn.$extend.key == "signIn") {
            $(".menu").hide();
            return PLU.toSignIn();
          } else if ($btn.$extend.key == "autoSignIn") {
            return PLU.setListen($btn, $btn.$extend.key);
          } else if ($btn.$extend.key == "ricrw") {
            $(".menu").hide();
            return PLU.toricrw();
          } else if ($btn.$extend.key == "autoricrw") {
            return PLU.setListen($btn, $btn.$extend.key);
          } else {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        }
      }
    });
    //sys
    var sysArray = [];
    sysArray.push({
      id: "bt_openTeam",
      text: "开队伍",
      children: [{
        id: "bt_openTeam1",
        text: "加入队伍",
        extend: {
            func: PLU.asJirudw
        },
        style: {
            background: "#DEF"
        },
      }, {
        id: "bt_openTeam2",
        text: "退出队伍",
        extend: "team quit",
      }, {
        id: "bt_openTeam3",
        text: "重开队伍",
        extend: "team create",
        style: {
          background: "#00ff00"
        },
      }
    ]
    });
    sysArray.push({
      id: "bt_openFudi",
      text: "开府邸",
      extend: "fudi"
    });
    sysArray.push({
      id: "bt_openShop",
      text: "开商城",
      extend: "shop"
    });
    sysArray.push({
      id: "bt_openJFShop",
      text: "积分商城",
      extend: "shop xf_shop"
    });
    sysArray.push({
      id: "bt_open4HShop",
      text: "四海商店",
      children: [{
        id: "bt_open4HShop1",
        text: "回收",
        extend: "reclaim recl"
      }, {
        id: "bt_open4HShop2",
        text: "兑换",
        extend: "reclaim buy"
    }, {
        id: "bt_open4HShop3",
        text: "宝箱兑换",
        extend: "reclaim change"//event_1_4500617
      }
    ]
    });
    sysArray.push({
      id: "bt_clanShop",
      text: "帮派商店",
      extend: "clan;clan_shop;"
    });
    sysArray.push({
      id: "bt_clanShop",
      text: "浣花剑阵",
      extend: "hhjz;"
    });
    sysArray.push({
        id: "bt_huanpf",
        text: "换皮肤",
        extend: {
          func: PLU.huanpf
        },
        style: {
          background: "#DEF"
        }
      });
    /*
    sysArray.push({
        id: "bt_cuiquShop",
        text: "熔炼",
        extend: "event_1_15136162;",
        style: { background: "#DEF"},
      });
    sysArray.push({
        id: "bt_cuiquShop",
        text: "萃取",
        extend: "event_1_33471583;",
        style: {
            background: "#DEF"
        },
    });
        */
    sysArray.push({
      id: "hr_sys",
      text: "",
      style: {
        width: "160px",
        opacity: 0
      },
      boxStyle: {
        "font-size": 0
      }
    });
    sysArray.push({
      id: "bt_intervene",
      text: "杀隐藏怪",
      extend: {
        func: PLU.intervene
      }
    });
    sysArray.push({
      id: "bt_openQixia",
      text: "奇侠列表",
      extend: "open jhqx"
    });
    sysArray.push({
        id: "bt_openzbei",
        text: "装备兑换",
        style: {
          background: "#DEF"
        },
        children: [{
          id: "bt_openzbei1",
          text: "购买斩龙",
          extend: { func: PLU.buyzl10 },
        }, {
          id: "bt_openzbei2",
          text: "兑换胤天",
          extend: { func: PLU.dhyt11 },
        }, {
          id: "bt_openzbei3",
          text: "兑换皇天",
          extend: { func: PLU.dhht12 },
      }, {
          id: "bt_openzbei8",
          text: "兑换冰材",
          extend: { func: PLU.dhbingy },
        }, {
          id: "bt_openzbei4",
          text: "打造冰月",
          extend: { func: PLU.dzbingy },
        }, {
          id: "bt_openzbei5",
          text: "兑换剑神",
          extend: { func: PLU.dhjians },
          style: {  background: "#FEB" },
        }, {
          id: "bt_openzbei6",
          text: "兑换垂钓",
          extend: { func: PLU.dhchuid },
          style: {  background: "#FBE" },
        }, {
          id: "bt_openzbei7",
          text: "兑换贤者",
          extend: { func: PLU.dhzxianz },
          style: {  background: "#CCF" },
        }
       ]
      });
    
    sysArray.push({
      id: "bt_task",
      text: "谜题列表",
      extend: "task_quest"
    });
    sysArray.push({
        id: "bt_openfscail",
        text: "取飞升材料",
        style: { background: "#DEF"},
        children: [{
          id: "bt_openfscail1",
          text: "金身材料",
          extend: "items get_store /obj/book/neigongxinfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/jiuyinxuanbingjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_lzjsj;"
        }, {
          id: "bt_openfscail2",
          text: "龙爪材料",
          extend: "items get_store /obj/book/pujigedoumiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/tianshanfeijiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/lanbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_zlzs;"
        }, {
          id: "bt_openfscail3",
          text: "湿剑材料",
          extend: "items get_store /obj/book/jibenjianfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/baifashenjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/zishuijing8;items get_store /obj/med/jinengtianshu;items info obj_shjj;"
        }, {
            id: "bt_openfscail4",
            text: "强身材料",
            extend: "items get_store /obj/book/neigongxinfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/xiaoyunlongtengjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_lsqss;"
        }, {
            id: "bt_openfscail5",
            text: "万剑材料",
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/wjgz_miji;items info obj_wjgz_miji;"
        }, {
            id: "bt_openfscail6",
            text: "如来材料",
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/rlzj_miji;items info obj_rlzj_miji;"
        }, {
            id: "bt_openfscail7",
            text: "仙步材料",
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/zydsb_miji;items info obj_zydsb_miji;"
        }
      ]
      });
      sysArray.push({
        id: "bt_cleartask",
        text: "清谜题",
        extend: "auto_tasks cancel"
      });
    
    sysArray.push({
      id: "hr_sys",
      text: "",
      style: {
        width: "160px",
        opacity: 0
      },
      boxStyle: {
        "font-size": 0
      }
    });
    
    sysArray.push({
      id: "set_profile",
      text: "个人设置",
      extend: { key: "profileSetting" },
      style: { background: "#EEEEFF" },
    });
    sysArray.push({
      id: "bt_log",
      text: "消息日志",
      extend: {
        func: PLU.showLog
      },
      style: {
        background: "#99CC00"
      }
    });
    sysArray.push({
      id: "bt_upset",
      text: "备份设置",
      extend: {
        func: PLU.backupSetting
      },
      style: {
        background: "#FFAAAA"
      }
    });
    sysArray.push({
      id: "bt_dlset",
      text: "载入设置",
      extend: {
        func: PLU.loadSetting
      },
      style: {
        background: "#FFCC00"
      }
    });
    YFUI.addMenu({
      id: "m_sys",
      groupId: "pluginMenus",
      text: "工具",
      multiCol: true,
      style: { background: "#FFFFDD", width: "40px" },
      menuStyle: { width: "160px", "margin-top": "-117px" },
      children: sysArray,
      onclick($btn, $box) {
        if ($btn.$extend) {
          if ($btn.$extend.key == "profileSetting") {
            $(".menu").hide();
            return PLU.profileSetting();
          } else if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            $(".menu").hide();
            PLU.execActions($btn.$extend);
          }
        }
      },
    });
    //个人增加
    var SgerenArray = [];
    SgerenArray.push({
      id: "bt_autoQuyijiy",
      text: "取一级玉",
      extend: {
        func: PLU.Quyijiy
      }
    });
    SgerenArray.push({
      id: "bt_autoQuTianss",
      text: "取天神",
      extend: {
        func: PLU.QuTianss
      },
      style: {
        background: "#ff5555"
      }
    });
    SgerenArray.push({
      id: "bt_autoDianLiCai",
      text: "文庙超投",
      extend: {
        func: PLU.DianLiCai
      },
      style: {
        background: "#FBE"
      }
    });
    SgerenArray.push({
      id: "bt_autoQuLiCai",
      text: "取理财",
      extend: {
        func: PLU.QuLiCai
      },
      style: {
        background: "#bbbb00"
      }
    });
    SgerenArray.push({
      id: "bt_autoXuelian",
      text: "买雪莲",
      extend: {
        func: PLU.buyXueLian
      },
      style: {
        background: "#DEF"
      }
    });
    SgerenArray.push({
      id: "bt_autoeatHuoG",
      text: "吃火锅",
      extend: {
        func: PLU.eatHuoG
      },
      style: {
        background: "#55ffff"
      }
    });
    SgerenArray.push({
      id: "bt_autobuping",
      text: "吃补品",
      extend: {
        func: PLU.eatbuping
      },
      style: {
        background: "#DEF"
      }
    });
    SgerenArray.push({
      id: "bt_autoLLBao",
      text: "礼包",
      extend: {
        func: PLU.LLBao
      },
      style: {
        background: "#DEF"
      }
    });
   
    //SgerenArray.push({ id: "bt_autoaskTianmd", text: "讨天命", extend: { func: PLU.askTianmd }, style: { background: "#55ffff" } });
    //SgerenArray.push({ id: "bt_autoChuangLou", text: "闯楼", extend: { func: PLU.autoChuangLou }, style: { background: "#DEF" } });
    SgerenArray.push({
      id: "bt_autoLongsjs",
      text: "龙神祭祀",
      extend: {
        func: PLU.Longsjs
      },
      style: {
        background: "#55ffff"
      }
    });
    SgerenArray.push({
      id: "bt_autoYandijd",
      text: "炎帝祭典",
      extend: {
        func: PLU.Yandijd
      },
      style: {
        background: "#55ffff"
      }
    });
    SgerenArray.push({
      id: "bt_autoeatSans",
      text: "用三生",
      extend: {
        func: PLU.eatSans
      },
      style: {
        background: "#55ffff"
      }
    });
    SgerenArray.push({
      id: "bt_autocaomeibs",
      text: "草莓冰沙",
      extend: {
        func: PLU.caomeibs
      },
      style: {
        background: "#FBE"
      }
    });
    
    SgerenArray.push({
      id: "bt_autochoujiang",
      text: "去抽奖",
      extend: {
        func: PLU.choujiang
      },
      style: {
        background: "#FFFF55"
      },
    });
    SgerenArray.push({
      id: "bt_autogivehuf",
      text: "交虎符",
      extend: {
        func: PLU.givehuf
      },
      style: {
        background: "#E19100"
      },
    });
    SgerenArray.push({
      id: "bt_antoxuetyz",
      text: "雪亭驿站",
      extend: {
        func: PLU.xuetyz
      },
      style: {
        background: "#DDFFDD"
      },
    });
    SgerenArray.push({
        id: "bt_antoLongsyj",
        text: "龙神遗迹",
        extend: {
          func: PLU.Longsyj
        },
        style: {
          background: "#DDFFDD"
        },
      });
      SgerenArray.push({
        id: "bt_autokillXLR",
        text: "刷小龙人",
        extend: {
          func: PLU.killXLR
        },
        style: {
          background: "#FFFF99"
        },
      });
      SgerenArray.push({
        id: "bt_autoningjlp",
        text: "凝聚力魄",
        extend: {
          func: PLU.ningjlp
        },
        style: {
          background: "#FBB"
        },
      });
      SgerenArray.push({
        id: "bt_autosaoxlr",
        text: "打小龙人",
        extend: {
          func: PLU.saoxlr
        },
        //style: {background: "#FFFF99"},
      });
      
      SgerenArray.push({
        id: "bt_autonstbj",
        text: "石头暴击",
        extend: {
          func: PLU.saodbjst
        },
        //style: {background: "#FBB"},
      });
      /*
      SgerenArray.push({
        id: "bt_autoqiangss",
        text: "学强身术",
        extend: {
          func: PLU.LZqiangss
        },
        style: {
          background: "#DEF"
        },
      });  */
    //if (PLU.PersonalMode) {
    YFUI.addMenu({
      id: "m_Sgeren",
      groupId: "pluginMenus",
      text: "个人",
      multiCol: true,
      style: {
        background: "#FBE",
        width: "40px"
      },
      menuStyle: {
        width: "160px",
        "margin-top": "-117px"
      },
      children: SgerenArray,
      onclick: function onclick($btn, $box) {
        if ($btn.$extend && $btn.$extend.func) {
          $(".menu").hide();
          $btn.$extend.func($btn);
        } else if ($btn.$extend) {
          $(".menu").hide();
          PLU.execActions($btn.$extend);
        }
      }
    });
    //}
    //================================================================================
    //  活动
    //================================================================================
    // let activeArray=[]
    // activeArray.push({id:"bt_goShop1", text:"去小二", extend:"jh 1;"})
    // activeArray.push({id:"bt_buyItem1", text:"买四样", extend:"#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;"})
    // activeArray.push({id:"bt_goShop2", text:"去掌柜", extend:"jh 5;n;n;n;w;", style:{background:"#FDD"}})
    // activeArray.push({id:"bt_buyItem2", text:"买红粉", extend:"#6 buy_npc_item go 0;", style:{background:"#FDD"}})
    // activeArray.push({id:"bt_goShop3", text:"去小贩", extend:"jh 2;n;n;n;n;e;", style:{background:"#DEF"}})
    // activeArray.push({id:"bt_buyItem3", text:"买黄粉", extend:"#6 event_1_17045611 go 0;", style:{background:"#DEF"}})
    // activeArray.push({id:"bt_goShop4", text:"去峨眉", extend:"jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill?看山弟子;n;n;n;n;w;", style:{background:"#EFE"}})
    // activeArray.push({id:"bt_buyItem4", text:"买蓝粉", extend:"#6 event_1_39153184 go 0;", style:{background:"#EFE"}})
    // activeArray.push({id:"bt_goAll", text:"一键买材料", extend:"jh 1;#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;jh 5;n;n;n;w;#6 buy_npc_item go 0;jh 2;n;n;n;n;e;#6 event_1_17045611 go 0;jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill?看山弟子;n;n;n;n;w;#6 event_1_39153184 go 0;", style:{background:"#9F9"}})
    // activeArray.push({id:"bt_goShoot", text:"去放烟花", extend:"jh 2;n;n;n;", style:{background:"#FD9"}})
    // // activeArray.push({id:"bt_n", text:"", style:{opacity:0}})
    // // activeArray.push({id:"hr_sys", text:"", style:{width:"160px",opacity:0}, boxStyle:{"font-size":0}})
    // activeArray.push({id:"bt_goShoot1", text:"一键璀璨", extend:"#5 event_1_99582507;#15 event_1_48376442;", style:{background:"#F9D"}})
    // activeArray.push({id:"bt_goShoot2", text:"一键四款", extend:"#5 event_1_74166959;#5 event_1_10053782;#5 event_1_25918230;#5 event_1_48376442;", style:{background:"#D9F"}})
    // YFUI.addMenu({
    //     id: "m_active",
    //     groupId:"pluginMenus",
    //     text: "元宵",
    //     multiCol: true,
    //     style:{"background":"#FFFF55","width":"40px","margin-top":"25px"},
    //     menuStyle: {width: "160px","margin-top":"-22px"},
    //     children: activeArray,
    //     onclick($btn,$box){
    //         if($btn.$extend && $btn.$extend.func){
    //             //$(".menu").hide()
    //             $btn.$extend.func($btn)
    //         }else if($btn.$extend){
    //             //$(".menu").hide()
    // 			PLU.execActions($btn.$extend,()=>{
    // 				YFUI.writeToOut("<span style='color:#FFF;'>========== OK ==========</span>")
    // 			})
    // 		}
    //     }
    // })
    //========实验田===================================================
    if (PLU.developerMode) {
      var flagArray = [];
      flagArray.push({
        id: "bt_npcDataUpdate",
        text: "数据更新",
        extend: {
          func: PLU.npcDataUpdate
        }
      });
      flagArray.push({
        id: "bt_pathNpc",
        text: "全图谜题",
        extend: {
          func: PLU.toQueryMiTi
        },
        style: {
          "background-color": "#00bbbb"
        },
      });
      flagArray.push({
        id: "bt_puzzle_key",
        text: "通告设置",
        extend: {
          key: ""
        }
      });
      flagArray.push({
        id: "bt_puzzle_Key",
        text: "密码设置",
        extend: {
          func: PLU.puzzleKey
        }
      });
      flagArray.push({
        id: "bt_puzzle_key",
        text: "进度设置",
        extend: {
        func: PLU.key
        }
      });
      flagArray.push({
        id: "bt_puzzle_key",
      text: "超时设置",
      extend: {
        func: PLU.puzzleTimeOut
        }
      });


      YFUI.addMenu({
        id: "m_flag",
        groupId: "pluginMenus",
        text: "专属",
        multiCol: true,
        style: {
          background: "#FBB",
          width: "40px"
        },
        menuStyle: {
          width: "160px",
          "margin-top": "-117px"
        },
        children: flagArray,
        onclick: function onclick($btn, $box) {
          if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            $(".menu").hide();
            PLU.execActions($btn.$extend);
          }
        }
      });
    }
    //================================================================================
    //================================================================================
    var gh = parseInt($("#page").height() * $("#page").height() * 0.00025);
    YFUI.addBtn({
      id: "bt_col_null",
      groupId: "pluginMenus",
      text: "",
      style: {
        background: "transparent",
        height: gh + "px",
        width: "0px",
        visibility: "hidden"
      },
      boxStyle: {
        "pointer-events": "none"
      }
    });
    //战斗按钮
    YFUI.addBtn({
      id: "bt_kg_autoEscape",
      groupId: "pluginMenus",
      text: "逃跑",
      style: {
        background: "#DDCCEE",
        height: "20px",
        width: "40px"
      },
      // boxStyle:{"margin-bottom":"15px"},
      onclick: function onclick($btn) {
        var btnFlag = PLU.setBtnRed($btn);
        if (btnFlag) {
          PLU.autoEscape({
            onEnd: function onEnd() {
              PLU.setBtnRed($btn);
            }
          });
        } else UTIL.delSysListener("onAutoEscape");
      }
    });
    YFUI.addBtn({
      id: "bt_kg_loopKill",
      groupId: "pluginMenus",
      text: "循环杀",
      style: {
        background: "#EECCCC",
        height: "20px",
        width: "40px"
      },
      // boxStyle:{"margin-bottom":"15px"},
      onclick: function onclick($btn) {
        PLU.toLoopKill($btn);
      }
    });
    YFUI.addBtn({
      id: "bt_kg_teamSync",
      groupId: "pluginMenus",
      text: "同步",
      style: {
        background: "#DDCCEE",
        height: "20px",
        width: "40px"
      },
      boxStyle: {
        "margin-bottom": "15px"
      },
      onclick: function onclick($btn) {
        PLU.toggleTeamSync($btn);
      }
    });
    YFUI.addBtn({
      id: "bt_kg_followKill",
      groupId: "pluginMenus",
      text: "跟杀",
      style: {
        background: "#FFDDDD",
        height: "25px",
        width: "40px"
      },
      onclick: function onclick($btn) {
        PLU.toggleFollowKill($btn, "followKill");
      }
    });
    YFUI.addBtn({
      id: "bt_kg_autoCure",
      groupId: "pluginMenus",
      text: "血蓝",
      style: {
        background: "#CCCCFF",
        height: "25px",
        width: "40px"
      },
      onclick: function onclick($btn) {
        PLU.toggleAutoCure($btn, "autoCure");
      }
    });
    YFUI.addBtn({
      id: "bt_kg_autoPerform",
      groupId: "pluginMenus",
      text: "连招",
      style: {
        background: "#FFCCFF",
        height: "25px",
        width: "40px"
      },
      onclick: function onclick($btn) {
        PLU.toggleAutoPerform($btn, "autoPerform");
      }
    });
    //monitor
    var momaxW = $("#page").width() - $("#out").width() > 4 && $("#out").width() > 634 ? 475 : Math.floor($("#out").width() * 0.75);
    var leftSty = $("#page").width() - $("#out").width() > 4 && $("#page").width() > 634 ? "79px" : "12%";
    YFUI.addBtnGroup({
      id: "topMonitor",
      style: {
        position: "fixed",
        top: 0,
        left: leftSty,
        width: "75%",
        height: "15px",
        maxWidth: momaxW + "px",
        lineHeight: "1.2",
        fontSize: "11px",
        textAlign: "left",
        color: "#FF9",
        background: "rgba(0,0,0,0)",
        display: "none"
      }
    });
  },
  //================================================================================================
  getCache: function getCache(key) {
    var _PLU$CACHE$key;
    return (_PLU$CACHE$key = PLU.CACHE[key]) !== null && _PLU$CACHE$key !== void 0 ? _PLU$CACHE$key : "";
  },
  //================================================================================================
  setCache: function setCache(key, val) {
    PLU.CACHE[key] = val;
    UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
    return val;
  },
  //================================================================================================
  initStorage: function initStorage() {
    if (!UTIL.getMem("CACHE")) UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
    var caObj,
      ca = UTIL.getMem("CACHE");
    try {
      caObj = JSON.parse(ca);
    } catch (err) { }
    if (caObj) {
      PLU.CACHE = caObj;
      var listen = ["listenPuzzle", "listenChat", "listenQL", "listenTF", "listenKFQL", "listenYX", "autoDZ","autoHYC", "auto9H", "autoDY", "autoCaicha","autoTP", "autoLX", "autoBF", "autoB5F", "autoB6", "autoConnect", "autoSignIn", "autoQuitTeam"];
      for (var i = 0, len = listen.length; i < len; i++) {
        if (PLU.getCache(listen[i]) == 1) PLU.setListen($("#btn_bt_" + listen[i]), listen[i], 1);
      }
      if (PLU.getCache("listenPuzzle") == 0) {
        PLU.TMP.autotask = false;
      }
      if (PLU.getCache("followKill") == 1) {
        PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
      }
      if (PLU.getCache("autoCure") == 1) {
        PLU.toggleAutoCure($("#btn_bt_kg_autoCure"), "autoCure", 1);
      }
      if (PLU.getCache("autoPerform") >= 1) {
        PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", PLU.getCache("autoPerform"));
      }
      if (PLU.getCache("showTopMonitor") == 1) {
        PLU.showMPFZ($("#btn_bt_showMPFZ"));
      }
    }
  },
  //================================================================================================
  initHistory: function initHistory() {
    //---------------------
    document.addEventListener("addLog", PLU.updateShowLog);
    //---------------------
    var hisArr = [],
      hstr = UTIL.getMem("HISTORY");
    if (hstr) try {
      hisArr = JSON.parse(hstr);
    } catch (err) { }
    if (hisArr && hisArr.length) {
      var nowTs = new Date().getTime();
      var newArr = hisArr.filter(function (h) {
        UTIL.log(Object.assign({}, h, {
          isHistory: true
        }));
        if (nowTs - h.time > 43200000) return false;
        return true;
      });
      UTIL.logHistory = newArr;
      UTIL.setMem("HISTORY", JSON.stringify(newArr));
    }
    PLU.MPFZ = UTIL.getMem("MPFZ") ? JSON.parse(UTIL.getMem("MPFZ")) : {};
  },
  //================================================================================================
  initListeners: function initListeners() {
    //监听战斗消息
    UTIL.addSysListener("listenAllFight", function (b, type, subtype, msg) {
      if (type == "vs") {
        switch (subtype) {
          case "vs_info":
            if (b.containsKey("is_watcher")) {
              PLU.STATUS.inBattle = 2;
              break;
            }
            PLU.STATUS.inBattle = 1;
            if (!PLU.battleData) PLU.battleData = {
              skills: {},
              xdz: 0,
              myPos: 0,
              mySide: "",
              performTime: 0,
              cureTimes: 0
            };
            for (var i = b.elements.length - 1; i > -1; i--) {
              var val = b.elements[i].value + "";
              if (!val || val.indexOf(PLU.accId) < 0) continue;
              PLU.battleData.myPos = b.elements[i].key.charAt(7);
              PLU.battleData.mySide = b.elements[i].key.substring(0, 3);
              break;
            }
            PLU.STATUS.isBusy = true;
            break;
          case "ready_skill":
            if (b.get("uid").indexOf(PLU.accId) < 0 || b.get("skill") == "fight_item") break;
            if (!PLU.battleData) PLU.battleData = {
              skills: {},
              xdz: 0,
              myPos: 0,
              mySide: "",
              performTime: 0,
              cureTimes: 0
            };
            PLU.battleData.skills[b.get("pos") - 1] = {
              name: UTIL.filterMsg(b.get("name")),
              skill: b.get("skill"),
              xdz: b.get("xdz"),
              key: "playskill " + b.get("pos")
            };
            break;
          case "add_xdz":
            if (b.get("uid").indexOf(PLU.accId) < 0) break;
            if (!PLU.battleData) PLU.battleData = {
              skills: {},
              xdz: 0,
              myPos: 0,
              mySide: "",
              performTime: 0,
              cureTimes: 0
            };
            PLU.battleData.xdz = parseInt(b.get("xdz"));
            if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
              PLU.checkUseSkills();
            }
            break;
          case "playskill":
            if (b.get("uid").indexOf(PLU.accId) < 0) break;
            if (!PLU.battleData) PLU.battleData = {
              skills: {},
              xdz: 0,
              myPos: 0,
              mySide: "",
              performTime: 0,
              cureTimes: 0
            };
            var x = PLU.battleData.xdz - parseInt(b.get("lose_xdz"));
            if (parseInt(b.get("lose_xdz"))) PLU.battleData.xdz = x > 0 ? x : 0;
            break;
          case "out_watch":
            PLU.STATUS.inBattle = 0;
            PLU.STATUS.isBusy = false;
            break;
          case "combat_result":
            PLU.STATUS.inBattle = 0;
            PLU.battleData = null;
            PLU.STATUS.isBusy = false;
            if (PLU.TMP.loopUseSkill) {
              clearInterval(PLU.TMP.loopUseSkill);
              PLU.TMP.loopUseSkill = null;
            }
            break;
          default:
            break;
        }
        if (PLU.STATUS.inBattle == 1 && !PLU.TMP.loopUseSkill) {
          PLU.TMP.loopUseSkill = setInterval(function () {
            if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
              PLU.checkUseSkills();
            }
          }, 250);
        }
      }
      if (g_gmain.is_fighting && PLU.STATUS.inBattle == 1) {
        if (type == "vs" || type == "attrs_changed") {
          //自动疗伤及自动技能
          if (PLU.battleData && PLU.battleData.xdz > 1 && PLU.STATUS.inBattle == 1) {
            PLU.checkUseSkills();
          }
        }
      }
    });
    //监听场景消息
    UTIL.addSysListener("listenNotice", function (b, type, subtype, msg) {
      if (type != "notice" && type != "main_msg") return;
      if (msg.match(/闲聊|告诉|队伍/)) return;
      var msgTxt = UTIL.filterMsg(msg);
      if (msgTxt.match("你打坐完毕") && PLU.getCache("autoDZ") == 1) {
        if (UTIL.inHome()) clickButton("exercise", 0); else PLU.TODO.push({
          type: "cmds",
          cmds: "exercise",
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000
        });
      } else if ((msgTxt.match("你从寒玉床上爬起") || msgTxt.match("你从地髓石乳中出来")) && PLU.getCache("autoHYC") == 1) {
        if (UTIL.inHome()) PLU.execActions("golook_room;sleep_hanyuchuang;home"); else PLU.TODO.push({
          type: "cmds",
          cmds: "golook_room;sleep_hanyuchuang;home",
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000
        });
     } else if ((msgTxt.match("你停止了修炼。")) && PLU.getCache("autoHYC") == 1) {
        if (UTIL.inHome()) PLU.execActions("xls practice;"); else PLU.TODO.push({
          type: "cmds",
          cmds: "xls practice;",
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000
        }); 
      } else if ((msgTxt.match("你今天江湖悬红榜任务数量已经达到上限，请明天再来吧。")) && PLU.getCache("autoHYC") == 1) {
        PLU.execActions("items use obj_xuankongling;log?继续刷;");
      } else if (msgTxt.match("你今天使用九花玉露丸次数已经达到上限了")) {
        YFUI.writeToOut("<span style='color:yellow;'>九花玉露丸次数已达到上限!取消监听九花玉露丸...</span>");
        PLU.setListen($("#btn_bt_auto9H"), "auto9H", 0);
      } else if (msgTxt.match("九花玉露丸效果：") && PLU.getCache("auto9H") == 1) {
        PLU.execActions("items use obj_jiuhuayulouwan");
      /* xls practice  //开始闭关
      } else if((msgTxt.match("获得：力贯九天丸x1") || msgTxt.match("获得：力贯九天丸x1")) && PLU.getCache("autoFD") == 1){
        PLU.execActions("fudi houshan fetch;fudi shennong fetch;fudi shennong make 1;fudi shennong make 2;fudi shennong make 3;fudi shennong make 4;fudi shennong make 5;");
        YFUI.writeToOut("<span style='color:yellow;'>====收获府邸完成====</span>");
      
      } else if (msgTxt.match("毒发作了！") && !g_gmain.is_fighting) {
        var faminame = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
        if (faminame !== "铁雪山庄") {
          PLU.execActions("items use ice lotus"); //解毒
        }
      */
      } else if (type == "notice" && msg.indexOf("每日武林知识问答次数已经达到限额")>-1) {
        PLU.execActions("home;");
      } else if (msgTxt.match("病人终于心满意足")) {
        PLU.execActions("event_1_12050280;");
      } else if (msgTxt.match("本届比武大会第一名")) {
        if (UTIL.inHome()) clickButton("swords get_drop go;home;", 0); else PLU.TODO.push({
          type: "cmds",
          cmds: "swords get_drop go;home;",
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000
        });
      } else if (msgTxt.includes("领取(.*)周奖励获得") || msgTxt.includes("领取(.*)通关奖励获得")) {
        if (!msgTxt.includes("拱辰楼") || !msgTxt.includes("试炼塔")) {
            PLU.execActions("=300;home;");
        }
      } else if (msgTxt.includes("今天的游戏次数已达到上限了")) {
        PLU.execActions(";home");
        YFUI.writeToOut("<span style='color:yellow;'>---次数用完，明天再来---</span>");
      } else if (msgTxt.includes("你走着走着，不知不觉来到了(.*)楼")) {
        // curName == "风花楼" ||curName == "雪月楼" ||curName == "双树楼"
        PLU.execActions("ak;=500;ka;");
      } else if (msgTxt.match(/此技能已经达到500级了/) && PLU.getCache("autoLX") == 1) {
        if (UTIL.inHome()) PLU.autoLianXi();
      } else if (msgTxt.match(/你的(.*)成功向前突破了/) && PLU.getCache("autoTP") == 1) {
        if (UTIL.inHome()) PLU.toToPo(); else {
          var checktp = PLU.TODO.find(function (e) {
            return e.cmds == "toToPo";
          });
          if (!checktp) PLU.TODO.push({
            type: "func",
            cmds: "toToPo",
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000
          });
        }
      } else if (msgTxt.match("你现在正突破") && msgTxt.match("同时突破") || msgTxt.match("此次突破需要")) {
        //突破失败
        PLU.TMP.stopToPo = true;
      } else if (msgTxt.match("青龙会组织：")) {
        //本服青龙
        var l = msgTxt.match(/青龙会组织：(.*)正在\003href;0;([\w\d\s]+)\003(.*)\0030\003施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
        if (l && l.length > 3) {
          UTIL.log({
            msg: "【青龙】" + l[3].padStart(5) + " - " + l[1].padEnd(4) + "  奖品:" + l[4],
            type: "QL",
            time: new Date().getTime()
          });
          if (PLU.getCache("listenQL") == 1) {
            var keysStr = PLU.getCache("listenQL_keys").split("|")[1].split(",").map(function (e) {
              return e == "*" ? ".*" : e.replace("*", "\\*");
            }).join("|");
            var reg = new RegExp(keysStr);
            if (l[4].match(reg) && UTIL.inHome()) {
              PLU.goQinglong(l[1], l[3], PLU.getCache("listenQL_keys").split("|")[0], false);
            }
          }
        }
      } else if (msgTxt.match("这是你今天完成的第")) {
        //逃犯完成
        var _l = msgTxt.match(/这是你今天完成的第(\d)\/\d场逃犯任务/);
        if (_l && _l.length > 0 && _l[1] == 5) {
          YFUI.writeToOut('<span style="color:yellow;">逃犯任务已达到上限!取消逃犯监听...</span>');
          UTIL.log({
            msg: " 逃犯任务已达到上限!取消逃犯监听...",
            type: "TIPS",
            time: new Date().getTime()
          });
          PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
        }
      } else if (msgTxt.match("对你悄声道：你现在去") && !PLU.TMP.autoQixiaMijing) {
        //奇侠说秘境
        var _l2 = msgTxt.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/);
        if (_l2 && _l2.length > 2) {
          var placeData = PLU.YFD.mjList.find(function (e) {
            return e.n == _l2[2];
          });
          if (placeData) {
            YFUI.writeToOut("<span>奇侠秘境: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.execActions(\"" + placeData.v + "\")'>" + placeData.n + "</a></span>");
            YFUI.showPop({
              title: "奇侠秘境",
              text: "秘境：" + placeData.n,
              okText: "去秘境",
              onOk: function onOk() {
                PLU.execActions(placeData.v + ";find_task_road secret;", function () {
                  YFUI.writeToOut("<span>:: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='clickButton(\"open jhqx\", 0)'>奇侠列表</a></span>");
                });
              },
              onNo: function onNo() { }
            });
          }
        }
      } else if (msgTxt.match("你赢了这场宝藏秘图之战！")) {
        PLU.execActions("clan bzmt puzz");
      } else if (msgTxt.match("开启了帮派副本")) {
        if (PLU.getCache("autoBF") == 1) {
          //帮四开启
          var ll = msg.match(/开启了帮派副本.*十月围城.*【(.*)】/);
          if (ll) {
            var n = "一二三".indexOf(ll[1]);
            UTIL.log({
              msg: "【帮四】帮四(" + ll[1] + ")开启 ",
              type: "BF",
              time: new Date().getTime()
            });
            if (n >= 0) {
              if (!g_gmain.is_fighting) {
                PLU.toBangFour(n + 1);
              } else {
                var checktodo = PLU.TODO.find(function (e) {
                  return e.cmds == "toBangFour";
                });
                if (!checktodo) PLU.TODO.push({
                  type: "func",
                  cmds: "toBangFour",
                  param: n + 1,
                  timeout: new Date().getTime() + 5 * 60 * 1000
                });
              }
            }
          }
        }
        if (PLU.getCache("autoB6") == 1) {
          //帮六开启
          var ls = msg.match(/开启了帮派副本.*蛮荒七神寨.*/);
          if (ls) {
            if (!g_gmain.is_fighting) {
              PLU.toBangSix();
            } else {
              var _checktodo = PLU.TODO.find(function (e) {
                return e.cmds == "toBangSix";
              });
              if (!_checktodo) PLU.TODO.push({
                type: "func",
                cmds: "toBangSix",
                param: "",
                timeout: new Date().getTime() + 5 * 60 * 1000
              });
            }
          }
        }
      } else if (msgTxt.match("十月围城】帮派副本胜利")) {
        //帮四完成
        PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
        if (!g_gmain.is_fighting) {
          setTimeout(function () {
            PLU.execActions("home;");
          }, 2000);
        }
      } else if (msgTxt.match("蛮荒七神寨】帮派副本胜利")) {
        //帮六完成
        PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
        if (!g_gmain.is_fighting) {
          setTimeout(function () {
            PLU.execActions("home;");
          }, 2000);
        }
      } else if (msgTxt.match("你今天进入此副本的次数已达到上限了")) {
        //帮四六无法进入
        PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
        PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
        UTIL.log({
          msg: " !!副本超量!!",
          type: "TIPS",
          time: new Date().getTime()
        });
      } else if (msgTxt.match(/你已进入帮派副本\*\*可汗金帐\*\*/) && PLU.getCache("autoB5F") == 1) {
        //帮五进入
        PLU.inBangFiveEvent();
      } else if (msgTxt.match("成功消灭了守将府内的所有敌人")) {
        //帮二完成
        var _l3 = msgTxt.match(/守城成功】(.*)成功消灭了守将府内的所有敌人，帮派副本完成/);
        if (_l3 && _l3.length > 1 && !g_gmain.is_fighting) {
          setTimeout(function () {
            PLU.execActions("home;");
          }, 3000);
        }
      } else if (msgTxt.match("你没有精良鱼饵，无法钓鱼")) {
        //钓鱼完成
        if (!UTIL.inHome() && !g_gmain.is_fighting) {
          if (PLU.getCache("autoDY") == 1) {
            var attr = g_obj_map.get("msg_attrs");
            if (attr.get("yuanbao") >= PLU.getCache("autoDY_key") + 50) PLU.execActions("shop buy shop45_N_10;diaoyu;"); else setTimeout(function () {
              PLU.execActions("home;");
              PLU.setCache("autoDY", 0);
            }, 1000);
          }
        } else setTimeout(function () {
          PLU.execActions("home;");
          PLU.setCache("autoDY", 0);
        }, 1000);
      } else if (msgTxt.match("你没有茶篓，无法采茶")) {
        //采茶完成
        if (!UTIL.inHome() && !g_gmain.is_fighting) {
          if (PLU.getCache("autoCaicha") == 1) {
            var attr = g_obj_map.get("msg_attrs");
            if (attr.get("yuanbao") >= PLU.getCache("autoCaicha_key") + 50) PLU.execActions("shop buy shop44_N_10;diaoyu;"); else setTimeout(function () {
              PLU.execActions("home;");
              PLU.setCache("autoCaicha", 0);
              YFUI.writeToOut("<span style='color:yellow;'>=====完成采茶=====</span>");
            }, 1000);
          }
        } else setTimeout(function () {
          PLU.execActions("home;");
          PLU.setCache("autoCaicha", 0);
        }, 1000);
     } else if (msgTxt.match("你今天采得太多了，明天再来吧...")) { //采茶完成
        PLU.execActions("home;");
        PLU.setCache("autoCaicha", 0);
        YFUI.writeToOut("<span style='color:yellow;'>=====完成采茶=====</span>");
    }
    });
    //监听频道消息
    UTIL.addSysListener("listenChannel", function (b, type, subtype, msg) {
      if (type != "channel" || subtype != "sys") return;
      var msgTxt = UTIL.filterMsg(msg);
      //本服逃犯
      if (msgTxt.match("慌不择路") && msgTxt.indexOf("跨服") < 0) {
        var l = msgTxt.match(/系统】([一-龥|\*]+).*慌不择路，逃往了(.*)-\003href;0;([\w\d\s]+)\003([一-龥]+)/);
        if (l && l.length > 4) {
          UTIL.log({
            msg: "【逃犯】" + l[2] + "-" + l[4] + " : " + l[1],
            type: "TF",
            time: new Date().getTime()
          });
          //111
          if (PLU.getCache("listenTF") == 1 && UTIL.inHome()) {
            if (!PLU.TMP.lis_TF_list) {
              PLU.splitTFParam();
            }
            if (PLU.TMP.lis_TF_list.includes(l[1])) {
              var idx = PLU.TMP.lis_TF_list.findIndex(function (k) {
                return k == l[1];
              });
              if (idx >= 0) {
                var gb = Number(PLU.getCache("listenTF_keys").split("|")[0]) || 0;
                PLU.goTaofan(l[1], l[2], l[3], gb, PLU.TMP.lis_TF_force[idx]);
              }
            }
          }
        }
      } else if (msgTxt.match("跨服时空")) {
        //广场青龙
        var _l4 = msgTxt.match(/跨服：(.*)逃到了跨服时空(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。/);
        if (_l4 && _l4.length > 3) {
          UTIL.log({
            msg: "【跨服青龙】" + _l4[2] + " - " + _l4[1].padEnd(8) + "  奖品:" + _l4[3],
            type: "KFQL",
            time: new Date().getTime()
          });
          if (PLU.getCache("listenKFQL") == 1) {
            var keysStr = PLU.getCache("listenKFQL_keys").split("|")[1].split(",").map(function (e) {
              return e == "*" ? ".*" : e.replace("*", "\\*");
            }).join("|");
            var reg = new RegExp(keysStr);
            if (PLU.developerMode && _l4[3].match(reg) && UTIL.inHome()) {
              UTIL.addSysListener("KuaFu", function (b, type, subtype, msg) {
                if (b.get("map_id") == "kuafu") {
                  UTIL.delSysListener("KuaFu");
                  PLU.goQinglong(_l4[1], _l4[2], PLU.getCache("listenKFQL_keys").split("|")[0], true);
                }
              });
              setTimeout(function () {
                clickButton("change_server world;");
              }, 500);
            }
          }
        }
      } else if (msgTxt.match("江湖纷争")) {
        //江湖纷争
        var fz = msgTxt.match(/【江湖纷争】：(.*)(门派|流派)的(.*)剑客伤害同门，欺师灭组，判师而出，却有(.*)坚持此种另有别情而强行庇护，两派纷争在(.*)-(.*)一触即发，江湖同门速速支援！/);
        if (!fz) return;
        var ro = fz[3];
        var pl = fz[5] + "-" + fz[6];
        var vs = fz[1] + " VS " + fz[4];
        var tp = fz[2];
        var logType = tp == "门派" ? "MPFZ" : "LPFZ";
        UTIL.log({
          msg: "【" + tp + "之争】 " + ro + "  地点:[" + pl + "]  " + vs,
          type: logType,
          time: new Date().getTime()
        });
        if (tp == "门派") {
          var nowTime = new Date().getTime();
          for (var k in PLU.MPFZ) {
            if (k < nowTime) delete PLU.MPFZ[k];
          }
          var extime = new Date().getTime() + 1560000;
          PLU.MPFZ[extime] = {
            n: ro,
            p: pl,
            v: vs,
            t: new Date().getTime()
          };
          UTIL.setMem("MPFZ", JSON.stringify(PLU.MPFZ));
        }
      } else if (msgTxt.match("出来闯荡江湖了")) {
        //游侠
        var yx = msgTxt.match(/【系统】游侠会：听说(.*)出来闯荡江湖了，目前正在前往(.*)的路上/);
        if (!yx) return;
        var yn = $.trim(yx[1]);
        var yp = yx[2];
        var yr = "";
        PLU.YFD.youxiaList.forEach(function (g) {
          if (g.v.includes(yn)) yr = g.n;
        });
        UTIL.log({
          msg: "【游侠-" + yr + "】 " + yn + "  地点:[" + yp + "]  ",
          type: "YX",
          time: new Date().getTime()
        });
        if (PLU.getCache("listenYX") == 1 && UTIL.inHome()) {
          if (!PLU.TMP.listenYX_list) {
            PLU.TMP.listenYX_list = PLU.getCache("listenYX_keys").split(",");
          }
          if (PLU.TMP.listenYX_list && PLU.TMP.listenYX_list.includes(yn)) {
            var jhName = PLU.fixJhName(yp);
            var jhMap = PLU.YFD.mapsLib.Map.find(function (e) {
              return e.name == jhName;
            });
            if (!jhMap) return; else {
              var ways = jhMap.way.split(";");
              PLU.goFindYouxia({
                paths: ways,
                idx: 0,
                objectNPC: yn
              });
            }
          }
        }
      }
    });
    //监听场景
    UTIL.addSysListener("listenRoomInfo", function (b, type, subtype, msg) {
      if (type == "prompt" && msg.indexOf("想要加入你的") >= 0) {
        PLU.execActions(b.get("cmd1"));
        PLU.execActions("prev;prev");
      }
      if (type == "notice" && subtype == "notify_fail" && msg.indexOf("必须杀完所有的怪物才可以打开宝箱") >= 0) {
        PLU.execActions("ak;;ka;;event_1_68529291;");
      }
      if (type == "notice" && msg.indexOf("完成子关卡*八戒神殿*获得武林名望值x50") >= 0) {
        var mapNamefb = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
        if (mapNamefb.match(/本源之心/)) {
          setTimeout(function () {
            PLU.execActions("home;");
          }, 2500);
        }
      }
      if (type != "jh") return;
      //奇侠加按钮
      $("#out .out>button.cmd_click3").each(function (i, e) {
        if (PLU.YFD.qixiaList.includes(e.innerText)) {
          var snpc = e.outerHTML.match(/clickButton\('look_npc (\w+)'/i);
          if (snpc && snpc.length >= 2) {
            $(e).css({
              position: "relative"
            });
            var $btnAsk = $('<span style="position:absolute;display:inline-block;left:0;top:0;padding:3% 5%;text-align:center;background:#39F;color:#fff;border-radius:3px;font-size:1.2em;">问<span>');
            var $btnGold = $('<span style="position:absolute;display:inline-block;right:0;bottom:0;padding:3% 5%;text-align:center;background:#F93;color:#fff;border-radius:3px;font-size:1.2em;">金<span>');
            $(e).append($btnAsk);
            $(e).append($btnGold);
            $btnAsk.click(function (e) {
              e.stopPropagation();
              PLU.execActions("ask " + snpc[1] + ";");
            });
            $btnGold.click(function (e) {
              e.stopPropagation();
              var ename = snpc[1].split("_")[0];
              PLU.execActions("auto_zsjd20_" + ename + ";golook_room");
            });
          }
        }
      });
      //监听入队灵鹫和塔
      if (type == "jh" && subtype == "info" && PLU.getCache("autoQuitTeam") == 1) {
        var sn = g_obj_map.get("msg_room").get("short");
        if (sn.match(/灵鹫宫(\D+)层/) || sn.match(/拱辰楼(\D+)层/) || sn.match(/陈异叔(\D+)层/) || sn.match(/无为寺(\D+)层/) || sn.match(/一品堂(\D+)层/) || sn.match(/名将堂(\D+)层/) || sn.match(/魔皇殿(\D+)层/) || sn.match(/藏典塔(\D+)层/) || sn.match(/无相楼(\D+)层/) || sn.match(/葬剑谷(\D+)层/) || sn.match(/霹雳堂(\D+)层/) || sn.match(/铸剑洞(\D+)层/) || sn.match(/剑楼(\D+)层/) || sn.match(/红螺寺(\D+)层/) || sn.match(/通天塔(\D+)层/)) {
          //退出队伍
          var quitTeamPrevTimeOut = setTimeout(function () {
            UTIL.delSysListener("quitTeamPrev");
          }, 5000);
          UTIL.addSysListener("quitTeamPrev", function (b, type, subtype, msg) {
            if (type == "team" && subtype == "info") {
              UTIL.delSysListener("quitTeamPrev");
              clearTimeout(quitTeamPrevTimeOut);
              clickButton("prev");
            }
          });
          clickButton("team quit");
        }
      }
      //刷新后恢复监听帮五
      if (type == "jh" && subtype == "info" && PLU.TMP.listenBangFive == undefined) {
        var roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
        if (roomName.match(/蒙古高原|成吉思汗的金帐/)) {
          PLU.inBangFiveEvent();
        } else {
          PLU.TMP.listenBangFive = false;
        }
      }
      return;
    });
    /*
    UTIL.addSysListener("useCard", function (b, type, subtype, msg) {
      if (type == "notice" && subtype == "notify_fail" && msg.indexOf("今日已达到谜题数量限制。") >= 0) {
        PLU.execActions("items use obj_mitiling;#5 items use miticska");
      }
    });
    // 谜题密码

    UTIL.addSysListener("key", (b, type, subtype, msg) => {
      if (type != "channel" || subtype != "tell") return;
      let key = msg.match(/告诉你：谜题密码：(\d+)/)[1];
      if (key)
        PLU.TODO.push({
          type: "cmds",
          cmds: "jh 1;e;n;n;n;n;w;event_1_65953349 " + key + ";home;",
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
        });
    });
    */
    // 监听闲聊
    UTIL.addSysListener("listenChat", function (b, type, subtype, msg) {
      if (type != "channel" || subtype != "chat") return;
      /** UNICODE 15.0
       * CJK Radicals Supplement 2E80–2EFF
       * CJK Unified Ideographs (Han) 4E00–9FFF
       * CJK Extension A 3400-4DBF
       * CJK Extension B 20000–2A6DF
       * CJK Extension C 2A700–2B739
       * CJK Extension D 2B740–2B81D
       * CJK Extension E 2B820–2CEA1
       * CJK Extension F 2CEB0–2EBE0
       * CJK Extension G 30000–3134A
       * CJK Extension H 31350–323AF
       */
      msg = msg.replace("\f", "");
      var text = msg.match(/^[^：]+：.*?([⺀-⻿㐀-䶿一-鿿\-，”'!！]+道：.+)\x1B\[2;37;0m/);
      if (text) {
        text = text[1];
        if (text.match(/柴绍|李秀宁|大鹳淜洲/)) {
          /**
           * 李秀宁昨天捡到了我几十辆银子
           * 李秀宁鬼鬼祟祟的叫人生疑
           * 李秀宁竟对我横眉瞪眼的
           * 竟然吃了李秀宁的亏
           * 李秀宁竟敢得罪我
           * 被李秀宁抢走了
           * 李秀宁好大胆
           * 想找李秀宁
           * 藏在了(天龙寺-)?大鹳淜洲
           * 想要一件天罗紫芳衣
           */
          UTIL.log({
            msg: "【谜题-天命丹】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/阴九幽|潜龙|谷底石室/)) {
          UTIL.log({
            msg: "【谜题-鬼杀剑】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/打坐老僧|牟尼楼|牟尼洞/)) {
          UTIL.log({
            msg: "【谜题-700级读书识字】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/本恒禅师|无相堂/)) {
          UTIL.log({
            msg: "【谜题-木棉袈裟】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/天罗紫芳衣/)) {
          UTIL.log({
            msg: "【谜题-天命丹】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/鬼杀剑|金凤翅盔/)) {
          UTIL.log({
            msg: "【谜题-鬼杀剑】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/麻布僧衣/)) {
          UTIL.log({
            msg: "【谜题-700级读书识字】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        } else if (text.match(/追风棍|木棉袈裟/)) {
          UTIL.log({
            msg: "【谜题-木棉袈裟】" + text,
            type: "TIPS",
            time: new Date().getTime()
          });
        }
      }
      var text2 = msg.match(/[^：]+：(.+)\x1B\[2;37;0m/)[1];
      if (PLU.getCache("listenChat") == 1 && text2 != "哈哈，我也来闯荡江湖啦！" && text2 != "哈哈，我去也……") YFUI.writeToOut(msg);
      var text3 = msg.match(/^[^：]+：(.+道)：(.+)\x1B\[2;37;0m/);
      if (text3) var tmp = PLU.queryNpc(text3[1], true); else {
        var _text = msg.match(/^[^：]+：(.+)的谜题\x1B\[2;37;0m/);
        if (_text) var tmp = PLU.queryNpc(_text[1] + "道", true);
      }
      if (tmp && tmp.length && PLU.getCache("listenPuzzle") == 1) {
        PLU.TMP.autotask = true;
        var _iterator2 = _createForOfIteratorHelper(tmp),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _ref, _npc$name_new;
            var npc = _step2.value;
            PLU.TODO.push({
              type: "func",
              cmds: "execActions",
              param: [npc.way, function (code, name) {
                var npcObj = UTIL.findRoomNpc(name, 0, 1);
                if (npcObj) PLU.execActions("ask " + npcObj.key);
              }, (_ref = (_npc$name_new = npc.name_new) !== null && _npc$name_new !== void 0 ? _npc$name_new : npc.name_tw) !== null && _ref !== void 0 ? _ref : npc.name],
              timeout: new Date().getTime() + 15 * 60 * 1000
            });
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    });
    //----------监听练习----------------------------
    UTIL.addSysListener("listenPractice", function (b, type, subtype, msg) {
      if (type == "practice" && subtype == "stop_practice" && PLU.getCache("autoLX") == 1) {
        var skillId = b.get("sid"),
          lxcmds = "enable " + skillId + ";practice " + skillId;
        if (UTIL.inHome()) PLU.execActions(lxcmds); else PLU.TODO.push({
          type: "cmds",
          cmds: lxcmds,
          timeout: new Date().getTime() + 8 * 60 * 60 * 1000
        });
      }
    });
    //----------------------------------------------
    //----------------------------------------------
    //监听剑阵
    UTIL.addSysListener("listenJianzhen", function (b, type, subtype, msg) {
      if (type != "notice") return;
      if (msg.indexOf("阵升级完毕！") < 0) return;
      var msgTxt = UTIL.filterMsg(msg);
      if (msgTxt.match(/(.*)阵升级完毕！成功升级到/)) {
        setTimeout(function () {
          var _g_obj_map$get2;
          var jzcmds = "hhjz xiulian go;;;hhjz speedup go;";
          var room = (_g_obj_map$get2 = g_obj_map.get("msg_room")) === null || _g_obj_map$get2 === void 0 ? void 0 : _g_obj_map$get2.get("short");
          PLU.execActions(jzcmds);
          /*
          if (room == "桃溪" || room == "后山茶园" || UTIL.inHome()) PLU.execActions(jzcmds); else PLU.TODO.push({
            type: "cmds",
            cmds: jzcmds,
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000
          });
            */
        }, 8000);
      }
    });
    //监听跟杀
    UTIL.addSysListener("listenFightKill", function (b, type, subtype, msg) {
      if (type != "main_msg" || !msg) return;
      if (msg.indexOf("对著") < 0) return;
      if (PLU.getCache("followKill") != 1) return;
      var msgTxt = UTIL.filterMsg(msg);
      var matchKill = msgTxt.match(/(.*)对著(.*)喝道：「(.*)！今日不是你死就是我活！」/);
      if (matchKill && $.trim(matchKill[1]) != "你" && $.trim(matchKill[2]) != "你" && !g_gmain.is_fighting) {
        PLU.toCheckFollowKill($.trim(matchKill[1]), $.trim(matchKill[2]), "kill", msgTxt);
        return;
      }
      var matchFight = msgTxt.match(/(.*)对著(.*)说道：(.*)，领教(.*)的高招！/);
      if (matchFight && $.trim(matchFight[1]) != "你" && $.trim(matchFight[2]) != "你" && !g_gmain.is_fighting) {
        PLU.toCheckFollowKill($.trim(matchFight[1]), $.trim(matchFight[2]), "fight", msgTxt);
        return;
      }
    });
    //test
    UTIL.addSysListener("testListener", function (b, type, subtype, msg) {
      if (type == "g_login" && subtype == "login_ret" && msg == "1") {
        YFUI.writeToOut("<span style='color:#FFF;background:#F00;'>[" + UTIL.getNow() + "] 断线重连了 </span>");
        PLU.TMP.reConnectTime = 0;
      }
    });
    UTIL.addSysListener("disconnect", function (b, type, subtype, msg) {
      if (type == "disconnect" && subtype == "change") {
        console.log("%c%s", "color:#F00", ">>>>>>>sock disconnected");
        //sock && sock.close(); sock = 0
        if (PLU.getCache("autoConnect") == 1) {
          var recTime = Number(PLU.getCache("autoConnect_keys"));
          if (recTime) g_gmain.g_delay_connect = recTime;
        }
      }
    });
    unsafeWindow.sock.on("telnet_connected", function () {
      console.log("%c%s", "color:#0F0", ">>>>>>>sock connected");
    });
    UTIL.addSysListener("YXSkillsListener", function (b, type, subtype, msg) {
      if (type != "show_html_page") return;
      if (msg.indexOf("须传授技能") < 0) return;
      var list = msg.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/g);
      var outList = null;
      if (list && list.length) {
        outList = list.map(function (s) {
          var r = s.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/);
          return {
            lvl: r[1],
            max: r[2],
            cmd: r[3] + "0"
          };
        });
      }
      PLU.TMP.CUR_YX_SKILLS = outList;
      var matchNameLine = msg.match(/<span class="out2">([\s\S]+)<\/span><span class="out2">/);
      var npcNameLine = matchNameLine ? UTIL.filterMsg(matchNameLine[1]) : "";
      var dg = npcNameLine.match(/(\d+)级/)[1];
      PLU.TMP.CUR_YX_LEVEL = Number(dg);
      var nn = msg.match(/fudi juxian upgrade (\S+) 1/)[1];
      PLU.TMP.CUR_YX_ENG = nn;
    });
    UTIL.addSysListener("masterSkillsListener", function (b, type, subtype, msg) {
      if (type != "master_skills" || subtype != "list") return;
      var masterSkills = PLU.parseSkills(b);
      PLU.TMP.MASTER_ID = b.get("id");
      PLU.TMP.MASTER_SKILLS = masterSkills;
    });
  },
  //================================================================================================
  initTickTime: function initTickTime() {
    setInterval(function () {
      var nowDate = new Date();
      var nowTime = nowDate.getTime();
      if (PLU.TODO.length > 0 && !PLU.STATUS.isBusy && UTIL.inHome()) {
        //待办
        var ctd = PLU.TODO.shift();
        if (nowDate.getTime() < ctd.timeout) {
          if (ctd.type == "cmds") {
            PLU.execActions(ctd.cmds);
          } else if (ctd.type == "func") {
            var _PLU;
            if (ctd.param) (_PLU = PLU)[ctd.cmds].apply(_PLU, _toConsumableArray(ctd.param)); else PLU[ctd.cmds]();
          }
        }
      }
      if ($("#topMonitor").text() != "") $("#topMonitor").empty();
      var bi = 0;
      for (var k in PLU.MPFZ) {
        if (k < nowTime) delete PLU.MPFZ[k]; else {
          var f = PLU.MPFZ[k];
          var dt = Math.floor((k - nowTime) / 1000);
          var flo = bi % 2 == 1 ? "float:right;text-align:right;" : "";
          $("#topMonitor").append('<div title="'.concat(f.v, '" style="display:inline-block;width:40%;').concat(flo, '">').concat(f.n.substr(0, 1), ' <span style="color:#9CF;">[').concat(f.p, ']</span> <span style="color:#DDD;">').concat(dt, "</span></div>"));
          bi++;
        }
      }
      if (PLU.ONOFF["btn_bt_waitCDKill"] && PLU.TMP.DATA_MPFZ) PLU.toCheckAndWaitCDKill(nowTime);
    }, 1000);
  },
  //================================================================================================
  toSignIn: function toSignIn() {
    var _PLU$getCache;
    if (!this.signInMaps) this.initSignInMaps();
    var ckeds = ((_PLU$getCache = PLU.getCache("signInArray")) === null || _PLU$getCache === void 0 ? void 0 : _PLU$getCache.split(",")) || this.signInMaps.map(function (e, i) {
      return i;
    });
    var htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
    this.signInMaps.forEach(function (e, i) {
      if (!e.n) htm += '<span style="width:92px;">&nbsp;</span>'; else htm += '<span><button class="signInBtn" data-sid="'.concat(i, '" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>\n            <label data-id="').concat(i, '" style="font-size:13px;margin:0 3px 5px 0;">').concat(e.n, '<input type="checkbox" name="signInId" value="').concat(i, '"\n             ').concat(ckeds.includes(i + "") || e.f ? "checked" : "", " ").concat(e.f ? "disabled" : "", " /></label></span>");
    });
    htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">全选</button>';
    YFUI.showPop({
      title: "签到",
      text: htm,
      width: "360px",
      okText: "一键签到",
      onOk: function onOk(e) {
        var checkeds = [];
        e.find('input[name="signInId"]:checked').each(function (i, b) {
          checkeds.push(b.value);
        });
        PLU.setCache("auto9H", 1);
        PLU.setCache("signInArray", checkeds.join(","));
        PLU.goSign(checkeds);
      },
      onNo: function onNo() { },
      afterOpen: function afterOpen($el) {
        $el.find(".signInBtn").click(function (e) {
          var btnSid = $(e.currentTarget).attr("data-sid");
          PLU.goSign(btnSid);
        });
        $el.find(".signInAll").click(function (e) {
          $el.find('input[name="signInId"]').each(function () {
            $(this).prop("checked", true);
          });
        });
      }
    });
  },
  //================================================================================================
  toricrw: function toricrw() {
    var _PLU$getCache2;
    if (!this.rcrenwu) this.initrichangrenwu();
    var ckeds = ((_PLU$getCache2 = PLU.getCache("signInArrayrc")) === null || _PLU$getCache2 === void 0 ? void 0 : _PLU$getCache2.split(",")) || this.rcrenwu.map(function (e, i) {
      return i;
    });
    var htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
    this.rcrenwu.forEach(function (e, i) {
      if (!e.n) htm += '<span style="width:92px;">&nbsp;</span>'; else htm += '<span><button class="signInBtn" data-sid="'.concat(i, '" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>\n            <label data-id="').concat(i, '" style="font-size:13px;margin:0 3px 5px 0;">').concat(e.n, '<input type="checkbox" name="signInId" value="').concat(i, '"\n             ').concat(ckeds.includes(i + "") || e.f ? "checked" : "", " ").concat(e.f ? "disabled" : "", " /></label></span>");
    });
    htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">全选</button>';
    YFUI.showPop({
      title: "日常周常",
      text: htm,
      width: "360px",
      okText: "开始",
      onOk: function onOk(e) {
        var checkeds = [];
        e.find('input[name="signInId"]:checked').each(function (i, b) {
          checkeds.push(b.value);
        });
        PLU.setCache("signInArrayrc", checkeds.join(","));
        PLU.goSign(checkeds, true);
      },
      onNo: function onNo() { },
      afterOpen: function afterOpen($el) {
        $el.find(".signInBtn").click(function (e) {
          var btnSid = $(e.currentTarget).attr("data-sid");
          PLU.goSign(btnSid, true);
        });
        $el.find(".signInAll").click(function (e) {
          $el.find('input[name="signInId"]').each(function () {
            $(this).prop("checked", true);
          });
        });
      }
    });
  },
  //================================================================================================
  autoSwords: function autoSwords(callback) {//论剑
    UTIL.addSysListener("sword", function (b, type, subtype, msg) {
      if (type != "notice" || msg.indexOf("试剑") == -1) return;
      if (msg.indexOf("5/5") > 0 || !msg.indexOf("你今天试剑次数已达限额")) {
        UTIL.delSysListener("sword");
        callback && callback();
      } else PLU.execActions("swords fight_test go");
    });
    PLU.execActions("swords;swords select_member heimuya_dfbb;swords select_member qingcheng_mudaoren;swords select_member tangmen_madam;swords fight_test go");
  },
  //================================================================================================
  autoGetVipReward: function autoGetVipReward(callback) {
    var _vipInfo$get, _vipInfo$get2, _vipInfo$get3, _vipInfo$get4, _vipInfo$get5, _vipInfo$get6, _vipInfo$get7, _vipInfo$get8, _vipInfo$get9, _vipInfo$get10, _vipInfo$get11;
    var acts = "";
    var vipInfo = g_obj_map.get("msg_vip");
    if (vipInfo.get("get_vip_drops") == 0) acts += "vip drops;";
    if (vipInfo.get("finish_sort") % 1000 < 5) acts += "#5 vip finish_sort;";
    if (vipInfo.get("finish_dig") % 1000 < 10) acts += "#10 vip finish_dig;";
    if (vipInfo.get("finish_diaoyu") % 1000 < 10) acts += "#10 vip finish_diaoyu;";
    if (vipInfo.get("do_task_num") % 1000 < 10) acts += "#10 vip finish_big_task;";
    if (vipInfo.get("family_quest_count") % 1000 < 25) acts += "#25 vip finish_family;";
    if (vipInfo.get("finish_fenzheng") % 1000 < 5) acts += "#5 vip finish_fenzheng;";     
    if (g_obj_map.get("msg_clan_view") && vipInfo.get("clan_quest_count") % 1000 < 20) acts += "#20 vip finish_clan;";
    if ((_vipInfo$get = vipInfo.get("saodang_fb_1")) !== null && _vipInfo$get !== void 0 && _vipInfo$get.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb dulongzhai;";
    if ((_vipInfo$get2 = vipInfo.get("saodang_fb_2")) !== null && _vipInfo$get2 !== void 0 && _vipInfo$get2.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb junying;";
    if ((_vipInfo$get3 = vipInfo.get("saodang_fb_3")) !== null && _vipInfo$get3 !== void 0 && _vipInfo$get3.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb beidou;";
    if ((_vipInfo$get4 = vipInfo.get("saodang_fb_4")) !== null && _vipInfo$get4 !== void 0 && _vipInfo$get4.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb youling;";
    if ((_vipInfo$get5 = vipInfo.get("saodang_fb_5")) !== null && _vipInfo$get5 !== void 0 && _vipInfo$get5.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb siyu;";
    if ((_vipInfo$get6 = vipInfo.get("saodang_fb_6")) !== null && _vipInfo$get6 !== void 0 && _vipInfo$get6.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb changleweiyang;";
    if ((_vipInfo$get7 = vipInfo.get("saodang_fb_7")) !== null && _vipInfo$get7 !== void 0 && _vipInfo$get7.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb heishuihuangling;";
    if ((_vipInfo$get8 = vipInfo.get("saodang_fb_8")) !== null && _vipInfo$get8 !== void 0 && _vipInfo$get8.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb jiandangfenglingdu;";
    if ((_vipInfo$get9 = vipInfo.get("saodang_fb_9")) !== null && _vipInfo$get9 !== void 0 && _vipInfo$get9.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb tianshanlongxue;";
    if ((_vipInfo$get10 = vipInfo.get("saodang_fb_10")) !== null && _vipInfo$get10 !== void 0 && _vipInfo$get10.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb sizhanguangmingding;";
    if ((_vipInfo$get11 = vipInfo.get("saodang_fb_11")) !== null && _vipInfo$get11 !== void 0 && _vipInfo$get11.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb bajieshendian;";
    acts += "home;";
    PLU.execActions(acts, function () {
      callback && callback();
    });
  },
  autoShaodan: function autoShaodan(callback) {
    var _vipInfo$get12, _vipInfo$get13, _vipInfo$get14, _vipInfo$get15, _vipInfo$get16, _vipInfo$get17, _vipInfo$get18, _vipInfo$get19, _vipInfo$get20, _vipInfo$get21, _vipInfo$get22;
    var acts = "";
    var vipInfo = g_obj_map.get("msg_vip");
    var isVip = vipInfo.get("vip_tm") > 0;
    if ((_vipInfo$get12 = vipInfo.get("saodang_fb_1")) !== null && _vipInfo$get12 !== void 0 && _vipInfo$get12.split(",")[2] || 0 % 1000 < 4) {
      if (isVip) acts += "#4 vip finish_fb dulongzhai;"; else acts += "team create;fb 1;;ak;n;;n;;n;;n;;ka;" + "team create;fb 1;;ak;n;;n;;n;;n;;ka;";
    }
    if ((_vipInfo$get13 = vipInfo.get("saodang_fb_2")) !== null && _vipInfo$get13 !== void 0 && _vipInfo$get13.split(",")[2] || 0 % 1000 < 4) if (isVip) acts += "#4 vip finish_fb junying;"; else acts += "team create;fb 2;;ak;;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;event_1_43484736;;ka;@赫造基的尸体;@严廷殷的尸体;" + "team create;fb 2;;ak;;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;event_1_43484736;;ka;@赫造基的尸体;@严廷殷的尸体;";
    if ((_vipInfo$get14 = vipInfo.get("saodang_fb_3")) !== null && _vipInfo$get14 !== void 0 && _vipInfo$get14.split(",")[2] || 0 % 1000 < 4) {
      if (isVip) acts += "#4 vip finish_fb beidou;"; else acts += "team create;fb 3;w;;ak;e;s;;n;e;;event_1_9777898;;ka;@天枢剑客的尸体;" + "team create;fb 3;w;;ak;e;s;;n;e;;event_1_9777898;;ka;@天枢剑客的尸体;";
    }
    if ((_vipInfo$get15 = vipInfo.get("saodang_fb_4")) !== null && _vipInfo$get15 !== void 0 && _vipInfo$get15.split(",")[2] || 0 % 1000 < 4) {
      if (isVip) acts += "#4 vip finish_fb youling;"; else acts += "team create;fb 4;n;;ak;n;;n;;n;;n;;ka;" + "team create;fb 4;n;;ak;n;;n;;n;;n;;ka;";
    }
    if ((_vipInfo$get16 = vipInfo.get("saodang_fb_5")) !== null && _vipInfo$get16 !== void 0 && _vipInfo$get16.split(",")[2] || 0 % 1000 < 3) {
      if (isVip) acts += "#3 vip finish_fb siyu;"; else acts += "team create;fb 5;event_1_26662342;ak;se;;nw;nw;event_1_15727082;;nw;;se;se;event_1_12238479;;sw;;ne;ne;event_1_889199;;ne;;sw;sw;;;;;;;event_1_77337496;;ka;";
    }
    if ((_vipInfo$get17 = vipInfo.get("saodang_fb_6")) !== null && _vipInfo$get17 !== void 0 && _vipInfo$get17.split(",")[2] || 0 % 1000 < 3) {
      if (isVip) acts += "#3 vip finish_fb changleweiyang;"; else acts += "team create;fb 6;event_1_94101353;ak;event_1_8221898;;event_1_18437151;;event_1_74386803;;event_1_39816829;event_1_92691681;event_1_19998221;event_1_62689078;;event_1_85127800;;ask changleweiyang_jiangzuodajiang;event_1_39026868;;s;;ka;";
    }
    if ((_vipInfo$get18 = vipInfo.get("saodang_fb_7")) !== null && _vipInfo$get18 !== void 0 && _vipInfo$get18.split(",")[2] || 0 % 1000 < 3) if (isVip) acts += "#3 vip finish_fb heishuihuangling;"; else acts += "team create;fb 7;event_1_20980858;;ak;fb 7;event_1_81463220;;fb 7;event_1_5770640;;fb 7;event_1_56340108;;event_1_21387224;s;;ka;event_1_94902320;";
    if ((_vipInfo$get19 = vipInfo.get("saodang_fb_8")) !== null && _vipInfo$get19 !== void 0 && _vipInfo$get19.split(",")[2] || 0 % 1000 < 3) if (isVip) acts += "#3 vip finish_fb jiandangfenglingdu;"; else acts += "team create;fb 8;ak;n;n;fb 8;e;e;fb 8;w;w;fb 8;s;s;event_1_28034211;ka;event_1_17257217;";
    if ((_vipInfo$get20 = vipInfo.get("saodang_fb_9")) !== null && _vipInfo$get20 !== void 0 && _vipInfo$get20.split(",")[2] || 0 % 1000 < 3) if (isVip) acts += "#3 vip finish_fb tianshanlongxue;"; else acts += "team create;fb 9;;ak;n;;n;;n;;n;;n;;ka;";
    if ((_vipInfo$get21 = vipInfo.get("saodang_fb_10")) !== null && _vipInfo$get21 !== void 0 && _vipInfo$get21.split(",")[2] || 0 % 1000 < 3) if (isVip) acts += "#3 vip finish_fb sizhanguangmingding;"; else acts += "team create;fb 10;;ak;n;;n;;n;;n;;n;;ka;";
    if ((_vipInfo$get22 = vipInfo.get("saodang_fb_11")) !== null && _vipInfo$get22 !== void 0 && _vipInfo$get22.split(",")[2] || 0 % 1000 < 3) if (isVip) acts += "#3 vip finish_fb bajieshendian;"; else acts += "team create;fb 11;;ak;n;;n;;n;;n;;n;;ka;";
    acts += "home;";
    PLU.execActions(acts, function () {
      callback && callback();
    });
  },
  //================================================================================================
  getClanInfo: function getClanInfo(callback) {
    var openClanTimeout = setTimeout(function () {
      UTIL.delSysListener("listenOpenClan");
      callback && callback(0);
    }, 5000);
    UTIL.addSysListener("listenOpenClan", function (b, type, subtype, msg) {
      if (type == "clan") {
        UTIL.delSysListener("listenOpenClan");
        clearTimeout(openClanTimeout);
        clickButton("prev");
        //console.log(g_obj_map.get("msg_clan_view"))
        callback && callback(1);
      }
    });
    clickButton("clan");
  },
  getVipInfo: function getVipInfo(callback) {
    var openVipTimeout = setTimeout(function () {
      UTIL.delSysListener("listenOpenVip");
      callback && callback(0);
    }, 5000);
    UTIL.addSysListener("listenOpenVip", function (b, type, subtype, msg) {
      if (type == "vip") {
        UTIL.delSysListener("listenOpenVip");
        clearTimeout(openVipTimeout);
        clickButton("prev");
        //console.log(g_obj_map.get("msg_vip"))
        callback && callback(1);
      }
    });
    clickButton("vip");
  },
  //================================================================================================
  goSign: function goSign(param, rcrenwu) {
    if (!param) {
      return YFUI.writeToOut("<span style='color:#FFF;'>=====结束====记得换套装哦==</span>");
    } else if (param.length == 0) {
      return YFUI.writeToOut("<span style='color:#FFF;'>=====签到结束====记得换套装哦==</span>");
    }
    var sid = null;
    if (_typeof(param) == "object") {
      sid = param.shift();
    } else {
      sid = param;
      param = null;
    }
    var signD = (rcrenwu ? PLU.rcrenwu : PLU.signInMaps)[sid];
    if (signD.c != undefined) {
      if (signD.c()) {
        if (signD.fn) {
          signD.fn(function () {
            PLU.goSign(param, rcrenwu);
          });
        } else if (signD.go) {
          PLU.execActions(signD.go, function () {
            PLU.goSign(param, rcrenwu);
          });
        }
      } else {
        PLU.goSign(param, rcrenwu);
      }
    } else {
      if (signD.fn) {
        signD.fn(function () {
          PLU.goSign(param, rcrenwu);
        });
      } else if (signD.go) {
        PLU.execActions(signD.go, function () {
          PLU.goSign(param, rcrenwu);
        });
      }
    }
  },
  //================================================================================================
  initSignInMaps: function initSignInMaps() {
    var _this = this;
    this.getVipInfo(function (b) {
      _this.getClanInfo(function (a) { });
    });
    this.signInMaps = [{
      n: "扬州签到",
      f: true,
      go: "jh 5;n;n;n;w;look_npc yangzhou_yangzhou4;sign7;home;"
    }, {
      n: "每日礼包",
      f: true,
      go: "jh 1;event_1_57222966;event_1_48246976;event_1_85373703;home;fudi houshan fetch;fudi juxian mpay;fudi juxian fetch_zhuguo;home;swords report go;"
    }, {
      n: "潜龙礼包", 
      f: true,
      go: "jh 1;event_1_16472313;event_1_38436482;w;event_1_26383297;event_1_21318613;home;"
    }, {
      n: "分享奖励",
      f: true,
      go: "share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;home;clan fb open shenshousenlin;clan fb open daxuemangongdao;clan fb open longwulianmoge;clan fb open_go2 kehanjinzhang2;"
    }, {
      n: "南诏投资",
      f: true,
      go: "jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;event_1_62143505 go;;;event_1_62143505 get;event_1_63750325 get;home;"
    }, {
      n: "消费积分",
      f: true,
      go: "jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;home;"
    }, {
      n: "打坐睡床",
      f: true,
      go: "home;exercise stop;exercise;golook_room;sleep_hanyuchuang;fudi shennong fetch;home;"
    }, {
      n: "买引路蜂",
      f: true,
      go: "shop money_buy mny_shop2_N_10;home;vip;"
    }, {
      n: "续约会员",
      go: "jh 1;event_1_45018293;home;"
    }, {
      n: "领取工资",
      f: true,
      go: "home;work click maikuli;work click duancha;work click dalie;work click baobiao;work click maiyi;work click xuncheng;work click datufei;work click dalei;work click kangjijinbin;work click zhidaodiying;work click dantiaoqunmen;work click shenshanxiulian;work click jianmenlipai;work click dubawulin;work click youlijianghu;work click yibangmaoxiang;work click zhengzhanzhongyuan;work click taofamanyi;public_op3;home;"
    }, {
      n: "爬楼奖励",
      f: true,
      go: "home;cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu axe get_all;xueyin_shenbinggu whip get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu staff get_all;home;"
    }, {
      n: "吃九花丸",
      go: "items use obj_jiuhuayulouwan;home;"
    }, {
      n: "银两上香",
      c: function c() {
        return !!g_obj_map.get("msg_clan_view");
      },
      go: "#20 clan incense yx;home;"
    }, {
      n: "VIP 福利",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("get_vip_drops") == 0;
      },
      go: "vip drops;home;"
    }, {
      n: "VIP 暴击",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("do_task_num") % 1000 < 10;
      },
      fn: PLU.saodbj
    }, {
      n: "VIP 师门",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("family_quest_count") % 1000 < 25;
      },
      fn: PLU.saodsm
    }, {
      n: "VIP 帮派",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_clan_view") && g_obj_map.get("msg_vip").get("clan_quest_count") % 1000 < 20;
      },
      go: "#20 vip finish_clan;#3 clan fb go_saodang shenshousenlin;#3 clan fb go_saodang daxuemangongdao;#3 clan fb go_saodang longwulianmoge;#3 clan fb go_saodang kehanjinzhang2;"
    }, {
      n: "VIP 排行",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_sort") % 1000 < 5;
      },
      go: "#5 vip finish_sort;"
    }, {
      n: "VIP 寻宝",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_dig") % 1000 < 10;
      },
      go: "#10 vip finish_dig;"
    }, {
      n: "VIP 钓鱼",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_diaoyu") % 1000 < 10;
      },
      go: "#10 vip finish_diaoyu;"
    },
    //{n:'VIP 扫荡',c:function(){return g_obj_map.get("msg_vip")&&g_obj_map.get("msg_vip").get("vip_tm")>0},fn:PLU.autoVipShaodan},
    {
      n: "扫荡副本",
      fn: PLU.autoShaodan
    }, {
      n: "VIP 纷争",
      c: function c() {
        return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_fenzheng") % 1000 < 5;
      },
      go: "#5 vip finish_fenzheng;"
    }, {
      n: "打小龙人",
      fn: PLU.saoxlr
    }, {
      n: "玄铁采矿",
      go: "jh 26;w;w;n;e;e;event_1_18075497;w;w;n;event_1_14435995;home;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home;"
    }, {
      n: "求教阿不",
      go: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;event_1_10395181;;home;"
    }, {
      n: "绝情鳄鱼",
      go: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home;"
    }, {
      n: "少林渡劫",
      go: "jh 13;e;s;s;w;w;w;;event_1_38874360;;kill?渡风神识;;home;"
    }, {
      n: "天山七侠",
      fn: PLU.TianShan7Xia
    }, {
      n: "明教毒魔",
      go: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;;kill?九幽毒魔;;home;"
    },
    //{ n: "侠客看书", go: "jh 36;yell;e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543;home;" },
    //{ n: "白驼闯阵", go: "jh 21;n;n;n;n;w;;ak;w;;w;ka;w;;fight baituo_junzhongzhushuai;home;" },
    //{ n: "青城孽龙", go: "jh 15;n;nw;w;nw;n;event_1_14401179;;kill?孽龙之灵;home;" },
    //{ n: "峨眉解围", go: "jh 8;ne;e;e;e;n;;kill?赤豹死士;n;n;;kill?黑鹰死士;n;n;;kill?金狼大将;home;" },
    //{ n: "大昭岩画", go: "jh 26;w;w;n;w;w;w;n;n;place?阴山岩画;event_1_12853448;home;" },
    //{ n: "恒山盗贼", go: "jh 9;event_1_20960851;;kill?杀神寨匪首;home;" },
    //{n: "白驮奇袭",go: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s;s;event_1_66710076;s;e;ne;e;se;n;event_1_53430818;n;;kill?豹军主帅;s;s;nw;n;n;;kill?虎军主帅;s;s;se;e;e;e;;kill?鹰军主帅;w;w;w;nw;w;nw;event_1_89411813;;kill?颉利;home;"},
    //{ n: "十八木人", go: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;e;#2 vent_1_85950082;home;" },
    //{ n: "西安采莲", go: "jh 2;#19 n;e;n;n;n;w;event_1_31320275;home;" },
    {
      n: "论剑试剑",
      fn: PLU.autoSwords
    }, {
      n: "唐门冰月",
      fn: PLU.autoBingyue
    }, {
      n: "垂钓一夏",
      go: "jh 5;n;w;event_1_3144437;home;"
    }, {
      n: "华山祭酒",
      go: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n;event_1_355715;event_1_355715;;"
    }, {
      n: "领取矿镐",
      fn: PLU.DailyOres
    },{
      n: "清明礼包",
      go: "jh 1;#4 w;n;event_1_85364899;home;"
    }, {
      n: "龙辰礼包",
      go: "items get_store /obj/quest/jinyuhufusuipian;=200;jh 1;e;#3 n;n;w;event_1_90287255 go go_lsyj;#6 event_1_56364978;#6 event_1_49251725;home;"
    },{
    n: "自动答题",
    fn: PLU.loopAnswerQues
    }, {
      n: "",
      go: "home;"
    }];
  },
  //================================================================================================
  initrichangrenwu: function initrichangrenwu() {
    var _this = this;
    this.getVipInfo(function (b) {
      _this.getClanInfo(function (a) { });
    });
    this.rcrenwu = [
      //{ n: "副本十一", fn: PLU.killFB11 },
      {
        n: "副本十一",
        go: "fb 11;ak;nw;=400;se;n;=400;s;ne;=400;sw;e;=400;w;se;=400;nw;s;=400;n;sw;=400;ne;w;=400;w;=400;e;e;nw;nw;=400;se;se;n;n;=400;s;s;ne;ne;=400;sw;sw;e;e;=400;w;w;se;se;=400;nw;nw;s;s;=400;n;n;sw;sw;=4000;ka;vs:event_1_68529291;"
      }, {
        n: "幽冥后院",
        go: "jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;se;ak;=400;se;=400;s;=400;w;=400;e;e;=400;w;s;=400;s;=400;s;=400;w;=400;e;e;=400;s;=400;n;e;=400;e;=400;n;=400;s;e;=400;e;=400;n;=500;ka;"
      }, {
        n: "西凉铁剑",
        go: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;vs:event_1_10117215;"
      }, {
        n: "四大绝杀",
        go: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n;vs:event_1_33144912;"
      }, {
        n: "剑宫白猿",
        go: "rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;vs:event_1_79113775;"
      }, {
        n: "十八木人",
        go: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;vs:event_1_85950082;"
      }, {
        n: "阎王十殿",
        go: "rank go 223;nw;event_1_42827171;=200;kill yanwangshidian_zhuanlunwang;ak;;ka;;vs:event_1_45876452;=3500;vs:event_1_45876452;"
      }, {
        n: "格斗五十",
        fn: PLU.gedou50
      }, {
        n: "生死双修",
        fn: PLU.piapiapia
      }, {
        n: "讨天命丹",
        fn: PLU.askTianmd
      }, {
        n: "天龙塔林",
        fn: PLU.killtalin
      }, {
        n: "拱辰十三",
        go: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;=500;ak;=500;ka;=500;event_1_23639130;=500;golook_room"
      }, {
        n: "南诏宝斋",
        fn: PLU.rongbaoz
      }, {
        n: "南诏奏乐",
        fn: PLU.nanzzouy
      }, {
        n: "南诏问诊",
        fn: PLU.nanzwenz
      }, {
        n: "修补长城",
        go: "rank go 311;s;s;sw;se;se;se;e;se;se;sw;sw;=500;event_1_71928780;"
      }, {
        n: "西夏灵鹫",
        go: "rank go 311;event_1_57364318;=500;ak;;ka;=500;event_1_86741439;"
      }, {
        n: "西夏哈日",
        fn: PLU.goHaRi
      }, {
        n: "西夏九翼",
        go: "rank go 311;s;s;sw;log?自己换装备打吧;"
      }, {
        n: "",
        go: "home;"
      },
    ];
  },
  //================================================================================================
  TianShan7Xia: function TianShan7Xia(callback) {
    PLU.execActions("jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw", function () {
      PLU.autoFight({
        targetKey: "\nevent_1_37376258",
        // 懒的改函数了，直接注入（
        fightKind: " ",
        onFail: function onFail() {
          PLU.execActions("home;", function () {
            callback && callback();
          });
        },
        onEnd: function onEnd() {
          PLU.execActions("home;", function () {
            callback && callback();
          });
        }
      });
    });
  },
   //================================================================================================
   answerQues($btn){
    let btnFlag = PLU.setBtnRed($btn)
    if(!btnFlag) {
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        return UTIL.delSysListener("onAnswerQuestions")
    }
    YFUI.showPop({
        title:"答题",
        text:"是否开始答题?",
        onOk(){
            PLU.loopAnswerQues($btn)
        },
        onNo(){
            PLU.setBtnRed($btn,0)
        }
    })
},
//================================================================================================
loopAnswerQues($btn){
    let setAnswerTimeout=function(){
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        PLU.STO.ansTo = setTimeout(()=>{
            UTIL.delSysListener("onAnswerQuestions")
            PLU.setBtnRed($btn,0)
            YFUI.writeToOut("<span style='color:#FFF;'>--答案超时！--</span>")
            return
        },5000)
    };
    UTIL.addSysListener("onAnswerQuestions", function(b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("每日武林知识问答次数已经达到限额")>-1) {
            UTIL.delSysListener("onAnswerQuestions")
            PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
            PLU.setBtnRed($btn,0)
            YFUI.showPop({
                title:"答题结束",
                text:"是否回首页?",
                autoOk:10,
                onOk(){
                    clickButton("home")
                },
                onNo(){}
            })
            return;
        }
        if (type != "show_html_page") return;
        var qs = msg.split("\n");
        if (!qs) return;
          if (qs[0].indexOf("知识问答第") < 0)  return;
        setAnswerTimeout()
        var qus = "";
        for (var i = 1; i < qs.length; i++) {
            qus = $.trim(UTIL.filterMsg(qs[i]));
            if (qus.length > 0) break;
        }
        if (qus.indexOf("回答正确")>=0) {
            clickButton('question')
            return;
        }
        var answer = PLU.getAnswer2Question(qus);
        if (answer == null){
            UTIL.delSysListener("onAnswerQuestions")
            PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
            PLU.setBtnRed($btn,0)
            YFUI.writeToOut("<span style='color:#FFF;'>--未找到答案："+qus+"--</span>")
            return
        }
        setTimeout(()=>{
            clickButton("question " + answer);
        },300)
    })
    setAnswerTimeout()
    clickButton('question')
},
//================================================================================================
getAnswer2Question(localQuestion) {
    var answer = YFD.QuestAnsLibs[localQuestion]
    if (answer) return answer;
    var halfQuestion = localQuestion.substring(localQuestion.length / 2)
    for (var quest in YFD.QuestAnsLibs) {
      if (quest.indexOf(halfQuestion) == 0) {
        return YFD.QuestAnsLibs[quest];
      }
    }
    return null;
},
/*
  loopAnswerQues: function (_loopAnswerQues) {
    function loopAnswerQues(_x) {
      return _loopAnswerQues.apply(this, arguments);
    }
    loopAnswerQues.toString = function () {
      return _loopAnswerQues.toString();
    };
    return loopAnswerQues;
  }(function (callback) {
    var setAnswerTimeout = function setAnswerTimeout() {
      PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
      PLU.STO.ansTo = setTimeout(function () {
        UTIL.delSysListener("onAnswerQuestions");
        YFUI.writeToOut("<span style='color:#FFF;'>--答案超时！--</span>");
      }, 5000);
    };
    UTIL.addSysListener("onAnswerQuestions", function (b, type, subtype, msg) {
      if (type == "notice" && msg.indexOf("每日武林知识问答次数已经达到限额") > -1) {
        if (callback) callback(); else clickButton("home");
        UTIL.delSysListener("onAnswerQuestions");
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        return;
      }
      if (type != "show_html_page") return;
      var qs = msg.split("\n");
      if (!qs) return;
      if (qs[0].indexOf("知识问答第") < 0) return;
      setAnswerTimeout();
      var qus = "";
      for (var i = 1; i < qs.length; i++) {
        qus = $.trim(UTIL.filterMsg(qs[i]));
        if (qus.length > 0) break;
      }
      if (qus.indexOf("回答正确") >= 0) {
        clickButton("question");
        return;
      }
      var answer = PLU.getAnswer2Question(qus);
      if (answer == null) {
        UTIL.delSysListener("onAnswerQuestions");
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        PLU.setBtnRed($btn, 0);
        YFUI.writeToOut("<span style='color:#FFF;'>--未找到答案：" + qus + "--</span>");
        return;
      }
      setTimeout(function () {
        clickButton("question " + answer);
      }, 300);
    });
    PUL.loopAnswerQues;
    setAnswerTimeout();
    clickButton("question");
  }),
  //================================================================================================
  getAnswer2Question: function getAnswer2Question(localQuestion) {
    var answer = PLU.YFD.QuestAnsLibs[localQuestion];
    if (answer) return answer;
    var halfQuestion = localQuestion.substring(localQuestion.length / 2);
    for (var quest in PLU.YFD.QuestAnsLibs) {
      if (quest.indexOf(halfQuestion) == 0) {
        return PLU.YFD.QuestAnsLibs[quest];
      }
    }
    return null;
  },
  */
  //================================================================================================
  autoBingyue: function autoBingyue(callback) {
    PLU.execActions("jh 14;w;n;n;n;n;event_1_32682066;;;", function () {
      setTimeout(function () {
        PLU.killBingYue(function () {
          if (callback) callback(); else clickButton("home");
        });
      });
    });
  },
  //================================================================================================
  killBingYue: function killBingYue(endCallback) {
    if (parseInt(PLU.getCache("autoPerform")) < 1) {
      PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 1);
    }
    var tryKill = function tryKill(kname, cb, er) {
      PLU.autoFight({
        targetName: kname,
        fightKind: "kill",
        onFail: function onFail() {
          er && er();
        },
        onEnd: function onEnd() {
          cb && cb();
        }
      });
    };
    PLU.execActions("event_1_48044005;;;;", function () {
      tryKill("冰麟兽", function () {
        PLU.execActions("event_1_95129086;;;;", function () {
          tryKill("玄武机关兽", function () {
            PLU.execActions("event_1_17623983;event_1_41741346;;;;", function () {
              tryKill("九幽魔灵", function () {
                PLU.execActions("s;;;;", function () {
                  tryKill("冰月仙人", function () {
                    endCallback && endCallback();
                  }, function () {
                    endCallback && endCallback();
                  });
                });
              }, function () {
                endCallback && endCallback();
              });
            });
          }, function () {
            endCallback && endCallback();
          });
        });
      }, function () {
        endCallback && endCallback();
      });
    });
  },
  //================================================================================================
  autoXTL1: function autoXTL1() {
    clickButton("team create");
    PLU.killLHYD(function (err) {
      return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
    });
  },
  autoXTL2: function autoXTL2() {
    clickButton("team create");
    PLU.killSY(function (err) {
      return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
    });
  },
  autoFB11: function autoFB11() {
    //clickButton("team create");
    YFUI.showPop({
      title: "副本11",
      text: "请自行组队，准备好可以开始",
      onOk: function onOk(val) {
        PLU.killFB11(function (err) {
          return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
        });
      },
      onNo: function onNo() { }
    });
  },
  autoFB10: function autoFB10() {
    clickButton("team create");
    PLU.killFB10(function (err) {
      return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
    });
  },
  autoyoumhy: function autoyoumhy() {
    clickButton("team create");
    PLU.killyoumhy(function (err) {
      return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
    });
  },
  autoERG: function autoERG() {
    PLU.killERG(function (err) {
      return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
    });
  },
  //================================================================================================
  scanPuzzle: function scanPuzzle() {
    PLU.TMP.autoscan = true;
    PLU.TMP.autotask = true;
    UTIL.addSysListener("reload", function (b, type, subtype, msg) {
      if (type == "notice" && subtype == "notify_fail" && msg == "你的背包里没有这个物品。\n") location.reload();
    });
    if (!PLU.TMP.index) PLU.TMP.index = 0;
    PLU.TMP.func = function () {
      PLU.execActions(PLU.linkPath(PLU.queryRoomPath(), PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].way), function () {
        PLU.execActions(";;ask " + PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].id, function () {
          PLU.TMP.puzzleTimeOut = setTimeout(function () {
            if (!PLU.TMP.puzzleWating.status) {
              PLU.TMP.index++;
              PLU.TMP.func();
            }
          }, PLU.getCache("puzzleTimeOut") * 1000);
        });
      });
    };
    PLU.TMP.func();
  },
  puzzleKey: function puzzleKey() {
    YFUI.showInput({
      title: "密码设置",
      text: "此设置跨角色共享<br>指定暴击密码由谁提交(输入角色ID)",
      value: localStorage.getItem("masterAcc") || PLU.accId,
      onOk: function onOk(val) {
        localStorage.setItem("masterAcc", String(val));
      },
      onNo: function onNo() { }
    });
  },
  puzzleTimeOut: function puzzleTimeOut() {
    YFUI.showInput({
      title: "超时设置",
      text: "一条谜题最多耗时(单位：秒)，0为不超时，暂不推荐设置为0",
      value: PLU.getCache("puzzleTimeOut") || 60,
      onOk: function onOk(val) {
        PLU.setCache("puzzleTimeOut", val);
      },
      onNo: function onNo() { }
    });
  },
  path4FHMJ: function path4FHMJ(endCallback) {
    PLU.execActions("jh");
    if (g_obj_map.get("msg_jh_list") && g_obj_map.get("msg_jh_list").get("finish43") == 0) {
      return "jh 1;e;n;n;n;n;w;event_1_90287255 go 6;e;s;sw;se;ne;se;s;";
    } else {
      return "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;;s;";
    }
  },
  //琅嬛玉洞
  killLHYD: function killLHYD(endCallback) {
    PLU.execActions(PLU.path4FHMJ() + ";event_1_52732806", function (f) {
      if (!f) return endCallback && endCallback(1);
      PLU.execActions("kill langhuanyudong_qixing;;kill langhuanyudong_benkuangxiao;;sw;;kill murong_tuboguoshi;;;get?吐蕃国师的尸体;;", function (f2) {
        if (!f2) return endCallback && endCallback(2);
        PLU.execActions("ne;n;;event_1_96023188;w;event_1_39972900;w;event_1_92817399;w;event_1_91110342;s;event_1_74276536;se;event_1_14726005;se;se;;;", function () {
          var sd = g_obj_map.get("msg_room").elements.find(function (e) {
            return e.value.indexOf("扫荡") >= 0;
          });
          if (sd) {
            var cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
            PLU.doSaoDang("langhuanyudong", cmd_sd, function () {
              PLU.killLHYD(endCallback);
            });
          } else {
            endCallback && endCallback(5);
          }
        });
      });
    });
  },
  //山崖
  killSY: function killSY(endCallback) {
    PLU.execActions(PLU.path4FHMJ() + "event_1_64526228", function (f) {
      if (!f) return endCallback && endCallback(1);
      PLU.execActions("kill shanya_muzhaoxue;;kill shanya_qiongduwu;;kill shanya_yuanzhenheshang;;;", function (f2) {
        if (!f2) return endCallback && endCallback(2);
        PLU.execActions("w;event_1_61179401;n;event_1_93134350;n;event_1_60227051;n;event_1_66986009;;kill mingjiao_mengmianrentoumu;;;;get?蒙面人头目的尸体;;", function () {
          PLU.execActions("n;event_1_53067175;n;event_1_58530809;w;event_1_86449371;event_1_66983665;;", function () {
            var sd = g_obj_map.get("msg_room").elements.find(function (e) {
              return e.value.indexOf("扫荡") >= 0;
            });
            if (sd) {
              var cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
              PLU.doSaoDang("shanya", cmd_sd, function () {
                PLU.killSY(endCallback);
              });
            } else {
              endCallback && endCallback(5);
            }
          });
        });
      });
    });
  },
  // 恶人谷
  killERG: function killERG(endCallback) {
    var flag = false;
    PLU.execActions("rank go 236;", function (f) {
      if (!f) return endCallback && endCallback(1);
      PLU.execActions("nw;n;n;n;n;n;n;wait#kill tianlongsi_lidazui;get?李大嘴的尸体;", function (f2) {
        if (!f2) return endCallback && endCallback(2);
        PLU.execActions("nw;nw;n;wait#kill tianlongsi_baikaixin;get?白开心的尸体;", function (f3) {
          if (!f3) return endCallback && endCallback(3);
          PLU.execActions("home;items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;");
        });
      });
    });
  },
  buyJHYL: function buyJHYL() {
    UTIL.addSysListener("9HYL", function (b, type, subtype, msg) {
      if (type != "show_html_page") return;
      var sp = msg.match(/你有四海商票\[1;32mx(\d+)\[2;37;0m/);
      if (!sp) return;
      sp = sp[1];
      if (sp < 21750) return YFUI.writeToOut("<span style='color:#FF0;'>--你的商票不足21750--</span>"); else PLU.execActions("reclaim buy 27 go 45;" +
        // 矢车菊
        "reclaim buy 46 go 45;" +
        // 雪英
        "reclaim buy 45 go 45;" +
        // 忘忧草
        "reclaim buy 29 go 15;" +
        // 凤凰木
        "reclaim buy 36 go 5;" +
        // 洛神花
        "reclaim buy 31 go 45;" +
        // 君影草
        "reclaim buy 32 go 45;" +
        // 仙客来
        "reclaim buy 33 go 15;" +
        // 凌霄花
        "reclaim buy 34 go 15;" + (
          // 夕雾草
          UTIL.inHome() ? "go_lookroom" : "home"));
      UTIL.delSysListener("9HYL");
    });
    PLU.execActions("reclaim recl");
  },
  //============日常任务===================================================================
  LZqiangss: function LZqiangss() {//龙族强身术
    var xueqsscs=10;
    YFUI.showInput({
      title: "龙族强身术",
      text: "请输入你要学习的次数，默认是10次=100级",
      value: 10,
      onOk: function onOk(val) {
        xueqsscs = parseInt(val);
        PLU.execActions("event_1_95170966");//10次
      },
      onNo: function onNo() {
        UTIL.delSysListener("LZqiangss");
      },
    });
    if ((xueqsscs && type === "notice" && msg.indexOf("消耗：潜能x5000亿，武林名望值x1000") !== -1)) {
      setTimeout(function () {
        //PLU.execActions("event_1_44239995")//1次
        PLU.execActions("event_1_95170966");//10次
        xueqsscs--;
      }, 200);
    }
    else if (type === "notice" && (msg.indexOf("没有足够的") !== -1 || msg.indexOf("不够") !== -1)) {
      UTIL.delSysListener("LZqiangss");
      setTimeout(function () {
        UTIL.delSysListener("LZqiangss");
        YFUI.writeToOut("<span style='color:yellow;'>=====完成学习龙族强身术=====</span>");
      }, 500);
    }
    setTimeout(function () {
      PLU.execActions("items get_store /obj/book/xiaoyunlongtengjiancanye"); //霄云龙腾剑残页
      PLU.execActions("items get_store /obj/baoshi/hongbaoshi8"); //天神红宝石
      PLU.execActions("items get_store /obj/book/neigongxinfamiji"); //内功心法秘籍
      PLU.execActions("items get_store /obj/shop/wulingchangye"); //武林至高绝学残页
      PLU.execActions("items get_store /obj/med/jinengtianshu"); //技能天书
      PLU.execActions("items get_store /obj/shop/jiuzhuanshendan"); //九转神丹
    }, 250);
  },

  tiejian: function tiejian() {
    //西凉铁剑
    PLU.execActions("jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;;");
  },
  baiyuan: function baiyuan() {
    //剑宫白猿
    PLU.execActions("rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_79113775;;");
  },
  yanwang10: function yanwang10() {
    //阎王十殿
    PLU.execActions("rank go 223;nw;event_1_42827171;ak;;ka;event_1_45876452;;");
  },
  gedou50: function gedou50(callback) {
    // 格斗五十
    var sjindi = 1;
    UTIL.addSysListener("gedou50", function (b, type, subtype, msg) {
      if (type == "notice") {
        var msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match("你抽到了")) {
          if (msgTxt.match(/此轮游戏结束/)) {
            PLU.execActions("event_1_36867949 get;event_1_36867949 pay;event_1_36867949 take;"); //拿钱走人再开
          }
          var sjindi = msgTxt.match(/奖池提升至(\d+)金锭/);
          var sjindiNumber = sjindi[1];
          if (sjindiNumber >= 30) {
            YFUI.writeToOut("<span style='color:#FFF;'>--到达--</span>"); //到达地下格斗场
            UTIL.delSysListener("gedou50");
            PLU.execActions("event_1_36867949 get;event_1_23520182;event_1_70249808 go 50;=24400;;attrs;", callback);
          } else {
            PLU.execActions("=300;event_1_36867949 take;"); //抽牌
          }
        }
      }
    });
    PLU.execActions("rank go 195;event_1_36867949 pay;event_1_36867949 take;");
  },
  gongcheng13: function gongcheng13() {
    //拱辰13
    PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;ak;;ka;;event_1_23639130;;");
  },
  rongbaoz: function rongbaoz(callback) {
    var _g_obj_map$get3;
    //荣宝斋
    PLU.execActions("golook_room;");
    var curName = UTIL.filterMsg(((_g_obj_map$get3 = g_obj_map.get("msg_room")) === null || _g_obj_map$get3 === void 0 ? void 0 : _g_obj_map$get3.get("short")) || "");
    if (curName == "拱辰楼十三层") {
      PLU.execActions("event_1_87723605;=500;s;w;w;#10 s;w;w;n;event_1_27429615;", callback);
    } else {
      PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 w;#10 s;w;w;n;event_1_27429615;", callback);
    }
  },
  nanzzouy: function nanzzouy(callback) {
    var _g_obj_map$get4;
    //南诏奏乐
    PLU.execActions("golook_room;");
    var curName = UTIL.filterMsg(((_g_obj_map$get4 = g_obj_map.get("msg_room")) === null || _g_obj_map$get4 === void 0 ? void 0 : _g_obj_map$get4.get("short")) || "");
    if (curName == "容宝斋") {
      PLU.execActions("s;e;e;n;n;w;n;event_1_41100562;;", callback);
    } else {
      PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 w;#8 s;w;n;event_1_41100562;;attrs;", callback);
    }
  },
  killtalin: function killtalin(callback) {
    var _g_obj_map$get5;
    //天龙塔林
    PLU.execActions("golook_room;");
    var curName = UTIL.filterMsg(((_g_obj_map$get5 = g_obj_map.get("msg_room")) === null || _g_obj_map$get5 === void 0 ? void 0 : _g_obj_map$get5.get("short")) || "");
    var cmd = "";
    if (curName == "大鹳淜洲") {
      cmd = "w;sw;s;s;sw;sw;sw;get tianlongsi_putiguo;se;se;se;ne;get tianlongsi_xiaoxianglu;ne;ne;;get tianlongsi_putiguo;nw;nw;nw;";
    } else {
      cmd = "rank go 236;nw;n;n;n;n;n;n;nw;nw;n;n;nw;nw;n;n;nw;ne;event_1_1996692;event_1_10567243;w;sw;s;s;sw;sw;sw;get tianlongsi_putiguo;se;se;se;ne;get tianlongsi_xiaoxianglu;ne;ne;;get tianlongsi_putiguo;nw;nw;nw;";
    }
    PLU.execActions(cmd, function () {
      PLU.execActions("ak;ka;=1500;home;", callback);
      YFUI.writeToOut("<span style='color:#FFF;'>--塔林完成--</span>");
      callback && callback();
    });
  },
  askTianmd: function askTianmd(callback) {
    //讨天命丹
    var countttmd = 0;
    PLU.execActions("rank go 236;nw;n;n;n;n;n;n;nw;nw;n;n;nw;nw;n;n;nw;ne;event_1_1996692;event_1_10567243", function () {
      UTIL.addSysListener("asktmd", function (b, type, subtype, msg) {
        if (type == "notice" && msg.startsWith("你得到天命丹x1")) {
          countttmd++;
          YFUI.writeToOut("<span style='color:yellow;'>=====获得天命丹：" + countttmd + " 次=====</span>");
          if (countttmd >= 10) {
            UTIL.delSysListener("asktmd");
            YFUI.writeToOut("<span style='color:yellow;'>=====讨天命丹完成=====</span>");
            PLU.execActions("golook_room;", function () {
              callback && callback();
            });
          }
        } else if (type == "main_msg" && msg.indexOf("柴绍") >= 0) {
          PLU.execActions(";ask tianlongsi_chaishao;");
        }
      });
      PLU.execActions("ask tianlongsi_chaishao");
    });
  },
  //============周常任务===================================================================
  nanzwenz: function nanzwenz(callback) {
    var _g_obj_map$get6;
    // 南诏问诊
    PLU.execActions("golook_room;");
    var curName = UTIL.filterMsg(((_g_obj_map$get6 = g_obj_map.get("msg_room")) === null || _g_obj_map$get6 === void 0 ? void 0 : _g_obj_map$get6.get("short")) || "");
    var addNanzwenzListener = function addNanzwenzListener() {
        UTIL.addSysListener("nanzwenz", function (b, type, subtype, msg) {
          if (type === "main_msg") {
            var msgTxt = UTIL.filterMsg(msg);
            if (msgTxt.match("问诊完成，获得") || msgTxt.match("你完成了每周的问诊任务")) {
              UTIL.delSysListener("nanzwenz");
              PLU.execActions("log?完成问诊;", callback);
            } else if (msgTxt.match("你正在诊治中，请耐心对待病人。") || msgTxt.match("于是你拿起医圣的银针")) {
              PLU.execActions("=2400;event_1_27222525;");
            }
          }
        });
        PLU.execActions("event_1_27222525;");
      };
    if (curName === "元帅府") {
      PLU.execActions("s;e;#8 n;w;w;s", addNanzwenzListener);
    } else {
      PLU.execActions("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#7 w;s;event_1_12050280;", addNanzwenzListener);
    }
  },
  piapiapia: function piapiapia(callback) {
    PLU.execActions("rank go 233;#3 s;e;ne;event_1_66728795", function () {
      UTIL.addSysListener("waitVS", function(b, type, subtype, msg) {
        if (type == "vs" && subtype == "vs_info") {
          UTIL.delSysListener("waitVS");
          PLU.autoFight({
            targetCommand: "none",
            onFail: function onFail() {
              setTimeout(callback, 1000);
            },
            onEnd: function onEnd() {
              setTimeout(callback, 500);
            }
          });
        }
      })
    });
  },
  //======个人====================================================================================
  saoxlr: function saoxlr(callback) {//刷小龙人
      PLU.execActions("items get_store /obj/shop/meiguihua;items info meigui hua;jh 2;event_1_69287816;ak;");
    UTIL.addSysListener("saoxlr", function (b, type, subtype, msg,) {
      if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "玫瑰花" || type == "notice" && subtype == "notify_fail" && msg.indexOf("你的背包里没有这个物品") == 0) {
        UTIL.delSysListener("meigui");
        var meigui = parseInt(b.get("amount")) || 0;
        if (meigui < 140) {
          PLU.execActions("#".concat(Math.ceil((140 - meigui) / 10), " shop buy shop28_N_10"));
        }
       } else if ((type === "jh" && subtype === "info")) {
            PLU.execActions("=1500;kill snow_xiaolongren;");
        } else if ((type === "vs" && subtype === "text" && msg.indexOf("\n\x1B[1;33m小龙人\x1B[2;37;0m死了。") !== -1)) {
            setTimeout(function () {
              PLU.execActions("=1500;kill snow_xiaolongren;");
            }, 400);
        } else if ((type === "notice" && msg.indexOf("你今天挑战太多了") !== -1)) {
          UTIL.delSysListener("saoxlr");
          PLU.execActions("ka;log?完成小龙人;home;", callback);
        }
      });
    },
  
    saodsm: function saodsm(callback) {//扫荡VIP师门
      PLU.execActions("items get_store /obj/shop/shimenling;items info obj_shimenling;");
      UTIL.addSysListener("saodsm", function (b, type, subtype, msg) {
        if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "师门令") || (type === "notice" && subtype === "notify_fail" && msg.indexOf("你的仓库里没有这个物品") === 0)) {
            PLU.execActions("items use obj_shimenling;");
          } else if ((type === "notice" && msg.indexOf("使用师门令成功，师门任务次数+") !== -1)) {
            setTimeout(function () {
              PLU.execActions("items use obj_shimenling;");
            }, 200);
          } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf("你目前不能使用师门令") !== -1)) {
            setTimeout(function () {
              PLU.execActions("vip finish_family;");
            }, 200);
          } else if ((type === "notice" && msg.indexOf("本源无上心经残页x1") !== -1)) {
            setTimeout(function () {
              PLU.execActions("vip finish_family;");
            }, 200);
        } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf("今日师门任务已做完。") !== -1)) {
          UTIL.delSysListener("saodsm");
          PLU.execActions("log?完成VIP师门;", callback);
        }
      });
    },
    saodbjst: function saodbjst(callback) {//吃石头点暴击
        PLU.execActions("event_1_69809751;event_1_88152825;items info obj_mitiling;");
        UTIL.addSysListener("saodbjst", function (b, type, subtype, msg) {
            if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "谜题令")) {
                PLU.execActions("items use obj_mitiling;");
            } else if ((type === "notice" && msg.indexOf("使用谜题令成功，可使用谜题卡次数+") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("items use obj_mitiling;");
                }, 200);
            } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf("你目前不能使用\x1B[1;32m谜题令") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("vip finish_big_task;");
                }, 200);
            } else if ((type === "main_msg" && msg.indexOf("恭喜你，额外获得") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("vip buy_task;vip finish_big_task;");
                }, 200);
            } else if ((type === "notice" && msg.indexOf("今日谜题任务已做完。") !== -1)) {
                UTIL.delSysListener("saodbjst");
                PLU.execActions("log?完成VIP暴击扫荡第二次;", callback);
            }
        });
    },
  saodbj: function saodbj(callback) {//扫荡VIP暴击
        PLU.execActions("wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;items get_store /obj/shop/mitiling;items info obj_mitiling;");
        UTIL.addSysListener("saodbj", function (b, type, subtype, msg) {
            if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "谜题令")) {
                PLU.execActions("items use obj_mitiling;");
            } else if ((type === "notice" && msg.indexOf("使用谜题令成功，可使用谜题卡次数+") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("items use obj_mitiling;");
                }, 200);
            } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf("你目前不能使用\x1B[1;32m谜题令") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("vip finish_big_task;");
                }, 200);
            } else if ((type === "main_msg" && msg.indexOf("恭喜你，额外获得") !== -1)) {
                setTimeout(function () {
                  PLU.execActions("vip buy_task;vip finish_big_task;");
                }, 200);
            } else if ((type === "notice" && msg.indexOf("今日谜题任务已做完。") !== -1)) {
                UTIL.delSysListener("saodbj");
                PLU.execActions("log?完成VIP暴击扫荡;", callback);
            }
        });
    },
    DailyOres(callback) {
      PLU.execActions("jh 2;#10 n;#2 w;event_1_85264690;items info obj_tbg;");
      UTIL.addSysListener("DailyOres", function (b, type, subtype, msg) {
        if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "探宝镐")) {
          PLU.execActions("#2 w;event_1_37287831;event_1_49475184;home;", callback);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf("你的背包里没有这个物品") == 0) {
          PLU.execActions("home;", callback);
        }
      });
    },
  buyzl10: function buyzl11() {//买斩龙套
    var ybjifen = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("xf_score");
    YFUI.writeToOut("<span style='color:#7FFF00;'>当前消费积分: ".concat(ybjifen || "未知", "</span>"));
      YFUI.showPop({
        title: "买斩龙套",
        text: "请先确认你有足够的消费积分，购买斩龙套需要49.2W积分，不够请取消。",
        onOk: function onOk(val) {
            setTimeout(function () {
                PLU.execActions("shop xf_buy xf_shop51;shop xf_buy xf_shop52;shop xf_buy xf_shop48;shop xf_buy xf_shop47;shop xf_buy xf_shop46;shop xf_buy xf_shop44;shop xf_buy xf_shop43;moke equip_armor10;moke equip_boots10;moke equip_finger10;moke equip_head10;moke equip_neck10;moke equip_wrists10;moke equip_waist10;");
              }, 400);
        },
        onNo: function onNo() { }
      });
  },
  dhyt11: function dhyt11() {//兑换胤天套
    YFUI.showPop({
        title: "兑换胤天",
        text: "请先确认你有足够的11阶装备碎片，不够请取消，游四海那里直接兑换5000再来。",
        onOk: function onOk(val) {
            setTimeout(function () {
                PLU.execActions("items get_store /obj/quest/hat_suipian11;items get_store /obj/quest/waist_suipian11;items get_store /obj/quest/shield_suipian11;items get_store /obj/quest/blade_suipian11;items get_store /obj/quest/sword_suipian11;items get_store /obj/quest/unarmed_suipian11;items get_store /obj/quest/throwing_suipian11;items get_store /obj/quest/staff_suipian11;items get_store /obj/quest/stick_suipian11;items get_store /obj/quest/whip_suipian11;items get_store /obj/quest/axe_suipian11;items get_store /obj/quest/necklace_suipian11;items get_store /obj/quest/hammer_suipian11;items get_store /obj/quest/spear_suipian11;items get_store /obj/quest/wrists_suipian11;items get_store /obj/quest/finger_suipian11;items get_store /obj/quest/boots_suipian11;items get_store /obj/quest/cloth_suipian11;items get_store /obj/quest/armor_suipian11;items get_store /obj/quest/dagger_suipian11;items get_store /obj/quest/surcoat_suipian11;jh 1;e;n;n;w;#40 event_1_58404606;"+
                "jh 3;s;e;n;duihuan_mieshen_go gift1;duihuan_mieshen_go gift10;duihuan_mieshen_go gift2;duihuan_mieshen_go gift3;duihuan_mieshen_go gift4;duihuan_mieshen_go gift5;duihuan_mieshen_go gift7;moke equip_armor11;moke equip_boots11;moke equip_finger11;moke equip_wrists11;moke equip_neck11;moke equip_waist11;moke equip_head11;");
              }, 400);
        },
        onNo: function onNo() { }
      });
  },
  dhht12: function dhht12() {//兑换皇天套
    YFUI.showPop({
        title: "换12阶皇天",
        text: "请先确认你有足够的12阶装备碎片，不够请取消，游四海那里直接兑换5000再来。",
        onOk: function onOk(val) {
            setTimeout(function () {
                PLU.execActions("items get_store /obj/shop/dog_liquan;items get_store /obj/quest/hat_suipian12;items get_store /obj/quest/waist_suipian12;items get_store /obj/quest/shield_suipian12;items get_store /obj/quest/blade_suipian12;items get_store /obj/quest/sword_suipian12;items get_store /obj/quest/unarmed_suipian12;items get_store /obj/quest/throwing_suipian12;items get_store /obj/quest/staff_suipian12;items get_store /obj/quest/stick_suipian12;items get_store /obj/quest/whip_suipian12;items get_store /obj/quest/axe_suipian12;items get_store /obj/quest/necklace_suipian12;items get_store /obj/quest/hammer_suipian12;items get_store /obj/quest/spear_suipian12;items get_store /obj/quest/wrists_suipian12;items get_store /obj/quest/finger_suipian12;items get_store /obj/quest/boots_suipian12;items get_store /obj/quest/cloth_suipian12;items get_store /obj/quest/armor_suipian12;items get_store /obj/quest/dagger_suipian12;items get_store /obj/quest/surcoat_suipian12;"+
                "jh 3;s;e;n;duihuan_eq12_go gift1;duihuan_eq12_go gift10;duihuan_eq12_go gift2;duihuan_eq12_go gift3;duihuan_eq12_go gift4;duihuan_eq12_go gift5;duihuan_eq12_go gift7;moke equip_armor12;moke equip_boots12;moke equip_finger12;moke equip_wrists12;moke equip_neck12;moke equip_waist12;moke equip_head12;");
              }, 400);
        },
        onNo: function onNo() { }
      });
  },
  dhbingy: function dhbingy() {//兑换冰月材料
    PLU.execActions("reclaim buy;");
    UTIL.addSysListener("dhbingy", function (b, type, subtype, msg) {
        if (type != "show_html_page") return;
        var sp = msg.match(/你有四海商票\[1;32mx(\d+)\[2;37;0m/);
        //YFUI.writeToOut("<span style='color:#7FFF00;'>".concat(sp || "未知", "</span>"));
    });
    YFUI.showPop({
        title: "兑换冰月材料",
        text: "需要762万四海商票，不够请取消，游四海那里兑换点天神再来。<br>\n    <span>材料需要：700长生石，1400冰月羽。<br>\n    <span>材料足够的请取消，直接打造。",
        onOk: function onOk(val) {
            setTimeout(function () {
                PLU.execActions("reclaim buy 10 700;reclaim buy 11 1400;");
              }, 200);
        },
        onNo: function onNo() { }
      });
   },
  dzbingy: function dzbingy() {//打造冰月套
    YFUI.showPop({
        title: "打造冰月",
        text: "请先确认你有冰月材料，不够请取消，点击兑换冰材再来。",
        onOk: function onOk(val) {
            setTimeout(function () {
                PLU.execActions("wear equip_moke_head12;wear equip_moke_waist12;wear equip_moke_neck12;wear equip_moke_wrists12;wear equip_moke_finger12;wear equip_moke_boots12;wear equip_moke_armor12;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_waist12;by_upgrade 1 equip_moke_wrists12;by_upgrade 1 equip_moke_neck12;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;wear equip_by_neck12;wear equip_by_wrists12;wear equip_by_waist12;jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_waist12;#100 by_upgrade 2 equip_by_wrists12;#100 by_upgrade 2 equip_by_neck12;jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_waist12;#100 by_upgrade 3 equip_by_wrists12;#100 by_upgrade 3 equip_by_neck12;"+
                "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;by_upgrade 1 equip_moke_boots12;wear equip_by_boots12;wear equip_by_finger12;wear equip_by_armor12;wear equip_by_head12;jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_head12;#100 by_upgrade 2 equip_by_armor12;#100 by_upgrade 2 equip_by_finger12;#100 by_upgrade 2 equip_by_boots12;jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_head12;#100 by_upgrade 3 equip_by_armor12;#100 by_upgrade 3 equip_by_finger12;#100 by_upgrade 3 equip_by_boots12;remove equip_by_boots12;remove equip_by_finger12;remove equip_by_armor12;remove equip_by_head12;remove equip_by_neck12;remove equip_by_waist12;remove equip_by_wrists12;#100 by_upgrade 3 equip_by_surcoat11;#100 by_upgrade 3 equip_by_yupei12;");
              }, 200);
        },
        onNo: function onNo() { }
      });
   },
  dhjians: function dhjians() {//兑换剑神套
    YFUI.showPop({
        title: "兑换兑换剑神套",
        text: "请装备好材料再点确认。",
        onOk: function onOk(val) {
            setTimeout(function () {
            PLU.execActions("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 0;items upgrade_13shoushi go 1;items upgrade_13shoushi go 2;items upgrade_13shoushi go 3;items upgrade_13shoushi go 4;items upgrade_13shoushi go 5;items upgrade_13shoushi go 6;home;"+
      "#4 imbed obj_jianxinbumie wear huangbaoshi8;#2 imbed obj_jianxinbumie wear lanbaoshi8;imbed obj_jianxinbumie wear lvbaoshi8;"+
      "#4 imbed obj_jianyironghen wear hongbaoshi8;#2 imbed obj_jianyironghen wear lanbaoshi8;imbed obj_jianyironghen wear lvbaoshi8;"+
      "#4 imbed obj_jiandaozhangcun wear lanbaoshi8;#3 imbed obj_jiandaozhangcun wear lvbaoshi8;"+
      "#4 imbed obj_wuyinglou-xianglian wear lanbaoshi8;#3 imbed obj_wuyinglou-xianglian wear lvbaoshi8;"+
      "#4 imbed obj_wuyinglou-shouzhuo wear hongbaoshi8;#2 imbed obj_wuyinglou-shouzhuo wear lanbaoshi8;imbed obj_wuyinglou-shouzhuo wear lvbaoshi8;"+
      "#4 imbed obj_wuyinglou-jiezhi wear hongbaoshi8;#2 imbed obj_wuyinglou-jiezhi wear lvbaoshi8;imbed obj_wuyinglou-jiezhi wear lanbaoshi8;"+
      "#4 imbed obj_wuwozhijian wear lanbaoshi8;#3 imbed obj_wuwozhijian wear lvbaoshi8;"+
      "wear obj_jianyironghen;wear obj_wuyinglou-jiezhi;wear obj_jianxinbumie;wear obj_jiandaozhangcun;wear obj_wuyinglou-xianglian;wear obj_wuwozhijian;wear obj_wuyinglou-shouzhuo;");
        }, 200);
        },
        onNo: function onNo() { }
      });
   },
  dhchuid: function dhchuid() {//兑换垂钓套
    YFUI.showPop({
        title: "兑换垂钓套",
        text: "请装备好材料再点确认。",
        onOk: function onOk(val) {
            setTimeout(function () {
               PLU.execActions("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 7;items upgrade_13shoushi go 8;items upgrade_13shoushi go 9;items upgrade_13shoushi go 10;items upgrade_13shoushi go 11;items upgrade_13shoushi go 12;items upgrade_13shoushi go 13;home;"+
               "log?没得装备没写完，只能兑换，后面自己打宝石穿装备;");
    }, 200);
},
onNo: function onNo() { }
});
},
  dhzxianz: function dhzxianz() {//兑换贤者套
    YFUI.showPop({
        title: "兑换贤者套",
        text: "请装备好材料再点确认。",
        onOk: function onOk(val) {
    setTimeout(function () {
        PLU.execActions("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 14;items upgrade_13shoushi go 15;items upgrade_13shoushi go 16;items upgrade_13shoushi go 17;items upgrade_13shoushi go 18;items upgrade_13shoushi go 19;items upgrade_13shoushi go 20;home;"+
        "#4 imbed obj_zhongzuiduxing wear hongbaoshi8;#2 imbed obj_zhongzuiduxing wear lanbaoshi8;imbed obj_zhongzuiduxing wear lvbaoshi8;"+
        "#4 imbed obj_qingtianwanshi wear lanbaoshi8;#3 imbed obj_qingtianwanshi wear lvbaoshi8;"+
        "#4 imbed obj_lankeyimeng wear huangbaoshi8;#2 imbed obj_lankeyimeng wear lanbaoshi8;imbed obj_lankeyimeng wear lvbaoshi8;"+
        "#4 imbed obj_shanyecunfu wear lanbaoshi8;#3 imbed obj_shanyecunfu wear lvbaoshi8;"+
        "#4 imbed obj_xianzhe-xianglian wear lanbaoshi8;#3 imbed obj_xianzhe-xianglian wear lvbaoshi8;"+
        "#4 imbed obj_xianzhe-shouzhuo wear hongbaoshi8;#2 imbed obj_xianzhe-shouzhuo wear lanbaoshi8;imbed obj_xianzhe-shouzhuo wear lvbaoshi8;"+
        "#4 imbed obj_xianzhe-jiezhi wear hongbaoshi8;#2 imbed obj_xianzhe-jiezhi wear lvbaoshi8;imbed obj_xianzhe-jiezhi wear lanbaoshi8;"+
        "wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;"
        );
      }, 200);
     },
    onNo: function onNo() { }
   });
  },
  ningjlp: function ningjlp() {//凝聚力魄
    PLU.execActions("jh 1;event_1_87882130 go 0;event_1_87882130 go 1;event_1_87882130 go 2;event_1_87882130 go 3;event_1_87882130 go 4;event_1_87882130 go 5;event_1_87882130 go 6;event_1_87882130 go 7;event_1_87882130 go 8;event_1_87882130 go 9;event_1_87882130 go 10;event_1_87882130 go 11;event_1_87882130 go 12;");
  },
  xuetyz: function xuetyz() {//雪亭驿
    PLU.execActions("jh 1;e;#3 n;n;w;");
  },
  Longsyj: function Longsyj() {//龙神遗迹
    PLU.execActions("jh 1;e;#3 n;n;w;event_1_90287255 go go_lsyj;");
  },
  choujiang: function choujiang() {//抽奖
    var countProte = 0; // 统计神秘渔护的数量
    var countTalisman = 0; // 统计龙神试炼锦囊的数量
    var countLSDBag = 0; // 统计龙神试炼福袋的数量
    var countcj=100;
    UTIL.addSysListener("choujjuan", function (b, type, subtype, msg) {
      if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "抽奖券") ||
          (type === "notice" && subtype === "notify_fail" && msg.indexOf("你的背包里没有这个物品") === 0)) {
        var choujjuan = parseInt(b.get("amount")) || 0;
        YFUI.writeToOut("<span style='color:#FFFF55;'>当前抽奖卷数量: " + choujjuan + "</span>");
        if (!choujjuan) {
          UTIL.delSysListener("choujjuan");
          return;
        }
        YFUI.showInput({
          title: "抽奖",
          text: "请确保抽奖卷足够，默认为100=1000次抽奖",
          value: 100,
          onOk: function onOk(valcj) {
            countcj = parseInt(valcj)
            PLU.execActions("jh 1;go_choujiang 10");
          },
          onNo: function onNo() {
            UTIL.delSysListener("choujjuan");
          },
        });
      }
      else if ((countcj && type === "notice" && msg.indexOf("抽奖10次额外获得") !== -1)) {
        setTimeout(function () {
        PLU.execActions("go_choujiang 10")
        countcj--;
      }, 200);
      }
      else if (type === "notice" && ((msg.indexOf("没有足够的抽奖卷") !== -1) ||(msg.indexOf("剩余抽奖次数不够") !== -1) || msg.indexOf("抽奖次数已经用完") !== -1)) {
        UTIL.delSysListener("choujjuan");
        setTimeout(function () {
          UTIL.delSysListener("choujjuan");
          PLU.execActions("home;=300;");
          YFUI.writeToOut("<span style='color:yellow;'>=====完成抽奖=====</span>");
          YFUI.writeToOut("<span style='color:#FF0000;'>获得神秘渔护: " + countProte + "</span>");
          YFUI.writeToOut("<span style='color:#FF0000;'>获得龙神试炼锦囊: " + countTalisman + "</span>");
          YFUI.writeToOut("<span style='color:#FF0000;'>获得龙神试炼福袋: " + countLSDBag + "</span>");
        }, 500);
      }
      // 监听抽奖获得物品的消息
      else if (type === "notice" && msg.indexOf("抽奖") !== -1) {
        var regexMyProte = /神秘[\s\S]*?渔[\s\S]*?护[\s\S]*?x(\d+)/;
        var regexTalisman = /龙[\s\S]*?神[\s\S]*?试炼[\s\S]*?锦囊[\s\S]*?x(\d+)/;
        var regexLSDBag = /龙[\s\S]*?神[\s\S]*?试炼[\s\S]*?福袋[\s\S]*?x(\d+)/;

        if (regexMyProte.test(msg)) {
          var quantity = parseInt(regexMyProte.exec(msg)[1]) || 1;
          countProte += quantity;
        }
        if (regexTalisman.test(msg)) {
          var quantity = parseInt(regexTalisman.exec(msg)[1]) || 1;
          countTalisman += quantity;
        }
        if (regexLSDBag.test(msg)) {
          var quantity = parseInt(regexLSDBag.exec(msg)[1]) || 1;
          countLSDBag += quantity;
        }
      }
      else if (!countcj) {
        UTIL.delSysListener("choujjuan");
        setTimeout(function () {
            UTIL.delSysListener("choujjuan");
            PLU.execActions("hoem;=300;");
            YFUI.writeToOut("<span style='color:yellow;'>=====完成抽奖=====</span>");
            YFUI.writeToOut("<span style='color:#FF0000;'>获得神秘渔护: " + countProte + "</span>");
            YFUI.writeToOut("<span style='color:#FF0000;'>获得龙神试炼锦囊: " + countTalisman + "</span>");
            YFUI.writeToOut("<span style='color:#FF0000;'>获得龙神试炼福袋: " + countLSDBag + "</span>");
          }, 500);

      }
    });
    setTimeout(function () {
      PLU.execActions("items get_store /obj/shop/choujiangquan;items info obj_choujiangquan;");
    }, 250);
  },

  givehuf: function givehuf() {
    //交虎符
    PLU.execActions("jh 1;e;#3 n;n;w;event_1_90287255 go go_lsyj;=200;items get_store /obj/quest/jinyuhufusuipian;#6 event_1_56364978;#6 event_1_49251725;");
  },
  huanpf: function huanpf() {
    //换皮肤
    YFUI.showInput({
      title: "换皮肤",
      text: '请输入你要选的皮肤，<br>\n              <span>1：极简之风<br>\n              <span style="color:#578DC9;">2：碧海奇侠<br>\n              <span style="color:#8F7D5C;">3：大漠飞鹰<br>\n              ',
      value: "1",
      // 默认值为1
      onOk: function onOk(val) {
        PLU.execActions("skin_select ".concat(val)); // 使用输入的值换皮肤
      },

      onNo: function onNo() { }
    });
  },
  zbjianshen: function zbjianshen() {
    //剑神套
    PLU.execActions("wear obj_jianxinbumie;wear obj_jianyironghen;wear obj_jiandaozhangcun;wear obj_wuyinglou-xianglian;wear obj_wuyinglou-shouzhuo;wear obj_wuyinglou-jiezhi;wear obj_wuwozhijian;log?剑神套穿戴完毕!;");
  },
  zbchuidiao: function zbchuidiao() {
    //垂钓套
    PLU.execActions("wear obj_fushenbanxian;wear obj_yinqingruanque;wear obj_chuidiaozhe-shouzhuo;wear obj_chuidiaozhe-xianglian;wear obj_chuidiaozhe-jiezhi;wear obj_hanjianguyin;wear obj_zhouyebufen;log?垂钓套穿戴完毕!;");
  },
  zbxianzhe: function zbxianzhe() {
    //贤者套
    PLU.execActions("wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;log?贤者套穿戴完毕!;");
  },
  caomeibs: function caomeibs() {
    //草莓冰沙
    PLU.execActions("items use obj_caomeibingsha");
  },
  eatbuping: function eatbuping() {
    //吃补品
    PLU.execActions("items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;items use obj_molitang;items use obj_yuanxiao;items use obj_jiuhuayulouwan;items use obj_qiaoguoer;items use obj_lanlingmeijiu;items use obj_bingtanghulu;");
  },
  Qubaos: function Qubaos() {
    PLU.execActions("items get_store /obj/baoshi/lvbaoshi2;" +
      //绿宝石裂开
      "items get_store /obj/baoshi/lvbaoshi3;" +
      //绿宝石
      "items get_store /obj/baoshi/lvbaoshi4;" +
      //绿宝石无暇
      "items get_store /obj/baoshi/lvbaoshi5;" +
      //绿宝石完美
      "items get_store /obj/baoshi/lvbaoshi6;" +
      //绿宝石君王
      "items get_store /obj/baoshi/lvbaoshi7;" +
      //绿宝石皇帝
      "items get_store /obj/baoshi/hongbaoshi2;" +
      //红宝石裂开
      "items get_store /obj/baoshi/hongbaoshi3;" +
      //红宝石
      "items get_store /obj/baoshi/hongbaoshi4;" +
      //红宝石无暇
      "items get_store /obj/baoshi/hongbaoshi5;" +
      //红宝石完美
      "items get_store /obj/baoshi/hongbaoshi6;" +
      //红宝石君王
      "items get_store /obj/baoshi/hongbaoshi7;" +
      //红宝石皇帝
      "items get_store /obj/baoshi/lanbaoshi2;" +
      //蓝宝石裂开
      "items get_store /obj/baoshi/lanbaoshi3;" +
      //蓝宝石
      "items get_store /obj/baoshi/lanbaoshi4;" +
      //蓝宝石无暇
      "items get_store /obj/baoshi/lanbaoshi5;" +
      //蓝宝石完美
      "items get_store /obj/baoshi/lanbaoshi6;" +
      //蓝宝石君王
      "items get_store /obj/baoshi/lanbaoshi7;" +
      //蓝宝石皇帝
      "items get_store /obj/baoshi/huangbaoshi2;" +
      //黄宝石裂开
      "items get_store /obj/baoshi/huangbaoshi3;" +
      //黄宝石
      "items get_store /obj/baoshi/huangbaoshi4;" +
      //黄宝石无暇
      "items get_store /obj/baoshi/huangbaoshi5;" +
      //黄宝石完美
      "items get_store /obj/baoshi/huangbaoshi6;" +
      //黄宝石君王
      "items get_store /obj/baoshi/huangbaoshi7;" +
      //黄宝石皇帝
      "items get_store /obj/baoshi/zishuijing2;" +
      //紫宝石裂开
      "items get_store /obj/baoshi/zishuijing3;" +
      //紫宝石
      "items get_store /obj/baoshi/zishuijing4;" +
      //紫宝石无暇
      "items get_store /obj/baoshi/zishuijing5;" +
      //紫宝石完美
      "items get_store /obj/baoshi/zishuijing6;" +
      //紫宝石君王
      "items get_store /obj/baoshi/zishuijing7;" //紫宝石皇帝
    );
  },

  Quyijiy: function Quyijiy() {//取一级玉
    PLU.execActions("items get_store /obj/yushi/dixisui1;" +
      "items get_store /obj/yushi/donghaibi1;" +
      "items get_store /obj/yushi/jiutianluo1;" +
      "items get_store /obj/yushi/juzimo1;" +
      "items get_store /obj/yushi/kunlunyin1;" +
      "items get_store /obj/yushi/longtingpo1;" +
      "items get_store /obj/yushi/xuanyuanlie1;" 
    );
  },
  QuTianss: function QuTianss() {
    PLU.execActions("items get_store /obj/baoshi/lvbaoshi8;" +//绿宝石天神
      "items get_store /obj/baoshi/hongbaoshi8;" +//红宝石天神
      "items get_store /obj/baoshi/lanbaoshi8;" +//蓝宝石天神
      "items get_store /obj/baoshi/huangbaoshi8;" +//黄宝石天神
      "items get_store /obj/baoshi/zishuijing8;" //紫宝石天神
    );
  },

  buyXueLian: function buyXueLian() {
    PLU.execActions("jh 1;e;n;n;n;w;" + "#10 buy /map/snow/npc/obj/ice_lotus_N_10 from snow_herbalist;" +//购买100雪莲
      "home;");
  },
  LLBao: function LLBao() {
    PLU.execActions("jh 2;#7 n;lq_chunhui_lb;lq_fuai_lb;" +//礼包：春晖 父爱
      "jh 1;sd_2024_lb;sd_2024_ch;" +//礼包：元旦
      "home;");
  },
  eatHuoG: function eatHuoG() {
    PLU.execActions("items use obj_bingjilinghuoguo1;" //吃火锅
    );
  },

  QuLiCai: function QuLiCai() {
    PLU.execActions("items get_store /obj/shop/jiuzhuanshendan;" +
      //九转神丹
      "items get_store /obj/baoshi/huangbaoshi8;" //黄宝石天神
    );
  },

  DianLiCai: function DianLiCai() {
    PLU.execActions("event_1_62143505 go;" +
      //超级投资
      "event_1_62143505 get;event_1_63750325 get;" //领收益
    );
  },

  autoChuangLou: function autoChuangLou(endcallback) {
    UTIL.addSysListener("sword", function (b, type, subtype, msg) {
      if (msg.includes("战斗结束") || msg.includes("戰鬥結束")) {
        // PLU.execActions("prev_combat;cangjian kill");//执行prev_combat和cangjian kill命令，挑战剑楼
      }
    });
    //PLU.execActions("prev_combat"); // 执行prev_combat命令
  },

  asJirudw: function asJirudw() {
    YFUI.showInput({
      title: "队伍加入",
      text: "请输入你要加入队伍的角色ID： 比如：3070884(1)  4512928(1)",
      value: PLU.getCache("defaultValue") || "3070884(1)",
      onOk: function onOk(val) {
        PLU.setCache("defaultValue", val);
        PLU.execActions("team join u".concat(val)); // 加入队伍
      },
      onNo: function onNo() { }
    });
  },
  asJirudwdm: function asJirudwdm() {
    PLU.execActions("team join u3070884(1);prev;" // 加入队伍
    );
  },

  eatSans: function eatSans() {
    //使用三生石
    PLU.execActions("items get_store /obj/shop/sanshengshi;event_1_66830905;");
  },
  Longsjs: function Longsjs() {
    //龙神祭祀
    PLU.execActions("jh 5;#6 n;w;event_1_69751810;event_1_43899943;event_1_43899943 go 6;home;");
  },
  Yandijd: function Yandijd() {
    //炎帝祭典
    PLU.execActions("jh 5;#6 n;w;event_1_69751810;event_1_43899943;event_1_43899943 go 5;home;");
  },
  //全杀了
  allkill: function allkill(params) {
    var npcs = UTIL.getRoomAllNpc().filter(function (e) {
      return !(["金甲符兵", "玄阴符兵", "玄陰符兵"].indexOf(e.name) >= 0);
    });
    //let npcs = UTIL.getRoomAllNpc().filter(e=>!(UTIL.filterMsg(e.name).match(/(金甲|玄阴)符兵/)))
    //let npcs = UTIL.getRoomAllNpc()
    if (npcs.length) {
      PLU.autoFight({
        targetKey: npcs[0].key,
        onEnd: function onEnd() {
          setTimeout(function () {
            PLU.allkill(params);
          }, 500);
        }
      });
    } else {
      params.idx++;
      if (params.paths[params.idx] != "ka") {
        params.paths.splice(params.idx + 1, 0, "ak");
      } else {
        params.idx++;
      }
      setTimeout(function () {
        //PLU.allkill(params);
        PLU.actions(params);
      }, 400);
    }
  },
  //================================================================================================
  execActions: function execActions(str, endcallback, params) {
    var acs = str.split(";");
    acs = acs.map(function (e) {
      var np = e.match(/^#(\d+)\s(.*)/);
      if (np) {
        var r = [];
        for (var i = 0; i < np[1]; i++) r.push(np[2]);
        return r;
      }
      return e;
    }).flat();
    acs = acs.map(function (e) {
      if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
      return e;
    });
    PLU.actions({
      paths: acs,
      idx: 0,
      onPathsEnd: function onPathsEnd() {
        PLU.STATUS.isBusy = false;
        endcallback && endcallback(true, params);
      },
      onPathsFail: function onPathsFail() {
        PLU.STATUS.isBusy = false;
        endcallback && endcallback(false, params);
      }
    });
  },
  //================================================================================================
  actions: function actions(params) {
    PLU.STATUS.isBusy = true;
    //params:{paths,idx,onPathsEnd,onPathsFail}
    if (params.idx >= params.paths.length) {
      return params.onPathsEnd && params.onPathsEnd();
    }
    var curAct = params.paths[params.idx];
    // 等
    if (!curAct || curAct.startsWith("=")) {
      setTimeout(function () {
        params.idx++;
        PLU.actions(params);
      }, parseInt(curAct.substring(1)) || 250);
      return;
    }
    // 优先处理移动
    if (curAct.startsWith("go")) {
      clickButton(curAct);
      setTimeout(function () {
        params.idx++;
        PLU.actions(params);
      }, 500);
      return;
    }
    // 书面通知
    if (curAct.indexOf("log?") > -1) {
      YFUI.writeToOut("<span style='color:yellow;'>==" + curAct.substring(4) + "==</span>");
      params.idx++;
      PLU.actions(params);
      return;
    }
    //等待复活
    if (curAct.indexOf("wait#") > -1 || curAct.indexOf("wait ") > -1) {
      var _npc = curAct.substring(curAct.indexOf(" ") + curAct.indexOf("?") + 2);
      if (UTIL.getRoomAllNpc().some(function (e) {
        return e.name == _npc || e.key == _npc;
      })) {
        if (params.paths[params.idx].indexOf("wait ") > -1) params.idx++; else params.paths[params.idx] = params.paths[params.idx].substring(5);
        PLU.actions(params);
      } else UTIL.addSysListener("wait", function (b, type, subtype, msg) {
        if (UTIL.inHome()) {
          UTIL.delSysListener("wait");
          params.idx = params.paths.length;
          PLU.actions(params);
        }
        if (type != "jh") return;
        if (subtype == "info") {
          UTIL.delSysListener("wait");
          params.idx = params.paths.length;
          PLU.actions(params);
        }
        if (subtype != "new_npc") return;
        if (b.get("id") == _npc || b.get("name") == _npc) {
          UTIL.delSysListener("wait");
          if (curAct.indexOf("wait ") > -1) params.idx++; else params.paths[params.idx] = params.paths[params.idx].substring(5);
          PLU.actions(params);
        }
      });
      return;
    }
    //对话
    if (curAct.indexOf("ask#") > -1) {
      if (curAct.indexOf("?") > -1) {
        var _UTIL$findRoomNpc;
        var npc = (_UTIL$findRoomNpc = UTIL.findRoomNpc(curAct.substring(curAct.indexOf("?") + 1), 0, 1)) === null || _UTIL$findRoomNpc === void 0 ? void 0 : _UTIL$findRoomNpc.key;
      } else {
        var npc = curAct.substring(curAct.indexOf(" ") + 1);
      }
      npc && clickButton("ask " + npc);
      params.paths[params.idx] = params.paths[params.idx].substring(4);
      PLU.actions(params);
      return;
    }
    //去比试
    if (curAct.indexOf("fight?") > -1 || curAct.indexOf("fight ") > -1) {
      var kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
      PLU.autoFight({
        targetName: curAct.indexOf("fight?") > -1 ? curAct.substring(6) : null,
        targetKey: curAct.indexOf("fight ") > -1 ? curAct.substring(6) : null,
        fightKind: "fight",
        autoSkill: kt,
        onFail: function onFail() {
          setTimeout(function () {
            params.idx++;
            PLU.actions(params);
          }, 500);
        },
        onEnd: function onEnd() {
          setTimeout(function () {
            params.idx++;
            PLU.actions(params);
          }, 500);
        }
      });
      return;
    }
    //去杀
    if (curAct.indexOf("kill?") > -1 || curAct.indexOf("kill ") > -1) {
      var _kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
      PLU.autoFight({
        targetName: curAct.indexOf("kill?") > -1 ? curAct.substring(5) : null,
        targetKey: curAct.indexOf("kill ") > -1 ? curAct.substring(5) : null,
        autoSkill: _kt,
        onFail: function onFail() {
          setTimeout(function () {
            params.idx++;
            PLU.actions(params);
          }, 500);
        },
        onEnd: function onEnd() {
          setTimeout(function () {
            params.idx++;
            PLU.actions(params);
          }, 500);
        }
      });
      return;
    }
    // 去摸尸体
    if (curAct.indexOf("get?") > -1) {
      UTIL.getItemFrom(curAct.substring(4));
      setTimeout(function () {
        params.idx++;
        PLU.actions(params);
      }, 500);
      return;
    }
    // 去摸尸体
    if (curAct.indexOf("@") > -1) {
      UTIL.getItemFrom(curAct.substring(1));
      setTimeout(function () {
        params.idx++;
        PLU.actions(params);
      }, 500);
      return;
    }
    // 叫船
    if (curAct.indexOf("yell") > -1) {
      var yellBoatTimeout = setTimeout(function (e) {
        clearTimeout(yellBoatTimeout);
        UTIL.delSysListener("goYellBoat");
        params.idx++;
        PLU.actions(params);
      }, 120000);
      UTIL.addSysListener("goYellBoat", function (b, type, subtype, msg) {
        if (type == "main_msg" && msg.indexOf("还没有达到这") > -1) {
          setTimeout(function () {
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            PLU.actions(params);
          }, 2000);
          return;
        }
        if (type == "notice" && msg.indexOf("这儿没有船可以喊") > -1) {
          setTimeout(function () {
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            params.idx++;
            PLU.actions(params);
          }, 500);
          return;
        }
        if (type != "jh" || subtype != "info") return;
        var _iterator3 = _createForOfIteratorHelper(b.keys()),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var key = _step3.value;
            var val = b.get(key);
            if (val.indexOf("yell") < 0) continue;
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            params.idx++;
            PLU.actions(params);
            break;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      });
      clickButton(curAct);
      return;
    }
    if (curAct.indexOf("vs:")>-1) {
        PLU.autoFight({
          targetCommand: curAct.substring(3) || "none",
          onFail: function onFail() {
            setTimeout(function () {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd: function onEnd() {
            setTimeout(function () {
              params.idx++;
              PLU.actions(params);
            }, 500);
          }
        });
        return;
      }
    //函式
    if (curAct.indexOf("eval_") > -1) {
      eval(curAct.substring(5));
      setTimeout(function () {
        params.idx++;
        PLU.actions(params);
      }, 500);
      return;
    }
    //检查地点重走
    if (curAct.indexOf("place?") > -1) {
      var pName = curAct.split(/[?:]/)[1];
      var curName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short") || "");
      var backStep = curAct.split(/[?:]/)[2];
      // 未到达指定地，重新走
      if (pName != curName) {
        if (parseInt(backStep)) {
          //退后几步
          params.idx -= Number(backStep);
        } else if (backStep) {
          var _params$paths;
          (_params$paths = params.paths).slice.apply(_params$paths, [params.idx, 0].concat(_toConsumableArray(backStep.split(","))));
          console.debug(params);
        } else {
          params.idx = 0;
        }
        PLU.actions(params);
        return;
      }
      // 已到达指定地点，继续下一个
      params.idx++;
      PLU.actions(params);
      return;
    }
    //迷宫
    if (curAct.match(/^(.+):(.+\^.+)$/)) {
      var cmd = curAct.match(/^(.+):(.+\^.+)$/);
      PLU.execActions(PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]], function () {
        params.idx++;
        PLU.actions(params);
      });
      return;
    }
    //称号飞修正
    if (curAct.indexOf("rank go") > -1) {
      var m = curAct.match(/rank go (\d+)/);
      if (m && m[1]) {
        curAct = "rank go " + (Number(m[1]) + 1);
      }
    }
    //look,ask,
    if (curAct.match(/look|ask|get|buy|home|prev|moke|sort|share|sign|sleep|exercise|clan|work|chushi |vip |event_|lq_|wear |wield |remove |unwield/)) {
      if (curAct == "ask?lama_master") {
        UTIL.addSysListener("lama", function (b, type, subtype, msg) {
          if (type == "main_msg") if (msg.indexOf("葛伦师傅在幻境之中") == -1) clickButton("ask lama_master"); else {
            params.idx++;
            PLU.actions(params);
            UTIL.delSysListener("lama");
          }
        });
        clickButton("ask lama_master");
      } else {
        clickButton(curAct);
        setTimeout(function () {
          params.idx++;
          PLU.actions(params);
        }, 300);
      }
      return;
    }
    // 全杀了
    if (curAct.indexOf("ak") > -1) {
      PLU.allkill(params);
      return;
    }
    if (curAct == "飞雪连天射白鹿，笑书神侠倚碧鸳。") {
      if (PLU.developerMode) {
        PLU.setCache("developer", 0);
        YFUI.writeToOut("<span style='color:white;'>==已关闭开发者模式部分功能，刷新后关闭开发者模式全部功能==</span>");
        setTimeout(function () {
          return location.reload();
        }, 300);
      } else {
        YFUI.showPop({
          title: "！！！警告！！！",
          text: "你将开启本脚本开发者模式<br>" + "开发者模式功能清单：<br>" + "浏览器控制台（F12）输出按键指令、变量g_obj_map的实时变化<br>" + "闲聊允许向非脚本玩家打印屏蔽词（屏蔽词不会转为“*”，单字、特殊字符除外）<br>" + "可在非首页、非师傅所在地拜入门派，包括未开图的隐藏门派（掌握空间法则（误））<br>" + "显示全自动暴击开关（掌握时间法则（延长寿命（<br>" + "<b>专属功能可能会使你触摸到轮回法则（夏格艾迪剑），是否继续？</b>",
          okText: "继续",
          onOk: function onOk() {
            PLU.setCache("developer", 1);
            location.reload();
          },
          onNo: function onNo() {
            params.idx++;
            PLU.actions(params);
          }
        });
      }
      return;
    }
    //行动
    PLU.go({
      action: curAct,
      onEnd: function onEnd() {
        if (params.idx + 1 >= params.paths.length) {
          return params.onPathsEnd && params.onPathsEnd();
        }
        params.idx++;
        PLU.actions(params);
      },
      onFail: function onFail(flag, msg) {
        if (flag && PLU.STATUS.inBattle) {
          PLU.autoEscape({
            onEnd: function onEnd() {
              setTimeout(function () {
                PLU.actions(params);
              }, 1000);
            }
          });
          return;
        } else if (flag) {
          if (PLU.STO.REGO) {
            clearTimeout(PLU.STO.REGO);
            PLU.STO.REGO = null;
          }
          PLU.STO.REGO = setTimeout(function () {
            params.idx++;
            PLU.actions(params);
          }, 1000);
        } else {
          params.onPathsFail && params.onPathsFail(msg);
        }
      }
    });
  },
  //================================================================================================
  go: function go(_ref2) {
    var action = _ref2.action,
      onEnd = _ref2.onEnd,
      onFail = _ref2.onFail;
    if (!action) return onEnd && onEnd(false);
    var clearGoTimeout = function clearGoTimeout(timeoutKey) {
      clearTimeout(timeoutKey);
      timeoutKey = null;
      UTIL.delSysListener("goMove");
    };
    var goTimeout = setTimeout(function () {
      clearGoTimeout(goTimeout);
      onEnd && onEnd(false);
    }, 2000);
    UTIL.addSysListener("goMove", function (b, type, subtype, msg) {
      if (type == "notice" && subtype == "notify_fail") {
        if (msg.indexOf("你正忙着呢") > -1) {
          clearGoTimeout(goTimeout);
          return onFail && onFail(true);
        }
        if (msg.indexOf("无法走动") > -1 || msg.indexOf("没有这个方向") > -1 || msg.indexOf("只有VIP才可以直接去往此地") > -1 || msg.indexOf("你什么都没发觉") > -1 || msg.indexOf("就此钻入恐有辱墓主") > -1 || msg.indexOf("你虽知这松林内有乾坤，但并没发现任何线索") > -1 || msg.indexOf("此地图还未解锁，请先通关前面的地图。") > -1) {
          clearGoTimeout(goTimeout);
          return onFail && onFail(false, msg);
        }
      }
      if (type == "unknow_command" || type == "jh" && subtype == "info") {
        clearGoTimeout(goTimeout);
        setTimeout(function () {
          onEnd && onEnd(true);
        }, 200);
        return;
      }
    });
    clickButton(action);
  },
  //================================================================================================
  fastExec: function fastExec(str, endcallback) {
    var acs = str.split(";");
    acs = acs.map(function (e) {
      var np = e.match(/^#(\d+)\s(.*)/);
      if (np) {
        var r = [];
        for (var i = 0; i < np[1]; i++) r.push(np[2]);
        return r;
      }
      return e;
    }).flat();
    acs = acs.map(function (e) {
      if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
      return e;
    });
    var fastFunc = function fastFunc(acts, idx) {
      if (idx >= acts.length) {
        setTimeout(function () {
          endcallback && endcallback(true);
        }, 1000);
        return;
      }
      var curAct = acts[idx];
      if (!curAct) return fastFunc(acts, idx + 1);
      clickButton(curAct);
      setTimeout(function () {
        fastFunc(acts, idx + 1);
      }, 200);
      return;
    };
    fastFunc(acs, 0);
  },
  //================================================================================================
  selectSkills: function selectSkills(skillName) {
    if (!PLU.battleData || !PLU.battleData.skills) return null;
    var keys = Object.keys(PLU.battleData.skills);
    if (skillName) {
      for (var i = 0; i < keys.length; i++) {
        var sk = PLU.battleData.skills[keys[i]];
        if (sk && sk.name && sk.name.match(skillName)) return sk;
      }
    } else {
      var n = Math.floor(keys.length * Math.random());
      return PLU.battleData.skills[keys[n]];
    }
    return null;
  },
  //================================================================================================
  autoFight: function autoFight(params) {
    var _params$fightKind, _params$targetCommand;
    if (PLU.STO.autoF) {
      clearTimeout(PLU.STO.autoF);
      PLU.STO.autoF = null;
    }
    if (!params.targetKey && !params.targetName && !params.targetCommand) {
      params.onFail && params.onFail(0);
      YFUI.writeToOut("<span style='color:#FFF;'>--战斗参数缺失--</span>");
      return;
    }
    if (params.targetName && !params.targetKey) {
      var npcObj = UTIL.findRoomNpc(params.targetName, false, true);
      if (npcObj) {
        params.targetKey = npcObj.key;
      } else {
        params.onFail && params.onFail(1);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC--</span>");
        return;
      }
    }
    var fightAct = (_params$fightKind = params.fightKind) !== null && _params$fightKind !== void 0 ? _params$fightKind : "kill";
    var performTime = 0;
    UTIL.addSysListener("onAutoFight", function (b, type, subtype, msg) {
      if (type == "vs" && subtype == "vs_info") {
        setTimeout(function () {
          if (params.autoSkill && PLU.battleData) PLU.battleData.autoSkill = params.autoSkill;
        }, 100);
        if (PLU.TMP.loopCheckFight) {
          clearInterval(PLU.TMP.loopCheckFight);
          PLU.TMP.loopCheckFight = null;
        }
        PLU.TMP.loopCheckFight = setInterval(function () {
          if (!g_gmain.is_fighting) {
            UTIL.delSysListener("onAutoFight");
            if (PLU.STO.autoF) {
              clearTimeout(PLU.STO.autoF);
              PLU.STO.autoF = null;
            }
            if (PLU.TMP.loopCheckFight) {
              clearInterval(PLU.TMP.loopCheckFight);
              PLU.TMP.loopCheckFight = null;
            }
            params.onEnd && params.onEnd();
          }
        }, 2000);
        params.onStart && params.onStart();
      } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
        var curTime = new Date().getTime();
        if (curTime - performTime < 500) return;
        performTime = curTime;
        var useSkill = null;
        if (params.autoSkill) {
          if (!PLU.battleData || PLU.battleData.xdz < 2) return;
          if (params.autoSkill == "item") {
            if (PLU.battleData.xdz >= 6) useSkill = {
              key: "playskill 7"
            }; else useSkill = {};
          } else if (params.autoSkill == "dodge") {
            if (PLU.battleData.xdz > 9) useSkill = PLU.selectSkills(/乾坤大挪移|凌波微步|无影毒阵|九妙飞天术/);
          } else if (params.autoSkill == "multi") {
            if (PLU.battleData.xdz > 2) useSkill = PLU.selectSkills(/破军棍法|千影百伤棍|八荒功|月夜鬼萧|打狗棒法|朝天一棍/);
          } else if (params.autoSkill == "fast") {
            if (PLU.battleData.xdz >= 2) useSkill = PLU.selectSkills(/吸星大法|斗转星移|无影毒阵|空明拳|乾坤大挪移/);
          }
          if (!useSkill) {
            if (PLU.getCache("autoPerform") >= 1) {
              PLU.battleData.autoSkill = "";
              return;
            }
            if (params.autoSkill) PLU.battleData.autoSkill = "";
            useSkill = PLU.selectSkills();
          }
          if (params.onFighting) {
            var block = params.onFighting(useSkill);
            if (block) return;
          }
          useSkill && clickButton(useSkill.key, 0);
        } else {
          params.onFighting && params.onFighting();
        }
      } else if (type == "vs" && subtype == "combat_result") {
        performTime = 0;
        UTIL.delSysListener("onAutoFight");
        if (PLU.STO.autoF) {
          clearTimeout(PLU.STO.autoF);
          PLU.STO.autoF = null;
        }
        if (PLU.TMP.loopCheckFight) {
          clearInterval(PLU.TMP.loopCheckFight);
          PLU.TMP.loopCheckFight = null;
        }
        //clickButton("prev_combat");
        params.onEnd && params.onEnd();
      } else if (type == "notice" && subtype == "notify_fail") {
        var errCode = 0;
        if (msg.indexOf("没有这个人") > -1) {
          errCode = 1;
        } else if (msg.indexOf("你正忙着呢") > -1) {
          errCode = 2;
        } else if (msg.indexOf("已经超量") > -1) {
          errCode = 3;
        } else if (msg.indexOf("已达到上限") > -1 || msg.indexOf("挑战太多了") > -1) {
          errCode = 4;
        } else if (msg.indexOf("太多人了") > -1) {
          errCode = 5;
        } else if (msg.indexOf("不能战斗") > -1 || msg.indexOf("不能加入这个战场") > -1) {
          errCode = 6;
        } else if (msg.indexOf("秒后才能攻击这个人") > -1) {
          var sat = msg.match(/(\d+)秒后才能攻击这个人/);
          if (sat) errCode = "delay_" + sat[1]; else errCode = 77;
        } else if (msg.indexOf("先观察一下") > -1) {
          errCode = 88;
        } else {
          if (!PLU.STATUS.inBattle) {
            errCode = 99;
          }
        }
        if (errCode) UTIL.delSysListener("onAutoFight");
        if (PLU.STO.autoF) {
          clearTimeout(PLU.STO.autoF);
          PLU.STO.autoF = null;
        }
        if (PLU.TMP.loopCheckFight) {
          clearInterval(PLU.TMP.loopCheckFight);
          PLU.TMP.loopCheckFight = null;
        }
        params.onFail && params.onFail(errCode);
      }
    });
    PLU.STO.autoF = setTimeout(function () {
      PLU.STO.autoF = null;
      if (!g_gmain.is_fighting) {
        UTIL.delSysListener("onAutoFight");
        if (PLU.TMP.loopCheckFight) {
          clearInterval(PLU.TMP.loopCheckFight);
          PLU.TMP.loopCheckFight = null;
        }
        return params.onFail && params.onFail(100);
      }
    }, 300000);
    if (params.targetCommand != "none") {
        clickButton((_params$targetCommand = params.targetCommand) !== null && _params$targetCommand !== void 0 ? _params$targetCommand : fightAct + " " + params.targetKey, 0);
      }
    },
  //================================================================================================
  autoEscape: function autoEscape(params) {
    if (!PLU.STATUS.inBattle) return params.onEnd && params.onEnd();
    var lastEscapeTime = new Date().getTime();
    UTIL.addSysListener("onAutoEscape", function (b, type, subtype, msg) {
      if (type == "vs" && subtype == "combat_result") {
        UTIL.delSysListener("onAutoEscape");
        clickButton("prev_combat");
        return params.onEnd && params.onEnd();
      } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
        var nt = new Date().getTime();
        if (nt - lastEscapeTime > 500) {
          lastEscapeTime = nt;
          clickButton("escape");
        }
      }
    });
  },
  //================================================================================================
  setBtnRed: function setBtnRed($btn, flag, sColr) {
    if (!PLU.ONOFF[$btn[0].id + "_color"]) {
      PLU.ONOFF[$btn[0].id + "_color"] = $btn.css("background-color");
      var carr = PLU.ONOFF[$btn[0].id + "_color"].split(/[\D\s]+/);
      carr.pop();
      carr.shift();
      if (carr[0] == carr[1] && carr[1] == carr[2]) {
        carr[1] = carr[1] - 32;
        carr[2] = carr[2] - 32;
      }
      var m = carr.reduce(function (a, b) {
        return (Number(a) + Number(b)) / 2;
      });
      var narr = carr.map(function (e) {
        return Math.min(e - 96 + 4 * (e - m), 256);
      });
      PLU.ONOFF[$btn[0].id + "_colorDark"] = "rgb(" + narr.join(",") + ")";
    }
    if (flag == undefined) {
      if (PLU.ONOFF[$btn[0].id]) {
        PLU.ONOFF[$btn[0].id] = 0;
        $btn.css({
          background: PLU.ONOFF[$btn[0].id + "_color"],
          color: "#000"
        });
        return 0;
      } else {
        PLU.ONOFF[$btn[0].id] = 1;
        $btn.css({
          background: PLU.ONOFF[$btn[0].id + "_colorDark"],
          color: "#FFF"
        });
        return 1;
      }
    } else {
      PLU.ONOFF[$btn[0].id] = flag;
      var colr = sColr || PLU.ONOFF[$btn[0].id + "_color"],
        fcolr = "#000";
      if (flag) {
        colr = sColr || PLU.ONOFF[$btn[0].id + "_colorDark"];
        fcolr = "#FFF";
      }
      $btn.css({
        background: colr,
        color: fcolr
      });
      return flag;
    }
  },
  getBtnRed: function getBtnRed($btn) {
    if (PLU.ONOFF[$btn[0].id]) return 1;
    return 0;
  },
  //================================================================================================
  toAutoChuaiMo: function toAutoChuaiMo($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.STATUS.isBusy = false;
      PLU.TMP.CMSkill = null;
      return;
    }
    YFUI.showPop({
      title: "自动揣摩技能",
      text: "一键自动揣摩所有能揣摩的技能！(除了六阴追魂剑法)",
      onOk: function onOk() {
        PLU.autoChuaiMo();
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  toAutoLianXi: function toAutoLianXi($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.STATUS.isBusy = false;
      PLU.TMP.CMSkill = null;
      return;
    }
    YFUI.showPop({
      title: "自动练习技能",
      text: "开启自动练习技能！(除了六阴剑、九阴爪、九阴刀)",
      onOk: function onOk() {
        PLU.autoLianXi();
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  /*
  toAutoGetKey: function toAutoGetKey($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      return UTIL.delSysListener("listenGetKey");
    }
    clickButton("get yin yaoshi");
    UTIL.addSysListener("listenGetKey", function (b, type, subtype, msg) {
      if (g_obj_map.get("msg_room") && g_obj_map.get("msg_room").get("short").match(/匾后/)) {
        if (type == "jh") {
          if (subtype == "new_item") {
            if (b.get("id") == "yin yaoshi") clickButton("get yin yaoshi");
          } else if (subtype == "info") {
            clickButton("get yin yaoshi");
          }
        }
      }
    });
  },
  */
  toAutoGetKey: function toAutoGetKey($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
        return;
    }
    UTIL.addSysListener("listgetdaoju", function (b, type, subtype, msg) {
        if (type == "jh" && subtype == "new_item") {
            var autogetNames = PLU.getCache("getdaoju") || "钥匙,天山雪莲";
            autogetNames = autogetNames.split(",");
            var namesw = b.get("name");
            for (var i = autogetNames.length - 1; i >= 0; i--) {
                if (namesw.indexOf(autogetNames[i]) > -1) {
                    go("get " + b.get("id"));
                }
            }
        }
    });
    YFUI.showInput({
        title: "捡取物品",
        text: '格式：捡取物品名称<br>\n ',
        value: PLU.getCache("getdaoju") || "钥匙,天山雪莲",
        onOk: function onOk(val) {
            if (!$.trim(val)) return;
            var str = $.trim(val);
            PLU.setCache("getdaoju", str);
        },
        onNo: function onNo() {
            PLU.setBtnRed($btn, 0);
            UTIL.delSysListener("listgetdaoju");
        },
    });
},


  //================================================================================================
  toAutoMoke: function toAutoMoke($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.STATUS.isBusy = false;
      return;
    }
    PLU.getAllItems(function (list) {
      var daoItems = list.find(function (it) {
        return !!it.name.match("玄铁刻刀");
      });
      var daoNum = (daoItems === null || daoItems === void 0 ? void 0 : daoItems.num) || 0;
      var eqItems = list.filter(function (it) {
        return !!(it.key.match(/(equip|weapon)_\S+([8-9]|[10-12])/) && !it.key.match("_moke_") && !it.key.match("_xinwu") && !it.key.match("_barcer"));
      });
      var myNum = 0;
      eqItems && eqItems.forEach(function (eq) {
        myNum += eq.num;
      });
      console.log(eqItems);
      YFUI.showPop({
        title: "自动摹刻所有明月",
        text: "一键自动摹刻所有明月装备！<br><span style='color:#F00;font-weight:bold;'>注意准备足够的刻刀!!!</span><br>当前玄铁刻刀数量 <span style='color:#F00;'>" + daoNum + "</span><br>当前未摹刻明月装备数量 <span style='color:#F00;'>" + myNum + "</span>",
        onOk: function onOk() {
          PLU.autoMoke(eqItems);
        },
        onNo: function onNo() {
          PLU.setBtnRed($btn, 0);
        }
      });
    });
  },
  autoMoke: function autoMoke(eqList) {
    if (!PLU.ONOFF["btn_bt_autoMoke"]) return YFUI.writeToOut("<span style='color:#F0F;'> ==摹刻暂停!== </span>");
    if (eqList && eqList.length > 0) {
      var eq = eqList.pop(),
        mokeCmds = "";
      mokeCmds;
      for (var i = 0; i < eq.num; i++) {
        mokeCmds += "moke " + eq.key + ";";
      }
      PLU.execActions(mokeCmds, function () {
        return PLU.autoMoke(eqList);
      });
    } else {
      PLU.setBtnRed($("#btn_bt_autoMoke"), 0);
      YFUI.writeToOut("<span style='color:yellow;'> ==摹刻完毕!== </span>");
    }
  },
  //================================================================================================
  toAutoKillZYY: function toAutoKillZYY($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      return UTIL.delSysListener("listenLoopKillZYY");
    }
    YFUI.showPop({
      title: "自动去刷祝玉妍",
      text: "自动去刷祝玉妍！<br><span style='color:#FFF;background:#F00;font-weight:bold;'>----- 注意: -----</span><br><span style='color:#F00;font-weight:bold;'>1、准备足够的邪帝舍利!!!<br>2、不要有队伍!!!<br>3、切记要打开自动技能阵!!!<br>4、要上足够的保险卡!!!</span>",
      onOk: function onOk() {
        PLU.execActions("rank go 232;s;s;;;", function () {
          PLU.loopKillZYY();
        });
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
        UTIL.delSysListener("listenLoopKillZYY");
      }
    });
  },
  loopKillZYY: function loopKillZYY() {
    UTIL.addSysListener("listenLoopKillZYY", function (b, type, subtype, msg) {
      if (type == "vs" && subtype == "combat_result") {
        if (!PLU.ONOFF["btn_bt_autoKillZYY"]) {
          PLU.execActions(";;;n;", function () {
            YFUI.writeToOut("<span style='color:yellow;'>=====刷祝玉妍结束!!=====</span>");
            UTIL.delSysListener("listenLoopKillZYY");
          });
        } else {
          PLU.execActions(";;;n;s");
        }
      }
    });
    clickButton("s");
  },
  //================================================================================================
  toAutoFB11: function toAutoFB11($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      return UTIL.delSysListener("listenFB11");
    }
    YFUI.showPop({
      title: "自动副本11",
      text: '自动打副本11！<br>\n                    <span style=\'color:#F00;font-weight:bold;\'>----- 选择要打的门 -----</span><br>\n                    <div style="font-size:12px;line-height:2;box">\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">8 懒惰<input type="checkbox" name="chkfb11" value="nw" checked/></label>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">1非时食<input type="checkbox" name="chkfb11" value="n" checked/></label>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">2 杀生<input type="checkbox" name="chkfb11" value="ne" checked/></label>\n                    <br>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">7 奢华<input type="checkbox" name="chkfb11" value="w" checked/></label>\n                    <span style="display:inline-block;width: 31%;color:#999;text-align:center;border:1px solid transparent;">初心之地</span>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">3 偷盗<input type="checkbox" name="chkfb11" value="e" checked/></label>\n                    <br>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">6 饮酒<input type="checkbox" name="chkfb11" value="sw" checked/></label>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">5 妄语<input type="checkbox" name="chkfb11" value="s" checked/></label>\n                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">4 淫邪<input type="checkbox" name="chkfb11" value="se" checked/></label><br>\n                    </div>\n                    <span style=\'color:#F00;font-weight:bold;\'>1、在副本外开始脚本<br>2、记得要组队<br></span>',
      okText: "开始",
      onOk: function onOk() {
        var chks = $('input[name="chkfb11"]:checked');
        var selects = [];
        $.each(chks, function (i, e) {
          selects.push(e.value);
        });
        if (selects.length == 0) return false;
        console.log(selects);
        //PLU.TMP.chkTmpList=[]
        //PLU.execActions('rank go 232;s;s;;;', ()=>{
        PLU.autoToFB11(selects);
        //})
        //UTIL.findRoomNpcReg
      },

      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
        UTIL.delSysListener("listenFB11");
      }
    });
  },
  autoToFB11: function autoToFB11() { },
  killAllNpc: function killAllNpc(callback) {
    var npcObj = UTIL.findRoomNpcReg("");
    if (npcObj) {
      var needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
      PLU.autoFight({
        targetKey: npcObj.key,
        fightKind: "kill",
        autoSkill: needAutoSkill,
        onFail: function onFail() {
          setTimeout(function (t) {
            PLU.killAllNpc(callback);
          }, 1000);
        },
        onEnd: function onEnd() {
          setTimeout(function (t) {
            PLU.killAllNpc(callback);
          }, 500);
        }
      });
    } else {
      callback && callback();
    }
  },
  killyoumhy: function killyoumhy(endCallback) {
    var flag = false;
    PLU.execActions("jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;", function (f) {
      if (!f) return endCallback && endCallback(1);
      PLU.execActions("se;ak;=300;;se;=300;;s;=300;;w;=300;;e;=300;e;=300;;w=300;;s=300;;;s=300;;;s=300;;;w;=300;;e;=300;e;=300;;s=300;;;n;=300;e;;=300;e;;=300;n;=300;;s=300;;e=300;;;e=300;;;n;=300;attrs;;attrs;;attrs;;attrs;;attrs;;attrs;;ka;;", function (f2) {
        if (!f2) return endCallback && endCallback(2);
        PLU.execActions("=300;home;");
      });
    });
  },
  killFB11: function killFB11(endCallback) {
    var flag = false;
    PLU.execActions("fb 11;", function (f) {
      if (!f) return endCallback && endCallback(1);
      setTimeout(function () {
        PLU.execActions("nw;kill bajieshendian_zhushajun;se;n;kill bajieshendian_shishenyiya;s;ne;kill bajieshendian_shashenyanmin;sw;e;kill bajieshendian_daoshenwentao;w;se;kill bajieshendian_xieshenyecha;nw;s;kill bajieshendian_shangbaozheng;n;sw;kill bajieshendian_libai;ne;w;kill bajieshendian_yangguang;w;kill bajieshendian_yingzheng;e;e;nw;nw;kill bajieshendian_chengzhuanlaozhu;se;se;n;n;kill bajieshendian_penzhu;s;s;ne;ne;kill bajieshendian_shashenbaiqi;sw;sw;e;e;kill bajieshendian_daoshenwudaojianjun;w;w;se;se;kill bajieshendian_xieshenxintian;nw;nw;s;s;kill bajieshendian_maxinkong;n;n;sw;sw;kill bajieshendian_jiushenyidi;kill bajieshendian_luanzhixinmo;", function (f2) {      
        if (!f2) return endCallback && endCallback(2);
        setTimeout(function () {
          PLU.execActions("=2400;event_1_68529291;");
        }, 2000);
      });
      }, 2000);
    });
  },
  killFB10: function killFB10(endCallback) {
    var flag = false;
    PLU.execActions("fb 10;", function (f) {
      if (!f) return endCallback && endCallback(1);
      PLU.execActions("event_1_31980331;ak;;fb 10;event_1_23348240;;;fb 10;event_1_84015482;;;fb 10;event_1_25800358;;;event_1_24864938;;;fb 10;event_1_31980331;event_1_98378977;;;event_1_5376728;;event_1_43541317;;ka;event_1_5914414;", function (f2) {
        if (!f2) return endCallback && endCallback(2);
        PLU.execActions("home;");
      });
    });
  },
  //================================================================================================
  checkYouxia: function checkYouxia($btn) {
    YFUI.showPop({
      title: "检查入室游侠技能",
      text: '选择需要的对应技能:<br>\n                <div style="font-size:15px;">\n                    <label style="display:inline-block;">内功:<input type="checkbox" name="chkskiyx" value="内功" checked/></label>&nbsp;\n                    <label style="display:inline-block;">轻功:<input type="checkbox" name="chkskiyx" value="轻功" checked/></label>&nbsp;\n                    <label style="display:inline-block;">剑法:<input type="checkbox" name="chkskiyx" value="剑法" checked/></label>&nbsp;\n                    <label style="display:inline-block;">掌法:<input type="checkbox" name="chkskiyx" value="掌法" checked/></label>&nbsp;\n                    <label style="display:inline-block;">刀法:<input type="checkbox" name="chkskiyx" value="刀法" checked/></label>&nbsp;\n                    <label style="display:inline-block;">暗器:<input type="checkbox" name="chkskiyx" value="暗器"/></label>&nbsp;\n                    <label style="display:inline-block;">鞭法:<input type="checkbox" name="chkskiyx" value="鞭法"/></label>&nbsp;\n                    <label style="display:inline-block;">枪法:<input type="checkbox" name="chkskiyx" value="枪法"/></label>&nbsp;\n                    <label style="display:inline-block;">锤法:<input type="checkbox" name="chkskiyx" value="锤法"/></label>&nbsp;\n                    <label style="display:inline-block;">斧法:<input type="checkbox" name="chkskiyx" value="斧法"/></label>\n                </div>',
      onOk: function onOk() {
        var chks = $('input[name="chkskiyx"]:checked');
        var selects = [];
        PLU.TMP.chkTmpList = [];
        $.each(chks, function (i, e) {
          selects.push(e.value);
        });
        PLU.getSkillsList(function (allSkills, tupoSkills) {
          PLU.getYouxiaList(function (yxs) {
            PLU.checkMySkills(allSkills, yxs, selects);
          });
        });
      },
      onNo: function onNo() { }
    });
  },
  checkMySkills: function checkMySkills(mySkills, myYouxia, checkList) {
    // console.log(mySkills, myYouxia, checkList)
    var clstr = "";
    checkList.forEach(function (c) {
      return clstr += "【" + c[0] + "】";
    });
    YFUI.writeToOut("<span style='color:#FFF;'>--技能检测 <span style='color:yellow;'>" + clstr + "</span>--</span>");
    checkList.forEach(function (cn) {
      var carr = PLU.YFD.youxiaSkillMap.filter(function (r) {
        return r.type == cn;
      });
      carr.forEach(function (n) {
        PLU.checkPreSKill(n, mySkills, myYouxia);
      });
    });
    if (PLU.TMP.chkTmpList.length == 0) {
      YFUI.writeToOut("<span style='color:yellow;'>检查的技能都准备好了!</span>");
    }
  },
  checkPreSKill: function checkPreSKill(node, mySkills, myYouxia) {
    var ms = mySkills.find(function (s) {
      return s.name == node.skill;
    });
    if (!ms && !PLU.TMP.chkTmpList.includes(node.skill)) {
      PLU.TMP.chkTmpList.push(node.skill);
      var clr = node.kind == "宗师" || node.kind == "侠客" ? "#E93" : "#36E";
      var htm = '<span style="color:' + clr + ';">【' + node.type[0] + "】" + node.skill + " ";
      //htm+= ms?'<span style="color:#3F3;display:inline-block;">('+ms.level+')</span>':'(缺)';
      htm += '<span style="color:#F00;display:inline-block;">(未学)</span>';
      var myx = myYouxia.find(function (y) {
        return y.name.match(node.name);
      });
      htm += " - " + (myx ? '<span style="color:#3F3;display:inline-block;">' + myx.name + "[" + myx.level + "]</span>" : '<span style="color:#F36;display:inline-block;">需要：<span style="color:#FFF;background:' + clr + ';"> ' + node.kind + "-" + node.name + " </span></span>");
      htm += "</span>";
      YFUI.writeToOut(htm);
    }
    if (node.pre) {
      node.pre.forEach(function (n) {
        PLU.checkPreSKill(n, mySkills, myYouxia);
      });
    }
  },
  getYouxiaList: function getYouxiaList(callback) {
    UTIL.addSysListener("getYouxiaList", function (b, type, subtype, msg) {
      if (type != "fudi" && subtype != "juxian") return;
      UTIL.delSysListener("getYouxiaList");
      clickButton("prev");
      var youxias = [];
      for (var i = 0; i < 41; i++) {
        var str = b.get("yx" + i);
        if (str) {
          var attr = str.split(",");
          var ns = UTIL.filterMsg(attr[1]).split("】");
          var nam = ns.length > 1 ? ns[1] : ns[0];
          youxias.push({
            key: attr[0],
            name: nam,
            level: Number(attr[4]),
            kind: attr[3]
          });
        }
      }
      callback(youxias);
    });
    clickButton("fudi juxian");
  },
  //================================================================================================
  toAutoLearn: function toAutoLearn($btn) {
    if (!PLU.TMP.MASTER_SKILLS) {
      return YFUI.showPop({
        title: "缺少数据",
        text: "需要打开师傅技能界面"
        // onOk(){
        // },
      });
    }
    // console.log(PLU.TMP.MASTER_ID, PLU.TMP.MASTER_SKILLS)
    var needSkills = [];
    PLU.getSkillsList(function (allSkills, tupoSkills) {
      PLU.TMP.MASTER_SKILLS.forEach(function (ms) {
        var sk = allSkills.find(function (s) {
          return s.key == ms.key;
        }) || {
          level: 0
        };
        if (sk.level < ms.level) {
          needSkills.push({
            key: ms.key,
            name: ms.name,
            lvl: ms.level - sk.level,
            cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10"
          });
        }
      });
      //console.log(needSkills.map(e=>e.name))
      loopLearn(needSkills);
    });
    var curSkill = null;
    UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
      if (type == "notice" && msg.indexOf("不愿意教你") >= 0) {
        //UTIL.delSysListener("loopLearnSkill");
        if (curSkill) curSkill.lvl = -1;
      }
      return;
    });
    var loopLearn = function loopLearn(list) {
      if (list.length > 0) {
        if (list[0].lvl > 0) {
          list[0].lvl -= 10;
          curSkill = list[0];
          clickButton(list[0].cmd);
        } else {
          list.shift();
        }
        setTimeout(function () {
          loopLearn(list);
        }, 200);
      } else {
        UTIL.delSysListener("loopLearnSkill");
        YFUI.writeToOut("<span style='color:#FFF;'>----自动学习结束,记得检查噢!----</span>");
      }
    };
  },
  //================================================================================================
  autoChuaiMo: function autoChuaiMo() {
    if (!PLU.ONOFF["btn_bt_autoChuaiMo"]) return;
    PLU.STATUS.isBusy = true;
    if (!PLU.TMP.CMSkill) {
      PLU.getSkillsList(function (allSkills, tupoSkills) {
        if (!PLU.TMP.CANTCMS) PLU.TMP.CANTCMS = [];
        PLU.TMP.CMSkill = allSkills.find(function (e) {
          return e.level >= 500 && e.level < 600 && e.name != "六阴追魂剑法" && (e.kind == "attack" || e.kind == "recovery" || e.kind == "force") && !PLU.TMP.CANTCMS.includes(e.name);
        });
        if (!PLU.TMP.CMSkill) {
          PLU.STATUS.isBusy = false;
          PLU.TMP.CMSkill = null;
          PLU.setBtnRed($("#btn_bt_autoChuaiMo"), 0);
        } else {
          clickButton("enable " + PLU.TMP.CMSkill.key);
          UTIL.addSysListener("listenChuaiMo", function (b, type, subtype, msg) {
            if (type == "notice" && (msg.indexOf("揣摩最高等级为") >= 0 || msg.indexOf("这项技能不能揣摩") >= 0)) {
              UTIL.delSysListener("listenChuaiMo");
              if (msg.indexOf("这项技能不能揣摩") >= 0) {
                PLU.TMP.CANTCMS.push(PLU.TMP.CMSkill.name);
              }
              YFUI.writeToOut("<span style='color:#FFF;'>--揣摩结束--</span>");
              PLU.TMP.CMSkill = null;
            }
            return;
          });
        }
        PLU.autoChuaiMo();
      });
    } else {
      clickButton("chuaimo go," + PLU.TMP.CMSkill.key, 0);
      setTimeout(function (e) {
        PLU.autoChuaiMo();
      }, 250);
    }
  },
  //================================================================================================
  autoLianXi: function (_autoLianXi) {
    function autoLianXi() {
      return _autoLianXi.apply(this, arguments);
    }
    autoLianXi.toString = function () {
      return _autoLianXi.toString();
    };
    return autoLianXi;
  }(function () {
    PLU.STATUS.isBusy = true; // 设置状态为忙碌
    PLU.getSkillsList(function (allSkills, tupoSkills) {
      // 获取技能列表
      PLU.TMP.CANTLXS = PLU.TMP.CANTLXS || []; // 初始化无法练习的技能列表
      PLU.TMP.LXISkill = allSkills.find(function (skill) {
        return skill.level >= 200 && skill.level < 500 && !PLU.TMP.CANTLXS.includes(skill.name) && !["基本钩法", "基本戟法", "六阴追魂剑法", "天魔焚身", "纵意登仙步", "九阴噬骨刀"].includes(skill.name) && ["attack", "recovery"].includes(skill.kind);
      });
      if (!PLU.TMP.LXISkill) {
        // 如果没有找到合适的技能
        PLU.STATUS.isBusy = false;
        return;
      }
      clickButton("enable " + PLU.TMP.LXISkill.key); // 启用找到的技能
      UTIL.addSysListener("listenLianXi", function (b, type, subtype, msg) {
        if (type === "notice") {
          if (msg.includes("练习已经不能提高了") || msg.includes("这项技能不能练习")) {
            // 处理练习结束的情况
            UTIL.delSysListener("listenLianXi");
            if (msg.includes("这项技能不能练习")) {
              PLU.TMP.CANTLXS.push(PLU.TMP.LXISkill.name);
            }
            clearTimeout(PLU.TMP.timer);
            PLU.STATUS.isBusy = false;
            PLU.TMP.LXISkill = null;
          } else if (msg.includes("你开始练习")) {
            // 如果正在练习其他技能
            UTIL.delSysListener("listenLianXi");
            YFUI.writeToOut("<span style='color:#FFF;'>--开始练习--</span>");
            clearTimeout(PLU.TMP.timer);
            PLU.STATUS.isBusy = false;
            PLU.TMP.LXISkill = null;
          }
        }
      });
      clickButton("practice " + PLU.TMP.LXISkill.key, 100); // 开始练习技能
      PLU.TMP.timer = setTimeout(autoLianXi, 250); // 设置定时器，250毫秒后继续练习
    });
  }),

  //================================================================================================
  toAutoTeach: function toAutoTeach($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.STATUS.isBusy = false;
      PLU.TMP.TeachSkill = null;
      return;
    }
    YFUI.showPop({
      title: "自动传授游侠技能",
      text: "一键自动传授游侠技能！<b style='color:#F00;'>需要点开游侠技能界面,需要传授的技能不能为0级</b>",
      onOk: function onOk() {
        PLU.autoTeach();
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  autoTeach: function autoTeach() {
    if (!PLU.ONOFF["btn_bt_autoTeach"]) return;
    PLU.STATUS.isBusy = true;
    if (PLU.TMP.CUR_YX_SKILLS) {
      var ac = PLU.TMP.CUR_YX_SKILLS.find(function (e) {
        return Number(e.lvl) > 0 && Number(e.lvl) < Number(e.max);
      });
      if (ac) {
        clickButton(ac.cmd, 0);
        setTimeout(function (e) {
          PLU.autoTeach();
        }, 200);
      } else {
        YFUI.writeToOut("<span style='color:#FFF;'>--传授结束--</span>");
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
      }
    } else {
      PLU.STATUS.isBusy = false;
      PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
    }
  },
  //================================================================================================
  toAutoUpgrade: function toAutoUpgrade($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.STATUS.isBusy = false;
      PLU.TMP.TeachSkill = null;
      return;
    }
    YFUI.showPop({
      title: "自动升级游侠等级",
      text: "一键升级游侠等级！<b style='color:#F00;'>需要点开游侠技能界面</b>",
      onOk: function onOk() {
        PLU.autoUpgrade();
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  // 今天提升鸠摩智等级的次数已达到上限了。
  //不能提升阿朱的等级。
  //游侠等级超过上限了。
  //================================================================================================
  autoUpgrade: function autoUpgrade() {
    if (!PLU.ONOFF["btn_bt_autoUpgrade"]) return;
    PLU.STATUS.isBusy = true;
    if (PLU.TMP.CUR_YX_LEVEL && PLU.TMP.CUR_YX_SKILLS && PLU.TMP.CUR_YX_ENG) {
      if (PLU.TMP.CUR_YX_SKILLS.length > 4 && PLU.TMP.CUR_YX_LEVEL < 2000) {
        var canUpgrade = true;
        UTIL.addSysListener("listenAutoUpgrade", function (b, type, subtype, msg) {
          if (type == "notice" && (msg.indexOf("等级的次数已达到上限了") >= 0 || msg.indexOf("不能提升") >= 0 || msg.indexOf("等级超过上限了") >= 0)) {
            UTIL.delSysListener("listenAutoUpgrade");
            canUpgrade = false;
            PLU.STATUS.isBusy = false;
            YFUI.writeToOut("<span style='color:#FFF;'>--升级结束--</span>");
            PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
          }
          return;
        });
        clickButton("fudi juxian upgrade go " + PLU.TMP.CUR_YX_ENG + " 100");
        setTimeout(function (e) {
          if (canUpgrade) PLU.autoUpgrade();
        }, 500);
      } else {
        YFUI.writeToOut("<span style='color:#FFF;'>--升级结束--</span>");
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
      }
    } else {
      PLU.STATUS.isBusy = false;
      PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
    }
  },
  //================================================================================================
  toLoopKillByN: function toLoopKillByN($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_loopKillByN").text("计数击杀");
      return;
    }
    clickButton("golook_room");
    YFUI.showInput({
      title: "计数击杀",
      text: "输入数量，确定后单击怪!!(数量后带小数点为比试)",
      value: PLU.getCache("lookKillNum") || 20,
      onOk: function onOk(val) {
        if (!Number(val)) return;
        setTimeout(function (o) {
          $(document).one("click", function (o) {
            var snpc = $(o.target).closest("button")[0].outerHTML.match(/clickButton\('look_npc (\w+)'/i);
            if (snpc && snpc.length >= 2) {
              var kf = String(val).indexOf(".") > 0 ? "fight" : "kill";
              PLU.setCache("lookKillNum", Number(val));
              PLU.loopKillByN(snpc[1], parseInt(val), kf);
            } else {
              PLU.setBtnRed($btn, 0);
            }
          });
        }, 500);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopKillByN: function loopKillByN(npcId, killN, killorfight) {
    if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillByN"]) return;
    $("#btn_bt_loopKillByN").text("停(" + killN + ")");
    PLU.autoFight({
      targetKey: npcId,
      fightKind: killorfight,
      autoSkill: "fast",
      onFail: function onFail() {
        setTimeout(function (t) {
          PLU.loopKillByN(npcId, killN, killorfight);
        }, 500);
      },
      onEnd: function onEnd() {
        if (killN <= 1) {
          PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
          $("#btn_bt_loopKillByN").text("计数击杀");
          clickButton("home", 1);
          return;
        } else {
          setTimeout(function (t) {
            PLU.loopKillByN(npcId, killN - 1, killorfight);
          }, 500);
        }
      }
    });
  },
  //================================================================================================
  toLoopKillName: function toLoopKillName($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_loopKillName").text("名字连杀");
      return;
    }
    YFUI.showInput({
      title: "名字连杀",
      text: '格式：次数|人物词组<br>\n                        次数：省略则默认1次<br>\n                        人物词组：以英文逗号分割多个关键词<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">99|铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长</span><br>\n                        [例2] <span style="color:blue;">醉汉,收破烂的</span>;\n                        ',
      value: PLU.getCache("lookKillNames") || "299|铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          times = 1,
          names = "",
          arr = str.split("|");
        if (arr.length > 1) {
          times = Number(arr[0]) || 1;
          names = arr[1];
        } else {
          names = arr[0];
        }
        PLU.setCache("lookKillNames", str);
        PLU.loopKillName(names, Number(times));
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopKillName: function loopKillName(names, killN) {
    if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillName"]) return;
    $("#btn_bt_loopKillName").text("停击杀(" + killN + ")");
    var npcObj = null,
      namesArr = names.split(",");
    for (var i = 0; i < namesArr.length; i++) {
      npcObj = UTIL.findRoomNpc(namesArr[i], false, true);
      if (npcObj) break;
    }
    if (npcObj) {
      var needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
      PLU.autoFight({
        targetKey: npcObj.key,
        fightKind: "kill",
        autoSkill: needAutoSkill,
        onFail: function onFail() {
          setTimeout(function (t) {
            PLU.loopKillName(names, killN);
          }, 1000);
        },
        onEnd: function onEnd() {
          if (killN <= 1) {
            PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
            $("#btn_bt_loopKillName").text("名字连杀");
            return;
          } else {
            setTimeout(function (t) {
              PLU.loopKillName(names, killN - 1);
            }, 1000);
          }
        }
      });
    } else {
      setTimeout(function (t) {
        PLU.loopKillName(names, killN);
      }, 2000);
    }
  },
  //================================================================================================
  toLoopKill: function toLoopKill($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      // $("#btn_bt_kg_loopKill").text('循环杀')
      return;
    }
    YFUI.showInput({
      title: "循环杀",
      text: '格式：名字词组<br>\n                        名字词组：以英文逗号分割多个关键词, <b style="color:red;">可模糊匹配!</b><br>\n                        <span style="color:red;">不需要战斗时建议关闭以节省性能!!</span><br>\n                        [例1] <span style="color:blue;">铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长,蛮荒铁,蛮荒银,蛮荒金,寨近卫,蛮荒近卫</span><br>\n                        ',
      type: "textarea",
      value: PLU.getCache("lookKillKeys") || "怯薛军,蒙古突骑,草原枪骑,重装铁骑,狼军,狼将,夫长,蛮荒,近卫",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          names = str.split(/[,，#]/);
        PLU.setCache("lookKillKeys", str);
        PLU.loopKills(str);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopKills: function loopKills(names) {
    if (!PLU.ONOFF["btn_bt_kg_loopKill"]) return;
    // $("#btn_bt_kg_loopKill").text('停循环');
    var npcObj = null,
      namesArr = names.split(/[,，#]/);
    for (var i = 0; i < namesArr.length; i++) {
      npcObj = UTIL.findRoomNpcReg(namesArr[i]);
      if (npcObj) break;
    }
    if (npcObj) {
      var needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
      PLU.autoFight({
        targetKey: npcObj.key,
        fightKind: "kill",
        autoSkill: needAutoSkill,
        onFail: function onFail() {
          setTimeout(function (t) {
            PLU.loopKills(names);
          }, 1000);
        },
        onEnd: function onEnd() {
          setTimeout(function (t) {
            PLU.loopKills(names);
          }, 500);
        }
      });
    } else {
      setTimeout(function (t) {
        PLU.loopKills(names);
      }, 1000);
    }
  },
  //================================================================================================
  toLoopReadBase: function toLoopReadBase($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      // $("#btn_bt_loopReadBase").text('读技能书')
      return;
    }
    YFUI.showInput({
      title: "读书还神",
      text: '格式：比试NPC名称|基础秘籍名称<br>\n                        比试NPC名称：要比试进行回神的NPC名字<br>\n                        基础秘籍名称：基础秘籍名称关键词<br>\n                        <span style="color:red;">战斗必刷道具栏必须用还神丹</span><br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">地痞|基本剑法秘籍</span>\n                        ',
      value: PLU.getCache("loopReadBase") || "地痞|基本剑法秘籍",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          npcName = "",
          bookName = "",
          arr = str.split("|");
        if (arr.length > 1) {
          npcName = arr[0];
          bookName = arr[1];
          PLU.setCache("loopReadBase", str);
          PLU.getAllItems(function (list) {
            var bookItem = list.find(function (it) {
              return !!it.name.match(bookName);
            });
            var reN = Math.floor(g_obj_map.get("msg_attrs").get("max_shen_value") / 55) || 1;
            console.log(npcName, bookItem.key, reN);
            if (bookItem) {
              PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 0);
              PLU.loopReadBase(npcName, bookItem.key, reN);
            }
          });
        } else {
          PLU.setBtnRed($btn, 0);
          return;
        }
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  loopReadBase: function loopReadBase(npcName, bookKey, reN) {
    //你使用了一本
    //你的神值不足：10以上。
    //你目前不能使用
    //使用技能等级为
    if (!PLU.ONOFF["btn_bt_loopReadBase"]) {
      UTIL.delSysListener("listenLoopReadBase");
      YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书停止--</span>");
      PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
      return;
    }
    UTIL.addSysListener("listenLoopReadBase", function (b, type, subtype, msg) {
      if (type == "main_msg" && msg.indexOf("你使用了一本") >= 0) {
        UTIL.delSysListener("listenLoopReadBase");
        setTimeout(function () {
          PLU.loopReadBase(npcName, bookKey, reN);
        }, 500);
      } else if (type == "notice" && msg.indexOf("你的神值不足") >= 0) {
        UTIL.delSysListener("listenLoopReadBase");
        setTimeout(function () {
          var refreshNumber = 0;
          PLU.autoFight({
            targetName: npcName,
            fightKind: "fight",
            autoSkill: "item",
            onStart: function onStart() {
              console.log("start fight==");
            },
            onFighting: function onFighting(ps) {
              if (refreshNumber >= reN) return true;
              if (ps && ps.key == "playskill 7") {
                refreshNumber++;
                console.log(ps.key, refreshNumber, reN);
                if (refreshNumber >= reN) {
                  PLU.autoEscape({});
                }
              }
            },
            onFail: function onFail(err) {
              console.log(err);
              setTimeout(function () {
                PLU.loopReadBase(npcName, bookKey, reN);
              }, 1000);
            },
            onEnd: function onEnd(e) {
              setTimeout(function () {
                PLU.loopReadBase(npcName, bookKey, reN);
              }, 1000);
            }
          });
        }, 500);
      } else if (type == "notice" && msg.indexOf("使用技能等级为") >= 0) {
        UTIL.delSysListener("listenLoopReadBase");
        YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书结束--</span>");
        PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
      } else if (type == "notice" && msg.indexOf("你的背包里没有这个物品") >= 0) {
        YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书停止--</span>");
        PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
      }
      return;
    });
    var cmds = "items use " + bookKey;
    PLU.execActions(cmds);
  },
  //================================================================================================
  toSearchFamilyQS: function toSearchFamilyQS($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    YFUI.showInput({
      title: "搜索师门任务",
      text: '格式：任务包含的关键字,多个以英文逗号分隔<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">硫磺,黝黑山洞</span>\n            [例2] <span style="color:blue;">茅山,</span>\n                        ',
      value: PLU.getCache("searchFamilyQS") || "硫磺,黝黑山洞",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          arr = str.split(",");
        if (arr.length > 1) {
          var _g_obj_map;
          PLU.setCache("searchFamilyQS", str);
          clickButton("family_quest", 0);
          PLU.TMP.master = (_g_obj_map = g_obj_map) === null || _g_obj_map === void 0 || (_g_obj_map = _g_obj_map.get("msg_attrs")) === null || _g_obj_map === void 0 ? void 0 : _g_obj_map.get("master_name");
          PLU.loopSearchFamilyQS(arr);
        } else {
          PLU.setBtnRed($btn, 0);
          return;
        }
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  loopSearchFamilyQS: function loopSearchFamilyQS(keys, cmd) {
    if (!PLU.ONOFF["btn_bt_searchFamilyQS"]) {
      UTIL.delSysListener("listenLoopSearchFamilyQS");
      YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
      PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
      return;
    }
    UTIL.addSysListener("listenLoopSearchFamilyQS", function (b, type, subtype, msg) {
      if (type == "main_msg") {
        if (msg.indexOf("".concat(PLU.TMP.master, "一拂袖")) >= 0 || msg.indexOf("你现在没有师门任务。") >= 0) {
          UTIL.delSysListener("listenLoopSearchFamilyQS");
          setTimeout(function () {
            PLU.loopSearchFamilyQS(keys);
          }, 250);
        } else if (msg.indexOf("你现在的任务是") >= 0 || msg.indexOf(PLU.TMP.master) >= 0) {
          UTIL.delSysListener("listenLoopSearchFamilyQS");
          var qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
          for (var i = 0; i < keys.length; i++) {
            var key = $.trim(keys[i]);
            if (key && qsStr.indexOf(key) >= 0) {
              YFUI.writeToOut("<span style='color:#FF0;'>========= 结束搜索 =========</span>");
              delete PLU.TMP.master;
              PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
              break;
            } else {
              setTimeout(function () {
                PLU.loopSearchFamilyQS(keys, "family_quest cancel go");
              }, 250);
            }
          }
        }
      }
    });
    if (cmd) clickButton(cmd); else clickButton("family_quest", 0);
  },
  //================================================================================================
  toSearchBangQS: function toSearchBangQS($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    YFUI.showInput({
      title: "搜索帮派任务",
      text: '格式：任务包含的关键字,多个以英文逗号分隔<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">硫磺,黝黑山洞</span>\n                        ',
      value: PLU.getCache("searchBangQS") || "硫磺,黝黑山洞",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          arr = str.split(",");
        if (arr.length > 1) {
          PLU.setCache("searchBangQS", str);
          clickButton("clan scene", 0);
          PLU.loopSearchBangQS(arr);
        } else {
          PLU.setBtnRed($btn, 0);
          return;
        }
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  loopSearchBangQS: function loopSearchBangQS(keys, cmd) {
    if (!PLU.ONOFF["btn_bt_searchBangQS"]) {
      UTIL.delSysListener("listenLoopSearchBangQS");
      YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
      PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
      return;
    }
    UTIL.addSysListener("listenLoopSearchBangQS", function (b, type, subtype, msg) {
      if (type == "main_msg") {
        if (msg.indexOf("帮派使者一拂袖") >= 0 || msg.indexOf("帮派使者：现在没有任务") >= 0) {
          UTIL.delSysListener("listenLoopSearchBangQS");
          setTimeout(function () {
            PLU.loopSearchBangQS(keys);
          }, 250);
        } else if (msg.indexOf("你现在的任务是") >= 0 || msg.indexOf("帮派使者：") >= 0) {
          UTIL.delSysListener("listenLoopSearchBangQS");
          var qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
          for (var i = 0; i < keys.length; i++) {
            var key = $.trim(keys[i]);
            if (key && qsStr.indexOf(key) >= 0) {
              YFUI.writeToOut("<span style='color:#FF0;'>========= 结束搜索 =========</span>");
              PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
              break;
            } else {
              setTimeout(function () {
                PLU.loopSearchBangQS(keys, "clan cancel_task go");
              }, 250);
            }
          }
        }
      }
    });
    if (cmd) clickButton(cmd); else clickButton("clan task", 0);
  },
  //================================================================================================
  toLoopClick: function toLoopClick($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_loopClick").text("自动点击");
      return;
    }
    YFUI.showInput({
      title: "自动点击",
      text: "输入自动点击的次数，确定后点击要点按钮",
      value: PLU.getCache("autoClickNum") || 20,
      onOk: function onOk(val) {
        if (!Number(val)) return;
        setTimeout(function (o) {
          $(document).one("click", function (o) {
            var snpc = $(o.target).closest("button")[0].outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
            if (snpc && snpc.length >= 2) {
              var _snpc$;
              var param = (_snpc$ = snpc[3]) !== null && _snpc$ !== void 0 ? _snpc$ : 0;
              PLU.setCache("autoClickNum", Number(val));
              PLU.loopClick(snpc[1], param, Number(val));
            } else {
              PLU.setBtnRed($btn, 0);
            }
          });
        }, 500);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopClick: function loopClick(btnCmd, param, clickNum) {
    if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopClick"]) {
      PLU.setBtnRed($("#btn_bt_loopClick"), 0);
      $("#btn_bt_loopClick").text("连续点击");
      return;
    }
    $("#btn_bt_loopClick").text("停点击(" + clickNum + ")");
    clickButton(btnCmd, param);
    clickNum--;
    setTimeout(function () {
      PLU.loopClick(btnCmd, param, clickNum);
    }, 250);
  },
  //================================================================================================
  loopSlowClick: function loopSlowClick(btnCmd, param, clickNum, delay) {
    if (!delay) delay = 1000;
    if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopSlowClick"]) {
      PLU.setBtnRed($("#btn_bt_loopSlowClick"), 0);
      $("#btn_bt_loopSlowClick").text("慢速点击");
      return;
    }
    $("#btn_bt_loopSlowClick").text("停(" + clickNum + ")");
    clickButton(btnCmd, param);
    clickNum--;
    setTimeout(function () {
      PLU.loopSlowClick(btnCmd, param, clickNum, delay);
    }, delay);
  },
  //================================================================================================
  toLoopSlowClick: function toLoopSlowClick($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_loopSlowClick").text("自动点击");
      return;
    }
    YFUI.showPop({
      title: "自动点击",
      text: '输入自动点击的次数，输入点击速度，确定后点击游戏中要点的按钮<br>\n                        <div style=\'margin:10px 0;\'>\n                            <span>速度(几秒一次): </span>\n                            <input id="slowClickSec" value="0.5" style="font-size:16px;height:30px;width:15%;"></input>\n                            <span>次数: </span>\n                            <input id="slowClickTimes" value="'.concat(PLU.getCache("autoClickNum") || 20, '" style="font-size:16px;height:26px;width:40%;"></input>\n                        </div>'),
      onOk: function onOk() {
        var times = Number($("#slowClickTimes").val()),
          delay = Number($("#slowClickSec").val());
        if (Number(times) <= 0 || Number(delay) <= 0) return;
        setTimeout(function (o) {
          $(document).one("click", function (o) {
            var snpc = $(o.target).closest("button")[0].outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
            if (snpc && snpc.length >= 2) {
              var _snpc$2;
              var param = (_snpc$2 = snpc[3]) !== null && _snpc$2 !== void 0 ? _snpc$2 : 0;
              PLU.setCache("autoClickNum", times);
              PLU.loopSlowClick(snpc[1], param, times, delay * 1000);
            } else {
              PLU.setBtnRed($btn, 0);
            }
          });
        }, 500);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  toRecord: function toRecord($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (btnFlag) {
      PLU.TMP.cmds = [];
      $("#btn_record").text("停止录制");
      return;
    }
    var cmds = PLU.TMP.cmds;
    delete PLU.TMP.cmds;
    // 指令壓縮算法
    var count = 1;
    for (var index = 0; index < cmds.length; index++) {
      if (cmds[index] == cmds[index + 1]) {
        count++;
        continue;
      }
      if (count >= 2 + cmds[index].length == 1) {
        index -= count - 1;
        cmds.splice(index, count, "#" + count + " " + cmds[index]);
      }
      count = 1;
    }
    cmds = cmds.map(function (e) {
      var res = e.match(/#\d+ ((jh|fb) \d+)/);
      return res ? res[1] : e;
    }).join(";");
    YFUI.showPop({
      title: "指令详情",
      text: cmds,
      okText: "复制",
      onOk: function onOk() {
        if (GM_setClipboard) GM_setClipboard(cmds); else YFUI.writeToOut("<span>权限不足！</span>");
        $("#btn_record").text("指令录制");
      }
    });
  },
  //================================================================================================
  autoMasterGem: function autoMasterGem($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_autoMasterGem").text("一键合天神");
      return;
    }
    var arr = ["碎裂的", "裂开的", "无前缀", "无暇的", "完美的", "君王的", "皇帝的"];
    var sel1 = '<select id="startGemLvl" style="font-size:16px;height:30px;width:25%;">';
    arr.forEach(function (p, pi) {
      sel1 += '<option value="' + pi + '" ' + (pi == 0 ? "selected" : "") + ">" + p + "</option>";
    });
    sel1 += "</select>";
    YFUI.showPop({
      title: "一键合天神",
      text: "选择合成起始宝石等级，选择速度(请根据网速和游戏速度选择)，确定后自动向上合成所有<br>\n                        <div style='margin:10px 0;'>\n                            <span>起始等级: </span>".concat(sel1, '\n                            <span>速度(秒): </span>\n                            <select id="combineSec" style="font-size:16px;height:30px;width:15%;">\n                                <option selected>0.5</option>\n                                <option>1</option>\n                                <option>2</option>\n                                <option>3</option>\n                            </select>\n                        </div>'),
      width: "382px",
      okText: "开始",
      onOk: function onOk() {
        var startLvl = Number($("#startGemLvl").val()),
          delay = Number($("#combineSec").val());
        PLU.autoCombineMasterGem(startLvl, delay * 1000);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  autoCombineMasterGem: function autoCombineMasterGem(startLvl, delay, gemCode, count) {
    if (!PLU.ONOFF["btn_bt_autoMasterGem"]) {
      PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
      $("#btn_bt_autoMasterGem").text("一键合天神");
      YFUI.writeToOut("<span style='color:white;'>==停止合成宝石!==</span>");
      return;
    }
    if (!UTIL.sysListeners["listenCombineMasterGem"]) {
      UTIL.addSysListener("listenCombineMasterGem", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("合成宝石需要") >= 0) {
          UTIL.delSysListener("listenCombineMasterGem");
          YFUI.writeToOut("<span style='color:#F00;'>--缺少银两, 合成结束--</span>");
          PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
        }
        return;
      });
    }
    //合成宝石需要5万银两。
    //没有这么多的完美的蓝宝石
    if (!gemCode || count < 3) {
      PLU.getGemList(function (gemList) {
        // console.log(gemList)
        var g = gemList.find(function (e) {
          return e.key.indexOf("" + (startLvl + 1)) > 0 && e.num >= 3;
        });
        if (g) {
          PLU.autoCombineMasterGem(startLvl, delay, g.key, g.num);
        } else {
          if (startLvl < 6) PLU.autoCombineMasterGem(startLvl + 1, delay); else {
            PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
            YFUI.writeToOut("<span style='color:white;'>==合成宝石结束!==</span>");
          }
        }
      });
    } else {
      var cd = delay / 4 | 250,
        n = 1;
      cd = cd > 250 ? cd : 250;
      if (count >= 30000) {
        n = 10000;
        cd = delay;
      } else if (count >= 15000) {
        n = 5000;
        cd = delay;
      } else if (count >= 9000) {
        n = 3000;
        cd = delay;
      } else if (count >= 3000) {
        n = 1000;
        cd = delay;
      } else if (count >= 300) {
        n = 100;
        cd = delay;
      } else if (count >= 150) {
        n = 50;
        cd = delay;
      } else if (count >= 90) {
        n = 30;
        cd = delay / 2 | 0;
      } else if (count >= 30) {
        n = 10;
        cd = delay / 3 | 0;
      }
      var cmd = "items hecheng " + gemCode + "_N_" + n + "";
      clickButton(cmd);
      setTimeout(function () {
        PLU.autoCombineMasterGem(startLvl, delay, gemCode, count - n * 3);
      }, cd);
    }
  },
  //================================================================================================
  toSellLaji: function toSellLaji($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      //$("#btn_bt_sellLaji").text('清理垃圾')
      return;
    }
    var defaultList = "破烂衣服,水草,木盾,铁盾,藤甲盾,青铜盾,鞶革,军袍,麻带,破披风,长斗篷,牛皮带,锦缎腰带,丝质披风,逆钩匕,匕首,铁甲,重甲,精铁甲,逆钩匕,银丝甲,梅花匕,软甲衣,羊角匕,金刚杖,白蟒鞭,天寒项链,天寒手镯,新月棍,天寒戒,天寒帽,天寒鞋,金弹子,拜月掌套,斩空刀,飞羽剑,七星宝戒,迷幻经纶,长剑,鹿皮小靴,铁手镯,银手镯,丝绸马褂,钢剑,布鞋,布衣,铁项链,银项链,单刀,丝绸衣,竹剑,松子,黑棋子,白棋子,沉虹刀,丝衣,木棍,钢刀,铁戒,银戒,船篙";
    YFUI.showInput({
      title: "清理垃圾",
      text: '格式：物品词组<br>\n                        物品词组：以英文逗号分割多个关键词<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">'.concat(defaultList, "</span><br>\n                        "),
      value: PLU.getCache("sellItemNames") || defaultList,
      type: "textarea",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val);
        PLU.setCache("sellItemNames", str);
        var keysList = str.split(",");
        var itemsTimeOut = setTimeout(function () {
          UTIL.delSysListener("listItems");
        }, 5000);
        UTIL.addSysListener("listItems", function (b, type, subtype, msg) {
          if (type != "items") return;
          UTIL.delSysListener("listItems");
          clearTimeout(itemsTimeOut);
          clickButton("prev");
          var iId = 1,
            itemList = [];
          while (b.get("items" + iId)) {
            var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
            if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1])) itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2])
            });
            iId++;
          }
          PLU.loopSellItems(itemList);
        });
        clickButton("items", 0);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopSellItems: function loopSellItems(itemList) {
    if (itemList.length <= 0) {
      PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
      return YFUI.writeToOut("<span style='color:#F66;'>--无出售物件!--</span>");
    }
    var ac = [];
    itemList.forEach(function (it) {
      var ct = it.num;
      while (ct > 0) {
        if (ct >= 10000) {
          ac.push("items sell " + it.key + "_N_10000");
          ct -= 10000;
        } else if (ct >= 1000) {
          ac.push("items sell " + it.key + "_N_1000");
          ct -= 1000;
        } else if (ct >= 100) {
          ac.push("items sell " + it.key + "_N_100");
          ct -= 100;
        } else if (ct >= 50) {
          ac.push("items sell " + it.key + "_N_50");
          ct -= 50;
        } else if (ct >= 10) {
          ac.push("items sell " + it.key + "_N_10");
          ct -= 10;
        } else {
          ac.push("items sell " + it.key + "");
          ct -= 1;
        }
      }
    });
    var acs = ac.join(";");
    PLU.fastExec(acs, function () {
      PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
      YFUI.writeToOut("<span style='color:white;'>==出售完成!==</span>");
    });
  },
  //================================================================================================
  toSplitItem: function toSplitItem($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    var defaultList = "玄武盾,破军盾,金丝宝甲衣,夜行披风,羊毛斗篷,残雪戒,残雪项链,残雪手镯,残雪鞋,金丝甲,宝玉甲,月光宝甲,虎皮腰带,沧海护腰,红光匕,毒龙鞭,玉清棍,霹雳掌套,血屠刀,生死符,残雪帽,星河剑,疯魔杖,天寒匕,无心匕,明月戒,明月鞋,明月帽,明月手镯,明月项链,软猬甲,月光宝甲衣,扬文,碧磷鞭,倚天剑,屠龙刀";
    YFUI.showInput({
      title: "分解装备",
      text: '格式：物品词组<br>\n                        物品词组：以英文逗号分割多个关键词<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">'.concat(defaultList, "</span><br>\n                        "),
      value: PLU.getCache("splitItemNames") || defaultList,
      type: "textarea",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val);
        PLU.setCache("splitItemNames", str);
        var keysList = str.split(",");
        var itemsTimeOut = setTimeout(function () {
          UTIL.delSysListener("listItems_si");
        }, 5000);
        UTIL.addSysListener("listItems_si", function (b, type, subtype, msg) {
          if (type != "items") return;
          UTIL.delSysListener("listItems_si");
          clearTimeout(itemsTimeOut);
          clickButton("prev");
          var iId = 1,
            itemList = [];
          while (b.get("items" + iId)) {
            var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
            if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1])) itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2])
            });
            iId++;
          }
          PLU.loopSplitItem(itemList);
        });
        clickButton("items", 0);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopSplitItem: function loopSplitItem(itemList) {
    if (itemList.length <= 0) {
      PLU.setBtnRed($("#btn_bt_splitItem"), 0);
      return YFUI.writeToOut("<span style='color:#F66;'>--无分解物件!--</span>");
    }
    var ac = [];
    itemList.forEach(function (it) {
      var ct = it.num;
      while (ct > 0) {
        if (ct >= 100) {
          ac.push("items splite " + it.key + "_N_100");
          ct -= 100;
        } else if (ct >= 50) {
          ac.push("items splite " + it.key + "_N_50");
          ct -= 50;
        } else if (ct >= 10) {
          ac.push("items splite " + it.key + "_N_10");
          ct -= 10;
        } else {
          ac.push("items splite " + it.key + "");
          ct -= 1;
        }
      }
    });
    var acs = ac.join(";");
    PLU.fastExec(acs, function () {
      PLU.setBtnRed($("#btn_bt_splitItem"), 0);
      YFUI.writeToOut("<span style='color:white;'>==分解完成!==</span>");
    });
  },
  //================================================================================================
  toPutStore: function toPutStore($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    var defaultList = "树枝,碎片,璞玉,青玉,墨玉,白玉,秘籍木盒,锦袋,瑞雪针扣,武穆遗书,隐武竹笺,空识卷轴,技能书,开元宝票,霹雳弹,舞鸢尾,百宜雪梅,宝石,宝箱,技能天书,钥匙,玄重铁,武林至高绝学残页,九转,采掘许可,提速卡,采掘许可,礼券";
    YFUI.showInput({
      title: "物品入库",
      text: '格式：物品词组<br>\n                        物品词组：以英文逗号分割多个关键词<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">'.concat(defaultList, "</span><br>\n                        "),
      value: PLU.getCache("putStoreNames") || defaultList,
      type: "textarea",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val);
        PLU.setCache("putStoreNames", str);
        var keysList = str.split(",").join("|");
        var itemsTimeOut = setTimeout(function () {
          UTIL.delSysListener("listItems_ps");
        }, 5000);
        UTIL.addSysListener("listItems_ps", function (b, type, subtype, msg) {
          if (type != "items") return;
          UTIL.delSysListener("listItems_ps");
          clearTimeout(itemsTimeOut);
          clickButton("prev");
          var iId = 1,
            itemList = [];
          while (b.get("items" + iId)) {
            var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
            if (it && it.length > 4 && it[3] == "0" && it[1].match(keysList) && it[1] != "青龙碎片" && it[1] != "玄铁碎片") itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2])
            });
            iId++;
          }
          PLU.loopPutStore(itemList);
        });
        clickButton("items", 0);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopPutStore: function loopPutStore(itemList) {
    if (itemList.length <= 0) {
      PLU.setBtnRed($("#btn_bt_putStore"), 0);
      return YFUI.writeToOut("<span style='color:#F66;'>--无物件入库!--</span>");
    }
    var ac = [];
    itemList.forEach(function (it) {
      ac.push("items put_store " + it.key + "");
    });
    PLU.fastExec(ac.join(";"), function () {
      PLU.setBtnRed($("#btn_bt_putStore"), 0);
      YFUI.writeToOut("<span style='color:white;'>==入库完成!==</span>");
    });
  },
  //================================================================================================
  toAutoUse: function toAutoUse($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    var defaultList = "*神秘宝箱,灵草,紫芝,狂暴丹,小还丹,大还丹,高级大还丹,高级狂暴丹,高级乾坤再造丹,百年灵草,百年紫芝,特级大还丹,特级狂暴丹,特级乾坤再造丹,千年灵草,千年紫芝,顶级大还丹,顶级狂暴补丸,顶级乾坤补丸,万年灵草,万年紫芝";
    YFUI.showInput({
      title: "物品使用",
      text: '格式：物品词组<br>\n                        物品词组：以英文逗号分割多个关键词, 只能单个使用的物品前面加*星号<br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">'.concat(defaultList, "</span><br>\n                        "),
      value: PLU.getCache("autoUseNames") || defaultList,
      type: "textarea",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val);
        PLU.setCache("autoUseNames", str);
        var keysList = str.split(",");
        var itemsTimeOut = setTimeout(function () {
          UTIL.delSysListener("listItems_au");
        }, 5000);
        UTIL.addSysListener("listItems_au", function (b, type, subtype, msg) {
          if (type != "items") return;
          UTIL.delSysListener("listItems_au");
          clearTimeout(itemsTimeOut);
          clickButton("prev");
          var iId = 1,
            itemList = [];
          while (b.get("items" + iId)) {
            var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
            if (!it[1]) continue;
            if (it && it.length > 4 && it[3] == "0") {
              if (keysList.includes(it[1])) itemList.push({
                key: it[0],
                name: it[1],
                num: Number(it[2]),
                multi: true
              }); else if (keysList.includes("*" + it[1])) itemList.push({
                key: it[0],
                name: it[1],
                num: Number(it[2]),
                multi: false
              });
            }
            iId++;
          }
          PLU.loopAutoUse(itemList);
        });
        clickButton("items", 0);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopAutoUse: function loopAutoUse(itemList) {
    if (itemList.length <= 0) {
      PLU.setBtnRed($("#btn_bt_autoUse"), 0);
      return YFUI.writeToOut("<span style='color:#F66;'>--无物件使用!--</span>");
    }
    var ac = [];
    itemList.forEach(function (it) {
      var ct = it.num;
      while (ct > 0) {
        if (it.multi && ct >= 100) {
          ac.push("items use " + it.key + "_N_100");
          ct -= 100;
        } else if (it.multi && ct >= 50) {
          ac.push("items use " + it.key + "_N_50");
          ct -= 50;
        } else if (it.multi && ct >= 10) {
          ac.push("items use " + it.key + "_N_10");
          ct -= 10;
        } else {
          ac.push("items use " + it.key + "");
          ct -= 1;
        }
      }
    });
    PLU.fastExec(ac.join(";"), function () {
      PLU.setBtnRed($("#btn_bt_autoUse"), 0);
      YFUI.writeToOut("<span style='color:white;'>==使用完成!==</span>");
    });
  },
  //================================================================================================
  toLoopScript: function toLoopScript($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#btn_bt_loopScript").text("循环执行");
      PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
      return;
    }
    YFUI.showInput({
      title: "循环执行",
      text: '格式：循环次数@时间间隔|执行指令<br>\n                        循环次数：省略则默认1次<br>\n                        时间间隔：省略则默认5(5秒)<br>\n                        执行指令：以分号分隔的指令<br>\n                        <span style="color:red;">例如</span><br>\n                        [例1] 3@5|jh 1;e;n;home;<br>\n                        [例2] jh 5;n;n;n;w;sign7;\n                        ',
      value: PLU.getCache("loopScript") || "home;",
      type: "textarea",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          scripts = "",
          times = 1,
          interval = 5,
          arr = str.split("|");
        if (arr.length > 1) {
          scripts = arr[1];
          if (arr[0].indexOf("@") >= 0) {
            times = Number(arr[0].split("@")[0]) || 1;
            interval = Number(arr[0].split("@")[1]) || 5;
          } else {
            times = Number(arr[0]) || 1;
          }
        } else {
          scripts = arr[0];
        }
        PLU.setCache("loopScript", str);
        PLU.loopScript(scripts, times, interval);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  loopScript: function loopScript(scripts, times, interval) {
    times--;
    $("#btn_bt_loopScript").text("停执行(" + times + ")");
    PLU.execActions(scripts, function () {
      if (times <= 0 || !PLU.ONOFF["btn_bt_loopScript"]) {
        PLU.setBtnRed($("#btn_bt_loopScript"), 0);
        $("#btn_bt_loopScript").text("循环执行");
        PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
        return;
      } else {
        PLU.STO.loopScTo = setTimeout(function () {
          PLU.loopScript(scripts, times, interval);
        }, interval * 1000);
      }
    });
  },
  //================================================================================================
  toAutoAskQixia: function toAutoAskQixia($btn, autoTime) {
    if (g_gmain.is_fighting) return;
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) return;
    $(".menu").hide();
    clickButton("open jhqx", 0);
    YFUI.showPop({
      title: "自动访问奇侠",
      text: "自动对话所有有亲密度的奇侠<br>请在做完20次赞助金锭后再进行<br><b style='color:#F00;'>是否现在进行?</b>",
      autoOk: autoTime !== null && autoTime !== void 0 ? autoTime : null,
      onOk: function onOk() {
        var jhqxTimeOut = setTimeout(function () {
          UTIL.delSysListener("listQixia");
          PLU.setBtnRed($btn, 0);
        }, 5000);
        UTIL.addSysListener("listQixia", function (b, type, subtype, msg) {
          if (type != "show_html_page" || msg.indexOf("江湖奇侠成长信息") < 0) return;
          UTIL.delSysListener("listQixia");
          clearTimeout(jhqxTimeOut);
          var listHtml = msg;
          clickButton("prev");
          var str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果)?.{30,50}(已出师|未出世)",
            //let str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果?.{30,50}已出师)",
            rg1 = new RegExp(str, "g"),
            rg2 = new RegExp(str),
            visQxs = [];
          listHtml.match(rg1).forEach(function (e) {
            var a = e.match(rg2);
            if (a) visQxs.push({
              key: a[1],
              name: a[2],
              num: Number(a[3]),
              link: "find_task_road qixia " + a[1],
              fast: a[4] ? "open jhqx " + a[1] : null
            });
          });
          visQxs = visQxs.sort(function (a, b) {
            if (a.fast && b.num >= 25000) return -1; else return 2;
          });
          visQxs.reverse();
          PLU.toAskQixia(visQxs, 0);
        });
        clickButton("open jhqx", 0);
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  toAskQixia: function toAskQixia(qxList, idx) {
    clickButton("home");
    if (idx >= qxList.length || !PLU.ONOFF["btn_bt_autoAskQixia"]) {
      PLU.setBtnRed($("#btn_bt_autoAskQixia"), 0);
      YFUI.writeToOut("<span style='color:#FFF;'>--奇侠访问结束!--</span>");
      YFUI.writeToOut("<span style='color:yellow;'> 今日一共获得玄铁令x" + PLU.TMP.todayGetXT + "</span>");
      UTIL.log({
        msg: " 今日一共获得玄铁令x " + PLU.TMP.todayGetXT + "  ",
        type: "TIPS",
        time: new Date().getTime()
      });
      return;
    }
    var qxObj = qxList[idx];
    if (qxObj.fast) {
      clickButton(qxObj.fast, 0);
      setTimeout(function () {
        PLU.toAskQixia(qxList, idx + 1);
      }, 500);
    } else {
      PLU.execActions(qxObj.link + ";golook_room;", function () {
        var objNpc = UTIL.findRoomNpc(qxObj.name, false, true);
        if (objNpc) {
          PLU.execActions("ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";golook_room;", function () {
            setTimeout(function () {
              PLU.toAskQixia(qxList, idx + 1);
            }, 500);
          });
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠:" + qxObj.name + "--</span>");
          setTimeout(function () {
            PLU.toAskQixia(qxList, idx + 1);
          }, 500);
        }
      });
    }
  },
  //================================================================================================
  getQixiaList: function getQixiaList(callback) {
    var jhQixiaTimeOut = setTimeout(function () {
      UTIL.delSysListener("getlistQixia");
    }, 5000);
    UTIL.addSysListener("getlistQixia", function (b, type, subtype, msg) {
      if (type != "show_html_page" || msg.indexOf("江湖奇侠成长信息") < 0) return;
      UTIL.delSysListener("getlistQixia");
      clearTimeout(jhQixiaTimeOut);
      unsafeWindow.ttttt = msg;
      var listHtml = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
      clickButton("prev");
      var str = "find_task_road qixia (\\d+)(.{2,4})(\\((\\d*)\\))?(open jhqx \\d+朱果)?<\\/td><td.{20,35}>(.{1,10})<\\/td><td.{20,35}>(.{1,15})<\\/td><td .{20,40}领悟(.{2,10})<\\/td><\\/tr>";
      var rg1 = new RegExp(str, "g"),
        rg2 = new RegExp(str),
        qxList = [];
      listHtml.match(rg1).forEach(function (e) {
        var a = e.match(rg2);
        if (a) qxList.push({
          index: a[1],
          name: a[2],
          num: Number(a[4]) || 0,
          link: "find_task_road qixia " + a[1],
          fast: a[5] ? "open jhqx " + a[1] : null,
          inJh: a[6] && a[6].indexOf("未出世") < 0 ? true : false
        });
      });
      callback && callback(qxList);
    });
    clickButton("open jhqx", 0);
  },
  //================================================================================================
  toAutoVisitQixia: function toAutoVisitQixia($btn) {
    if (g_gmain.is_fighting) return;
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      //$("#btn_bt_autoVisitQixia").text('亲近奇侠')
      PLU.TMP.autoQixiaMijing = false;
      return;
    }
    $(".menu").hide();
    clickButton("open jhqx", 0);
    YFUI.showInput({
      title: "奇侠秘境",
      text: '请输入要提升亲密度的游侠的姓名<br>\n                        格式：金锭数量|游侠姓名@目标友好度<br>\n                        金锭数量：给予1或5或15金锭，可省略则只对话<br>\n                        游侠姓名：只能输入一个游侠姓名<br>\n                        目标友好度：省略则以可学技能的友好度为目标<br>\n                        <span style="color:red;">例如</span><br>\n                        [例1] 15|风无痕 <span style="color:blue;">访问风无痕赠与15金锭</span><br>\n                        [例2] 火云邪神 <span style="color:blue;">访问火云邪神对话</span><br>\n                        [例2] 15|步惊鸿@30000 <span style="color:blue;">访问步惊鸿对话赠与15金锭到30000友好度</span><br>\n                        ' + '<div style="text-align:right;"><label>自动挖宝:<input type="checkbox" id="to_if_auwb" name="awb" value="1"/></label><label>不要扫荡秘境:<input type="checkbox" id="if_auto_mj" name="noamj" value="1"/></label></div>',
      value: PLU.getCache("visitQixiaName") || "15|风无痕@40000",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val),
          arr = str.split("|"),
          giveNum = 15,
          qxName = "",
          objectFN = 0;
        var ifAutoMj = $("#if_auto_mj").is(":checked");
        var ifAutoWb = $("#if_auto_wb").is(":checked");
        
        if (arr.length > 1) {
          giveNum = Number(arr[0]) || 15;
          var nn = arr[1].split("@");
          qxName = nn[0].trim();
          if (nn.length > 1) objectFN = Number(nn[1]);
        } else {
          giveNum = 0;
          var _nn = arr[0].split("@");
          qxName = _nn[0].trim();
          if (_nn.length > 1) objectFN = Number(_nn[1]);
        }
        PLU.setCache("visitQixiaName", str);
        PLU.TMP.todayGetXT = 0;
        UTIL.delSysListener("listenVisitNotice");
        PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
        PLU.TMP.goingQixiaMijing = false;
        PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, function (err) {
          if (err) {
            if (err.code == 1) {
              PLU.setBtnRed($btn, 0);
              UTIL.delSysListener("listenVisitNotice");
              PLU.toAutoAskQixia($("#btn_bt_autoAskQixia"), 10);
              YFUI.writeToOut("<span style='color:yellow;'> 今日一共获得玄铁令x" + PLU.TMP.todayGetXT + "</span>");
              UTIL.log({
                msg: " 今日一共获得玄铁令x " + PLU.TMP.todayGetXT + "  ",
                type: "TIPS",
                time: new Date().getTime()
              });
            } else {
              YFUI.showPop({
                title: "提示",
                text: "<b style='color:#F00;'>" + err.msg + "</b>",
                onOk: function onOk() {
                  PLU.setBtnRed($btn, 0);
                  PLU.toAutoVisitQixia($btn);
                },
                onX: function onX() {
                  PLU.setBtnRed($btn, 0);
                }
              });
            }
          }
        });
      },
      onNo: function onNo() {
        PLU.setBtnRed($btn, 0);
      },
      onX: function onX() {
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  tryVisitQixia: function tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback) {
    PLU.TMP.autoQixiaMijing = true;
    //发现
    PLU.getQixiaList(function (qxlist) {
      var testDone = qxlist.find(function (e) {
        return !!e.fast;
      });
      if (testDone) {
        PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
        callback && callback({
          code: 1,
          msg: "今日奇侠友好度操作已经完毕"
        });
        return;
      }
      var qx = qxlist.find(function (e) {
        return e.name == qxName;
      });
      if (!qx) {
        callback && callback({
          code: 2,
          msg: "没有这个奇侠!"
        });
        return;
      }
      if (!qx.inJh) {
        callback && callback({
          code: 3,
          msg: "这个奇侠还没出师!"
        });
        return;
      }
      var objectFriendNum = objectFN !== null && objectFN !== void 0 ? objectFN : PLU.YFD.qixiaFriend.find(function (e) {
        return e.name == qxName;
      }).skillFN;
      if (qx.num >= objectFriendNum) {
        callback && callback({
          code: 4,
          msg: "奇侠友好度已足够"
        });
        return;
      }
      var listenVisitTimeout = function listenVisitTimeout() {
        if (!PLU.TMP.goingQixiaMijing) PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
      };
      UTIL.delSysListener("listenVisitNotice");
      //监听场景消息
      UTIL.addSysListener("listenVisitNotice", function (b, type, subtype, msg) {
        if (type != "notice" && type != "main_msg") return;
        var msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match("对你悄声道：你现在去")) {
          //奇侠说秘境
          var l = msgTxt.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/);
          if (l && l.length > 2) {
            PLU.TMP.goingQixiaMijing = true;
            var placeData = PLU.YFD.mjList.find(function (e) {
              return e.n == l[2];
            });
            if (placeData) {
              PLU.execActions(placeData.v + ";;find_task_road secret;;", function () {
                setTimeout(function () {
                  var mapid = g_obj_map.get("msg_room").get("map_id");
                  var shortName = g_obj_map.get("msg_room").get("short");
                  YFUI.writeToOut("<span style='color:#FFF;'>--地图ID:" + mapid + "--</span>");
                  if (mapid == "public") {
                    PLU.execActions("secret_op1;", function () {
                      PLU.TMP.goingQixiaMijing = false;
                      PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                    });
                  } else if (ifAutoMj) {
                    UTIL.delSysListener("listenVisitNotice");
                    PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                    YFUI.writeToOut("<span style='color:yellow;'> ===== 进入了秘境! ===== </span>");
                  } else {
                    var ss = g_obj_map.get("msg_room").elements.find(function (e) {
                      return e.value == "仔细搜索";
                    });
                    if (ss) {
                      var cmd_ss = g_obj_map.get("msg_room").get(ss.key.split("_")[0]);
                      PLU.execActions(cmd_ss + ";;", function () {
                        if (ifAutoWb) {
                          var wb = g_obj_map.get("msg_room").elements.find(function (e) {
                            return e.value.indexOf("秘境挖宝") >= 0;
                          });
                          if (wb) {
                            PLU.execActions("mijing_wb;;");
                          }
                        }
                        var sd = g_obj_map.get("msg_room").elements.find(function (e) {
                          return e.value.indexOf("扫荡") >= 0;
                        });
                        if (sd) {
                          var cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                          PLU.doSaoDang(mapid, cmd_sd, function () {
                            PLU.TMP.goingQixiaMijing = false;
                            PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                          });
                        } else if (shortName == "无尽深渊") {
                          PLU.goWuJinShenYuan(function () {
                            PLU.TMP.goingQixiaMijing = false;
                            PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                          });
                        } else {
                          UTIL.delSysListener("listenVisitNotice");
                          PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                          YFUI.writeToOut("<span style='color:yellow;'> ===进入了未通关秘境!=== </span>");
                        }
                      });
                    }
                  }
                }, 1500);
              });
            }
            return;
          }
        }
        var vis = msgTxt.match(/今日亲密度操作次数\((\d+)\/20\)/);
        if (vis) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          setTimeout(function () {
            if (!PLU.TMP.goingQixiaMijing) {
              PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 4000);
              var objNpc = UTIL.findRoomNpc(qxName, false, true);
              if (objNpc) {
                PLU.doVisitAction(objNpc.key, giveNum);
              } else {
                YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠!--</span>");
                setTimeout(function () {
                  PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                }, 500);
              }
            }
          }, 500);
          return;
        }
        if (msgTxt.match("今日做了太多关于亲密度的操作")) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          callback && callback({
            code: 1,
            msg: "今日奇侠友好度操作已经完毕"
          });
          return;
        }
        if (msgTxt.match(/今日奇侠赠送次数(\d+)\/(\d+)，.*赠送次数(\d+)\/(\d+)/)) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          callback && callback({
            code: 1,
            msg: "今日奇侠友好度操作已经完毕"
          });
          return;
        }
        if (msgTxt.match("扫荡成功，获得：")) {
          var xtnum = parseInt(msgTxt.split("、")[0].split("玄铁令x")[1]);
          if (xtnum) PLU.TMP.todayGetXT += xtnum;
          xtnum && YFUI.writeToOut("<span>--玄铁令+" + xtnum + "--</span>");
          return;
        }
        if (msgTxt.match("你开始四处搜索……你找到了")) {
          var _xtnum = parseInt(msgTxt.split("、")[0].split("玄铁令x")[1]);
          if (_xtnum) PLU.TMP.todayGetXT += _xtnum;
          _xtnum && YFUI.writeToOut("<span>--玄铁令+" + _xtnum + "--</span>");
          return;
        }
      });
      PLU.execActions(qx.link + ";;", function () {
        var objNpc = UTIL.findRoomNpc(qxName, false, true);
        if (objNpc) {
          PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 3000);
          PLU.doVisitAction(objNpc.key, giveNum);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠:" + qxName + "--</span>");
          setTimeout(function () {
            PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
          }, 500);
        }
      });
    });
  },
  //================================================================================================
  doVisitAction: function doVisitAction(qxKey, giveNum) {
    if (giveNum == 0) {
      PLU.execActions("ask " + qxKey + ";");
    } else if (giveNum == 1) {
      PLU.execActions("auto_zsjd_" + qxKey.split("_")[0] + ";");
    } else if (giveNum == 5) {
      PLU.execActions("auto_zsjd5_" + qxKey.split("_")[0] + ";");
    } else {
      PLU.execActions("auto_zsjd20_" + qxKey.split("_")[0] + ";");
    }
  },
  //================================================================================================
  doSaoDang: function doSaoDang(mapid, cmd, callback) {
    UTIL.addSysListener("listenVisitSaodang", function (b, type, subtype, msg) {
      if (type != "prompt") return;
      var xtnum = parseInt(msg.split("、")[0].split("玄铁令x")[1]);
      if (["yaowanggu", "leichishan"].includes(mapid)) {
        if (xtnum < 5) return setTimeout(function () {
          clickButton(cmd);
        }, 300);
      } else if (["liandanshi", "lianhuashanmai", "qiaoyinxiaocun", "duzhanglin", "shanya", "langhuanyudong", "dixiamigong"].includes(mapid)) {
        if (xtnum < 3) return setTimeout(function () {
          clickButton(cmd);
        }, 300);
      }
      UTIL.delSysListener("listenVisitSaodang");
      PLU.execActions(cmd + " go;", function () {
        callback && callback();
      });
    });
    setTimeout(function () {
      clickButton(cmd);
    }, 300);
  },
  //================================================================================================
  goWuJinShenYuan: function goWuJinShenYuan(endcallback) {
    //无尽深渊
    var paths = "e;e;s;w;w;s;s;e;n;e;s;e;e;n;w;n;e;n;w".split(";");
    var sidx = 0;
    var gostep = function gostep(pathArray, stepFunc) {
      var ca = pathArray[sidx];
      PLU.execActions(ca + "", function () {
        stepFunc && stepFunc();
        sidx++;
        if (sidx >= pathArray.length) {
          endcallback && endcallback();
        } else {
          setTimeout(function () {
            gostep(pathArray, stepFunc);
          }, 250);
        }
      });
    };
    gostep(paths, function () {
      var fc = g_obj_map.get("msg_room").elements.find(function (e) {
        return e.value == "翻查";
      });
      if (fc) {
        var cmd_fc = g_obj_map.get("msg_room").get(fc.key.split("_")[0]);
        PLU.execActions(cmd_fc + "");
      }
    });
  },
  //================================================================================================
  toWaitCDKill: function toWaitCDKill($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      //$("#btn_bt_waitCDKill").text('')
      return;
    }
    clickButton("golook_room");
    YFUI.showPop({
      title: "倒计时叫杀门派纷争",
      text: "倒计时最后5秒叫杀最近结束时间的门派纷争!，确定后单击NPC<br>",
      onOk: function onOk() {
        setTimeout(function (o) {
          $(document).one("click", function (o) {
            var npcbtn = $(o.target).closest("button");
            var snpc = npcbtn[0].outerHTML.match(/clickButton\('look_npc (\w+)'/i);
            if (snpc && snpc.length >= 2) {
              var nowTime = new Date().getTime(),
                cMPFZ = null;
              for (var k in PLU.MPFZ) {
                if (!cMPFZ || cMPFZ.t > PLU.MPFZ[k].t) cMPFZ = PLU.MPFZ[k];
              }
              if (cMPFZ) {
                PLU.TMP.DATA_MPFZ = Object.assign({}, cMPFZ, {
                  killId: snpc[1]
                });
                YFUI.showPop({
                  title: "倒计时叫杀门派纷争",
                  text: '<div style="line-height:2;">人物：' + npcbtn.text() + "<br>地点：" + PLU.TMP.DATA_MPFZ.p + "<br>对决：" + PLU.mp2icon(PLU.TMP.DATA_MPFZ.v) + "</div>",
                  okText: "好的",
                  onOk: function onOk() { },
                  onNo: function onNo() {
                    PLU.TMP.DATA_MPFZ = null;
                    PLU.setBtnRed($btn, 0);
                  }
                });
              }
            } else {
              PLU.TMP.DATA_MPFZ = null;
              PLU.setBtnRed($btn, 0);
            }
          });
        }, 500);
      },
      onNo: function onNo() {
        PLU.TMP.DATA_MPFZ = null;
        PLU.setBtnRed($btn, 0);
      }
    });
  },
  //================================================================================================
  mp2icon: function mp2icon(mplist) {
    var htm = "",
      zfarr = mplist.split(" VS "),
      zarr = zfarr[0].split("、"),
      farr = zfarr[1].split("、");
    zarr.forEach(function (zm) {
      htm += '<span style="display:inline-block;background:#F66;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + zm + "</span>";
    });
    htm += '<span style="color:#FFF;background:#F00;font-weight:bold;border-radius:50%;padding:2px;">VS</span>';
    farr.forEach(function (fm) {
      htm += '<span style="display:inline-block;background:#66F;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + fm + "</span>";
    });
    return htm;
  },
  //================================================================================================
  toCheckAndWaitCDKill: function toCheckAndWaitCDKill(nowTime) {
    var k = PLU.TMP.DATA_MPFZ.t + 1560000;
    var dt = Math.floor((k - nowTime) / 1000);
    if (dt == 5) {
      YFUI.writeToOut("<span style='color:#F99;'>--最后5秒,进入战斗!--</span>");
      //PLU.TMP.DATA_MPFZ = null
      //PLU.setBtnRed($btn,0)
      PLU.autoFight({
        targetKey: PLU.TMP.DATA_MPFZ.killId,
        fightKind: "kill",
        onFail: function onFail() {
          PLU.TMP.DATA_MPFZ = null;
          PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
          setTimeout(function (t) {
            PLU.autoChushi();
          }, 500);
        },
        onEnd: function onEnd() {
          PLU.TMP.DATA_MPFZ = null;
          PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
          setTimeout(function (t) {
            PLU.autoChushi();
          }, 500);
        }
      });
    }
  },
  //================================================================================================
  setListen: function setListen($btn, listenKey, stat) {
    var btnFlag = 0;
    if (stat != undefined) {
      btnFlag = PLU.setBtnRed($btn, stat);
      PLU.setCache(listenKey, stat);
      return;
    } else {
      btnFlag = PLU.setBtnRed($btn);
    }
    if (!btnFlag) {
      PLU.setCache(listenKey, 0);
      return;
    }
    if (listenKey == "listenQL") {
      //监听青龙
      YFUI.showInput({
        title: "监听本服青龙",
        text: '格式：击杀类型|物品词组<br>\n                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>\n                            物品词组：以英文逗号分割多个关键词<br>\n                            <span style="color:red;">例如：</span><br>\n                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>\n                            [例2] <span style="color:blue;">1|*</span>;\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "0|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣",
        type: "textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", str);
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "listenTF") {
      //监听夜魔
      YFUI.showInput({
        title: "监听逃犯",
        text: '格式：击杀类型|逃犯词组<br>\n                            击杀类型：0杀守方(逃犯)，1杀攻方(捕快)。<br>\n                            逃犯词组：以英文逗号分割多个关键词<br>\n                            <span style="color:#F00;">【新人】以#开头则等候他人开杀再进</span><br>\n                            <span style="color:#933;">例如：</span><br>\n                            [例1] <span style="color:blue;">0|夜魔*段老大,#夜魔*流寇</span>\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "0|夜魔*段老大,夜魔*二娘,#夜魔*岳老三,#夜魔*云老四,#夜魔*流寇,#夜魔*恶棍,#夜魔*剧盗",
        type: "textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", str);
          PLU.setCache(listenKey, 1);
          PLU.splitTFParam();
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "listenKFQL") {
      //监听跨服青龙
      YFUI.showInput({
        title: "监听跨服青龙",
        text: '格式：击杀类型|物品词组<br>\n                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>\n                            物品词组：以英文逗号分割多个关键词<br>\n                            <span style="color:red;">例如：</span><br>\n                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>\n                            [例2] <span style="color:blue;">1|*</span>;\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "1|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣",
        type: "textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", str);
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "listenYX") {
      var _ref3;
      //监听游侠
      YFUI.showInput({
        title: "监听游侠",
        text: '格式：游侠词组<br>\n                游侠词组：以英文逗号分割多个关键词<br>\n                <span style="color:red;">例如：</span><br>\n                 [例1] <span style="color:blue;">王语嫣,厉工,金轮法王,虚夜月,云梦璃,叶孤城</span><br>\n                ',
        value: PLU.getCache(listenKey + "_keys") || (_ref3 = []).concat.apply(_ref3, _toConsumableArray(PLU.YFD.youxiaList.map(function (e) {
          return e.v;
        }))).join(","),
        type: "textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          if (!str) return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", str);
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "autoTP") {
      //监听突破
      YFUI.showInput({
        title: "持续突破",
        text: '请输入需要自动突破的技能，以英文逗号分割，自动突破将在当前全部突破完后才开始。<br>\n                以1|开头使用金刚舍利加速<br>\n                 以2|开头使用通天丸加速<br>\n                 以3|开头使用突破宝典加速<br>\n                 以4|开头使用三生石加速(未开发)<br>\n                 <span style="color:red;">例如：</span><br>\n                 [例1] <span style="color:blue;">千影百伤棍,1|排云掌法,2|无相金刚掌,3|降龙十八掌,独孤九剑</span>\n                 ',
        value: PLU.getCache(listenKey + "_keys") || "1|千影百伤棍,1|排云掌法,1|不动明王诀",
        type: "textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          if (!str) return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", str);
          PLU.setCache(listenKey, 1);
          PLU.getSkillsList(function (allSkills, tupoSkills) {
            if (tupoSkills.length == 0) {
              PLU.toToPo();
            }
          });
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "autoDY") {//监听钓鱼
      var yuanbao = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao");
      var yuanbaoStr = Math.floor(yuanbao).toString(); // 将元宝数量转换为字符串
      var deductedYuanbao = yuanbaoStr.length >= 5 ? Number(yuanbaoStr.slice(-5)) : 0; // 取后5位数作为扣除的元宝数量
      var targetYuanbao = yuanbao - deductedYuanbao; // 计算保留的元宝数量
      YFUI.writeToOut("<span style='color:#7FFF00;'>当前元宝数量: ".concat(yuanbao || "未知", "</span>"));
      YFUI.showInput({
        title: "持续钓鱼",
        text: "请输入需要保留的元宝数，默认为去掉元宝后五位后取整",
        value: targetYuanbao,
        // 默认值为元宝数量减去扣除的元宝数量
        onOk: function onOk(val) {
          var num = Number($.trim(val));
          PLU.setCache(listenKey + "_key", num);
          PLU.setCache(listenKey, 1);
          var room = g_obj_map.get("msg_room");
          if (room) room = room.get("short");
          if (room != "桃溪" || UTIL.inHome()) {
            var path = ["team create;rank go 233;#6 s", "sw;se", "sw", "se", "s", "s"];
            // 人满是啥提示...，不知道...（那就随机选位置吧（
            PLU.execActions(path.slice(0, Math.floor(Math.random() * 6) + 1).join(";") + ";diaoyu");
          }
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "autoCaicha") {//监听采茶
        var yuanbao = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao");
        var yuanbaoStr = Math.floor(yuanbao).toString(); // 将元宝数量转换为字符串
        var deductedYuanbao = yuanbaoStr.length >= 5 ? Number(yuanbaoStr.slice(-5)) : 0; // 取后5位数作为扣除的元宝数量
        var targetYuanbao = yuanbao - deductedYuanbao; // 计算保留的元宝数量
        YFUI.writeToOut("<span style='color:#7FFF00;'>当前元宝数量: ".concat(yuanbao || "未知", "</span>"));
        YFUI.showInput({
          title: "持续采茶",
          text: "请输入需要保留的元宝数，默认为去掉元宝后五位后取整",
          value: targetYuanbao,
          onOk: function onOk(val) {
            var num = Number($.trim(val));
            PLU.setCache(listenKey + "_key", num);
            PLU.setCache(listenKey, 1);
            var room = g_obj_map.get("msg_room");
            if (room) room = room.get("short");
            if (room != "后山茶园" || UTIL.inHome()) {
              var path = ["team create;rank go 234;#3 s;e;ne;e;ne;ne;e;e;", "w", "w;w", "e", "e", "e;e"];
              PLU.execActions(path.slice(0, Math.floor(Math.random() * 6) + 1).join(";") + ";diaoyu");
            }
          },
          onNo: function onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          }
        });  
    } else if (listenKey == "autoConnect") {
      YFUI.showInput({
        title: "自动重连",
        text: '请输入断线后自动重连的时间，重连方式为到时间自动刷新页面。<br>单位为秒，0代表不自动重连。<br>\n                <span style="color:red;">例如：</span><br>\n               [例1] <span style="color:blue;">60</span> 代表60秒后刷新页面\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "0",
        //type:"textarea",
        onOk: function onOk(val) {
          var v = Number(val);
          if (val == "") return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey + "_keys", v);
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "autoSignIn") {
      //YFUI.showPop(
      YFUI.showPop({
        title: "定时一键签到",
        text: '请输入自动签到的时间。<br>\n                <div><span style="font-size:18px;line-height:2;">每日: </span><input id="autoSignInTime" type="time" style="font-size:20px;border-radius:5px;margin:10px 0"/></div>\n                        ',
        onOk: function onOk() {
          var v = $.trim($("#autoSignInTime").val());
          if (v == "") return PLU.setBtnRed($btn, 0);
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else if (listenKey == "autoQuitTeam") {
      //进塔离队
      YFUI.showPop({
        title: "进塔自动离队",
        text: "是否进塔自动离队?<br>",
        onOk: function onOk() {
          PLU.setCache(listenKey, 1);
        },
        onNo: function onNo() {
          PLU.setCache(listenKey, 0);
          PLU.setBtnRed($btn, 0);
        }
      });
    } else {
      PLU.setCache(listenKey, 1);
      return;
    }
  },
  //================================================================================================
  //================================================================================================
  splitTFParam: function splitTFParam() {
    var ltl = (PLU.getCache("listenTF_keys").split("|")[1] || "").split(",");
    PLU.TMP.lis_TF_list = [];
    PLU.TMP.lis_TF_force = [];
    ltl.map(function (e, i) {
      if (e.charAt(0) == "#") {
        PLU.TMP.lis_TF_list.push(e.substring(1));
        PLU.TMP.lis_TF_force.push(0);
      } else {
        PLU.TMP.lis_TF_list.push(e);
        PLU.TMP.lis_TF_force.push(1);
      }
    });
  },
  //================================================================================================
  goQinglong: function goQinglong(npcName, place, gb, kf) {
    var placeData = PLU.YFD.qlList.find(function (e) {
      return e.n == place;
    });
    if (kf || UTIL.inHome() && placeData) {
      PLU.execActions(placeData.v + ";golook_room", function () {
        var objNpc = UTIL.findRoomNpc(npcName, !Number(gb));
        if (objNpc) {
          PLU.killQinglong(objNpc.key, 0);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--寻找目标失败!--</span>");
          PLU.execActions("golook_room;home");
        }
      });
    }
  },
  //================================================================================================
  killQinglong: function killQinglong(npcId, tryNum) {
    PLU.autoFight({
      targetKey: npcId,
      fightKind: "kill",
      autoSkill: "random",
      onFail: function onFail(errCode) {
        if (errCode >= 88 && tryNum < 100) {
          setTimeout(function () {
            PLU.killQinglong(npcId, tryNum + 1);
          }, 250);
          return;
        }
        YFUI.writeToOut("<span style='color:#FFF;'>--抢青龙失败!--</span>");
        PLU.execActions("home;");
      },
      onEnd: function onEnd() {
        PLU.execActions("prev_combat;home;");
      }
    });
  },
  //================================================================================================
  goTaofan: function goTaofan(npcName, npcPlace, flyLink, gb, force) {
    if (UTIL.inHome()) {
      var ctn = 0,
        gocmd = flyLink;
      PLU.YFD.cityList.forEach(function (e, i) {
        if (e == npcPlace) ctn = i + 1;
      });
      if (ctn > 0) gocmd = "jh " + ctn;
      PLU.execActions(gocmd + ";golook_room;", function (e) {
        setTimeout(function (t) {
          PLU.killTaofan(npcName, -Number(gb), force, 0);
        }, 1000);
      });
    }
  },
  //================================================================================================
  killTaofan: function killTaofan(npcName, gb, force, tryCount) {
    console.debug(gb);
    var npcObj = UTIL.findRoomNpc(npcName, gb);
    if (npcObj) {
      if (force) {
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: "random",
          onFail: function onFail(errCode) {
            if (errCode == 4) {
              YFUI.writeToOut("<span style='color:#FFF;'>--已达到上限!取消逃犯监听!--</span>");
              PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
            } else if (errCode > 1 && tryCount < 36) {
              setTimeout(function () {
                PLU.killTaofan(npcName, gb, force, tryCount + 1);
              }, 500);
              return;
            }
            PLU.execActions("golook_room;home;");
          },
          onEnd: function onEnd() {
            PLU.execActions("prev_combat;home;");
          }
        });
      } else {
        PLU.waitDaLaoKill({
          targetId: npcObj.key,
          onFail: function onFail(ec) { },
          onOk: function onOk() {
            PLU.autoFight({
              targetKey: npcObj.key,
              fightKind: "kill",
              autoSkill: "random",
              onFail: function onFail(errCode) {
                if (errCode == 4) {
                  YFUI.writeToOut("<span style='color:#FFF;'>--已达到上限!取消逃犯监听--</span>");
                  PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
                } else YFUI.writeToOut("<span style='color:#FFF;'>--'ERR=" + errCode + "--</span>");
                PLU.execActions("golook_room;home;");
              },
              onEnd: function onEnd() {
                PLU.execActions("prev_combat;home;");
              }
            });
          }
        });
      }
    } else {
      YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC!--</span>");
      if (tryCount < 4) {
        return setTimeout(function () {
          PLU.killTaofan(npcName, gb, force, tryCount + 1);
        }, 500);
      }
      PLU.execActions("golook_room;home;");
    }
  },
  //================================================================================================
  waitDaLaoKill: function waitDaLaoKill(_ref4) {
    var targetId = _ref4.targetId,
      onOk = _ref4.onOk,
      onFail = _ref4.onFail;
    var tryTimes = 0;
    UTIL.addSysListener("lookNpcWait", function (b, type, subtype, msg) {
      if (type == "notice" && subtype == "notify_fail" && msg.indexOf("没有这个人") >= 0) {
        YFUI.writeToOut("<span style='color:#FFF;'>--目标已丢失!--</span>");
        UTIL.delSysListener("lookNpcWait");
        return onFail && onFail(1);
      }
      if (type == "look_npc") {
        var desc = UTIL.filterMsg(b.get("long"));
        var lookInfo = desc.match(/[他|她]正与 (\S*)([\S\s]*) 激烈争斗中/);
        if (lookInfo && lookInfo.length > 2 && $.trim(lookInfo[2]) != "") {
          YFUI.writeToOut("<span style='color:#9F9;'>--目标已被大佬攻击,可以跟进--</span>");
          UTIL.delSysListener("lookNpcWait");
          return onOk && onOk();
        }
        tryTimes++;
        if (tryTimes > 30) {
          UTIL.delSysListener("lookNpcWait");
          return onFail && onFail(30);
        } else {
          setTimeout(function () {
            clickButton("look_npc " + targetId);
          }, 500);
        }
      }
      //如提前进入战斗可能是因为杀气, 逃跑后继续
      if (type == "vs" && subtype == "vs_info" && b.get("vs2_pos1") != targetId) {
        PLU.autoEscape({
          onEnd: function onEnd() {
            setTimeout(function () {
              clickButton("look_npc " + targetId);
            }, 500);
          }
        });
      }
    });
    clickButton("look_npc " + targetId);
  },
  //================================================================================================
  //================================================================================================
  fixJhName: function fixJhName(name) {
    switch (name) {
      case "白驼山":
        return "白驮山";
      case "黑木崖":
        return "魔教";
      case "光明顶":
        return "明教";
      case "铁血大旗门":
        return "大旗门";
      case "梅庄":
        return "寒梅庄";
    }
    return name;
  },
  //================================================================================================
  goFindYouxia: function goFindYouxia(params) {
    //{paths,idx,objectNPC}
    if (params.idx >= params.paths.length) {
      setTimeout(function () {
        PLU.execActions("home");
      }, 500);
      YFUI.writeToOut("<span style='color:#FFF;'>--找不到游侠!...已搜索完地图--</span>");
      return;
    }
    var acs = [params.paths[params.idx]];
    PLU.actions({
      paths: acs,
      idx: 0,
      onPathsEnd: function onPathsEnd() {
        setTimeout(function () {
          var npcObj = UTIL.findRoomNpc(params.objectNPC, false, true);
          if (npcObj) {
            YFUI.writeToOut("<span style='color:#FFF;'>--游侠已找到--</span>");
            PLU.killYouXia(npcObj.key, 0);
          } else {
            params.idx++;
            PLU.goFindYouxia(params);
          }
        }, 300);
      },
      onPathsFail: function onPathsFail() {
        setTimeout(function () {
          PLU.execActions("home");
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到游侠!...路径中断--</span>");
        return;
      }
    });
  },
  //================================================================================================
  killYouXia: function killYouXia(npcId, tryNum) {
    PLU.autoFight({
      targetKey: npcId,
      fightKind: "kill",
      autoSkill: "multi",
      onFail: function onFail(errCode) {
        if (String(errCode).indexOf("delay_") >= 0) {
          var mc = String(errCode).match(/delay_(\d+)/);
          if (mc) {
            var wtime = 500 + 1000 * Number(mc[1]);
            PLU.execActions("follow_play " + npcId + ";");
            YFUI.writeToOut("<span style='color:#FFF;'>▶开始尝试做游侠跟班!!</span>");
            setTimeout(function () {
              PLU.execActions("follow_play none", function () {
                YFUI.writeToOut("<span style='color:#FFF;'>◼停止做游侠跟班!!准备开杀!!</span>");
                PLU.killYouXia(npcId, tryNum + 1);
              });
            }, wtime);
            return;
          }
        } else if (errCode >= 88 && tryNum < 44) {
          setTimeout(function () {
            PLU.killYouXia(npcId, tryNum + 1);
          }, 1000);
          return;
        } else if (errCode == 1) {
          YFUI.writeToOut("<span style='color:#F99;'>--现场找不到游侠了!--</span>");
        } else {
          YFUI.writeToOut("<span style='color:#F99;'>--攻击游侠失败!--</span>");
        }
        PLU.execActions("home;");
      },
      onEnd: function onEnd() {
        PLU.execActions("prev_combat;home;");
      }
    });
  },
  //================================================================================================
  getSkillsList: function getSkillsList(callback) {
    UTIL.addSysListener("getSkillsList", function (b, type, subtype, msg) {
      if (type != "skills" && subtype != "list") return;
      UTIL.delSysListener("getSkillsList");
      clickButton("prev");
      var all = [],
        tupo = [];
      all = PLU.parseSkills(b);
      all.forEach(function (skill) {
        if (skill.state >= 4) {
          tupo.push(skill);
        }
      });
      callback(all, tupo);
    });
    clickButton("skills");
  },
  //================================================================================================
  parseSkills: function parseSkills(b) {
    var allSkills = [];
    for (var i = b.elements.length - 1; i > -1; i--) {
      if (b.elements[i].key && b.elements[i].key.match(/skill(\d+)/)) {
        var attr = b.elements[i].value.split(",");
        var skill = {
          key: attr[0],
          name: $.trim(UTIL.filterMsg(attr[1])),
          level: Number(attr[2]),
          kind: attr[4],
          prepare: Number(attr[5]),
          state: Number(attr[6]),
          from: attr[7]
        };
        allSkills.push(skill);
      }
    }
    allSkills = allSkills.sort(function (a, b) {
      if (a.kind == "known") return -1; else if (b.kind != "known" && a.from == "基础武功") return -1; else if (b.kind != "known" && b.from != "基础武功" && a.kind == "force") return -1; else return 1;
    });
    return allSkills;
  },
  //================================================================================================
  toToPo: function toToPo() {
    setTimeout(function () {
      if (UTIL.inHome()) {
        PLU.getSkillsList(function (allSkills, tupoSkills) {
          if (tupoSkills.length > 0) {
            if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
            PLU.STO.outSkillList = setTimeout(function () {
              PLU.STO.outSkillList = null;
              if (!!$("#out_top").height() && $("#out_top .outtitle").text() == "我的技能") clickButton("home");
            }, 200);
            return;
          }
          var tpArr = PLU.getCache("autoTP_keys").split(",");
          var tpList = [];
          tpArr.forEach(function (s) {
            var sk = {};
            var cs = s.match(/((\d)\|)?(.*)/);
            if (cs) {
              sk.name = cs[3];
              sk.sp = Number(cs[2]);
            } else {
              sk.name = s;
              sk.sp = 0;
            }
            var skobj = allSkills.find(function (e) {
              return e.name.match(sk.name);
            });
            if (skobj) tpList.push(Object.assign({}, skobj, sk));
          });
          PLU.TMP.stopToPo = false;
          PLU.toPo(tpList, 0);
        });
      }
    }, 500);
  },
  //================================================================================================
  toPo: function toPo(tpList, skIdx) {
    if (skIdx < tpList.length && !PLU.TMP.stopToPo) {
      var acts = "enable " + tpList[skIdx].key + ";tupo go," + tpList[skIdx].key + ";";
      if (tpList[skIdx].sp == 1) acts += "tupo_speedup4_1 " + tpList[skIdx].key + " go;"; else if (tpList[skIdx].sp == 2) acts += "tupo_speedup3_1 " + tpList[skIdx].key + " go;"; else if (tpList[skIdx].sp == 3) acts += "tupo_up " + tpList[skIdx].key + " go;"; else if (tpList[skIdx].sp == 4) acts += "items info obj_sanshengshi;event_1_66830905 " + tpList[skIdx].key + " go;";
      PLU.execActions(acts, function () {
        setTimeout(function () {
          if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
          PLU.STO.outSkillList = null;
          PLU.toPo(tpList, skIdx + 1);
        }, 300);
      });
    } else {
      YFUI.writeToOut("<span style='color:yellow;'> ==突破完毕!== </span>");
      clickButton("home");
    }
  },
  //================================================================================================
  toBangFour: function toBangFour(n) {
    UTIL.log({
      msg: " 进入帮四(" + n + ") ",
      type: "TIPS",
      time: new Date().getTime()
    });
    PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
    PLU.STO.bangFourTo = setTimeout(function () {
      clickButton("home");
    }, 30 * 60 * 1000);
    clickButton("clan fb enter shiyueweiqiang-" + n, 0);
  },
  toBangSix: function toBangSix() {
    UTIL.log({
      msg: " 进入帮六 ",
      type: "TIPS",
      time: new Date().getTime()
    });
    PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
    PLU.STO.bangSixTo = setTimeout(function () {
      clickButton("home");
    }, 30 * 60 * 1000);
    clickButton("clan fb enter manhuanqishenzhai", 0);
  },
  //================================================================================================
  inBangFiveEvent: function inBangFiveEvent() {
    PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
    var moving = false;
    PLU.TMP.listenBangFive = true;
    UTIL.addSysListener("listenBangFive", function (b, type, subtype, msg) {
      if (!moving && type == "jh" && (subtype == "dest_npc" || subtype == "info")) {
        moving = true;
        var roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
        if (roomName.match(/蒙古高原|成吉思汗的金帐/) && !UTIL.roomHasNpc()) {
          PLU.execActions(";;n;", function () {
            moving = false;
          });
        } else {
          moving = false;
        }
      }
      if (type == "home" && subtype == "index") {
        UTIL.delSysListener("listenBangFive");
        YFUI.writeToOut("<span style='color:white;'> ==帮五完毕!== </span>");
        PLU.execActions("golook_room;home");
      }
    });
  },
  intervene: function intervene($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      UTIL.delSysListener("intervene");
      UTIL.delSysListener("score");
      return;
    }
    var Fight = function Fight(b, num) {
      PLU.autoFight({
        targetKey: b.get("vs2_pos" + num),
        fightKind: "fight",
        onEnd: function onEnd() {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          PLU.setBtnRed($btn);
        },
        onFail: function onFail() {
          PLU.autoFight({
            targetKey: b.get("vs2_pos" + num),
            onEnd: function onEnd() {
              UTIL.delSysListener("intervene");
              UTIL.delSysListener("score");
              PLU.setBtnRed($btn);
            },
            onFail: function onFail() {
              if (num <= 7) {
                Fight(++num);
              } else {
                UTIL.delSysListener("intervene");
                UTIL.delSysListener("score");
              }
            }
          });
        }
      });
    };
    UTIL.addSysListener("intervene", function (b, type, subtype, msg) {
      if (type == "vs" && subtype == "vs_info") {
        UTIL.delSysListener("intervene");
        UTIL.delSysListener("score");
        Fight(b, 1);
      }
    });
    UTIL.addSysListener("score", function (b, type, subtype, msg) {
      if (type == "score" && subtype == "user") {
        if (b.get("long").indexOf("激烈争斗中...") == -1) {
          PLU.execActions("score " + b.get("id"));
          return;
        }
        UTIL.delSysListener("score");
        PLU.execActions("watch_vs " + b.get("id"));
      }
    });
    YFUI.showPop({
      title: "杀隐藏怪",
      text: "自动观战，自动加入战斗<br>确认后，点开要跟的玩家页面",
      onNo: function onNo() {
        UTIL.delSysListener("intervene");
        UTIL.delSysListener("score");
        PLU.setBtnRed($btn);
      }
    });
  },
  // 字符串相似度算法
  getSimilarity: function getSimilarity(str1, str2) {
    var sameNum = 0;
    for (var i = 0; i < str1.length; i++) for (var j = 0; j < str2.length; j++) if (str1[i] === str2[j]) {
      sameNum++;
      break;
    }
    var length = Math.max(str1.length, str2.length);
    return sameNum / length * 100 || 0;
  },
  npcDataUpdate: function npcDataUpdate() {
    var wayList = _toConsumableArray(new Set(PLU.YFD.mapsLib.Npc.map(function (e) {
      return e.way;
    })));
    if (PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1]) var i = wayList.indexOf(PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1].way); else var i = 0;
    PLU.UTIL.addSysListener("look_npc", function (b, type, subtype, msg) {
      var _PLU$YFD$cityId$roomI, _b$get;
      if (type != "look_npc") return;
      if (b.get("id").indexOf("bad_target_") == 0) return;
      if (b.get("id").indexOf("hero_") == 0) return;
      if (b.get("id").indexOf("eren_") == 0) return;
      if (b.get("id").indexOf("bukuai") == 0) return;
      if (PLU.YFD.qixiaList.includes(ansi_up.ansi_to_text(b.get("name")))) return;
      var roomInfo = g_obj_map.get("msg_room");
      var jh = (_PLU$YFD$cityId$roomI = PLU.YFD.cityId[roomInfo.get("map_id")]) !== null && _PLU$YFD$cityId$roomI !== void 0 ? _PLU$YFD$cityId$roomI : roomInfo.get("map_id");
      var curName = UTIL.filterMsg(roomInfo.get("short") || "");
      PLU.YFD.mapsLib.Npc_New.push({
        jh: jh,
        loc: curName,
        name_new: ansi_up.ansi_to_text(b.get("name")),
        id: b.get("id") || "",
        desc: ansi_up.ansi_to_text((_b$get = b.get("long")) === null || _b$get === void 0 ? void 0 : _b$get.split("\n")[1]),
        way: wayList[i]
      });
    });
    func = function (_func) {
      function func() {
        return _func.apply(this, arguments);
      }
      func.toString = function () {
        return _func.toString();
      };
      return func;
    }(function () {
      PLU.execActions(wayList[i], function () {
        var _iterator4 = _createForOfIteratorHelper(PLU.UTIL.getRoomAllNpc()),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var npc = _step4.value;
            PLU.execActions("look_npc " + npc.key);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        setTimeout(function () {
          i++;
          func();
        }, 1500);
      });
    });
    func();
  },
  //================================================================================================
  checkUseSkills: function checkUseSkills() {
    var curTime = new Date().getTime();
    if (!PLU.battleData.performTime || curTime - PLU.battleData.performTime >= 400) {
      PLU.battleData.performTime = curTime;
      if (!PLU.battleData.mySide) {
        var vsInfo = g_obj_map.get("msg_vs_info");
        for (var i = vsInfo.elements.length - 1; i > -1; i--) {
          var val = vsInfo.elements[i].value + "";
          if (!val || val.indexOf(PLU.accId) < 0) continue;
          PLU.battleData.myPos = vsInfo.elements[i].key.charAt(7);
          PLU.battleData.mySide = vsInfo.elements[i].key.substring(0, 3);
          break;
        }
      }
      if (PLU.getCache("pSetting_快速连招") == "true") {
        if (PLU.getCache("autoPerform") >= 1) {
          PLU.AutoCombat();
        }
      } else {
        if (PLU.battleData.mySide) {
          if (PLU.getCache("autoCure") == 1) {
            PLU.checkAutoCure();
          }
          if (PLU.getCache("autoPerform") >= 1) {
            PLU.checkAutoPerform();
          }
        }
      }
    }
  },
  //================================================================================================
  setAutoCure: function setAutoCure($btn, listenKey, stat) {
    if (listenKey == "autoCure") {
      //自动加血蓝
      YFUI.showInput({
        title: "自动加血加蓝",
        text: '格式：血百分比|加血技能,蓝百分比|加蓝技能，以英文逗号分割，每样只能设置一个技能。<br>\n                <span style="color:red;">例如：</span><br>\n                [例1] <span style="color:blue;">50|道种心魔经,10|不动明王诀</span><br> 血低于50%自动加血,蓝低于10%自动加蓝<br>\n                [例2] <span style="color:blue;">50|白首太玄经,30|紫血大法</span><br> 血低于50%自动加血,蓝低于30%自动加蓝<br>\n                [例3] <span style="color:blue;">30|紫血大法</span><br> 血低于30%自动加血技能,不自动加蓝<br>\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "50|道种心魔经,10|不动明王诀",
        onOk: function onOk(val) {
          var str = $.trim(val);
          PLU.setCache(listenKey + "_keys", str);
          PLU.splitCureSkills();
        },
        onNo: function onNo() { }
      });
    }
  },
  toggleAutoCure: function toggleAutoCure($btn, listenKey, stat) {
    var btnFlag = 0;
    if (stat != undefined) {
      btnFlag = PLU.setBtnRed($btn, stat);
      PLU.setCache(listenKey, stat);
    } else {
      btnFlag = PLU.setBtnRed($btn);
    }
    if (!btnFlag) {
      return PLU.setCache(listenKey, 0);
    } else {
      PLU.setCache(listenKey, 1);
      setTimeout(function () {
        YFUI.writeToOut("<span style='color:yellow;'>自动血蓝: " + PLU.getCache(listenKey + "_keys") + " </span>");
      }, 100);
    }
  },
  //================================================================================================
  splitCureSkills: function splitCureSkills() {
    var kf = (PLU.getCache("autoCure_keys") || "").split(",");
    PLU.TMP.autoCure_percent = "";
    PLU.TMP.autoCure_skills = "";
    PLU.TMP.autoCure_force_percent = "";
    PLU.TMP.autoCure_force_skills = "";
    if (kf.length > 0) {
      var acp = kf[0].split("|");
      PLU.TMP.autoCure_percent = Number(acp[0]) || 50;
      PLU.TMP.autoCure_skills = acp[1];
      if (kf.length > 1) {
        var acf = kf[1].split("|");
        PLU.TMP.autoCure_force_percent = Number(acf[0]) || 10;
        PLU.TMP.autoCure_force_skills = acf[1];
      }
    }
  },
  //================================================================================================
  checkAutoCure: function checkAutoCure() {
    var vsInfo = g_obj_map.get("msg_vs_info");
    var userInfo = g_obj_map.get("msg_attrs");
    var keePercent = (100 * Number(vsInfo.get(PLU.battleData.mySide + "_kee" + PLU.battleData.myPos)) / Number(userInfo.get("max_kee"))).toFixed(2);
    var forcePercent = (100 * Number(vsInfo.get(PLU.battleData.mySide + "_force" + PLU.battleData.myPos)) / Number(userInfo.get("max_force"))).toFixed(2);
    if (!PLU.TMP.autoCure_percent) {
      PLU.splitCureSkills();
    }
    if (PLU.TMP.autoCure_force_skills && Number(forcePercent) < PLU.TMP.autoCure_force_percent) {
      PLU.autoCureByKills(PLU.TMP.autoCure_force_skills, forcePercent);
    } else if (PLU.TMP.autoCure_skills && Number(keePercent) < PLU.TMP.autoCure_percent && PLU.battleData.cureTimes < 3) {
      PLU.autoCureByKills(PLU.TMP.autoCure_skills, forcePercent);
    }
  },
  //================================================================================================
  autoCureByKills: function autoCureByKills(skill, forcePercent) {
    if (PLU.battleData && PLU.battleData.xdz > 2) {
      var rg = new RegExp(skill);
      var useSkill = PLU.selectSkills(rg);
      if (useSkill) {
        clickButton(useSkill.key, 0);
        if (Number(forcePercent) > 1) PLU.battleData.cureTimes++;
      }
    }
  },
  //================================================================================================
  setAutoPerform: function setAutoPerform($btn, listenKey, stat) {
    if (listenKey == "autoPerform") {
      //自动技能
      var skillsList = [];
      try {
        skillsList = JSON.parse(PLU.getCache(listenKey + "_keysList"));
      } catch (error) {
        skillsList = ["6|千影百伤棍,燎原百破", "", "", "", "3|剑"];
      }
      YFUI.showInput({
        title: "自动技能",
        text: '格式：触发气值|技能词组，以英文逗号分割多个关键词。<br>\n                            <span style="color:red;">例如：</span><br>\n                            [例1] <span style="color:blue;">9|千影百伤棍,九天龙吟剑法,排云掌法</span><br> 气大于等于9时自动使用技能<br>\n                            ',
        value: skillsList,
        inputs: ["技能1", "技能2", "技能3", "技能4"],
        onOk: function onOk(val) {
          PLU.setCache(listenKey + "_keysList", JSON.stringify(val));
          if (PLU.getCache(listenKey)) {
            PLU.setPerformSkill(PLU.getCache(listenKey));
          }
        },
        onNo: function onNo() { }
      });
    }
  },
  toggleAutoPerform: function toggleAutoPerform($btn, listenKey, stat) {
    var curIdx = Number(PLU.getCache(listenKey));
    if (stat != undefined) {
      if (stat > 0) {
        PLU.setBtnRed($btn, 1);
        PLU.setPerformSkill(stat);
      } else PLU.setBtnRed($btn, 0);
      $btn.text(["连招", "技一", "技二", "技三", "技四"][stat]);
      PLU.setCache(listenKey, stat);
      if (stat > 0) PLU.TMP.lastAutoPerformSet = stat;
    } else {
      var nowTime = Date.now();
      if (curIdx == 0 && nowTime - (PLU.TMP.lastClickAutoPerform || 0) < 350) {
        curIdx = PLU.TMP.lastAutoPerformSet || 1;
        curIdx++;
        if (curIdx > 4) curIdx = 1;
      } else {
        curIdx = curIdx == 0 ? PLU.TMP.lastAutoPerformSet || 1 : 0;
      }
      PLU.TMP.lastClickAutoPerform = nowTime;
      if (curIdx > 0) PLU.TMP.lastAutoPerformSet = curIdx;
      PLU.setCache(listenKey, curIdx);
      if (curIdx == 0) {
        PLU.setBtnRed($btn, 0);
        $btn.text("连招");
      } else {
        PLU.setBtnRed($btn, 1);
        $btn.text(["连招", "技一", "技二", "技三", "技四"][curIdx]);
        PLU.setPerformSkill(curIdx);
      }
    }
  },
  setPerformSkill: function setPerformSkill(idx) {
    var skillsList = [];
    idx = idx - 1;
    try {
      skillsList = JSON.parse(PLU.getCache("autoPerform_keysList"));
    } catch (error) {
      skillsList = [];
    }
    var str = skillsList[idx] || "";
    var aps = str.split("|");
    if (aps && aps.length == 2) {
      PLU.TMP.autoPerform_xdz = Number(aps[0]);
      PLU.TMP.autoPerform_skills = aps[1].split(",");
    } else {
      PLU.TMP.autoPerform_xdz = 0;
      PLU.TMP.autoPerform_skills = [];
    }
    setTimeout(function () {
      var setCh = ["一", "二", "三", "四"][idx];
      YFUI.writeToOut("<span style='color:yellow;'>自动技能[" + setCh + "] : " + str + " </span><br><span style='color:white;'>** 双击自动技能按钮切换技能设置 **</span>");
    }, 100);
  },
  //================================================================================================
  AutoCombat() {
    // if(PLU.battleData.autoSkill) return;
    if (!PLU.TMP.autoPerform_xdz) return;
    // if(!PLU.TMP.autoPerform_xdz){
    //     let aps = PLU.getCache("autoPerform_keys").split('|')
    //     PLU.TMP.autoPerform_xdz = Number(aps[0])
    //     PLU.TMP.autoPerform_skills = aps[1].split(',')
    //}
    let skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
    let skillArr = PLU.TMP.autoPerform_skills;
    // 回血
    if (PLU.getCache("autoCure") == 1) {
      let vsInfo = g_obj_map.get("msg_vs_info");
      let userInfo = g_obj_map.get("msg_attrs");
      let keePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_kee" + PLU.battleData.myPos))) / Number(userInfo.get("max_kee"))).toFixed(2);
      let forcePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_force" + PLU.battleData.myPos))) / Number(userInfo.get("max_force"))).toFixed(2);
      if (!PLU.TMP.autoCure_percent) {
        PLU.splitCureSkills();
      }
      if (PLU.TMP.autoCure_force_skills && Number(forcePercent) < PLU.TMP.autoCure_force_percent) {
        PLU.autoCureByKills(PLU.TMP.autoCure_force_skills, forcePercent);
      } else if (PLU.TMP.autoCure_skills && Number(keePercent) < PLU.TMP.autoCure_percent && PLU.battleData.cureTimes < 3) {
        PLU.autoCureByKills(PLU.TMP.autoCure_skills, forcePercent);
      }
    }
    PLU.battleData.xdz = gSocketMsg.get_xdz();
    if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
      //console.log('自动技能：' + skillArr + '\n当前行动值: ' + PLU.battleData.xdz);
      $.each(skillArr, function (index, val) {
        var skillName = val;

        for (var i = 0; i < skillIdA.length; i++) {
          var btnNum = skillIdA[i];
          var btn = $('#skill_' + btnNum);
          var btnName = btn.text();

          if (btnName.indexOf(skillName) > -1 ) {
            btn.find('button').trigger('click');
            break;
          }
        }
      });
    }
    
    

    // if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
      // if (PLU.TMP.autoPerform_skills && PLU.TMP.autoPerform_skills.length > 0) {
        // PLU.TMP.autoPerform_skills.forEach((skn, idx) => {
          // let useSkill = PLU.selectSkills(skn);
          // if (useSkill) {
            // setTimeout((e) => {
              // clickButton(useSkill.key, 0);
            // }, idx * 100);
          // }
        // });
      // }
    // }
  },
  //================================================================================================
  checkAutoPerform: function checkAutoPerform() {
    // if(PLU.battleData.autoSkill) return;
    if (!PLU.TMP.autoPerform_xdz) return;
    // if(!PLU.TMP.autoPerform_xdz){
    //     let aps = PLU.getCache("autoPerform_keys").split('|')
    //     PLU.TMP.autoPerform_xdz = Number(aps[0])
    //     PLU.TMP.autoPerform_skills = aps[1].split(',')
    // }
    if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
      if (PLU.TMP.autoPerform_skills && PLU.TMP.autoPerform_skills.length > 0) {
        PLU.TMP.autoPerform_skills.forEach(function (skn, idx) {
          var useSkill = PLU.selectSkills(skn);
          if (useSkill) {
            setTimeout(function (e) {
              clickButton(useSkill.key, 0);
            }, idx * 100);
          }
        });
      }
    }
  },
  //================================================================================================
  setFightSets: function setFightSets($btn, listenKey, stat) {
    if (listenKey == "followKill") {
      //开跟杀
      YFUI.showInput({
        title: "开跟杀",
        text: '格式：跟杀的人名词组，以英文逗号分割多个关键词，人名前带*为反跟杀。<br>\n                            <span style="color:red;">例如：</span><br>\n                            [例1] <span style="color:blue;">步惊鸿,*醉汉</span><br> 步惊鸿攻击(杀or比试)谁我攻击谁；谁攻击醉汉我攻击谁<br>\n                            ',
        value: PLU.getCache(listenKey + "_keys") || "☆,★,人",
        //type:"textarea",
        onOk: function onOk(val) {
          var str = $.trim(val);
          PLU.setCache(listenKey + "_keys", str);
          PLU.splitFollowKillKeys();
        },
        onNo: function onNo() { }
      });
    }
  },
  toggleFollowKill: function toggleFollowKill($btn, listenKey, stat) {
    var btnFlag = 0;
    if (stat != undefined) {
      btnFlag = PLU.setBtnRed($btn, stat);
      PLU.setCache(listenKey, stat);
    } else {
      btnFlag = PLU.setBtnRed($btn);
    }
    if (!btnFlag) {
      return PLU.setCache(listenKey, 0);
    } else {
      PLU.splitFollowKillKeys();
      PLU.setCache(listenKey, 1);
      setTimeout(function () {
        YFUI.writeToOut("<span style='color:yellow;'>自动跟杀: " + PLU.getCache(listenKey + "_keys") + " </span>");
      }, 100);
    }
  },
  //================================================================================================
  splitFollowKillKeys: function splitFollowKillKeys() {
    var keystr = PLU.getCache("followKill_keys") || "";
    var keys = keystr.split(/[,，]/);
    PLU.FLK = {
      followList: [],
      defendList: []
    };
    keys.forEach(function (e) {
      if (!e) return;
      if (e.charAt(0) == "*") {
        PLU.FLK.defendList.push(e.substring(1));
      } else {
        PLU.FLK.followList.push(e);
      }
    });
  },
  //================================================================================================
  toCheckFollowKill: function toCheckFollowKill(attacker, defender, fightType, msgText) {
    if (!PLU.FLK) PLU.splitFollowKillKeys();
    for (var i = 0; i < PLU.FLK.followList.length; i++) {
      var flname = PLU.FLK.followList[i];
      if (attacker.match(flname)) {
        PLU.autoFight({
          targetName: defender,
          fightKind: fightType,
          onFail: function onFail() { },
          onEnd: function onEnd() { }
        });
        return;
      }
    }
    for (var _i = 0; _i < PLU.FLK.defendList.length; _i++) {
      var dfname = PLU.FLK.defendList[_i];
      if (defender.match(dfname)) {
        PLU.autoFight({
          targetName: attacker,
          fightKind: fightType,
          onFail: function onFail() { },
          onEnd: function onEnd() { }
        });
        return;
      }
    }
  },
  //================================================================================================
  startSync: function startSync($btn) {
    PLU.getTeamInfo(function (t) {
      if (!t) PLU.setBtnRed($btn); else {
        YFUI.writeToOut("<span style='color:yellow;'>===队伍同步开始" + (t.is_leader ? ", <b style='color:#F00;'>我是队长</b>" : "") + " ===</span>");
        if (t.is_leader) {
          PLU.TMP.leaderTeamSync = true;
        } else {
          PLU.listenTeamSync(t.leaderId);
        }
      }
    });
  },
  toggleTeamSync: function toggleTeamSync($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (btnFlag) {
      if (PLU.TMP.firstSync) PLU.startSync($btn); else {
        YFUI.showPop({
          title: "队伍同步",
          text: "<b style='color:#F00;'>入队后再打开队伍同步!!</b><br>队长发布指令, 队员监听同步指令!",
          okText: "同步",
          onOk: function onOk(e) {
            PLU.TMP.firstSync = 1;
            PLU.startSync($btn);
          },
          onNo: function onNo() {
            PLU.setBtnRed($btn);
          },
          onX: function onX() {
            PLU.setBtnRed($btn);
          }
        });
      }
    } else {
      PLU.TMP.leaderTeamSync = false;
      UTIL.delSysListener("syncTeamChannel");
    }
  },
  //================================================================================================
  commandTeam: function commandTeam(args) {
    if (!PLU.TMP.leaderTeamSync) return;
    if (!g_gmain.is_fighting && !args[0].match(/team chat|send_chat|attr|watch\_vs/)) {
      var cmdStr = args[0].replace(/\s/g, "$");
      clickButton("team chat synCmd=" + cmdStr);
      clickButton("send_chat", 0);
    }
  },
  //================================================================================================
  listenTeamSync: function listenTeamSync(leaderId) {
    UTIL.addSysListener("syncTeamChannel", function (b, type, subtype, msg) {
      if (type != "main_msg" || !msg.match(/\003href;0;team\003【队伍】\0030\003/)) return;
      var l = msg.match(/\003href;0;team\003【队伍】.*href;0;score ([\w\(\)]+)\003(.*)\0030\003：(.*)/);
      if (l && l[1] == leaderId) {
        var synCmd = l[3].replace("synCmd=", "").replace("。", ".").replace(/\$/g, " ");
        clickButton(synCmd);
      }
    });
  },
  //================================================================================================
  getTeamInfo: function getTeamInfo(callback) {
    UTIL.addSysListener("checkTeam", function (b, type, subtype, msg) {
      if (type != "team" && subtype != "info") return;
      UTIL.delSysListener("checkTeam");
      if (b.get("team_id")) {
        if (b.get("is_member_of") == "1") {
          callback && callback({
            is_leader: parseInt(b.get("is_leader")),
            leaderId: b.get("member1").split(",")[0]
          });
        } else {
          callback && callback(0);
        }
      } else {
        callback && callback(0);
      }
      clickButton("prev");
    });
    clickButton("team");
  },
  //================================================================================================
  setSkillGroup: function setSkillGroup(idx) {
    if (g_gmain.is_fighting) return;
    $(".menu").hide();
    var lsgTimeOut = setTimeout(function () {
      UTIL.delSysListener("loadSkillGroup");
    }, 5000);
    UTIL.addSysListener("loadSkillGroup", function (b, type, subtype, msg) {
      if (type != "enable" && subtype !== "list") return;
      UTIL.delSysListener("loadSkillGroup");
      clearTimeout(lsgTimeOut);
      clickButton("prev");
    });
    clickButton("enable mapped_skills restore go " + idx);
  },
  //================================================================================================
  setWearEquip: function setWearEquip(idx) {
    if (g_gmain.is_fighting) return;
    $(".menu").hide();
    var equipKey = "equip_" + idx + "_keys";
    YFUI.showInput({
      title: "装备组-" + idx,
      text: '格式：武器装备词组，以英文逗号分割多个关键词，<br>\n                        <span style="color:#D60;">武器名前必须带上*，入脉武器名前带**。<br>\n                        卸下武器名前带上#。</span><br>\n                        <span style="color:red;">例如：</span><br>\n                        [例1] <span style="color:blue;">#风泉之剑,*离别钩,*倾宇破穹棍,**驭风腾云,霸天圣袍,紫贪狼戒</span><br>\n                        [例2] <span style="color:blue;">*风泉之剑,**雨叶魔枪,木棉袈裟,龙渊扳指,大士无双帽,天玑九玄冠,博睿扳指,崆峒不老戒,杨柳怨羌笛,*妙韵梨花萧</span><br>\n                        ',
      value: PLU.getCache(equipKey) || "",
      type: "textarea",
      onOk: function onOk(val) {
        var str = $.trim(val);
        if (!str) return;
        PLU.setCache(equipKey, str);
        PLU.wearEquip(str);
      },
      onNo: function onNo() { }
    });
  },
  wearEquip: function wearEquip(equipsStr) {
    PLU.getAllItems(function (list) {
      var equips = equipsStr.split(","),
        equipCmds = "";
      var equipArr = equips.forEach(function (e) {
        var eqObj = {};
        if (e.substr(0, 1) == "#") {
          eqObj = {
            type: -1,
            name: e.substr(1)
          };
        } else if (e.substr(0, 2) == "**") {
          eqObj = {
            type: 2,
            name: e.substr(2)
          };
        } else if (e.substr(0, 1) == "*") {
          eqObj = {
            type: 1,
            name: e.substr(1)
          };
        } else {
          eqObj = {
            type: 0,
            name: e
          };
        }
        var bagItem = list.find(function (it) {
          return !!it.name.match(eqObj.name);
        });
        if (bagItem) {
          if (eqObj.type == -1) equipCmds += "unwield " + bagItem.key + ";"; else if (eqObj.type == 2) equipCmds += "wield " + bagItem.key + " rumai;"; else if (eqObj.type == 1) equipCmds += "wield " + bagItem.key + ";"; else equipCmds += "wear " + bagItem.key + ";";
        }
      });
      PLU.execActions(equipCmds, function () {
        YFUI.writeToOut("<span style='color:yellow;'> ==装备完毕!== </span>");
        if (g_gmain.is_fighting) gSocketMsg.go_combat();
      });
    });
  },
  //================================================================================================
  showLog: function showLog() {
    if ($("#myTools_InfoPanel").length > 0) return $("#myTools_InfoPanel").remove();
    var $logPanel = YFUI.showInfoPanel({
      text: "",
      onOpen: function onOpen() {
        $("#myTools_InfoPanel .infoPanel-wrap").html(PLU.logHtml);
        $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
      },
      onNo: function onNo() {
        PLU.logHtml = "";
        UTIL.logHistory = [];
        UTIL.setMem("HISTORY", JSON.stringify(this.logHistory));
        $("#myTools_InfoPanel .infoPanel-wrap").empty();
      },
      onClose: function onClose() { }
    });
  },
  //================================================================================================
  updateShowLog: function updateShowLog(e) {
    var html = '<div style="'.concat(e.ext.style, '">').concat(UTIL.getNow(e.ext.time), " ").concat(e.ext.msg, "</div>");
    PLU.logHtml += html;
    if ($("#myTools_InfoPanel").length < 1) return;
    $("#myTools_InfoPanel .infoPanel-wrap").append(html);
    $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
  },
  //================================================================================================
  goHJS: function goHJS(where, npc) {
    var roomInfo = g_obj_map.get("msg_room");
    var curName = UTIL.filterMsg(roomInfo.get("short") || "");
    var act = "";
    if (curName == "青苔石阶" && roomInfo.get("northwest") == "青苔石阶") act = "nw"; else if (curName == "青苔石阶" && roomInfo.get("northeast") == "青苔石阶") act = "ne"; else if (curName == "青苔石阶" && roomInfo.get("southwest") == "青苔石阶") act = "sw"; else if (curName == "榆叶林" && roomInfo.get("north") == "榆叶林") act = "n"; else if (curName == "榆叶林" && roomInfo.get("south") == "榆叶林") act = "s"; else if (curName == "世外桃源" && where == "镜星府") act = "nw"; else if (curName == "世外桃源" && where == "荣威镖局") act = "ne"; else if (curName == "世外桃源" && where == "碧落城") act = "s";
    if (act) PLU.execActions(act, function () {
      var npcObj = roomInfo.get("npc1");
      if (npcObj) {
        var npcName = npcObj.split(",")[1];
      }
      if (npc && (npcName && npcName != npc || !npcObj)) PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", function () {
        PLU.goHJS(where, npc);
      }); else PLU.goHJS(where, npc);
    });
  },
  //================================================================================================
  goHaRi: function goHaRi(callback) {//西夏哈日
    var roomInfo = g_obj_map.get("msg_room")  || new Map();
    var curName = UTIL.filterMsg(roomInfo.get("short") || "");
    var act = "";
    if (curName == "沙漠迷宫") {
      if (roomInfo.get("east") == "沙漠迷宫") act = "e"; else if (roomInfo.get("north") == "沙漠迷宫") act = "n"; else if (roomInfo.get("west") == "沙漠迷宫") act = "w"; else if (roomInfo.get("south") == "沙漠迷宫") act = "s";
      if (act) PLU.execActions(act, function () {
        setTimeout(function () {
          PLU.goHaRi(callback);
        }, 250);
      });
    } else if (curName == "荒漠") {
      PLU.execActions("n;n;nw;n;ne;", function () {
        YFUI.writeToOut("<span style='color:#FFF;'>--到达--</span>");
        PLU.autoFight({
          targetCommand: "event_1_28045408",
          onEnd: function onEnd() {
            PLU.execActions("say 自己看", function () {
              YFUI.writeToOut("<span style='color:#FFF;'>--击杀哈日--</span>");
              callback && callback();
            });
        }
      });
    });
    } else {
      PLU.execActions("rank go 311;s;s;sw;se;se;se;e;se;se;ne;", function () {
        setTimeout(function () {
          PLU.goHaRi(callback);
        }, 250);
      });
    }
  },
  //================================================================================================
  queryJHMenu: function queryJHMenu($btn, jhname) {
    var npcList = PLU.YFD.mapsLib.Npc.filter(function (e) {
      return e.jh == jhname;
    });
    npcList.forEach(function (e) {
      var str = [e.jh, e.loc, e.name].filter(function (s) {
        return !!s;
      }).join("-");
      YFUI.writeToOut("<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" + str + '","' + e.way + "\")'>" + str + "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" + str + '","' + e.way + "\")'>路徑詳情</a></span>");
    });
    YFUI.writeToOut("<span>----------</span>");
  },
  //================================================================================================
  toQueryNpc: function toQueryNpc() {
    YFUI.showInput({
      title: "查找NPC",
      text: "输入NPC名字，可模糊匹配，支持<a target='_blank' href='https://www.runoob.com/regexp/regexp-syntax.html'>正则表达式</a>，同时支持简体（不包括地址名）和繁体<br>" + "正则表达式之外语法例子：<br>" + "[例1] 开封@毒蛇<br>" + "[例2] 星宿海@百龙山@毒蛇" + "[例3] ^.?(男|女)[孩童]",
      value: PLU.getCache("prevSearchStr") || "^.?(男|女)[孩童]",
      onOk: function onOk(val) {
        if (!$.trim(val)) return;
        var str = $.trim(val);
        PLU.setCache("prevSearchStr", str);
        PLU.queryNpc(str + "道");
      },
      onNo: function onNo() { }
    });
  },
  // 查询房间路径
  queryRoomPath: function queryRoomPath() {
    var _g_obj_map2;
    if (UTIL.inHome()) return;
    var jh = PLU.YFD.cityId[(_g_obj_map2 = g_obj_map) === null || _g_obj_map2 === void 0 || (_g_obj_map2 = _g_obj_map2.get("msg_room")) === null || _g_obj_map2 === void 0 ? void 0 : _g_obj_map2.get("map_id")];
    if (jh) {
      var _g_obj_map3, _PLU$queryNpc$;
      var room = ansi_up.ansi_to_text((_g_obj_map3 = g_obj_map) === null || _g_obj_map3 === void 0 || (_g_obj_map3 = _g_obj_map3.get("msg_room")) === null || _g_obj_map3 === void 0 ? void 0 : _g_obj_map3.get("short"));
      return (_PLU$queryNpc$ = PLU.queryNpc(jh + "@" + room + "@.*道", true)[0]) === null || _PLU$queryNpc$ === void 0 ? void 0 : _PLU$queryNpc$.way;
    }
  },
  // 链接两个路径终点
  linkPath: function linkPath(pathA, pathB) {
    if (!pathA) return pathB;
    var arrayA = pathA.split(";");
    var arrayB = pathB.split(";");
    var len = Math.min(arrayA.length, arrayB.length);
    for (var index = 0; index < len; index++) if (arrayA[index] != arrayB[index]) break;
    if (!index) return pathB;
    return arrayA.slice(index).reverse().map(function (e) {
      var cmd = e.match(/^(#\d+ )?([ns]?[we]?)$/);
      if (cmd) {
        if (!cmd[1]) cmd[1] = "";
        if (cmd[2].indexOf("n") == 0) {
          var way = cmd[2].replace("n", "s");
        } else {
          var way = cmd[2].replace("s", "n");
        }
        if (way.indexOf("w") >= 0) {
          way = way.replace("w", "e");
        } else {
          way = way.replace("e", "w");
        }
        return cmd[1] + way;
      }
      // 迷宫反走
      cmd = e.match(/^(.+):(.+)\^(.+)$/);
      if (cmd) return cmd[1] + ":" + cmd[3] + "^" + cmd[2];
      return e;
    }).concat(arrayB.slice(index)).join(";");
  },
  // 最短路径
  minPath: function minPath(pathA, pathB) {
    var linkPath = PLU.linkPath(pathA, pathB);
    if (linkPath == "" || linkPath == pathB) return linkPath;
    var a = linkPath.split(";");
    var len = a.length;
    for (var index = 0; index < len; index++) {
      var cmd = a[index].match(/^(.+):(.+\^.+)$/);
      if (cmd) a[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
    }
    a = a.join(";").split(";");
    var b = pathB.split(";");
    len = b.length;
    for (var index = 0; index < len; index++) {
      var _cmd = b[index].match(/^(.+):(.+\^.+)$/);
      if (_cmd) b[index] = PLU.YFD.mapsLib.Labyrinth[_cmd[1]][_cmd[2]];
    }
    b = b.join(";").split(";");
    return a.length <= b.length ? linkPath : pathB;
  },
  //================================================================================================
  formatNpcData: function formatNpcData(text) {
    var npc = text.match(/^(.*)@(.*)@(.*)道$/);
    if (npc) {
      var jh = npc[1];
      var loc = npc[2];
      var name = "^" + npc[3] + "$";
    } else {
      npc = text.match(/^([^*-]*)[@*-](.*)道$/);
      if (npc) {
        if (npc[1] == "茶圣" || npc[1] == "青衣剑士") {
          var name = "^" + npc[1] + "-" + npc[2] + "$";
        } else {
          var jh = npc[1];
          var name = "^" + npc[2] + "$";
        }
      } else {
        npc = text.match(/^(.*)道$/);
        if (npc) {
          var name = npc[1];
        } else {
          var name = text;
        }
      }
    }
    return [jh, loc, name];
  },
  queryNpc: function queryNpc(name, quiet) {
    if (!name) return;
    var _PLU$formatNpcData = PLU.formatNpcData(name),
      _PLU$formatNpcData2 = _slicedToArray(_PLU$formatNpcData, 3),
      jh = _PLU$formatNpcData2[0],
      loc = _PLU$formatNpcData2[1],
      tmpName = _PLU$formatNpcData2[2];
    name = tmpName;
    var npcLib = PLU.YFD.mapsLib.Npc;
    var findList = npcLib.filter(function (e) {
      if (e.jh == jh && e.loc == loc && (e.name.match(name) || e.name_tw && e.name_tw.match(name) || e.name_new && e.name_new.match(name))) return true;
      return false;
    });
    if (findList.length == 0) findList = npcLib.filter(function (e) {
      if ((e.jh == jh || !jh) && (e.name.match(name) || e.name_tw && e.name_tw.match(name) || e.name_new && e.name_new.match(name))) return true;
      return false;
    });
    if (findList.length == 0) findList = npcLib.filter(function (e) {
      if (e.name.match(name) || e.name_tw && e.name_tw.match(name) || e.name_new && e.name_new.match(name)) return true;
      return false;
    });
    var res = [];
    if (findList && findList.length > 0) {
      findList.forEach(function (e) {
        var str = [e.jh, e.loc, _(e.name, e.name_tw)].filter(function (s) {
          return !!s;
        }).join("-");
        if (!quiet) YFUI.writeToOut("<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" + str + '","' + e.way + "\")'>" + str + "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" + str + '","' + e.way + "\")'>路径详情</a></span>");
        res.push(e);
      });
      if (!quiet) YFUI.writeToOut("<span>----------</span>");
    } else if (!quiet) {
      YFUI.writeToOut("<span style='color:#F66;'>查询不到相关数据</span>");
    }
    return res;
  },
  //================================================================================================
  toPathNpc: function toPathNpc() {
    var defaultMapId = PLU.getCache("pathFindMap") || "1";
    var citys = PLU.YFD.cityList.map(function (c, i) {
      var issel = i + 1 == defaultMapId ? "selected" : "";
      return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
    }).join("");
    YFUI.showPop({
      title: "全图找NPC",
      text: '选择地图, 输入NPC名字，可模糊匹配<br>\n                <div style=\'margin:10px 0;\'>\n                    <span>地图: </span>\n                    <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">\n                        '.concat(citys, '\n                    </select>\n                </div>\n                <div style=\'margin:10px 0;\'>\n                    <span>名字: </span>\n                    <input id="pathFindNpc" value="').concat(PLU.getCache("pathFindNpc") || "小龙人", '" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>\n                </div>'),
      onOk: function onOk() {
        var mapStr = $.trim($("#pathFindMap").val()),
          npcStr = $.trim($("#pathFindNpc").val());
        if (!npcStr) return;
        PLU.setCache("pathFindMap", mapStr);
        PLU.setCache("pathFindNpc", npcStr);
        var jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
        if (!jhMap) {
          return YFUI.writeToOut("<span style='color:#F66;'>---无地图数据---</span>");
        } else {
          var ways = jhMap.way.split(";");
          console.log({
            paths: ways,
            idx: 0,
            objectNPC: npcStr
          });
          PLU.goPathFindNpc({
            paths: ways,
            idx: 0,
            objectNPC: npcStr
          });
        }
      },
      onNo: function onNo() { }
    });
  },
  goPathFindNpc: function goPathFindNpc(params) {
    //goFindYouxia
    if (params.idx >= params.paths.length) {
      if (params.count) {
        params.idx = 0;
        setTimeout(function () {
          PLU.goPathFindNpc(params);
        }, 500);
      } else {
        setTimeout(function () {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到目标NPC!...已搜索完地图--</span>");
        return;
      }
    }
    var acs = [params.paths[params.idx]];
    PLU.actions({
      paths: acs,
      idx: 0,
      onPathsEnd: function onPathsEnd() {
        setTimeout(function () {
          var npcObj = UTIL.findRoomNpcReg(params.objectNPC);
          if (npcObj) {
            YFUI.writeToOut("<span style='color:#FFF;'>--目标NPC已找到--</span>");
            if (params.count) PLU.autoFight({
              targetKey: npcObj.key,
              autoSkill: "multi",
              onEnd: function onEnd() {
                params.count--;
                params.idx++;
                PLU.goPathFindNpc(params);
              },
              onFail: function onFail(code) {
                if (code == 4) {
                  params.callback && params.callback();
                } else if (code == 6) {
                  params.idx++;
                  PLU.goPathFindNpc(params);
                } else if (code == 0) YFUI.writeToOut("<span style='color:#FFF;'>--你太菜了，放弃吧--</span>");
              }
            });
          } else {
            params.idx++;
            PLU.goPathFindNpc(params);
          }
        }, 100);
      },
      onPathsFail: function onPathsFail(msg) {
        if (params.count) {
          params.idx = params.paths.indexOf(params.paths.find(function (e, i) {
            return i >= params.idx && e.startsWith("jh");
          }));
          if (params.idx < 0) params.idx = 0;
          setTimeout(function () {
            PLU.goPathFindNpc(params);
          }, 500);
        } else {
          setTimeout(function () {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到目标NPC!...路径中断--</span>");
        }
        return;
      }
    });
  },

  killXLR: function killXLR($btn) {
    let btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      PLU.TMP.findDragon = false;
      return;
    }
    $btn.css("background-color", "blue");
    var stopFlag = false;
      YFUI.showInput({
        title: "刷小龙人",
        text: "请输入章节[例1] 1,3-5<br>[例2] 1-15",
        value: PLU.getCache("XLRpath") || "1-15",
        onOk: function onOk(val) {
          PLU.setCache("XLRpath", val);
          var ways = val.split(",").map(function (v) {
            var _PLU$YFD$mapsLib$Map;
            if (String(v).indexOf("-") > 0) {
              var m = v.split("-");
              var start = parseInt(m[0]) - 1;
              var end = parseInt(m[1]);
              var paths = [];
              for (var i = start; i < end; i++) {
                var path = PLU.YFD.mapsLib.Map[i % PLU.YFD.mapsLib.Map.length].way;
                paths.push(path);
              }
              return paths.join(";");
            } else {
              return (_PLU$YFD$mapsLib$Map = PLU.YFD.mapsLib.Map[parseInt(v) - 1]) === null || _PLU$YFD$mapsLib$Map === void 0 ? void 0 : _PLU$YFD$mapsLib$Map.way;
            }
          }).join(";").split(";");
          UTIL.addSysListener("meigui", function (b, type, subtype, msg) {
            if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "玫瑰花" || type == "notice" && subtype == "notify_fail" && msg.indexOf("你的背包里没有这个物品") == 0) {
              UTIL.delSysListener("meigui");
              var meigui = parseInt(b.get("amount")) || 0;
              if (meigui < 140) {
                PLU.execActions("#".concat(Math.ceil((140 - meigui) / 10), " shop buy shop28_N_10"));
              }
              PLU.goPathFindNpc({
                paths: ways,
                idx: 0,
                objectNPC: "小龙人",
                count: 11,
                callback: function callback() {
                  stopFlag = true;
                  YFUI.writeToOut("<span style='color:yellow;'>=====完成挑战小龙人=====</span>");
                  PLU.execActions("home");
                }
              });
            }
          });
          setTimeout(function (){
            PLU.execActions("items get_store /obj/shop/meiguihua;items info meigui hua;")
          }, 250);
        },
        onNo() {
          stopFlag = true;
          PLU.setBtnRed($btn, 0);
        },
      });
    },
  
  //================================================================================================
  toFindDragon($btn) {
    let btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      //YFUI.writeToOut("<span style='color:#FFF;'>-------Stop Find Dragon-------</span>")
      PLU.TMP.findDragon = false;
      return;
    } else {
      let htm = `<div style='margin:0 0 10px 0;'>
                  <span>起始地图: </span>
                  <div style="font-size:12px;display:flex;flex-direction:row;flex-wrap: wrap;justify-content: flex-start;width: 100%;align-content: flex-start;line-height:2;margin-bottom:10px;" >
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="1" checked>1雪亭镇</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="2">2洛阳</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="3">3华山村</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="4">4华山</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="5">5扬州</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="6">6丐帮</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="7">7乔阴县</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="8">8峨眉山</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="9">9恒山</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="10">10武当山</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="11">11晚月庄</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="12">12水烟阁</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="13">13少林寺</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="14">14唐门</label>
                      <label style="width:20%"><input type="radio" name="findDragon_start" value="15">15青城山</label>
                  </div>
                  <span>搜图顺序: </span>
                  <select id="findDragon_SearchOrder" style="font-size:16px;height:30px;width:30%;">
                      <option selected value="1">顺序</option>
                      <option value="-1">倒序</option>
                  </select>
              </div>`;
      YFUI.showPop({
        title: "找小龙人",
        text: htm,
        width: "400px",
        okText: "开始",
        onOk(e) {
          setTimeout(function () {
            PLU.execActions("items get_store /obj/shop/meiguihua;items info meigui hua;");
            UTIL.addSysListener("meigui", function (b, type, subtype, msg) {
            if ((type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "玫瑰花") || (type == "notice" && subtype == "notify_fail" && msg.indexOf("你的背包里没有这个物品") == 0)) {
              UTIL.delSysListener("meigui");
              var meigui = parseInt(b.get("amount")) || 0;
              if (meigui < 140) {
                PLU.execActions("#".concat(Math.ceil((140 - meigui) / 10), " shop buy shop28_N_10"));
              }
            }
          });
        }, 240);
          let start = $(e.find('input[name="findDragon_start"]:checked')).val();
          let order = Number($('#findDragon_SearchOrder').val());
          //YFUI.writeToOut("<span style='color:#FFF;'>-------Find Dragon-------</span>")
          YFUI.writeToOut(`<span style='color:#FFF;'>--start jh ${start}   --search order:${order}</span>`);
          PLU.findDragonMaps(Number(start), Number(order));
        },
        onNo() {
          PLU.setBtnRed($btn);
        }
      });
    }
  },

async findDragonMaps(startCity, order){
    PLU.TMP.findDragon = true
    let curCity = startCity,
        endCity = startCity-order
    endCity = endCity<1 ? 15 : endCity>15 ? 1 : endCity
    let isExceedChallenge = false; // Added variable to track if the challenge limit is exceeded
    do {
        let jhMap = YFD.mapsLib.Map.find(e=>e.jh==curCity)
        if(jhMap){
            YFUI.writeToOut("<span style='color:#FFF;'>--开始搜索地图 jh "+curCity+"--</span>");
            let paths = jhMap.way.split(";")
            let npcName = '小龙人'
            let res = await PLU.mapFindNpc(paths, npcName)
            if(res=='end'){
                YFUI.writeToOut("<span style='color:#FFF;'>--任务完成--</span>");
                //YFUI.writeToOut("<span style='color:yellow;'>=====完成小龙人=====<span>");
                break
            }else{
                curCity = curCity+order
                curCity = curCity<1 ? 15 : curCity>15 ? 1 : curCity
            }
        }
    } while (curCity!=endCity && PLU.TMP.findDragon);
    if (!isExceedChallenge) { // Added condition to check if the challenge limit is exceeded
        YFUI.writeToOut("<span style='color:yellow;'>=====完成小龙人=====<span>");
    }
    //YFUI.writeToOut("<span style='color:#FFF;'>--搜索完成--</span>")
    PLU.execActions("home")
    PLU.setBtnRed($("#btn_bt_kg_finddragon"),0)
},
async mapFindNpc(paths,NPCName){
    return new Promise(async (resolve,reject)=>{
        let idx = 0, preIdx = -1, res=''
        while (idx < paths.length) {
            try {
                if(preIdx!=idx) await PLU.stepPath(paths[idx])
            } catch (error) {
                resolve('noway')
                break
            }
            preIdx = idx
            let fnpc = UTIL.findRoomNpc(NPCName,false,true)
            if(fnpc){
                try {
                    let kiilres = await PLU.toKillNpc(fnpc.key)
                    if(kiilres=='noflower'){
                        PLU.execActions("shop buy shop28_N_10;shop buy shop28_N_10;")
                        await PLU.waitTime()
                    }else if(kiilres=='next'){
                        idx++
                    }else if(kiilres=='ok'){
                        //idx++
                    }else{
                        idx++
                    }
                } catch (error) {
                    resolve('end')
                    break
                }
            }else{
                idx++
            }
            if(!PLU.TMP.findDragon) { res='break';resolve('end');break;}
        }
        if(!res) resolve('next')
    })
},
async stepPath(act){
    return new Promise((resolve,reject)=>{
        PLU.actions({
            paths:[act],
            idx:0,
            onPathsEnd(){
                setTimeout(()=>{
                    resolve()
                },200)
            },
            onPathsFail(){
                reject()
            }
        })
    })
},
async toKillNpc(npcId){
    return new Promise((resolve,reject)=>{
        PLU.autoFight({
            targetKey:npcId,
            fightKind:'kill',
            // autoSkill:'fast',
            onFail(errCode){
                if(errCode==9){
                    resolve("next")
                } else if(errCode==10){
                    resolve("noflower")
                } else if(errCode==11){
                    reject("end")
                }else{
                    resolve(false)
                }
            },
            onEnd(){
                setTimeout(()=>{
                    resolve('ok')
                },500)
            }
        })
    })
},
async waitTime(t=1000){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },t)
    })
},
  //================================================================================================
  toQueryMiTi: function toQueryMiTi() {
    var defaultMapId = PLU.getCache("pathFindMiTi") || "1";
    var citys = PLU.YFD.cityList.map(function (c, i) {
      var issel = i + 1 == defaultMapId ? "selected" : "";
      return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
    }).join("");
    YFUI.showPop({
      title: "全图找谜题",
      text: '选择地图, 输入关键词（人物，地点，物品）列表（英文逗号隔开）<br>可模糊匹配<br>\n            <div style=\'margin:10px 0;\'>\n              <span>去哪找: </span>\n              <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">\n                '.concat(citys, '\n              </select>\n            </div>\n            <div style=\'margin:10px 0;\'>\n              <span>要找啥: </span>\n              <input id="pathFindKeyword" value="').concat(PLU.getCache("pathFindKeyword") || "柴绍,李秀宁,大鹳淜洲,天罗紫芳衣", '" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>\n            </div>'),
      onOk: function onOk() {
        var mapStr = $.trim($("#pathFindMap").val()),
          KeywordStr = $.trim($("#pathFindKeyword").val());
        if (!KeywordStr) return;
        PLU.setCache("pathFindMap", mapStr);
        PLU.setCache("pathFindKeyword", KeywordStr);
        var jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
        if (!jhMap) {
          return YFUI.writeToOut("<span style='color:#F66;'>---无地图数据---</span>");
        } else {
          var ways = jhMap.way.split(";");
          console.log({
            paths: ways,
            idx: 0,
            objectKeyword: KeywordStr
          });
          PLU.MiTiArray = [];
          PLU.goPathFindMiTi({
            paths: ways,
            idx: 0,
            objectKeyword: KeywordStr
          });
        }
      },
      onNo: function onNo() { }
    });
  },
  goPathFindMiTi: function goPathFindMiTi(params) {
    //goFindYouxia
    if (params.idx >= params.paths.length) {
      setTimeout(function () {
        PLU.execActions("home");
      }, 100);
      YFUI.writeToOut("<span style='color:#FFF;'>--找不到目标谜题!...已搜索完地图--</span>");
      return;
    }
    var acs = [params.paths[params.idx]];
    PLU.actions({
      paths: acs,
      idx: 0,
      onPathsEnd: function onPathsEnd() {
        var npcArray = UTIL.getRoomAllNpc();
        UTIL.addSysListener("MiTi", function (b, type, subtype, msg) {
          if (type != "main_msg") return;
          if (msg.match(params.objectKeyword)) PLU.MiTiArray.push(msg);
        });
        var _iterator5 = _createForOfIteratorHelper(npcArray),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var npc = _step5.value;
            PLU.execActions("auto_tasks cancel;ask " + npc.key);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        UTIL.delSysListener("MiTi");
        if (PLU.MiTiArray.length) {
          YFUI.writeToOut("<span style='color:#FFF;'>--目标谜题已找到--</span>");
          return;
        } else {
          setTimeout(function () {
            params.idx++;
            PLU.goPathFindMiTi(params);
          }, 500);
        }
      },
      onPathsFail: function onPathsFail() {
        setTimeout(function () {
          PLU.execActions("home");
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--路径中断--</span>");
        return;
      }
    });
  },
  //================================================================================================
  goNpcWay: function goNpcWay(desc, way) {
    var goList = PLU.getCache("prevQueryList") || [];
    var newList = goList.filter(function (e) {
      return e.desc != desc;
    });
    var len = newList.unshift({
      desc: desc,
      way: way
    });
    if (len > 10) newList.length = 10;
    PLU.setCache("prevQueryList", newList);
    PLU.execActions(way);
  },
  //================================================================================================
  showNpcWay: function showNpcWay(desc, way) {
    var text = "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>" + way + "</span></br>";
    var way2 = PLU.linkPath(PLU.queryRoomPath(), way);
    var way3 = PLU.minPath(PLU.queryRoomPath(), way);
    if (way != way2) {
      text += "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>同图路径（？）：" + way2 + "</span></br>";
      text += "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>最短路径（？）：" + way3 + "</span></br>";
    }
    YFUI.showPop({
      title: "路径详情：" + desc,
      text: text,
      autoOk: 10,
      okText: "关闭",
      noText: "前往",
      onOk: function onOk() { },
      onNo: function onNo() {
        PLU.goNpcWay(desc, way);
      }
    });
  },
  //================================================================================================
  toQueryHistory: function toQueryHistory() {
    var prevList = PLU.getCache("prevQueryList") || [];
    if (prevList.length == 0) return YFUI.writeToOut("<span style='color:#F66;'>---无历史数据---</span>");
    for (var i = prevList.length - 1; i >= 0; i--) {
      var e = prevList[i];
      YFUI.writeToOut("<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" + e.desc + '","' + e.way + "\")'>" + e.desc + "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" + e.desc + '","' + e.way + "\")'>路径详情</a></span>");
    }
    YFUI.writeToOut("<span>----------</span>");
  },
  //================================================================================================
  showMPFZ: function showMPFZ($btn) {
    var btnFlag = PLU.setBtnRed($btn);
    if (!btnFlag) {
      $("#topMonitor").hide();
      $("#btn_bt_showMPFZ").text("纷争显示");
      PLU.setCache("showTopMonitor", 0);
      return;
    }
    $("#topMonitor").show();
    $("#btn_bt_showMPFZ").text("纷争隐藏");
    PLU.setCache("showTopMonitor", 1);
  },
  //================================================================================================
  openCombineGem: function openCombineGem() {
    var htm = "<div>";
    PLU.YFD.gemType.forEach(function (t, ti) {
      htm += "<div>";
      PLU.YFD.gemPrefix.forEach(function (p, pi) {
        if (pi > 2) htm += '<button onclick="PLU.combineGem(' + ti + "," + pi + ')" style="color:' + t.color + ';width:18%;margin:2px 1%;padding:3px;">' + (p.substr(0, 2) + t.name.substr(0, 1)) + "</button>";
      });
      htm += "</div>";
    });
    htm += "</div>";
    htm += '<div style="margin:10px 0 0 3px;position:absolute;left:15px;bottom:10px;">每次连续合成最多 <input id="maxCombine" type="number" value="1" style="width:50px;height:25px;line-height:25px;" maxlength="3" min=1 max=9999 oninput="if(value.length>4)value=value.substr(0,4)"/> 颗宝石。</div>';
    YFUI.showPop({
      title: "合成宝石",
      text: htm,
      width: "382px",
      okText: "关闭",
      onOk: function onOk() { }
    });
  },
  //================================================================================================
  combineGem: function combineGem(type, grade) {
    if (PLU.TMP.combineTooFast) return YFUI.writeToOut("<span style='color:#F66;'>--点击不要太快!--</span>");
    PLU.TMP.combineTooFast = setTimeout(function () {
      PLU.TMP.combineTooFast = null;
    }, 600000);
    var targetNum = parseInt($("#maxCombine").val()) || 1;
    var getNum = 0;
    var countString = function countString(combineNum, gemCode) {
      var combineStr = "";
      if (combineNum % 3 != 0) return "";
      combineStr += "items hecheng " + gemCode + "_N_" + Math.floor(combineNum / 3) + ";";
      return combineStr;
    };
    var needGem = function needGem(gemGrade, needNum, gemList) {
      var _objGem$num;
      if (gemGrade < 0) return null;
      var gemName = PLU.YFD.gemPrefix[gemGrade] + PLU.YFD.gemType[type].name;
      var gemCode = PLU.YFD.gemType[type].key + "" + (gemGrade + 1);
      var objGem = gemList.find(function (e) {
        return e.name == gemName;
      });
      var gemNum = (_objGem$num = objGem === null || objGem === void 0 ? void 0 : objGem.num) !== null && _objGem$num !== void 0 ? _objGem$num : 0;
      if (gemNum >= needNum) {
        return countString(needNum, gemCode);
      } else {
        var dtNum = needNum - gemNum;
        var next = needGem(gemGrade - 1, 3 * dtNum, gemList);
        if (next) return next + countString(needNum, gemCode);
        return null;
      }
    };
    var countCombine = function countCombine(cb) {
      PLU.getGemList(function (gemList) {
        var runStr = needGem(grade - 1, 3, gemList);
        if (runStr) {
          PLU.fastExec(runStr + "items", function () {
            YFUI.writeToOut("<span style='color:white;'>==合成宝石x1==</span>");
            getNum++;
            targetNum--;
            if (targetNum > 0) {
              countCombine(function () {
                cb && cb(true);
              });
            } else {
              cb && cb(true);
            }
          });
        } else {
          YFUI.writeToOut("<span style='color:#F66;'>--没有足够的宝石!--</span>");
          cb && cb(false);
        }
      });
    };
    countCombine(function (end) {
      clearTimeout(PLU.TMP.combineTooFast);
      PLU.TMP.combineTooFast = null;
      YFUI.writeToOut("<span style='color:white;'>==合成宝石结束! 得到宝石x" + getNum + "==</span>");
    });
  },
  //================================================================================================
  getGemList: function getGemList(callback) {
    var getItemsTimeOut = setTimeout(function () {
      UTIL.delSysListener("getListItems");
    }, 5000);
    UTIL.addSysListener("getListItems", function (b, type, subtype, msg) {
      if (type != "items" || subtype != "list") return;
      UTIL.delSysListener("getListItems");
      clearTimeout(getItemsTimeOut);
      //clickButton("prev");
      var iId = 1,
        itemList = [];
      while (b.get("items" + iId)) {
        var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
        if (it && it.length > 4 && it[3] == "0" && it[1].match("宝石")) itemList.push({
          key: it[0],
          name: it[1],
          num: Number(it[2])
        });
        iId++;
      }
      callback && callback(itemList);
    });
    clickButton("items", 0);
  },
  //================================================================================================
  getAllItems: function getAllItems(callback) {
    var getItemsTimeOut = setTimeout(function () {
      UTIL.delSysListener("getListItems");
    }, 5000);
    UTIL.addSysListener("getListItems", function (b, type, subtype, msg) {
      if (type != "items" || subtype != "list") return;
      UTIL.delSysListener("getListItems");
      clearTimeout(getItemsTimeOut);
      clickButton("prev");
      var iId = 1,
        itemList = [];
      while (b.get("items" + iId)) {
        var it = UTIL.filterMsg(b.get("items" + iId)).split(",");
        if (it && it.length > 4) itemList.push({
          key: it[0],
          name: it[1],
          num: Number(it[2]),
          equipped: it[3] == "0"
        });
        iId++;
      }
      callback && callback(itemList);
    });
    clickButton("items", 0);
  },
  //================================================================================================
  profileSetting() {
    if (!this.pSettingMaps) this.initpSettingMaps();
    let ckeds = PLU.getCache("pSettingArray")?.split(",") || this.pSettingMaps.map((e, i) => i);

    let htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
    this.pSettingMaps.forEach((e, i) => {
      if (!e.n) htm += '<span style="width:92px;">&nbsp;</span>';
      else
        htm += `<span><label data-id="${i}" style="font-size:13px;margin:0 3px 5px 0;">${e.n}<input type="checkbox" name="pSettingId" value="${i}"
           ${ckeds.includes(i + "") || e.f ? "checked" : ""} ${e.f ? "disabled" : ""} /></label></span>`;
    });
    YFUI.showPop({
      title: "个人设置",
      text: htm,
      width: "260px",
      okText: "完成",
      onOk(e) {
        let checkeds = [];
        e.find('input[name="pSettingId"]:checked').each((i, b) => {
          checkeds.push(b.value);
        });
        PLU.setCache("pSettingArray", checkeds.join(","));
        PLU.saveSetting(checkeds);
        console.log(checkeds);
      },
      onNo() { },
      afterOpen($el) {
        $el.find(".pSettingAll").click((e) => {
          $el.find('input[name="pSettingId"]').each(function () {
            $(this).prop("checked", true);
          });
        });
      },
    });
  },
  //================================================================================================
  saveSetting(checkeds) {
    for (let psid in PLU.pSettingMaps) {
      let pSettingD = PLU.pSettingMaps[psid];
      let pms = (checkeds.includes(psid)) ? "true" : "false";
      PLU.setCache("pSetting_" + pSettingD.n, pms);
      console.log(PLU.getCache("pSetting_" + pSettingD.n))
    }
  },
  //================================================================================================
  initpSettingMaps() {
    let _this = this;
    this.pSettingMaps = [
      {
        n: "快速连招",
      },
    ];
  },
  //================================================================================================
  backupSetting: function backupSetting() {
    var config = {};
    config.GM = GM_info;
    config.GM.scriptMetaStr = undefined;
    config.GM.script.header = undefined;
    config.PLU = {};
    config.PLU.CACHE = UTIL.getMem("CACHE");
    config.PLU.HISTORY = UTIL.getMem("HISTORY");
    config.PLU.STATUS = PLU.STATUS;
    config.PLU.TMP = PLU.TMP;
    var reader = new FileReader();
    reader.readAsDataURL(new Blob([JSON.stringify(config)], {
      type: "application/json"
    }));
    reader.onload = function (e) {
      var a = document.createElement("a");
      a.download = "无剑配置_" + PLU.nickName + "_" + PLU.accId + "_" + new Date().getTime() + ".json";
      a.style.display = "none";
      a.href = reader.result;
      a.click();
    };
  },
  //================================================================================================
  loadSetting: function loadSetting() {
    var input = document.createElement("input");
    input.type = "file";
    input.id = "config";
    input.accept = "application/json";
    input.style.display = "none";
    input.onchange = function () {
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = function (e) {
        var config = JSON.parse(reader.result);
        UTIL.setMem("CACHE", config.PLU.CACHE);
        UTIL.setMem("HISTORY", config.PLU.HISTORY);
        PLU.initStorage();
        PLU.TMP = config.PLU.TMP;
        PLU.STATUS = config.PLU.STATUS;
        YFUI.writeToOut("<span style='color:yellow;'>====加载完成====</span>");
      };
    };
    input.click();
  }
};
//=================================================================================
// UTIL模块
//=================================================================================
unsafeWindow.UTIL = {
  //================
  accId: null,
  sysListeners: {},
  logHistory: [],
  //================
  getUrlParam: function getUrlParam(key) {
    var res = null,
      au = location.search.split("?"),
      sts = au[au.length - 1].split("&");
    sts.forEach(function (p) {
      if (p.split("=").length > 1 && key == p.split("=")[0]) res = unescape(p.split("=")[1]);
    });
    return res;
  },
  getAccId: function getAccId() {
    this.accId = this.getUrlParam("id");
    return this.accId;
  },
  setMem: function setMem(key, data) {
    localStorage.setItem("PLU_" + this.accId + "_" + key, data);
  },
  getMem: function getMem(key) {
    return localStorage.getItem("PLU_" + this.accId + "_" + key);
  },
  rnd: function rnd() {
    return Math.floor(Math.random() * 1000000);
  },
  getuuid: function getuuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },
  getNow: function getNow(timestamp) {
    var date = timestamp ? new Date(timestamp) : new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 + "").padStart(2, "0");
    var D = (date.getDate() + "").padStart(2, "0");
    var h = (date.getHours() + "").padStart(2, "0");
    var m = (date.getMinutes() + "").padStart(2, "0");
    var s = (date.getSeconds() + "").padStart(2, "0");
    return M + "-" + D + " " + h + ":" + m + ":" + s;
  },
  log: function log(_ref5) {
    var msg = _ref5.msg,
      type = _ref5.type,
      time = _ref5.time,
      isHistory = _ref5.isHistory;
    var style = "color:#333";
    if (type == "TF") {
      var co = msg.match("夜魔") ? "#F0F" : "#666";
      style = "color:" + co;
    } else if (type == "QL") {
      style = "color:#00F";
    } else if (type == "MPFZ") {
      style = "color:#F60";
    } else if (type == "LPFZ") {
      style = "color:#033";
    } else if (type == "KFQL") {
      style = "color:#F00;background:#FF9;";
    } else if (type == "YX") {
      var co2 = msg.match("宗师】") ? "#00F" : msg.match("侠客】") ? "#08F" : msg.match("魔尊】") ? "#F00" : msg.match("邪武】") ? "#F80" : "#999";
      style = "color:" + co2 + ";background:#CFC;";
    } else if (type == "BF") {
      style = "color:#FFF;background:#93C;";
    } else if (type == "TIPS") {
      style = "color:#29F";
    }
    //console.log('%c%s',style,this.getNow(time)+msg)
    if (!isHistory) {
      this.logHistory.push({
        msg: msg,
        type: type,
        time: time
      });
      this.setMem("HISTORY", JSON.stringify(this.logHistory));
    }
    var evt = new Event("addLog");
    evt.ext = {
      msg: msg,
      type: type,
      time: time,
      style: style
    };
    document.dispatchEvent(evt);
  },
  filterMsg: function filterMsg(s) {
    if (typeof s == "string") return s.replace(/[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
    return "";
  },
  sysDispatchMsg: function sysDispatchMsg(b, type, subtype, msg) {
    for (var key in this.sysListeners) {
      this.sysListeners[key](b, type, subtype, msg);
    }
  },
  addSysListener: function addSysListener(key, fn) {
    this.sysListeners[key] = fn;
  },
  delSysListener: function delSysListener(key) {
    delete this.sysListeners[key];
  },
  findRoomNpc: function findRoomNpc(npcName, gb, searchAll) {
    console.debug(npcName);
    var roomInfo = g_obj_map.get("msg_room");
    if (!roomInfo) return null;
    for (var i = roomInfo.elements.length - 1; i >= 0; i--) {
      var bNpc = this.getSpNpcByIdx(roomInfo, i, searchAll);
      if (bNpc && bNpc.name == npcName) {
        if (!gb) return bNpc; else {
          var gNpc = this.getSpNpcByIdx(roomInfo, i - 1);
          if (gNpc) return gNpc;
        }
      }
    }
    return null;
  },
  roomHasNpc: function roomHasNpc() {
    var roomInfo = g_obj_map.get("msg_room");
    var res = false;
    if (!roomInfo) return null;
    for (var i = roomInfo.elements.length - 1; i >= 0; i--) {
      if (roomInfo.elements[i].key.match("npc")) {
        res = true;
        break;
      }
    }
    return res;
  },
  getRoomAllNpc: function getRoomAllNpc() {
    var roomInfo = g_obj_map.get("msg_room");
    var res = [];
    if (!roomInfo) return res;
    for (var i = roomInfo.elements.length - 1; i >= 0; i--) {
      var npc = roomInfo.elements[i].key.match(/npc(\d+)/);
      if (npc) {
        var infoArr = roomInfo.elements[i].value.split(",");
        var name = this.filterMsg(infoArr[1]);
        res.push({
          name: name,
          key: infoArr[0]
        });
      }
    }
    return res;
  },
  findRoomNpcReg: function findRoomNpcReg(npcName) {
    var roomInfo = g_obj_map.get("msg_room");
    if (!roomInfo) return null;
    for (var i = roomInfo.elements.length - 1; i >= 0; i--) {
      var npc = roomInfo.elements[i].key.match(/npc(\d+)/);
      if (npc) {
        var infoArr = roomInfo.elements[i].value.split(",");
        var name = this.filterMsg(infoArr[1]);
        if (name.match(npcName)) return {
          name: name,
          key: infoArr[0]
        };
      }
    }
    return null;
  },
  getSpNpcByIdx: function getSpNpcByIdx(roomInfo, idx, searchAll) {
    var npcInfo = roomInfo.get("npc" + idx);
    if (npcInfo) {
      var infoArr = npcInfo.split(",");
      var name = this.filterMsg(infoArr[1]);
      if (searchAll) return {
        name: name,
        key: infoArr[0]
      };
      if (name != infoArr[1]) return {
        name: name,
        key: infoArr[0]
      };
    }
    return null;
  },
  getItemFrom: function getItemFrom(name) {
    var _g_obj_map$get7;
    if (g_gmain.is_fighting) return;
    var item = (_g_obj_map$get7 = g_obj_map.get("msg_room")) === null || _g_obj_map$get7 === void 0 ? void 0 : _g_obj_map$get7.elements.find(function (it) {
      return it.key.substring(0, 4) == "item" && it.value.indexOf(name) >= 0;
    });
    if (item) {
      clickButton("get " + item.value.split(",")[0]);
    }
  },
  inHome: function inHome() {
    return gSocketMsg._is_in_home;
  }
};
//=================================================================================
// UI模块
//=================================================================================
unsafeWindow.YFUI = {
  init: function init() {
    var maxW = $("#out").width() > 634 ? 634 : $("#out").width();
    console.log($("#page").width(), $("#out").width());
    var rightStyle = $("#page").width() - $("#out").width() > 4 ? "left:" + (maxW - 76 + 4) + "px;" : "right:0;";
    this.$Panel = $('<div id="WJPlug_Panel" style="pointer-events:none;position:absolute;z-index:9999;' + rightStyle + ';top:5.5%;font-size:12px;line-height:1.2;text-align:right;list-style:none;">');
    $("body").append(this.$Panel);
  },
  addBtnGroup: function addBtnGroup(_ref6) {
    var id = _ref6.id,
      style = _ref6.style;
    var $box = $('<div id="' + id + '" style="position:relative;"></div>');
    style && $box.css(style);
    this.$Panel.append($box);
    return $box;
  },
  addBtn: function addBtn(_ref7) {
    var id = _ref7.id,
      groupId = _ref7.groupId,
      text = _ref7.text,
      onclick = _ref7.onclick,
      style = _ref7.style,
      boxStyle = _ref7.boxStyle,
      extend = _ref7.extend,
      children = _ref7.children,
      canSet = _ref7.canSet;
    var $box = $('<div id="' + id + '" class="btn-box" style="position:relative;pointer-events:auto;"></div>');
    var $btn = $('<button id="btn_' + id + '" style="padding:4px 2px;box-sizing:content-box;margin:1px 1px;border:1px solid #333;border-radius:4px;width:68px;">' + text + "</button>");
    style && $btn.css(style);
    boxStyle && $box.css(boxStyle);
    $btn.$extend = extend;
    $btn.click(function (e) {
      onclick && onclick($btn, $box);
    });
    $box.append($btn);
    if (children) $box.append($('<b style="position:absolute;left:1px;top:3px;font-size:12px;">≡</b>'));
    if (canSet) {
      var $setbtn = $('<i style="position:absolute;right:-8px;top:2px;font-size:14px;background:#333;color:#fff;font-style:normal;;line-height:1;border:1px solid #CCC;border-radius:100%;padding:2px 6px;cursor:pointer;">S</i>');
      $box.append($setbtn);
      $setbtn.click(function (e) {
        onclick && onclick($btn, $box, "setting");
      });
    }
    groupId ? $("#" + groupId).append($box) : this.$Panel.append($box);
    $box.$button = $btn;
    return $box;
  },
  addMenu: function addMenu(_ref8) {
    var id = _ref8.id,
      groupId = _ref8.groupId,
      text = _ref8.text,
      extend = _ref8.extend,
      style = _ref8.style,
      menuStyle = _ref8.menuStyle,
      multiCol = _ref8.multiCol,
      onclick = _ref8.onclick,
      children = _ref8.children;
    //{text,id,btnId}
    var $btnBox = this.addBtn({
      id: id,
      groupId: groupId,
      text: text,
      extend: extend,
      style: style,
      children: children
    }),
      _this = this;
    function addMenuToBtn(_ref9) {
      var btnId = _ref9.btnId,
        $parent = _ref9.$parent,
        list = _ref9.list,
        menuStyle = _ref9.menuStyle;
      var $listBox = $('<div id="menu_' + btnId + '" class="menu" style="position:absolute;top:0;right:' + $parent.width() + 'px;display:none;"></div>');
      $parent.append($listBox);
      list && list.forEach(function (sub) {
        var btnOpt = Object.assign({}, sub, {
          groupId: "menu_" + btnId
        });
        if (!btnOpt.onclick) {
          btnOpt.onclick = onclick;
        }
        if (multiCol) btnOpt.boxStyle = Object.assign({}, {
          display: "inline-block"
        }, btnOpt.boxStyle);
        var $subBtnBox = _this.addBtn(btnOpt);
        if (sub.children) $subBtnBox.$list = addMenuToBtn({
          btnId: sub.id,
          $parent: $subBtnBox,
          list: sub.children,
          menuStyle: sub.menuStyle
        });
      });
      $parent.$button.click(function (e) {
        $listBox.toggle().css({
          right: $parent.width() + 5
        });
        menuStyle && $listBox.css(menuStyle);
        $listBox.is(":visible") && $listBox.parent().siblings(".btn-box").find(".menu").hide();
        onclick && onclick($parent.$button, $parent);
      });
      return $listBox;
    }
    $btnBox.$list = addMenuToBtn({
      btnId: id,
      $parent: $btnBox,
      list: children,
      menuStyle: menuStyle
    });
    return $btnBox;
  },
  showPop: function showPop(params) {
    if ($("#myTools_popup").length) $("#myTools_popup").remove();
    params = params || {};
    var okText = params.okText || "确定",
      noText = params.noText || "取消",
      _this = this;
    _this.SI_autoOk && clearInterval(_this.SI_autoOk);
    _this.SI_autoOk = null;
    var ph = '<div style="z-index:9999;position:fixed;top: 40%;left:50%;width:100%;height:0;font-size:14px;" id="myTools_popup">\n            <div class="popup-content" style="width:'.concat(params.width || "70%", ';max-width:512px;background: rgba(255,255,255,.8);border:1px solid #999999;border-radius: 10px;transform: translate(-50%,-50%) scale(.1,.1);transition:all .1s;">\n            <div style="padding: 10px 15px;"><span style="font-weight:700;">').concat(params.title || "", '</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>\n            <div style="padding: 0 15px;line-height:1.5;max-height:500px;overflow-y:auto;">').concat(params.text || "", '</div>\n            <div style="text-align:right;padding: 10px;">');
    if (params.onNo) ph += '<button style="margin-right: 15px;padding: 5px 20px;border: 1px solid #000;border-radius:5px;" class="btnno">'.concat(noText, "</button>");
    ph += '<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">'.concat(okText, "</button>\n            </div></div></div>");
    var $ph = $(ph);
    $("body").append($ph);
    setTimeout(function () {
      $ph.find(".popup-content").css({
        transform: "translate(-50%,-50%) scale(1,1)"
      });
      params.afterOpen && params.afterOpen($ph);
    }, 100);
    if (params.autoOk) {
      var autoCloseN = Number(params.autoOk);
      $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
      _this.SI_autoOk = setInterval(function () {
        autoCloseN--;
        $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
        if (autoCloseN < 1) {
          $ph.find(".btnok").click();
        }
      }, 1000);
    } else if (params.autoNo) {
      var _autoCloseN = Number(params.autoNo);
      $("#myTools_popup .btnno").text(noText + "(" + _autoCloseN + "s)");
      _this.SI_autoOk = setInterval(function () {
        _autoCloseN--;
        $("#myTools_popup .btnno").text(noText + "(" + _autoCloseN + "s)");
        if (_autoCloseN < 1) {
          $ph.find(".btnno").click();
        }
      }, 1000);
    }
    $ph.find(".btncl").click(function (e) {
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      params.onX && params.onX();
      $ph.remove();
    });
    $ph.find(".btnno").click(function (e) {
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      params.onNo && params.onNo();
      $ph.remove();
    });
    $ph.find(".btnok").click(function (e) {
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      params.onOk && params.onOk($ph);
      $ph.remove();
    });
  },
  showInput: function showInput(params) {
    var popParams = Object.assign({}, params);
    var inpstyle = "font-size:14px;line-height:1.5;width:100%;padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;";
    if (params.inputs && params.inputs.length > 1) {
      for (var i = 0; i < params.inputs.length; i++) {
        var val = params.value[i] || "";
        popParams.text += '<div><div style="width:20%;float:left;margin:5px 0;line-height:2;text-align:right;">'.concat(params.inputs[i], ': </div><div style="width:73%;margin-left:21%;">');
        popParams.text += params.type == "textarea" ? '<textarea id="myTools_popup_input_'.concat(i, '" rows="4" style="').concat(inpstyle, '">').concat(val, "</textarea></div></div>") : '<input id="myTools_popup_input_'.concat(i, '" type="text" value="').concat(val, '" style="').concat(inpstyle, '"/></div></div>');
      }
      popParams.onOk = function () {
        var val = [];
        for (var _i2 = 0; _i2 < params.inputs.length; _i2++) {
          val.push($("#myTools_popup_input_" + _i2).val());
        }
        params.onOk(val);
      };
    } else {
      popParams.text += params.type == "textarea" ? '<div><textarea id="myTools_popup_input" rows="4" style="'.concat(inpstyle, '">').concat(params.value || "", "</textarea></div>") : '<div><input id="myTools_popup_input" type="text" value="'.concat(params.value || "", '" style="').concat(inpstyle, '"/></div>');
      popParams.onOk = function () {
        var val = $("#myTools_popup_input").val();
        params.onOk(val);
      };
    }
    this.showPop(popParams);
  },
  showInfoPanel: function showInfoPanel(params) {
    if ($("#myTools_InfoPanel").length) $("#myTools_InfoPanel").remove();
    params = params || {};
    var okText = params.okText || "关闭",
      noText = params.noText || "清空",
      _this = this;
    var $ph = $('<div style="z-index:9900;position:fixed;top:10%;left:0;width:100%;height:0;font-size:12px;" id="myTools_InfoPanel">\n            <div class="infoPanel-content" style="width:'.concat(params.width || "75%", ';max-width:512px;height:620px;background: rgba(255,255,255,.9);border:1px solid #999;border-radius:0 10px 10px 0;transform: translate(-100%,0);transition:all .1s;">\n                <div style="padding: 10px 15px;"><span style="font-weight:700;">').concat(params.title || "", '</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>\n                <div style="padding: 0 15px;line-height:1.5;height:550px;overflow-y:auto;" class="infoPanel-wrap">').concat(params.text || "", '</div>\n                <div style="text-align:right;padding: 10px;">\n                <button style="padding: 5px 20px;background-color: #969;color:#FFF;border: 1px solid #000;border-radius: 5px;margin-right:25px;" class="btnno">').concat(noText, '</button>\n                <button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">').concat(okText, "</button>\n                </div>\n            </div></div>"));
    $("body").append($ph);
    setTimeout(function () {
      $ph.find(".infoPanel-content").css({
        transform: "translate(0,0)"
      });
      params.onOpen && params.onOpen();
    }, 100);
    $ph.find(".btncl").click(function (e) {
      params.onClose && params.onClose();
      $ph.remove();
    });
    $ph.find(".btnok").click(function (e) {
      params.onOk && params.onOk();
      params.onClose && params.onClose();
      $ph.remove();
    });
    $ph.find(".btnno").click(function (e) {
      params.onNo && params.onNo();
    });
    return $ph;
  },
  writeToOut: function writeToOut(html) {
    var m = new unsafeWindow.Map();
    m.put("type", "main_msg");
    m.put("subtype", "html");
    m.put("msg", html);
    gSocketMsg.dispatchMessage(m);
  }
};
if (GM_info.script.name != "无剑Mud辅修(OL)") {
  PLU.version = GM_info.script.version;
  unsafeWindow.init();
} else GM_xmlhttpRequest({
  method: "GET",
  responseType: "json",
  url: "https://update.greasyfork.org/scripts/483658.json?t=".concat(Date.now()),
  nocache: true,
  onload: function onload(res) {
    PLU.version = JSON.parse(res.responseText)["version"];
    if (!unsafeWindow.customMode) unsafeWindow.init();
  }
});
