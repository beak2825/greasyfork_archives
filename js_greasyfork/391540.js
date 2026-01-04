// ==UserScript==
// @name         YoutubeMonolyse
// @namespace    mailto:help.christopherlovell@gmail.com
// @version      0.3.1
// @description  Create's a button in the settings menu on a youtube video page that disables/enables stereo/mono audio.
// @author       Christopher M. Lovell
// @include      https://www.youtube.com/watch?v*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/391540/YoutubeMonolyse.user.js
// @updateURL https://update.greasyfork.org/scripts/391540/YoutubeMonolyse.meta.js
// ==/UserScript==

var buttonSrc = '<div id="ytmid-toggle-btn"class="ytp-menuitem" role="menuitem" tabindex="0">' +
'    <div class="ytp-menuitem-label">Toggle Mono</div>' +
'    <div class="ytp-menuitem-content">' +
'        <button class="ytp-button"><span id="ytmid-toggle-span" class="ytp-menu-label-secondary">Stereo</span></button>' +
'    </div>' +
'</div>';

var context = new AudioContext();
    var videos = document.getElementsByTagName("video");
    var audioElement;

var isMono = false;
var btnSettingSvg;
var insertBtnParent;
var text;

window.toggleMono = () => {
  if(audioElement == null)
  {
      audioElement = context.createMediaElementSource(videos[0]);
  }

  context.destination.channelCount = isMono? 2 : 1;
  audioElement.connect(context.destination);
  isMono = !isMono;
  return isMono;
}
window.initialiseTMYoutubeMonolyse = () =>{
    console.log("Initialising -- YoutubeMonolyse by Christopher Lovell")
    btnSettingSvg = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-button.ytp-settings-button");
    // Youtube's setting menu by default has no elements in it, so we open it up then instantly close it using dispatchEvents.
    btnSettingSvg.dispatchEvent(new MouseEvent('click'));
    btnSettingSvg.dispatchEvent(new MouseEvent('click'));
    insertBtnParent = document.querySelector("#ytp-id-18 > div > div");
    window.initButtons();
}
window.initButtons = () => {
    console.log("Initialising Buttons")
    insertBtnParent.insertAdjacentHTML('beforeend',buttonSrc);
    var button = document.querySelector("#ytmid-toggle-btn");
    console.log(button.innerHTML);
    text = button.querySelector("#ytmid-toggle-span");
    console.log(text.innerHTML);

    button.onclick = function(){
        console.log("Setting audio to mono!");
        window.toggleMono();
        text.innerHTML = isMono ? "Mono" : "Stereo";
    };

}
window.initialiseTMYoutubeMonolyse();

// VERSION HISTORY
// 0.1 Initial release
// 0.2 Fixed bug with video that don't have an enable annotation options
// 0.3 Fixed issue with mono option not showing up on non-hd videos

