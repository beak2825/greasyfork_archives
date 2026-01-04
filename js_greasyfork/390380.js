// ==UserScript==
// @name         MALinList
// @namespace    MALinList
// @version      1.2
// @description  show watched anime on anime profile in related section
// @author       Samu
// @match        https://myanimelist.net/anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390380/MALinList.user.js
// @updateURL https://update.greasyfork.org/scripts/390380/MALinList.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var username = "SamuTDN";
  //cache will expire after 1 hour
  var expire = 1 * 1 * 60 * 60 * 1000;

  var offset = 0;
  var urlBase = "https://myanimelist.net/animelist/";
  var urlArr = [urlBase, username, "/load.json?offset=", offset];
  var storageName = "cachedList";
  var allEntity = [];
  var relatedAnime = document.querySelectorAll(".anime_detail_related_anime a");
  var colors = {
    s1: {bg: "#2db039", tc: "#fff"},
    s2: {bg: "#26448f", tc: "#fff"},
    s3: {bg: "#e7b715", tc: "#fff"},
    s4: {bg: "#a12f31", tc: "#fff"},
    s6: {bg: "#8f8f8f", tc: "#fff"},
  }

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", onListRetrived);

  function checkExistingTitle() {

    var animeListById = {};
    for (var i = 0; i < allEntity.length; i++) {
      var ent = allEntity[i];
      animeListById[ent.anime_id] = ent;
    }

    var allId = allEntity.map(entity => entity.anime_id);
    for (var i = 0; i < relatedAnime.length; i++) {
      var id = relatedAnime[i].href.replace(/^.*anime\/([0-9]*)\/.*$/,"$1");

      if (allId.includes(+id)) {
        var statusColor = colors["s" + animeListById[+id].status];
        relatedAnime[i].style.backgroundColor = statusColor.bg;
        relatedAnime[i].style.color = statusColor.tc;
        relatedAnime[i].style.padding = "2px";
        relatedAnime[i].style.lineHeight = "20px";
      }
    }

  }

  function cacheList(entity) {
    var data = {};
    data["list"] = entity;
    data["time"] = Date.now();

    localStorage.setItem(storageName, JSON.stringify(data));
  }

  function retriveList() {
    xhr.open("GET", getUrl());
    xhr.send();
  }

  function getUrl() {
    return [urlBase, username, "/load.json?status=7&offset=", offset].join("");
  }

  function getList() {
    var data = JSON.parse(localStorage.getItem(storageName));
    if (data === null || Date.now() - data.time > expire) {
      retriveList();
    } else {
      console.log("using cache");
      allEntity = data.list;
      checkExistingTitle();
    }
  }

  function onListRetrived() {
    if (xhr.status === 200 && xhr.readyState === 4) {
      var entity = JSON.parse(xhr.response);

      allEntity = allEntity.concat(entity);
      cacheList(allEntity);

      if (entity.length < 300) {

        checkExistingTitle();

      } else {

        offset += entity.length;
        retriveList();

      }
    }
  }

  getList();

})();