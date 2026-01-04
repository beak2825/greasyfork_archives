// ==UserScript==
// @name         Ucur JoJe v1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bot control panel with avatar selection popup
// @author       Qwyua
// @match        *://gartic.io/*
// @match        *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @match        *://*/*?*&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @grant        GM_addStyle
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/519303/Ucur%20JoJe%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/519303/Ucur%20JoJe%20v1.meta.js
// ==/UserScript==

const observeElements=(e,t)=>{new MutationObserver(o=>{o.forEach(o=>{"childList"===o.type&&Array.from(o.addedNodes).filter(t=>t.matches&&t.matches(e)).forEach(e=>t(e))})}).observe(document.documentElement,{childList:!0,subtree:!0})|Array.from(document.querySelectorAll(e)).forEach(e=>t(e))},
      observeElements2=(s,c)=>new MutationObserver((_,o)=>{const e=document.querySelector(s);if(e)c(e)|o.disconnect();}).observe(document.body,{childList:!0,subtree:!0}),
      GM_onMessage=(e,s)=>GM_addValueChangeListener(e,(e,a,t)=>s(...t)),
      GM_sendMessage=(e,...s)=>GM_setValue(e,s),
      shiftAmount = 20060,
      rand = x => Math.floor(Math.random() * 1000) + 1,
      mymessage = '亄些乽亷人亽争他亝争亶亹亇亅亄些亖亝亄些亖亄些亖仐亄些亖亽亄些亖亄些亖仐亷仑佘亹从仇亅付亄些亖从亷仇仇亹亅亅亅付亄些亖亄些亖仈亄些亖亄些亖仈亄些亖亽仄亅些亅付亄些亖仈亽仄亅亅亅付亄些亖仐亄些亖亽亅亅亅亅付仈亄些亖仈亄些亖亽仄亅些亅付亄些亖仐亄些亖从亷仇仇亹亅亅付仏亷仅侍亹仇付亮亡亠亾介仐亅付仅亷仈侍亹亽仄付仏亷仅侍亹仇付亽亷仈侍亹亽仄付亮亡亠亾介仐亅',
      shifter=(t,e)=>{let r="";for(let o=0;o<t.length;o++){let h=t[o],l=h.charCodeAt(0),f=(l+e)%65536;r+=String.fromCharCode(f)}return r};






const proxylist = [
    {"id":"43","ip":"108.181.21.229"},{"id":"44","ip":"108.181.33.135"},{"id":"45","ip":"108.181.33.117"},{"id":"46","ip":"108.181.33.119"},{"id":"47","ip":"108.181.34.57"},{"id":"48","ip":"108.181.34.71"},{"id":"49","ip":"108.181.30.85"},{"id":"50","ip":"108.181.34.149"},{"id":"51","ip":"108.181.32.49"},{"id":"52","ip":"108.181.32.73"},{"id":"53","ip":"108.181.32.55"},{"id":"54","ip":"108.181.32.61"},{"id":"56","ip":"108.181.32.59"},{"id":"63","ip":"108.181.43.67"},{"id":"64","ip":"108.181.34.45"},{"id":"68","ip":"108.181.24.243"},{"id":"69","ip":"108.181.34.177"},{"id":"92","ip":"108.181.34.157"},{"id":"144","ip":"195.3.223.166"},{"id":"145","ip":"195.3.223.164"},{"id":"146","ip":"146.19.24.89"},{"id":"149","ip":"195.3.222.15"},{"id":"150","ip":"185.16.39.161"},{"id":"154","ip":"95.214.53.145"},{"id":"157","ip":"95.214.53.152"},{"id":"161","ip":"108.181.8.179"},{"id":"162","ip":"108.181.9.39"},{"id":"163","ip":"108.181.11.39"},{"id":"164","ip":"108.181.6.89"},{"id":"172","ip":"208.87.240.203"},{"id":"173","ip":"208.87.240.219"},{"id":"174","ip":"208.87.240.251"},{"id":"176","ip":"208.87.241.149"},{"id":"177","ip":"108.181.4.237"},{"id":"175","ip":"108.181.4.237"},{"id":"178","ip":"208.87.241.209"},{"id":"179","ip":"108.181.4.241"},{"id":"181","ip":"208.87.240.35"},{"id":"182","ip":"108.181.5.29"},{"id":"180","ip":"208.87.242.233"},{"id":"183","ip":"208.87.242.233"},{"id":"184","ip":"208.87.240.67"},{"id":"185","ip":"95.214.53.48"},{"id":"186","ip":"195.3.222.40"},{"id":"187","ip":"185.225.191.49"},{"id":"189","ip":"185.225.191.57"},{"id":"198","ip":"108.181.11.173"},{"id":"199","ip":"108.181.11.193"},{"id":"200","ip":"108.181.11.137"},{"id":"201","ip":"108.181.11.171"},{"id":"202","ip":"108.181.11.175"},{"id":"203","ip":"185.16.39.144"},{"id":"204","ip":"185.16.39.213"},{"id":"205","ip":"178.211.139.238"},{"id":"216","ip":"185.246.84.18"},{"id":"219","ip":"185.246.84.66"}
]


location.href.includes('/?__c') && (location.href = location.href.replace("?", "server?bot-test&"));

if (location.href.includes('r?bot-test&_')) {
    GM_onMessage("checkproxy", _ => {
        console.log("asd");
        GM_sendMessage(location.origin.split("/")[2], "checkproxy", null, rand());
    });
    GM_onMessage(location.origin.split("/")[2], (task, data, _) => {
        if (task === "createBot") {
            fetch(`https://${location.origin.split("/")[2]}/server?check=1&v3=1&room=${data.roomcode}&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8`)
                .then(response => response.text())
                .then(serverUrl => {
                    const [server, c] = serverUrl.match(/\/\/(.+)\?(.+)/).slice(1);
                    const wsUrl = `wss://${server}/socket.io/?${c}&EIO=3&transport=websocket`;
                    const wsocket = new WebSocket(`wss://${location.origin.split("/")[2]}/__cpw.php?u=${btoa(wsUrl)}&o=aHR0cHM6Ly9nYXJ0aWMuaW8=`);
                    wsocket.onopen = () => wsocket.send(`42[3,{"v":20000,"nick":"${data.nickname+rand()}","avatar":${data.avatar},"platform":0,"sala":"${data.roomcode.slice(2)}"}]`);
                // buradan son wsocket.onmessage ile mesajlar işlenip anti afk / bot çıkar / mesaj gönder gibi
                // işlevler kazandırılmalı

});
        }
    });
}




location.href.includes('.io/bot') && (()=>{
    var stopsendCheckproxy=0
    !stopsendCheckproxy && (GM_sendMessage("checkproxy", rand()), stopsendCheckproxy = 1);
    observeElements2("#__next", el => el.remove());


    GM_addStyle(`
  body {
    background: url('https://c4.wallpaperflare.com/wallpaper/510/823/801/colorful-red-blue-pink-wallpaper-preview.jpg') center/cover no-repeat;
    margin: 0; padding: 0; font-family: Arial, sans-serif;
  }
  #panel-wrapper {
    position: fixed; inset: 0; display: flex;
    justify-content: center; align-items: flex-start; padding-top: 20px;
  }
  #bot-panel {
    background: rgba(0, 0, 0, 0.7); color: #fff; border-radius: 10px;
    padding: 20px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    animation: fadeIn 1s; overflow: hidden;
  }
  #bot-profile {
    display: flex; align-items: center; gap: 20px; margin-bottom: 20px;
  }
  #bot-profile input {
    flex: 1; min-width: 50px;
    padding: 10px; border-radius: 5px; border: none; background: #222; color: #fff;
  }
  .avatar-frame {
    width: 60px; height: 60px; border: 1.5px solid #fff;
    border-radius: 50%; background-size: cover; background-position: center; cursor: pointer;
  }
  #bot-count-container {
    display: flex; justify-content: center; gap: 10px; margin-top: -10px;
  }
  #bot-count {
    text-align: center; font-weight: bold; font-size: 17px; font-family: 'Arial Black';
    padding: 6px; border: 2px solid #333; border-radius: 6px; background: #f0f0f0;
    color: #333; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100px;
  }
  button {
    background: #444; color: #fff; border: none;
    padding: 10px; border-radius: 5px; cursor: pointer;
  }
  button:hover { background: #555; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @media (max-width: 768px) {
    #bot-panel { width: 90%; padding: 15px; }
    #bot-profile { align-items: flex-start; }
    .avatar-frame { width: 50px; height: 50px; }
    #avatar-popup { width: 95%; padding: 15px; }
  }

  #button-container {
    display: flex; flex-direction: column; gap: 10px; margin-top: 20px;
  }
  .button {
    padding: 10px 20px; border: none; border-radius: 5px;
    font-size: 16px; cursor: pointer; transition: background-color 0.6s, opacity 0.6s;
  }
  #botsend-button { background-color: #007bff; color: #fff; }
  #botexit-button { background-color: #dc3545; color: #fff; }
  .button.disable {
    opacity: 0.5; pointer-events: none;
  }

  .button.enable {
    opacity: 1; pointer-events: auto;
  }

  .bot-checkbox-wrapper {
    display: flex; flex-direction: column; margin-top: 15px;
  }
  .bot-checkbox {
    position: relative; padding-left: 30px; margin-bottom: 10px;
    cursor: pointer; font-size: 18px; user-select: none;
  }
  .bot-checkbox input {
    position: absolute; opacity: 0; cursor: pointer;
  }
  .checkmark {
    position: absolute; top: 0; left: 0; height: 20px; width: 20px;
    background-color: #eee; border-radius: 4px;
  }
  .bot-checkbox:hover .checkmark { background-color: #ccc; }
  .bot-checkbox input:checked ~ .checkmark { background-color: #2196F3; }
  .checkmark:after {
    content: ""; position: absolute; display: none;
  }
  .bot-checkbox input:checked ~ .checkmark:after {
    display: block; left: 6px; top: 2px; width: 5px; height: 10px;
    border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg);
  }
  .bot-checkbox input[type="checkbox"]:disabled + .checkmark {
    background-color: #A9A9A9; border-color: #808080;
    opacity: 0.6; cursor: not-allowed;
  }
  .bot-checkbox input[type="checkbox"]:disabled + .checkmark:after {
    border-color: #666666;
  }



#popUp {
    background-color: rgba(1, 22, 46, .68);
    width: 100%;
    height: 100%;
    display:none;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 100;
}



.button-icons {
  justify-content: flex-end;
  gap: 5px;
}




#copy-random, #upload-random, #reset-random,
#copy-spaces, #upload-spaces, #reset-spaces,
#copy-nicks, #upload-nicks, #reset-nicks {
  font-size: 1.2em;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}







#botnick-popup,#avatar-popup,#proxylist-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(18, 34, 50, 0.9);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    overflow-y: auto;
    max-height: 80vh;
    width: 95%;
    max-width: 530px;
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #28a745 rgba(18, 34, 50, 0.5);
}


#proxylist-popup .bot-checkbox-wrapper {
    display: grid;
    overflow-y: auto;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin: 0px 0px 10px 10px;
}


#proxylist-popup .bot-checkbox {
    position: relative;
    padding-left: 30px;
    margin: 0;
    cursor: pointer;
    font-size: 16px;
}

.bot-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
}


.avatar-options-container {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin: 10px;
    gap: 5px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
}

.avatar-option {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-size: cover;
    background-position: center;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
}

.nick-options-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 15px;
    max-height: calc(80vh - 80px);
    overflow-y: auto;
    padding: 10px 0;
}


#top-popUp-info {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 15px;
}

#top-popUp-info h1 {
    margin-top: -10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

#close-popup {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    background-color: #ff5e57;
    border: none;
    font-size: 1.5em;
    padding: 5px;
    transition: background-color 0.3s, transform 0.3s;
    margin-left: auto;
    transition: all 200ms;
    transform: rotate(90deg);
}

#close-popup:hover {
  background-color: #ff1e1a;

}


.randomNumber-container, .spaces-container, .mynicks-container {
    background-color: #122;
    padding: 15px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
    border-radius: 10px;
    transition: border 0.3s, transform 0.3s;
    border: 2px solid transparent;
}

textarea {
    width: 40%;
    background-color: #001f3f;
    color: #00ff00;
    border: none;
    min-height: 110px;
    margin-bottom: 10px;
    height: auto;
    resize: vertical;
    padding: 10px;
}

.botnick-button {
    border: none;
    background-color: #0055a5;
    color: white;
    padding: 8px;
    font-size: 1.2em;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.botnick-button:hover {
  background-color: #003773;
}
.container-content {
    display: flex;
    gap: 15px;
    justify-content: space-between;
    align-items: flex-start;
}

.info {
    width: 50%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: #fff;
}

.randomNumber-container.selected, .spaces-container.selected, .mynicks-container.selected {
    border: 5px solid #0cba00;
    background: #203838;
}


.randomNumber-container:hover, .spaces-container:hover, .mynicks-container:hover {
    transform: scale(1.03);
    border-color: #4caf50;
}

#openproxy {
    border: 2px solid #5f854a;
    color: #fff;
    background-color: #82ac6a;
    background-image: linear-gradient(to bottom, #82ac6a 0%, #648b4d 100%);
    height: 38px;
    padding: 8px 14px;
    font-size: 18px;
    line-height: 1.3333333;
    border-radius: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

#openproxy:hover {
    border-color: #55834b;
    background-color: #769f5d;
    background-image: linear-gradient(to bottom, #769f5d 0%, #5c7c44 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

#openproxy:active {
    transform: scale(0.98);
    background-color: #6d8f55;
    background-image: linear-gradient(to bottom, #6d8f55 0%, #516d3c 100%);
    border-color: #506e42;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}




#url-profile {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

#url-profile .input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 10px;
}

#url-profile input[type="text"] {
width: 95%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #444;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s ease-in-out;
    background-color: #122;
    color: white;
    text-align: center;
    margin: -8px;
}

#url-profile input[type="text"]:focus {
  border-color: #009688;
  box-shadow: 0 0 8px rgba(0, 150, 136, 0.8);
}

#url-profile input[type="text"].error {
  border-color: red;
  animation: shake 0.3s;
}

#url-profile input[type="text"].warning {
  border-color: orange;
}

#url-profile input[type="text"].success {
  border-color: green;
}

#url-span {
  font-size: 16px;
  color: #00cc66;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-align: left;  /* Sol'a yaslamak için */
  display: block;
  width: 100%;  /* Span'ın tam genişlik kaplaması için */
}

#url-span:hover {
  border-color: #00cc66;
}



input#bot-nick.error {
  border-color: red;
  border: 2px solid red;
  animation: shake 0.3s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}



`);


    document.body.innerHTML = `
  <div id="panel-wrapper">
      <div id="bot-panel">
        <center><h2>Uçur JoJe v1</h2></center>
        <br>

<div id="url-profile">
  <div class="input-container">
    <input type="text" id="url-input" placeholder="Enter Gartic URL" />
    <span id="url-span" style="display:none;"></span>
    <div class="error-message" id="error-message"></div>
  </div>
</div>


        <div id="bot-profile">
          <div id="settings-avatar" class="avatar-frame"></div>
          <input type="text" maxlength="14" id="bot-nick" placeholder="Enter nickname">
          <div class="error-message" id="bot-nick-error"></div>
          <button id="settings-botnick" style="display:none;background-color: rgb(116, 153, 241,0);margin-left:-80px;
          width:50px;height:50px;
            text-align: center; font-weight: bold; font-size: 17px; font-family: 'Arial Black';
            padding: 6px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <svg style="height:18px;width:18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248zM262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"/>            </svg>
          </button>
        </div>
        <div id="bot-count-container">
        <div>
          <button id="decrease-count">-</button>
          <input type="number" id="bot-count" value="0" min="0" max="0">
          <button id="increase-count">+</button>
          </div>
          <button id="settings-count" style="background-color: hsl(120, 100%, 75%);
            text-align: center; font-weight: bold; font-size: 17px; font-family: 'Arial Black';
            padding: 6px; border: 2px solid #333; border-radius: 6px; color: #333;">
            <svg style="height:18px;width:18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
            </svg>
          </button>
        </div>

        <div class="bot-checkbox-wrapper" style="display:none">
          <label class="bot-checkbox">Iframe Mode
            <input type="checkbox" checked>
            <span class="checkmark"></span>
          </label>
          <label class="bot-checkbox">Auto-join
            <input type="checkbox" disabled>
            <span class="checkmark"></span>
          </label>
        </div>

        <div id="button-container">
          <button id="botsend-button" class="button enable">BOT GÖNDER</button>
          <button id="botexit-button" class="button disable">BOT ÇIKAR</button>
        </div>
      </div>
    </div>

    <div id="popUp" class="qpopUp-avatar">
    <div id="avatar-popup">
<div id="top-popUp-info">
  <button id="close-popup">×</button>
  <center><h1>Bot Avatar</h1></center>
</div>
      <div class="avatar-options-container"></div>
    </div>
    </div>

<div id="popUp" class="qpopUp-count">
<div id="proxylist-popup">
<div id="top-popUp-info">
  <button id="close-popup">×</button>
  <center><h1>Proxy List</h1></center>
</div>
  <div class="bot-checkbox-wrapper">
  </div>
  <div id="bt-openproxy">
  <center>
  <button id="openproxy">
    <svg style="display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em;" class="svg-inline--fa fa-arrow-right fa-w-14" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
     Open Proxy!</button>
    </center>
  </div>
</div>
</div>

<div id="popUp" class="qpopUp-botnick">
<div id="botnick-popup">
<div id="top-popUp-info">
  <button id="close-popup">×</button>
  <center><h1>Bot Nick</h1></center>
</div>
  <div class="nick-options-container">
    <div class="randomNumber-container" id="random-container">
      <div class="container-content">
        <textarea id="random-json">{"7744","2451","2034"}</textarea>
        <div id="randomNumber-info-container" class="info"><h2>Random Number Info</h2><p>Buraya bilgi yazacağız</p></div>
      </div>
      <div class="button-icons">
        <button id="copy-random" class="botnick-button">📋</button>
        <button id="upload-random" class="botnick-button">📁</button>
        <button id="reset-random" class="botnick-button">🔄</button>
      </div>
    </div>

    <div class="spaces-container" id="spaces-container">
      <div class="container-content">
        <textarea id="spaces-json">{"U+200B":"","U+200C":"","U+200E":""}</textarea>
        <div id="spaces-info-container" class="info"><h2>Spaces Info</h2><p>Buraya bilgi yazacağız</p></div>
      </div>
      <div class="button-icons">
        <button id="copy-spaces" class="botnick-button">📋</button>
        <button id="upload-spaces" class="botnick-button">📁</button>
        <button id="reset-spaces" class="botnick-button">🔄</button>
      </div>
    </div>

    <div class="mynicks-container" id="mynicks-container">
      <div class="container-content">
        <textarea id="nicks-json">{"Ali","Ayse","Fatma"}</textarea>
        <div id="mynicks-info-container" class="info"><h2>Mynicks Info</h2><p>Buraya bilgi yazacağız</p></div>
      </div>
      <div class="button-icons">
        <button id="copy-nicks" class="botnick-button">📋</button>
        <button id="upload-nicks" class="botnick-button">📁</button>
        <button id="reset-nicks" class="botnick-button">🔄</button>
      </div>
    </div>
  </div>
</div>
</div>



`;
const sB = document.getElementById('botsend-button'), eB = document.getElementById('botexit-button');

sB.addEventListener('click', () => {
    if (sB.classList.contains('disable')) return;
    sB.classList.toggle('enable', false);
    sB.classList.add('disable');

    const bg = document.querySelector("#settings-avatar").style.backgroundImage,
          nc = getComputedStyle(document.querySelector("#bot-nick"))?.borderColor === 'rgb(255, 0, 0)' ? null : document.querySelector("#bot-nick").value;

    if (!nc) return;

    const data = {
        roomcode: document.getElementById('url-span').textContent.split('/')[3],
        nickname: nc,
        avatar: bg && bg !== 'url("null")' ? bg.split('/').pop().split('.')[0] : null
    };

    GM_setValue('sonBotDatasi', data);
    getAllCheckboxesWithClasses()
        .filter(({ class: c }) => c === 'checked-disabled')
        .forEach(x => GM_sendMessage(x.ip, "createBot", data, rand()));

    setTimeout(() => eB.classList.remove('disable'), 1200);
});


eB.addEventListener('click', () => {
    if (eB.classList.contains('disable')) return;
    eB.classList.toggle('disable', true);
    setTimeout(() => sB.classList.toggle('disable', false), 1200);
});






const ac = document.querySelector('.avatar-options-container');
Array.from({ length: 37 }, (_, i) => ac.innerHTML += `<div class="avatar-option" id="${i}-avatar" data-avatar="/static/images/avatar/svg/${i}.svg" style="background-image:url('/static/images/avatar/svg/${i}.svg');"></div>`);
ac.innerHTML = `<div class="avatar-option" id="null-avatar" data-avatar="null" style="background-image:url(null);"></div><div class="avatar-option" id="random-avatar" data-avatar="https://cdn-icons-png.flaticon.com/512/1804/1804046.png" style="background-image:url('https://cdn-icons-png.flaticon.com/512/1804/1804046.png');"></div>` + ac.innerHTML;




    const botCountInput = document.getElementById('bot-count');
    ['increase', 'decrease'].forEach(action =>
         document.getElementById(`${action}-count`).onclick = () =>
         botCountInput.value = Math.max(botCountInput.min, Math.min(botCountInput.max, +botCountInput.value + (action === 'increase' ? 1 : -1)))
                                    );
    botCountInput.oninput = () => botCountInput.value = Math.min(botCountInput.value, botCountInput.max);



    const originalContent = {
        'random-json': '{"7744","2451","2034"}',
        'spaces-json': '{"U+200B":"","U+200C":"","U+200E":""}',
        'nicks-json': '{"Ali","Ayse","Fatma"}'
    };



    ['random', 'spaces', 'nicks'].forEach(k =>
      ['copy', 'upload', 'reset'].forEach(action =>
       observeElements2(`#${action}-${k}`, btn => btn.onclick = () => ({
        copy: () => navigator.clipboard.writeText(document.getElementById(`${k}-json`).value),
        upload: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                file.text().then(txt => document.getElementById(`${k}-json`).value = txt);
            };
            input.click();
        },
        reset: () => document.getElementById(`${k}-json`).value = originalContent[`${k}-json`]
    })[action]())
   ));



    document.querySelectorAll('.randomNumber-container, .spaces-container, .mynicks-container')
        .forEach(container => container.addEventListener('click', () => {
        container.classList.toggle('selected');
        document.querySelectorAll('.selected').length || document.querySelector('.randomNumber-container').classList.add('selected');
    }));


    const proxyLimit = 100;

    const addProxies = () => {
        proxylist.forEach(({ id, ip }, index) => {
            const label = document.createElement('label');
            label.className = 'bot-checkbox';
            const disabledAttr = index >= proxyLimit ? 'disabled' : '';
            label.innerHTML = `
      ${ip}
      <input type="checkbox" id="${id}" ip="${ip}" class="${ip}" ${disabledAttr}>
      <span class="checkmark"></span>
    `;
            document.querySelector("#proxylist-popup > div.bot-checkbox-wrapper").appendChild(label);
        });
    };

    addProxies();

    const getAllCheckboxesWithClasses = () =>
    [...document.querySelectorAll("#proxylist-popup > div.bot-checkbox-wrapper input[type='checkbox']")]
    .map(checkbox => ({
        element: checkbox,
        id: checkbox.getAttribute('id'),
        ip: checkbox.getAttribute('ip'),
        class: checkbox.checked && checkbox.disabled
        ? 'checked-disabled'
        : checkbox.disabled
        ? 'disabled'
        : checkbox.checked
        ? 'checked'
        : 'unchecked-enabled'
    }));


    document.querySelector("#openproxy").onclick = () => {
        const checkboxes = getAllCheckboxesWithClasses().filter(({ class: className }) => className === "checked");
        checkboxes.forEach(({ element, id, ip, class: className }) => {
            console.log(Date.now()+`ID: ${id}, IP: ${ip}, Class: ${className}`);
            GM_openInTab(`https://www.croxyproxy.com/?ygnnext=${id}`);
        });
    };

['avatar','botnick','count'].forEach(x=>{const p=document.querySelector(`#popUp.qpopUp-${x}`);document.querySelector(`#settings-${x}`).onclick=()=>p.style.display="flex";p.querySelector("#close-popup").onclick=()=>p.style.display="none"});document.querySelectorAll('.avatar-option').forEach(o=>o.onclick=()=>{document.querySelector('#settings-avatar').style.backgroundImage=`url(${o.dataset.avatar})`;document.querySelector(`#popUp.qpopUp-avatar`).style.display='none'});


    document.querySelectorAll("#proxylist-popup input[type='checkbox']").forEach(c => {
        let proxyip = c.getAttribute('ip');
        GM_onMessage(proxyip, () => {
            console.log("asd")
            document.querySelector(`[class="${proxyip}"]`).checked = true;
            c.disabled = true;
            botCountInput.max = parseInt(botCountInput.max) + 1;
        });
    });


    const uI = document.getElementById('url-input'), uS = document.getElementById('url-span'), v = url => /^https:\/\/gartic\.io\/[a-zA-Z0-9]{4,8}$/.test(url);

    uI.addEventListener('blur', () => {
        const url = uI.value.trim();
        uI.classList.toggle('error', !url);
        uI.classList.toggle('warning', url && !v(url));
        if (v(url)) {
            uS.textContent = `Room: ${url}`;
            uI.style.display = 'none';
            uS.style.display = 'block';
        }
    });

    uS.addEventListener('click', () => (uS.style.display = 'none', uI.style.display = 'block', uI.focus()));

    document.getElementById("bot-nick").addEventListener("input", e => e.target.classList.toggle("error", new RegExp(shifter(mymessage, -shiftAmount), 'i').test(e.target.value)));




})();
