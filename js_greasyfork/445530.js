// ==UserScript==
// @namespace flingster-large-video@jajabenaim
// @name     Flingster Large Video View
// @version  1
// @license MIT
// @grant    none
// @author         hnpa69
// @description    Displays a larger video and a smaller camera in a narrow chat sidebar.
// @match          https://flingster.com/
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/445530/Flingster%20Large%20Video%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/445530/Flingster%20Large%20Video%20View.meta.js
// ==/UserScript==

function Main()
{

  var mainPlayer = document.getElementsByClassName('main_player')[0];
  var myVid = document.getElementsByClassName('local_vid')[0];
  var chatParent = document.getElementsByClassName('chat_div')[0];
  var chatArea = document.getElementsByClassName('cd-chatarea')[0];
  var chatInput = document.getElementsByClassName('chat_input')[0];
  var leftArea = document.getElementById('resizable');
  var topControls = document.getElementsByClassName('cd-top')[0];
  var cdtSelect = document.getElementsByClassName('cdt-select')[0];
  var rtlChatContainer = document.getElementsByClassName('rlt-chat-container')[0];
  var camsWrap = document.getElementsByClassName('cams_wrap')[0];

  rtlChatContainer.style.height = "235px";
  camsWrap.style.maxWidth = "none";

  cdtSelect.style.marginLeft = "0px";

  mainPlayer.style.marginLeft = "0px";
  mainPlayer.style.marginRight = "0px";
  mainPlayer.style.marginTop = "0px";
  mainPlayer.style.marginBottom = "0px";

  leftArea.style.width = "80%";
  topControls.style.minWidth = "20%";


  chatInput.style.position = "relative";
  chatArea.style.height = "35%";

  chatParent.appendChild(myVid);
  myVid.style.position = "relative";
  myVid.style.bottom = "0";
  myVid.style.left = "0";
  myVid.style.width = "auto";
  myVid.style.height = "auto";
  myVid.style.margintTop = "20px";

};

window.setTimeout(Main, 5000);

// !function Loader(i)
// {
//   makeScript = function () {
//     script = document.createElement('script');
//     script.type = 'text/javascript';
//   }
//   loadLocal = function (fn) {
//     makeScript();
//     script.textContent = '(' + fn.toString() + ')(jQuery);';
//     head.appendChild(script);
//   };
//   (function (i) { loadLocal(Main) })(i || 0);
// }();