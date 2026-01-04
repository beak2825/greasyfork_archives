// ==UserScript==
// @name         新标签页打开论坛帖子
// @namespace    https://leochan.me
// @version      1.1.0
// @description  一些特别的网站
// @author       Leo
// @match        *://*/thread-*-1-1.html
// @match        *://*/forum-*-*.html
// @match        *://*/forum/forum-*.html
// @match        *://*/forum/forum-*-*.html
// @match        *://*/forum.php?mod=forumdisplay&fid=*
// @match        *://*/forum.php?mod=viewthread&tid=*
// @match        *://*/forum.php?mod=forumdisplay&action=list&fid=*
// @match        *://*/group-*-*.html
// @match        *://*/thread-*-*-*.html
// @match        *://*/forum/forumdisplay.php?fid=*
// @match        *://*/thread*.php?fid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @require https://greasyfork.org/scripts/470241-%E4%BE%A6%E5%90%ACinnerhtml/code/%E4%BE%A6%E5%90%ACinnerHTML.js?version=1215965
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/470016/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/470016/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const showAllImages = () => {
    if (location.href.indexOf('pp=-1') === -1 && document.querySelector('a[href$="pp=-1"]')?.textContent === '查看全部图片') {
      location.href = location.href + (location.href.indexOf('?') === -1 ? '?' : '&') + 'pp=-1';
    }
  };
  showAllImages();
  const openUrlInNewTab = (selector) => {
    let links = document.querySelectorAll(selector), length = links.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        links[i].removeAttribute('onclick');
        links[i].setAttribute('target', '_blank');
      }
    }
  }
  function setUrlAttribute(){
      openUrlInNewTab('#moderate a.xst');
      openUrlInNewTab('tbody[id^="normalthread_"] span[id^="thread_"] a');
      openUrlInNewTab('table tbody tr span[id^="thread_"] a');
      openUrlInNewTab('#ajaxtable .tal h3 a');
  }
  setUrlAttribute();
  function leoChanGetFirstUrl(str){
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const match = str.match(urlPattern);
    if (match && match.length > 0) {
      return match[0].replace('"', '').replace("'", "").replace(')', '').replace(';', '')
    } else {
      return null;
    }
  }
  function leoChanAddImages(selectors){
    const allSelectors = document.querySelectorAll(selectors);
    if(allSelectors){
      const allSelectorsLength = allSelectors.length;
      for(let i = 0;i < allSelectorsLength;i++){
        let idValue = allSelectors[i].id;
        if(idValue && idValue.indexOf('kym_list_li_d_') === 0){
          const scriptContent = allSelectors[i].nextElementSibling.textContent;
          const imageSrc = leoChanGetFirstUrl(scriptContent);
          if(imageSrc && !allSelectors[i].innerHTML){
            allSelectors[i].style.display = 'block';
            allSelectors[i].innerHTML = '<img src="' + imageSrc + '" width="85" height="75" />';
            allSelectors[i].closest('li').style.display = 'block';
            allSelectors[i].closest('ul').parentNode.style.display = 'block';
          }
        }
      }
    }
  }
  function watchInnerHTMLCallback(){
    setUrlAttribute();
    leoChanAddImages('div.kym_list_li_d');
  }
  leoChanWatchInnerHTML('#moderate', watchInnerHTMLCallback);
})();