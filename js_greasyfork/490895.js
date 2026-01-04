// ==UserScript==
// @name        vlm-Assistant
// @namespace   Violentmonkey Scripts
// @match       http://vlm.lge.com/issue/browse/**
// @grant       none
// @version     1.4
// @author      -
// @description 3/26/2024, 2:29:22 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490895/vlm-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/490895/vlm-Assistant.meta.js
// ==/UserScript==


(function() {
  'use strict';

  window.addEventListener('load', () => {
    addButton('all download', allDownload)
  })

  function addButton(text, onclick, cssObj) {
    cssObj = cssObj || {padding: '1px 5px', 'border-radius': '5px', float: 'right', 'font-weight': 'bold', color: '#FCF6F5', 'background-color': '#2BAE66', 'border-color': '#2BAE66', 'cursor': 'pointer'}
    let button = document.createElement('button'), btnStyle = button.style
    document.getElementById('attachmentmodule_heading').appendChild(button)
    button.innerHTML = text
    button.onclick = onclick
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
    return button
  }

  function allDownload() {
    let attachments = document.getElementsByClassName('attachment-content js-file-attachment');

    for (let index in attachments) {
      let aTag = attachments[index].getElementsByTagName('a')[1];
      (function(a, i){
        setTimeout(function(){
          aTagForceDownload(a);
        }, 1500*i);
      })(aTag, index);
    }
  }

  function aTagForceDownload(aTag) {
    var a = document.createElement('a');
    // aTag를 바로 사용하지 않는 이유는 mp4, jpg같은 클릭 시 브라우저에서 여는 케이스 때문입니다.
    a.download = aTag.href.split('\\').pop().split('/').pop();
    a.href = aTag.href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

})();