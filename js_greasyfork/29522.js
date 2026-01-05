// ==UserScript==
// @name        twipai
// @namespace   https://takachan-mirai.github.io
// @description Overwrite noisey users tweet with oppai in tweetdeck.
// @include     /https?:\/\/tweetdeck\.twitter\.com.*/
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29522/twipai.user.js
// @updateURL https://update.greasyfork.org/scripts/29522/twipai.meta.js
// ==/UserScript==

(() => {
  let paiConfig = localStorage.getItem('twippai_config');
  let ids = paiConfig !== null && paiConfig !== undefined ? JSON.parse(paiConfig) : [];

  let muting = (records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((obj) => {
        if(obj.nodeType == Node.ELEMENT_NODE && obj.classList.contains('stream-item')) {
          const userName = obj.querySelector(".username");
          if(userName && ids.indexOf(userName.innerText) != '-1') {
            obj.querySelector(".tweet-text").innerHTML = 'おっぱい';
          }
        }
      });
    });
  };

  let sw = true;
  while(sw) {
    if(document.querySelector('.application') != undefined) {
      let app = document.querySelector('.application');
      app.innerHTML += `
      <div id="paiconfig" style="position:fixed;bottom:10px;right:10px;background-color:#fff;padding:5px;z-index:10000;transition:1s;width:70px;height:20px;overflow:hidden;border-radius:10px;border:solid 1px #666;">
        <h2 style="text-align:center;padding-bottom:10px;color:#333;">ついっぱい</h2>
        <textarea id="paiId" style="width:100%;height:250px;"></textarea>
      </div>
      `;
      let paiconfig = document.getElementById('paiconfig');
      paiconfig.addEventListener('mouseenter', (e) => {
        e.target.style.height = '300px';
        e.target.style.width = '200px';
      });
      paiconfig.addEventListener('mouseleave', (e) => {
        e.target.style.height = '20px';
        e.target.style.width = '70px';
      });

      //set mute
      let paiId = document.getElementById('paiId');
      paiId.value = ids.join('\n');
      paiId.addEventListener('keyup', (e) => {
        localStorage.setItem('twippai_config', JSON.stringify(e.target.value.split('\n')));
      });

      let randCheck = document.body.querySelector('#rand');

      //observe elements
      (new MutationObserver((info) => {
        muting(info);
      })).observe(document.body, {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
      });
      sw = false;
    }
  }
})();
