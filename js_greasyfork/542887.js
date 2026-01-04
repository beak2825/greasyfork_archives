// ==UserScript==
// @name         上班不要看 Steam (滑鼠經過才會顯示敏感內容)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  當頁面有成人標籤時，僅針對所有圖片與影片自動模糊，滑鼠經過時顯示
// @author       shanlan(ChatGPT o3-mini)
// @match        https://store.steampowered.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542887/%E4%B8%8A%E7%8F%AD%E4%B8%8D%E8%A6%81%E7%9C%8B%20Steam%20%28%E6%BB%91%E9%BC%A0%E7%B6%93%E9%81%8E%E6%89%8D%E6%9C%83%E9%A1%AF%E7%A4%BA%E6%95%8F%E6%84%9F%E5%85%A7%E5%AE%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542887/%E4%B8%8A%E7%8F%AD%E4%B8%8D%E8%A6%81%E7%9C%8B%20Steam%20%28%E6%BB%91%E9%BC%A0%E7%B6%93%E9%81%8E%E6%89%8D%E6%9C%83%E9%A1%AF%E7%A4%BA%E6%95%8F%E6%84%9F%E5%85%A7%E5%AE%B9%29.meta.js
// ==/UserScript==

(function(){
    const NOTICE = '.mature_content_notice',
          CLS    = 'tm-blur',
          PARENT = 'tm-blur-parent',
          CSS    = `
          img.${CLS}, video.${CLS} {
            filter: blur(16px) grayscale(0.2) brightness(0.8);
            transition: filter .3s;
            display: block;
            box-sizing: border-box;
            overflow: hidden;
            border-radius: .01px;
            clip-path: inset(0);
            pointer-events: auto !important;
          }
          img.${CLS}:hover, video.${CLS}:hover,
          .${PARENT}:hover img.${CLS},
          .${PARENT}:hover video.${CLS} {
            filter: none !important;
          }
          .tm-blur-parent > div {
            filter: blur(16px) grayscale(0.2) brightness(0.8);
            transition: filter .3s;
          }
          .tm-blur-parent:hover > div {
            filter: none !important;
          }
        `,
          isSteam = src=>/^https:\/\/(shared|clan)\..*?\.steamstatic\.com\//.test(src),
          blurOne = el=>{
              if (el.tagName==='VIDEO' || (el.tagName==='IMG' && isSteam(el.src))) {
                  el.classList.add(CLS);
                  if (el.parentElement) el.parentElement.classList.add(PARENT);
              }
          },
          init = ()=>{
              if (!document.getElementById('tm-mature-blur-style')) {
                  document.head.appendChild(Object.assign(
                      document.createElement('style'),
                      {id:'tm-mature-blur-style', textContent:CSS}
                  ));
              }
              document.querySelectorAll('img,video').forEach(blurOne);
              new MutationObserver(ms=>{
                  ms.forEach(m=>{
                      if (m.type==='childList')
                          m.addedNodes.forEach(n=>{
                              if (n.nodeType===1){
                                  blurOne(n);
                                  if (n.querySelectorAll)
                                      n.querySelectorAll('img,video').forEach(blurOne);
                              }
                          });
                      else if (m.type==='attributes')
                          blurOne(m.target);
                  });
              }).observe(document.body,{
                  childList: true, subtree: true,
                  attributes: true, attributeFilter: ['src']
              });
          };

    // 如果已經有成人標籤就立即啟動，否則監聽直到出現
    if (document.querySelector(NOTICE)) init();
    else new MutationObserver((_,o)=>{
        if (document.querySelector(NOTICE)){
            o.disconnect();
            init();
        }
    }).observe(document.body,{childList:true,subtree:true});
})();