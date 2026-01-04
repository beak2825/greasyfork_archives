// ==UserScript==
// @name     NitasToolBox
// @version  2.0
// @namespace NitasToolBox_plugin
// @match https://www.wolai.com/*
// @description NitaToolBox浏览器插件
// @author Nita
// @downloadURL https://update.greasyfork.org/scripts/439809/NitasToolBox.user.js
// @updateURL https://update.greasyfork.org/scripts/439809/NitasToolBox.meta.js
// ==/UserScript==

(

function() {
    'use strict';
    var todoid = "((id#8tiTnAkCi7Pi3sPPovYnMr))";
    var Importantid = "((id#3NHZ84Ak5LX94DjMQFdmWr))";

    document.onkeydown = function (e)
    {
        e = e || window.event; //标准化事件对象
        var obj = e.srcElement;
        console.log("进入"+e.keyCode);
        console.log("altKey"+ e.altKey);

        if (e.keyCode == 113 ) {
            setCopyVaule(todoid);
        }
        if (e.altKey && e.keyCode == 49 ) {
            setCopyVaule(Importantid);
        }
    }
   function setCopyVaule(value,str)
    {
        debugger;
        const input = document.createElement('input');
        document.body.appendChild(input);input.setAttribute('readonly', 'readonly');
        input.setAttribute('value',value);
        document.body.appendChild(input);
        input.setSelectionRange(0, 9999);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
         debugger;
         //window.clipboardData.setData("Text", str);//设置数据
        document.body.removeChild(input);
    }
  function fireKeyEvent(el, evtType, keyCode) {
   debugger;
  var evtObj;
  if (document.createEvent) {
      if (window.KeyEvent) {//firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents');
          evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
      } else {//chrome 浏览器下模拟事件
          //evtObj = document.createEvent('UIEvents');
           evtObj = new UIEvent(evtType);

          delete evtObj.keyCode;
          if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
               console.log('keyCode'+keyCode);
              Object.defineProperty(evtObj, "keyCode", { value: keyCode });
          } else {
              evtObj.key = String.fromCharCode(keyCode);
          }

          if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
              Object.defineProperty(evtObj, "ctrlKey", { value: true });
               console.log('ctrlKey'+ true);
          } else {
              evtObj.ctrlKey = true;
          }
      }
      el.dispatchEvent(evtObj);

  } else if (document.createEventObject) {//IE 浏览器下模拟事件
      evtObj = document.createEventObject();
      evtObj.keyCode = keyCode
      el.fireEvent('on' + evtType, evtObj);
  }
}
}
)();




