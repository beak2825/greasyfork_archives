// ==UserScript==
// @name         Twiskey
// @namespace    https://github.com/ZOI-dayo
// @version      1.2
// @description  Twitterの投稿画面にMisskeyへの同時投稿機能を追加します。
// @author       ZOI_dayo
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.0/dist/browser-image-compression.js
// @downloadURL https://update.greasyfork.org/scripts/463292/Twiskey.user.js
// @updateURL https://update.greasyfork.org/scripts/463292/Twiskey.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let interval = setInterval(()=>{
    const toolbar = document.querySelector('div[data-testid="toolBar"]')
    if(toolbar == null) return;
    if(toolbar.getAttribute("twiskey_ispached") !== null) return;

    toolbar.setAttribute("twiskey_ispached", "true")

    let misskey_button = document.createElement("span");

    misskey_button.style.display = "flex";
    misskey_button.style.justifyContent = "center";
    misskey_button.style.alignItems = "center";
    misskey_button.style.aspectRatio = "1";
    misskey_button.style.height = "25px";
    misskey_button.style.marginTop = "12px";
    misskey_button.style.position = "relative";

    let misskey_enabled = false;

    toolbar.children[0].after(misskey_button)

    GM_addElement(misskey_button , 'img', {
      src: 'https://raw.githubusercontent.com/misskey-dev/assets/main/icon.png',
      height: '100%'
    });
    misskey_button.querySelector("img").style.filter = "grayscale(100%) opacity(25%)"

    {
      const twitter_username = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]').href.substr(20)

      const api_key_box = document.createElement("div");
      {
        api_key_box.style.backgroundColor = "rgb(25, 35, 32)"
        api_key_box.style.width = "300px"
        // api_key_box.style.height = "50px"
        api_key_box.style.position = "absolute"
        api_key_box.style.bottom = "calc(100% + 10px)"
        api_key_box.style.padding = "10px"
        api_key_box.style.borderRadius = "10px"
        api_key_box.style.color = "white"
        // api_key_box.style.filter = "drop-shadow(0 0 5px rgb(60, 80, 70))"
      }
      misskey_button.appendChild(api_key_box);
      misskey_button.parentNode.parentNode.parentNode.style.zIndex = "9999"

      const misskey_server_message = document.createElement("span")
      {
        misskey_server_message.innerText = "Misskeyサーバーアドレスを入力"
      }
      api_key_box.appendChild(misskey_server_message)
      const misskey_server_input = document.createElement("input")
      {
        misskey_server_input.style.width = "80%"
        misskey_server_input.style.display = "block"
        misskey_server_input.style.margin = "0 auto"
        misskey_server_input.setAttribute("type", "text");
        misskey_server_input.value = GM_getValue(`misskey_server_${twitter_username}`, null)
        misskey_server_input.style.border = "none"
        misskey_server_input.style.backgroundColor = "rgb(125, 175, 160)"
        misskey_server_input.placeholder = "misskey.io"
      }
      api_key_box.appendChild(misskey_server_input)


      const misskey_token_message = document.createElement("span")
      {
        misskey_token_message.innerText = "Misskeyトークンを入力"
      }
      api_key_box.appendChild(misskey_token_message)
      const misskey_token_input = document.createElement("input")
      {
        misskey_token_input.style.width = "80%"
        misskey_token_input.style.display = "block"
        misskey_token_input.style.margin = "0 auto"
        misskey_token_input.setAttribute("type", "text");
        misskey_token_input.value = GM_getValue(`misskey_api_key_${twitter_username}`, null)
        misskey_token_input.style.border = "none"
        misskey_token_input.style.backgroundColor = "rgb(125, 175, 160)"
        misskey_token_input.placeholder = "*******"
        misskey_token_input.type = "password"
      }
      api_key_box.appendChild(misskey_token_input)

      const misskey_data_submit_button = document.createElement("button")
      {
        misskey_data_submit_button.innerText = "保存"
        misskey_data_submit_button.onclick = () => {
          GM_setValue(`misskey_server_${twitter_username}`, misskey_server_input.value == "" ? null : misskey_server_input.value)
          GM_setValue(`misskey_api_key_${twitter_username}`, misskey_token_input.value == "" ? null : misskey_token_input.value)
          misskey_button.querySelector("div").style.display = "none"
        }
        misskey_data_submit_button.style.border = "none"
        misskey_data_submit_button.style.backgroundColor = "rgb(125, 175, 160)"
        misskey_data_submit_button.style.display = "block"
        misskey_data_submit_button.style.margin = "10px auto 0"
        misskey_data_submit_button.style.padding = "5px 10px"
        misskey_data_submit_button.style.borderRadius = "5px"
      }
      api_key_box.appendChild(misskey_data_submit_button)
      api_key_box.style.display = "none"
    }

    misskey_button.addEventListener('contextmenu', e => {
        e.preventDefault()

        const api_key_box = misskey_button.querySelector("div")
        api_key_box.style.display = ""
    })

    misskey_button.querySelector("img").addEventListener('click', () => {
      misskey_enabled = !misskey_enabled;
      misskey_button.querySelector("img").style.filter = `grayscale(${misskey_enabled ? "0%" : "100%"}) opacity(${misskey_enabled ? "100%" : "25%"})`
      if(misskey_enabled) {
        const twitter_username = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]').href.substr(20)
        if(GM_getValue(`misskey_server_${twitter_username}`, null) == null || GM_getValue(`misskey_api_key_${twitter_username}`, null) == null) {
          misskey_button.querySelector("div").style.display = "block"
        }
      } else {
        misskey_button.querySelector("div").style.display = "none"
      }
    })

    Array.from(toolbar.children).slice(-1)[0].addEventListener('click', async e => {
      if(!misskey_enabled) return;


      const twitter_username = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]').href.substr(20);
      console.log(twitter_username);

      const misskey_server = GM_getValue(`misskey_server_${twitter_username}`, null);
      if(misskey_server == null) {
        console.error("Please set misskey server URL.")
        return;
      }
      const misskey_api_key = GM_getValue(`misskey_api_key_${twitter_username}`, null);
      if(misskey_api_key == null) {
        console.error("Please set misskey API key.")
        return;
      }

      const content = document.querySelector('.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr').innerText
      if(content == "") return;

      const text = document.querySelector('div[data-testid="tweetTextarea_0"]').innerText

      const media = Array.from(document.querySelectorAll('div[data-testid="attachments"] > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > img')).map(e => e.src)

      function urlToBlob(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
              resolve(response.response)
            },
            onerror: function(error) {
              reject(error);
            },
            responseType: "blob"
          });
        });
      }
      let media_ids = []
      for(let m of media) {
        console.log(m);
        var params = new FormData();
        params.append("i", misskey_api_key);
        const file = await urlToBlob(m)
        params.append("file", file);

        const misskey_image_req = await new Promise((resolve, _) => {
          GM_xmlhttpRequest({
            method: "POST",
            url: `https://${misskey_server}/api/drive/files/create`,
            data: params,
            onload: function(response) {
              media_ids.push(JSON.parse(response.responseText)["id"])
              console.log(response.responseText);
              resolve();
            }
          });
        });
      }

      console.log(misskey_api_key)
      GM_xmlhttpRequest({
        method: "POST",
        url: `https://${misskey_server}/api/notes/create`,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          "i": misskey_api_key,
          "text": text,
          "fileIds": media_ids.length > 0 ? media_ids : undefined,
        }),
        onload: function(response) {
          console.log(response.responseText);
        }
      });
    });
    // clearInterval(interval)
  }, 100);
})();
