// ==UserScript==
// @name         auto get image url
// @namespace    discord
// @version      0.1.1
// @description  small tool auto get image url
// @author       NguyenKhong
// @license      MIT
// @match        https://discord.com/channels/*
// @icon         https://discord.com/assets/ec2c34cadd4b5f4594415127380a85e6.ico
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452240/auto%20get%20image%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/452240/auto%20get%20image%20url.meta.js
// ==/UserScript==
// ==/UserScript==

const console_log = window.console.log;
window.console.log = function(){
    console_log(`%c[DEBUG] %c${(new Date()).toLocaleString("vi-VN")}:`, "color: red", "color: unset", ...arguments);
}

let config = {
    signal_start: "start",
    signal_end: "end"
}

const START = 0;
const END = 1;

let attachment = {
    state: END,
    urls: []
}

let urls = [];

function interceptWebsocketDecode(){
    Object.defineProperty(Object.prototype, "onData", {
        set: function(value){
            if (this.constructor.toString().includes("inflateGetHeader")){
                this._onData = function(){
                    if(arguments.length){
                        window.dispatchEvent(new CustomEvent("discordMessage", {detail: {message: arguments[0]}}));
                    }
                    return value.apply(this, arguments);
                }
            }else{
                this._onData = value;
            }
        },
        get: function(){
            return this._onData;
        }
    },
    {
        configurable: true,
        writable: false,
    });
}

if(!unsafeWindow.has_intercept_websocket){
    interceptWebsocketDecode();
    unsafeWindow.has_intercept_websocket = true;
}

function createFile(text){
    let link = document.createElement("a");
    link.setAttribute("download", "urls.txt");
    link.href = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
    link.dispatchEvent(new MouseEvent("click"));
}

window.addEventListener("discordMessage", function(event){
    let message = event.detail.message;
    //console.log("message:", message);
    try{
        message = JSON.parse(message);
        console.log("message:", message);
    }catch(e){
        //console.error("Json parse error", e);
        return;
    }
    if(message?.t == "MESSAGE_CREATE"){
        let msg_data = message.d;
        if (msg_data.content){
            let content = msg_data.content;
            if(content === config.signal_start){
                attachment.state = START;
            }else if (content === config.signal_end){
                if (msg_data.attachments.length !== 0){
                    for(let attach of msg_data.attachments){
                        attachment.urls.push(attach.url);
                    }
                }
                attachment.state = END;
                let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});
                let urls = attachment.urls.sort(function(a, b){
                    a = a.split("/").pop();
                    b = b.split("/").pop();
                    return collator.compare(a, b);
                });
                let url_str = urls.join("\n");
                createFile(url_str);
                attachment.urls = [];
            }

        }else if (msg_data.attachments.length !== 0 && attachment.state === START){
            for(let attach of msg_data.attachments){
                attachment.urls.push(attach.url);
            }
        }
    }
});