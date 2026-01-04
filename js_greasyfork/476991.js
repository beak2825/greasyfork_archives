// ==UserScript==
// @name        MooMoo.io - 1.8.0 Weapon Variant Progress
// @author      Kooky Warrior
// @description View your weapon evolving on actionbar.
// @version     1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/999838
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476991/MooMooio%20-%20180%20Weapon%20Variant%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/476991/MooMooio%20-%20180%20Weapon%20Variant%20Progress.meta.js
// ==/UserScript==

;(async () => {
    unsafeWindow.weaponVariantProgress = true

    document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style")
        style.innerText = `
		.weaponVariantBar {
			margin-top: 63px;
			height: 3px;
			border-radius: 4px;
		}

		@media only screen and (max-width: 896px) {
			.weaponVariantBar {
				margin-top: 41px;
			}
		}
		`

        document.head.appendChild(style)
    })

    let init = false,
        playerSID,
        weaponXP = {},
        weaponIndex,
        resources = {},
        pps = {},
        PPS = 0,
        lastPPSTime = 0
    await new Promise(async (resolve) => {
        let { send } = WebSocket.prototype

        WebSocket.prototype.send = function (...x) {
            send.apply(this, x)
            this.send = send
            this.iosend = function (...datas) {
                const [packet, ...data] = datas
                this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))))
            }
            if (!init) {
                init = true
                this.addEventListener("message", (e) => {
                    if (!e.origin.includes("moomoo.io") && unsafeWindow.privateServer) return
                    const [packet, data] = msgpack.decode(new Uint8Array(e.data))
                    switch (packet) {
                        case "C":
                            playerSID = data[0]
                            break
                        case "D":
                            if (data[1]) {
                                weaponXP = {}
                                weaponVariant = {}
                                const moofoll = localStorage.getItem("moofoll")
                                resources = {
                                    food: moofoll ? 100 : 0,
                                    stone: moofoll ? 100 : 0,
                                    wood: moofoll ? 100 : 0,
                                    points: moofoll ? 100 : 0
                                }
                                for (let i = 0; i < 16; i++) {
                                    waitForElm("#variantBar" + i).then((element) => {
                                        element.style.width = "0%"
                                    })
                                }
                            }
                        case "H":
                            for (var i = 0; i < data[0].length; i += 8) {
                                if (data[0][i + 7] === playerSID) {
                                    if (data[0][i + 6] === 10) {
                                        PPS += 1
                                        pps[data[0][i]] = 1
                                    } else if (data[0][i + 6] === 11) {
                                        PPS += 1.5
                                        pps[data[0][i]] = 1.5
                                    } else if (data[0][i + 6] === 12) {
                                        PPS += 2
                                        pps[data[0][i]] = 2
                                    }
                                }
                            }
                            break
                        case "Q":
                            if (pps[data[0]] != null) {
                                PPS -= pps[data[0]]
                                delete pps[data[0]]
                            }
                            break
                        case "a":
                            for (let i = 0; i < data[0].length; i += 13) {
                                if (data[0][i] === playerSID) {
                                    weaponIndex = data[0][i + 5]
                                    if (weaponXP[weaponIndex] < unsafeWindow.config.weaponVariants[data[0][i + 6]].xp) {
                                        weaponXP[weaponIndex] = unsafeWindow.config.weaponVariants[data[0][i + 6]].xp
                                        updateStyleWidth(weaponIndex)
                                    } else if (weaponXP[weaponIndex] >= unsafeWindow.config.weaponVariants[data[0][i + 6] + 1]?.xp) {
                                        weaponXP[weaponIndex] -= weaponXP[weaponIndex] - unsafeWindow.config.weaponVariants[data[0][i + 6] + 1].xp + 100
                                        updateStyleWidth(weaponIndex)
                                    }
                                    break
                                }
                            }
                            break
                        case "N":
                            if (data[0] === "kills") break
                            const tmpIndex = weaponIndex
                            if (weaponXP[tmpIndex] == null) weaponXP[tmpIndex] = 0
                            const resDiff = data[1] - resources[data[0]]
                            if (resDiff > 0) {
                                if (data[0] === "points" && [Math.ceil(PPS), Math.floor(PPS)].includes(resDiff) && Date.now() - lastPPSTime > 800) {
                                    lastPPSTime = Date.now()
                                    resources[data[0]] = data[1]
                                    updateStyleWidth(tmpIndex)
                                    break
                                } else if (data[0] === "points" && resDiff >= 100) {
                                    resources[data[0]] = data[1]
                                    updateStyleWidth(tmpIndex)
                                    break
                                }
                                weaponXP[tmpIndex] += resDiff
                            }
                            resources[data[0]] = data[1]
                            updateStyleWidth(tmpIndex)
                            break
                    }
                })
            }
            resolve(this)
        }
    })

    function waitForElm(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true
			})
        })
    }

    for (let i = 0; i < 16; i++) {
        waitForElm("#actionBarItem" + i).then((parent) => {
            const element = document.createElement("div")
			element.id = "variantBar" + i
            element.className = "weaponVariantBar"
            parent.appendChild(element)
        })
    }

    function updateStyleWidth(tmpIndex) {
    let tmpStyle;
    let tmpWidth;
    if (weaponXP[tmpIndex] >= 12000) {
        tmpStyle = "none";
        tmpWidth = 0;
    } else if (weaponXP[tmpIndex] >= 7000) {
        tmpStyle = "#fff";
        tmpWidth = ((weaponXP[tmpIndex] - 7000) / 5000) * 100;
    } else if (weaponXP[tmpIndex] >= 3000) {
        tmpStyle = "#fff";
        tmpWidth = ((weaponXP[tmpIndex] - 3000) / 4000) * 100;
    } else if (weaponXP[tmpIndex] >= 0) {
        tmpStyle = "#fff";
        tmpWidth = (weaponXP[tmpIndex] / 3000) * 100;
    }

    const barElement = document.getElementById("variantBar" + tmpIndex);
    barElement.style.width = tmpWidth + "%";
    barElement.style.backgroundColor = tmpStyle;
}
})()