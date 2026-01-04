// ==UserScript==
// @name           Copy Message Gartic
// @description    Copy the message in Gartic
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @downloadURL https://update.greasyfork.org/scripts/508291/Copy%20Message%20Gartic.user.js
// @updateURL https://update.greasyfork.org/scripts/508291/Copy%20Message%20Gartic.meta.js
// ==/UserScript==

(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    let massHistory = [];

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                let data = JSON.parse(msg.data.slice(2));
                console.log(data);
                if (data[0] == 11) {
                    window.wsObj.mass = data[2];
                    massHistory.push(window.wsObj.mass);
                    if (massHistory.length > 3) {
                        massHistory.shift();
                    }
                }
            });
        }
    };


    function setCSS() {
        var css = `
        .cards {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        /* From Uiverse.io by alexruix */
        .card {
            --background: linear-gradient(to left, #ff0000 0%, #0008ff 100%);
            width: 190px;
            height: 254px;
            padding: 5px;
            border-radius: 1rem;
            overflow: visible;
            background: #f7ba2b;
            background: var(--background);
            position: relative;
            z-index: 1;
        }

        .card::after {
            position: absolute;
            content: "";
            top: 30px;
            left: 0;
            right: 0;
            z-index: -1;
            height: 100%;
            width: 100%;
            transform: scale(0.8);
            filter: blur(25px);
            background: #f7ba2b;
            background: var(--background);
            transition: opacity .5s;
        }

        .card-info {
            --color: #000000;
            background: var(--color);
            color: var(--color);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow: visible;
            border-radius: .7rem;
        }

        .card .title {
            font-weight: bold;
            letter-spacing: .1em;
        }

        /*Hover*/
        .card:hover::after {
            opacity: 0;
        }

        .card:hover .card-info {
            color: #f7ba2b;
            transition: color 1s;
        }


        .cards {
            display: flex;
            flex-direction: column;
            gap: 10px;
    .input-field {
  background-color: transparent;
  height: 60px;
  width: 155px;
  text-align: center;
  border: 2px solid;
  border-image: linear-gradient(to right, #ff0000, #0000ff) 1;
  color: #ffffff; /* added this line to set the text color to white */
    border-radius: 15px; /* added this line to set the border radius to 15px */
}
    `;
        GM_addStyle(css);
    }

    setCSS();

    let panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "50%";
    panel.style.right = "25px";
    panel.style.transform = "translateY(-50%)";
    panel.style.zIndex = 999999;
    document.body.appendChild(panel);

    function createHTML() {
let html = `

  <div class="card">
    <div class="card-info">
      <p class="title"></p>
      <div class="cards">
        <input type="text" value="${massHistory[2]}" id="input-0" class="input-field">
        <input type="text" value="${massHistory[2]}" id="input-1" class="input-field">
        <input type="text" value="${massHistory[2]}" id="input-2" class="input-field">
      </div>
    </div>
  </div>

`;
  panel.innerHTML = html;
}

    createHTML();

    function copyValue(value) {
        navigator.clipboard.writeText(value);
    }

   setInterval(() => {
    for (let i = 0; i < 3; i++) {
        document.getElementById(`input-${i}`).value = massHistory[i];
    }
}, 10);
})();