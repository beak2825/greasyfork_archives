// ==UserScript==
// @name        HTML5快速鍵hotkeys
// @namespace   https://greasyfork.org/zh-TW/users/4839-leadra
// @version     1.3.2
// @license     AGPLv3
// @author      jcunews
// @description HTML5快速鍵控制跳秒+速度+寬高比+截圖
// @match       https://www.youtube.com/*
// @match       https://ani.gamer.com.tw/*
// @match       https://web.telegram.org/k/*
// @match       *://*/*
// @grant       none
// @run-at      document-start
// @icon        https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/487825/HTML5%E5%BF%AB%E9%80%9F%E9%8D%B5hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/487825/HTML5%E5%BF%AB%E9%80%9F%E9%8D%B5hotkeys.meta.js
// ==/UserScript==

/*
鍵盤快速鍵(大小寫通用)：
[A] = 後退 秒 1
[D] = 前進 秒 1
[←]左鍵 = 後退 秒 3
[→]右鍵 = 前進 秒 3
CTRL+[←]左鍵 = 後退 秒 30
CTRL+[→]右鍵 = 前進 秒 30
SHIFT+[←]左鍵← = 後退 秒 60
SHIFT+[→]右鍵→ = 前進 秒 60
SHIFT+[A] = 後退 秒 30
SHIFT+[D] = 前進 秒 30
SHIFT+Alt+[A] = 後退 秒 99999
SHIFT+Alt+[D] = 前進 秒 99999
CTRL+[,] = 後退 秒 1/30
CTRL+[.] = 前進 秒 1/30
SHIFT+[0] ~ [9] = 跳至 5%、15%、25%...95%
Alt+[1] ~ [0] = 將音量改為 10%、20%...90%、0%
Alt+[`] = 將音量改為 5%
[-],[Z] = 速度 -0.2 倍(預設)
[+],[X] = 速度 +0.2 倍(預設)
SHIFT+[X] = 速度 +1 倍
[*],[C],SHIFT+[Z] = 速度復原
CTRL+['] = 更改預設速度
CTRL+[\] = 更改速度倍率
SHIFT+[S] = 截圖(JPG可改)

對於寬螢幕視窗：
CTRL+6 = 變更寬螢幕內容的影片寬高比。 修正寬螢幕內容縮小為 4:3 電視格式的問題。
CTRL+7 = 更改內容的影片寬高比。 修正 4:3 內容拉伸為寬螢幕格式的問題。
CTRL+8 = 更改內容的影片寬高比。 修正 4:3 內容拉伸為寬螢幕格式的問題。
對於 4:3 視窗：
CTRL+SHIFT+6 = 變更超寬螢幕內容的影片寬高比。 修正壓縮為 4:3 電視格式的超寬螢幕內容。
CTRL+SHIFT+7 = 縮放 4:3 信箱內容以刪除頂部+底部邊框的一半，同時也刪除一點左側+右側的內容。(這也可用於在寬螢幕視窗上半縮放超寬螢幕內容。 即 CTRL+6 的半縮放。)
CTRL+SHIFT+8 = 變更寬螢幕內容的影片寬高比。 修正壓縮為 4:3 電視格式的寬螢幕內容。
對於任何視窗：
CTRL+9 = 重置影片寬高比
*/

((eleOSD, osdTimer) => {
    var forceMediaSeekOnArrowKeyDomains = new RegExp(`
www.alibaba.com *.aliexpress.com *.amazon.com
www.facebook.com
www.tiktok.com
`.trim().split(/\s+/).map(
    s => "^" + s.replace(/([\$\^\(\)\+\[\]\{\}\|\\\?])/gi, "\\$1").replace(/\*/gi, "[^\.]+") + "$"
  ).join("|"), "i");


  //速度倍率
  var incrementUnit = 0.2;
  //變更播放速率時螢幕右下提示 (OSD) 的持續時間(以毫秒為單位)。 設定為零或更少以停用。
  var osdTimeout = 500;
  //截圖格式jpeg, png
  var imageFormat = "jpeg";

 //鍵盤快速鍵。
   // 每個鍵名可以是該鍵產生的字元(例如 'a'、'4'、'*' 等)，
   // 例如 'Digit2'、'BracketLeft' 等兩種類型都區分大小寫。
   //修飾符 = "C"、"S"和"A"的任意組合，大小寫通用，用於 Ctrl、Shift 和 Alt 鍵。
  //caseSensitive = `true` 如果鍵名區分大小寫。如果省略，則預設不區分大小寫。
  var keys = [
    /*{ //0 to 9: 跳到 0%,10%,20%,...90%
      key: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], modifiers: "",
      func: (ele, key, keyIndex) => ele.currentTime = keyIndex / 10 * ele.duration
    },*/
    { //shift+0 to shift+9: 跳到 5%,15%,25%,...95%
      key: [")", "!", "@", "#", "$", "%", "^", "&", "*", "("], modifiers: "SA",
      func: (ele, key, keyIndex) => ele.currentTime = (keyIndex + 0.5) / 10 * ele.duration
    },
    { //Alt+1~Alt+0 = 將音量改為 10%、20%...90%、0%
      key: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], modifiers: "A",
      func: (ele, key, keyIndex)  => updAudioVolume(ele, (parseInt(key) * 1) / 10)
    },
    { //Alt+` = 將音量改為 5%
      key: ["`"], modifiers: "A",
      func: (ele, key, keyIndex)  => updAudioVolume(ele, 0.05)
    },
    //前進後退
    { //left: rewind media by 5 seconds. if forceMediaSeekOnArrowKeyDomains matches
      key: (forceMediaSeekOnArrowKeyDomains.test(location.hostname) && "ArrowLeft") || "", modifiers: "",
      func: (ele, key) => ele.currentTime -= 5
    },
    { //right: fast forward media by 5 seconds. if forceMediaSeekOnArrowKeyDomains matches
      key: (forceMediaSeekOnArrowKeyDomains.test(location.hostname) && "ArrowRight") || "", modifiers: "",
      func: (ele, key) => ele.currentTime += 5
    },
    {
      key: ["a"], modifiers: "",
      func: (ele, key) => ele.currentTime -= 1
    },
    {
      key: ["d"], modifiers: "",
      func: (ele, key) => ele.currentTime += 1
    },
    {
      key: "ArrowLeft", modifiers: "",
      func: (ele, key) => ele.currentTime -= 3
    },
    {
      key: "ArrowRight", modifiers: "",
      func: (ele, key) => ele.currentTime += 3
    },
    {
      key: "ArrowLeft", modifiers: "C",
      func: (ele, key) => ele.currentTime -= 30
    },
    {
      key: "ArrowRight", modifiers: "C",
      func: (ele, key) => ele.currentTime += 30
    },
    {
      key: "ArrowLeft", modifiers: "S",
      func: (ele, key) => ele.currentTime -= 60
    },
    {
      key: "ArrowRight", modifiers: "S",
      func: (ele, key) => ele.currentTime += 60
    },
    {
      key: ["a"], modifiers: "S",
      func: (ele, key) => ele.currentTime -= 30
    },
    {
      key: ["d"], modifiers: "S",
      func: (ele, key) => ele.currentTime += 30
    },
    {
      key: ["a"], modifiers: "SA",
      func: (ele, key) => ele.currentTime -= 99999
    },
    {
      key: ["d"], modifiers: "SA",
      func: (ele, key) => ele.currentTime += 99999
    },
    {
      key: ",", modifiers: "C",
      func: (ele, key) => ele.currentTime -= 1/30
    },
    {
      key: ".", modifiers: "C",
      func: (ele, key) => ele.currentTime += 1/30
    },
    //速度-
    {
      key: ["z","-"], modifiers: "",
      func: (ele, key) => {
        key = ele.playbackRate - incrementUnit;
        if (key < 0.1) {
          key = 0.1;
        } else if ((key < 1) && (ele.playbackRate > 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    //速度+
    {
      key: ["x","+"], modifiers: "",
      func: (ele, key) => {
        key = ele.playbackRate + incrementUnit;
        if (key > 16) {
          key = 16;
        } else if ((key > 1) && (ele.playbackRate < 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    //速度+1X
    {
      key: ["x"], modifiers: "S",
      func: (ele, key) => {
        key = ele.playbackRate + incrementUnit ;
        if (key > 16) {
          key = 16;
        } else if ((key > 1) && (ele.playbackRate < 1)) key = 1;
        updVideoSpeed(ele, key);
        key = ele.playbackRate + incrementUnit ;
        updVideoSpeed(ele, key);
        key = ele.playbackRate + incrementUnit ;
        updVideoSpeed(ele, key);
        key = ele.playbackRate + incrementUnit ;
        updVideoSpeed(ele, key);
        key = ele.playbackRate + incrementUnit ;
        updVideoSpeed(ele, key);
      }
    },
    //速度復原1x
    {
      key: ["c","*"], modifiers: "",
      func: (ele, key) => {updVideoSpeed(ele, 1)}
    },
    {
      key: ["z"], modifiers: "S",
      func: (ele, key) => {updVideoSpeed(ele, 1)}
    },
    //ctrl+': 更改預設速度
    {
      key: "'", modifiers: "C",
      func: (ele, key) => {
        if ((key = prompt("Enter media speed from 0.1 to 16 (inclusive).\ne.g.: 1 = Normal, 0.5 = Half, 2 = Double, 3 = Triple, etc.", ele.playbackRate)) === null) return;
        if (isNaN(key = parseFloat(key.trim()))) {
          alert("Input must be a number.");
          return;
        }
        updVideoSpeed(ele, (key = parseFloat(key.toFixed(1))) < 0.1 ? 0.1 : (key > 16 ? 16 : key));
      }
    },
    //ctrl+\: 更改速度倍率
    {
      key: "\\", modifiers: "C",
      func: (ele, key) => {
        if ((key = prompt("Enter unit of media speed increment/decrement from 0.1 to 4 (inclusive).", incrementUnit)) === null) return;
        if (!isNaN(key = parseFloat(key.trim()))) {
          incrementUnit = (key = parseFloat(key.toFixed(1))) < 0.1 ? 0.1 : (key > 4 ? 4 : key);
        } else alert("Input must be a number.");
      }
    },
    //截圖screenshot
    {
      key: ["S"], modifiers: "S", videoOnly: true,
      func: (ele, key) => screenshot()
    },
    //對於寬螢幕視窗ctrl+6.7.8
    {
      key: "6", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleX(1.3333)", "Widescreen")
    },
    {
      key: "7", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(1.3333)", "Letterbox")
    },
    {
      key: "8", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleX(0.75)", "TV")
    },
    //對於 4:3 視窗CTRL+SHIFT+6.7.8
    {
      key: "Digit6", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(0.7168)", "Ultra Widescreen")
    },
    {
      key: "Digit7", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scale(1.1666)", "Letterbox Half-Zoom")
    },
    {
      key: "Digit8", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(0.5625)", "Widescreen On TV")
    },
    //CTRL+9 = 重置影片寬高比
    {
      key: "9", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("", "Reset")
    }
  ];
  keys.forEach((k, s, m) => {
    if ((k.modifiers === undefined) || !k.modifiers.toUpperCase) k.modifiers = "";
    s = k.modifiers.toUpperCase();
    k.modifiers = {ctrl: s.includes("C"), shift: s.includes("S"), alt: s.includes("A")}
  });

//截圖設定
 function screenshot(ele, cv) {
    if (ele = document.querySelector("video")) {
      cv = document.createElement("CANVAS");
      if (cv.width = ele.videoWidth) {
        cv.height = ele.videoHeight;
        cv.getContext("2d").drawImage(ele, 0, 0);
        ele = document.createElement("A");
        ele.href = cv.toDataURL("image/" + imageFormat);
        const VideoElement = document.querySelector('video');
        const CurrentTime = VideoElement.currentTime;
        const Hours = Math.floor(CurrentTime / 3600);
        const Minutes = Math.floor((CurrentTime % 3600) / 60);
        const Seconds = Math.floor(CurrentTime % 60);
        const FormattedTime = `${Hours.toString().padStart(2, '0')}h${Minutes.toString().padStart(2, '0')}m${Seconds.toString().padStart(2, '0')}s`;
        ele.download = document.title + `-${FormattedTime}.${imageFormat === "jpeg" ? "jpg" : imageFormat}`;//
        ele.style.visibility = "hidden";
        document.body.appendChild(ele).click();
        ele.remove();
        return;
      } else {
        alert("The HTML5 video media has not been loaded yet.");
      }
    } else {
      alert("There is no HTML5 video on this page.");
    }
  };
    var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);

  //提示框
  function showOSD(s) {
    if (osdTimeout < 0) return;
    if (eleOSD) {
      eleOSD.textContent = s;
    } else {
      eleOSD = document.createElement("DIV");
      eleOSD.style.cssText = "position:fixed;z-index:999999999;right:.5rem;bottom:.5rem;margin:0;padding:.2rem .5rem .1rem .5rem;width:auto;height:auto;font:normal 16pt/normal sans-serif;background:#444;color:#fff";
      eleOSD.textContent = s;
      document.body.appendChild(eleOSD);
    }
    clearTimeout(osdTimer);
    osdTimer = setTimeout(() => {
      eleOSD.remove();
      eleOSD = null;
    }, osdTimeout);
  }

  function stopEvent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }

  function updVideoSpeed(ele, spd, e) {
    // if ((location.hostname === "www.youtube.com") && (e = ele.parentNode.parentNode).setPlaybackRate && (spd >= 0.25) && (spd <= 2)) {
    //   e.setPlaybackRate(spd = parseFloat(spd.toFixed(1)));
    // } else ele.playbackRate = spd = parseFloat(spd.toFixed(1));
    ele.playbackRate = spd = parseFloat(spd.toFixed(1));
    showOSD("Speed " + spd + "x");
  }

  function updVideoAspect(asp, label, s) {
    if (!(s = document.getElementById("vidAspOvr"))) document.body.appendChild(s = document.createElement("STYLE")).id = "vidAspOvr";
    s.innerHTML = html(asp ? `video{transform:${asp}!important}` : "");
    showOSD("Ratio: " + label);
  }

  function updAudioVolume(ele, vol, e) {
    if ((location.hostname === "www.youtube.com") && (e = ele.parentNode.parentNode).setVolume) {
      e.setVolume(vol * 100);
    } else ele.volume = vol;
    showOSD("Audio " + (vol * 100) + "%");
  }

  function isVisible(ele) {
    while (ele && ele.tagName) {
      if (getComputedStyle(ele).display === "none") return false;
      ele = ele.parentNode
    }
    return true
  }

  incrementUnit = parseFloat((incrementUnit < 0.1 ? 0.1 : (incrementUnit > 1 ? 1 : incrementUnit)).toFixed(1));
  addEventListener("keydown", function(ev, ele, evkey, evcode, kkey) {
    if (
      (!(ele = document.activeElement) || !((ele.contentEditable === "true") || ["INPUT", "SELECT", "TEXTAREA"].includes(ele.tagName))) &&
      (ele = Array.prototype.find.call(document.querySelectorAll("video,audio"), e => !isNaN(e.duration)))
    ) {
      keys.some((k, a, i) => {
        a = !!k.key.sort;
        evkey = k.caseSensitive ? ev.key : ev.key.toUpperCase();
        evcode = k.caseSensitive ? ev.code : ev.code.toUpperCase();
        kkey = k.caseSensitive ? k.key : (a ? k.key.map(s => s.toUpperCase()) : k.key.toUpperCase());
        if (
          ((!a && ((kkey === evcode) || (kkey === evkey))) || (a && (((i = kkey.indexOf(evcode)) >= 0) || ((i = kkey.indexOf(evkey)) >= 0)))) &&
          (k.modifiers.ctrl === ev.ctrlKey) && (k.modifiers.shift === ev.shiftKey) && (k.modifiers.alt === ev.altKey) &&
          (!k.videoOnly || (ele.tagName === "VIDEO")) && (isVisible(ele) || (ele.tagName === "AUDIO"))
        ) {
          stopEvent(ev);
          k.func?.(ele, evkey, a ? i : null, k);
          return true;
        }
      });
    }
  }, true);

})();
