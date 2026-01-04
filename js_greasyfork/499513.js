// ==UserScript==
// @name           Bot panel
// @name:tr        made by Həsən
// @name:az        hello
// @description    Bot Panel for gartic.io
// @description:tr Bot Panel for gartic.io (in Turkish)
// @description:az Bot Panel for gartic.io (in Azerbaijani)
// @version        1.1
// @author         57575757
// @license        MIT
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://cdn.discordapp.com/attachments/1124451069204910161/1177654466523189360/MOSHED-2023-11-24-13-55-23.jpg?ex=65734b30&is=6560d630&hm=1b42ff32759ea222cc3b1eac33cb7852209358d47e44c560b10efe0f8f230752&
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/1220697
// @downloadURL https://update.greasyfork.org/scripts/499513/Bot%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/499513/Bot%20panel.meta.js
// ==/UserScript==

let m_s, a_i, m_a, m_z, m_b;

const f = x => document.querySelector(x),
    sendMessage = (inputSelector, mesaj) => {
        a_i = document.querySelector(inputSelector);
        m_a = a_i.value;
        a_i.value = mesaj + m_a;
        m_z = new Event("input", { bubbles: !0 });
        m_z.simulated = !0;
        m_b = new Event("submit", { bubbles: !0 });
        m_b.simulated = !0;
        m_s = a_i._valueTracker;
        m_s && m_s.setValue(m_a);
        a_i.dispatchEvent(m_z);
        a_i.form.dispatchEvent(m_b);
    },
    rand = x => Math.floor(Math.random() * 1000000),
    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
    GM_sendMessage = (label, ...data) => GM_setValue(label, data);

GM_onMessage('ucur', (atılacak, _) => {
    atılacak && document.querySelectorAll(".nick").forEach(nick => {
        nick.innerText === atılacak && (nick.click(), f(".ic-votekick")?.click())
    })
});
GM_onMessage('msg', (i, w, _) => {
    sendMessage(i, w)
})
GM_onMessage('report', (_, __) => {
    let reportButton = document.evaluate('//*[@id="canvas"]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (reportButton) {
        reportButton.click();
        let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (confirmButton) {
            confirmButton.click();
        }
    }
});
GM_onMessage('exit', (_, __) => {
    let exitButton = document.evaluate('//*[@id="exit"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (exitButton) {
        setTimeout(function () {
            exitButton.click();
            let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (confirmButton) {
                confirmButton.click();
            }
        }, 0); // Delay of 1 second
    }
});

// Additional code for kicking users by WebSocket message
let thisisabigofthing = 0;

function kickUserById(userId) {
    // Implement the logic to kick the user by sending a WebSocket message
    const kickMessage = '42[45,' + window.wsId + ',[' + userId + ',true]]';
    window.wsObj.send(kickMessage);
}

function kickUserByNickname(nickname) {
    const user = window.roomusers.find(user => user.nick === nickname);
    if (user) {
        kickUserById(user.id);
    }
}

// Listen for changes in the kickle value
GM_addValueChangeListener("kickle", function(n, o, nv, r) {
    let username = nv.split("..")[0];
    usersinroom.forEach(x => {
        if (x.nick == username) {
            let userid = x.id;
            wss.forEach(ws => {
                x.nick.split("‏").join("") != "REDbot" ?
                    typeof (userid) == "string" ?
                    ws.ws.send('42[45,' + ws.id + ',["' + userid + '",true]]') :
                    ws.ws.send('42[45,' + ws.id + ',[' + userid + ',true]]') :
                    0;
            });
        }
    });
});

window.onload = function () {
    const container = document.createElement("div");
    container.style = "width:120px;height:auto;z-index:99;position:fixed;top:10px;left:10px;display:flex;flex-direction:column;align-items:center;gap:5px;background-color:#333333;border:2px solid #FFD700;border-radius:10px;padding:5px;box-shadow:5px 5px 5px rgba(0,0,0,0.5);";
    document.body.appendChild(container);

    const answerInput = createInput("100px", "20px");
    container.appendChild(answerInput);

    const answer = createButton("100px", "25px", "Cavab", () => {
        let message = answerInput.value;
        if (message) {
            GM_sendMessage('msg', 'input[name=answer]', message, rand());
        }
    });
    container.appendChild(answer);

    const chatInput = createInput("100px", "20px");
    container.appendChild(chatInput);

    const chat = createButton("100px", "25px", "Yaz", () => {
        let message = chatInput.value;
        if (message) {
            GM_sendMessage('msg', 'input[name=chat]', message, rand());
        }
    });
    container.appendChild(chat);

    const exit = createButton("100px", "25px", "Çıx", () => {
        GM_sendMessage('exit', rand(), rand());
    });
    container.appendChild(exit);

    const report = createButton("100px", "25px", "Şikayət", () => {
        GM_sendMessage('report', rand(), rand());
    });
    container.appendChild(report);

    const kickInput = createInput("100px", "20px");
    container.appendChild(kickInput);

    const kick = createButton("100px", "25px", "Götünü sik", () => {
        let user = kickInput.value;
        if (user) {
            GM_sendMessage('ucur', user, rand());
        }
    });
    container.appendChild(kick);

    const broadcastInput = createInput("100px", "20px");
    container.appendChild(broadcastInput);

    const broadcast = createButton("100px", "25px", "Oda", () => {
        let message = broadcastInput.value;
        if (message) {
            GM_sendMessage('msg', 'input[name=answer]', message, rand());
            GM_sendMessage('msg', 'input[name=chat]', message, rand());
        }
    });
    container.appendChild(broadcast);

    const roomConsole = document.createElement("div");
    roomConsole.style = "color:#FFD700;margin-top:5px;";
    container.appendChild(roomConsole);

    let currentGarticRoom;

    // Function to check if the current page is a gartic.io room
    function getGarticRoom() {
        let garticRegex = /gartic\.io\/(.+)$/;
        let match = window.location.href.match(garticRegex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    // Function to update the current gartic.io room
    function updateCurrentRoom() {
        let room = getGarticRoom();
        if (room !== currentGarticRoom) {
            currentGarticRoom = room;
            roomConsole.innerText = `Hazırki otağ: ${currentGarticRoom || 'Otağ tapılmadı'}`;
        }
    }

    // Update the room initially
    updateCurrentRoom();

    // Check for room changes every 5 seconds
    setInterval(updateCurrentRoom, 5000);
};

function createInput(width, height) {
    const input = document.createElement("input");
    input.style = `width:${width};height:${height};border-radius:5px;padding:5px;border:1px solid #FFD700;background-color:#333333;color:#FFD700;`;
    return input;
}

function createButton(width, height, text, clickHandler) {
    const button = document.createElement("button");
    button.style = `width:${width};height:${height};background-color:red;color:black;border-radius:5px;border:1px solid black;margin-top:5px;`;
    button.textContent = text;
    button.addEventListener("mousedown", clickHandler);
    return button;
}