// ==UserScript==
// @name         Get info
// @namespace    https://www.youtube.com/channel/UCC4Q28czyJPjSPtYQerbPGw
// @version      1.1.0
// @description  Get info from people near to you.
// @author       Demostanis
// @match        http://zombs.io/*
// @discord      https://discord.gg/CcAgabU
// @downloadURL https://update.greasyfork.org/scripts/381431/Get%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/381431/Get%20info.meta.js
// ==/UserScript==

class GetInfo {
        constructor() {}

        init() {
                this.SendChatMessage(atob("U2NyaXB0IG1hZGUgYnkgRGVtb3N0YW5pcyBodHRwczovL2Rpc2NvcmQuZ2cvQ2NBZ2FiVQ=="), "Global")

                setTimeout(() => {
                        const lastMessage = this.GetLastMessage(),
                                style = document.createElement("style"),
                                disabledInfo = [
                                        "aimingYaw",
                                        "availableSkillPoints",
                                        "baseSpeed",
                                        "collisionRadius",
                                        "damage",
                                        "energy",
                                        "energyRegenerationRate",
                                        "entityClass",
                                        "experience",
                                        "firingTick",
                                        "hatName",
                                        "height",
                                        "interpolatedYaw",
                                        "isBuildingWalking",
                                        "isInvulnerable",
                                        "isPaused",
                                        "lastDamage",
                                        "lastDamageTarget",
                                        "lastDamageTick",
                                        "lastPetDamage",
                                        "lastPetDamageTarget",
                                        "lastPetDamageTick",
                                        "level",
                                        "maxEnergy",
                                        "maxHealth",
                                        "model",
                                        "msBetweenFires",
                                        "reconnectSecret",
                                        "slowed",
                                        "speedAttribute",
                                        "startChargingTick",
                                        "stunned",
                                        "weaponName",
                                        "weaponTier",
                                        "width",
                                        "yaw",
                                        "zombieShieldHealth",
                                        "zombieShieldMaxHealth"
                                ]

                        style.innerHTML = ".hud-chat .hud-chat-message { white-space: normal; } .hud-chat-messages { resize: both; }"

                        document.head.appendChild(style)

                        Game.currentGame.network.addEntityUpdateHandler(e => {
                                const entities = Game.currentGame.world.entities

                                let HTML = ""

                                Object.keys(entities).forEach((t, i) => {
                                        const entity = entities[t].fromTick

                                        if (entity.entityClass !== "PlayerEntity") return

                                        Object.keys(entity).forEach((prop, index) => {
                                                if (disabledInfo.indexOf(prop) >= 0) return

                                                if (entity[prop].x && entity[prop].y) {
                                                        HTML += `<p>${prop}: ${entity[prop].x}, ${entity[prop].y}</p>`
                                                } else {
                                                        HTML += `<p>${prop}: ${entity[prop]}</p>`
                                                }
                                        })

                                        HTML += "<hr>"
                                })

                                lastMessage.innerHTML = HTML
                        })
                }, 1000)
        }

        SendChatMessage(msg, channel) {
                Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: channel,
                        message: msg
                })
        }

        SendFakeChatMessage(name, msg) {
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                        displayName: name,
                        message: msg
                })
        }

        GetLastMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.pop.call(messagesArray)
        }

        GetFirstMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.shift.call(messagesArray)
        }
}

if (!Game.currentGame.world.inWorld) Game.currentGame.network.addEnterWorldHandler(() => new GetInfo().init())
else new GetInfo().init()