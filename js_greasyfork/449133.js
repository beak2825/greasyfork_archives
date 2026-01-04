// ==UserScript==
// @name Rainbow UI 🌈 | Ad Block 🛑 | Better Map 🗺 | Show Ping 🏓 | And More … | MooMoo.IO
// @namespace -
// @version 1.3.4
// @description Rainbow UI, ad block, better map, always show ping, start with extra resources, and more for moomoo.io.
// @author NotYou
// @match https://moomoo.io/*
// @match https://*.moomoo.io/*
// @match http://moomoo.io/*
// @match http://*.moomoo.io/*
// @run-at document-body
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/449133/Rainbow%20UI%20%F0%9F%8C%88%20%7C%20Ad%20Block%20%F0%9F%9B%91%20%7C%20Better%20Map%20%F0%9F%97%BA%20%7C%20Show%20Ping%20%F0%9F%8F%93%20%7C%20And%20More%20%E2%80%A6%20%7C%20MooMooIO.user.js
// @updateURL https://update.greasyfork.org/scripts/449133/Rainbow%20UI%20%F0%9F%8C%88%20%7C%20Ad%20Block%20%F0%9F%9B%91%20%7C%20Better%20Map%20%F0%9F%97%BA%20%7C%20Show%20Ping%20%F0%9F%8F%93%20%7C%20And%20More%20%E2%80%A6%20%7C%20MooMooIO.meta.js
// ==/UserScript==

// You can change "false" to "true" (without quotes)
const modConfig = {
    rainbowObjects: true,
    invertColors: false
}

// Do NOT edit code below

const extra = function() {
    const getResources = window.follmoo

    if(getResources) {
        getResources()
    }
}
const style = document.createElement('style')
style.appendChild(document.createTextNode(`
:root {
  --w: rgb(255, 255, 255);
  --b: rgb(19, 19, 19);
  --f: rgb(9, 9, 9);
  --b-t: rgba(0, 0, 0, 0.6);
  --f-t: rgba(0, 0, 0, 0.8);
}

/* AD BLOCK */

#adCard, #menuContainer > :last-child, #promoImgHolder, #pre-content-container, #ot-sdk-btn-floating, #moomooio_728x90_home, #moomooio_300x250_1,

/* COOKIE BLOCK */

#onetrust-consent-sdk

{
  display: none !important;
}

/* RAINBOW UI */

#serverBrowser, #vipServerBrowser, .menuCard, #linksContainer2 {
  background-color: var(--b);
}

#loadingText, #diedText, #gameName, #partyButton, #youtuberOf, #pingDisplay, #ageText, #linksContainer2, #enterGame span, #nameInput, .material-icons {
  color: var(--f);
}

#ageBody, #actionBar *, #resDisplay *, #upgradeHolder *, #mapDisplay, #topInfoHolder, #killCounter, .uiElement, #ageBar, #storeHolder, .storeTab, #allianceHolder, #allianceManager *, #chatBox, .notifButton {
  background-color: var(--f-t) !important;
}

.uiElement.gameButton:hover, #actionBar *:hover, #upgradeHolder *:hover, .storeTab:hover, .notifButton:hover {
  background-color: var(--b-t);
}

#menuCardHolder[style*="block"] {
  display: grid !important;
}

#rightCardHolder, #guideCard {
  height: 147px;
}

.menuCard {
  box-shadow: var(--f) 0 7px;
}

.menuCard * {
  color: var(--w);
}

#serverBrowser, #vipServerBrowser {
  border: 1px solid var(--f);
}

#gameName {
  text-shadow:
    var(--b) 0px 1px 0px,
    var(--b) 0px 2px 0px,
    var(--b) 0px 3px 0px,
    var(--b) 0px 4px 0px,
    var(--b) 0px 5px 0px,
    var(--b) 0px 6px 0px,
    var(--b) 0px 7px 0px,
    var(--b) 0px 8px 0px,
    var(--b) 0px 9px 0px;
}

#ageBarBody {
  background-color: red;
}

#gameUI .material-icons, .joinAlBtn {
  color: red !important;
}

#enterGame, #joinPartyButton, #ageBarBody, #gameUI .material-icons, .joinAlBtn, a {
  animation: 5s infinite linear both normal rainbow;
}

@keyframes rainbow {
  0% { filter: hue-rotate(0deg) }
  100% { filter: hue-rotate(360deg) }
}

/* OTHER */

#mapDisplay {
  background-image: url(data:image/png;base64,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) !important;
  background-size: contain !important;
}

#topInfoHolder {
  border-radius: 3px;
}

#pingDisplay {
  display: block;
}

#vipServerBrowser {
  width: 100%;
  height: 24px;
}

/* MODIFICATIONS */

${modConfig.invertColors ? `
#gameCanvas {
  -webkit-filter: invert(1);
  filter: invert(1);
}
`: ''}

`))
document.head.appendChild(style)

window.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.querySelector('#mainMenu')

    CanvasRenderingContext2D.prototype._rotate = CanvasRenderingContext2D.prototype.rotate

    const discord = document.querySelector('#linksContainer2 [href*="discord"]')
    discord.href = '//greasyfork.org/scripts/449133'
    discord.innerHTML = 'Rainbow UI'

    // Always show ping
    mainMenu.insertAdjacentElement('beforebegin', document.querySelector('#pingDisplay'))

    // Extra Resources
    ;(function() {
        extra()

        const obs = new MutationObserver(extra)
        obs.observe(document.querySelector('#diedText'), {
            childList: true,
            subtree: true,
        })
    })()

    // VIP Servers
    ;(function() {
        document.querySelector('#altServer').insertAdjacentHTML('afterend', '<div class="menuHeader" style="margin-top:10px">VIP Servers</div><select id="vipServerBrowser"><option selected="" disabled>Select Server</option></select>')

        const serverBrowserSelector = '#serverBrowser > select'
        let serverBrowser = document.querySelector(serverBrowserSelector)
        const vipServerBrowser = document.querySelector('#vipServerBrowser')
        const obs = new MutationObserver(() => {
            if (!serverBrowser) {
                serverBrowser = document.querySelector(serverBrowserSelector)
                return
            }

            const servers = Array.from(serverBrowser.children).filter(e => e.textContent.includes('[0/'))

            if(servers.length > 1) {
                servers.forEach(e => {
                    e = e.cloneNode(true)
                    e.textContent = e.textContent.split(' [')[0]
                    vipServerBrowser.insertAdjacentElement('beforeend', e)
                })

                vipServerBrowser.addEventListener('click', e => {
                    const value = e.target.value

                    if(value.includes(':')) {
                        location.replace(location.origin + '/?server=' + value)
                    }
                })

                obs.disconnect()
            }
        })

        obs.observe(mainMenu, {
            childList: true,
            subtree: true,
        })
    })()

    // Rainbow Objects

    if(modConfig.rainbowObjects) {
        let deg = 0
        let i = 0

        CanvasRenderingContext2D.prototype.rotate = function(e) {
            this._rotate(e)
            this.filter = `hue-rotate(${deg}deg)`

            if (i === 1) {
                deg++
            }

            i++

            deg %= 360
            i %= 2
        }
    }
})




















