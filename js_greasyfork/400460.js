// ==UserScript==
// @name        Bangumi-Episode-Chinese-IndexedDBver
// @namespace   ga.inqb
// @author      no1xsyzy (originally binota)
// @description Show Chinese episode name in episode page. Preferring IndexedDB API.
// @include     /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/ep\/\d+/
// @version     0.2.0
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/400460/Bangumi-Episode-Chinese-IndexedDBver.user.js
// @updateURL https://update.greasyfork.org/scripts/400460/Bangumi-Episode-Chinese-IndexedDBver.meta.js
// ==/UserScript==

'use strict';
/* jshint esversion: 8 */

const STORAGE_PREFIX = `binota_bec`;

var $ = function(query) {
  return document.querySelector(query);
};

var $a = function(query) {
  return document.querySelectorAll(query);
};

var subject = $('h1.nameSingle a').href.match(/\/subject\/(\d+)/)[1];
var episode = window.location.href.match(/\/ep\/(\d+)/)[1];

var storageFactory = ()=>(new (function(driver) {
  this._storage = driver;

  this.set = function(key, value) {
    return new Promise((resolve, reject) => {
      this._storage.setItem(`${STORAGE_PREFIX}_${key}`, value);
      resolve(value);
    })
  };

  this.get = function(key) {
    return Promise.resolve(this._storage.getItem(`${STORAGE_PREFIX}_${key}`));
  };

  this.remove = function(key) {
    console.log("remove")
    return new Promise((resolve, reject) => {
      this._storage.removeItem(`${STORAGE_PREFIX}_${key}`);
      resolve(key);
    })
  };
})(localStorage));

var storage = () => (new Promise(function(resolve, reject){
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
  var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  if (!window.indexedDB) {
    console.error("No IndexedDB support, fallback to localStorage");
    reject("No IndexedDB support, fallback to localStorage")
  }
  var request = window.indexedDB.open(STORAGE_PREFIX, 2);
  request.onerror=function(ev){
    console.error("IndexedDB open error, fallback to localStorage");
    reject(ev)
  }
  request.onsuccess=function(ev){
    var db=ev.target.result;
    resolve({
      set: function(key, value){
        return new Promise((resolve, reject)=>{
          var tr = db.transaction(["bec"], "readwrite")
          tr.onerror = ev=>{console.error(ev);reject(ev);}
          var obs = tr.objectStore("bec")
          var obsr = obs.add({subid: key, content: value})
          obsr.onsuccess = ev=>{resolve(value)}
        })
      },
      get: function(key){
        return new Promise((resolve, reject) => {
          var tr = db.transaction(["bec"], "readwrite")
          tr.onerror = ev=>{console.error(ev);reject(ev);}
          var obs = tr.objectStore("bec")
          var obsr = obs.get(key)
          obsr.onsuccess = ev=>{
            var result = obsr.result;
            if(obsr.result === undefined){
              resolve(null)
            }else{
              resolve(obsr.result.content)
            }}
        })
      },
      remove: function(key){
        return new Promise((resolve, reject) => {
          var tr = db.transaction(["bec"], "readwrite")
          tr.onerror = ev=>{console.error(ev);reject(ev);}
          var obs = tr.objectStore("bec")
          var obsr = obs.delete(key)
          obsr.onsuccess = ev=>{resolve(key)}
        })
      },
    })
  }
  request.onupgradeneeded=function(ev){
    var db=ev.target.result;
    db.onerror=function(ev){
      console.error("IndexedDB upgrade failure, fallback to localStorage");
      reject(ev)
    }
    var objectStore=db.createObjectStore("bec", {keyPath: 'subid'});
    objectStore.createIndex("content", "content", {unique: false});
  }
}).catch(err=>{console.error(err);return storageFactory()}));

var episodes = new(function(storage, id) {
  var subject = async function(){
    var jsonv = await (await storage()).get(id)
    return (JSON.parse(jsonv) || {})
  };

  this.init = async function(){
    this.subject = await subject()
  }

  this.getTitle = async function(episode) {
    return this.subject[episode] || '';
  };

  this.setTitle = async function(episode, title) {
    this.subject[episode] = title.trim();
  };

  this.save = async function() {
    return await (await storage()).set(id, JSON.stringify(this.subject));
  };
})(storage, subject);



var writeTitle = async function() {
  var title = await episodes.getTitle(episode);
  let elsmall = unsafeWindow.document.createElement('small');
  let ahref = unsafeWindow.document.createElement('a');
  ahref.setAttribute('class', "l");
  ahref.setAttribute('href', "#");
  ahref.setAttribute('id', 'refresh_chinese_name')
  ahref.innerHTML = "[刷新中文名缓存]";
  $('h2.title').append(elsmall);
  elsmall.append(ahref);

  $('h2.title').addEventListener('click', async e=>{
    if(e.target && e.target.id== 'refresh_chinese_name'){
      await (await storage()).remove(subject)
      window.location.reload()
      e.preventDefault()
    }
  });
  if(title !== '') {
    $('h2.title').innerHTML = $('h2.title').innerHTML.replace('<small', ` / ${title} <small`);
    document.title = document.title.replace(/ \/ /, ` | ${title} / `);
  }
}

var writeEpisodeList = async function() {
  //Write title of episode list
  var list = $a('.sideEpList li a');
  for(let i = 0; i < list.length; i++) {
    let liId = (list[i].href.match(/ep\/(\d+)/) || [-1, -1])[1];
    let liTitle = await episodes.getTitle(liId);
    if(liTitle !== '') list[i].innerHTML += ' / ' + liTitle;
  }
}

;(async function(){ //async env

await episodes.init();

if(await (await storage()).get(subject)) { //check cache
  await writeTitle();
  await writeEpisodeList();
} else { //check cache
  //Query API
  var GM_fetch = (url, {method='GET'}={}) => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: method,
      url: url,
      onload: resp => resolve(resp)
    })
  });
  let response = await GM_fetch(`https://api.bgm.tv/subject/${subject}?responseGroup=large`);
  let data = JSON.parse(response.response);
  for(let ep of data.eps) {
    await episodes.setTitle(ep.id, ep.name_cn);
    if(ep.id == episode) {
      await writeTitle();
    }
  }
  await episodes.save();
  await writeEpisodeList();
} //check cache

})() //async env