// ==UserScript==
// @name         知乎一键拉黑
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不需要转到用户主页，在首页即可拉黑
// @author       bluicezhen
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        https://gist.githubusercontent.com/bluicezhen/0a6fa3255f5718139ed13b46bbd3da6b/raw/ccbaa0b64518ea026c03522cd8e9acd780d8daca/zhihu_block.tampermonkey.js
// @downloadURL https://update.greasyfork.org/scripts/435019/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/435019/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==
(function() {
  'use strict';
  function myAlert(msg,duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "position: absolute; top: 100px; right: 100px; background-color: white; color:red; font-size: 32px");
    el.innerHTML = msg;
    setTimeout(function(){
      el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
  }
  function generateButton (userID) {
    function blockUser () {
      console.log('blockU')
      fetch(`https://www.zhihu.com/api/v4/members/${userID}/actions/block`, {
        'body': null,
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'include'
      });
      myAlert(`已拉黑用户${userID}`, 1000)
    }
    let para = document.createElement('button');
    let node = document.createTextNode('|一键拉黑|');
    para.classList.add('zhyjlh-button');
    para.appendChild(node);
    para.addEventListener('click', blockUser)
    return para;
  }
  function main () {
    let eConteneItemMetas = document.getElementsByClassName('ContentItem-meta') // 被打开的回答的数量
    if (eConteneItemMetas.length > 0) {
      for (let i = 0; i < eConteneItemMetas.length; i++) {
        if (document.getElementsByClassName('zhyjlh-button').length == 0) { // 防止重复添加按钮
          let eAuthorInfoContent = eConteneItemMetas[i].getElementsByClassName('AuthorInfo-content')[0];
          let userURL = eAuthorInfoContent.getElementsByClassName('UserLink-link')[0].href;
          let userID = userURL.split('/')[userURL.split('/').length - 1];
          let eButton = generateButton(userID);
          eAuthorInfoContent.appendChild(eButton);
        }
      }
    }
  }
  setInterval(main, 1000);
})();