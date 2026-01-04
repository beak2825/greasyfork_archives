// ==UserScript==
// @name        ニコニコ(Re)のマイページ(2020年10月版)にニコ生放送状況ボタンを召喚するだけ
// @namespace   Violentmonkey Scripts
// @match       https://www.nicovideo.jp/my/*
// @grant       none
// @version     0.0.1
// @author      gonbuto
// @description 2020/10/31 16:06:20
// @downloadURL https://update.greasyfork.org/scripts/415169/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%29%E3%81%AE%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%282020%E5%B9%B410%E6%9C%88%E7%89%88%29%E3%81%AB%E3%83%8B%E3%82%B3%E7%94%9F%E6%94%BE%E9%80%81%E7%8A%B6%E6%B3%81%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E5%8F%AC%E5%96%9A%E3%81%99%E3%82%8B%E3%81%A0%E3%81%91.user.js
// @updateURL https://update.greasyfork.org/scripts/415169/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%29%E3%81%AE%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%282020%E5%B9%B410%E6%9C%88%E7%89%88%29%E3%81%AB%E3%83%8B%E3%82%B3%E7%94%9F%E6%94%BE%E9%80%81%E7%8A%B6%E6%B3%81%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E5%8F%AC%E5%96%9A%E3%81%99%E3%82%8B%E3%81%A0%E3%81%91.meta.js
// ==/UserScript==

(async function() {
  const headerContainer = document.querySelector('div.UserDetailsHeader-actions');
  
  const liveNotificationContainer = document.createElement('div');
  liveNotificationContainer.style.cssText = 'border-radius: 4px; margin-right: 8px; padding: 4px; background-color: darkgray;';
  headerContainer.insertBefore(liveNotificationContainer, headerContainer.firstChild);
  
  const liveNotificationButton = document.createElement('button');
  liveNotificationButton.className = 'liveNotificationButton';
  liveNotificationContainer.appendChild(liveNotificationButton);
  
  
  // ボタン押すと出てくる部分
  const liveNotificationDetailsContainer = document.createElement('div');
  liveNotificationDetailsContainer.className = 'liveNotificationDetailsContainer';
  liveNotificationDetailsContainer.style.cssText = 'display: none; position: absolute; padding: 4px; border: 3px solid #000; font-weight: 700; border-radius: 4px; cursor: pointer;';
  liveNotificationContainer.appendChild(liveNotificationDetailsContainer);
  // ニコ生マイページへのリンク
  const liveDetailLink = document.createElement('a');
  liveDetailLink.appendChild(document.createTextNode('ニコ生マイページへ'));
  liveDetailLink.href = 'https://live.nicovideo.jp/follow';
  liveNotificationDetailsContainer.appendChild(liveDetailLink);
  
  liveNotificationButton.onclick = function() {
    liveNotificationDetailsContainer.style.display = (liveNotificationDetailsContainer.style.display === 'none' ? 'block' : 'none')
  };
  
  
  // ボタン表示部作成
  const labelTextContainer = document.createElement('span');  // TextNodeは直接スタイルを持てないため
  const labelText = document.createTextNode('フォロー中の番組:')
  const counterTextContainer = document.createElement('span');
  const counterText = document.createTextNode('p14ceh01d3r');
  liveNotificationButton.appendChild(labelTextContainer);
  labelTextContainer.appendChild(labelText);
  liveNotificationButton.appendChild(counterTextContainer);
  counterTextContainer.appendChild(counterText);
  
  labelTextContainer.style.cssText = 'color: white; padding: 4px; font-weight: 700;';
  
  //APIアクセスと数字書き換え
  data = await fetch('https://live.nicovideo.jp/api/relive/notifybox.content?rows=100', {credentials: "include"})
                .then(response => response.json());
  num_programs = data['data']['notifybox_content'].length;
  console.debug(num_programs);

  if (num_programs > 0)
    counterTextContainer.style.cssText = 'color: white; min-width: 2em; font-weight: 1000; background-color: red; padding: 4px; border-radius: 8px;';

  counterText.textContent = num_programs
})();
