// ==UserScript==
// @name        Arras.io Chat
// @match	    *://arras.io/#*
// @match       *://arras.netlify.app/#*
// @match       *://arrax.io/#*
// @match       *://arras.cx/#*
// @match	    *://arras.io/
// @match       *://arras.netlify.app/
// @match       *://arrax.io/
// @match       *://arras.cx/
// @author      Inellok
// @description Use Right Shift button to enable/disable chat
// @namespace   Inellok Labs.
// @version     2.4
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457877/Arrasio%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/457877/Arrasio%20Chat.meta.js
// ==/UserScript==

const chat_fontSize = "2.1vmin";

function getServerFromLoc()
{
    let rlockhash = "";
    let started = false;
    for (let i = 0; i < window.location.href.length; i++) {
        if (window.location.href[i] === '#') {
            started = true;
            continue
        }
        if (started) {
            rlockhash += window.location.href[i];
        }
    }
    return rlockhash;
}


function getName()
{
    let rname = "unnamed";
	let item = window.localStorage.getItem("arras.io");

	if (item != null) {
		rname = JSON.parse(window.localStorage.getItem("arras.io")).name;
	}
    return rname;
}


function sendEverything() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://arrasio-chat.glitch.me/");

    //We need this to send http requests from arras.io page to the server with other URL
    xhr.setRequestHeader("Accept", "plain/text");
    xhr.setRequestHeader("Content-Type", "plain/text");
    //------

    //when we got server's response
    xhr.onreadystatechange = function() {
        let srv = getServerFromLoc();
        if (xhr.readyState === 4) {
            chat_container.innerText = "";
            let msgs = JSON.parse(xhr.responseText);
            for (let i = 0; i < msgs.length; ++i) {
                if (srv === msgs[i].srv) {
                    let nick = document.createElement("font");
                    nick.color = "yellow";
                    nick.innerText = msgs[i].nick + ": ";
                    chat_container.appendChild(nick);

                    let msg = document.createElement("font");
                    msg.color = "red";
                    msg.innerText = msgs[i].message;
                    chat_container.appendChild(msg);

                    msg.style.fontSize = chat_fontSize;
                    nick.style.fontSize = chat_fontSize;

                    chat_container.appendChild(document.createElement("br"));
                }
            }
        }
    };

    xhr.send(JSON.stringify({
        srv: getServerFromLoc(),
        nick: getName(),
        message: msg_container.value
    }));
}

//We need this to draw chat over arras drawing canvas
let game = document.getElementById("game");
game.style.zIndex = 1;
game.style.position = "absolute";


let lockhash = "";


let info_container = document.createElement("div");
info_container.innerText = "Arras.io Chat (by Inellok)";
info_container.style.marginLeft = "40%";
info_container.style.color = "white";
info_container.style.opacity = "1";
info_container.style.fontSize = "150%";


let chat_container = document.createElement("div");
chat_container.style.marginLeft = "2%";
chat_container.style.color = "red";
chat_container.style.opacity = "1";
chat_container.style.height = "88%";
chat_container.fontSize = "100%";

let msg_container = document.createElement("input");

msg_container.placeholder = "message";
msg_container.style.marginLeft = "2%";
msg_container.style.color = "black";
msg_container.style.opacity = "1";
msg_container.style.height = "5%";
msg_container.style.width = "65%";
msg_container.style.fontSize = "140%";


let send_container = document.createElement("button");

send_container.innerText = "SEND / UPDATE";
send_container.style.marginLeft = "2%";
send_container.style.color = "black";
send_container.style.opacity = "1";
send_container.style.height = "5%";
send_container.style.width = "21%";
send_container.style.fontSize = "120%";

send_container.onclick = function() {
    sendEverything();
    msg_container.value = "";
    return false;
	}

let mainContainer = document.createElement("div");
mainContainer.style = `
    width:50%;
    height:85%;
    background:#000000;
    opacity: 90%;
    margin: auto;
    visibility:hidden;
    z-index:2;
    position:absolute;
    margin-left: 20%`;

//this triggered when we focused on our chat
msg_container.addEventListener("keydown", (e) => {
    //We need this to not move our character while writing message
    e.stopPropagation();
    if (e.code === "Enter" && document.activeElement === msg_container) {
        sendEverything();
        msg_container.value = "";
    }

    if (e.code === "ShiftRight") {
        if (mainContainer.style.visibility === "hidden") {
            mainContainer.style.visibility = "visible";
        } else {
            mainContainer.style.visibility = "hidden";
        }
		}
});

//this triggered when we focused on nothing
window.addEventListener("keydown", (e) => {
    //show/hide our chat when press right shift
    if (e.code === "ShiftRight") {
        if (mainContainer.style.visibility === "hidden") {
            mainContainer.style.visibility = "visible";
        } else {
            mainContainer.style.visibility = "hidden";
        }
    }


});

//this triggered when we focused on arras canvas
game.contentWindow.addEventListener("keydown", (e) => {

    //show/hide our chat when press right shift
    if (e.code === "ShiftRight") {
        if (mainContainer.style.visibility === "hidden") {
            mainContainer.style.visibility = "visible";
        } else {
            mainContainer.style.visibility = "hidden";
        }
    }


});

mainContainer.appendChild(info_container);
mainContainer.appendChild(chat_container);
mainContainer.appendChild(msg_container);
mainContainer.appendChild(send_container);
document.body.appendChild(mainContainer);