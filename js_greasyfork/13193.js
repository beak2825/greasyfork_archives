// ==UserScript==
// @name        baiduCloudInput
// @name:zh-CN  百度云输入法
// @namespace   baiduIME@reverland.org
// @description input method in browser based on baidu online input method.
// @description:zh-CN 在浏览器中自由使用百度在线输入法
// @include     *
// @version     1.2
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13193/baiduCloudInput.user.js
// @updateURL https://update.greasyfork.org/scripts/13193/baiduCloudInput.meta.js
// ==/UserScript==
//
// DONE:
// : 弹窗相对于body的位置
// : 插入词而不是在结束时附加
// : 最上层！！
// : ff/chromium兼容
//
// TODO: CHIANFIND_RES特性
// TODO: 边沿检测特性
// TODO: 完善中文标点
//
// `+/-` 翻页
// `Space/1/2/3/4/5` 选词
// `Shift` 全角/半角逗号句号
//

document.body.addEventListener('keydown', configQuanjiao);
function configQuanjiao(e) {
  if (e.which == 16) {
    IME.quanjiao = !IME.quanjiao;
    console.log(e);
    e.preventDefault();
  }
}

var IME = {
  status: 'hidden',
  output: '',
  inputString: '',
  TEXTS: [],
  page: 0,
  quanjiao: true,
}


setTimeout(function() {
    var tts = document.getElementsByTagName("textarea");
    for(var i = 0; i < tts.length; i++) {
        initIME(tts[i]);
    }
    var tts = document.getElementsByTagName("input");
    for(var i = 0; i < tts.length; i++) {
        initIME(tts[i]);
    }
}, 2000); // 为了等待文本框装载进DOM

function initIME(tt) {
    console.log("[DEBUG]", tt);

    var imePop = document.createElement('div');

    initImePop();

    tt.addEventListener('keydown', checkNonCharacter);
    tt.addEventListener('keyup', reqAndRefresh);

    tt.addEventListener('keypress', intercept); 

    function checkNonCharacter(e) {
      if (IME.status == 'POPUP') {
        switch (String.fromCharCode(e.which)) {
          case String.fromCharCode(8):
            e.preventDefault();

          IME.inputString = IME.inputString.substr(0, IME.inputString.length - 1);
          if (IME.inputString.length == 0) {
            IME.status = 'hidden';
            showImePop(false);
          }
          break;
          case String.fromCharCode(13):
            e.preventDefault();
          var curStart = tt.selectionStart;
          var curEnd = tt.selectionEnd;
          tt.value = tt.value.substring(0, curStart) + IME.inputString + tt.value.substring(curEnd, tt.value.length);
          tt.selectionStart = curStart + IME.inputString.length;
          tt.selectionEnd = curStart + IME.inputString.length;

          IME.inputString = "";
          IME.status = 'hidden';
          showImePop(false);
          break;
        }
      }
      imePop.querySelector('p').innerHTML = IME.inputString;
    } 

    function reqAndRefresh(e) {
      imePop.querySelector('p').innerHTML = IME.inputString;
      // reconize key finish
      // console.log("[IME.inputString] ", IME.inputString);

      var p = new Promise(function(resolve, reject) {
        var ret = GM_xmlhttpRequest({
          method: "GET",
          url: `http://olime.baidu.com/py?input=${IME.inputString}&inputtype=py&bg=0&ed=100&result=hanzi&resultcoding=unicode&ch_en=0&clientinfo=web&version=1`,
          onload: function(res) {
            //console.log("[DEBUG connect]")
            resolve(res.responseText);
          }
        })
      });

      p.then(parseJSON).then(parseRes, printError);
    }

    function initImePop() {
      imePop.setAttribute('id', 'baidu-cloud-input-imePop');
      imePop.style.position = "absolute";
      imePop.style.width = "300px";
      //imePop.style.height = "80px";
      imePop.style.background = "lightblue";
      imePop.style.borderRadius = "5px";
      imePop.style.display = "none";
      imePop.style.boxShadow = "0 0 3px 0px black"
      imePop.style.zIndex = "9999999";
      var echo = document.createElement('p');
      echo.style.height = "1.5em";  //只为防止抖动
      echo.style.lineHeight = "1.5em";
      echo.style.fontSize = "1em";
      echo.style.margin = "0";
      echo.style.padding = "0";
      echo.style.paddingLeft = "0.5em";
      echo.style.color = "darkblue";
      echo.style.fontStyle = "bold";
      imePop.appendChild(echo);
      var tips = document.createElement('ol');
      tips.style.margin = "0px";
      tips.style.padding = "0px";
      tips.style.color = "black";
      var tip = [];
      for (var i = 0; i < 5; i++) {
        tip[i] = document.createElement('li');
        tip[i].style.margin = "0px";
        tip[i].style.padding = "0px";
        tip[i].style.marginLeft = "2em";
        tip[i].style.listStyleType = "decimal";
        tips.appendChild(tip[i]);
      }
      document.body.appendChild(imePop);
      var hr = document.createElement('hr')
      hr.style.marginTop = "0";
      hr.style.marginBottom = "0.2em"
      hr.style.color = "grey";
      imePop.appendChild(hr);
      imePop.appendChild(tips);
    }

    function showImePop(state) {
      if (state) {
        var coordinates = getCaretCoordinates(tt, tt.selectionEnd);
        var textAreaTop = findPos(tt)[1] + 20;
        var textAreaLeft = findPos(tt)[0];
        imePop.style.left = textAreaLeft + coordinates.left + "px";
        imePop.style.top = textAreaTop -tt.scrollTop + coordinates.top + "px";
        imePop.style.display = "block";
      } else {
        imePop.style.display = 'none';
      }
    }

    function findPos(obj) {
      var curleft = curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return [curleft,curtop];
    }


    function intercept(e){
      // control keys
      if (e.ctrlKey) {
        return;
      }
      if (IME.status == 'POPUP') {
        switch (String.fromCharCode(e.which)) {
          case " ":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            e.preventDefault();
          var index = String.fromCharCode(e.which) == " "?0:parseInt(String.fromCharCode(e.which)) - 1;
          console.log(index);
          var curStart = tt.selectionStart;
          var curEnd = tt.selectionEnd;
          var selectedText = imePop.querySelector('ol').children[index].textContent;
          tt.value = tt.value.substring(0, curStart) + selectedText + tt.value.substring(curEnd, tt.value.length);
          tt.selectionStart = curStart + selectedText.length;
          tt.selectionEnd = curStart + selectedText.length;
          IME.inputString = "";
          IME.status = 'hidden';
          showImePop(false);
          break;
          case "a":
            case "b":
            case "c":
            case "d":
            case "e":
            case "f":
            case "g":
            case "h":
            case "i":
            case "j":
            case "k":
            case "l":
            case "m":
            case "n":
            case "o":
            case "p":
            case "q":
            case "r":
            case "s":
            case "t":
            case "u":
            case "v":
            case "w":
            case "x":
            case "y":
            case "z":
            case "'":
            e.preventDefault();
          IME.inputString += String.fromCharCode(e.which);
          break;
          // {
          case "=":
            e.preventDefault();
          IME.page += 1;
          //console.log("[DEBUG]", IME.page);
          if (IME.page < IME.TEXTS.length / 5) {
            updateList(IME.page);
          } else {
            IME.page -= 1;
          }
          return;
          case "-":
            e.preventDefault();
          IME.page = IME.page == 0?IME.page:IME.page - 1;
          //console.log("[DEBUG]", IME.page);
          updateList(IME.page);
          return;
          // }
          default:
            e.preventDefault();
        }
      } else if (IME.status == 'hidden') {
        switch (String.fromCharCode(e.which)) {
          case ",":
            if (IME.quanjiao) {
              e.preventDefault();
              var curStart = tt.selectionStart;
              var curEnd = tt.selectionEnd;
              tt.value = tt.value.substring(0, curStart) + '，' + tt.value.substring(curEnd, tt.value.length);
              tt.selectionStart = curStart + '，'.length;
              tt.selectionEnd = curStart + '，'.length;
              return;
            }
          break;
          case ".":
            if (IME.quanjiao) {
              e.preventDefault();
            var curStart = tt.selectionStart;
            var curEnd = tt.selectionEnd;
            tt.value = tt.value.substring(0, curStart) + '。' + tt.value.substring(curEnd, tt.value.length);
            tt.selectionStart = curStart + '。'.length;
            tt.selectionEnd = curStart + '。'.length;
            return;
          }
          break;
          case "a":
            case "b":
            case "c":
            case "d":
            case "e":
            case "f":
            case "g":
            case "h":
            case "i":
            case "j":
            case "k":
            case "l":
            case "m":
            case "n":
            case "o":
            case "p":
            case "q":
            case "r":
            case "s":
            case "t":
            case "u":
            case "v":
            case "w":
            case "x":
            case "y":
            case "z":
            case "'":
            e.preventDefault();
          if (IME.inputString.length == 0) {
            IME.inputString += String.fromCharCode(e.which);
            IME.status = 'POPUP';
            showImePop(true);
          }
          IME.page = 0;
          break;
          default:
            void(0);
        }
      }
    };

    function printError(err) {
      console.log(err);
    };

    function parseRes(resObj) {
      // console.log("[resObj]", resObj);
      if (resObj['errno'] != 0) {
        return;
      }
      var text = resObj['result'][0];
      // console.log("[text]", text[0][0])
      for (var i = 0; i < text.length; i++) {
        IME.TEXTS[i] = text[i][0];
      }
      updateList(IME.page);
    }

    function updateList(page) {
      for (var i = 0; i < 5; i++) {
        imePop.querySelector('ol').children[i].innerHTML = IME.TEXTS[page * 5 + i];
        if (page * 5 + i >= IME.TEXTS.length) {
          imePop.querySelector('ol').children[i].innerHTML = "--"
        }
      }
    }

    function parseJSON(text) {
      // console.log("JSON response from baidu: ", text);
      var resObj = JSON.parse(text);
      return resObj;
    }

    // this function comes from https://github.com/component/textarea-caret-position/blob/master/index.js
    function getCaretCoordinates(element, position) {
      var properties = [
        'direction',  // RTL support
        'boxSizing',
        'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        'height',
        'overflowX',
        'overflowY',  // copy the scrollbar for IE

        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',

        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',

        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',

        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',  // might not make a difference, but better be safe

        'letterSpacing',
        'wordSpacing',

        'tabSize',
        'MozTabSize'

      ];
      // mirrored div
      var div = document.createElement('div');
      div.id = 'input-textarea-caret-position-mirror-div';
      document.body.appendChild(div);

      var style = div.style;
      var computed = window.getComputedStyle? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

      // default textarea styles
      style.whiteSpace = 'pre-wrap';
      if (element.nodeName !== 'INPUT')
        style.wordWrap = 'break-word';  // only for textarea-s

      // position off-screen
      style.position = 'absolute';  // required to return coordinates properly
      style.visibility = 'hidden';  // not 'display: none' because we want rendering

      // transfer the element's properties to the div
      properties.forEach(function (prop) {
        style[prop] = computed[prop];
      });

      var isFirefox = window.mozInnerScreenX != null;
      if (isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height))
          style.overflowY = 'scroll';
      } else {
        style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
      }

      div.textContent = element.value.substring(0, position);
      // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
      if (element.nodeName === 'INPUT')
        div.textContent = div.textContent.replace(/\s/g, "\u00a0");

      var span = document.createElement('span');
      // Wrapping must be replicated *exactly*, including when a long word gets
      // onto the next line, with whitespace at the end of the line before (#7).
      // The  *only* reliable way to do that is to copy the *entire* rest of the
      // textarea's content into the <span> created at the caret position.
      // for inputs, just '.' would be enough, but why bother?
      span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
      div.appendChild(span);

      var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
      };

      document.body.removeChild(div);

      return coordinates;
    }
}


