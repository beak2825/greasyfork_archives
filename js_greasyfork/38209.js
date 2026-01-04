// ==UserScript==
// @name         Plug.dj image upload
// @namespace    Warix3
// @version      1.1
// @description  Adds an option to upload images to the plug.dj chat.
// @author       Warix3
// @include	   https://plug.dj/*
// @include        https://*.plug.dj/*
// @exclude        https://plug.dj/_/*
// @exclude        https://plug.dj/@/*
// @exclude        https://plug.dj/ba
// @exclude        https://plug.dj/plot
// @exclude        https://plug.dj/press
// @exclude        https://plug.dj/partners
// @exclude        https://plug.dj/team
// @exclude        https://plug.dj/about
// @exclude        https://plug.dj/jobs
// @exclude        https://plug.dj/purchase
// @exclude        https://plug.dj/subscribe
// @exclude        https://*.plug.dj/_/*
// @exclude        https://*.plug.dj/@/*
// @exclude        https://*.plug.dj/ba
// @exclude        https://*.plug.dj/plot
// @exclude        https://*.plug.dj/press
// @exclude        https://*.plug.dj/partners
// @exclude        https://*.plug.dj/team
// @exclude        https://*.plug.dj/about
// @exclude        https://*.plug.dj/jobs
// @exclude        https://*.plug.dj/purchase
// @exclude        https://*.plug.dj/subscribe
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38209/Plugdj%20image%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/38209/Plugdj%20image%20upload.meta.js
// ==/UserScript==

function insertCustomCss() {
    GM_addStyle(`

.upload_button {
text-align: center;
vertical-align: middle;
line-height: 23px;
cursor: pointer;
}

.upload_button:hover {
background: #fff !important;
}

#chat-input {
width: 302px !important;
left: 38px !important;
}

#chat-input-field {
width: 290px !important;
}

.noselect {
-webkit-touch-callout: none; /* iOS Safari */
-webkit-user-select: none; /* Safari */
-khtml-user-select: none; /* Konqueror HTML */
-moz-user-select: none; /* Firefox */
-ms-user-select: none; /* Internet Explorer/Edge */
user-select: none; /* Non-prefixed version, currently
supported by Chrome and Opera */
}

.spinner {
width: 23px;
height: 23px;
position: absolute;
bottom: 13px;
left: 8px;


}

.double-bounce1, .double-bounce2 {
width: 100%;
height: 100%;
border-radius: 50%;
background-color: #eee;
opacity: 0.6;
position: absolute;
position: absolute;
top: 0;
left: 0;
-webkit-animation: sk-bounce 2.0s infinite ease-in-out;
animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
-webkit-animation-delay: -1.0s;
animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
0%, 100% { -webkit-transform: scale(0.0) }
50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
0%, 100% {
transform: scale(0.0);
-webkit-transform: scale(0.0);
} 50% {
transform: scale(1.0);
-webkit-transform: scale(1.0);
}
}

`);
}

var api_key = "8535550a004d0ff";
var request_url = "https://api.imgur.com/3/image" ;

function uploadImage(image) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {

        document.getElementById("upload_spinner").style.display = "unset";
        document.getElementById("upload_button").style.display = "none";
        if (req.readyState == 4 && req.status == 200) {


            processRequest(req.responseText);
        } else {
            console.log("Error with Imgur Request. " + req.responseText);
        }
    };
    var block = image.split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];
    var data = {image: realData};
    var FD  = new FormData();

    for(let name in data) {
        FD.append(name, data[name]);
    }

    req.open("POST", request_url, true); 
    req.setRequestHeader("Authorization", "Client-ID " + api_key);
    req.send(FD);
}

function processRequest(response_text) {
    if (response_text == "Not found") {
        console.log("Imgur album not found.");
    } else {
        var json = JSON.parse(response_text);
        var link = json.data.link;
        API.sendChat(link);
        console.log(link);
    }
    document.getElementById("upload_spinner").style.display = "none";
    document.getElementById("upload_button").style.display = "block";
}

function changePlugCss() {
    var inputbox = document.getElementById("chat-input");
    inputbox.style.width = "300px";
    inputbox.style.left = "38px";
}

function addUploadButton() {
    var container = document.getElementById("chat");
    var button = document.createElement("div");
    button.innerText = "+";
    button.style.color = "#282c35";
    button.style.background = "gray";
    button.style.borderRadius = "50%";
    button.style.width = "23px";
    button.style.position = "absolute";
    button.style.bottom = "13px";
    button.style.left = "8px";
    button.style.fontSize = "22px";
    button.style.fontWeight = "1000";
    button.style.height = "23px";
    button.style.zIndex = "2";
    button.style.display = "block";
    button.classList.add("upload_button");
    button.classList.add("noselect");
    button.id = "upload_button";
    container.append(button);
    button.addEventListener('click', clickInputButton);
}

function addInputButton() {
    var container = document.getElementById("chat");
    var input = document.createElement("input");
    input.type = "file";
    input.hidden = true;
    input.id = "upload_input";
    container.append(input);
    document.getElementById('upload_input').addEventListener('change', getBase64);
}

function clickInputButton() {
    document.getElementById("upload_input").click();

}

function addSpinner() {
    var container = document.getElementById("chat");
    var spinner = document.createElement("div");
    var doublebounce1 = document.createElement("div");
    var doublebounce2 = document.createElement("div");
    spinner.id = "upload_spinner";
    spinner.classList.add("spinner");
    doublebounce1.classList.add("double-bounce1");
    doublebounce2.classList.add("double-bounce2");

    spinner.append(doublebounce1);
    spinner.append(doublebounce2);
    container.append(spinner);

}

function initialize() {
    changePlugCss();
    insertCustomCss();
    addInputButton();
    addUploadButton();
    addSpinner();
}

function getBase64() {
    var file = document.getElementById("upload_input").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

        uploadImage(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };

}

(function() {
    'use strict';
    var loaded = false;

    var a = {
        b: function() {
            if (typeof API !== 'undefined' &&  API.enabled) {
                this.c();
            }
            else if (!loaded) {
                setTimeout(function() { a.b(); }, 1000);
            }
        },
        c: function() {
            loaded = true;
            console.log('Plug.dj image upload activated!');
            API.chatLog('Plug.dj image upload AutoLoad enabled!');
            initialize();
        }
    };
    a.b();

})();

