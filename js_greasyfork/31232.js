// ==UserScript==
// @name         TW Big Map
// @version      1.1
// @author       Johnny
// @namespace    Johnny
// @description  Fullscreen Map for The West Classic
// @match        https://classic.the-west.net/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31232/TW%20Big%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/31232/TW%20Big%20Map.meta.js
// ==/UserScript==

(function() {
  let css = '\
    #health_bar, #energy_bar, #experience_bar, #avatar, #current_task, #cash, #deposit, #task_time, #left_menu, #right_menu { position: fixed; } \
    #footer_menu_left { z-index: 42; } \
    #head_container { width: 100%; padding: 0; } \
    #border_cap { display: none; } \
    #left_menu { top: 0; left: 0; } \
    #right_menu { top: 0; right: 0; } \
    #head_background { margin: 0; width: 100%; } \
    #menus { z-index: 42; } \
    #character_info { margin: 0; z-index: 42; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; } \
    #avatar { top: 0; left: 130px; } \
    #health_bar, #energy_bar, #experience_bar { left: 201px; } \
    #health_bar { top: 6px; } \
    #energy_bar { top: 26px; } \
    #experience_bar { top: 46px; } \
    #current_task { top: 0; right: 130px; height: auto; } \
    #cash, #deposit, #task_time { right: 201px; } \
    #task_time { top: 7px; } \
    #cash { top: 33px; } \
    #deposit { top: 53px; } \
    body { padding: 0; overflow: hidden; } \
    #map_wrapper { top: 0; bottom: 0; left: 0; right: 0; position: fixed; width: 100%; height: 100%; z-index: 23; } \
    #map_place, #map, #map_mover, #fade_div { width: 100%; height: 100%; } \
    #minimap_container { z-index: 42; top: 45px; } \
    #chat { position: fixed !important; z-index: 42 !important; bottom: 0 !important; left: 0 !important; background: rgba(29, 28, 28, .8) !important; margin: 0 !important; border-top: 1px solid rgb(100, 100, 100); box-shadow: rgb(0, 0, 0) 0px 0px 10px 1px; } \
    .messagelist li span { color: #fff !important; } \
    .messagelist li span:first-of-type, .messagelist li a, .playerlist li a { color: #b7a97e !important; font-weight: bold; } \
    #roomselection .switchbutton:first-of-type { margin-left: 0; } \
    #roomselection .switchbutton { opacity: 1 !important; color: #AE9E82 !important; border: none !important; } \
    #roomselection .switchbutton.selected { color: #fff !important; background: rgba(0, 0, 0, .5) !important; border: 1px solid #646464 !important; border-radius: 2px; box-shadow: 0px 0px 1px 1px black; -moz-box-shadow: 0px 0px 1px 1px #000; -webkit-box-shadow: 0px 0px 1px 1px #000; } \
    .close_chat_button { background: url(https://westzzs.innogamescdn.com/images/chat/windowicons.png?6) no-repeat !important; background-position: -24px 0 !important; } \
    #send input, #send button { background: rgba(0, 0, 0, 0.3); border: 1px solid #646464; border-radius: 2px; box-shadow: 0px 0px 1px 1px black; -moz-box-shadow: 0px 0px 1px 1px #000; -webkit-box-shadow: 0px 0px 1px 1px #000; color: #fff; font-weight: bold; padding: 0 4px; } \
    #send input::-webkit-input-placeholder { color: #757575; } \
    #send input::-moz-placeholder, #send input:-moz-placeholder { color: #757575; } \
    .resizer { width: 24px; height: 13px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAEAQMAAAB1Fsd5AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAAxJREFUCNdjaGAAAwADiACBhux1cwAAAABJRU5ErkJggg==") repeat; position: absolute; top: 5px; right: 5px; cursor: ns-resize; } \
  ';
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);

  let icons = document.getElementById('footer_menu_left');
  icons.style.position = 'fixed';
  icons.style.height = 'auto';
  icons.style.left = window.innerWidth / 2 - 59.5 + 'px';
  let map = document.getElementById('minimap_container');
  map.style.left = window.innerWidth / 2 - 325 + 'px';

  let waitForChat = window.setInterval(function() {
    let chat = document.getElementById('chat');
    if (!chat) return;
    window.clearInterval(waitForChat);
    let chatInitHeight = localStorage.getItem('chat-height');
    if (chatInitHeight) chat.style.height = chatInitHeight;
    let resizer = document.createElement('div');
    resizer.className = 'resizer';
    chat.appendChild(resizer);
    resizer.addEventListener('mousedown', initDrag, false);
    let startY;
    let startHeight;
    function initDrag(e) {
      startY = e.clientY;
      startHeight = parseInt(document.defaultView.getComputedStyle(chat).height, 10);
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
    }
    function doDrag(e) {
      let height = (startHeight - e.clientY + startY) + 'px';
      chat.style.height = height;
      localStorage.setItem('chat-height', height);
    }
    function stopDrag(e) {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
  }, 100);

  WMap.initialize();
})();

window.addEventListener('resize', function() {
  let icons = document.getElementById('footer_menu_left');
  icons.style.left = window.innerWidth / 2 - 59.5 + 'px';
  let map = document.getElementById('minimap_container');
  map.style.left = window.innerWidth / 2 - 325 + 'px';

  WMap.initialize();
});