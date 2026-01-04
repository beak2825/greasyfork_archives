// ==UserScript==
// @name         Discord Token Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Easily get your discord account token. (DO NOT SHARE)
// @author       mopsfl
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450651/Discord%20Token%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/450651/Discord%20Token%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var token = null

    var menu = document.createElement("div")
    menu.innerHTML = `<div id="tkn-mn" style="position:absolute;background-color:#242428;width:auto;z-index:1000;top:50%;border-radius:4px;padding:15px;outline:solid 1px #181818"><h3 class="defaultColor-24IHKz defaultColor-HXu-5n heading-md-medium-2DVCeJ title-17SveM"data-text-variant=heading-md/medium style="margin-bottom:10px;border-bottom:solid 1px #3e3e3e">Token Fetcher - by mopsfl</h3><div class=buttonsContainer-12kYno><div class=buttonsContainer-12kYno><button class="button-f2h6uQ grow-2sR_-F sizeSmall-wU2dO- lookFilled-yCfaCM colorGreen-3y-Z79 shinyButton-2Q9MDB"id=get-tkn type=button><div class="contents-3ca1mk premiumUpsellButtonInner-2W8WFG">Fetch Token<div class="buttonShine-p5V5TB shineContainer-NmlfaV shineContainerDefault-3f8X_o"><div class="flex-3BkGQD flex-3BkGQD alignCenter-14kD11 directionRow-2Iu2A9 flex-2S1XBF horizontal-112GEH horizontal-1Piu5- justifyCenter-rrurWZ noWrap-hBpHBz shine-ZNDEKg"style="flex:1 1 auto"><div class=shineInner-OI1Z2S></div></div></div></div></button> <button class="button-f2h6uQ grow-2sR_-F sizeSmall-wU2dO- lookFilled-yCfaCM colorBrand-I6CyqQ"id=cop-tkn type=button style=margin-left:5px><div class=contents-3ca1mk>Copy Token</div></button> <button class="button-f2h6uQ grow-2sR_-F sizeSmall-wU2dO- colorRed-rQXKgM lookOutlined-3yKVGo"id=tkn-hd type=button style=margin-left:5px><div class=contents-3ca1mk>Hide Token</div></button></div></div><br><div class="label-1xtMHH labelClickable-eiZOrp labelForward-2yqkcf"style=line-height:24px;overflow-x:scroll;display:inline;width:auto><span class=code-fcr4Qb id=tkn-d style=color:#fff>-</span></div></div>`
    document.getElementById("app-mount").appendChild(menu)

    function getToken() {
        window.webpackChunkdiscord_app.push([
            [Math.random()], {}, (req) => {
                for (const m of Object.keys(req.c).map((x) => req.c[x].exports).filter((x) => x)) {
                    if (m.default && m.default.getToken !== undefined) {
                        token = m.default.getToken()
                    }
                    if (m.getToken !== undefined) {
                        token = m.getToken()
                    }
                }
            }
        ]);
    }

    document.getElementById("get-tkn").addEventListener("click", () => {
        console.warn("GET TOKEN")
        getToken()
        document.getElementById("tkn-d").innerText = token
    })

    document.getElementById("cop-tkn").addEventListener("click", () => {
        if(token == null){
            document.getElementById("cop-tkn").querySelector(".contents-3ca1mk").innerText = "Fetch token first!"
            setTimeout(() => { document.getElementById("cop-tkn").querySelector(".contents-3ca1mk").innerText = "Copy Token" },2000)
            return
        }

        navigator.clipboard.writeText(token)
        document.getElementById("cop-tkn").querySelector(".contents-3ca1mk").innerText = "Copied!"

        setTimeout(() => { document.getElementById("cop-tkn").querySelector(".contents-3ca1mk").innerText = "Copy Token" },2000)
    })

    document.getElementById("tkn-hd").addEventListener("click", () => {
        token = null
        document.getElementById("tkn-d").innerText = "-"
    })

    function dragElement(e){var n=0,t=0,o=0,u=0;function m(e){(e=e||window.event).preventDefault(),o=e.clientX,u=e.clientY,document.onmouseup=l,document.onmousemove=d}function d(m){(m=m||window.event).preventDefault(),n=o-m.clientX,t=u-m.clientY,o=m.clientX,u=m.clientY,e.style.top=e.offsetTop-t+"px",e.style.left=e.offsetLeft-n+"px"}function l(){document.onmouseup=null,document.onmousemove=null}document.getElementById(e.id+"header")?document.getElementById(e.id+"header").onmousedown=m:e.onmousedown=m}dragElement(document.getElementById("tkn-mn"));
})();