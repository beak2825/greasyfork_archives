// ==UserScript==
// @name        pageSpeak
// @name:zh-CN  中英文语音合成选读
// @namespace   tts@reverland.org
// @description text to speech Service from responsivevoice.org to read aloud the page
// @description:zh-CN    调用responsivevoice.org的语音合成服务朗读选中文本
// @include     *
// @version     1.1
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/14492/pageSpeak.user.js
// @updateURL https://update.greasyfork.org/scripts/14492/pageSpeak.meta.js
// ==/UserScript==

window.document.body.addEventListener("keyup", toggleTTS, true);
//window.document.body.addEventListener("mouseup", tts, false);

GM_registerMenuCommand("start/stop tts", toggleTTS, "t");
var toggle = false;
var progressBar = document.createElement('progress');
progressBar.style.position = "fixed";
progressBar.style.left = "0";
progressBar.style.bottom = "0";
progressBar.style.display = "none";
progressBar.style.zIndex = "99999";
document.body.appendChild(progressBar);
// 播放状态
var playing = false;

function toggleTTS(e) {
  if (e && e.which == 69 && e.ctrlKey || !e) {//ctrl-e
    if (toggle) {
      window.document.body.removeEventListener("mouseup", tts, false);
      console.log("pageSpeak Stop...")
      toggle = false;
    } else {
      window.document.body.addEventListener("mouseup", tts, false);
      console.log("pageSpeak Start...")
      toggle = true;
    }
  }
}

function tts(e) {
  var text = getText(e);
  if (!text) {
    return;
  }
  progressBar.style.display = "block";
  //console.log("text to speech: ", text);
  play(text);
}


function getText(e) {
  var selectObj = document.getSelection();

  // if #text node
  if (selectObj.anchorNode.nodeType == 3) {
    //GM_log(selectObj.anchorNode.nodeType.toString());
    var word = selectObj.toString();
    if (word == "") {
      return;
    }
    // merge multiple spaces
    word = word.replace(/\s+/g, ' ');
    // linebreak wordwrap, optimize for pdf.js
    word = word.replace('-\n','');
    // multiline selection, optimize for pdf.js
    word = word.replace('\n', ' ');
    //console.log("word:", word);
  }
  return word
}

// split by 100 length
function *split(text, maxLength) {
  var index = 0;
  var regZh = /[\u4E00-\u9FD5]+/g
  var step = maxLength;
  if (!regZh.test(text)) {
    // en-US断句在标点边界
    var counter = 0;
    while (index < text.length && counter < 20) {
      step = maxLength;
      counter++;
      // search step;
      // dirty hack 10 is ok!
      for (let i =0; i < (((text.length - index) < 10)?(text.length - index):10); i++) {
        if (/^[\s.,?!]+$/m.test(text.substr(index + step, 1))) {
          step += 1
          break;
        } else {
          step -= 1;
        }
        if (step == 0) {
          // 包括最后一个字符
          step = maxLength + 1;
          break;
        }
      }
      yield text.slice(index, index + step);
      index += step;
    }
  } else {
    // chinese!
    var reg = /[a-zA-Z\s]+/g
    var counter = 0;
    while (index < text.length && counter < 20) {
      counter++;
      let result = reg.exec(text);
      if (result) {
        yield text.slice(index, result.index);
        yield result[0];
        step = result.index - index + result[0].length;
      } else {
        yield text.slice(index, index + maxLength);
        step = maxLength;
      }
      index += step;
    }
  }
}

function play(text) {
  //console.log("[DEBUG] PLAYOUND")
  var context = new AudioContext();
  var voices = [];
  //var reg = /[\u4E00-\u9FD5]+/g
  var reg = /[\u4E00-\u9FCC]+/g
  for (let s of split(text, 100)) {
    if (!s) {
      return;
    }
    if (!reg.test(s)) {
      LANG = 'en-US';
    } else {
      LANG = 'zh-CN';
    }
    //var soundUrl = `https://code.responsivevoice.org/getvoice.php?t=${s}&tl=${LANG}&sv=&vn=&pitch=0.5&rate=0.5&vol=1`
    var soundUrl = `https://code.responsivevoice.org/develop/getvoice.php?t=${s}&tl=${LANG}&sv=&vn=&pitch=0.5&rate=0.5&vol=1`
    var p = new Promise(function(resolve, reject) {
      // console.log("text parts: ", s);
      var ret = GM_xmlhttpRequest({
        method: "GET",
        url: soundUrl,
        responseType: 'arraybuffer',
        onload: function(res) {
          try {
            // console.log("get data", res.statusText);
            resolve(res.response);
            progressBar.setAttribute('value', progressBar.getAttribute('value') + 1);
          } catch(e) {
            reject(e);
          }
        }
      });
    });
    voices.push(p);
  }
  progressBar.setAttribute('max', voices.length);
  progressBar.setAttribute('value', 0);
  Promise.all(voices).then(playSound, e=>console.log(e));

  function playSound(bufferList) {
    // finish
    progressBar.style.display = "none";
    var reader = new FileReader();
    var blob = new Blob(bufferList, {type: 'application/octet-binary'});
    reader.addEventListener("loadend", function() {
      var buffer = reader.result;
      //console.log("final ArrayBuffer:", buffer);
      context.decodeAudioData(buffer, function(buffer) {
        if (playing) {
          console.log('playing: ', playing);
          try {
            source.stop();
            playing = false;
          } catch (e) {
            console.log(e);
          }
        }
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        playing = true;
        source.onended = () => {playing = false;}
      })
    });
    reader.readAsArrayBuffer(blob);
  }
}
