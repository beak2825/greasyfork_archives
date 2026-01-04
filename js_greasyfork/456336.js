// ==UserScript==
// @name         steam创意工坊(合集)一键下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  steam创意工坊一键下载，仅支持合集，需配合steamcmd下载
// @author       menkeng
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456336/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%28%E5%90%88%E9%9B%86%29%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456336/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%28%E5%90%88%E9%9B%86%29%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
/* globals jQuery, $,*/
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383

const getGameId = () => $('div.apphub_OtherSiteInfo.responsive_hidden > a').data('appid');
const getModIds = () => $('.collectionItemDetails > a').map((_, element) => $(element).attr('href').replace(/https:\/\/steamcommunity.com\/sharedfiles\/filedetails\/\?id=/g, '')).get();
const generateDownloadText = (gameId, modIds) => {
  const modIdStr = modIds.map(modId => `+workshop_download_item ${gameId} ${modId}`).join(' ');
  return `@echo off\nsteamcmd +login anonymous ${modIdStr}`;
};
const downloadMods = (gameId, modIds) => {
  const text = generateDownloadText(gameId, modIds);
  const filename = $('div.workshopItemTitle')[0].textContent + '.bat';
  $('<a>', {
    href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
    download: filename,
    style: 'display:none'
  }).appendTo('body')[0].click()
};
const createDownloadButton = () => {
  const dl = document.createElement('div');
  dl.style.cssText = 'position: fixed; top: 120px; right: 50px; width: 80px; height: 30px; font-size: 16px; font-weight: bold; text-align: center; line-height: 30px; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);';
  dl.innerText = '下载';
  dl.onclick = () => {
    const gameId = getGameId();
    const modIds = getModIds();
    downloadMods(gameId, modIds);
  };
  return dl;
};
$(() => $('body').append(createDownloadButton()));