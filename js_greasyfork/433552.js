// ==UserScript==
// @name         UseDesk Button
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Usedesk QoL improvments
// @author       Jonty
// @match        https://www.tampermonkey.net/index.php?version=4.13.6138&ext=iikm&updated=true
// @icon         https://python.fillin.blackcaviargames.host/static/extension%20logo.jpg
// @grant        none
// @include      https://secure.usedesk.ru/tickets/*
// @downloadURL https://update.greasyfork.org/scripts/433552/UseDesk%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/433552/UseDesk%20Button.meta.js
// ==/UserScript==

var sender;

(function () {
  'use strict';

  // Your code here...
  var counterBtn = 0;
  var counterTxt = 0;
  var payload;
  var attachment = '';

  function postDataToWebhook(data, author, theme, email, attachment) {
    //url to webhook
    const webHookUrl = "https://python.fillin.blackcaviargames.host/usedeskresender";
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var oReq = new XMLHttpRequest();
    var myJSONStr = payload = {
      "origin": "*",
      "text": data,
      "theme": theme,
      "author": author,
      "mail": email,
      "attach": attachment,
    };

    //register method called after data has been sent method is executed
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", webHookUrl, true);
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
    oReq.send(JSON.stringify(myJSONStr));
  }

  function respResult(id, resp, name) {
    //url to webhook
    const webHookUrl = "https://python.fillin.blackcaviargames.host/autoreplyhandler";
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var oReq = new XMLHttpRequest();
    var myJSONStr = payload = {
      "origin": "*",
      "id": id,
      "result": resp,
      "name": name,
    };

    //register method called after data has been sent method is executed
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", webHookUrl, true);
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
    oReq.send(JSON.stringify(myJSONStr));
  }

  function postDataToWebhookTester(data, author, theme, email, attachment) {
    //url to webhook
    const webHookUrl = "https://python.fillin.blackcaviargames.host/usedesktester";
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var oReq = new XMLHttpRequest();
    var myJSONStr = payload = {
      "origin": "*",
      "text": data,
      "theme": theme,
      "author": author,
      "mail": email,
      "attach": attachment,
    };

    //register method called after data has been sent method is executed
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", webHookUrl, true);
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
    oReq.send(JSON.stringify(myJSONStr));
  }

  //callback method after webhook is executed
  function reqListener() {
    console.log(this.responseText);
  }

  let txt = document.querySelectorAll('.horizontal-scroll');
  txt.forEach(function (userItem) {
    userItem.setAttribute('id', 'txt' + counterTxt);
    counterTxt += 1;
  });

  let div = document.querySelectorAll('.rating');
  div.forEach(function (userItem) {
    let btn = userItem.parentNode;
    btn.innerHTML += '\
      <div style="width: 250px;">\
        <div class="mail-sender" style="flex: auto; flex-direction: row; padding: 0px; padding-right: 10px; vertical-align: middle;">\
          <button id=' + counterBtn + ' onclick="sender(this.id)" class="btn-helper" style="border-radius: 3px; border: 1px solid transparent; padding: 6px; width: 130px; background-color: #00a651; color: #ffffff">\
            Отправить в HR чат\
          </button>\
          <button id=' + counterBtn + ' onclick="tester(this.id)" class="btn-helper" style="border-radius: 3px; border: 1px solid transparent; padding: 6px; background-color: #ffe652; color: #000000">\
            Передать в тест\
          </button>\
        </div>\
      </div>';
    counterBtn += 1;
  });

  window.sender = function (btnID) {
    let textID = 'txt' + btnID;
    let message = document.getElementById(textID).innerHTML;
    let parentOfBtn = document.getElementById(btnID).parentNode.parentNode;
    let parentOfPOB = parentOfBtn.parentNode.innerHTML;
    let preMail = document.getElementsByClassName('change-contact');
    let mail = preMail[0].getAttribute('data-value');

    let theme = document.getElementsByClassName('ticket-title')[0].textContent

    let parentOfMsg = document.getElementById(textID).parentNode;
    let potentialAttach = parentOfMsg.nextElementSibling;
    console.log(potentialAttach);
    if (potentialAttach != null) {
      if (potentialAttach.className === 'mail-attachments  ') {
        let attach = potentialAttach.querySelectorAll('.attach-image-link');
        attach.forEach(function (userItem) {
          let attachmentLink = userItem.getAttribute('href');
          attachment += attachmentLink + '\n';
        });
      }
    }

    console.log(attachment);
    console.log(theme);
    postDataToWebhook(message, parentOfPOB, theme, mail, attachment);
    attachment = '';
  };

  window.tester = function (btnID) {
    let textID = 'txt' + btnID;
    let message = document.getElementById(textID).innerHTML;
    let parentOfBtn = document.getElementById(btnID).parentNode.parentNode;
    let parentOfPOB = parentOfBtn.parentNode.innerHTML;
    let preMail = document.getElementsByClassName('change-contact');
    let mail = preMail[0].getAttribute('data-value');

    let theme = document.getElementsByClassName('ticket-title')[0].textContent

    let parentOfMsg = document.getElementById(textID).parentNode;
    let potentialAttach = parentOfMsg.nextElementSibling;
    console.log(potentialAttach);
    if (potentialAttach != null) {
      if (potentialAttach.className === 'mail-attachments  ') {
        let attach = potentialAttach.querySelectorAll('.attach-image-link');
        attach.forEach(function (userItem) {
          let attachmentLink = userItem.getAttribute('href');
          attachment += attachmentLink + '\n';
        });
      }
    }

    console.log(attachment);
    console.log(theme);
    postDataToWebhookTester(message, parentOfPOB, theme, mail, attachment);
    attachment = '';
  };

  function blockRemover() {
    let stringCheck = "D2D ID";
    let checker = 0
    let targetMessage = document.getElementsByClassName('mail-text');
    for (let text_block of targetMessage) {
      if (text_block.textContent.indexOf(stringCheck) > 0) {
        checker++;
      }
    }
    console.log(checker)
    if (checker == 0) {
      let block = document.querySelector('[data-block-id="9912"]');
      block.remove();
    }
  }

  window.onload = blockRemover;
})();