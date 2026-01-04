// ==UserScript==
// @name         Token Gatling
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Token walls on Chaturbate!
// @author       Hugh G Reksean
// @match        https://chaturbate.com/*
// @match        https://www.testbed.cb.dev/*
// @icon         https://static-assets.highwebmedia.com/favicons/favicon.ico
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476412/Token%20Gatling.user.js
// @updateURL https://update.greasyfork.org/scripts/476412/Token%20Gatling.meta.js
// ==/UserScript==

var testing=false;

(function() {
    'use strict';
    window.addEventListener('load', function() {
        let shenanigans = document.createElement("div");
        shenanigans.style.display="inline-block";
        shenanigans.style.height="100%";
        shenanigans.style.float="right";
        shenanigans.style.padding="8px";
        let line1 = document.createElement("div");
        shenanigans.appendChild(line1);
        let line2 = document.createElement("div");
        shenanigans.appendChild(line2);
        let lTokens=document.createElement("div");
        lTokens.textContent="💸";
        lTokens.style.padding="5px";
        lTokens.style.marginTop="0";
        lTokens.style.display="inline-block";
        line1.appendChild(lTokens);
        let tokens=document.createElement("input");
        tokens.className = "sendTipButton";
        tokens.value=1;
        tokens.type="number";
        tokens.id="tokens";
        tokens.name="number";
        tokens.min=1;
        tokens.max=1000;
        tokens.style.padding="5px";
        tokens.style.marginTop="0";
        line1.appendChild(tokens);
        let lCount=document.createElement("div");
        lCount.textContent="#";
        lCount.style.padding="5px";
        lCount.style.marginTop="0";
        lCount.style.display="inline-block";
        line1.appendChild(lCount);
        let count=document.createElement("input");
        count.className = "sendTipButton";
        count.value=1;
        count.type="number";
        count.id="count";
        count.name="count";
        count.min=1;
        count.max=1000;
        count.style.padding="5px";
        count.style.marginTop="0";
        line1.appendChild(count);
        let lTime=document.createElement("div");
        lTime.textContent="⏲";
        lTime.style.padding="5px";
        lTime.style.marginTop="0";
        lTime.style.display="inline-block";
        line1.appendChild(lTime);
        let time=document.createElement("input");
        time.className = "sendTipButton";
        time.value=100;
        time.type="number";
        time.id="time";
        time.name="time";
        time.min=50;
        time.max=3600000;
        time.style.padding="5px";
        time.style.marginTop="0";
        line1.appendChild(time);
        let cbAnon=document.createElement("input");
        cbAnon.className = "sendTipButton";
        cbAnon.type="checkbox";
        cbAnon.style.float="left";
        cbAnon.id="cbAnon";
        cbAnon.name="cbAnon";
        cbAnon.style.display="inline-block";
        cbAnon.style.padding="5px";
        cbAnon.style.marginTop="8px";
        cbAnon.style.width="3%";
        line2.appendChild(cbAnon);
        let list=document.createElement("input");
        list.className = "sendTipButton";
        list.type="text";
        list.style.float="left";
        list.id="list";
        list.name="list";
        list.style.display="inline-block";
        list.style.padding="5px";
        list.style.marginTop="8px";
        list.style.width="67%";
        line2.appendChild(list);
        let btnTokenSend=document.createElement("div");
        btnTokenSend.id="btnTokenSend";
        btnTokenSend.name="btnTokenSend";
        btnTokenSend.style.display="inline-block";
        btnTokenSend.textContent="FULL SEND";
        btnTokenSend.style.textAlign="center";
        btnTokenSend.className = "sendTipButton";
        btnTokenSend.style.padding="5px";
        btnTokenSend.style.marginTop="8px";
        btnTokenSend.style.float="right";
        btnTokenSend.style.width="22%";

        btnTokenSend.onclick=function()
        {
            let anonymous = cbAnon.checked;
            let nTime = parseInt(time.value);
            //let url = "https://chaturbate.com/tipping/send_tip" + window.location.pathname;
            let url = "https://" + window.location.hostname + "/tipping/send_tip" + window.location.pathname;
            let sList = list.value;
            let items = [];
            if (sList.trim().length === 0)
            {
                let nCount = parseInt(count.value);
                let nTokens = parseInt(tokens.value);
                items = Array(nCount).fill(nTokens);
            }
            else
            {
                items = sList.split(';').map(elem=> parseInt(elem, 10));
            }
            looper(items, url, nTime, anonymous);
        };
        line2.appendChild(btnTokenSend);
        document.getElementById("VideoPanel").children[2].append(shenanigans);
    }, false);
})();

function looper(items, url, delay, anonymous) {
    let total = items.reduce((sum, num) => sum + num);
    let count = items.length;
    if (confirm("Sending " + count + " x X tokens every " + delay + "ms\nTotal " + total + " tokens\nConfirm?")) {
        for(var ixLoop=0; ixLoop<count; ixLoop++)
        {
            var tmpTokens = items[ixLoop];
            if (testing)
            {
                console.log(ixLoop + ": " + nTokens);
            }
            else
            {
                let nTokens = tmpTokens;
                if (anonymous)
                {
                    setTimeout(function() { $.post(url, {'csrfmiddlewaretoken':$.cookie('csrftoken'), tip_amount: nTokens, tip_type: 'anonymous'})}, ixLoop*delay);
                }
                else
                {
                    setTimeout(function() { $.post(url, {'csrfmiddlewaretoken':$.cookie('csrftoken'), tip_amount: nTokens})}, ixLoop*delay);
                }
            }
        }
    }
}