// ==UserScript==
// @name         Crystal小晶
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=AIEMM
// @version      0.14.12
// @description  Crystal小晶專用控制面板
// @author       AIEMM
// @match        https://haha.gamer.com.tw/*?room=*_bot@186
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401417/Crystal%E5%B0%8F%E6%99%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/401417/Crystal%E5%B0%8F%E6%99%B6.meta.js
// ==/UserScript==

  'use strict';
  var boxStyle = document.createElement('style');
  boxStyle.setAttribute('id', 'mystyle');
  var boxStylec = document.createTextNode(
    '#box {position: absolute;right: 0;bottom: 0;z-index: 100;}\
    .boxc {padding: 2px;user-select: none;line-height: 25px;}\
    #box > * {background-color: white;border: 1px #dbdbdb solid;}\
    #box > span:not(.valueC) {cursor: pointer;}\
    #fin, #lin {width: 32px;}\
    .valueC {font-size: 13px;}\
.chat-inputbox {height: 112px;}'
  );
  boxStyle.appendChild(boxStylec);
  document.head.appendChild(boxStyle);

  var box = document.createElement('div');
  box.setAttribute('id', 'box');
  var boxc =
    '<span class="boxc">探索</span>\
    <span class="boxc">地點</span>\
    <span class="boxc">狀態</span>\
    <span class="boxc">配點</span>\
    <span class="boxc">檢視</span>\
    <br>\
    <span class="boxc">物品</span>\
    <span class="boxc">使用</span>\
    <span class="boxc">丟棄</span>\
    <span class="boxc">保管</span>\
    <span class="boxc">取出</span>\
    <br>\
    <span class="boxc">工作</span>\
    <span class="boxc">商店</span>\
    <span class="boxc">購買</span>\
    <span class="boxc">單抽</span>\
    <span class="boxc">離開</span>\
    <br>\
    <input type="number" id="fin" min="1">'/* + '<input type="number" id="min">*/ + '<input type="number" id="lin" min="1">\
    <span onclick="$(\'#fin, #lin\').val(\'\');">x</span>\
    <span id="stop">停止</span>\
    <br>\
    <span class="valueC">靜止:<span id="pValue">0/0</span></span>\
    <span class="valueC">次數:<span id="tzValue">0</span></span>\
    <span class="valueC">提醒:<span id="notice"></span><span id="notice2"></span></span>';
  box.innerHTML = boxc;
  $(box).appendTo('#im_inputbox');
  $('.boxc').on('click', function () {
    btn(this.innerText, Number($('#fin').val()), Number($('#lin').val()));
  });
  $('#stop').on('click', function () {clearAll();});
  $('#fin, #lin').on('mousedown', function (event) {
    if (!event.ctrlKey) {
      $(this).val('');
    }
  });
  var r;
  var o = false;
  //var e = 0;
  var useStop = 15;
  var drawStop = 15;
  var storePlaceStop = 15;
  var workStop = 15;
  var discoverStop = 15;
  var workInterval, discoverInterval, storePlaceInterval, useInterval, drawInterval;
  var clearAll = function () {
    clearInterval(discoverInterval);
    clearInterval(workInterval);
    clearInterval(storePlaceInterval);
    clearInterval(useInterval);
    clearInterval(drawInterval);
    console.log('clear all interval');
    ptzLog(0, 0, 0);
  };
  var btn = function (x, y, z) {
    var val = '/' + x;
    var plmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
    var p = 0;
    clearAll();
    $('#notice').text('');
    $('#notice2').text('');
    switch (x) {
      case '離開':
        o = false;
        r = false;
        im.send_msg(val);
        break;
      case '狀態':
      case '物品':
        o = true;
      case '幫助':
        im.send_msg(val);
        break;
      case '檢視':
        val += ' ' + y;
        im.send_msg(val);
        break;
      case '使用':
      case '保管':
      case '取出':
        val += ' ' + y;
        var t = z > y ? z - y + 1 : 1;
        /*for (let i = 0; i < t; i++) {
          useTimeout = setTimeout(function () {im.send_msg(val);}, 6000 * i);
        }*/
        var useIntervalFunc = function () {
          var lmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
          if (t <= 0 || p >= useStop) {
            clearInterval(useInterval);
            console.log('clear useInterval');
            ptzLog(0, 0, 0);
            $('#notice2').text('停止');
            return;
          }
          if (j(lmsg, '物品介面') && t > 0) {
            im.send_msg(val);
            t--;
          }
          if (plmsg.isSameNode(lmsg)) {
            p++;
          } else {
            p = 0;
          }
          console.log('p='+p);
          ptzLog(p, useStop, t);
          plmsg = lmsg;
        };
        im.send_msg(val);
        t--;
        useInterval = setInterval(useIntervalFunc, 2000);
        break;
      case '單抽':
        /*for (let i = 0; i < z; i++){
          setTimeout(function () {im.send_msg(val);}, 8000 * i);
        }*/
        var drawIntervalFunc = function () {
          var lmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
          if (z <= 0 || fMsg(3, '太多') || fMsg(3, '那麼多東西') || p >= drawStop) {
            clearInterval(drawInterval);
            console.log('clear drawInterval');
            ptzLog(0, 0, 0);
            $('#notice2').text('停止');
            return;
          }
          if (j(lmsg, '✭✮✯✩✰驚奇小屋✰✩✯✮✭') && z > 0) {
            im.send_msg(val);
            z--;
          }
          if (plmsg.isSameNode(lmsg)) {
            p++;
          } else {
            p = 0;
          }
          console.log('p='+p);
          ptzLog(p, drawStop, z);
          plmsg = lmsg;
        };
        im.send_msg(val);
        z--;
        drawInterval = setInterval(drawIntervalFunc, 2000);
        break;
      case '商店':
      case '地點':
        r = j(plmsg, x == '商店' ? '商店選擇' : '地點選單');
        if (!r) {
          im.send_msg(val);
        }
        if (y != '') {
          val += ' ' +　y;
          if (r) {
            im.send_msg(val);
          } else {
            var storePlaceIntervalFunc = function () {
              var lmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
              if (p >= storePlaceStop) {
                clearInterval(storePlaceInterval);
                console.log('clear storePlaceInterval');
                ptzLog(0, 0, 0);
                $('#notice2').text('停止');
                return;
              }
              if (j(lmsg, x == '商店' ? '商店選擇' : '地點選單')) {
                im.send_msg(val);
                clearInterval(storePlaceInterval);
                ptzLog(0, 0, 0);
              }
              if (plmsg.isSameNode(lmsg)) {
                p++;
              } else {
                p = 0;
              }
              console.log('p='+p);
              ptzLog(p, storePlaceStop, 0);
              plmsg = lmsg;
            };
            storePlaceInterval = setInterval(storePlaceIntervalFunc, 2000);
          }
        }
        break;
      case '工作':
        r = j(plmsg, '工作選單') || j(plmsg, '本次工作');
        if (!r && !o) {
          im.send_msg(val);
        }
        if (y != '') {
          val += ' ' +　y;
          z = z == '' ? 1 : z;
          var workIntervalFunc = function () {
            var lmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
            if (z <= 0 || fMsg(1, '餓') || fMsg(1, '吃東西') || p >= workStop) {
              clearInterval(workInterval);
              console.log('clear workInterval');
              ptzLog(0, 0, 0);
              $('#notice2').text('停止');
              return;
            }
            if ((j(lmsg, '工作選單') || j(lmsg, '本次工作') && fMsg(4, '工作選單')) && z > 0/* && e > 3*/) {
              im.send_msg(val);
              z--;
              //e = 0;
            } else {
              //e++;
            }
            console.log('z='+z);
            if (plmsg.isSameNode(lmsg)) {
              p++;
            } else {
              p = 0;
            }
            console.log('p='+p);
            ptzLog(p, workStop, z)
            plmsg = lmsg;
          };
          if (r || o) {
            im.send_msg(val);
            z--;
          }
          //e = 4;
          workInterval = setInterval(workIntervalFunc, 2000);
        } else {
          $('#notice2').text('停止');
        }
        o = true;
        break;
      case '探索':
        z = z == '' ? 1 : z;
        im.send_msg(val);
        z--;
        var discoverIntervalFunc = function () {
          var lmsg = $('.msg-content__text')[$('.msg-content__text').length - 1];
          //var slmsg = $('.msg-content__text')[$('.msg-content__text').length - 2];
          if (z <= 0 || fMsg(1, '餓') || fMsg(1, '吃東西') || fMsg(4, '升級') || fMsg(3, '太多') || fMsg(3, '那麼多東西') || p >= discoverStop) {
            clearInterval(discoverInterval);
            console.log('clear discoverInterval');
            ptzLog(0, 0, 0);
            $('#notice2').text('停止');
            return;
          }
          if ((
            (j(lmsg, '經驗值') || j(lmsg, '\n獲得了「') || j(lmsg, 'EH+')) && j(lmsg, '■') ||
              (j(lmsg, '□') && fMsg(3, '⊠', '經驗值') || fMsg(3, '□') && j(lmsg, '⊠') && j(lmsg, '經驗值')) && !fMsg(3, '獲得了0經驗值。')
            ) && z > 0) {
            /*for (let i = 1; i < 6; i++) {
              if (j($('.msg-content__text')[$('.msg-content__text').length - i], '升級')) {
                clearInterval(discoverInterval);
                console.log('升級');
                console.log('clearDiscoverInterval');
                return;
                break;
              }
            }*/
            im.send_msg(val);
            z--;
          }
          console.log('z='+z);
          if (plmsg.isSameNode(lmsg)) {
            p++;
          } else {
            p = 0;
          }
          console.log('p='+p);
          ptzLog(p, discoverStop, z);
          plmsg = lmsg;
        };
        discoverInterval = setInterval(discoverIntervalFunc, 2000);
        break;
      case '配點':
        var remainPoint = Number(plmsg.innerText.split('\n')[16].split('：')[1]);
        if (remainPoint > 0) {
          if (z == '' || z > remainPoint) {
            z = remainPoint;
          }
        } else if (remainPoint <= 0) {
          return;
        }
        val += ' ' + y + ' ' + z;
        im.send_msg(val);
        break;
      case '丟棄':
      case '購買':
        val += z > y ? ' ' + y + '到' + z : ' ' + y;
        im.send_msg(val);
        break;
    }
  }

  var j = function(x, y) {
    return x.innerText.includes(y);
  }

  var fMsg = function (x) {
    //y = typeof y == 'string' ? [y] : y;
    var y = Array.from(arguments).slice(1);
    for (let i = 0; i < x; i++) {
      var msg = $('.msg-content__text')[$('.msg-content__text').length - 1 - i];
      for (var u = 0; u < y.length; u++) {
        /*if (j($('.msg-content__text')[$('.msg-content__text').length - 1 - i], y[u])) {
          console.log(y, 'found in prevous', x, 'msg');
          return true;
        }*/
        if (!j(msg, y[u])) {
          break;
        }
      }
      if (u == y.length) {
        console.log(y, 'found in', msg);
        switch (y.toString()) {
          case '升級':
            $('#notice').text('升級,');
            break;
          case '太多':
          case '那麼多東西':
            $('#notice').text('物品滿,');
            break;
          case '吃東西':
          case '餓':
            $('#notice').text('餓,');
            break;
        }
        return true;
      }
    }
    return false;
  };
  var ptzLog = function (p, pMax, tz) {
    $('#pValue').text(p + '/' + pMax);
    $('#tzValue').text(tz);
  };
  var disInterval = setInterval(function () {
    if (!location.search.includes('_bot@186')) {
      if ($('#box').css('display') != 'none') {
        $('#box').hide();
        clearAll();
      }
    } else {
      if ($('#box').css('display') != 'block') {
        $('#box').show();
      }
    }
  }, 1000);