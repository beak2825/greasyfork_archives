// ==UserScript==
// @name         Poe on Zoom
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  Poe in Zoom
// @author       You
// @match        https://pwa.zoom.us/wc/team-chat
// @match        https://app.zoom.us/wc/team-chat
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoom.us
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/471482/Poe%20on%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/471482/Poe%20on%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timeIntv = 250;
    const step = 200;
    var msgPointer = 0;

    function poe_send(txt){
        document.querySelector("textarea[class^='GrowingTextArea_textArea__']").value = txt;
        document.querySelector("button[class*='ChatMessageInputContainer_sendButton_']").click();
        msgPointer = 0;
    }

    function poe_getLast() {
        const msgList = document.querySelectorAll("div[class*='ChatMessage_messageWrapper']");
        const lastMsg = msgList[msgList.length-1];
        return lastMsg;

    }

    function poe_getLastMsg() {
        return poe_getLast().innerText;
    }

    function poe_isLastMsgByHuman() {
        return poe_getLast().className.includes("humanMessage");
    }

    function poe_isFinished() {
        if (document.querySelector("button[class*='ChatStopMessageButton_stopButton']") == void 0) {
            if (poe_getLast().childNodes[0].childNodes[0].childNodes[0].className.includes("botMessageBubble")) {
                if (poe_getLastMsg() != "...") return true;
            }
        }
        return false;
    }

    function poe_isFailed() {
        if (poe_getLast().innerText.includes("Message failed to send.")) return true;
        return false;
    }

    function poe_hasNext() {
        return !poe_isLastMsgByHuman() && (poe_getLastMsg().length - msgPointer) >= step;
    }

    function poe_getNext() {
        const retVal = poe_getLastMsg().substring(msgPointer, msgPointer + step);
        msgPointer += step;
        return retVal;
    }

    function zoom_checkNewMsg() {
        function getMsgCnt() { return document.querySelectorAll("div[class*=_textContent_]").length; }
        function readMsg() { return document.querySelectorAll("div[class*=_textContent_]")[getMsgCnt()-1].innerText; }
        function isLastMsgMine() {
            const nameTag = document.querySelectorAll("div[class*=_sender_]");
            if (nameTag[nameTag.length-1].innerText == "You") return true;
            return false;
        }


        setInterval(()=>{
            console.log(`isLastMsgMine(): ${isLastMsgMine()}; mutex: ${GM_getValue("mutex")}`);
            if (!isLastMsgMine() && GM_getValue("mutex") == '0') {
                triggerPoe(readMsg())
                GM_setValue("mutex", '1');
            }
        }, timeIntv)
    }

    function zoom_send(txt) {
        document.querySelector("div.ProseMirror[contenteditable='true']").innerHTML = txt;
        setTimeout(() => {
            document.querySelector("button[data-testid='send_btn']").click();
        }, 10);
    }

    function triggerPoe(txt) {
        console.log("Triggered: " + txt);
        GM_setValue("msg", txt);
    }

    function isGPT4() {
        if (document.querySelector("p[class*=ChatHeader_subText]").innerText.includes("Claude-2")) return true;
        if (document.querySelector("p[class*=ChatHeader_subText]").innerText.includes("GPT-4")) return true;
        return false;
    }

    function isGPT4Protocol(msg) {
        if (msg.indexOf("GTTPS://") == 0) return true;
        return false;
    }

    function removeGPT4Protocol(msg) {
        if (isGPT4Protocol(msg)) return msg.replace("GTTPS://", "");
        return msg;
    }

    function passMsg(msg) {
        GM_setValue("msg", msg);
        GM_setValue("mutex", "0");
    }

    function addRunningFlag() {
        GM_setValue("running", "1");
    }

    function removeRunningFlag() {
        GM_setValue("running", "0");
    }

    function isRunning() {
        return GM_getValue("running") === "1";
    }

    function spaceCompensate(msg) {
        var ret = msg;
        if (msg[0] === " ") ret = "𝄽" + msg.substring(1);
        else if (msg[0] === "\n") ret = "♭" + msg.substring(1);

        if (msg[msg.length-1] === " ") ret = ret.substring(0, ret.length-1) + "𝄽";
        else if (msg[msg.length-1] === "\n") ret = ret.substring(0, ret.length-1) + "♭";
        return ret;
    }

    if (location.href.includes("poe.com")) {
        GM_setValue("mutex", "0");
        removeRunningFlag();
        GM_addValueChangeListener("mutex", function(key, oldVal, newVal, remote) {
            console.log(`isRunning: ${isRunning()}`);
            if (isRunning()) return;
            console.log(`Key: ${key}, Old: ${oldVal}, New: ${newVal}, Remote: ${remote}`);
            if (newVal != "1") return;
            const msg = GM_getValue("msg");
            if (isGPT4Protocol(msg) && !isGPT4()) return; // is GPT4 msg but not GPT4
            if (!isGPT4Protocol(msg) && isGPT4()) return; // not GPT4 msg but GPT4
            if (msg != "WAITMSG") poe_send(removeGPT4Protocol(msg));
            // else return;
            addRunningFlag();
            var intv = setInterval(()=>{
                if (poe_hasNext()) {
                    passMsg(spaceCompensate(poe_getNext()));
                } else if (poe_isFinished()) {
                    passMsg(spaceCompensate(poe_getNext()) + "𝄻♮♮\n" + poe_getLastMsg() + "𝄻");
                    clearInterval(intv);
                    removeRunningFlag();
                } else if (poe_isFailed()) {
                    passMsg("Failed!")
                    clearInterval(intv);
                    removeRunningFlag();
                }
            }, timeIntv);
        });
    }

    if (location.href.includes("zoom.us")) {
        zoom_checkNewMsg();
        GM_addValueChangeListener("mutex", function(key, oldVal, newVal, remote) {
            console.log(`Key: ${key}, Old: ${oldVal}, New: ${newVal}, Remote: ${remote}`);
            if (oldVal == "1" && newVal == "0") {
                const msgToBeSent = '<p style="margin-left: 0px">' + GM_getValue("msg").replaceAll("\n", '</p><p style="margin-left: 0px">') + "</p>";
                console.log(msgToBeSent);
                zoom_send(msgToBeSent);
                if (msgToBeSent.indexOf("𝄻") == -1) {
                    GM_setValue("msg", "WAITMSG");
                    GM_setValue("mutex", "1");
                }
            }
        });
    }


})();