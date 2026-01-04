// ==UserScript==
// @name Prime Video episode sysnopsis remover
// @namespace ILoveKemurikusa
// @match https://primevideo.com/region/*/detail/*
// @match https://*.primevideo.com/region/*/detail/*
// @match https://primevideo.com/detail/* 
// @match https://*.primevideo.com/detail/*
// @match https://amazon.com/Episode-*/dp/*
// @match https://*.amazon.com/Episode-*/dp/*
// @match https://amazon.co.jp/Episode-*/dp/*
// @match https://*.amazon.co.jp/Episode-*/dp/*
// @match https://amazon.com/gp/video/detail/*  
// @match https://*.amazon.com/gp/video/detail/*
// @match https://amazon.co.jp/gp/video/detail/*  
// @match https://*.amazon.co.jp/gp/video/detail/*                                    
// @grant none
// @version 0.0.1.20190327092630
// @description Remove Episode Synopsis on primevideo.com
// @downloadURL https://update.greasyfork.org/scripts/380998/Prime%20Video%20episode%20sysnopsis%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/380998/Prime%20Video%20episode%20sysnopsis%20remover.meta.js
// ==/UserScript==

(async() => {
  
  let querys = () => {
    const isLengthNotZero = (elements) => {
      return elements.length !== 0
    };
    
    let queryArr = [
      document.querySelectorAll("div > .av-episode-synopsis"), // primevideo.com
      Array.from(document.querySelectorAll("label[for^='synopsis-']")).map(elem => elem.offsetParent.querySelector("div")), // amazon.com not logged in.
      document.querySelectorAll(".dv-el-synopsis-content > p") // amazon.com logged in.
    ];
    
    return queryArr.find(isLengthNotZero)
  };

  let removeSynop = (arr) => {
    arr.forEach((elem) => {
      elem.innerHTML="<i>[Synopsis removed]</i>"
    })
  }

  let query = querys()
  while (true) {
    if (query == null || query.length == 0) {
      setTimeout(async() => {
        query = querys();
      }, 100);
    } else { break; }
  }
  
  removeSynop(query);
 
  return 0;
 })();