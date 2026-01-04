// ==UserScript==
// @name Chinese/English vim/nvim documents jump
// @name:zh 中文/英文 vim/nvim 文档切换跳转
// @description jump between online vim-English-document/vim-Chinese-document/nvim-document
// @namespace Violentmonkey Scripts
// @match *://vimcdoc.sourceforge.net/doc/*
// @match *://vimdoc.sourceforge.net/htmldoc/*
// @match *://vimdoc.sourceforge.net/htmldoc/*
// @match *://neovim.io/doc/user/*
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @grant none
// @run-at document-end
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/377779/ChineseEnglish%20vimnvim%20documents%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/377779/ChineseEnglish%20vimnvim%20documents%20jump.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
let currentURL = document.URL;

let documentBaseURL = {
  vim: 'http://vimdoc.sourceforge.net/htmldoc',
  cvim: 'http://vimcdoc.sourceforge.net/doc',
  nvim: 'https://neovim.io/doc/user'
};

let suffixURL = currentURL.split('/').pop();

// 创建新的元素
let otherDocuments = document.createElement('div');

otherDocuments.id = "otherLanguageDocuments";

for (let baseURL in documentBaseURL) {
  let oA = document.createElement('a');
  oA.innerHTML = baseURL;
  oA.href = `${documentBaseURL[baseURL]}/${suffixURL}`;
  //newDocumentURL[baseURL] = oA
  otherDocuments.appendChild(oA);
  otherDocuments.appendChild(document.createElement('br'));
}

let body = document.getElementsByTagName('body')[0];
body.appendChild(otherDocuments);
otherDocuments.style = `visibility:hidden`
//floatingDiv.css({position: 'fixed', bottom: bottom + 'px' , right: right + 'px'});


$(document).ready(function() {
  let objWindow = $(window);
  let floatingDiv = $('#otherLanguageDocuments');
  let repositionTimes = 0;
  $(window).scroll(
    setInterval(function() {
      if(repositionTimes < 100) {
        setPostion(floatingDiv);
        repositionTimes += 1;
      }
    }, 100)
  );

  $(window).mousemove(
    setInterval(function() {
      if(repositionTimes < 100) {
        setPostion(floatingDiv);
        repositionTimes += 1;
      }
    }, 100)
  );


});

function setPostion(ele) {
  let bottom = Math.round(ele.height() * 2);
  let right = Math.round(ele.width() * 2);
  ele.css({position: 'fixed', bottom: bottom + 'px', right: right + 'px', visibility: 'visible'});
}

