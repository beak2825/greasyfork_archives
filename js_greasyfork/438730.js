// ==UserScript==
// @name         functions
// @namespace    https://hz.cn2down.com
// @version      0.1.1
// @description  公共函数库
// @author       zenghp2015
// @grant        GM_openInTab
// @license MIT
// ==/UserScript==
(function() {
  'use strict';
  const libs = {
    getQuery: function () {
      const url = decodeURI(location.search);
      let query = {};
      if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const pairs = str.split("&");
        for(let i = 0; i < pairs.length; i ++) {
          const pair = pairs[i].split("=");
          query[pair[0]] = pair[1];
        }
      }
      return query;
    },
    getQueryValue: function (name) {
      const url = decodeURI(location.search); 
      if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const pairs = str.split("&");
        for(let i = 0; i < pairs.length; i ++) {
          const pair = pairs[i].split("=");
          if(pair[0] === name) return  pair[1];
        }
      }
      return false;
    },
    sleep: function(time) { 
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    openWindow: function(url, callback, opts = {}) {
      return new Promise((resolve) => {
        const newTab = GM_openInTab(url, opts)
        newTab.onclose = function() {
          callback();
          resolve();
        }
      })
    }
  }
  window.$libs = libs
})();