// ==UserScript==
// @name        AI聊天匯出器
// @namespace    https://xuanheai.com/
// @version      0.1
// @description  以優化過的HTML格式匯出AI聊天記錄
// @include      https://xuanheai.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @author       Sardo Ip
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481705/AI%E8%81%8A%E5%A4%A9%E5%8C%AF%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481705/AI%E8%81%8A%E5%A4%A9%E5%8C%AF%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==


//Default Download Link Href

function createDownloadLink(){
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', '#');
  downloadLink.setAttribute('class', 'ai-download-link');
  downloadLink.setAttribute('download', 'AI聊天匯出.html');
  downloadLink.text = '下載內容';
  const buttonBar = document.querySelector('.btn-bar');
  buttonBar.appendChild(downloadLink);
}

// A tmp element for download file
function download(text) {
  const realDownloadLink = document.createElement("a");
  realDownloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(text);
  realDownloadLink.download = 'AI聊天匯出.html';
  realDownloadLink.click();
}

function getContent(){
  let msgLists = $('.msg-item').toArray();
  msgLists = msgLists.reverse();
  
  let resultHtml = `<html>
  <head>
  <title>AI聊天匯出記錄</title>
  <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/css/bootstrap.min.css">
  <style>
    .message{
      margin-bottom: 10px;
      padding: 10px;
     } 
    .question{
      font-weight: bold;
    }
  </style>
  </head>
  <body>`;
  
  for(let i = 0; i < msgLists.length; i++){
    const msg = $(msgLists[i]);
    const question = $(msg).find('.msg-input').text();
    const answer = $(msg).find('.answer-text').text();
    resultHtml += '<div class="card message">';
    resultHtml += `<div class="question">${question}</div>`;
    resultHtml += `<div class="answer">${answer}</div>`;
    resultHtml += '</div>';
  }
  resultHtml += '</body></html>';
  return resultHtml;
}


setTimeout(function(){
  createDownloadLink();
  
  $('.ai-download-link').click(function(e){
    e.preventDefault();
    const downloadContent = getContent();
    download(downloadContent);
  });
  
}, 2000);
