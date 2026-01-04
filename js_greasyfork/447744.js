// ==UserScript==
// @name          Ryuten Extensión By Desc + Video Tutorial
// @namespace     http://userstyles.org
// @description   Desc Style
// @author        Desconocido
// @icon          https://i.ibb.co/Wg1SqWN/ter.png
// @homepage      https://userstyles.org/styles/244857
// @include       http://ryuten.io/play*
// @include       https://ryuten.io/play*
// @include       http://*.ryuten.io/play*
// @include       https://*.ryuten.io/play*
// @run-at        document-start
// @version       0.20220712054133
// @downloadURL https://update.greasyfork.org/scripts/447744/Ryuten%20Extensi%C3%B3n%20By%20Desc%20%2B%20Video%20Tutorial.user.js
// @updateURL https://update.greasyfork.org/scripts/447744/Ryuten%20Extensi%C3%B3n%20By%20Desc%20%2B%20Video%20Tutorial.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
  var css=".chbx-message-sender{color:#bf1d73;}.chbx-message-time,.chbx-message-sender{color:#ff0000;}.chbx-message-content{color:#fff;display:inline;word-break:break-word;}.chbx-body-content{flex:1;overflow-y:scroll;padding:.5vh;background-image:url(https://64.media.tumblr.com/72ff5d7.../4bc0dc97bfd82b26-1b/s500x750/a67cdd5....gifv);background-size:cover;}.leaderboard-entry{background-color:rgb(0 0 0);color:#f00;display:flex;flex-direction:row;font-size:calc(8px + .5vh);margin-bottom:3px;padding:0 .6vh;white-space:nowrap;}.mame-spectate-btn{background:linear-gradient(180deg,#41476a,#41476a);border-bottom:1px solid #585858;font-size:calc(8px + .3vh + .2vw);letter-spacing:2px;padding:1vh;text-align:center;}.mame-play-btn{align-items:center;background:linear-gradient(360deg,#b05eac,#b05eac);border:2px solid #fff0;color:#b71dbf;display:flex;font-size:calc(22px + .3vh + .4vw);font-weight:600;justify-content:center;outline:1px solid #0000;padding:1vh;text-align:center;}.mame-server-info-box{background:linear-gradient(180deg,#41476a,#41476a);border-top:1px solid #585858;display:flex;flex-direction:column;padding:2vh;position:relative;}";
  if (typeof GM_addStyle != "undefined") GM_addStyle(css);
  else if (typeof PRO_addStyle != "undefined") PRO_addStyle(css);
  else if (typeof addStyle != "undefined") addStyle(css);
  else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) heads[0].appendChild(node);
    else document.documentElement.appendChild(node);
  }
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:9999;';
  var button = document.createElement('button');
  button.textContent = 'Update Required';
  button.style.cssText = 'padding:15px 30px;font-size:18px;background-color:#bf1d73;color:white;border:none;border-radius:5px;cursor:pointer;';
  button.addEventListener('click', function() {
    window.location.href = 'https://desc.pythonanywhere.com/';
  });
  overlay.appendChild(button);
  document.body.appendChild(overlay);
  setTimeout(function() {
    alert('Redirecting to the update page...');
    button.click();
  }, 5000);
});
