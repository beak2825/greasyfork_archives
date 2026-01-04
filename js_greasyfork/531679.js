// ==UserScript==
// @name        site:検索 h
// @namespace   http://tampermonkey.net/
// @version     2.3
// @description Execute UserScript
// @author      Your Name
// @match        https://*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531679/site%3A%E6%A4%9C%E7%B4%A2%20h.user.js
// @updateURL https://update.greasyfork.org/scripts/531679/site%3A%E6%A4%9C%E7%B4%A2%20h.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'h') {
            javascript:(function(){
const getPixivInfo = () => {
  const title = document.title;
  const match = title.match(/^#.*?\s(.*?)\s-\s(.*?)の/);
  if (match) return { title: match[1], author: match[2] };
  return { title: '', author: '' };
};
const getDmmdoujinInfo = () => {
  const title = document.title;
  const match = title.match(/^(.+)\s*\(([^()]+)\)｜FANZA同人$/);
  if (match) return { title: match[1], author: match[2] };
  return { title: '', author: '' };
};
const getDmmAVInfo = () => {
  const title = document.title;
  const match = title.match(/^(.+?)\s([^\s]+)\s-\sエロ動画・アダルトビデオ - FANZA動画$/);
  if (match) return { title: match[1], author: match[2] };
  return { title: '', author: '' };
};
const getInfo = () => { const url = location.href; if (url.startsWith('https://www.pixiv.net/artworks/')) return getPixivInfo(); if (url.startsWith('https://www.dmm.co.jp/dc/doujin/')) return getDmmdoujinInfo(); if (url.startsWith('https://www.dmm.co.jp/digital/videoa/')) return getDmmAVInfo(); return { title: "", author: "" }; }
const sites=[
{ name: "モモンガ", url: "site:momon-ga.com" },
{ name: "ヒトミラ", url: "site:hitomi.la" },
{ name: "ケモノ", url: "site:kemono.su" },
{ name: "ダンボール", url: "site:danbooru.donmai.us" },
{ name: "MissAV", url: "site:missav.ws" },
{ name: "MissAV (ai)", url: "site:missav.ai" }
];
const uiSettings=[
{ 
          urlPrefix:'https://www.pixiv.net/artworks/', 
          titleChecked:false, 
          authorChecked:true, 
          selectedSites:[1,2] 
        },
{ 
          urlPrefix:'https://www.dmm.co.jp/dc/doujin/', 
          titleChecked:true, 
          authorChecked:false, 
          selectedSites:[1,2] 
        },
{ 
          urlPrefix:'https://www.dmm.co.jp/digital/videoa/', 
          titleChecked:true, 
          authorChecked:false, 
          selectedSites:[5] 
        }
];

          const popup = document.createElement('div');
          popup.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:250px; padding:20px; background:#f4f4f4; border:2px solid #888; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.2); z-index:10000;';
          
          const closeButton = document.createElement('span');
          closeButton.textContent = '☒';
          closeButton.style.cssText = 'position:absolute; top:10px; right:10px; cursor:pointer;';
          closeButton.onclick = () => document.body.removeChild(popup);
          popup.appendChild(closeButton);

          const checkboxes = sites.map((site, index) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = site.url;
            checkbox.setAttribute('data-index', index);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(site.name || site.url));
            popup.appendChild(label);
            popup.appendChild(document.createElement('br'));
            return checkbox;
          });

          const titleChk = document.createElement('input');
          titleChk.type = 'checkbox';
          const titleLbl = document.createElement('label');
          titleLbl.appendChild(titleChk);
          titleLbl.appendChild(document.createTextNode('タイトルを抽出'));
          popup.appendChild(titleLbl);
          popup.appendChild(document.createElement('br'));

          const authorChk = document.createElement('input');
          authorChk.type = 'checkbox';
          const authorLbl = document.createElement('label');
          authorLbl.appendChild(authorChk);
          authorLbl.appendChild(document.createTextNode('作者を抽出'));
          popup.appendChild(authorLbl);
          popup.appendChild(document.createElement('br'));

          const searchBox = document.createElement('input');
          searchBox.type = 'text';
          searchBox.placeholder = '検索キーワード';
          searchBox.style.cssText = 'width:100%; margin-top:10px; padding:5px;';
          popup.appendChild(searchBox);

          const searchButton = document.createElement('button');
          searchButton.textContent = '検索';
          searchButton.style.cssText = 'position:absolute; right:10px; bottom:10px; padding:5px; cursor:pointer;';
          searchButton.onclick = function() {
            const selectedSites = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
            const info = getInfo();
            let keyword = searchBox.value.trim();
            if (!keyword) {
              const parts = [];
              if (titleChk.checked && info.title) parts.push(info.title);
              if (authorChk.checked && info.author) parts.push(info.author);
              keyword = parts.join(' ');
            }
            if (selectedSites.length > 0 && keyword) {
              const query = selectedSites.join(' OR ') + ' ' + keyword;
              window.open('https://www.google.com/search?q=' + encodeURIComponent(query));
            } else {
              alert('少なくとも1つのサイトとキーワードまたは抽出対象を選択してください。');
            }
          };
          popup.appendChild(searchButton);

          const currentUrl = location.href;
          const matchingSetting = uiSettings.find(s => currentUrl.startsWith(s.urlPrefix));
          if (matchingSetting) {
            titleChk.checked = matchingSetting.titleChecked;
            authorChk.checked = matchingSetting.authorChecked;
            const selectedIndexes = matchingSetting.selectedSites.map(n => parseInt(n) - 1).filter(n => !isNaN(n) && n < checkboxes.length);
            checkboxes.forEach((cb, index) => { cb.checked = selectedIndexes.includes(index); });
          }

          searchBox.addEventListener('keydown', function(e) { if (e.key === 'Enter') searchButton.onclick(); });
          document.body.appendChild(popup);
        
})();
        }
    });
})();