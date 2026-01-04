// ==UserScript==
// @name         abot iirose
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  把 iirose 搬进控制台
// @author       crescawn
// @match        https://iirose.com/messages.html
// @match        http://iirose.com/messages.html
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/410811/abot%20iirose.user.js
// @updateURL https://update.greasyfork.org/scripts/410811/abot%20iirose.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function msg_pub(e) {
    let args = [''];
    args[0] += '%c' + e[2] + '\r\n';
    args.push('color:' + ncolor[e[6]]);
    if (e[3][0] == "'") {
      args.push('color:gray');
      switch (e[3][1]) {
        case '0':
          args[0] += '%c改变了状态: %c' + status[e[3][2]] + ' %c-> %c' + status[e[3][3]];
          args.push('color:#933d4d');
          args.push('color:gray');
          args.push('color:#933d4d');
          break;
        case '1':
          args[0] += '%c进入了房间';
          break;
        case '2':
          args[0] += '%c移动到了 : %c' + Objs.mapHolder.Assets.roomNameJson[e[3].substr(2)] + '\r\n%c [_' + e[3].substr(2) +
            '_] ';
          args.push('color:#50a037');
          args.push('color:gray');
          break;
        case '3':
          args[0] += '%c离开了';
          break;
        case '5':
          args[0] += '%c撤回了一条消息';
          break;
        default:
          args[0] += '%c' + e[3];
      }
    } else if (e[3].indexOf('m__4') == 0) {
      let m = e[3].substr(4).split('&gt;');
      args[0] += '%c点播' + mediacode[m[0][0]] + '\r\n标题 : %c' + hdec(m[1]) + '%c\r\n作者 : %c' + hdec(m[2]) +
        '\r\n%c来源 : ' +
        mediacode[m[0]];
      args.push('color:gray');
      args.push('color:black');
      args.push('color:gray');
      args.push('color:black');
      args.push('color:gray');
    } else {
      args[0] += '%c' + hdec(e[3]);
      args.push('color:black');
    }
    arrlog(args, new Date(e[0] * 1e3).toTimeString().substr(0, 8) + ' \r\n\/\/[#' + e[10] + '#] ');
  }

  function hdec(e) {
    let t = document.createElement("div");
    t.innerHTML = e;
    return t.innerText || t.textContent;
  }

  function arrlog(a, c) {
    a = JSON.stringify(a);
    eval('console.log(' + a.substr(1, a.length - 2) + ')' + '\r\n' + '\/\/' + c);
  }

  function arrlog1(a, c) {
    //a = JSON.stringify(a);
    console.log(...a);
  }
  const mediacode = {
    '@': '音乐',
    '@0': '网易云音乐',
    '@1': '虾米音乐',
    '@2': 'QQ音乐',
    '@3': '千千音乐',
    '@4': '酷狗音乐',
    '*': '视频',
    '*0': '爱奇艺',
    '*2': 'YouTube',
    '*3': '哔哩哔哩'
  };
  const ncolor = [
    '#7b13f1', '#0755ff', '#e72fea', '#21d63f', '#b94518'
  ];
  const status = {
    'n': '无状态',
    '0': '会话中',
    '1': '忙碌中',
    '2': '离开中',
    '3': '就餐中',
    '4': '通话中',
    '5': '移动中',
    '6': '如厕中',
    '7': '沐浴中',
    '8': '睡觉中',
    '9': '上课中',
    'a': '作业中',
    'b': '游戏中',
    'c': '看剧中',
    'd': '挂机中',
    'e': '自闭中',
    'f': '请撩我'
  };

  let ab = {
    tui: function() {
      Probe.init.roomSplashHolder || Init.fullPanel(18),
        Objs.roomSplashHolder.function.enter(),
        void(Temporary.roomSplashInit ? (1 == Temporary.roomSplashInit ? (panelAnimate(50, 0, Temporary.initPanelSwitch[
            1], Objs[Temporary.initPanelSwitch[0]].This, Objs.roomSplashHolder.This), delete Temporary.initPanelSwitch) :
          (panelAnimate(56, Probe.fullPanelNoAnimate = 1), Probe.fullPanelNoAnimate = 0), delete Temporary.roomSplashInit
        ) : panelAnimate(56, 1));
    },
    input: function(e, t) {
      Utils.service.moveinputDo(e, t);
    },
    send: function(e) {
      const ui = Utils.smallTools.uniqueID();
      socket.send(JSON.stringify({
        m: e,
        mc: inputcolorhex,
        i: ui
      }));
      return ui;
    },
    rcv: function(e) {
      e = e.split('<').reverse();
      for (let i in e) msg_pub(e[i].split('>'))
    },
    move: function(e) {
      const a = e.indexOf('[_');
      const b = e.indexOf('_]');
      if (a != -1 && b != -1)
        e = e.substr(a + 2, b - a - 2);
      if (Objs.mapHolder.Assets.roomNameJson[e]) {
        Objs.mapHolder.function.roomchanger(e);
        return Objs.mapHolder.Assets.roomNameJson[e];
      }
      e = this.roomID(e);
      e = (typeof(e) == typeof('') ? e : e[0]).split('>')[0];
      Objs.mapHolder.function.roomchanger(e);
      return e;
    },
    roomID: function(e) {
      e = e.split('_').reverse();
      for (let i in Objs.mapHolder.Assets.roomNameJson) {
        let t = true;
        let n = Objs.mapHolder.Assets.roomNameJson[i].split('_').reverse();
        for (let j in n) {
          if (e[j] == n[j]) continue;
          t = false;
          break;
        }
        if (t) return i + '>' + Objs.mapHolder.Assets.roomNameJson[i];
      }
      let r = [];
      for (let i in Objs.mapHolder.Assets.roomNameJson) {
        let t = true;
        let n = Objs.mapHolder.Assets.roomNameJson[i].split('_').reverse();
        for (let j in e) {
          if (n[j].indexOf(e[j]) != -1) continue;
          t = false;
          break;
        }
        if (t) r.push(i + '>' + Objs.mapHolder.Assets.roomNameJson[i]);
      }
      return r.length > 0 ? (r.length == 1 ? r[0] : r) : 0;
    }
  };

  function rcvstarter() {
    if (Temporary._getcontents) {
      ab.t_getcontents = Temporary._getcontents;
      Temporary._getcontents = function(e, t) {
        if (!t) {
          ab.rcv(e);
        }
        ab.t_getcontents(e, t);
      }
    } else {
      setTimeout(rcvstarter, 20);
    }
  }
  rcvstarter();
  unsafeWindow.abot = ab;
  unsafeWindow.top.abot = ab;
})();
