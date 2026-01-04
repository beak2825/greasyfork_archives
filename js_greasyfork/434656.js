// ==UserScript==
// @name         cammedia open in main window
// @namespace    https://www2.cammedia.com/1/chat/profile/copernicus
// @version      1.0
// @description  links multiple cammedia tabs so profile buttons (send im, watch) work when in a separate tab
// @author       You
// @match        https://www2.cammedia.com/*/chat.html*
// @match        https://www2.cammedia.com/1/*/profile/*
// @match        https://www2.cammedia.com/1/*/members/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434656/cammedia%20open%20in%20main%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/434656/cammedia%20open%20in%20main%20window.meta.js
// ==/UserScript==


// libarary functions
function waitFor(checkFn, checkFrequencyMs, timeoutMs) {
    const startTimeMs = Date.now();
    return new Promise((res,rej)=>{
        const f = ()=>{
            const v = checkFn()
            if(v !== undefined && v !== false){
                return res(v);
            }
            if(timeoutMs && Date.now() - startTimeMs > timeoutMs) {
                return rej(new Error("Timeout exceeded"))
            }
            setTimeout(f, checkFrequencyMs)
        }
        setTimeout(f,0)
    })
}


// running on profile pages
// see them by going to: https://www2.cammedia.com/1/chat/members/my_account.php
(async function() {
    'use strict';
    const re = /^https:\/\/www2.cammedia.com\/1\/[^/]*\/(profile|members)\/.*/
    if(!re.test(window.location.toString())) return;

    const channel = new BroadcastChannel('chat-app');

    // document.getElementById("btn_sendIM")
    //     .addEventListener('click',(ev)=>{
    //         channel.postMessage(["popCon",[window.user, ev.target.getAttribute("data-imhost")]]);

    // })

    await waitFor(()=>window.$, 50, 500)
    let $ = window.$
    let ch = (ev) => {
        let room = ev.target.getAttribute("data-room")
        channel.postMessage(["goRoom",[room]]);

    }
    await waitFor(()=>$("#c_go").length > 0 || $(".c_go").length > 0, 10, 300)
    $("#c_go").click(ch)
    $(".c_go").click(ch)

    // initialize if it doesn't exist
    window.IMChat = window.IMChat || {};
    window.IMChat.popCon = window.IMChat.popCon || ((r, e, t) => {
        channel.postMessage(["popCon",[r, e, t]]);

    });

})();


// running against chat app
(async function() {
    'use strict';
    const re = /^https:\/\/www2.cammedia.com\/[^/]*\/chat.html.*/
    if(!re.test(window.location.toString())) return;
    // initialize if it doesn't exist
    if(!window.IMChat) window.IMChat = {}
    const channel = new BroadcastChannel('chat-app');


    await waitFor(()=>window.IMChat, 100, 120000)

    channel.addEventListener ('message', (event) => {
        let cmd = event.data[0]
        let args = event.data[1]
        switch (cmd) {
            case "popCon":
                window.IMChat.popCon.apply(window.IMChat, event.data[1])
                break;
            case "goRoom":
                window.$("#" + args[0].replace(/ /g, "_")).click()
        }
    });

    await waitFor(()=>window.ModalBrowser, 50, 120000)
    window.ModalBrowser.ipop = (url)=> {
      window.open(url,"_blank")
    }


})();