// ==UserScript==
// @name         Xem ThapCam-XoiLac-VeBo với MPV
// @namespace    43vn
// @version      1.0
// @description  1 userscript đơn giản để xem ThapCam-XoiLac-VeBo với MPV
// @author       43vn
// @match        *://*.thapcam*.*/xem-lai/*
// @match        *://*.thapcam*.*/truc-tiep/*
// @match        *://*.vebo*.*/xem-lai/*
// @match        *://*.vebo*.*/truc-tiep/*
// @match        *://*.xoilac*.*/xem-lai/*
// @match        *://*.xoilac*.*/truc-tiep/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/533304/Xem%20ThapCam-XoiLac-VeBo%20v%E1%BB%9Bi%20MPV.user.js
// @updateURL https://update.greasyfork.org/scripts/533304/Xem%20ThapCam-XoiLac-VeBo%20v%E1%BB%9Bi%20MPV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let player = null;
    let ref = window.location.href;
    let isUrlExtracted = false;
    const btoaUrl = (url) => {
        return btoa(url).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "");
    }
    const catchLiveURL = (resp) => {
      const respBody = resp.responseText;
      try{
        const json = JSON.parse(respBody);
        if(json.data && json.data.play_urls && Array.isArray(json.data.play_urls)){
          insertLink(json.data.play_urls);
        }
      }catch(e){
        console.error("Fetch Meta Live Failed:",e);
      }

    }
    const insertLink = (data) => {
      if (isUrlExtracted) return;
      if(Array.isArray(data)){
         data.forEach(u=>{
          const link = document.createElement('div');
          link.style.cssText = 'width: 100%; margin-top: 10px;';
          const a = document.createElement('a');
          a.innerText = u.name;
          a.href= `mpv://play/${btoaUrl(u.url)}/?referer=${btoaUrl(ref)}`;
          a.style.cssText = 'margin-right: 10px;';
          link.appendChild(a);
          player.parentElement.appendChild(link);
        });
      }else{
          const link = document.createElement('div');
          link.style.cssText = 'width: 100%; margin-top: 10px;';
          const a = document.createElement('a');
          a.innerText = "Xem MPV";
          a.href= `mpv://play/${btoaUrl(data)}`;
          a.style.cssText = 'margin-right: 10px;';
          const input = document.createElement('input');
          input.type = 'text';
          input.value = data;
          input.style.cssText = 'width: 100%;';
          input.onclick = ()=>{
            GM_setClipboard(url);
          }
          link.appendChild(a);
          link.appendChild(input);
          player.parentElement.appendChild(link);
      }
      isUrlExtracted = true;
    }
    const extractAndDisplayUrl = () => {
        if (isUrlExtracted) return;
        if(window.location.href.includes('truc-tiep')){
          player = document.querySelector('#vbplayer')
          if(player){
              const iframeLive = player.querySelector('iframe');
              if(iframeLive && iframeLive.src){
                ref = iframeLive.src;
                const path = window.location.pathname;
                const parts = path.split('-');
                const matchCode = parts[parts.length - 1];
                if(matchCode){
                  GM_xmlhttpRequest({
                      method: 'GET',
                      url: `https://api.vebo.xyz/api/match/${matchCode}/meta`,
                      onload: catchLiveURL
                  });
                }
              }
          }
        }else{
          player = document.querySelector('#player');
          if(player){
            const iframe = player.querySelector('iframe');
              if(iframe){
              try {
                  const url = new URL(iframe.src);
                  const encodedLink = url.searchParams.get('link');
                  if (!encodedLink) return;
                  const decodedLink = decodeURIComponent(encodedLink);
                  insertLink(decodedLink);
              } catch (error) {
                  console.error('Error extracting URL:', error);
              }
            }
          }
        }
    };

    const observeDOM = () => {
        const observer = new MutationObserver(extractAndDisplayUrl);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        extractAndDisplayUrl();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }
})();