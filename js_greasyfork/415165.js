// ==UserScript==
// @name        Wipe junk chats out from Youtube Livechat
// @namespace   YoutubeLivechatWipeSpam
// @description Wipe junk messages out.
// @author      HATTORI, Hiroki
// @match       https://www.youtube.com/live_chat*
// @version     1
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource    toastrCSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/415165/Wipe%20junk%20chats%20out%20from%20Youtube%20Livechat.user.js
// @updateURL https://update.greasyfork.org/scripts/415165/Wipe%20junk%20chats%20out%20from%20Youtube%20Livechat.meta.js
// ==/UserScript==
(function () {
  /* ********************************************************************** */
  // Inject stylesheet.
  GM_addStyle(GM_getResourceText('toasterCSS'));
  GM_addStyle(`
.ytlw-panel {
  background-color: rgba(30,30,30,0.9);
  width: auto;
  height: auto;
  z-index: 5;
  display: inline-block;
  visibility: hidden;
  position: absolute;
  bottom: 35px;
  right: 10px;
  padding: 10px;
  color: #fff;
  font-size: 14px;
}
.tylw-panel-box { width: 210px; float: left; padding-left: 5px; }
.ytlw-button {
  display: inline-block;
  border-style: none;
  z-index: 4;
  font-weight: 500;
  color: var(--yt-spec-text-secondary);
}
.ytlw-ngbutton { fill: #fff; }
.toast { font-size: 14px; }

.ytlw-guest-hidden yt-live-chat-item-list-renderer
yt-live-chat-text-message-renderer[author-type=''] { display: none!important; }
.ytlw-member-hidden yt-live-chat-item-list-renderer
yt-live-chat-text-message-renderer[author-type='member'] { display: none!important; }
.ytlw-moderator-hidden yt-live-chat-item-list-renderer
yt-live-chat-text-message-renderer[author-type='moderator'] { display: none!important; }
.ytlw-owner-hidden yt-live-chat-item-list-renderer
yt-live-chat-text-message-renderer[author-type='owner'] { display: none!important; }
.ytlw-superchat-hidden yt-live-chat-item-list-renderer
yt-live-chat-text-message-renderer[author-type='superchat'] { display: none!important; }

.ytlw-superchat-hidden yt-live-chat-item-list-renderer
yt-live-chat-paied-message-renderer { display: none!important; }
.ytlw-superstiker-hidden yt-live-chat-item-list-renderer
yt-live-chat-paied-sticker-renderer { display: none!important; }
.ytlw-membership-hidden yt-live-chat-item-list-renderer
yt-live-chat-lagacy-paied-message-renderer { display: none!important; }
`);

  /* ********************************************************************** */
  // Inject popup menu
  const popuphtml = `
<div class='ytlw-settings'>
  <div class='ytlw-panel' id='ytlw-setting-panel'>
    <div class='ytlw-panel_box'>
      <div>
        <span>Hide by member type.</spam>
      </div>
      <div>
        <input type='checkbox' name='guest' checked='checked' />Guest
        <input type='checkbox' name='member' checked='checked' />Member
        <input type='checkbox' name='moderator' checked='checked' />Moderator
        <input type='checkbox' name='owner' checked='checked' />Owner <br />
        <input type='checkbox' name='superchat' checked='checked' />Super Chat
        <input type='checkbox' name='supersticker' checked='checked' />Super Sticker
        <input type='checkbox' name='membership' checked='checked' />Membership
      </div>
    </div>
  </div>
</div>
<button type='button' name='panelbutton' value='panelbutton' class='ytlw-button'
    id='ytlw-setting-button'
    style="background: rgba(0,0,0,0);margin-left: 10px;white-space: nowrap;">
  <span>[Filter]</span>
</button>`

  const refbtn = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button');
  if (!refbtn) { return ; }
  refbtn.insertAdjacentHTML('beforebegin', popuphtml);

  const popup = document.getElementById('ytlw-setting-panel');
  document.getElementById('ytlw-setting-button').onclick = function() {
      popup.style.visibility = (popup.style.visibility == 'visible')? 'hidden' : 'visible';
    };

  // Setting actions.
  document.querySelectorAll("#ytlw-setting-panel input[type='checkbox']").forEach(function(x) {
      const c = 'ytlw-' + x.name + '-hidden';
      x.onchange = function () {
        console.log('bbbb');
          if (x.checked) {
            document.body.classList.remove(c);
          } else {
            document.body.classList.add(c);
          } }; });

})();

