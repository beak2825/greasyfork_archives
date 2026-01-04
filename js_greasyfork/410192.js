// ==UserScript==
// @name              Ani Gamer Age Check Bypass
// @name:zh-Tw        動畫瘋年齡確認自動同意
// @description       The script automically select agree when age check appear
// @description:zh-Tw 年齡認證出現時自動選取同意
// @namespace         ani.gamer
// @version           2.1
// @include           https://*ani.gamer.com.tw/animeVideo*
// @include           https://*ani.gamer.com.tw/party.php*
// @license           Beerware
// @compatible firefox 瀏覽器需給予自動撥放影音內容的權限
// @downloadURL https://update.greasyfork.org/scripts/410192/Ani%20Gamer%20Age%20Check%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/410192/Ani%20Gamer%20Age%20Check%20Bypass.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(async function() {
  // get video node
  function get_video_node() {
    let ani_video = document.getElementById('ani_video');
    let party_video = document.getElementById('partyPlayer');
    return ani_video || party_video
  }

  // click the agree button
  function agreeAnyway() {
    let agreeButton = document.getElementById('adult');
    if (agreeButton) {
      console.log("I AM A GROWN MAN, I'M A BIG ADULT, I CAN DO THIS.");
      agreeButton.click();
    }
  }

  function delay(milliseconds){
      return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
      });
  }

  // wait for ani_video node appear
  let retryCount = 0;
  let video_node = null;

  // check 4 times/second for 20 seconds
  while (retryCount++ < 80) {
    video_node = get_video_node()
    if (video_node) {
      break;
    }
    await delay(250);
  }

  if (!video_node) {
    console.error("Can not get the video node");
    return;
  }

  // add observer on video node
  const config = { childList: true, subtree: false};
  const observer = new MutationObserver(() => agreeAnyway());
  observer.observe(video_node, config);

  // this step is required to prevent the agreeAnyway not trigger if
  // ani_video is fully loaded before observer started
  agreeAnyway();
})();
