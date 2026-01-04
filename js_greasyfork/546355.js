// ==UserScript==
// @name         myuserscripts9139903
// @namespace    https://github.com/gq9ykm/myuserscripts
// @version      4.3.0
// @author       test
// @description  test
// @license      MIT
// @icon
// @match        https://music.163.com/*
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @require      https://fastly.jsdelivr.net/npm/ajax-hook@3.0.3/dist/ajaxhook.min.js
// @require      https://fastly.jsdelivr.net/npm/jsmediatags@3.9.7/dist/jsmediatags.min.js
// @require      https://fastly.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js
// @connect      https://www.google-analytics.com
// @connect      google-analytics.com
// @connect      analytics.google.com
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546355/myuserscripts9139903.user.js
// @updateURL https://update.greasyfork.org/scripts/546355/myuserscripts9139903.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const levelOptions = { jymaster: "超清母带", dolby: "杜比全景声", sky: "沉浸环绕声", jyeffect: "高清环绕声", hires: "Hi-Res", lossless: "无损", exhigh: "极高", higher: "较高", standard: "标准" };
  const levelWeight = { jymaster: 9, dolby: 8, sky: 7, jyeffect: 6, hires: 5, lossless: 4, exhigh: 3, higher: 2, standard: 1, none: 0 };
  const defaultOfDEFAULT_LEVEL = "jymaster";
  const uploadChunkSize = 8 * 1024 * 1024;
  const songMark = { explicit: 1048576 };
  const iv = "0102030405060708";
  const presetKey = "0CoJUm6Qyw8W8jud";
  const base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB
-----END PUBLIC KEY-----`;
  const aesEncrypt = (text, key, iv2) => {
    let cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv: iv2 });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(text)));
    cipher.finish();
    let encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  };
  const rsaEncrypt = (str, key) => {
    const forgePublicKey = forge.pki.publicKeyFromPem(key);
    const encrypted = forgePublicKey.encrypt(str, "NONE");
    return forge.util.bytesToHex(encrypted);
  };
  const weapi = (object) => {
    const text = JSON.stringify(object);
    let secretKey = "";
    for (let i = 0; i < 16; i++) {
      secretKey += base62.charAt(Math.round(Math.random() * 61));
    }
    return {
      params: aesEncrypt(
        aesEncrypt(text, presetKey, iv),
        secretKey,
        iv
      ),
      encSecKey: rsaEncrypt(secretKey.split("").reverse().join(""), publicKey)
    };
  };
  var CookieMap = {
    web: true,
    android: "os=android;appver=9.1.78;channel=netease;osver=14;buildver=241009150147;",
    pc: "os=pc;appver=3.0.18.203152;channel=netease;osver=Microsoft-Windows-10-Professional-build-19045-64bit;"
  };
  var UserAgentMap = {
    web: void 0,
    android: "NeteaseMusic/9.1.78.241009150147(9001078);Dalvik/2.1.0 (Linux; U; Android 14; V2318A Build/TP1A.220624.014)",
    pc: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 Chrome/91.0.4472.164 NeteaseMusicDesktop/3.0.18.203152"
  };
  const requestQueue = [];
  const REQUEST_INTERVAL = 50;
  setInterval(() => {
    if (requestQueue.length > 0) {
      const requestFn = requestQueue.shift();
      requestFn();
    }
  }, REQUEST_INTERVAL);
  setDeviceId();
  const weapiRequest = (url2, config) => {
    let data = config.data || {};
    let clientType = config.clientType || "pc";
    let csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : "";
    const encRes = weapi(data);
    let headers = {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": UserAgentMap[clientType]
    };
    if (config.ip) {
      headers["X-Real-IP"] = config.ip;
      headers["X-Forwarded-For"] = config.ip;
    }
    const details = {
      url: url2.replace("api", "weapi") + `?csrf_token=${data.csrf_token}`,
      method: "POST",
      responseType: "json",
      headers,
      cookie: CookieMap[clientType],
      data: `params=${encodeURIComponent(encRes.params)}&encSecKey=${encodeURIComponent(encRes.encSecKey)}`,
      onload: (res) => {
        config.onload(res.response);
      },
      onerror: config.onerror
    };
    enqueueAPIRequest(details);
  };
  function enqueueAPIRequest(data) {
    return new Promise((resolve, reject) => {
      requestQueue.push(() => {
        callAPI(data);
      });
    });
  }
  function callAPI(data) {
    GM_xmlhttpRequest(data);
  }
  function setDeviceId() {
    const requestHeader = JSON.parse(GM_getValue("requestHeader", "{}"));
    if ("appendCookie" in requestHeader) {
      CookieMap["pc"] = requestHeader.appendCookie;
      UserAgentMap["pc"] = requestHeader.userAgent;
    } else {
      GM_cookie.list({ name: "sDeviceId" }, function(cookies, error) {
        if (!error) {
          if (cookies.length > 0) {
            CookieMap["android"] += `deviceId=${cookies[0].value};`;
            CookieMap["pc"] += `deviceId=${cookies[0].value};`;
          }
        } else {
          console.error(error);
        }
      });
    }
  }
  const fileSizeDesc = (fileSize) => {
    if (fileSize < 1024) {
      return fileSize + "B";
    } else if (fileSize >= 1024 && fileSize < Math.pow(1024, 2)) {
      return (fileSize / 1024).toFixed(1).toString() + "K";
    } else if (fileSize >= Math.pow(1024, 2) && fileSize < Math.pow(1024, 3)) {
      return (fileSize / Math.pow(1024, 2)).toFixed(1).toString() + "M";
    } else if (fileSize > Math.pow(1024, 3) && fileSize < Math.pow(1024, 4)) {
      return (fileSize / Math.pow(1024, 3)).toFixed(2).toString() + "G";
    } else if (fileSize > Math.pow(1024, 4)) {
      return (fileSize / Math.pow(1024, 4)).toFixed(2).toString() + "T";
    }
  };
  const duringTimeDesc = (dt) => {
    let secondTotal = Math.floor(dt / 1e3);
    let min = Math.floor(secondTotal / 60);
    let sec = secondTotal % 60;
    return min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
  };
  const levelDesc = (level) => {
    return levelOptions[level] || level;
  };
  const getArtistTextInSongDetail = (song) => {
    let artist = "";
    if (song.ar && song.ar[0].name && song.ar[0].name.length > 0) {
      artist = song.ar.map((ar) => ar.name).join();
    } else if (song.pc && song.pc.ar && song.pc.ar.length > 0) {
      artist = song.pc.ar;
    }
    return artist;
  };
  const getAlbumTextInSongDetail = (song) => {
    let album = "";
    if (song.al && song.al.name && song.al.name.length > 0) {
      album = song.al.name;
    } else if (song.pc && song.pc.alb && song.pc.alb.length > 0) {
      album = song.pc.alb;
    }
    return album;
  };
  const nameFileWithoutExt = (title, artist, out) => {
    if (out == "title" || !artist || artist.length == 0) {
      return title;
    }
    if (out == "artist-title") {
      return `${artist} - ${title}`;
    }
    if (out == "title-artist") {
      return `${title} - ${artist}`;
    }
  };
  const escapeHTML = (string) => string.replace(
    /[&<>'"]/g,
    (word) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[word] || word
  );
  const hookTopWindow = () => {
    ah.proxy({
      onResponse: (response, handler) => {
        if (response.config.url.includes("/weapi/song/enhance/player/url/v1")) {
          let content = JSON.parse(response.response);
          let songId = content.data[0].id;
          let targetLevel = _GM_getValue("DEFAULT_LEVEL", defaultOfDEFAULT_LEVEL);
          if (content.data[0].type.toLowerCase() !== "mp3" && content.data[0].type.toLowerCase() !== "m4a") {
            content.data[0].type = "mp3";
          }
          if (content.data[0].url) {
            if (content.data[0].level == "standard") {
              if (targetLevel != "standard") {
                let apiData = {
                  "/api/song/enhance/player/url/v1": JSON.stringify({
                    ids: JSON.stringify([songId]),
                    level: targetLevel,
                    encodeType: "mp3"
                  })
                };
                if (content.data[0].fee == 0) {
                  apiData["/api/song/enhance/download/url/v1"] = JSON.stringify({
                    id: songId,
                    level: levelWeight[targetLevel] > levelWeight.hires ? "hires" : targetLevel,
                    encodeType: "mp3"
                  });
                }
                weapiRequest("/api/batch", {
                  data: apiData,
                  onload: (res) => {
                    let songUrl = res["/api/song/enhance/player/url/v1"].data[0].url;
                    let songLevel = res["/api/song/enhance/player/url/v1"].data[0].level;
                    if (res["/api/song/enhance/download/url/v1"]) {
                      let songDLLevel = res["/api/song/enhance/download/url/v1"].data.level;
                      if (res["/api/song/enhance/download/url/v1"].data.url && (levelWeight[songDLLevel] || -1) > (levelWeight[songLevel] || 99)) {
                        songUrl = res["/api/song/enhance/download/url/v1"].data.url;
                        songLevel = songDLLevel;
                      }
                    }
                    if (songLevel != "standard") {
                      content.data[0].url = songUrl;
                      _unsafeWindow.player.tipPlay(levelDesc(songLevel) + "音质");
                    }
                    response.response = JSON.stringify(content);
                    handler.next(response);
                  },
                  onerror: (res) => {
                    console.error("/api/batch", apiData, res);
                    response.response = JSON.stringify(content);
                    handler.next(response);
                  }
                });
              } else {
                response.response = JSON.stringify(content);
                handler.next(response);
              }
            } else {
              _unsafeWindow.player.tipPlay(levelDesc(content.data[0].level) + "音质(云盘文件)");
              response.response = JSON.stringify(content);
              handler.next(response);
            }
          } else {
            response.response = JSON.stringify(content);
            handler.next(response);
          }
        } else {
          handler.next(response);
        }
      }
    }, _unsafeWindow);
  };
  const sleep = (millisec) => {
    return new Promise((resolve) => setTimeout(resolve, millisec));
  };
  const showConfirmBox = (msg) => {
    Swal.fire({
      title: "提示",
      text: msg,
      confirmButtonText: "确定"
    });
  };
  const showTips = (tip, type) => {
    unsafeWindow.g_showTipCard({
      tip,
      type
    });
  };
  const saveContentAsFile = (content, fileName) => {
    let data = new Blob([content], {
      type: "type/plain"
    });
    let fileurl = URL.createObjectURL(data);
    GM_download({
      url: fileurl,
      name: fileName,
      onload: function() {
        URL.revokeObjectURL(data);
      },
      onerror: function(e) {
        console.error(e);
        showTips(`下载失败,请尝试将 .${fileName.split(".").pop()} 格式加入 文件扩展名白名单`, 2);
      }
    });
  };
  const createBigButton = (desc, parent, appendWay) => {
    let btn = document.createElement("a");
    btn.className = "u-btn2 u-btn2-1";
    let btnDesc = document.createElement("i");
    btnDesc.innerHTML = desc;
    btn.appendChild(btnDesc);
    btn.style.margin = "5px";
    if (appendWay === 1) {
      parent.appendChild(btn);
    } else {
      parent.insertBefore(btn, parent.lastChild);
    }
    return btn;
  };
  const filterSongs = (songList, config) => {
    let songFilteredList = [];
    for (let song of songList) {
      if (song.privilege.st < 0 || song.privilege.plLevel == "none") continue;
      if (song.privilege.cs && config.skipCloud) continue;
      if (song.privilege.fee == 0 && !config.free) continue;
      if (song.privilege.fee == 1 && !config.VIP) continue;
      if (song.privilege.fee == 4 && !config.pay) continue;
      if (song.privilege.fee == 8 && !config.lowFree) continue;
      songFilteredList.push(song);
    }
    return songFilteredList;
  };
  const extractLrcRegex = /^(?<lyricTimestamps>(?:\[.+?\])+)(?!\[)(?<content>.+)$/gm;
  const extractTimestampRegex = /\[(?<min>\d+):(?<sec>\d+)(?:\.|:)*(?<ms>\d+)*\]/g;
  const combineLyric = (lyricOri, lyricAdd) => {
    let resLyric = {
      lyric: "",
      parsedLyric: lyricOri.parsedLyric.slice(0)
    };
    for (const parsedAddLyric of lyricAdd.parsedLyric) {
      resLyric.parsedLyric.splice(parsedLyricsBinarySearch(parsedAddLyric, resLyric.parsedLyric), 0, parsedAddLyric);
    }
    resLyric.lyric = resLyric.parsedLyric.map((lyric) => lyric.line).join("\n");
    return resLyric;
  };
  const parseLyric = (lrc) => {
    const parsedLyrics = [];
    for (const line of lrc.trim().matchAll(extractLrcRegex)) {
      const { lyricTimestamps, content } = line.groups;
      for (const timestamp of lyricTimestamps.matchAll(extractTimestampRegex)) {
        const { min, sec, ms } = timestamp.groups;
        const rawTime = timestamp[0];
        const time = Number(min) * 60 + Number(sec) + Number((ms ?? "000").padEnd(3, "0")) * 1e-3;
        const parsedLyric = { rawTime, time, content: trimLyricContent(content), line: line[0] };
        parsedLyrics.splice(parsedLyricsBinarySearch(parsedLyric, parsedLyrics), 0, parsedLyric);
      }
    }
    return parsedLyrics;
  };
  const parsedLyricsBinarySearch = (lyric, lyrics) => {
    let time = lyric.time;
    let low = 0;
    let high = lyrics.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midTime = lyrics[mid].time;
      if (midTime === time) {
        return mid;
      } else if (midTime < time) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low;
  };
  const trimLyricContent = (content) => {
    let t = content.trim();
    return t.length < 1 ? content : t;
  };
  const handleLyric = (lyricRes) => {
    var _a, _b, _c;
    if (lyricRes.pureMusic || lyricRes.needDesc) return {
      orilrc: {
        lyric: "",
        parsedLyric: []
      }
    };
    const lrc = ((_a = lyricRes == null ? void 0 : lyricRes.lrc) == null ? void 0 : _a.lyric) || "";
    const rlrc = ((_b = lyricRes == null ? void 0 : lyricRes.romalrc) == null ? void 0 : _b.lyric) || "";
    const tlrc = ((_c = lyricRes == null ? void 0 : lyricRes.tlyric) == null ? void 0 : _c.lyric) || "";
    let LyricObj = {
      orilrc: {
        lyric: lrc,
        parsedLyric: parseLyric(lrc)
      },
      romalrc: {
        lyric: rlrc,
        parsedLyric: parseLyric(rlrc)
      },
      tlyriclrc: {
        lyric: tlrc,
        parsedLyric: parseLyric(tlrc)
      }
    };
    if (LyricObj.orilrc.parsedLyric.length > 0 && LyricObj.tlyriclrc.parsedLyric.length > 0) {
      LyricObj.oritlrc = combineLyric(LyricObj.tlyriclrc, LyricObj.orilrc);
    }
    if (LyricObj.orilrc.parsedLyric.length > 0 && LyricObj.romalrc.parsedLyric.length > 0) {
      LyricObj.oriromalrc = combineLyric(LyricObj.orilrc, LyricObj.romalrc);
    }
    return LyricObj;
  };
  const batchDownloadSongs = (songList, config) => {
    if (songList.length == 0) {
      showConfirmBox("没有可下载的歌曲");
      return;
    }
    Swal.fire({
      title: "批量下载",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: false,
      showConfirmButton: false,
      width: 800,
      html: `<style>
table {
width: 100%;
border-spacing: 0px;
border-collapse: collapse;
}
table th, table td {
text-align: left;
text-overflow: ellipsis;
}
table tbody {
display: block;
width: 100%;
max-height: 400px;
overflow-y: auto;
-webkit-overflow-scrolling: touch;
}
table thead tr, table tbody tr, table tfoot tr {
box-sizing: border-box;
table-layout: fixed;
display: table;
width: 100%;
}
table tbody tr td{
border-bottom: none;
}
tr th:nth-child(1),tr td:nth-child(1){
width: 26%;
}
tr th:nth-child(2),tr td:nth-child(2){
width: 22%;
}
tr th:nth-child(3),tr td:nth-child(3){
width: 22%;
}
tr th:nth-child(4),tr td:nth-child(4){
width: 10%;
}
tr th:nth-child(5),tr td:nth-child(5){
width: 10%;
}
tr th:nth-child(6),tr td:nth-child(6){
width: 10%;
}
</style>
<table border="1" frame="hsides" rules="rows"><thead><tr><th>歌曲标题</th><th>歌手</th><th>专辑</th><th>音质</th><th>大小</th><th>进度</th> </tr></thead><tbody></tbody></table>
`,
      footer: "<div></div>",
      didOpen: () => {
        let container = Swal.getHtmlContainer();
        let tbodyDOM = container.querySelector("tbody");
        let threadList = [];
        for (let i = 0; i < config.threadCount; i++) {
          let trDOM = document.createElement("tr");
          tbodyDOM.appendChild(trDOM);
          threadList.push({ tableRowDOM: trDOM, working: true });
        }
        config.finnshCount = 0;
        config.errorSongs = [];
        config.skipSongs = [];
        config.taskCount = songList.length;
        config.threadList = threadList;
        for (let i = 0; i < config.threadCount; i++) {
          downloadSongSub(i, songList, config);
        }
      }
    });
  };
  const downloadSongSub = (threadIndex, songList, config) => {
    let song = songList.shift();
    let tableRowDOM = config.threadList[threadIndex].tableRowDOM;
    if (song == void 0) {
      config.threadList[threadIndex].working = false;
      let allFinnsh = true;
      for (let i = 0; i < config.threadCount; i++) {
        if (config.threadList[i].working) {
          allFinnsh = false;
          break;
        }
      }
      if (allFinnsh) {
        let finnshText = "下载完成";
        if (config.skipSongs.length > 0) {
          finnshText += `
有${config.skipSongs.length}首歌曲不是目标音质，未进行下载。`;
        }
        if (config.errorSongs.length > 0) {
          finnshText += `
以下${config.errorSongs.length}首歌曲下载失败: ${config.errorSongs.map((song2) => `<a href="https://music.163.com/#/song?id=${song2.id}">${song2.title}</a>`).join()}`;
        }
        Swal.update({
          allowOutsideClick: true,
          allowEscapeKey: true,
          showCloseButton: true,
          showConfirmButton: true,
          html: finnshText
        });
      }
      return;
    }
    tableRowDOM.innerHTML = `<td>${song.title}</td><td>${song.artist}</td><td>${song.album}</td><td class='my-level'></td><td class='my-size'></td><td class='my-pr'></td>`;
    let levelText = tableRowDOM.querySelector(".my-level");
    let sizeText = tableRowDOM.querySelector(".my-size");
    let prText = tableRowDOM.querySelector(".my-pr");
    try {
      weapiRequest(song.api.url, {
        data: song.api.data,
        onload: (content) => {
          let resData = content.data[0] || content.data;
          if (resData.url != null) {
            if (config.targetLevelOnly && config.level != resData.level) {
              prText.innerHTML = `跳过下载`;
              config.skipSongs.push(song);
              downloadSongSub(threadIndex, songList, config);
              return;
            }
            let fileName = nameFileWithoutExt(song.title, song.artist, config.out).replace("/", "／");
            let fileFullName = fileName + "." + resData.type.toLowerCase();
            let folder = "";
            if (config.folder != "none" && song.artist.length > 0) {
              folder = song.artist.replace("/", "／") + "/";
            }
            if (config.folder == "artist-album" && song.album.length > 0) {
              folder += song.album.replace("/", "／") + "/";
            }
            fileFullName = folder + fileFullName;
            let dlUrl = resData.url;
            levelText.innerHTML = levelDesc(resData.level);
            sizeText.innerHTML = fileSizeDesc(resData.size);
            GM_download({
              url: dlUrl,
              name: fileFullName,
              onprogress: function(e) {
                prText.innerHTML = `${fileSizeDesc(e.loaded)}`;
              },
              onload: function() {
                config.finnshCount += 1;
                Swal.getFooter().innerHTML = `已完成: ${config.finnshCount} 总共: ${config.taskCount}`;
                prText.innerHTML = `完成`;
                if (config.downloadLyric) {
                  downloadSongLyric(song.id, folder + fileName);
                }
                downloadSongSub(threadIndex, songList, config);
              },
              onerror: function(e) {
                if (song.retry) {
                  prText.innerHTML = `下载出错`;
                  config.errorSongs.push(song);
                } else {
                  prText.innerHTML = `下载出错	稍后重试`;
                  song.retry = true;
                  songList.push(song);
                }
                console.error(e, dlUrl, fileFullName);
                downloadSongSub(threadIndex, songList, config);
              }
            });
          } else {
            showTips(`${song.title}	无法下载`, 2);
            prText.innerHTML = `无法下载`;
            config.errorSongs.push(song);
            downloadSongSub(threadIndex, songList, config);
          }
        },
        onerror: (res) => {
          console.error(res);
          if (song.retry) {
            prText.innerHTML = `下载出错`;
            config.errorSongs.push(song);
          } else {
            prText.innerHTML = `下载出错	稍后重试`;
            song.retry = true;
            songList.push(song);
          }
          downloadSongSub(threadIndex, songList, config);
        }
      });
    } catch (e) {
      console.error(e);
      if (song.retry) {
        prText.innerHTML = `下载出错`;
        config.errorSongs.push(song);
      } else {
        prText.innerHTML = `下载出错	稍后重试`;
        song.retry = true;
        songList.push(song);
      }
      downloadSongSub(threadIndex, songList, config);
    }
  };
  const downloadSongLyric = (songId, fileName) => {
    weapiRequest("/api/song/lyric/v1", {
      data: { id: songId, cp: false, tv: 0, lv: 0, rv: 0, kv: 0, yv: 0, ytv: 0, yrv: 0 },
      onload: (content) => {
        if (content.pureMusic) return;
        const LyricObj = handleLyric(content);
        if (LyricObj.orilrc.parsedLyric.length == 0) return;
        const LyricItem = LyricObj.oritlrc || LyricObj.orilrc;
        saveContentAsFile(LyricItem.lyric, fileName + ".lrc");
      }
    });
  };
  const batchUploadSongs = (songList, config) => {
    if (songList.length == 0) {
      showConfirmBox("没有可上传的歌曲");
      return;
    }
    showTips(`开始下载上传${songList.length}首歌曲`, 1);
    let ULobj = new ncmDownUploadBatch(songList, config);
    ULobj.startUpload();
  };
  const createSongsUrlApi = (songList, config) => {
    for (let songItem of songList) {
      let api = { url: "/api/song/enhance/player/url/v1", data: { ids: JSON.stringify([songItem.id]), level: config.level, encodeType: "mp3" } };
      if (songItem.privilege.fee == 0 && (levelWeight[songItem.privilege.plLevel] || 99) < (levelWeight[songItem.privilege.dlLevel] || -1)) api = { url: "/api/song/enhance/download/url/v1", data: { id: songItem.id, level: config.level, encodeType: "mp3" } };
      songItem.api = api;
    }
    if (config.action == "batchUpload") {
      batchUploadSongs(songList, config);
    } else if (config.action == "batchDownload") {
      batchDownloadSongs(songList, config);
    }
  };
  const downloadSongBatch$1 = (playlistId, uiArea) => {
    let btnBatchDownload = createBigButton("批量下载", uiArea, 1);
    btnBatchDownload.addEventListener("click", () => {
      ShowBatchDLPopUp({ listType: "playlist", listId: playlistId });
    });
  };
  const ShowBatchDLULPopUp = (config) => {
    Swal.fire({
      width: 600,
      title: "批量转存云盘",
      html: `<div id="my-cbs">
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee1" checked>VIP歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee4" checked>付费专辑歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee8">低音质免费歌曲</label>
<labe><input class="form-check-input" type="checkbox" value="" id="cb-fee0">免费歌曲</label>
</div>
<div id="my-cbs2">
<label><input class="form-check-input" type="checkbox" value="" id="cb-targetLevelOnly">仅获取到目标音质时上传</label>
</div>
<div id="my-level">
<label>优先转存音质<select id="level-select" class="swal2-select"><option value="jymaster" selected="">超清母带</option><option value="dolby">杜比全景声</option><option value="sky">沉浸环绕声</option><option value="jyeffect">高清环绕声</option><option value="hires">Hi-Res</option><option value="lossless">无损</option><option value="exhigh">极高</option></select></label>
</div>
<div id="my-out">
<label>文件命名格式<select id="out-select" class="swal2-select"><option value="artist-title" selected="">歌手 - 歌曲名</option><option value="title">歌曲名</option><option value="title-artist">歌曲名-歌手</option></select></label>
</div>
`,
      confirmButtonText: "开始转存",
      showCloseButton: true,
      footer: '<span></span><a href="https://github.com/Cinvin/myuserscripts"><img src="https://img.shields.io/github/stars/cinvin/myuserscripts?style=social" alt="Github"></a>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          free: document.getElementById("cb-fee0").checked,
          VIP: document.getElementById("cb-fee1").checked,
          pay: document.getElementById("cb-fee4").checked,
          lowFree: document.getElementById("cb-fee8").checked,
          targetLevelOnly: document.getElementById("cb-targetLevelOnly").checked,
          skipCloud: true,
          level: document.getElementById("level-select").value,
          out: document.getElementById("out-select").value,
          listType: config.listType,
          listId: config.listId,
          action: "batchUpload"
        };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        if (res.value.listType == "playlist") {
          let filtedSongList = filterSongs(playlistDetailObj.playlistSongList, res.value);
          createSongsUrlApi(filtedSongList, res.value);
        } else if (res.value.listType == "album") {
          let filtedSongList = filterSongs(albumDetailObj.albumSongList, res.value);
          createSongsUrlApi(filtedSongList, res.value);
        }
      }
    });
  };
  const uploadSongBatch$1 = (playlistId, uiArea) => {
    let btnBatchUpload = createBigButton("批量转存云盘", uiArea, 1);
    btnBatchUpload.addEventListener("click", () => {
      ShowBatchDLULPopUp({ listType: "playlist", listId: playlistId });
    });
  };
  const sortSongs = (playlistId, uiArea) => {
    let btnPlaylistSort = createBigButton("歌单排序", uiArea, 1);
    btnPlaylistSort.addEventListener("click", () => {
      ShowPLSortPopUp(playlistId);
    });
  };
  const ShowPLSortPopUp = (playlistId) => {
    Swal.fire({
      title: "歌单内歌曲排序",
      input: "select",
      inputOptions: ["发行时间降序", "发行时间升序", "红心数量降序", "红心数量升序", "评论数量降序", "评论数量升序"],
      inputPlaceholder: "选择排序方式",
      confirmButtonText: "开始排序",
      showCloseButton: true,
      focusConfirm: false,
      inputValidator: (way) => {
        if (!way) {
          return "请选择排序方式";
        }
      }
    }).then((res) => {
      if (!res.isConfirmed) return;
      if (res.value == 0) {
        PlaylistTimeSort(playlistId, true);
      } else if (res.value == 1) {
        PlaylistTimeSort(playlistId, false);
      } else if (res.value == 2) {
        PlaylistCountSort(playlistId, true, "Red");
      } else if (res.value == 3) {
        PlaylistCountSort(playlistId, false, "Red");
      } else if (res.value == 4) {
        PlaylistCountSort(playlistId, true, "Comment");
      } else if (res.value == 5) {
        PlaylistCountSort(playlistId, false, "Comment");
      }
    });
  };
  const PlaylistTimeSort = (playlistId, descending) => {
    showTips(`正在获取歌单内歌曲信息`, 1);
    weapiRequest("/api/v6/playlist/detail", {
      data: {
        id: playlistId,
        n: 1e5,
        s: 8
      },
      onload: (content) => {
        let songList = [];
        let tracklen = content.playlist.tracks.length;
        for (let i = 0; i < tracklen; i++) {
          let songItem = { id: content.playlist.tracks[i].id, publishTime: content.playlist.tracks[i].publishTime, albumId: content.playlist.tracks[i].al.id, cd: content.playlist.tracks[i].cd ? Number(content.playlist.tracks[i].cd.split(" ")[0]) : 0, no: content.playlist.tracks[i].no };
          songList.push(songItem);
        }
        if (content.playlist.trackCount > content.playlist.tracks.length) {
          showTips(`大歌单,开始分批获取${content.playlist.trackCount}首歌信息`, 1);
          let trackIds = content.playlist.trackIds.map((item) => {
            return {
              "id": item.id
            };
          });
          PlaylistTimeSortFetchAll(playlistId, descending, trackIds, 0, songList);
        } else {
          PlaylistTimeSortFetchAllPublishTime(playlistId, descending, 0, songList, {});
        }
      }
    });
  };
  const PlaylistTimeSortFetchAll = (playlistId, descending, trackIds, startIndex, songList) => {
    if (startIndex >= trackIds.length) {
      PlaylistTimeSortFetchAllPublishTime(playlistId, descending, 0, songList, {});
      return;
    }
    weapiRequest("/api/v3/song/detail", {
      data: {
        c: JSON.stringify(trackIds.slice(startIndex, startIndex + 1e3))
      },
      onload: function(content) {
        let songlen = content.songs.length;
        for (let i = 0; i < songlen; i++) {
          let songItem = { id: content.songs[i].id, publishTime: content.songs[i].publishTime, albumId: content.songs[i].al.id, cd: content.songs[i].cd ? Number(content.songs[i].cd.split(" ")[0]) : 0, no: content.songs[i].no };
          songList.push(songItem);
        }
        PlaylistTimeSortFetchAll(playlistId, descending, trackIds, startIndex + content.songs.length, songList);
      }
    });
  };
  const PlaylistTimeSortFetchAllPublishTime = (playlistId, descending, index, songList, aldict) => {
    if (index >= songList.length) {
      PlaylistTimeSortSongs(playlistId, descending, songList);
      return;
    }
    if (index == 0) showTips("开始获取歌曲专辑发行时间");
    if (index % 10 == 9) showTips(`正在获取歌曲专辑发行时间(${index + 1}/${songList.length})`);
    let albumId = songList[index].albumId;
    if (albumId <= 0) {
      PlaylistTimeSortFetchAllPublishTime(playlistId, descending, index + 1, songList, aldict);
      return;
    }
    if (aldict[albumId]) {
      songList[index].publishTime = aldict[albumId];
      PlaylistTimeSortFetchAllPublishTime(playlistId, descending, index + 1, songList, aldict);
      return;
    }
    weapiRequest(`/api/v1/album/${albumId}`, {
      onload: function(content) {
        let publishTime = content.album.publishTime;
        aldict[albumId] = publishTime;
        songList[index].publishTime = publishTime;
        PlaylistTimeSortFetchAllPublishTime(playlistId, descending, index + 1, songList, aldict);
      }
    });
  };
  const PlaylistTimeSortSongs = (playlistId, descending, songList) => {
    songList.sort((a, b) => {
      if (a.publishTime != b.publishTime) {
        if (descending) {
          return b.publishTime - a.publishTime;
        } else {
          return a.publishTime - b.publishTime;
        }
      } else if (a.albumId != b.albumId) {
        if (descending) {
          return b.albumId - a.albumId;
        } else {
          return a.albumId - b.albumId;
        }
      } else if (a.cd != b.cd) {
        return a.cd - b.cd;
      } else if (a.no != b.no) {
        return a.no - b.no;
      }
      return a.id - b.id;
    });
    let trackIds = songList.map((song) => song.id);
    weapiRequest("/api/playlist/manipulate/tracks", {
      data: {
        pid: playlistId,
        trackIds: JSON.stringify(trackIds),
        op: "update"
      },
      onload: function(content) {
        if (content.code == 200) {
          showConfirmBox("排序完成");
        } else {
          showConfirmBox("排序失败," + content);
        }
      }
    });
  };
  const PlaylistCountSort = (playlistId, descending, way) => {
    showTips(`正在获取歌单内歌曲信息`, 1);
    weapiRequest("/api/v6/playlist/detail", {
      data: {
        id: playlistId,
        n: 1e5,
        s: 8
      },
      onload: (content) => {
        let songList = content.playlist.trackIds.map((item) => {
          return {
            "id": item.id,
            "count": 0
          };
        });
        let trackIds = content.playlist.trackIds.map((item) => {
          return item.id;
        });
        if (way == "Red") {
          PlaylistCountSortFetchRedCount(playlistId, songList, 0, descending);
        } else if (way == "Comment") {
          PlaylistCountSortFetchCommentCount(playlistId, songList, trackIds, 0, descending);
        }
      }
    });
  };
  const PlaylistCountSortFetchRedCount = (playlistId, songList, index, descending) => {
    if (index >= songList.length) {
      PlaylistCountSortSongs(playlistId, descending, songList);
      return;
    }
    if (index == 0) showTips("开始获取歌曲红心数量");
    if (index % 10 == 9) showTips(`正在获取歌曲红心数量(${index + 1}/${songList.length})`);
    weapiRequest("/api/song/red/count", {
      data: {
        songId: songList[index].id
      },
      onload: function(content) {
        songList[index].count = content.data.count;
        PlaylistCountSortFetchRedCount(playlistId, songList, index + 1, descending);
      }
    });
  };
  const PlaylistCountSortFetchCommentCount = (playlistId, songList, trackIds, index, descending) => {
    if (index >= songList.length) {
      PlaylistCountSortSongs(playlistId, descending, songList);
      return;
    }
    if (index == 0) showTips("开始获取歌曲评论数量");
    else showTips(`正在获取歌曲评论数量(${index + 1}/${songList.length})`);
    weapiRequest("/api/resource/commentInfo/list", {
      data: {
        resourceType: "4",
        resourceIds: JSON.stringify(trackIds.slice(index, index + 1e3))
      },
      onload: function(content) {
        content.data.forEach((item) => {
          let songId = item.resourceId;
          for (let i = 0; i < songList.length; i++) {
            if (songList[i].id == songId) {
              songList[i].count = item.commentCount;
              break;
            }
          }
        });
        PlaylistCountSortFetchCommentCount(playlistId, songList, trackIds, index + 1e3, descending);
      }
    });
  };
  const PlaylistCountSortSongs = (playlistId, descending, songList) => {
    songList.sort((a, b) => {
      if (a.count != b.count) {
        if (descending) {
          return b.count - a.count;
        } else {
          return a.count - b.count;
        }
      }
      return a.id - b.id;
    });
    let trackIds = songList.map((song) => song.id);
    weapiRequest("/api/playlist/manipulate/tracks", {
      data: {
        pid: playlistId,
        trackIds: JSON.stringify(trackIds),
        op: "update"
      },
      onload: function(content) {
        if (content.code == 200) {
          showConfirmBox("排序完成");
        } else {
          showConfirmBox("排序失败");
        }
      }
    });
  };
  class PlaylistDetail {
    constructor() {
      this.domReady = false;
      this.dataFetched = false;
      this.flag = true;
      const params2 = new URLSearchParams(unsafeWindow.location.search);
      this.playlistId = Number(params2.get("id"));
      this._hash = params2.get("_hash");
      this.playlist = null;
      this.playlistSongList = [];
      this.playableSongList = [];
      this.rowHTMLList = [];
    }
    fetchPlaylistFullData(playlistId) {
      weapiRequest("/api/v6/playlist/detail", {
        data: {
          id: playlistId,
          n: 1e5,
          s: 8
        },
        onload: (content) => {
          this.playlist = content.playlist;
          if (content.playlist.trackCount > content.playlist.tracks.length) {
            let trackIds = content.playlist.trackIds.map((item) => {
              return {
                "id": item.id
              };
            });
            this.getPlaylistAllSongsSub(trackIds, 0);
          } else {
            this.addSongInToSongList(content);
            this.onFetchDatafinnsh();
          }
        }
      });
    }
    getPlaylistAllSongsSub(trackIds, startIndex) {
      if (startIndex >= trackIds.length) {
        this.onFetchDatafinnsh();
        return;
      }
      weapiRequest("/api/v3/song/detail", {
        data: {
          c: JSON.stringify(trackIds.slice(startIndex, startIndex + 1e3))
        },
        onload: (content) => {
          this.addSongInToSongList(content);
          this.getPlaylistAllSongsSub(trackIds, startIndex + content.songs.length);
        }
      });
    }
    addSongInToSongList(content) {
      const songs = content.songs || content.playlist.tracks;
      const privileges = content.privileges;
      const songlen = songs.length;
      const privilegelen = privileges.length;
      for (let i = 0; i < songlen; i++) {
        for (let j = 0; j < privilegelen; j++) {
          if (songs[i].id == privileges[j].id) {
            let songItem = {
              id: songs[i].id,
              title: songs[i].name,
              artist: getArtistTextInSongDetail(songs[i]),
              album: getAlbumTextInSongDetail(songs[i]),
              song: songs[i],
              privilege: privileges[j]
            };
            this.playlistSongList.push(songItem);
            break;
          }
        }
      }
    }
    onFetchDatafinnsh() {
      this.playlistSongList.forEach((songItem) => {
        this.createFormatAddToData(songItem);
      });
      this.dataFetched = true;
      this.checkStartInitBtn();
    }
    createFormatAddToData(songItem) {
      if (songItem.privilege.plLevel != "none") {
        let addToFormat = {
          album: songItem.song.al,
          alias: songItem.song.alia || songItem.song.ala || [],
          artists: songItem.song.ar || [],
          commentThreadId: "R_SO_4_" + songItem.song.id,
          copyrightId: songItem.song.cp || 0,
          duration: songItem.song.dt || 0,
          id: songItem.song.id,
          mvid: songItem.song.mv || 0,
          name: songItem.song.name || "",
          cd: songItem.song.cd,
          position: songItem.song.no || 0,
          ringtone: songItem.song.rt,
          rtUrl: songItem.song.rtUrl,
          status: songItem.song.st || 0,
          pstatus: songItem.song.pst || 0,
          fee: songItem.song.fee || 0,
          version: songItem.song.v || 0,
          eq: songItem.song.eq,
          songType: songItem.song.t || 0,
          mst: songItem.song.mst,
          score: songItem.song.pop || 0,
          ftype: songItem.song.ftype,
          rtUrls: songItem.song.rtUrls,
          transNames: songItem.song.tns,
          privilege: songItem.song.privilege,
          lyrics: songItem.song.lyrics,
          alg: songItem.song.alg,
          source: {
            fdata: String(this.playlistId),
            fid: 13,
            link: `playlist?id=${this.playlistId}&_hash=songlist-${songItem.song.id}`,
            title: "歌单"
          }
        };
        this.playableSongList.push(addToFormat);
      }
    }
    onDomReady() {
      this.operationArea = document.querySelector("#content-operation");
      this.songListTextDom = document.querySelector("div.u-title.u-title-1.f-cb > h3 > span");
      this.playCount = document.querySelector("#play-count");
      this.songListTextDom.innerHTML = "获取歌单数据中...";
      this.domReady = true;
      this.checkStartInitBtn();
    }
    checkStartInitBtn() {
      if (this.domReady && this.dataFetched && this.flag) {
        this.flag = false;
        this.renderPlayAllBtn();
        this.appendBtns();
        this.fillTableSong();
        let playlistTrackCount = document.querySelector("#playlist-track-count");
        if (playlistTrackCount) playlistTrackCount.innerHTML = this.playlistSongList.length;
        this.songListTextDom.innerHTML = "歌曲列表";
      }
    }
    renderPlayAllBtn() {
      this.operationArea.innerHTML = `
        <a style="display:none" class="u-btn2 u-btn2-2 u-btni-addply f-fl" hidefocus="true" title="播放"><i><em class="ply"></em>播放全部(${this.playableSongList.length})</i></a>
        <a style="display:none" class="u-btni u-btni-add" hidefocus="true" title="添加到播放列表"></a>
        ` + this.operationArea.innerHTML;
      this.operationArea.children[0].addEventListener("click", () => {
        unsafeWindow.top.player.addTo(this.playableSongList, true, true);
        weapiRequest("/api/playlist/update/playcount", {
          data: {
            id: this.playlistId
          },
          onload: (content) => {
            if (content.code == 200) this.playCount.innerHTML = Number(this.playCount.innerHTML) + 1;
          }
        });
      });
      this.operationArea.children[1].addEventListener("click", () => {
        unsafeWindow.top.player.addTo(this.playableSongList, false, false);
      });
      this.operationArea.children[0].style.display = "";
      this.operationArea.children[1].style.display = "";
      this.operationArea.children[2].style.display = "none";
      this.operationArea.children[3].style.display = "none";
    }
    appendBtns() {
      var _a;
      downloadSongBatch$1(this.playlistId, this.operationArea);
      uploadSongBatch$1(this.playlistId, this.operationArea);
      const creatorhomeURL = (_a = document.head.querySelector("[property~='music:creator'][content]")) == null ? void 0 : _a.content;
      const creatorId = new URLSearchParams(new URL(creatorhomeURL).search).get("id");
      if (creatorId == unsafeWindow.GUser.userId) {
        sortSongs(this.playlistId, this.operationArea);
      }
    }
    fillTableSong() {
      const timestamp = document.querySelector(".m-table > tbody > tr").id.slice(-13);
      this.playlistSongList.forEach((songItem, index) => {
        this.createRowHTML(songItem, index, timestamp);
      });
      const table = document.querySelector(".m-table");
      if (table) {
        const tableStyles = `
            .m-table .ncmextend-playlist-playbtn {
                display: none;
            }
            .m-table tr:hover .ncmextend-playlist-playbtn {
                display: block;
            }
            .m-table .ncmextend-playlist-playbtn:has(.ply-z-slt) {
                display: block;
            }
            .m-table .ncmextend-playlist-songindex:has(+ div > .ply-z-slt) {
                display: none;
            }
            .m-table .ncmextend-playlist-songindex {
                color: #999;
                float: left;
                margin-left: -8px;
                width: 40px;
                text-align: center;
            }
            .m-table tr:hover .ncmextend-playlist-songindex {
                display: none;
            }
            .m-table .ncmextend-playlist-viponly {
                color: #999;
                float: left;
                margin-left: -8px;
                width: 40px;
                text-align: center;
            }
            .m-table .ncmextend-playlist-songtitle {
                height: 20px;
                margin-right: 20px;
                margin-top: 5px;
                font-size: 16px;
            }
            .m-table .ncmextend-playlist-songartist {
                height: 20px;
                margin-right: 20px;
                margin-top: 5px;
            }
            .m-table .ncmextend-playlist-songalbum {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            `;
        GM_addStyle(tableStyles);
        table.className = "m-table m-table-rank";
        table.innerHTML = `
            <thead><tr>
                <th style="width:40px;"><div class="wp">&nbsp;</div></th>
                <th><div class="wp">歌名/歌手</div></th>
                <th class="w4"><div class="wp af3"></div></th>
                <th style="width:90px;"><div class="wp af1"></div></th>
            </tr></thead>
            <tbody>${this.rowHTMLList.join("")}</tbody>
            `;
        const playing = unsafeWindow.top.player.getPlaying();
        if (playing.track) {
          const plybtn = document.querySelector(`[id="${playing.track.id}${timestamp}"] > td:nth-child(1) > div > div.ncmextend-playlist-playbtn > span`);
          if (plybtn) {
            plybtn.className = plybtn.className.trimEnd() + " ply-z-slt";
          }
        }
        if (/^songlist-(\d+)$/.test(this._hash)) {
          const tr = document.querySelector(`[id="${this._hash.slice(9)}${timestamp}"]`);
          if (tr) tr.scrollIntoView();
        }
        this.deleteMoreInfoUI();
      }
    }
    createRowHTML(songItem, index, timestamp) {
      this.bodyId = document.body.className.replace(/\D/g, "");
      const status = songItem.privilege.st < 0;
      const deletable = this.playlist.creator.userId === unsafeWindow.GUser.userId;
      const needVIP = songItem.privilege.plLevel == "none" && !status;
      const durationText = duringTimeDesc(songItem.song.dt);
      const artistText = escapeHTML(songItem.artist);
      const annotation = escapeHTML(songItem.song.tns ? songItem.song.tns[0] : songItem.song.alias ? songItem.song.alias[0] : "");
      const albumName = escapeHTML(songItem.album);
      const songName = escapeHTML(songItem.title);
      let playBtnHTML = `<span data-res-id="${songItem.id}" data-res-type="18" data-res-action="play" data-res-from="13" data-res-data="${this.playlist.id}" class="ply "></span>`;
      if (needVIP) playBtnHTML = `<span class='ncmextend-playlist-viponly'>需要VIP</span>`;
      let artistContent = "";
      songItem.song.ar.forEach((ar) => {
        if (ar.name) {
          if (ar.id > 0) artistContent += `<a href="#/artist?id=${ar.id}" hidefocus="true">${escapeHTML(ar.name)}</a>/`;
          else artistContent += escapeHTML(ar.name) + "/";
        }
      });
      if (artistContent.length > 0) artistContent = artistContent.slice(0, -1);
      else artistContent = artistText;
      let albumContent = albumName;
      if (songItem.song.al.id > 0) albumContent = `<a href="#/album?id=${songItem.song.al.id}" title="${albumName}">${albumName}</a>`;
      const rowHTML = `
				<tr id="${songItem.id}${timestamp}" class="${index % 2 ? "" : "even"} ${status ? "js-dis" : ""}">
					<td>
						<div class="hd ">
                            <div class="ncmextend-playlist-songindex">
                                <span>${index + 1}</span>
                            </div>
                            <div class="ncmextend-playlist-playbtn">
                                ${playBtnHTML}
                            </div>
                        </div>
					</td>
					<td class="rank">
						<div class="f-cb">
							<div class="tt">
                                <a href="#/song?id=${songItem.id}" title="${songName}">
                                    <img class="rpic" src="${songItem.song.al.picUrl}?param=50y50&amp;quality=100">
                                </a>
								<div class="ncmextend-playlist-songtitle">
									<span class="txt" style="max-width: 78%;">
										<a href="#/song?id=${songItem.id}"><b title="${songName}${annotation ? ` - (${annotation})` : ""}"><div class="soil"></div>${songName}</b></a>
										${annotation ? `<span title="${annotation}" class="s-fc8">${annotation ? ` - (${annotation})` : ""}</span>` : ""}
										${songItem.song.mv ? `<a href="#/mv?id=${songItem.song.mv}" title="播放mv" class="mv">MV</a>` : ""}
									</span>
								</div>
                                <div title="${artistText}" class="ncmextend-playlist-songartist">
							        <span title="${artistText}" class="txt" style="max-width: 78%;">
								        ${artistContent}
							        </span>
						        </div>
							</div>
						</div>
					</td>
                    <td>
						<div class="ncmextend-playlist-songalbum">
                            ${albumContent}
						</div>
					</td>
					<td class=" s-fc3">
						<span class="u-dur candel">${durationText}</span>
						<div class="opt hshow">
							<a class="u-icn u-icn-81 icn-add" href="javascript:;" title="添加到播放列表" hidefocus="true" data-res-type="18" data-res-id="${songItem.id}" data-res-action="addto" data-res-from="13" data-res-data="${this.playlist.id}"></a>
							<span data-res-id="${songItem.id}" data-res-type="18" data-res-action="fav" class="icn icn-fav" title="收藏"></span>
							<span data-res-id="${songItem.id}" data-res-type="18" data-res-action="share" data-res-name="${albumName}" data-res-author="${artistText}" data-res-pic="${songItem.song.al.picUrl}" class="icn icn-share" title="分享">分享</span>
							${deletable ? `<span data-res-id="${songItem.id}" data-res-type="18" data-res-from="13" data-res-data="${this.playlist.id}" data-res-action="delete" class="icn icn-del" title="删除">删除</span>` : ""}
						</div>
					</td>
				</tr>
			`;
      this.rowHTMLList.push(rowHTML);
    }
    deleteMoreInfoUI() {
      const seeMore = document.querySelector(".m-playlist-see-more");
      if (seeMore) seeMore.parentNode.removeChild(seeMore);
    }
    updateSongsCloudStatus(songIds) {
      songIds.forEach((songId) => {
        for (let i = 0; i < this.playlistSongList.length; i++) {
          if (this.playlistSongList[i].id == songId) {
            this.playlistSongList[i].privilege.cs = true;
            break;
          }
        }
      });
    }
  }
  let playlistDetailObj = new PlaylistDetail();
  const ShowBatchDLPopUp = (config) => {
    Swal.fire({
      width: 650,
      title: "批量下载",
      html: `<div id="my-cbs">
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee1" checked>VIP歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee4" checked>付费专辑歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee8" checked>低音质免费歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-fee0" checked>免费和云盘未匹配歌曲</label>
</div>
<div id="my-cbs2">
<label><input class="form-check-input" type="checkbox" value="" id="cb-skipcloud">跳过云盘歌曲</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-dlLyric">下载歌词文件(.lrc)</label>
<label><input class="form-check-input" type="checkbox" value="" id="cb-targetLevelOnly">仅获取到目标音质时下载</label>
</div>
<div id="my-level">
<label>优先下载音质<select id="level-select" class="swal2-select"><option value="jymaster" selected="">超清母带</option><option value="dolby">杜比全景声</option><option value="sky">沉浸环绕声</option><option value="jyeffect">高清环绕声</option><option value="hires">Hi-Res</option><option value="lossless">无损</option><option value="exhigh">极高</option></select></label>
</div>
<div id="my-out">
<label>文件命名格式<select id="out-select" class="swal2-select"><option value="artist-title" selected="">歌手 - 歌曲名</option><option value="title">歌曲名</option><option value="title-artist">歌曲名 - 歌手</option></select></label>
</div>
<div id="my-folder">
<label>文件夹格式<select id="folder-select" class="swal2-select"><option value="none" selected="">不建立文件夹</option><option value="artist">建立歌手文件夹</option><option value="artist-album">建立歌手 \\ 专辑文件夹</option></select></label>
</div>
<div id="my-thread-count">
<label>同时下载的歌曲数<select id="thread-count-select" class="swal2-select"><option value=4 selected="">4</option><option value=3>3</option><option value="2">2</option><option value=1>1</option></select></label>
</div>
`,
      confirmButtonText: "开始下载",
      showCloseButton: true,
      footer: '<span>请将 <b>TamperMonkey</b> 插件设置中的 <b>下载模式</b> 设置为 <b>浏览器 API</b> 并将 <b>/.(mp3|flac|lrc)$/</b> 添加进 <b>文件扩展名白名单</b> 以保证能正常下载。</span><a href="https://github.com/Cinvin/myuserscripts"><img src="https://img.shields.io/github/stars/cinvin/myuserscripts?style=social" alt="Github"></a>',
      focusConfirm: false,
      preConfirm: () => {
        let container = Swal.getHtmlContainer();
        return {
          free: container.querySelector("#cb-fee0").checked,
          VIP: container.querySelector("#cb-fee1").checked,
          pay: container.querySelector("#cb-fee4").checked,
          lowFree: container.querySelector("#cb-fee8").checked,
          skipCloud: container.querySelector("#cb-skipcloud").checked,
          downloadLyric: container.querySelector("#cb-dlLyric").checked,
          targetLevelOnly: container.querySelector("#cb-targetLevelOnly").checked,
          level: container.querySelector("#level-select").value,
          out: container.querySelector("#out-select").value,
          folder: container.querySelector("#folder-select").value,
          threadCount: Number(container.querySelector("#thread-count-select").value),
          listType: config.listType,
          listId: config.listId,
          action: "batchDownload"
        };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        if (res.value.listType == "playlist") {
          let filtedSongList = filterSongs(playlistDetailObj.playlistSongList, res.value);
          createSongsUrlApi(filtedSongList, res.value);
        } else if (res.value.listType == "album") {
          let filtedSongList = filterSongs(albumDetailObj.albumSongList, res.value);
          createSongsUrlApi(filtedSongList, res.value);
        }
      }
    });
  };
  const downloadSongBatch = (albumId, uiArea) => {
    let btnBatchDownload = createBigButton("批量下载", uiArea, 1);
    btnBatchDownload.addEventListener("click", () => {
      ShowBatchDLPopUp({ listType: "album", listId: albumId });
    });
  };
  const uploadSongBatch = (albumId, uiArea) => {
    let btnBatchUpload = createBigButton("批量转存云盘", uiArea, 1);
    btnBatchUpload.addEventListener("click", () => {
      ShowBatchDLULPopUp({ listType: "album", listId: albumId });
    });
  };
  class AlbumDetail {
    constructor() {
      this.domReady = false;
      this.dataFetched = false;
      this.flag = true;
      this.albumSongList = [];
      this.albumRes = null;
      this.albumDiscList = [];
      const params2 = new URLSearchParams(unsafeWindow.location.search);
      this.playlistId = Number(params2.get("id"));
      this._hash = params2.get("_hash");
    }
    fetchAlbumData(albumId) {
      this.albumId = albumId;
      weapiRequest(`/api/v1/album/${albumId}`, {
        onload: (content) => {
          this.albumRes = content;
          for (let i = 0; i < content.songs.length; i++) {
            let songItem = {
              id: content.songs[i].id,
              title: content.songs[i].name,
              artist: getArtistTextInSongDetail(content.songs[i]),
              album: getAlbumTextInSongDetail(content.songs[i]),
              song: content.songs[i],
              privilege: content.songs[i].privilege
            };
            this.albumSongList.push(songItem);
            const discInfos = content.songs[i].cd ? content.songs[i].cd.split(" ") : [];
            if (discInfos.length > 0) {
              const discIndex = parseInt(discInfos[0]);
              while (this.albumDiscList.length < discIndex) {
                this.albumDiscList.push(null);
              }
              if (this.albumDiscList[discIndex - 1] === null) {
                let discTitle = `Disc ${discIndex}`;
                if (discInfos.length > 1) discTitle += " " + discInfos.slice(1).join(" ");
                this.albumDiscList[discIndex - 1] = { title: discTitle, songs: [] };
              }
              this.albumDiscList[discIndex - 1].songs.push(songItem);
            }
          }
          this.dataFetched = true;
          this.checkStartCreateDom();
        }
      });
    }
    onDomReady() {
      this.domReady = true;
      this.descriptionArea = document.querySelector(".topblk");
      this.operationArea = document.querySelector("#content-operation");
      this.checkStartCreateDom();
    }
    checkStartCreateDom() {
      if (this.domReady && this.dataFetched && this.flag) {
        this.flag = false;
        this.AppendInfos();
        this.AppendBtns();
        if (this.albumDiscList.length > 1) this.createDiscTable();
      }
    }
    AppendInfos() {
      this.descriptionArea.innerHTML += `<p class="intr"><b>专辑类型：</b>${this.albumRes.album.type} ${this.albumRes.album.subType}</p>`;
      if ((this.albumRes.album.mark & songMark.explicit) == songMark.explicit) {
        this.descriptionArea.innerHTML += `<p class="intr"><b>🅴：</b>内容含有不健康因素</p>`;
      }
      if (this.albumRes.album.blurPicUrl) {
        this.descriptionArea.innerHTML += `<p class="intr"><a class="s-fc7" href="${this.albumRes.album.blurPicUrl}" target="_blank">专辑封面原图</a></p>`;
      }
    }
    AppendBtns() {
      downloadSongBatch(this.albumId, this.operationArea);
      uploadSongBatch(this.albumId, this.operationArea);
    }
    createDiscTable() {
      const tableRows = document.querySelectorAll(".m-table-album tr");
      const tableParent = document.querySelector("div:has(> .m-table-album)");
      let isTableCreated = false;
      this.albumDiscList.forEach((disc, index) => {
        if (disc === null) return;
        isTableCreated = true;
        tableParent.innerHTML += `
            <div class="u-title u-title-1 f-cb" style="margin-top: 10px"><h3><span class="f-ff2">${disc.title}</span></h3><span class="sub s-fc3">${disc.songs.length}首歌</span></div>
            <table class="m-table m-table-album">
                <thead><tr><th class="first w1"><div class="wp">&nbsp;</div></th><th><div class="wp">歌曲标题</div></th><th class="w2-1"><div class="wp">时长</div></th><th class="w4"><div class="wp">歌手</div></th></tr></thead>
                <tbody id="ncmextend-disc-${index}"></tbody>
            </table>
            `;
        let tbody = tableParent.querySelector(`#ncmextend-disc-${index}`);
        disc.songs.forEach((songItem, songIndex) => {
          tableRows.forEach((tableRow) => {
            if (Number(tableRow.id.slice(0, -13)) === songItem.id) {
              tableRow.querySelector(".num").innerHTML = songItem.song.no;
              tableRow.className = songIndex % 2 == 0 ? "even " : "";
              if (songItem.privilege.st < 0) tableRow.className += "js-dis";
              tbody.appendChild(tableRow);
            }
          });
        });
      });
      if (isTableCreated) {
        const originTitle = document.querySelector(".n-songtb .u-title");
        originTitle.parentNode.removeChild(originTitle);
        tableParent.removeChild(tableParent.firstChild);
      }
      if (/^songlist-(\d+)$/.test(this._hash) && tableRows.length > 0) {
        const timestamp = document.querySelector(".m-table > tbody > tr").id.slice(-13);
        const tr = document.querySelector(`[id="${this._hash.slice(9)}${timestamp}"]`);
        if (tr) tr.scrollIntoView();
      }
    }
    updateSongsCloudStatus(songIds) {
      songIds.forEach((songId) => {
        for (let i = 0; i < this.albumSongList.length; i++) {
          if (this.albumSongList[i].id == songId) {
            this.albumSongList[i].privilege.cs = true;
            break;
          }
        }
      });
    }
  }
  let albumDetailObj = new AlbumDetail();
  const PlayAPIDataLimit = 1e3;
  const CheckAPIDataLimit = 100;
  const importAPIDataLimit = 10;
  class ncmDownUploadBatch {
    constructor(songs, config) {
      this.hasError = false;
      this.songs = songs;
      this.songIdIndexsMap = {};
      this.playerApiSongIds = [];
      this.downloadApiSongIds = [];
      for (let i = 0; i < songs.length; i++) {
        const songId = songs[i].id;
        this.songIdIndexsMap[songId] = i;
        if (songs[i].api.url === "/api/song/enhance/player/url/v1") {
          this.playerApiSongIds.push(songId);
        } else {
          this.downloadApiSongIds.push(songId);
        }
      }
      this.successSongsId = [];
      this.skipSongs = [];
      this.failSongs = [];
      this.config = config;
      this.log = "";
    }
    startUpload() {
      Swal.fire({
        input: "textarea",
        inputLabel: "批量转存云盘",
        confirmButtonText: "关闭",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCloseButton: false,
        showConfirmButton: true,
        inputAttributes: {
          "readonly": true
        },
        footer: "<div>建议先在个人主页先设置好请求头，以避免上传失败</div><div>浏览器F12控制台中可查看所有的接口返回内容，出错时可进行检查。</div>",
        didOpen: () => {
          this.textarea = Swal.getInput();
          this.textarea.style = "height: 300px;";
          this.comfirmBtn = Swal.getConfirmButton();
          this.comfirmBtn.style = "display: none;";
          this.fetchFileDetail();
        }
      });
    }
    fetchFileDetail() {
      this.addLog(`将上传 ${this.songs.length} 首歌`);
      this.addLog("第一步：获取歌曲文件信息");
      if (this.playerApiSongIds.length > 0) {
        this.addLog("通过试听接口获取歌曲文件信息");
        this.fetchFileDetailByPlayerApi(0);
      } else {
        this.fetchFileDetailByDownloadApi();
      }
    }
    fetchFileDetailByPlayerApi(offset, retry = false) {
      if (offset >= this.playerApiSongIds.length) {
        this.addLog("通过试听接口获取歌曲文件信息完成");
        this.fetchFileDetailByDownloadApi();
        return;
      }
      this.addLog(`正在获取第 ${offset + 1} 到 第 ${Math.min(offset + PlayAPIDataLimit, this.playerApiSongIds.length)} 首歌曲`);
      const ids = this.playerApiSongIds.slice(offset, offset + PlayAPIDataLimit);
      weapiRequest("/api/song/enhance/player/url/v1", {
        data: {
          ids: JSON.stringify(ids),
          level: this.config.level,
          encodeType: "mp3"
        },
        onload: (content) => {
          if (content.code != 200) {
            console.error("试听接口", content);
            if (!retry) {
              this.addLog("接口调用失败，1秒后重试");
              sleep(1e3).then(() => {
                this.fetchFileDetailByPlayerApi(offset, retry = true);
              });
            } else {
              this.addLog("接口调用失败，将跳过出错歌曲");
              this.hasError = true;
              sleep(1e3).then(() => {
                this.fetchFileDetailByPlayerApi(offset + PlayAPIDataLimit);
              });
            }
            return;
          }
          console.log("试听接口", content);
          content.data.forEach((songFileData) => {
            let songIndex = this.songIdIndexsMap[songFileData.id];
            if (this.config.targetLevelOnly && this.config.level != songFileData.level) {
              if (this.songs[songIndex].api.url === "/api/song/enhance/player/url/v1") {
                this.skipSongs.push(this.songs[songIndex].title);
              }
            } else if (songFileData.md5) {
              this.songs[songIndex].fileFullName = nameFileWithoutExt(this.songs[songIndex].title, this.songs[songIndex].artist, this.config.out) + "." + songFileData.type.toLowerCase();
              this.songs[songIndex].md5 = songFileData.md5;
              this.songs[songIndex].size = songFileData.size;
              this.songs[songIndex].level = songFileData.level;
              this.songs[songIndex].ext = songFileData.type.toLowerCase();
              this.songs[songIndex].bitrate = Math.floor(songFileData.br / 1e3);
            } else {
              console.error("试听接口", this.songs[songIndex].title, songFileData);
              this.failSongs.push(this.songs[songIndex].title + "：通过试听接口获取文件信息失败");
            }
          });
          this.fetchFileDetailByPlayerApi(offset + PlayAPIDataLimit);
        },
        onerror: (content) => {
          console.error("试听接口", content);
          if (!retry) {
            this.addLog("试听接口调用时报错，1秒后重试");
            sleep(1e3).then(() => {
              this.fetchFileDetailByPlayerApi(offset, retry = true);
            });
          } else {
            this.addLog("试听接口调用时报错，将跳过出错歌曲");
            this.hasError = true;
            sleep(1e3).then(() => {
              this.fetchFileDetailByPlayerApi(offset + PlayAPIDataLimit);
            });
          }
        }
      });
    }
    fetchFileDetailByDownloadApi() {
      if (this.downloadApiSongIds.length > 0) {
        this.addLog("通过下载接口获取更好音质(非vip用户少数歌曲可获取到无损、HiRes音质)");
        this.fetchFileDetailByDownloadApiSub(0);
      } else {
        this.fetchCloudId();
      }
    }
    fetchFileDetailByDownloadApiSub(offset, retry = false) {
      if (offset >= this.downloadApiSongIds.length) {
        this.addLog("通过下载接口获取歌曲文件信息完成");
        this.fetchCloudId();
        return;
      }
      let songId = this.downloadApiSongIds[offset];
      let songIndex = this.songIdIndexsMap[songId];
      weapiRequest(
        "/api/song/enhance/download/url/v1",
        {
          data: this.songs[songIndex].api.data,
          onload: (content) => {
            if (content.code != 200) {
              console.error("下载接口", content);
              if (!retry) {
                this.addLog("接口调用失败，1秒后重试");
                sleep(1e3).then(() => {
                  this.fetchFileDetailByDownloadApiSub(offset, retry = true);
                });
              } else {
                this.addLog(`歌曲 ${this.songs[songIndex].title} 下载接口调用失败，跳过`);
                this.failSongs.push(this.songs[songIndex].title + "：通过下载接口获取文件信息失败");
                this.hasError = true;
                sleep(1e3).then(() => {
                  this.fetchFileDetailByDownloadApiSub(offset + 1);
                });
              }
              return;
            }
            console.log("下载接口", content);
            if (this.config.targetLevelOnly && this.config.level != content.data.level) {
              this.skipSongs.push(this.songs[songIndex].title);
            } else if (content.data.md5) {
              this.songs[songIndex].fileFullName = nameFileWithoutExt(this.songs[songIndex].title, this.songs[songIndex].artist, this.config.out) + "." + content.data.type.toLowerCase();
              this.songs[songIndex].md5 = content.data.md5;
              this.songs[songIndex].size = content.data.size;
              this.songs[songIndex].level = content.data.level;
              this.songs[songIndex].ext = content.data.type.toLowerCase();
              this.songs[songIndex].bitrate = Math.floor(content.data.br / 1e3);
              this.addLog(`${this.songs[songIndex].title} 通过下载接口获取到 ${levelDesc(content.data.level)} 音质文件信息`);
            } else {
              this.failSongs.push(this.songs[songIndex].title + "：通过下载接口获取文件信息失败");
            }
            this.fetchFileDetailByDownloadApiSub(offset + 1);
          },
          onerror: (content) => {
            console.error("下载接口", content);
            if (!retry) {
              this.addLog("下载接口调用时报错，1秒后重试");
              sleep(1e3).then(() => {
                this.fetchFileDetailByDownloadApiSub(offset, retry = true);
              });
            } else {
              this.addLog(`歌曲 ${this.songs[songIndex].title} 下载接口调用失败，跳过`);
              this.failSongs.push(this.songs[songIndex].title + "：通过下载接口获取文件信息失败");
              this.hasError = true;
              sleep(1e3).then(() => {
                this.fetchFileDetailByDownloadApiSub(offset + 1);
              });
            }
          }
        }
      );
    }
    fetchCloudId() {
      this.addLog("第二步：获取文件的云盘ID");
      this.fetchCloudIdSub(0);
    }
    fetchCloudIdSub(offset, retry = false) {
      if (offset >= this.songs.length) {
        this.addLog("获取文件的云盘ID完成");
        this.importSongs();
        return;
      }
      let songMD5Map = {};
      let songCheckDatas = [];
      let index = offset;
      while (index < this.songs.length && songCheckDatas.length < CheckAPIDataLimit) {
        let song = this.songs[index];
        if (song.md5) {
          songCheckDatas.push({
            md5: song.md5,
            songId: song.id,
            bitrate: song.bitrate,
            fileSize: song.size
          });
          songMD5Map[song.md5] = song.id;
        }
        index += 1;
      }
      this.addLog(`正在获取第 ${offset + 1} 到 第 ${index} 首歌曲`);
      if (songCheckDatas.length == 0) {
        this.fetchCloudIdSub(index);
        return;
      }
      weapiRequest("/api/cloud/upload/check/v2", {
        data: {
          uploadType: 0,
          songs: JSON.stringify(songCheckDatas)
        },
        onload: (content) => {
          if (content.code != 200 || content.data.length == 0) {
            console.error("获取文件云盘ID接口", content);
            if (!retry) {
              this.addLog("接口调用失败，1秒后重试");
              sleep(1e3).then(() => {
                this.fetchCloudIdSub(offset, retry = true);
              });
            } else {
              this.addLog("接口调用失败，将跳过出错歌曲");
              this.hasError = true;
              sleep(1e3).then(() => {
                this.fetchCloudIdSub(index);
              });
            }
            return;
          }
          console.log("获取文件云盘ID接口", content);
          let hasFail = false;
          content.data.forEach((fileData) => {
            const songId = songMD5Map[fileData.md5];
            const songIndex = this.songIdIndexsMap[songId];
            if (fileData.upload == 1) {
              this.songs[songIndex].cloudId = fileData.songId;
            } else {
              this.failSongs.push(this.songs[songIndex].title);
              hasFail = true;
            }
          });
          if (hasFail) {
            console.error("获取文件云盘ID api", content);
          }
          this.fetchCloudIdSub(index);
        },
        onerror: (content) => {
          console.error("获取文件云盘ID接口", content);
          if (!retry) {
            this.addLog("调用接口时报错，1秒后重试");
            sleep(1e3).then(() => {
              this.fetchCloudIdSub(offset, retry = true);
            });
          } else {
            this.addLog("调用接口时报错，将跳过出错歌曲");
            this.hasError = true;
            sleep(1e3).then(() => {
              this.fetchCloudIdSub(index);
            });
          }
        }
      });
    }
    importSongs() {
      this.addLog("第三步：文件导入云盘");
      this.importSongsSub(0);
    }
    importSongsSub(offset, retry = false) {
      if (offset >= this.songs.length) {
        this.final();
        return;
      }
      let songCloudIdMap = {};
      let importSongDatas = [];
      let index = offset;
      while (index < this.songs.length && importSongDatas.length < importAPIDataLimit) {
        let song = this.songs[index];
        if (song.cloudId) {
          importSongDatas.push({
            songId: song.cloudId,
            bitrate: song.bitrate,
            song: song.fileFullName,
            artist: song.artist,
            album: song.album,
            fileName: song.fileFullName
          });
          songCloudIdMap[song.cloudId] = song.id;
        }
        index += 1;
      }
      if (importSongDatas.length == 0) {
        this.importSongsSub(index);
        return;
      }
      weapiRequest("/api/cloud/user/song/import", {
        data: {
          uploadType: 0,
          songs: JSON.stringify(importSongDatas)
        },
        onload: (content) => {
          if (content.code != 200) {
            console.error("歌曲导入云盘接口", content);
            if (!retry) {
              this.addLog("接口调用失败，1秒后重试");
              sleep(1e3).then(() => {
                this.importSongsSub(offset, retry = true);
              });
            } else {
              this.addLog("接口调用失败，将跳过出错歌曲");
              this.hasError = true;
              sleep(1e3).then(() => {
                this.importSongsSub(index);
              });
            }
          }
          console.log("歌曲导入云盘接口", content);
          if (content.data.successSongs.length > 0) {
            let successSongs = [];
            content.data.successSongs.forEach((successSong) => {
              let songId = songCloudIdMap[successSong.songId];
              this.successSongsId.push(songId);
              successSongs.push(this.songs[this.songIdIndexsMap[songId]].title);
            });
            this.addLog(`以下歌曲上传成功：${successSongs.join()}`);
          }
          if (content.data.failed.length > 0) {
            console.error("导入歌曲接口，存在上传失败歌曲。", content.data.failed);
            content.data.failed.forEach((failSong) => {
              let songId = songCloudIdMap[failSong.songId];
              let songTItle = this.songs[this.songIdIndexsMap[songId]].title;
              if (failSong.msg) {
                songTItle += "：" + failSong.msg;
              }
              this.failSongs.push(songTItle);
            });
          }
          this.importSongsSub(index);
        },
        onerror: (content) => {
          console.error("歌曲导入云盘", content);
          if (!retry) {
            this.addLog("调用接口时报错，1秒后重试");
            sleep(1e3).then(() => {
              this.importSongsSub(offset, retry = true);
            });
          } else {
            this.addLog("调用接口时报错，将跳过出错歌曲");
            this.hasError = true;
            sleep(1e3).then(() => {
              this.importSongsSub(index);
            });
          }
        }
      });
    }
    final() {
      this.addLog("上传结束");
      if (this.hasError) {
        this.addLog("调用接口时存在报错，跳过了部分歌曲。请尝试重新上传");
      }
      if (this.skipSongs.length > 0) {
        this.addLog(`有${this.skipSongs.length}首歌不是目标音质不进行上传`);
      }
      if (this.failSongs.length > 0) {
        this.addLog(`以下${this.failSongs.length}首歌上传失败：${this.failSongs.join()}`);
      }
      this.updateSongCloudStatus();
      this.comfirmBtn.style = "display: inline-block;";
    }
    addLog(log) {
      this.log += log + "\n";
      this.textarea.value = this.log;
      this.textarea.scrollTop = this.textarea.scrollHeight;
    }
    //更新缓存歌曲的云盘状态
    updateSongCloudStatus() {
      if (this.successSongsId.length > 0) {
        if (this.config.listType == "playlist") {
          playlistDetailObj.updateSongsCloudStatus(this.successSongsId);
        } else if (this.config.listType == "album") {
          albumDetailObj.updateSongsCloudStatus(this.successSongsId);
        }
      }
    }
  }
  function injectGA4() {
    const GA_MEASUREMENT_ID = "G-PHPDMCG4FW";
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const initScript = document.createElement("script");
    initScript.textContent = `
        // 在页面上下文中初始化GA4
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        
        console.log('🎯 GA4在页面上下文中初始化完成');
        
        // 发送页面浏览事件
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: location.href
        });
        
        // 暴露给油猴脚本使用
        window._ga4Track = function(eventName, params) {
            gtag('event', eventName, params);
        };
    `;
    document.head.appendChild(initScript);
    document.head.appendChild(gtagScript);
    console.log("GA4脚本已注入页面上下文");
  }
  function sendEvent(eventName, parameters = {}) {
    unsafeWindow._ga4Track(eventName, parameters);
    console.log("事件发送:", eventName, parameters);
  }
  class Uploader {
    constructor(config, showAll = false) {
      this.songs = [];
      this.config = config;
      this.filter = {
        text: "",
        noCopyright: true,
        vip: true,
        pay: true,
        lossless: false,
        all: showAll,
        songIndexs: []
      };
      this.page = {
        current: 1,
        max: 1,
        limitCount: 50
      };
      this.batchUpload = {
        working: false,
        stopFlag: false,
        songIndexs: [],
        checkOffset: 0,
        importOffset: 0,
        matchOffset: 0
      };
    }
    start() {
      this.showPopup();
    }
    showPopup() {
      Swal.fire({
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        width: 800,
        html: `<style>
    table {
        width: 100%;
        border-spacing: 0px;
        border-collapse: collapse;
    }
    table th, table td {
        text-align: left;
        text-overflow: ellipsis;
    }
    table tbody {
        display: block;
        width: 100%;
        max-height: 400px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    table thead tr, table tbody tr, table tfoot tr {
        box-sizing: border-box;
        table-layout: fixed;
        display: table;
        width: 100%;
    }
    table tbody tr td{
        border-bottom: none;
    }
tr th:nth-child(1),tr td:nth-child(1){
width: 8%;
}
tr th:nth-child(2){
width: 35%;
}
tr td:nth-child(2){
width: 10%;
}
tr td:nth-child(3){
width: 25%;
}
tr th:nth-child(3),tr td:nth-child(4){
width: 20%;
}
tr th:nth-child(4),tr td:nth-child(5){
width: 8%;
}
tr th:nth-child(5),tr td:nth-child(6){
width: 16%;
}
tr th:nth-child(6),tr td:nth-child(7){
width: 8%;
}
</style>
<input id="text-filter" class="swal2-input" placeholder="歌曲过滤">
<div id="my-cbs">
<input class="form-check-input" type="checkbox" value="" id="cb-copyright" checked><label class="form-check-label" for="cb-copyright">无版权</label>
<input class="form-check-input" type="checkbox" value="" id="cb-vip" checked><label class="form-check-label" for="cb-vip">VIP</label>
<input class="form-check-input" type="checkbox" value="" id="cb-pay" checked><label class="form-check-label" for="cb-pay">数字专辑</label>
<input class="form-check-input" type="checkbox" value="" id="cb-lossless"><label class="form-check-label" for="cb-lossless">无损资源</label>
<input class="form-check-input" type="checkbox" value="" id="cb-all" ${this.filter.all ? "checked" : ""}><label class="form-check-label" for="cb-all">全部歌曲</label>
</div>
<button type="button" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;" id="btn-upload-batch">全部上传</button>
<table border="1" frame="hsides" rules="rows"><thead><tr><th>操作</th><th>歌曲标题</th><th>歌手</th><th>时长</th><th>文件信息</th><th>备注</th> </tr></thead><tbody></tbody></table>
`,
        footer: "<div></div>",
        didOpen: () => {
          let container = Swal.getHtmlContainer();
          let footer = Swal.getFooter();
          let tbody = container.querySelector("tbody");
          this.popupObj = {
            container,
            tbody,
            footer
          };
          let filterInput = container.querySelector("#text-filter");
          filterInput.addEventListener("change", () => {
            let filtertext = filterInput.value.trim();
            if (this.filter.text != filtertext) {
              this.filter.text = filtertext;
              this.applyFilter();
            }
          });
          let copyrightInput = container.querySelector("#cb-copyright");
          copyrightInput.addEventListener("change", () => {
            this.filter.noCopyright = copyrightInput.checked;
            this.applyFilter();
          });
          let vipInput = container.querySelector("#cb-vip");
          vipInput.addEventListener("change", () => {
            this.filter.vip = vipInput.checked;
            this.applyFilter();
          });
          let payInput = container.querySelector("#cb-pay");
          payInput.addEventListener("change", () => {
            this.filter.pay = payInput.checked;
            this.applyFilter();
          });
          let losslessInput = container.querySelector("#cb-lossless");
          losslessInput.addEventListener("change", () => {
            this.filter.lossless = losslessInput.checked;
            this.applyFilter();
          });
          let allInput = container.querySelector("#cb-all");
          allInput.addEventListener("change", () => {
            this.filter.all = allInput.checked;
            this.applyFilter();
          });
          let uploader = this;
          this.btnUploadBatch = container.querySelector("#btn-upload-batch");
          this.btnUploadBatch.addEventListener("click", () => {
            if (this.batchUpload.working) {
              this.batchUpload.stopFlag = true;
              return;
            }
            this.batchUpload.songIndexs = [];
            this.filter.songIndexs.forEach((idx) => {
              const song = uploader.songs[idx];
              if (!song.uploaded && song.uploadType != 0) {
                uploader.batchUpload.songIndexs.push(idx);
              }
            });
            if (this.batchUpload.songIndexs.length == 0) {
              showTips("没有需要上传的歌曲", 1);
              return;
            }
            this.batchUpload.working = true;
            this.batchUpload.stopFlag = false;
            this.batchUpload.checkOffset = 0;
            this.batchUpload.importOffset = 0;
            this.batchUpload.matchOffset = 0;
            this.btnUploadBatch.innerHTML = "停止";
            this.uploadSongBatch();
          });
          this.fetchSongInfo();
        },
        willClose: () => {
          this.batchUpload.stopFlag = true;
        }
      });
    }
    fetchSongInfo() {
      let ids = this.config.data.map((item) => {
        return {
          "id": item.id
        };
      });
      this.popupObj.tbody.innerHTML = "<div>正在获取歌曲信息</div><div>并排除已上传的歌曲</div>";
      this.fetchSongInfoSub(ids, 0);
    }
    fetchSongInfoSub(ids, startIndex) {
      if (startIndex >= ids.length) {
        if (this.songs.length == 0) {
          this.popupObj.tbody.innerHTML = "没有可以上传的歌曲";
          return;
        }
        this.songs.sort((a, b) => {
          if (a.albumid != b.albumid) {
            return b.albumid - a.albumid;
          }
          return a.id - b.id;
        });
        this.createTableRow();
        this.applyFilter();
        return;
      }
      this.popupObj.tbody.innerHTML = `<div>正在获取第${startIndex + 1}到${Math.min(ids.length, startIndex + 1e3)}首歌曲信息</div><div>并排除已上传的歌曲</div>`;
      let uploader = this;
      weapiRequest("/api/v3/song/detail", {
        data: {
          c: JSON.stringify(ids.slice(startIndex, startIndex + 1e3))
        },
        onload: function(content) {
          if (content.code != 200 || !content.songs) {
            setTimeout(uploader.fetchSongInfoSub(ids, startIndex), 1e3);
            return;
          }
          let songslen = content.songs.length;
          let privilegelen = content.privileges.length;
          for (let i = 0; i < privilegelen; i++) {
            if (!content.privileges[i].cs) {
              let config = uploader.config.data.find((item2) => {
                return item2.id == content.privileges[i].id;
              });
              let item = {
                id: content.privileges[i].id,
                name: "未知",
                album: "未知",
                albumid: 0,
                artists: "未知",
                tns: "",
                //翻译
                dt: duringTimeDesc(0),
                filename: "未知." + config.ext,
                ext: config.ext,
                md5: config.md5,
                size: config.size,
                bitrate: config.bitrate,
                picUrl: "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
                isNoCopyright: content.privileges[i].st < 0,
                isVIP: false,
                isPay: false,
                uploaded: false,
                needMatch: config.name == void 0
              };
              for (let j = 0; j < songslen; j++) {
                if (content.songs[j].id == content.privileges[i].id) {
                  item.name = content.songs[j].name;
                  item.album = getAlbumTextInSongDetail(content.songs[j]);
                  item.albumid = content.songs[j].al.id || 0;
                  item.artists = getArtistTextInSongDetail(content.songs[j]);
                  item.tns = content.songs[j].tns ? content.songs[j].tns.join() : "";
                  item.dt = duringTimeDesc(content.songs[j].dt || 0);
                  item.filename = nameFileWithoutExt(item.name, item.artists, "artist-title") + "." + config.ext;
                  item.picUrl = content.songs[j].al && content.songs[j].al.picUrl ? content.songs[j].al.picUrl : "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
                  item.isVIP = content.songs[j].fee == 1;
                  item.isPay = content.songs[j].fee == 4;
                  break;
                }
              }
              if (config.name) {
                item.name = config.name;
                item.album = config.al;
                item.artists = config.ar;
                item.filename = nameFileWithoutExt(item.name, item.artists, "artist-title") + "." + config.ext;
              }
              uploader.songs.push(item);
            }
          }
          uploader.fetchSongInfoSub(ids, startIndex + 1e3);
        }
      });
    }
    createTableRow() {
      for (let i = 0; i < this.songs.length; i++) {
        let song = this.songs[i];
        let tablerow = document.createElement("tr");
        tablerow.innerHTML = `<td><button type="button" class="swal2-styled uploadbtn">上传</button><button type="button" class="swal2-styled reuploadbtn" style="display: none">文件已在云盘，点击关联到此歌曲</button></td><td><a href="https://music.163.com/album?id=${song.albumid}" target="_blank"><img src="${song.picUrl}?param=50y50&quality=100" title="${song.album}"></a></td><td><a href="https://music.163.com/song?id=${song.id}" target="_blank">${song.name}</a></td><td>${song.artists}</td><td>${song.dt}</td><td>${fileSizeDesc(song.size)} ${song.ext.toUpperCase()}</td><td class="song-remark"></td>`;
        let songTitle = tablerow.querySelector(".song-remark");
        if (song.isNoCopyright) {
          songTitle.innerHTML = "无版权";
        } else if (song.isVIP) {
          songTitle.innerHTML = "VIP";
        } else if (song.isPay) {
          songTitle.innerHTML = "数字专辑";
        }
        let uploadbtn = tablerow.querySelector(".uploadbtn");
        uploadbtn.addEventListener("click", () => {
          if (this.batchUpload.working) {
            return;
          }
          this.uploadSong(i);
        });
        let reuploadbtn = tablerow.querySelector(".reuploadbtn");
        reuploadbtn.addEventListener("click", () => {
          if (this.batchUpload.working) {
            return;
          }
          this.uploadSongWay2Part1(i);
        });
        song.tablerow = tablerow;
      }
    }
    applyFilter() {
      this.filter.songIndexs = [];
      let filterText = this.filter.text;
      let isNoCopyright = this.filter.noCopyright;
      let isVIP = this.filter.vip;
      let isPay = this.filter.pay;
      let isLossless = this.filter.lossless;
      let isALL = this.filter.all;
      for (let i = 0; i < this.songs.length; i++) {
        let song = this.songs[i];
        if (filterText.length > 0 && !song.name.includes(filterText) && !song.album.includes(filterText) && !song.artists.includes(filterText) && !song.tns.includes(filterText)) {
          continue;
        }
        if (isALL) {
          this.filter.songIndexs.push(i);
        } else if (isNoCopyright && song.isNoCopyright) {
          this.filter.songIndexs.push(i);
        } else if (isVIP && song.isVIP) {
          this.filter.songIndexs.push(i);
        } else if (isPay && song.isPay) {
          this.filter.songIndexs.push(i);
        } else if (isLossless && song.ext == "flac") {
          this.filter.songIndexs.push(i);
        }
      }
      this.page.current = 1;
      this.page.max = Math.ceil(this.filter.songIndexs.length / this.page.limitCount);
      this.renderData();
      this.renderFilterInfo();
    }
    renderData() {
      if (this.filter.songIndexs.length == 0) {
        this.popupObj.tbody.innerHTML = "空空如也";
        this.popupObj.footer.innerHTML = "";
        return;
      }
      this.popupObj.tbody.innerHTML = "";
      let songBegin = (this.page.current - 1) * this.page.limitCount;
      let songEnd = Math.min(this.filter.songIndexs.length, songBegin + this.page.limitCount);
      for (let i = songBegin; i < songEnd; i++) {
        this.popupObj.tbody.appendChild(this.songs[this.filter.songIndexs[i]].tablerow);
      }
      let pageIndexs = [1];
      let floor = Math.max(2, this.page.current - 2);
      let ceil = Math.min(this.page.max - 1, this.page.current + 2);
      for (let i = floor; i <= ceil; i++) {
        pageIndexs.push(i);
      }
      if (this.page.max > 1) {
        pageIndexs.push(this.page.max);
      }
      let uploader = this;
      this.popupObj.footer.innerHTML = "";
      pageIndexs.forEach((pageIndex) => {
        let pageBtn = document.createElement("button");
        pageBtn.setAttribute("type", "button");
        pageBtn.className = "swal2-styled";
        pageBtn.innerHTML = pageIndex;
        if (pageIndex != uploader.page.current) {
          pageBtn.addEventListener("click", () => {
            uploader.page.current = pageIndex;
            uploader.renderData();
          });
        } else {
          pageBtn.style.background = "white";
        }
        uploader.popupObj.footer.appendChild(pageBtn);
      });
    }
    renderFilterInfo() {
      let sizeTotal = 0;
      let countCanUpload = 0;
      this.filter.songIndexs.forEach((idx) => {
        let song = this.songs[idx];
        if (!song.uploaded && song.uploadType != 0) {
          countCanUpload += 1;
          sizeTotal += song.size;
        }
      });
      this.btnUploadBatch.innerHTML = "全部上传";
      if (countCanUpload > 0) {
        this.btnUploadBatch.innerHTML += ` (${countCanUpload}首 ${fileSizeDesc(sizeTotal)})`;
      }
    }
    setReUploadButtonViewable(songIndex) {
      let uploadbtn = this.songs[songIndex].tablerow.querySelector(".uploadbtn");
      uploadbtn.style.display = "none";
      let reuploadbtn = this.songs[songIndex].tablerow.querySelector(".reuploadbtn");
      reuploadbtn.style.display = "";
    }
    uploadSong(songIndex) {
      let song = this.songs[songIndex];
      if (song.cloudId) {
        if (song.uploadType == 1) {
          this.uploadSongImport(songIndex);
        } else if (song.uploadType == 0) {
          this.uploadSongWay2Part1(songIndex);
        }
        return;
      }
      let uploader = this;
      try {
        let songCheckData = [{
          md5: song.md5,
          songId: song.id,
          bitrate: song.bitrate,
          fileSize: song.size
        }];
        weapiRequest("/api/cloud/upload/check/v2", {
          data: {
            uploadType: 0,
            songs: JSON.stringify(songCheckData)
          },
          onload: (res1) => {
            if (res1.code != 200) {
              console.error(song.name, "1.检查资源", res1);
              uploader.onUploadFail(songIndex);
              return;
            }
            if (res1.data.length < 1) {
              if (song.id > 0) {
                uploader.songs[songIndex].id = 0;
                uploader.uploadSong(songIndex);
              } else {
                console.error(song.name, "1.检查资源", res1);
                uploader.onUploadFail(songIndex);
              }
              return;
            }
            console.log(song.name, "1.检查资源", res1);
            song.uploadType = res1.data[0].upload;
            if (song.uploadType == 1) {
              console.log(song.name, "1.检查资源", res1);
              showTips(`(1/3)${song.name} 检查资源`, 1);
              song.cloudId = res1.data[0].songId;
              uploader.uploadSongImport(songIndex);
            } else if (song.uploadType == 0) {
              uploader.setReUploadButtonViewable(songIndex);
              song.cloudId = res1.data[0].songId;
              uploader.onUploadFinnsh();
            } else {
              console.error(song.name, "1.检查资源", res1);
              showTips(`(1/3)${song.name} 文件无法上传`, 2);
              song.uploaded = true;
              let btnUpload = song.tablerow.querySelector(".uploadbtn");
              btnUpload.innerHTML = "无法上传";
              btnUpload.disabled = "disabled";
              uploader.onUploadFinnsh();
            }
          },
          onerror: function(res) {
            console.error(song.name, "1.检查资源", res);
            uploader.onUploadFail(songIndex);
          }
        });
      } catch (e) {
        console.error(e);
        uploader.onUploadFail(songIndex);
      }
    }
    uploadSongImport(songIndex) {
      let song = this.songs[songIndex];
      sendEvent("cloud_upload_upload_song", {
        "user_id": unsafeWindow.GUser.userId,
        "song_id": song.cloudId,
        "song_name": song.name,
        "cloud_song_id": song.cloudSongId
      });
      if (song.cloudSongId) {
        this.uploadSongMatch(songIndex);
        return;
      }
      let uploader = this;
      let importSongData = [{
        songId: song.cloudId,
        bitrate: song.bitrate,
        song: song.filename,
        artist: song.artists,
        album: song.album,
        fileName: song.filename
      }];
      try {
        weapiRequest("/api/cloud/user/song/import", {
          data: {
            uploadType: 0,
            songs: JSON.stringify(importSongData)
          },
          onload: (res) => {
            if (res.code != 200 || res.data.successSongs.length < 1) {
              console.error(song.name, "2.导入文件", res);
              uploader.onUploadFail(songIndex);
              return;
            }
            console.log(song.name, "2.导入文件", res);
            song.cloudSongId = res.data.successSongs[0].song.songId;
            uploader.uploadSongMatch(songIndex);
          },
          onerror: (responses2) => {
            console.error(song.name, "2.导入歌曲", responses2);
            uploader.onUploadFail(songIndex);
          }
        });
      } catch (e) {
        console.error(e);
        uploader.onUploadFail(songIndex);
      }
    }
    uploadSongMatch(songIndex) {
      let song = this.songs[songIndex];
      let uploader = this;
      if (song.cloudSongId != song.id && song.id > 0) {
        weapiRequest("/api/cloud/user/song/match", {
          data: {
            songId: song.cloudSongId,
            adjustSongId: song.id
          },
          onload: (res5) => {
            if (res5.code != 200) {
              console.error(song.name, "5.匹配歌曲", res5);
              uploader.onUploadFail(songIndex);
              return;
            }
            console.log(song.name, "5.匹配歌曲", res5);
            console.log(song.name, "完成");
            uploader.onUploadSucess(songIndex);
          },
          onerror: function(res) {
            console.error(song.name, "5.匹配歌曲", res);
            uploader.onUploadFail(songIndex);
          }
        });
      } else {
        console.log(song.name, "完成");
        uploader.onUploadSucess(songIndex);
      }
    }
    uploadSongWay2Part1(songIndex) {
      let song = this.songs[songIndex];
      let uploader = this;
      try {
        weapiRequest("/api/nos/token/alloc", {
          data: {
            filename: song.filename,
            length: song.size,
            ext: song.ext,
            type: "audio",
            bucket: "jd-musicrep-privatecloud-audio-public",
            local: false,
            nos_product: 3,
            md5: song.md5
          },
          onload: (tokenRes) => {
            song.token = tokenRes.result.token;
            song.objectKey = tokenRes.result.objectKey;
            song.resourceId = tokenRes.result.resourceId;
            song.expireTime = Date.now() + 6e4;
            console.log(song.name, "2.2.开始上传", tokenRes);
            uploader.uploadSongWay2Part2(songIndex);
          },
          onerror: (responses2) => {
            console.error(song.name, "2.获取令牌", responses2);
            uploader.onUploadFail(songIndex);
          }
        });
      } catch (e) {
        console.error(e);
        uploader.onUploadFail(songIndex);
      }
    }
    uploadSongWay2Part2(songIndex) {
      let song = this.songs[songIndex];
      let uploader = this;
      weapiRequest("/api/upload/cloud/info/v2", {
        data: {
          md5: song.md5,
          songid: song.cloudId,
          filename: song.filename,
          song: song.name,
          album: song.album,
          artist: song.artists,
          bitrate: String(song.bitrate || 128),
          resourceId: song.resourceId
        },
        onload: (res3) => {
          if (res3.code != 200) {
            if (song.expireTime < Date.now() || res3.msg && res3.msg.includes("rep create failed")) {
              console.error(song.name, "3.提交文件", res3);
              uploader.onUploadFail(songIndex);
            } else {
              console.log(song.name, "3.正在转码", res3);
              sleep(1e3).then(() => {
                uploader.uploadSongWay2Part2(songIndex);
              });
            }
            return;
          }
          console.log(song.name, "3.提交文件", res3);
          weapiRequest("/api/cloud/pub/v2", {
            data: {
              songid: res3.songId
            },
            onload: (res4) => {
              if (res4.code != 200 && res4.code != 201) {
                console.error(song.name, "4.发布资源", res4);
                uploader.onUploadFail(songIndex);
                return;
              }
              console.log(song.name, "4.发布资源", res4);
              song.cloudSongId = res4.privateCloud.songId;
              uploader.uploadSongMatch(songIndex);
            },
            onerror: function(res) {
              console.error(song.name, "4.发布资源", res);
              uploader.onUploadFail(songIndex);
            }
          });
        },
        onerror: function(res) {
          console.error(song.name, "3.提交文件", res);
          uploader.onUploadFail(songIndex);
        }
      });
    }
    onUploadFail(songIndex) {
      let song = this.songs[songIndex];
      showTips(`${song.name} - ${song.artists} - ${song.album} 上传失败`, 2);
      this.onUploadFinnsh();
    }
    onUploadSucess(songIndex) {
      let song = this.songs[songIndex];
      showTips(`${song.name} - ${song.artists} - ${song.album} 上传成功`, 1);
      this.setSongUploaded(song);
      this.onUploadFinnsh();
    }
    onUploadFinnsh() {
      this.renderFilterInfo();
    }
    setSongUploaded(song) {
      song.uploaded = true;
      let btnSelect = ".uploadbtn";
      if (song.uploadType == 0) {
        btnSelect = ".reuploadbtn";
      }
      let btnUpload = song.tablerow.querySelector(btnSelect);
      btnUpload.innerHTML = "已上传";
      btnUpload.disabled = "disabled";
    }
    uploadSongBatch(retry = false) {
      sendEvent("cloud_upload_upload_song_batch", {
        "user_id": unsafeWindow.GUser.userId,
        "songCount": this.batchUpload.songIndexs.length
      });
      if (this.batchUpload.checkOffset >= this.batchUpload.songIndexs.length) {
        this.onBatchUploadFinnsh();
        showTips("批量上传完成", 1);
        return;
      }
      if (this.batchUpload.stopFlag) {
        this.onBatchUploadFinnsh();
        return;
      }
      let songMD5IndexMap = {};
      let songCheckDatas = [];
      let indexOfSongIndexs = this.batchUpload.checkOffset;
      let endIndex = Math.min(this.batchUpload.songIndexs.length, this.batchUpload.checkOffset + CheckAPIDataLimit);
      while (indexOfSongIndexs < endIndex) {
        let songIndex = this.batchUpload.songIndexs[indexOfSongIndexs];
        let song = this.songs[songIndex];
        songCheckDatas.push({
          md5: song.md5,
          songId: song.id,
          bitrate: song.bitrate,
          fileSize: song.size
        });
        songMD5IndexMap[song.md5] = songIndex;
        indexOfSongIndexs += 1;
      }
      weapiRequest("/api/cloud/upload/check/v2", {
        data: {
          uploadType: 0,
          songs: JSON.stringify(songCheckDatas)
        },
        onload: (content) => {
          if (content.code != 200 || content.data.length == 0) {
            console.error("获取文件云盘ID接口", content);
            if (!retry) {
              showTips("接口调用失败，1秒后重试", 2);
              this.addLog("接口调用失败，1秒后重试");
              sleep(1e3).then(() => {
                this.uploadSongBatch(retry = true);
              });
            } else {
              this.batchUpload.checkOffset = endIndex;
              this.uploadSongBatch();
            }
            return;
          }
          showTips(`获取第 ${this.batchUpload.checkOffset + 1} 到 第 ${indexOfSongIndexs} 首歌曲云盘ID`, 1);
          console.log("获取文件云盘ID接口", content);
          content.data.forEach((fileData) => {
            const songIndex = songMD5IndexMap[fileData.md5];
            this.songs[songIndex].uploadType = fileData.upload;
            this.songs[songIndex].cloudId = fileData.songId;
            if (fileData.upload == 0) {
              this.setReUploadButtonViewable(songIndex);
            } else if (fileData.upload > 1) {
              this.songs[songIndex].uploaded = true;
              let btnUpload = this.songs[songIndex].tablerow.querySelector(".uploadbtn");
              btnUpload.innerHTML = "无法上传";
              btnUpload.disabled = "disabled";
            }
          });
          this.batchUpload.checkOffset = endIndex;
          this.uploadSongImportBatch();
        },
        onerror: (content) => {
          console.error("获取文件云盘ID接口", content);
          if (!retry) {
            showTips("接口调用失败，1秒后重试", 2);
            sleep(1e3).then(() => {
              this.uploadSongBatch(retry = true);
            });
          } else {
            this.batchUpload.checkOffset = endIndex;
            this.uploadSongBatch();
          }
        }
      });
    }
    uploadSongImportBatch(retry = false) {
      sendEvent("cloud_upload_upload_song_import_batch", {
        "user_id": unsafeWindow.GUser.userId
      });
      if (this.batchUpload.importOffset >= this.batchUpload.checkOffset) {
        this.uploadSongBatch();
        return;
      }
      if (this.batchUpload.stopFlag) {
        this.onBatchUploadFinnsh();
        return;
      }
      let songCloudIdIndexMap = {};
      let importSongDatas = [];
      let indexOfSongIndexs = this.batchUpload.importOffset;
      let maxIndex = Math.min(this.batchUpload.checkOffset, this.batchUpload.importOffset + importAPIDataLimit);
      while (indexOfSongIndexs < maxIndex) {
        let songIndex = this.batchUpload.songIndexs[indexOfSongIndexs];
        let song = this.songs[songIndex];
        if ("cloudId" in song) {
          importSongDatas.push({
            songId: song.cloudId,
            bitrate: song.bitrate,
            song: song.filename,
            artist: song.artists,
            album: song.album,
            fileName: song.filename
          });
          songCloudIdIndexMap[song.cloudId] = songIndex;
        }
        indexOfSongIndexs += 1;
      }
      weapiRequest("/api/cloud/user/song/import", {
        data: {
          uploadType: 0,
          songs: JSON.stringify(importSongDatas)
        },
        onload: (content) => {
          if (content.code != 200) {
            console.error("歌曲导入云盘接口", content);
            if (!retry) {
              showTips("接口调用失败，1秒后重试", 1);
              sleep(1e3).then(() => {
                this.uploadSongImportBatch(retry = true);
              });
            } else {
              this.batchUpload.importOffset = indexOfSongIndexs;
              this.uploadSongImportBatch();
            }
          }
          console.log("歌曲导入云盘接口", content);
          if (content.data.successSongs.length > 0) {
            let successSongNames = [];
            content.data.successSongs.forEach((successSong) => {
              let song = this.songs[songCloudIdIndexMap[successSong.songId]];
              song.cloudSongId = successSong.song.songId;
              if (song.cloudSongId == song.id) {
                this.setSongUploaded(song);
                successSongNames.push(song.name);
              }
            });
            showTips(`成功上传${successSongNames.length}首:${successSongNames.join("、")}`, 1);
          }
          this.batchUpload.importOffset = indexOfSongIndexs;
          this.uploadSongMatchBatch();
        },
        onerror: (content) => {
          console.error("歌曲导入云盘", content);
          if (!retry) {
            showTips("接口调用失败，1秒后重试", 1);
            sleep(1e3).then(() => {
              this.uploadSongImportBatch(retry = true);
            });
          } else {
            this.batchUpload.importOffset = indexOfSongIndexs;
            this.uploadSongImportBatch();
          }
        }
      });
    }
    uploadSongMatchBatch(retry = false) {
      if (this.batchUpload.matchOffset >= this.batchUpload.importOffset) {
        this.uploadSongImportBatch();
        return;
      }
      let songIndex = this.batchUpload.songIndexs[this.batchUpload.matchOffset];
      let song = this.songs[songIndex];
      if (!("cloudSongId" in song) || song.cloudSongId == song.id || song.id <= 0) {
        this.batchUpload.matchOffset += 1;
        this.uploadSongMatchBatch();
        return;
      }
      weapiRequest("/api/cloud/user/song/match", {
        data: {
          songId: song.cloudSongId,
          adjustSongId: song.id
        },
        onload: (res5) => {
          if (res5.code != 200) {
            console.error(song.name, "匹配歌曲", res5);
            if (!retry) {
              showTips("接口调用失败，1秒后重试", 1);
              sleep(1e3).then(() => {
                this.uploadSongMatchBatch(retry = true);
              });
            } else {
              this.batchUpload.matchOffset += 1;
              this.uploadSongMatchBatch();
            }
            return;
          }
          console.log(song.name, "匹配歌曲", res5);
          this.setSongUploaded(song);
          showTips(`成功上传1首歌曲`, 1);
          this.batchUpload.matchOffset += 1;
          this.uploadSongMatchBatch();
        },
        onerror: function(res) {
          console.error(song.name, "匹配歌曲", res);
          if (!retry) {
            showTips("接口调用失败，1秒后重试", 1);
            sleep(1e3).then(() => {
              this.uploadSongMatchBatch(retry = true);
            });
          } else {
            this.batchUpload.matchOffset += 1;
            this.uploadSongMatchBatch();
          }
        }
      });
    }
    onBatchUploadFinnsh() {
      this.batchUpload.working = false;
      this.renderFilterInfo();
    }
  }
  const baseCDNURL = "https://gq9ykm.github.io/myuserscriptsjson/";
  let optionMap = {};
  const cloudUpload = async (uiArea) => {
    let btnUpload = createBigButton("快速上传加载中", uiArea, 2);
    let btnUploadDesc = btnUpload.firstChild;
    let toplist = [];
    let selectOptions = {};
    const category = await fetch(`${baseCDNURL}category.json`).then((r) => r.json());
    category.forEach((item) => {
      optionMap[item.value] = item.label;
      selectOptions[item.label] = {};
    });
    let artistmap = {};
    fetch(`${baseCDNURL}top.json`).then((r) => r.json()).then((r) => {
      toplist = r;
      toplist.forEach((artist) => {
        selectOptions[optionMap[artist.categroy]][artist.id] = `${artist.name}(${artist.count}首/${artist.sizeDesc})`;
        artistmap[artist.id] = artist;
      });
      btnUpload.addEventListener("click", ShowCloudUploadPopUp);
      btnUploadDesc.innerHTML = "云盘快速上传";
    });
    function ShowCloudUploadPopUp() {
      Swal.fire({
        title: "快速上传",
        input: "select",
        inputOptions: selectOptions,
        inputPlaceholder: "选择歌手",
        confirmButtonText: "下一步",
        showCloseButton: true,
        footer: '<div>由于网易云增加限制，目前周杰伦等无版权歌曲已经无法关联封面歌词。</div><div>建议先设置好请求头，以避免上传失败。</div><div><a href="https://github.com/Cinvin/myuserscripts/issues"  target="_blank">问题反馈</a></div>',
        inputValidator: (value) => {
          if (!value) {
            return "请选择歌手";
          }
        }
      }).then((result) => {
        sendEvent("cloud_upload_select_artist", {
          "artist_id": result.value,
          "user_id": unsafeWindow.GUser.userId
        });
        if (result.isConfirmed) {
          fetchCDNConfig(result.value);
        }
      });
    }
    function fetchCDNConfig(artistId) {
      showTips(`正在获取资源配置...`, 1);
      fetch(`${baseCDNURL}${artistId}.json`).then((r) => r.json()).then((r) => {
        let uploader = new Uploader(r, true);
        uploader.start();
      }).catch(`获取资源配置失败`);
    }
  };
  const cloudLocalUpload = (uiArea) => {
    let btnLocalUpload = createBigButton("云盘本地上传", uiArea, 2);
    btnLocalUpload.addEventListener("click", ShowLocalUploadPopUp);
    function ShowLocalUploadPopUp() {
      Swal.fire({
        title: "云盘本地上传",
        html: `<div id="my-file">
            <input id='song-file' type="file" accept="audio/*" multiple="multiple" class="swal2-file" placeholder="" style="display: flex;">
            </div>
            <div id="my-rd" style="visibility: hidden;">
            <div class="swal2-radio"">
            <label><input type="radio" name="file-info" value="autofill" checked><span class="swal2-label">直接上传</span></label>
            <label><input type="radio" name="file-info" value="needInput" id="need-fill-info-radio"><span class="swal2-label">先填写文件的歌手、专辑信息</span></label>
            </div>
            </div>`,
        confirmButtonText: "上传",
        showCloseButton: true,
        preConfirm: (level) => {
          let files = document.getElementById("song-file").files;
          if (files.length == 0) return Swal.showValidationMessage("请选择文件");
          return {
            files,
            needFillInfo: document.getElementById("need-fill-info-radio").checked
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          new LocalUpload().start(result.value);
          sendEvent("cloud_local_upload_start", {
            "user_id": _unsafeWindow.GUser.userId,
            "file_count": result.value.files.length,
            "need_fill_info": result.value.needFillInfo,
            "file_names": Array.from(result.value.files).map((file) => file.name).join(",")
          });
        }
      });
    }
    class LocalUpload {
      start(config) {
        this.files = config.files;
        this.needFillInfo = config.needFillInfo;
        this.task = [];
        this.currentIndex = 0;
        this.failIndexs = [];
        for (let i = 0; i < config.files.length; i++) {
          let file = config.files[i];
          let fileName = file.name;
          let song = {
            id: -2,
            songFile: file,
            fileFullName: fileName,
            title: fileName.slice(0, fileName.lastIndexOf(".")),
            artist: "未知",
            album: "未知",
            size: file.size,
            ext: fileName.slice(fileName.lastIndexOf(".") + 1),
            bitrate: 128
          };
          this.task.push(song);
        }
        showTips(`开始获取文件中的标签信息`, 1);
        this.readFileTags(0);
      }
      readFileTags(songIndex) {
        if (songIndex >= this.task.length) {
          if (this.needFillInfo) {
            this.showFillSongInforBox();
          } else {
            this.localUploadPart1(0);
          }
          return;
        }
        let fileData = this.task[songIndex].songFile;
        new jsmediatags.Reader(fileData).read({
          onSuccess: (res) => {
            if (res.tags.title) this.task[songIndex].title = res.tags.title;
            if (res.tags.artist) this.task[songIndex].artist = res.tags.artist;
            if (res.tags.album) this.task[songIndex].album = res.tags.album;
            this.readFileTags(songIndex + 1);
          },
          onError: (error) => {
            this.readFileTags(songIndex + 1);
          }
        });
      }
      showFillSongInforBox() {
        Swal.fire({
          html: `<style>
table {
    width: 100%;
    border-spacing: 0px;
    border-collapse: collapse;
}
table th, table td {
    text-align: left;
    text-overflow: ellipsis;
}
table tbody {
    display: block;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
table thead tr, table tbody tr, table tfoot tr {
    box-sizing: border-box;
    table-layout: fixed;
    display: table;
    width: 100%;
}
table tbody tr td{
    border-bottom: none;
}
tr th:nth-child(1),tr td:nth-child(1){
width: 16%;
}
tr th:nth-child(2),tr td:nth-child(2){
width: 30%;
}
tr th:nth-child(3),tr td:nth-child(3){
width: 27%;
}
tr th:nth-child(4),tr td:nth-child(4){
width: 27%;
}
</style>
<table border="1" frame="hsides" rules="rows"><thead><tr><th>操作</th><th>歌曲标题</th><th>歌手</th><th>专辑</th></tr></thead><tbody></tbody></table>
`,
          confirmButtonText: "上传",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: false,
          didOpen: () => {
            let container = Swal.getHtmlContainer();
            let tbody = container.querySelector("tbody");
            for (let i = 0; i < this.task.length; i++) {
              let tablerow = document.createElement("tr");
              tablerow.innerHTML = `<td><button type="button" class="swal2-styled my-edit">编辑</button></td><td>${this.task[i].title}</td><td>${this.task[i].artist}</td><td>${this.task[i].album}</td>`;
              let btnEdit = tablerow.querySelector(".my-edit");
              btnEdit.addEventListener("click", () => {
                this.showEditInforBox(i);
              });
              tbody.appendChild(tablerow);
            }
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.localUploadPart1(0);
          }
        });
      }
      showEditInforBox(songIndex) {
        Swal.fire({
          title: this.task[songIndex].fileFullName,
          html: `<div><label for="text-title">歌名</label><input class="swal2-input" id="text-title" value="${this.task[songIndex].title}"></div>
            <div><label for="text-artist">歌手</label><input class="swal2-input" id="text-artist"  value="${this.task[songIndex].artist}"></div>
            <div><label for="text-album">专辑</label><input class="swal2-input" id="text-album" value="${this.task[songIndex].album}"></div>`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: false,
          confirmButtonText: "确定",
          preConfirm: () => {
            let songTitle = document.getElementById("text-title").value.trim();
            if (songTitle.length == 0) return Swal.showValidationMessage("歌名不能为空");
            return {
              title: songTitle,
              artist: document.getElementById("text-artist").value.trim(),
              album: document.getElementById("text-album").value.trim()
            };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.task[songIndex].title = result.value.title;
            this.task[songIndex].artist = result.value.artist;
            this.task[songIndex].album = result.value.album;
            this.showFillSongInforBox();
          }
        });
      }
      localUploadPart1(songindex) {
        let self = this;
        let song = self.task[songindex];
        let reader = new FileReader();
        let chunkSize = 1024 * 1024;
        let loaded = 0;
        let md5sum = _unsafeWindow.CryptoJS.algo.MD5.create();
        showTips(`(1/5)${song.title} 正在获取文件MD5值`, 1);
        reader.onload = function(e) {
          md5sum.update(_unsafeWindow.CryptoJS.enc.Latin1.parse(reader.result));
          loaded += e.loaded;
          if (loaded < song.size) {
            readBlob(loaded);
          } else {
            showTips(`(1/5)${song.title} 已计算文件MD5值`, 1);
            song.md5 = md5sum.finalize().toString();
            try {
              weapiRequest("/api/cloud/upload/check", {
                data: {
                  songId: 0,
                  md5: song.md5,
                  length: song.size,
                  ext: song.ext,
                  version: 1,
                  bitrate: song.bitrate
                },
                onload: (res1) => {
                  console.log(song.title, "1.检查资源", res1);
                  if (res1.code != 200) {
                    console.error(song.title, "1.检查资源", res1);
                    self.uploadFail();
                    return;
                  }
                  song.cloudId = res1.songId;
                  song.needUpload = res1.needUpload;
                  weapiRequest("/api/nos/token/alloc", {
                    data: {
                      filename: song.title,
                      length: song.size,
                      ext: song.ext,
                      type: "audio",
                      bucket: "jd-musicrep-privatecloud-audio-public",
                      local: false,
                      nos_product: 3,
                      md5: song.md5
                    },
                    onload: (res2) => {
                      if (res2.code != 200) {
                        console.error(song.title, "2.获取令牌", res2);
                        self.uploadFail();
                        return;
                      }
                      song.resourceId = res2.result.resourceId;
                      song.token = res2.result.token;
                      song.objectKey = res2.result.objectKey;
                      showTips(`(3/5)${song.title} 开始上传文件`, 1);
                      console.log(song.title, "2.获取令牌", res2);
                      if (res1.needUpload) {
                        self.localUploadFile(songindex, 0);
                      } else {
                        song.expireTime = Date.now() + 6e4;
                        self.localUploadPart2(songindex);
                      }
                    },
                    onerror: (res) => {
                      console.error(song.title, "2.获取令牌", res);
                      self.uploadFail();
                    }
                  });
                },
                onerror: (res) => {
                  console.error(song.title, "1.检查资源", res);
                  self.uploadFail();
                }
              });
            } catch (e2) {
              console.error(e2);
              self.uploadFail();
            }
          }
        };
        readBlob(0);
        function readBlob(offset) {
          let blob = song.songFile.slice(offset, offset + chunkSize);
          reader.readAsBinaryString(blob);
        }
      }
      localUploadFile(songindex, offset, context = null) {
        let self = this;
        let song = self.task[songindex];
        try {
          let complete = offset + uploadChunkSize > song.size;
          let url2 = `http://45.127.129.8/jd-musicrep-privatecloud-audio-public/${encodeURIComponent(song.objectKey)}?offset=${offset}&complete=${String(complete)}&version=1.0`;
          if (context) url2 += `&context=${context}`;
          GM_xmlhttpRequest({
            method: "POST",
            url: url2,
            headers: {
              "x-nos-token": song.token,
              "Content-MD5": song.md5,
              "Content-Type": "audio/mpeg"
            },
            data: song.songFile.slice(offset, offset + uploadChunkSize),
            onload: (response3) => {
              let res = JSON.parse(response3.response);
              if (complete) {
                console.log(song.title, "2.5.上传文件完成", res);
                showTips(`(3.5/5)${song.title} 上传文件完成`, 1);
                song.expireTime = Date.now() + 6e4;
                self.localUploadPart2(songindex);
              } else {
                showTips(`(3.4/5)${song.title} 正在上传${fileSizeDesc(res.offset)}/${fileSizeDesc(song.size)}`, 1);
                self.localUploadFile(songindex, res.offset, res.context);
              }
            },
            onerror: (response3) => {
              console.error(song.title, "文件上传时失败", response3);
              self.uploadFail();
            }
          });
        } catch (e) {
          console.error(e);
          self.uploadFail();
        }
      }
      localUploadPart2(songindex) {
        let self = this;
        let song = self.task[songindex];
        try {
          weapiRequest("/api/upload/cloud/info/v2", {
            data: {
              md5: song.md5,
              songid: song.cloudId,
              filename: song.fileFullName,
              song: song.title,
              album: song.album,
              artist: song.artist,
              bitrate: String(song.bitrate),
              resourceId: song.resourceId
            },
            onload: (res3) => {
              if (res3.code != 200) {
                if (song.expireTime < Date.now() || res3.msg && res3.msg.includes("rep create failed")) {
                  console.error(song.title, "3.提交文件", res3);
                  self.uploadFail();
                } else {
                  console.log(song.title, "3.正在转码", res3);
                  showTips(`(4/5)${song.title} 正在转码...`, 1);
                  sleep(1e3).then(() => {
                    self.localUploadPart2(songindex);
                  });
                }
                return;
              }
              console.log(song.title, "3.提交文件", res3);
              showTips(`(4/5)${song.title} 提交文件完成`, 1);
              weapiRequest("/api/cloud/pub/v2", {
                data: {
                  songid: res3.songId
                },
                onload: (res4) => {
                  if (res4.code != 200 && res4.code != 201) {
                    console.error(song.title, "4.发布资源", res4);
                    self.uploadFail();
                    return;
                  }
                  showTips(`(5/5)${song.title} 上传完成`, 1);
                  self.uploadSuccess();
                },
                onerror: (res) => {
                  console.error(song.title, "4.发布资源", res);
                  self.uploadFail();
                }
              });
            },
            onerror: (res) => {
              console.error(song.title, "3.提交文件", res);
              self.uploadFail();
            }
          });
        } catch (e) {
          console.error(e);
          self.uploadFail();
        }
      }
      uploadFail() {
        this.failIndexs.push(this.currentIndex);
        showTips(`${this.task[this.currentIndex].title}上传失败`, 2);
        this.uploadNext();
      }
      uploadSuccess() {
        this.uploadNext();
      }
      uploadNext() {
        this.currentIndex += 1;
        if (this.currentIndex >= this.task.length) {
          this.uploadFinnsh();
        } else {
          this.localUploadPart1(this.currentIndex);
        }
      }
      uploadFinnsh() {
        let msg = "上传完成";
        if (this.failIndexs.length > 0) {
          msg += ",以下文件上传失败：";
          msg += this.failIndexs.map((idx) => this.task[idx].fileFullName).join();
        }
        showConfirmBox(msg);
      }
    }
  };
  const myHomeMain = (userId) => {
    const isUserHome = userId === unsafeWindow.GUser.userId;
    let editArea = document.querySelector("#head-box > dd > div.name.f-cb > div > div.edit");
    if (isUserHome && editArea) {
      cloudUpload(editArea);
      cloudLocalUpload(editArea);
      injectGA4();
    }
  };
  class SongDetail {
    constructor() {
      this.domReady = false;
      this.dataFetched = false;
      this.flag = true;
    }
    fetchSongData(songId) {
      this.songId = songId;
      weapiRequest("/api/batch", {
        data: {
          "/api/v3/song/detail": JSON.stringify({ c: JSON.stringify([{ "id": this.songId }]) }),
          "/api/song/music/detail/get": JSON.stringify({ "songId": this.songId, "immerseType": "ste" }),
          "/api/song/red/count": JSON.stringify({ "songId": this.songId }),
          "/api/song/lyric/v1": JSON.stringify({ id: this.songId, cp: false, tv: 0, lv: 0, rv: 0, kv: 0, yv: 0, ytv: 0, yrv: 0 }),
          "/api/song/play/about/block/page": JSON.stringify({ "songId": this.songId })
        },
        onload: (res) => {
          console.log(res);
          this.SongRes = res;
          this.dataFetched = true;
          this.checkStartCreateDom();
        }
      });
    }
    onDomReady() {
      this.maindDiv = document.querySelector(".cvrwrap");
      this.domReady = true;
      this.checkStartCreateDom();
    }
    checkStartCreateDom() {
      if (this.domReady && this.dataFetched && this.flag) {
        this.flag = false;
        this.createDoms();
      }
    }
    createDoms() {
      var _a, _b, _c, _d, _e, _f, _g;
      this.songDetailObj = this.SongRes["/api/v3/song/detail"].songs[0];
      this.title = this.songDetailObj.name;
      this.album = getAlbumTextInSongDetail(this.songDetailObj);
      this.artist = getArtistTextInSongDetail(this.songDetailObj);
      this.filename = nameFileWithoutExt(this.title, this.artist, "artist-title");
      this.songDetailObj = this.songDetailObj;
      if (this.SongRes["/api/v3/song/detail"].privileges[0].plLevel != "none") {
        this.downLoadTableBody = this.createTable().querySelector("tbody");
        let plLevel = this.SongRes["/api/v3/song/detail"].privileges[0].plLevel;
        let dlLevel = this.SongRes["/api/v3/song/detail"].privileges[0].dlLevel;
        let songPlWeight = levelWeight[plLevel] || 0;
        let songDlWeight = levelWeight[dlLevel] || 0;
        let songDetail = this.SongRes["/api/song/music/detail/get"].data;
        if (this.SongRes["/api/v3/song/detail"].privileges[0].cs) {
          this.createDLRow(`云盘文件 ${this.SongRes["/api/v3/song/detail"].songs[0].pc.br}k`, plLevel, "pl");
        } else {
          this.upLoadTableBody = this.createTable().querySelector("tbody");
          if (songDlWeight > songPlWeight && this.SongRes["/api/v3/song/detail"].privileges[0].fee == 0) {
            const channel2 = "dl";
            if (songDetail.hr && songDlWeight >= 5 && songPlWeight < 5) {
              const desc = `${Math.round(songDetail.hr.br / 1e3)}k	${fileSizeDesc(songDetail.hr.size)}	${songDetail.hr.sr / 1e3}kHz`;
              const level = "hires";
              this.createDLRow(desc, level, channel2);
              this.createULRow(desc, level, channel2);
            }
            if (songDetail.sq && songDlWeight >= 4 && songPlWeight < 4) {
              const desc = `${Math.round(songDetail.sq.br / 1e3)}k	${fileSizeDesc(songDetail.sq.size)}	${songDetail.sq.sr / 1e3}kHz`;
              const level = "lossless";
              this.createDLRow(desc, level, channel2);
              this.createULRow(desc, level, channel2);
            }
            if (songDetail.h && songDlWeight >= 3 && songPlWeight < 3) {
              const desc = `${Math.round(songDetail.h.br / 1e3)}k	${fileSizeDesc(songDetail.h.size)}`;
              const level = "exhigh";
              this.createDLRow(desc, level, channel2);
              this.createULRow(desc, level, channel2);
            }
            if (songDetail.m && songDlWeight >= 2 && songPlWeight < 2) {
              const desc = `${Math.round(songDetail.m.br / 1e3)}k	${fileSizeDesc(songDetail.m.size)}`;
              const level = "higher";
              this.createDLRow(desc, level, channel2);
              this.createULRow(desc, level, channel2);
            }
          }
          const channel = "pl";
          if (songDetail.jm && songPlWeight >= 7) {
            const desc = `${Math.round(songDetail.jm.br / 1e3)}k	${fileSizeDesc(songDetail.jm.size)}	${songDetail.jm.sr / 1e3}kHz`;
            const level = "jymaster";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.db && songPlWeight >= 7) {
            const desc = `${Math.round(songDetail.db.br / 1e3)}k	${fileSizeDesc(songDetail.db.size)}	${songDetail.db.sr / 1e3}kHz`;
            const level = "dolby";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.sk && songPlWeight >= 7) {
            const desc = `${Math.round(songDetail.sk.br / 1e3)}k	${fileSizeDesc(songDetail.sk.size)}	${songDetail.sk.sr / 1e3}kHz`;
            const level = "sky";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.je && songPlWeight >= 4) {
            const desc = `${Math.round(songDetail.je.br / 1e3)}k	${fileSizeDesc(songDetail.je.size)}	${songDetail.je.sr / 1e3}kHz`;
            const level = "jyeffect";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.hr && songPlWeight >= 4) {
            const desc = `${Math.round(songDetail.hr.br / 1e3)}k	${fileSizeDesc(songDetail.hr.size)}	${songDetail.hr.sr / 1e3}kHz `;
            const level = "hires";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.sq && songPlWeight >= 4) {
            const desc = `${Math.round(songDetail.sq.br / 1e3)}k ${fileSizeDesc(songDetail.sq.size)}	${songDetail.sq.sr / 1e3}kHz`;
            const level = "lossless";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.h && songPlWeight >= 3) {
            const desc = `${Math.round(songDetail.h.br / 1e3)}k ${fileSizeDesc(songDetail.h.size)}`;
            const level = "exhigh";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.m && songPlWeight >= 2) {
            const desc = `${Math.round(songDetail.m.br / 1e3)}k ${fileSizeDesc(songDetail.m.size)}`;
            const level = "higher";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          if (songDetail.l && songPlWeight >= 1) {
            const desc = `${Math.round(songDetail.l.br / 1e3)}k ${fileSizeDesc(songDetail.l.size)}`;
            const level = "standard";
            this.createDLRow(desc, level, channel);
            this.createULRow(desc, level, channel);
          }
          this.createHideButtonRow(this.downLoadTableBody);
          this.createHideButtonRow(this.upLoadTableBody);
        }
      }
      this.createTitle("歌曲其他信息");
      this.infoTableBody = this.createTable().querySelector("tbody");
      if (!this.SongRes["/api/song/lyric/v1"].pureMusic) {
        this.lyricObj = handleLyric(this.SongRes["/api/song/lyric/v1"]);
        if (this.lyricObj.orilrc.lyric.length > 0) {
          this.lyricBlock = this.createTableRow(this.infoTableBody, "下载歌词");
          if (this.lyricObj.oritlrc) {
            let btn2 = this.createButton("原歌词+翻译");
            btn2.addEventListener("click", () => {
              this.downloadLyric("oritlrc");
            });
            this.lyricBlock.appendChild(btn2);
          }
          if (this.lyricObj.oriromalrc) {
            let btn2 = this.createButton("罗马音+原歌词");
            btn2.addEventListener("click", () => {
              this.downloadLyric("oriromalrc");
            });
            this.lyricBlock.appendChild(btn2);
          }
          let btn = this.createButton("原歌词");
          btn.addEventListener("click", () => {
            this.downloadLyric("orilrc");
          });
          this.lyricBlock.appendChild(btn);
        }
      }
      if (this.songDetailObj.al.picUrl) {
        let btn = this.createButton("专辑封面原图");
        btn.href = this.songDetailObj.al.picUrl;
        btn.target = "_blank";
        this.createButtonDescTableRow(this.infoTableBody, btn, null);
      }
      if (this.SongRes["/api/song/red/count"].data.count > 0) {
        let redBlock = this.createTableRow(this.infoTableBody, "红心数量");
        redBlock.innerHTML = `<span>${this.SongRes["/api/song/red/count"].data.count}</span>`;
      }
      if (this.songDetailObj.originCoverType > 0) {
        let originCoverTypeBlock = this.createTableRow(this.infoTableBody, "原唱翻唱类型");
        originCoverTypeBlock.innerHTML = `<span>${this.songDetailObj.originCoverType == 1 ? "原唱" : "翻唱"}</span>`;
      }
      if ((this.songDetailObj.mark & songMark.explicit) == songMark.explicit) {
        let explicitBlock = this.createTableRow(this.infoTableBody, "🅴");
        explicitBlock.innerHTML = `内容含有不健康因素`;
      }
      for (let block of this.SongRes["/api/song/play/about/block/page"].data.blocks) {
        if (block.code == "SONG_PLAY_ABOUT_MUSIC_MEMORY" && block.creatives.length > 0) {
          for (let creative of block.creatives) {
            for (let resource of creative.resources) {
              if (resource.resourceType == "FIRST_LISTEN") {
                let firstTimeBlock = this.createTableRow(this.infoTableBody, "第一次听");
                firstTimeBlock.innerHTML = resource.resourceExt.musicFirstListenDto.date;
              } else if (resource.resourceType == "TOTAL_PLAY") {
                let recordBlock = this.createTableRow(this.infoTableBody, "累计播放");
                let recordText = ` ${resource.resourceExt.musicTotalPlayDto.playCount}次`;
                if (resource.resourceExt.musicTotalPlayDto.duration > 0) {
                  recordText += ` ${resource.resourceExt.musicTotalPlayDto.duration}分钟`;
                }
                if (resource.resourceExt.musicTotalPlayDto.text.length > 0) {
                  recordText += " " + resource.resourceExt.musicTotalPlayDto.text;
                }
                recordBlock.innerHTML = recordText;
              }
            }
          }
        }
        if (block.code == "SONG_PLAY_ABOUT_SONG_BASIC" && block.creatives.length > 0) {
          for (let creative of block.creatives) {
            if (creative.creativeType == "sheet" && creative.resources.length == 0) continue;
            if (!((_a = creative == null ? void 0 : creative.uiElement) == null ? void 0 : _a.mainTitle)) continue;
            let wikiItemBlock = this.createTableRow(this.infoTableBody, creative.uiElement.mainTitle.title);
            if (creative.uiElement.descriptions) {
              let descriptionDiv = document.createElement("div");
              for (let description of creative.uiElement.descriptions) {
                let descriptionP = this.createText(description.description);
                descriptionDiv.appendChild(descriptionP);
              }
              wikiItemBlock.appendChild(descriptionDiv);
            }
            if (creative.uiElement.textLinks) {
              for (let textLink of creative.uiElement.textLinks) {
                let textLinkP = this.createText(textLink.text);
                wikiItemBlock.appendChild(textLinkP);
              }
            }
            if (creative.resources) {
              for (let resource of creative.resources) {
                let resourceDiv = document.createElement("div");
                resourceDiv.className = "des s-fc3";
                if (resource.uiElement.mainTitle) {
                  let IsLink = ((_c = (_b = resource.action) == null ? void 0 : _b.clickAction) == null ? void 0 : _c.action) == 1 && ((_e = (_d = resource.action) == null ? void 0 : _d.clickAction) == null ? void 0 : _e.targetUrl.startsWith("https://"));
                  let mainTitleItem = IsLink ? this.createButton(resource.uiElement.mainTitle.title) : this.createText(resource.uiElement.mainTitle.title);
                  if (IsLink) {
                    mainTitleItem.target = "_blank";
                    mainTitleItem.href = (_g = (_f = resource.action) == null ? void 0 : _f.clickAction) == null ? void 0 : _g.targetUrl;
                  }
                  wikiItemBlock.appendChild(mainTitleItem);
                }
                if (resource.uiElement.subTitles) {
                  let subTitleP = this.createText(resource.uiElement.subTitles.map((t) => t.title).join(" "));
                  subTitleP.innerHTML = resource.uiElement.subTitles.map((t) => t.title).join(" ");
                  wikiItemBlock.appendChild(subTitleP);
                }
                if (resource.uiElement.descriptions) {
                  for (let description of resource.uiElement.descriptions) {
                    let descriptionP = this.createText(description.description);
                    wikiItemBlock.appendChild(descriptionP);
                  }
                }
                if (resource.uiElement.images) {
                  for (let image of resource.uiElement.images) {
                    let imageA = this.createButton(image.title);
                    imageA.target = "_blank";
                    imageA.href = image.imageUrl || image.imageWithoutTextUrl;
                    wikiItemBlock.appendChild(imageA);
                  }
                }
                if (resource.uiElement.textLinks) {
                  for (let textLink of resource.uiElement.textLinks) {
                    if (textLink.text) {
                      let textLinkP = this.createText(textLink.text);
                      wikiItemBlock.appendChild(textLinkP);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    createTitle(title) {
      let h3 = document.createElement("h3");
      h3.innerHTML = `<span class="f-fl" style="margin-top: 10px;margin-bottom: 10px;">${title}</span>`;
      this.maindDiv.appendChild(h3);
    }
    createTable() {
      let table = document.createElement("table");
      table.className = "m-table";
      let tbody = document.createElement("tbody");
      table.appendChild(tbody);
      this.maindDiv.appendChild(table);
      return table;
    }
    createTableRow(tbody, title, needHide = false) {
      let row = document.createElement("tr");
      if (tbody.children.length % 2 == 0) row.className = "even";
      if (needHide && tbody.children.length > 0) row.style.display = "none";
      row.innerHTML = `<td><div><span>${title || ""}</span></div></td><td><div></div></td>`;
      tbody.appendChild(row);
      return row.querySelector("tr > td:nth-child(2) > div");
    }
    createButtonDescTableRow(tbody, btn, desc, needHide = false) {
      let row = document.createElement("tr");
      if (tbody.children.length % 2 == 0) row.className = "even";
      if (needHide && tbody.children.length > 0) row.style.display = "none";
      row.innerHTML = `<td ${desc ? 'style="width: 23%;"' : ""}><div></div></td><td><div><span>${desc || ""}</span></div></td>`;
      let firstArea = row.querySelector("tr > td:nth-child(1) > div");
      firstArea.appendChild(btn);
      tbody.appendChild(row);
      return row;
    }
    createHideButtonRow(tbody) {
      if (tbody.children.length < 2) return;
      let row = document.createElement("tr");
      row.innerHTML = `<td><div><a class="s-fc7">展开<i class="u-icn u-icn-69"></i></a></div></td>`;
      let btn = row.querySelector("a");
      btn.addEventListener("click", () => {
        for (let i = 1; i < tbody.children.length - 1; i++) {
          if (tbody.children[i].style.display == "none") {
            tbody.children[i].style.display = "";
          } else {
            tbody.children[i].style.display = "none";
          }
        }
        if (btn.innerHTML.startsWith("展开")) {
          btn.innerHTML = '收起<i class="u-icn u-icn-70"></i>';
        } else {
          btn.innerHTML = '展开<i class="u-icn u-icn-69"></i>';
        }
      });
      tbody.appendChild(row);
    }
    createButton(desc) {
      let btn = document.createElement("a");
      btn.text = desc;
      btn.className = "s-fc7";
      btn.style.marginRight = "10px";
      return btn;
    }
    createText(desc) {
      let btn = document.createElement("span");
      btn.innerHTML = desc;
      btn.style.marginRight = "10px";
      return btn;
    }
    createDLRow(desc, level, channel) {
      return;
    }
    createULRow(desc, level, channel) {
      return;
    }
    dwonloadSong(channel, level, dlbtn) {
      let url2 = "/api/song/enhance/player/url/v1";
      if (channel == "dl") url2 = "/api/song/enhance/download/url/v1";
      let data = { ids: JSON.stringify([this.songId]), level, encodeType: "mp3" };
      if (channel == "dl") data = { id: this.songId, level, encodeType: "mp3" };
      let songItem = {
        id: this.songId,
        title: this.songDetailObj.name,
        artist: this.artist,
        album: this.album,
        song: this.songDetailObj,
        privilege: this.songDetailObj,
        api: { url: url2, data }
      };
      const config = {
        out: "artist-title",
        threadCount: 1,
        folder: "none"
      };
      batchDownloadSongs([songItem], config);
    }
    downloadLyric(lrcKey) {
      saveContentAsFile(this.lyricObj[lrcKey].lyric, this.filename + ".lrc");
    }
  }
  let songDetailObj = new SongDetail();
  const hookWindowForCommentBox = (window) => {
    ah.proxy({
      onResponse: (response, handler) => {
        if (response.config.url.includes("/weapi/comment/resource/comments/get")) {
          let content = JSON.parse(response.response);
          storageCommentInfo(content);
          handler.next(response);
        } else {
          handler.next(response);
        }
      }
    }, window);
  };
  const storageCommentInfo = (CommentRes) => {
    var _a, _b, _c;
    if (!unsafeWindow.top.GUserScriptObjects.storageCommentInfos) unsafeWindow.top.GUserScriptObjects.storageCommentInfos = {};
    const comments = CommentRes.data.comments.concat(CommentRes.data.hotComments);
    for (let comment of comments) {
      if (!(comment == null ? void 0 : comment.commentId)) continue;
      let appendText = "";
      if ((_a = comment == null ? void 0 : comment.ipLocation) == null ? void 0 : _a.location) appendText += comment.ipLocation.location + " ";
      if ((_c = (_b = comment == null ? void 0 : comment.extInfo) == null ? void 0 : _b.endpoint) == null ? void 0 : _c.OS_TYPE) appendText += comment.extInfo.endpoint.OS_TYPE;
      unsafeWindow.top.GUserScriptObjects.storageCommentInfos[String(comment.commentId)] = appendText.trim();
    }
  };
  const observerCommentBox = (commentBox) => {
    let observer = new MutationObserver((mutations, observer2) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
          for (let node of mutation.addedNodes) {
            if (node.className == "itm") {
              commentItemAddInfo(node);
            }
          }
        }
      });
    });
    observer.observe(commentBox, {
      childList: true,
      subtree: true
    });
  };
  const commentItemAddInfo = (commentItem) => {
    if (commentItem.querySelector(".ipInfo")) return;
    const commentId = commentItem.getAttribute("data-id");
    let timeArea = commentItem.querySelector("div.time");
    if (unsafeWindow.top.GUserScriptObjects.storageCommentInfos[commentId]) {
      timeArea.innerHTML += ` <span class="ipInfo">${unsafeWindow.top.GUserScriptObjects.storageCommentInfos[commentId]}</span>`;
    }
  };
  const InfoFirstPage = (commentBox) => {
    const commentItems = commentBox.querySelectorAll("div.itm");
    for (const commentItem of commentItems) {
      commentItemAddInfo(commentItem);
    }
  };
  const addCommentWithCumstomIP = (commentBox) => {
    const commentTextarea = commentBox.querySelector("textarea");
    const threadId = commentBox.getAttribute("data-tid");
    const btnsArea = commentBox.querySelector(".btns");
    let ipBtn = document.createElement("a");
    ipBtn.className = "s-fc7";
    ipBtn.innerHTML = "使用指定IP地址评论";
    ipBtn.addEventListener("click", () => {
      const content = commentTextarea.value.trim();
      if (content.length == 0) {
        showConfirmBox("评论内容不能为空");
        return;
      }
      GM_getValue("lastIPValue", "");
      Swal.fire({
        input: "text",
        inputLabel: "IP地址",
        inputValue: GM_getValue("lastIPValue", ""),
        inputValidator: (value) => {
          if (!/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(value)) {
            return "IP格式不正确";
          }
        },
        confirmButtonText: "发送评论",
        showCloseButton: true,
        footer: `
            <div>可参考:<a href="https://zh-hans.ipshu.com/country-list" target="_blank">IP 国家/地区列表</a></div>
            <div>需不显示属地请填 <b>127.0.0.1</b></div>
            `
      }).then((result) => {
        if (result.isConfirmed) {
          GM_setValue("lastIPValue", result.value);
          weapiRequest("/api/resource/comments/add", {
            data: {
              threadId,
              content
            },
            ip: result.value,
            clientType: "web",
            onload: (res) => {
              console.log(res);
              if (res.code == 200) {
                showConfirmBox("评论成功，请刷新网页查看");
              } else {
                showConfirmBox("评论失败，" + JSON.stringify(res));
              }
            }
          });
        }
      });
    });
    btnsArea.appendChild(ipBtn);
  };
  const registerMenuCommand = () => {
    GM_registerMenuCommand(`优先试听音质`, setLevel);
    function setLevel() {
      Swal.fire({
        title: "优先试听音质",
        input: "select",
        inputOptions: levelOptions,
        inputValue: GM_getValue("DEFAULT_LEVEL", defaultOfDEFAULT_LEVEL),
        confirmButtonText: "确定",
        showCloseButton: true,
        footer: '<a href="https://github.com/Cinvin/myuserscripts"  target="_blank"><img src="https://img.shields.io/github/stars/cinvin/myuserscripts?style=social" alt="Github"></a>'
      }).then((result) => {
        if (result.isConfirmed) {
          GM_setValue("DEFAULT_LEVEL", result.value);
        }
      });
    }
  };
  const url = _unsafeWindow.location.href;
  const params = new URLSearchParams(_unsafeWindow.location.search);
  const paramId = Number(params.get("id"));
  const onStart = () => {
    console.log("[ncmExtend] onStart()");
    if (_unsafeWindow.self === _unsafeWindow.top) {
      _unsafeWindow.GUserScriptObjects = {};
      hookTopWindow();
      const iframes = document.getElementsByTagName("iframe");
      for (let iframe of iframes) {
        hookWindowForCommentBox(iframe.contentWindow);
      }
    } else if (_unsafeWindow.name === "contentFrame") {
      hookWindowForCommentBox(_unsafeWindow);
      if (paramId > 0) {
        if (url.includes("/song?")) {
          songDetailObj.fetchSongData(paramId);
        } else if (url.includes("/playlist?")) {
          playlistDetailObj.fetchPlaylistFullData(paramId);
        } else if (url.includes("/album?")) {
          albumDetailObj.fetchAlbumData(paramId);
        }
      }
    }
  };
  const onDomReady = () => {
    console.log("[ncmExtend] onDomReady()");
    if (paramId > 0) {
      if (url.includes("/user/home?")) {
        myHomeMain(paramId);
      } else if (url.includes("/song?")) {
        songDetailObj.onDomReady();
      } else if (url.includes("/playlist?")) {
        playlistDetailObj.onDomReady();
      } else if (url.includes("/album?")) {
        albumDetailObj.onDomReady();
      }
    }
    const commentBox = document.querySelector("#comment-box");
    if (commentBox) {
      observerCommentBox(commentBox);
      InfoFirstPage(commentBox);
      addCommentWithCumstomIP(commentBox);
    }
    if (_unsafeWindow.name === "contentFrame") {
      registerMenuCommand();
    }
  };
  const DOM_READY = "DOMContentLoaded";
  onStart();
  _unsafeWindow.addEventListener(DOM_READY, () => {
    onDomReady();
  });

})();