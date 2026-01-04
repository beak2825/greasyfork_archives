// ==UserScript==
// @name        TJ User Tagging
// @namespace   Violentmonkey Scripts
// @match       https://tjournal.ru/*
// @grant       none
// @version     1.11
// @license     CC0
// @author      -
// @description 3/29/2020, 5:46:18 PM
// @downloadURL https://update.greasyfork.org/scripts/403665/TJ%20User%20Tagging.user.js
// @updateURL https://update.greasyfork.org/scripts/403665/TJ%20User%20Tagging.meta.js
// ==/UserScript==

function setTag(userId) {
  let tags = JSON.parse(localStorage.userTags || '{}');
  let oldColor = '#' + ((tags[userId] ? tags[userId].split('#')[1] : null) || '888888');
  let newTag = prompt('Тег, или тег#цвет:', tags[userId] ? tags[userId].split('#')[0] : '');
  if (newTag == null) return;
  
  localStorage.userTags = JSON.stringify(Object.assign(tags, { [userId]: newTag }), (k, v) => v ? v : void 0);
  tagsUpdate();
  
  if (newTag && newTag.indexOf('#') === -1){
    with (document.body.appendChild(document.createElement('input'))){
      type = 'color';
      value = oldColor;
      style.display = 'none';
      onchange = function(){
        localStorage.userTags = JSON.stringify(Object.assign(tags, { [userId]: newTag + this.value }), (k, v) => v ? v : void 0);
        tagsUpdate();
        document.body.removeChild(this);
      };
      click();
    }
  }
}

function addTagButton() {
  let target = document.querySelector('.etc_control[data-subsite-url]');
  if (target && !document.querySelector('._tg')) {
    with (target.insertAdjacentElement('afterend', document.createElement('div'))) {
      onclick = () => /\/(\d+)-/.test(location.href) && setTag(RegExp.$1);
      className = '_tg ui-button ui-button--5 l-ml-12 lm-ml-0 lm-mr-12';
      innerHTML = '<span></span>'
    }
  }
  setTimeout(addTagButton, 500);
}

function isColorDark(color) {
  return !color || (color.length == 6 ? parseInt(color.substr(2, 2), 16) : parseInt(color[1], 16) * 16) < 200;
}

function tagsUpdate() {
  let tags = JSON.parse(localStorage.userTags || '{}');
  (window._tgStyle || (window._tgStyle = document.body.appendChild(document.createElement('style')))).innerHTML = `
  .user_name:after, .content-header-author:after, .vote__users__item .vote__users__item__name:after, .live__item__user:after { 
    display:inline-block; padding:2px 4px 3px 4px; margin:-2px 4px -3px 4px; border-radius:2px; font-weight:normal; font-size:small; 
  }
  .vote__users__item .vote__users__item__name:after { 
    padding:0 4px 0 4px; margin:-2px 4px -3px 4px;
  }
  .etc_control[data-subsite-url] + ._tg { 
    content:"Тег"; height:34px; line-height:34px; font-size:15px; padding:0 20px; border-radius:4px; 
    display:inline-block; font-weight:normal; margin-left:8px; cursor:pointer; 
  }
  .etc_control[data-subsite-url] + ._tg span:after { 
    content:"Тег";
  }
  ` + Object.keys(tags).filter(x => tags[x]).map(x => 
    `a[href*="/${x}-"] .user_name:after, 
    .vote__users__item[href*="/${x}-"] .vote__users__item__name:after, 
    .content-header-author[href*="/${x}-"]:after, 
    .live__item__user[href*="/${x}-"]:after, 
    .etc_control[data-subsite-url*="/${x}-"] + ._tg,
    .etc_control[data-subsite-url*="/${x}-"] + ._tg span:after { 
      content: "${tags[x].split('#')[0]}"; 
      background: #${tags[x].split('#')[1] || '888'} !important; color: #${isColorDark(tags[x].split('#')[1]) ? 'fff' : '000'} !important; 
    }`).join('\n');
}

addTagButton();
tagsUpdate();