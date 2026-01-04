// ==UserScript==
// @name         b站直播表情下载
// @description  下载b站直播间的表情
// @namespace    https://noxplay.us.to/
// @version      0.2
// @author       lovegaoshi
// @match        https://live.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.info
// @require      https://cdn.bootcss.com/jszip/3.1.4/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/460954/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460954/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// GreaseMonkey 4.x compatible
var loadSetting;
if (
  typeof GM !== "undefined" &&
  ((GM.info || {}).scriptHandler || "").toLowerCase().indexOf("greasemonkey") >=
    0
) {
  loadSetting = GM.getValue.bind(this, "ehD-setting");
  self.GM_setValue = GM.setValue;
  self.GM_xmlhttpRequest = GM.xmlHttpRequest;
  self.GM_info = GM.info;
} else {
  loadSetting = function (key, init) {
    return new Promise(function (resolve, reject) {
      try {
        resolve(GM_getValue("ehD-setting"));
      } catch (e) {
        reject(e);
      }
    });
  };
}

const extractWith = function extractWith(filename, reExpressions = []) {
  for (let i = 0, n = reExpressions.length; i < n; i++) {
    let extracted = reExpressions[i].exec(filename);
    if (extracted !== null) {
      return extracted[1];
    }
  }
  return null;
};

async function getRealBiliRoomID(roomID, callback) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomID}`,
      onload: (val) => {
        const data = JSON.parse(val.response).data.room_id;
        //const emoticons = data.map(val => val.emoticons);
        resolve(callback(data));
      },
    });
  });
}

async function getBiliRoomEmoticons(roomID) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=pc&room_id=${roomID}`,
      onload: (val) => {
        const data = JSON.parse(val.response).data.data.slice(2);
        //const emoticons = data.map(val => val.emoticons);
        resolve(data);
      },
    });
  });
}

async function downloadBiliEmoticons(emoticons, zipfile = null) {
  /*
	{
        "emoji": "早上好",
        "descript": "",
        "url": "http://i0.hdslb.com/bfs/garb/f1a8c2f4c3ad7b0c311eeb2cc3db2dc937c69e53.png",
        "is_dynamic": 1,
        "in_player_area": 1,
        "width": 162,
        "height": 162,
        "identity": 4,
        "unlock_need_gift": 31164,
        "perm": 0,
        "unlock_need_level": 1,
        "emoticon_value_type": 0,
        "bulge_display": 1,
        "unlock_show_text": "粉丝团",
        "unlock_show_color": "#FF6699",
        "emoticon_unique": "room_282208_898",
        "unlock_show_image": "",
        "emoticon_id": 898
    }
	*/
  if (emoticons.length === 0) {
    alert("没有房间专属表情！");
    return;
  }
  if (zipfile === null) zipfile = new JSZip();
  let promises = [];
  emoticons.map((emoticonColle) => {
    emoticonColle.emoticons.map((emoticon) =>
      promises.push(
        new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: emoticon.url,
            responseType: "arraybuffer",
            onload: (val) => {
              const blobdata = new Blob([val.response]);
              zipfile.file(
                `${emoticonColle.pkg_name}-${emoticon.emoji}.png`,
                blobdata,
                { binary: true }
              );
              resolve(true);
            },
          });
        })
      )
    );
  });
  await Promise.all(promises);
  return zipfile;
}

async function downloadEmoticons() {
  const roomID = extractWith(window.location.href, [
    /live\.bilibili\.com\/(\d+)/,
  ]);
  if (roomID !== null) {
    const emoticonList = await getRealBiliRoomID(roomID, getBiliRoomEmoticons);
    const emoticonZip = await downloadBiliEmoticons(emoticonList);
    emoticonZip
      .generateAsync({ type: "blob", base64: true })
      .then((content) => saveAs(content, `emoticons_${roomID}.zip`));
  } else {
    console.warn(
      `current bililive room url ${window.location.href} is not valid.`
    );
  }
}

function test() {
  // chrome 110 must use jszip/3.1.4?
  // https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.js does not work.
  let zipfile = new JSZip();
  GM_xmlhttpRequest({
    method: "GET",
    url: `http://i0.hdslb.com/bfs/garb/f1a8c2f4c3ad7b0c311eeb2cc3db2dc937c69e53.png`,
    responseType: "arraybuffer",
    onload: (val) => {
      const blobdata = new Blob([val.response]);
      zipfile.file("test.png", blobdata, { binary: true });
      console.log(zipfile);
      zipfile
        .generateAsync({ type: "blob", base64: true })
        .then((content) => saveAs(content, "test.zip"));
    },
  });
}

function makeButton() {
  let a = document.createElement("button");
  a.textContent = "下载表情包";
  a.onclick = downloadEmoticons;
  document.getElementsByClassName("follow-ctnr")[0].appendChild(a);
}

(function () {
  "use strict";
  // https://live.bilibili.com/p/html/live-web-mng/index.html?roomid=282208&arae_id=192&parent_area_id=5&ruid=529249
  makeButton();
})();
