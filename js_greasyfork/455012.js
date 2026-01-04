// ==UserScript==
// @name    GMTI - Gazelle Music Tracker Importer
// @name:zh      GMTI：Gazelle 架构音乐 PT 转载助手
// @name:zh-CN   GMTI：Gazelle 架构音乐 PT 转载助手
// @name:zh-TW   GMTI：Gazelle 架構音樂 PT 轉載助手
// @description    Just a simple script to import torrent metadata from other Gazelle sites when uploading. To use it you need to paste the permalink in the import field (on the upload page).
// @description:zh      这是一个便于直接从其他 Gazelle 音乐站点转载种子自动填充信息的油猴脚本，基于 OPS 原版添加了 DIC 的适配。
// @description:zh-CN   这是一个便于直接从其他 Gazelle 音乐站点转载种子自动填充信息的油猴脚本，基于 OPS 原版添加了 DIC 的适配。
// @description:zh-TW   這是一個便於直接從其他 Gazelle 音樂站點轉載種子自動填充信息的油猴腳本，基於 OPS 原版添加了 DIC 的適配。
// @license        https://gitlab.com/Hyleus/userscripts/blob/master/LICENSE
// @author       Hyleus <https://gitlab.com/Hyleus>
// @version  1.1.0
// @namespace      https://gitlab.com/Hyleus/userscripts/
// @grant GM_xmlhttpRequest
// @include http*://*dicmusic.club/upload.php*
// @include http*://*redacted.ch/upload.php*
// @include http*://*orpheus.network/upload.php*
// @downloadURL https://update.greasyfork.org/scripts/455012/GMTI%20-%20Gazelle%20Music%20Tracker%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/455012/GMTI%20-%20Gazelle%20Music%20Tracker%20Importer.meta.js
// ==/UserScript==

// Licensed under the Open Software License version 3.0
// Copy of the license can be found at: https://opensource.org/licenses/OSL-3.0

"use strict";

function decodeEntities(encodedString) {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

function parseHtml(html, ...selectors) {
  let formData = new FormData();
  formData.append("html", html);
  let options = {
    method: "POST",
    body: formData
  };

  let req = new Request("upload.php?action=parse_html", options);
  fetch(req).then(async (rsp) => {
    let text = await rsp.text();
    for (let selector of selectors) {
      let el = document.querySelector(selector);
      if (el !== null) {
        el.value = text;
      }
    }
  });
}

function applyJson(data) {
  let group = data['response']['group'];
  group["name"] = decodeEntities(group["name"]);
  group["recordLabel"] = decodeEntities(group["recordLabel"]);
  let torrent = data['response']['torrent'];
  let mapping = {
    title: 'name',
    year: 'year',
    image: 'wikiImage'
  };

  unsafeWindow.FillInFields(mapping, group);
  unsafeWindow.ParseMusicJson(group, torrent);

  if (group["tags"]) {
    document.querySelector("#tags").value = group["tags"].join(",");
  }

  if (group["wikiBody"]) {
    parseHtml(group["wikiBody"], "#desc", "#album_desc");

  }

  if (torrent["description"]) {
    parseHtml(torrent["description"], "#release_desc");
  }
}

function loadJson(url) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: (response) => {
      let data = JSON.parse(response.responseText);
      console.log(data);
      applyJson(data);
    }
  });
}

function rewriteUrl(url) {
  return url.replace(/(.*)torrents.php\?torrentid=(\d+)/g, "$1ajax.php?action=torrent&id=$2");
}

let importRow = document.createElement("tr");

let textColumn = document.createElement("td");
let text = document.createTextNode("他站 PL:")
textColumn.append(text);
textColumn.classList.add("label");
importRow.append(textColumn);

let input = document.createElement("input");
let inputColumn = document.createElement("td");
let importButton = document.createElement("input");
input.setAttribute("id", "import_input");
input.setAttribute("type", "text");
input.setAttribute("size", "40");
importButton.setAttribute("type", "button");
importButton.setAttribute("value", "导入");
inputColumn.append(input);
importRow.append(inputColumn);
inputColumn.append(importButton);

let musicbrainzRow = document.querySelector("#musicbrainz_tr");
musicbrainzRow.parentNode.insertBefore(importRow, musicbrainzRow);

importButton.addEventListener("click", (e) => {
  loadJson(rewriteUrl(input.value));
})