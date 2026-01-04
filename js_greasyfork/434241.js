// ==UserScript==
// @name     Twitch 深色模式樣式與聊天室修改
// @description Twitch 深色模式樣式與聊天室修改。
// @author   Peugin(冷凍企鵝)
// @include  /www.twitch.tv/
// @version  v1
// @grant    none
// @namespace https://greasyfork.org/users/393588
// @downloadURL https://update.greasyfork.org/scripts/434241/Twitch%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E6%A8%A3%E5%BC%8F%E8%88%87%E8%81%8A%E5%A4%A9%E5%AE%A4%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/434241/Twitch%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E6%A8%A3%E5%BC%8F%E8%88%87%E8%81%8A%E5%A4%A9%E5%AE%A4%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
'user strict'
//以下顏色請使用 #XXXXXX 色碼
//參考顏色網址：https://reurl.cc/nVNGO8
//預設為全黑 '#000'

//文字「實況聊天室」的背景顏色，該功能【可能】導致其他地方的顏色變更
const chat_room_header_color = '#000';
//聊天室背景顏色
const chat_room_background_color ='#000';
//表情寬度調整
const emote_width_size = 'auto';

//若不想開啟功能，你可以使用 // 註解該行程式碼
window.onload = function(){
  
  //修改：文字「實況聊天室」的背景顏色
  modify_chat_room_header_color();
  
  //修改：聊天室背景顏色
  modify_chat_room_background_color();
  
  //修改：表情寬度
  modify_emote_width_size();
}

//修改：文字「實況聊天室」的背景顏色
function modify_chat_room_header_color(){
  document.documentElement.style.setProperty('--color-hinted-grey-2', chat_room_header_color);
}

//修改：聊天室背景顏色
function modify_chat_room_background_color(){
  let style = document.createElement('style');
	document.body.appendChild(style);
	style.sheet.insertRule('.tw-root--theme-dark .chat-room {background:' + chat_room_background_color + ';}', 0);
}

//修改：表情寬度
function modify_emote_width_size(){
  let head = document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
	document.body.appendChild(style);
	style.sheet.insertRule('.chat-image__container {width:' + emote_width_size + ';}', 0);
  style.sheet.insertRule('.chat-line__message--emote-button {width:' + emote_width_size + ';}', 0);
}