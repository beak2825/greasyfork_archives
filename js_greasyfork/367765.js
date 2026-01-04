// ==UserScript==
// @id                  youdaodict-Popup-forkbyGForkMe.L
// @name                youdaodict-Popup
// @name:zh-CN          有道取词-Popup
// @author              GForkMe.L
// @version             2.0.1.14
// @namespace           https://greasyfork.org/users/12904
// @description         Translate any text selected into a tooltip. Forked from https://greasyfork.org/zh-CN/scripts/12758
// @description:zh-cn   屏幕取词脚本. Forked from https://greasyfork.org/zh-CN/scripts/12758
// @include             *
// @grant               GM_xmlHttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM.xmlHttpRequest
// @grant               GM.setValue
// @grant               GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/367765/youdaodict-Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/367765/youdaodict-Popup.meta.js
// ==/UserScript==
(async function (){
  'use strict';

  var logcount = 1;
  function console_log (...args) {console.log.apply(this, ['[popup]', logcount++].concat(args));}
  if (GM.getValue && GM.setValue) {
    var GM_getValue = GM.getValue;
    var GM_setValue = GM.setValue;
  } else if (!self.GM_getValue && !self.GM_setValue) {
    console_log('GM functions needs grant');
  }
  function set_conf(k, v) {
    settings[k] = v;
    GM_setValue(k, v);
  }

  var settings = await GM_getValue('settings', JSON.parse(`{"popup": {"alt": false, "ctrl": false, "shift": false, "code": 81}, "toggle": {"alt": false, "ctrl": false, "shift": true, "code": 81}}`));
  settings.firstrun = await GM_getValue('firstrun', true);
  settings.disabled = await GM_getValue('disabled', false);
  settings.debugon = await GM_getValue('debugon', false);
  if (settings.firstrun) {
    settings.firstrun = false;
    for (var k in settings) {
      GM_setValue(k, settings[k]);
    }
    console_log('firstrun', settings);
  }

  var curX, curY;

  document.body.addEventListener("mousemove", (e) => {curX = e.pageX; curY = e.pageY;}, false);
  document.body.addEventListener("mouseup", callbackWrapper, false);
  document.body.addEventListener("keyup", callbackWrapper, false);

  function callbackWrapper(e) {
    // settings.debugon && console_log(e);
    if (e.keyCode == settings.toggle.code && e.altKey == settings.toggle.alt && e.shiftKey == settings.toggle.shift) {
      if (settings.disabled) {
        translate();
        document.body.addEventListener("mouseup", callbackWrapper, false);
        set_conf('disabled', false);
      } else {
        clearPopup();
        document.body.removeEventListener("mouseup", callbackWrapper, false);
        set_conf('disabled', true);
      }
    }
    if (settings.disabled) {return;}
    if ((e.type == "keyup" && e.altKey == settings.popup.alt && e.shiftKey == settings.popup.shift && e.keyCode == settings.popup.code) || (e.type == "mouseup")){ //Q
      if (e.type == "mouseup") {
        if (e.altKey){
          document.body.addEventListener("keyup", kupf, false);
        }
      } else {
        translate(e);
      }
      clearPopup()
    }
  }

  var kupf = (k) => {
    if (k.keyCode == 18) {
      clearPopup();
      translate();
      document.body.removeEventListener("keyup", kupf, false);
    }
  }

  function clearPopup() {
    // remove previous .youdaoPopup if exists
    var previous = document.querySelectorAll(".youdaoPopup");
    if (previous.length > 0 && notInTransPop()) {
      for (var i = 0, len = previous.length; i < len; i++) { document.body.removeChild(previous[i]); }
    }
    return true;
  }

  function notInTransPop(){
      var checkNode = document.getSelection().anchorNode.parentNode.parentNode;
      return checkNode && (""+checkNode.className).indexOf("youdaoPopup") == -1;
  }

  function translate(e) {

    // settings.debugon && console_log("translate start");
    var selectObj = document.getSelection();

    // if #text node
    if (selectObj.anchorNode && selectObj.anchorNode.nodeType == 3) {

      //GM_log(selectObj.anchorNode.nodeType.toString());
      var word = selectObj.toString();
      // settings.debugon && console_log("word:", word);
      var ts = new Date().getTime();
      // settings.debugon && console_log("time: ", ts);
      var mx = curX;
      var my = curY;
      if (word == "") {
        return;
      } else if (word.length > 400){
        popup(mx, my, '{"translation":["SELECTED TEXT LENGHT OVER 400."]}');
        return;
      }
      word = encodeURI(word);
      reqTrans(word, ts);
    }

    function popup(mx, my, result) {
      // settings.debugon && console_log(mx);
      // settings.debugon && console_log(my);
      // settings.debugon && console_log("popup window!");
      var youdaoWindow = document.createElement('div');
      youdaoWindow.className = "youdaoPopup";
      // parse
      var dictJSON = JSON.parse(result);
      // settings.debugon && console_log(dictJSON);
      var query = dictJSON.query;
      var errorCode = dictJSON.errorCode;
      if (dictJSON.basic) {
        word();
      } else {
        sentence();
      }
      // main window
      // first insert into dom then there is offsetHeight！IMPORTANT！
      document.body.appendChild(youdaoWindow);
      youdaoWindow.style.color = "black";
      youdaoWindow.style.textAlign = "left";
      youdaoWindow.style.display = "block";
      youdaoWindow.style.position = "absolute";
      youdaoWindow.style.background = "lightblue";
      youdaoWindow.style.borderRadius = "5px";
      youdaoWindow.style.boxShadow = "0 0 5px 0";
      youdaoWindow.style.opacity = "0.9";
      // youdaoWindow.style.width = "260px";
      youdaoWindow.style.wordWrap = "break-word";
      youdaoWindow.style.padding = "5px";
      youdaoWindow.style.zIndex = '999999';
      settings.debugon && console.log(mx, my , document.querySelector('.youdaoPopup'));
      if (mx + document.querySelector('.youdaoPopup').offsetWidth + 10 >= window.document.body.clientWidth) {
        settings.debugon && console.log(true);
        youdaoWindow.style.left = window.document.body.clientWidth - document.querySelector('.youdaoPopup').offsetWidth + "px";
      } else {
        youdaoWindow.style.left = mx + 10 + "px";
      }
      if (my + document.querySelector('.youdaoPopup').offsetHeight + 30 >= window.scrollY + window.innerHeight) {
        youdaoWindow.style.top = window.scrollY + window.innerHeight - document.querySelector('.youdaoPopup').offsetHeight - 20 + "px";
      } else {
        youdaoWindow.style.top = my + 10 + "px";
      }

      function word() {

        function play(word) {
          // settings.debugon && console_log("[DEBUG] PLAYOUND");

          function playSound(buffer) {
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
          }

          var context = new AudioContext();
          var soundUrl = `http://dict.youdao.com/dictvoice?type=2&audio=${word}`;
          var p = new Promise(function(resolve, reject) {
            var ret = GM.xmlHttpRequest({
              method: "GET",
              url: soundUrl,
              responseType: 'arraybuffer',
              onload: function(res) {
                try {
                  context.decodeAudioData(res.response, function(buffer) {
                    resolve(buffer);
                  });
                } catch(e) {
                  reject(e);
                }
              }
            });
          });
          p.then(playSound, function(e) {
            console.log(e);
          });
        }

        var basic = dictJSON.basic;
        var header = document.createElement('p');
        header.className = 'youdaoPopupP';
        // header
        var span = document.createElement('span');
        span.innerHTML = query;
        header.appendChild(span);
        // phonetic if there is
        var phonetic = basic.phonetic;
        if (phonetic) {
          var phoneticNode = document.createElement('span');
          phoneticNode.innerHTML = '[' + phonetic + ']';
          phoneticNode.style.cursor = "pointer";
          header.appendChild(phoneticNode);
          var playLogo = document.createElement('span');
          header.appendChild(phoneticNode);
          phoneticNode.addEventListener('mouseup', function(e){
            if (e.target === phoneticNode) {
              e.stopPropagation();
              play(query);
            }
          }, false);
        }
        header.style.color = "darkBlue";
        header.style.margin = "0";
        header.style.padding = "0";
        span.style.fontweight = "900";
        span.style.color = "black";

        youdaoWindow.appendChild(header);
        var hr = document.createElement('hr');
        hr.className = 'youdaoPopupHr';
        hr.style.margin = "0";
        hr.style.padding = "0";
        hr.style.height = "1px";
        hr.style.borderTop = "dashed 1px black";
        youdaoWindow.appendChild(hr);
        var ul = document.createElement('ul');
        ul.className = 'youdaoPopupUl';
        // ul style
        ul.style.margin = "0";
        ul.style.padding = "0";
        basic.explains.map(function(trans) {
          var li = document.createElement('li');
          li.style.listStyle = "none";
          li.style.margin = "0";
          li.style.padding = "0";
          li.style.background = "none";
          li.style.color = "inherit";
          li.appendChild(document.createTextNode(trans));
          ul.appendChild(li);
        });
        youdaoWindow.appendChild(ul);

      }

      function sentence() {
        var ul = document.createElement('ul');
        ul.className = 'youdaoPopupUl';
        // ul style
        ul.style.margin = "0";
        ul.style.padding = "0";
        dictJSON.translation.map(function(trans) {
          var li = document.createElement('li');
          li.style.listStyle = "none";
          li.style.margin = "0";
          li.style.padding = "0";
          li.style.background = "none";
          li.style.color = "inherit";
          li.appendChild(document.createTextNode(trans));
          ul.appendChild(li);
        });
        youdaoWindow.appendChild(ul);
      }
    }


    function reqTrans(word, ts) {
      var reqUrl = `http://fanyi.youdao.com/openapi.do?type=data&doctype=json&version=1.1&relatedUrl=http%3A%2F%2Ffanyi.youdao.com%2F%23&keyfrom=fanyiweb&key=null&translate=on&q=${word}&ts=${ts}`;
      // settings.debugon && console_log("request url: ", reqUrl);
      var ret = GM.xmlHttpRequest({
        method: "GET",
        url: reqUrl,
        headers: {"Accept": "application/json"}, // can be omitted...
        onreadystatechange: function(res) {
          // settings.debugon && console_log("Request state changed to: " + res.readyState);
        },
        onload: function(res) {
          var retContent = res.response;
          // settings.debugon && console_log(retContent);
          popup(mx, my, retContent);
        },
        onerror: function(res) {
          console.log("error");
        }
      });
    }
  }
})();